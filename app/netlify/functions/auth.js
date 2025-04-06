const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
require('dotenv').config();

const app = express();

// Minimal CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://fitvice.netlify.app' 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(passport.initialize());

// Simplified strategy configuration
const configureStrategy = (Strategy, options, provider) => {
  passport.use(new Strategy(options, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        provider
      };
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
};

// Configure strategies
configureStrategy(GoogleStrategy, {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.FRONTEND_URL}/.netlify/functions/auth/google/callback`
}, 'google');

configureStrategy(GitHubStrategy, {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.FRONTEND_URL}/.netlify/functions/auth/github/callback`
}, 'github');

configureStrategy(LinkedInStrategy, {
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: `${process.env.FRONTEND_URL}/.netlify/functions/auth/linkedin/callback`,
  scope: ['r_liteprofile', 'r_emailaddress']
}, 'linkedin');

// Simplified serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Helper function to generate JWT
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
      const token = generateJWT(req.user);
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
  );
};

['google', 'github', 'linkedin'].forEach(createAuthRoutes);

// Netlify Functions handler
exports.handler = async (event, context) => {
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
      json: (data) => ({
        statusCode: code,
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }),
      redirect: (url) => ({
        statusCode: 302,
        headers: { Location: url }
      })
    })
  };

  try {
    return app.handle(req, res);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 