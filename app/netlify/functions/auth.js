const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
require('dotenv').config();

const app = express();

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://fitvice.netlify.app';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

// Validate required environment variables
const requiredEnvVars = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
  }
}

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(passport.initialize());

// Strategy configuration
const configureStrategy = (Strategy, options, provider) => {
  if (!options.clientID || !options.clientSecret) {
    console.error(`Missing credentials for ${provider} strategy`);
    return;
  }

  passport.use(new Strategy(options, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(`${provider} authentication successful for user:`, profile.id);
      const user = {
        id: profile.id,
        email: profile.emails?.[0]?.value || `${profile.id}@${provider}.com`,
        name: profile.displayName,
        provider
      };
      return done(null, user);
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      return done(error, null);
    }
  }));
};

// Configure strategies
configureStrategy(GoogleStrategy, {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${FRONTEND_URL}/.netlify/functions/auth/google/callback`
}, 'google');

configureStrategy(GitHubStrategy, {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${FRONTEND_URL}/.netlify/functions/auth/github/callback`
}, 'github');

configureStrategy(LinkedInStrategy, {
  clientID: LINKEDIN_CLIENT_ID,
  clientSecret: LINKEDIN_CLIENT_SECRET,
  callbackURL: `${FRONTEND_URL}/.netlify/functions/auth/linkedin/callback`,
  scope: ['r_liteprofile', 'r_emailaddress']
}, 'linkedin');

// Serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// JWT generation
const generateJWT = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Authentication routes
const createAuthRoutes = (provider) => {
  app.get(`/${provider}`, passport.authenticate(provider));
  app.get(`/${provider}/callback`, 
    passport.authenticate(provider, { failureRedirect: '/login' }),
    (req, res) => {
      try {
        const token = generateJWT(req.user);
        console.log(`Generated token for ${provider} user:`, req.user.id);
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
      } catch (error) {
        console.error(`Error generating token for ${provider}:`, error);
        res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
      }
    }
  );
};

['google', 'github', 'linkedin'].forEach(createAuthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Authentication error:', err);
  res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
});

// Netlify Functions handler
exports.handler = async (event, context) => {
  console.log('Auth function called with path:', event.path);
  
  const path = event.path.replace('/.netlify/functions/auth', '');
  
  const req = {
    method: event.httpMethod,
    path: path,
    query: event.queryStringParameters,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : {}
  };

  const res = {
    status: (code) => ({
      json: (data) => {
        console.log(`Response status ${code}:`, data);
        return {
          statusCode: code,
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        };
      },
      redirect: (url) => {
        console.log(`Redirecting to: ${url}`);
        return {
          statusCode: 302,
          headers: { Location: url }
        };
      }
    })
  };

  try {
    return app.handle(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
}; 