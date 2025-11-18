-- Fix consultations table foreign keys to reference profiles instead of auth.users
-- This allows proper joins in Supabase queries

-- Step 1: Drop existing foreign key constraints
ALTER TABLE public.consultations 
  DROP CONSTRAINT IF EXISTS consultations_client_id_fkey;

ALTER TABLE public.consultations 
  DROP CONSTRAINT IF EXISTS consultations_lawyer_id_fkey;

-- Step 2: Add new foreign key constraints to profiles table
ALTER TABLE public.consultations 
  ADD CONSTRAINT consultations_client_id_fkey 
  FOREIGN KEY (client_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE public.consultations 
  ADD CONSTRAINT consultations_lawyer_id_fkey 
  FOREIGN KEY (lawyer_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Step 3: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_consultations_client_id ON public.consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON public.consultations(lawyer_id);

-- Verify the foreign keys
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE 
  tc.table_name = 'consultations' 
  AND tc.constraint_type = 'FOREIGN KEY';
