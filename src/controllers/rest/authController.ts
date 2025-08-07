import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';

const prisma = new PrismaClient();

/**
 * Handle user login request.
 * Validates credentials, generates JWT, and returns user info with token.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user not found, return unauthorized
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token with selected user fields
    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      fullName: user.fullName || '',
      role: user.role,
    });

    // Update lastLogin timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Return token and user data
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    // Handle unexpected server error
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Handle user registration request.
 * Validates input, checks for duplicates, hashes password, and returns JWT with user data.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required input fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and fullName are required',
      });
    }

    // Check if user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'USER', // Default role
      },
    });

    // Generate JWT token for the newly created user
    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      fullName: user.fullName || '',
      role: user.role,
    });

    // Respond with success and user data
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    // Handle unexpected server error
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
