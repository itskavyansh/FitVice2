/**
 * Mock Authentication Service
 * Provides offline authentication capabilities when backend is unavailable
 */

// Mock user database
const MOCK_USERS = [
  {
    id: 'mock-user-1',
    email: 'demo@example.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    profilePicture: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-user-2',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    profilePicture: null,
    createdAt: new Date().toISOString(),
  }
];

// Generate JWT-like token for demo purposes
const generateMockToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'mock', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hour expiry
    iat: Date.now()
  }));
  const signature = btoa('mocksignature');
  
  return `${header}.${payload}.${signature}`;
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock login function
export const mockLogin = async (email, password) => {
  console.log('Using MOCK authentication (offline mode)');
  
  // Simulate network delay
  await delay(700);
  
  // Find user
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    console.log('Mock login: User not found');
    return {
      success: false,
      message: 'User not found. In offline mode, only demo@example.com (password: password123) and admin@example.com (password: admin123) are available.'
    };
  }
  
  // Check password (simple comparison for mock)
  if (user.password !== password) {
    console.log('Mock login: Invalid password');
    return {
      success: false,
      message: 'Invalid password. Please try again or use demo@example.com (password: password123).'
    };
  }
  
  // Generate mock token
  const token = generateMockToken(user.id);
  
  // Return success
  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profilePicture: user.profilePicture
    },
    message: 'LOGIN DEMO MODE: Successfully authenticated with mock credentials'
  };
};

// Mock signup function
export const mockSignup = async (email, password, username) => {
  console.log('Using MOCK signup (offline mode)');
  
  // Simulate network delay
  await delay(800);
  
  // Check if user already exists
  const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    console.log('Mock signup: User already exists');
    return {
      success: false,
      message: 'Email already registered'
    };
  }
  
  // Create new user
  const newUser = {
    id: `mock-user-${MOCK_USERS.length + 1}`,
    email: email,
    password: password,
    firstName: username || email.split('@')[0],
    lastName: '',
    role: 'user',
    profilePicture: null,
    createdAt: new Date().toISOString()
  };
  
  // Add to mock database
  MOCK_USERS.push(newUser);
  
  // Generate token
  const token = generateMockToken(newUser.id);
  
  // Return success
  return {
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      profilePicture: newUser.profilePicture
    },
    message: 'SIGNUP DEMO MODE: Account created with mock data'
  };
};

// Verify token function
export const mockVerifyToken = async (token) => {
  console.log('Using MOCK token verification (offline mode)');
  
  // Simulate network delay
  await delay(300);
  
  // Check if token exists
  if (!token) {
    return {
      success: false,
      valid: false,
      message: 'No token provided'
    };
  }
  
  try {
    // Parse token (crude check for demo purposes)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        success: false,
        valid: false,
        message: 'Invalid token format'
      };
    }
    
    // Parse payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiry
    if (payload.exp < Date.now()) {
      return {
        success: false,
        valid: false,
        message: 'Token expired'
      };
    }
    
    // Find user by ID
    const user = MOCK_USERS.find(u => u.id === payload.sub);
    if (!user) {
      return {
        success: false,
        valid: false,
        message: 'User not found'
      };
    }
    
    // Return success
    return {
      success: true,
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profilePicture: user.profilePicture
      }
    };
  } catch (error) {
    return {
      success: false,
      valid: false,
      message: 'Invalid token'
    };
  }
}; 