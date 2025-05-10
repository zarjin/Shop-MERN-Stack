import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModels from '../models/user.models.js';

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate input fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    if (!hashPassword) {
      return res.status(500).json({ message: 'Password hashing failed' });
    }

    // Create new user
    const newUser = await userModels.create({
      fullName,
      email,
      password: hashPassword,
      profileImage: req.file?.path, // Add optional chaining for safety
    });

    // Save New User
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    if (!token) {
      return res.status(500).json({ message: 'Token generation failed' });
    }

    // Set cookie with secure options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Return user data (excluding password)
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profileImage: newUser.profileImage,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user
    const existingUser = await userModels.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    // Return user data
    res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profileImage: existingUser.profileImage,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkAuthentication = async (req, res) => {
  try {
    // If we reach this point, it means the isAuthenticated middleware has already verified the token
    // We can access the user ID from req.user which was set by the middleware
    if (req.user && req.user.id) {
      return res.status(200).json({ Authentication: true });
    } else {
      return res
        .status(401)
        .json({ Authentication: false, message: 'User not authenticated' });
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return res
      .status(500)
      .json({ Authentication: false, error: 'Internal Server Error' });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from request

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const user = await userModels.findById(userId); // Find user by ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data (excluding password)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      cartProduct: user.cartProduct,
      fovProduct: user.fovProduct,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addCart = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Get product ID from request parameters
    const { productId } = req.params;
    if (!productId) {
      return res
        .status(400)
        .json({ error: 'Bad Request: Product ID is required' });
    }

    // Find user in database
    const user = await userModels.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add product to cart and save
    user.cartProduct.push(productId);
    await user.save();

    // Get the product details for real-time update
    const io = req.app.get('io');
    if (io) {
      // Emit to the specific user's socket
      io.emit('cart:added', {
        userId: userId,
        productId: productId,
      });
    }

    // Send success response
    res.status(200).json({
      message: 'Product added to cart successfully',
      cart: user.cartProduct,
    });
  } catch (error) {
    // Handle errors properly
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ error: 'Bad Request: Product ID is required' });
    }

    const user = await userModels.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter cart and update user
    user.cartProduct = user.cartProduct.filter(
      (product) => product.toString() !== productId
    );

    // Save the updated user
    await user.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('cart:removed', {
        userId: userId,
        productId: productId,
      });
    }

    return res.status(200).json({
      message: 'Product removed from cart successfully',
      cart: user.cartProduct,
    });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addFovProduct = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const { productId } = req.params;

    // Find user by ID
    const user = await userModels.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if productId already exists in fovProduct to avoid duplicates
    if (user.fovProduct.includes(productId)) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    // Add productId to fovProduct array
    user.fovProduct.push(productId);

    // Save the updated user
    await user.save();

    // Send success response
    return res.status(200).json({
      message: 'Product added to favorites successfully',
      fovProduct: user.fovProduct,
    });
  } catch (error) {
    console.error('Error adding product to favorites:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFovProduct = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const { productId } = req.params;

    // Find user by ID
    const user = await userModels.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.fovProduct = user.fovProduct.filter(
      (product) => product.toString() !== productId
    );

    // Save the updated user
    await user.save();

    // Send success response
    return res.status(200).json({
      message: 'Product removed to favorites successfully',
      fovProduct: user.fovProduct,
    });
  } catch (error) {
    console.error('Error removing product to favorites:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const isAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await userModels.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isAdmin = true;
    await user.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('user:admin-updated', {
        userId: user._id,
        email: user.email,
        isAdmin: true,
      });
    }

    res.status(200).json({ message: 'User promoted to admin successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (for admin panel)
export const getAllUsers = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const requestingUser = await userModels.findById(userId);
    if (!requestingUser || !requestingUser.isAdmin) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }

    // Fetch all users
    const users = await userModels.find().select('-password');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
