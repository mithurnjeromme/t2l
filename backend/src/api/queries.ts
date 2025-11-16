import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

/**
 * Submit a new client query
 * This stores the query in Supabase with user details
 */
router.post('/submit-query', async (req: Request, res: Response) => {
  try {
    const { query, timestamp, userId } = req.body;

    // Validate input
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query text is required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user details from profiles table
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('full_name, email, phone, user_type')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Insert query into client_queries table
    const { data: insertedQuery, error: insertError } = await supabase
      .from('client_queries')
      .insert([{
        user_id: userId,
        query_text: query,
        user_name: userProfile.full_name,
        user_email: userProfile.email,
        user_phone: userProfile.phone || null,
        status: 'pending', // pending, in_progress, resolved
        submitted_at: timestamp || new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting query:', insertError);
      
      // If table doesn't exist, return a helpful error
      if (insertError.code === '42P01') {
        return res.status(500).json({
          success: false,
          error: 'Database table not configured. Please contact support.',
          details: 'client_queries table needs to be created in Supabase'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to submit query',
        details: insertError.message
      });
    }

    console.log('✅ Query submitted successfully:', {
      queryId: insertedQuery.id,
      userId,
      userName: userProfile.full_name
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Query submitted successfully',
      data: {
        queryId: insertedQuery.id,
        status: insertedQuery.status,
        submittedAt: insertedQuery.submitted_at
      }
    });

  } catch (error: any) {
    console.error('❌ Error in submit-query endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Get all queries for a specific user
 */
router.get('/user-queries/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: queries, error } = await supabase
      .from('client_queries')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching user queries:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch queries'
      });
    }

    res.json({
      success: true,
      data: queries || []
    });

  } catch (error: any) {
    console.error('❌ Error in user-queries endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Get all queries (admin/lawyer access)
 */
router.get('/all-queries', async (req: Request, res: Response) => {
  try {
    const { data: queries, error } = await supabase
      .from('client_queries')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching all queries:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch queries'
      });
    }

    res.json({
      success: true,
      data: queries || []
    });

  } catch (error: any) {
    console.error('❌ Error in all-queries endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router;
