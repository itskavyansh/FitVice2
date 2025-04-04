const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// In-memory user store for development without MongoDB
const inMemoryUsers = [];
let inMemoryCounter = 1;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number'],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  profilePicture: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!candidatePassword) {
      throw new Error('Password is required');
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create an in-memory version of the User model for development without MongoDB
class InMemoryUser {
  static async findOne(query) {
    if (query._id) {
      return inMemoryUsers.find(user => user._id.toString() === query._id.toString());
    } else if (query.email) {
      return inMemoryUsers.find(user => user.email === query.email);
    }
    return null;
  }

  static async findById(id) {
    return inMemoryUsers.find(user => user._id.toString() === id.toString());
  }

  constructor(userData) {
    this._id = inMemoryCounter++;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.email = userData.email;
    this.password = userData.password; // Will be hashed during save
    this.phone = userData.phone || '';
    this.bio = userData.bio || '';
    this.profilePicture = userData.profilePicture || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this._isPasswordModified = true; // Flag for first save
  }

  async save() {
    // Hash password if modified
    if (this._isPasswordModified) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      this._isPasswordModified = false;
    }
    
    // Update or insert user
    const existingUserIndex = inMemoryUsers.findIndex(user => user._id.toString() === this._id.toString());
    if (existingUserIndex >= 0) {
      inMemoryUsers[existingUserIndex] = this;
    } else {
      inMemoryUsers.push(this);
    }
    
    this.updatedAt = new Date();
    return this;
  }

  async comparePassword(candidatePassword) {
    try {
      if (!candidatePassword) {
        throw new Error('Password is required');
      }
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  }

  getPublicProfile() {
    const userObject = { ...this };
    delete userObject.password;
    delete userObject._isPasswordModified;
    return userObject;
  }

  toObject() {
    return { ...this };
  }
}

// Create a demonstration user for testing
if (process.env.USE_IN_MEMORY_DB === 'true') {
  (async () => {
    console.log('Creating demo user for in-memory database...');
    const demoUser = new InMemoryUser({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      password: 'password123',
    });
    await demoUser.save();
    console.log('Demo user created successfully:', demoUser.email);
  })();
}

// Decide which model to use based on environment
const User = process.env.USE_IN_MEMORY_DB === 'true' ? 
  InMemoryUser : 
  mongoose.model('User', userSchema);

module.exports = User; 