import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { upload, handleMulterError, getFileUrl } from '../utils/fileUpload';

const router = Router();

// Validation schemas matching your frontend signup form
const clientRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  countryCode: z.string().default('+91'),
  mobile: z.string().min(10, 'Invalid mobile number'),
  city: z.string().min(2, 'City is required'),
  legalIssue: z.string().min(1, 'Legal issue type is required'),
  userType: z.literal('client')
});

const lawyerRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  countryCode: z.string().default('+91'),
  mobile: z.string().min(10, 'Invalid mobile number'),
  barNumber: z.string().min(5, 'Bar registration number is required'),
  experience: z.string().min(1, 'Experience is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  education: z.string().min(5, 'Educational background is required'),
  courtPractice: z.string().min(2, 'Court practice location is required'),
  languages: z.string().min(2, 'Languages are required'),
  bio: z.string().min(10, 'Professional bio must be at least 10 characters'),
  consultationFee: z.string().min(1, 'Consultation fee is required'),
  userType: z.literal('lawyer')
  // profileImage now handled by multer, not in validation schema
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Helper function to generate JWT token
const generateToken = (userId: string, userType: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || '7d';
  
  return jwt.sign(
    { userId, userType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE_IN } as SignOptions
  );
};

// Register client
router.post('/register/client', async (req: Request, res: Response) => {
  try {
    const validatedData = clientRegisterSchema.parse(req.body);
    const { name, email, password, countryCode, mobile, city, legalIssue } = validatedData;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists with this email' 
      });
    }

    // Create auth user first
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_type: 'client'
        }
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to create authentication' 
      });
    }

    // Create user in database
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authUser.user?.id,
        email,
        full_name: name,
        phone: mobile,
        country_code: countryCode,
        user_type: 'client',
        city,
        legal_issue: legalIssue
      }])
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to create user account' 
      });
    }

    const token = generateToken(user.id, 'client');

    return res.status(201).json({
      success: true,
      message: 'Client account created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          userType: user.user_type,
          city: user.city,
          legalIssue: user.legal_issue
        },
        token
      }
    });

  } catch (error) {
    console.error('Client registration error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Register lawyer
router.post('/register/lawyer', upload.single('profileImage'), handleMulterError, async (req: Request, res: Response) => {
  try {
    const validatedData = lawyerRegisterSchema.parse(req.body);
    const { 
      name, email, password, countryCode, mobile, barNumber, 
      experience, specialization, education, courtPractice, 
      languages, bio, consultationFee 
    } = validatedData;

    // Get uploaded file URL if present
    let profileImageUrl: string | null = null;
    if (req.file) {
      profileImageUrl = getFileUrl(req.file.filename);
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists with this email' 
      });
    }

    // Check if bar number already exists
    const { data: existingLawyer } = await supabase
      .from('lawyer_profiles')
      .select('bar_number')
      .eq('bar_number', barNumber)
      .single();

    if (existingLawyer) {
      return res.status(400).json({ 
        success: false, 
        error: 'Bar registration number already registered' 
      });
    }

    // Create auth user first
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_type: 'lawyer'
        }
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to create authentication' 
      });
    }

    // Create user in database
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authUser.user?.id,
        email,
        full_name: name,
        phone: mobile,
        country_code: countryCode,
        user_type: 'lawyer',
        profile_image_url: profileImageUrl
      }])
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to create user account' 
      });
    }

    // Create lawyer profile
    const { data: lawyerProfile, error: profileError } = await supabase
      .from('lawyer_profiles')
      .insert([{
        user_id: user.id,
        bar_number: barNumber,
        experience_years: parseInt(experience),
        specialization,
        education,
        court_practice: courtPractice,
        languages,
        bio,
        consultation_fee: parseFloat(consultationFee),
        profile_image_url: profileImageUrl
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Lawyer profile creation error:', profileError);
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to create lawyer profile' 
      });
    }

    const token = generateToken(user.id, 'lawyer');

    return res.status(201).json({
      success: true,
      message: 'Lawyer account created successfully. Profile pending verification.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          userType: user.user_type
        },
        lawyerProfile: {
          id: lawyerProfile.id,
          barNumber: lawyerProfile.bar_number,
          specialization: lawyerProfile.specialization,
          experienceYears: lawyerProfile.experience_years,
          consultationFee: lawyerProfile.consultation_fee,
          verified: lawyerProfile.verified
        },
        token
      }
    });

  } catch (error) {
    console.error('Lawyer registration error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Get user details from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Get lawyer profile if user is a lawyer
    let lawyerProfile = null;
    if (user.user_type === 'lawyer') {
      const { data: profile } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      lawyerProfile = profile;
    }

    const token = generateToken(user.id, user.user_type);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          userType: user.user_type,
          city: user.city,
          legalIssue: user.legal_issue
        },
        lawyerProfile,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export default router;