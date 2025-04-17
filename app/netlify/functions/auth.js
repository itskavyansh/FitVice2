const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://fitvice.netlify.app' 
    : 'http://localhost:3000',
  credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

// Configure Passport strategies
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://fitvice.netlify.app/.netlify/functions/auth/google/callback'
    : 'http://localhost:3000/.netlify/functions/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create new user if they don't exist
    // 3. Generate JWT token
    // 4. Return user data
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      provider: 'google'
    };
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://fitvice.netlify.app/.netlify/functions/auth/github/callback'
    : 'http://localhost:3000/.netlify/functions/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      provider: 'github'
    };
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://fitvice.netlify.app/.netlify/functions/auth/linkedin/callback'
    : 'http://localhost:3000/.netlify/functions/auth/linkedin/callback',
  scope: ['r_liteprofile', 'r_emailaddress']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      provider: 'linkedin'
    };
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = generateJWT(req.user);
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// GitHub OAuth routes
app.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// LinkedIn OAuth routes
app.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_liteprofile', 'r_emailaddress'] }));
app.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Helper function to generate JWT
function generateJWT(user) {
  // In a real application, you should use a proper JWT library
  // This is a simplified version for demonstration
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Netlify Functions handler
exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/auth', '');
  
  // Create a mock request object
  const req = {
    method: event.httpMethod,
    path: path,
    query: event.queryStringParameters,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : {}
  };

  // Create a mock response object
  const res = {
    status: (code) => ({
      json: (data) => ({
        statusCode: code,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      redirect: (url) => ({
        statusCode: 302,
        headers: {
          Location: url
        }
      })
    })
  };

  // Route the request
  try {
    switch (path) {
      case '/google':
        return app.handle(req, res);
      case '/google/callback':
        return app.handle(req, res);
      case '/github':
        return app.handle(req, res);
      case '/github/callback':
        return app.handle(req, res);
      case '/linkedin':
        return app.handle(req, res);
      case '/linkedin/callback':
        return app.handle(req, res);
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 