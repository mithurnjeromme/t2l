-- Turn2Law Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handles both clients and lawyers) - Updated for Turn2Law signup form
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country_code VARCHAR(10) DEFAULT '+91',
    user_type VARCHAR(10) CHECK (user_type IN ('client', 'lawyer')) NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    -- Client specific fields
    city VARCHAR(100), -- Only for clients
    legal_issue VARCHAR(100), -- Only for clients
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal categories
CREATE TABLE legal_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lawyer profiles (extended info for lawyers) - Updated for Turn2Law signup form
CREATE TABLE lawyer_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bar_number VARCHAR(50) UNIQUE NOT NULL,
    experience_years INTEGER NOT NULL,
    specialization VARCHAR(100) NOT NULL, -- Single specialization from signup
    education TEXT NOT NULL,
    court_practice VARCHAR(255) NOT NULL, -- Court Practice Location
    languages VARCHAR(255) NOT NULL, -- Languages as string from signup
    bio TEXT NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL,
    profile_image_url TEXT, -- Added for image upload
    verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    total_consultations INTEGER DEFAULT 0,
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Consultations table
CREATE TABLE consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES legal_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 60,
    consultation_type VARCHAR(10) CHECK (consultation_type IN ('video', 'phone', 'chat')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_id VARCHAR(255), -- Razorpay payment ID
    meeting_link TEXT,
    client_notes TEXT,
    lawyer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(consultation_id) -- One review per consultation
);

-- Lawyer availability slots
CREATE TABLE lawyer_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lawyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages (for consultation chat)
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
    file_url TEXT,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default legal categories
INSERT INTO legal_categories (name, description, icon) VALUES
('Family Law', 'Divorce, child custody, marriage, domestic issues', 'family'),
('Criminal Law', 'Criminal defense, bail, criminal litigation', 'shield'),
('Corporate Law', 'Business law, contracts, company formation', 'briefcase'),
('Property Law', 'Real estate, property disputes, documentation', 'home'),
('Personal Injury', 'Accident claims, compensation, injury cases', 'heart'),
('Civil Litigation', 'Civil disputes, litigation, court cases', 'scale'),
('Immigration Law', 'Visa, citizenship, immigration matters', 'globe'),
('Tax Law', 'Tax planning, disputes, compliance', 'calculator'),
('Labor Law', 'Employment issues, workplace disputes', 'users'),
('Consumer Protection', 'Consumer rights, product liability', 'shield-check');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_city ON users(city); -- For client location searches
CREATE INDEX idx_lawyer_profiles_specialization ON lawyer_profiles(specialization);
CREATE INDEX idx_lawyer_profiles_court_practice ON lawyer_profiles(court_practice);
CREATE INDEX idx_lawyer_profiles_consultation_fee ON lawyer_profiles(consultation_fee);
CREATE INDEX idx_consultations_client ON consultations(client_id);
CREATE INDEX idx_consultations_lawyer ON consultations(lawyer_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_scheduled ON consultations(scheduled_at);
CREATE INDEX idx_reviews_lawyer ON reviews(lawyer_id);
CREATE INDEX idx_chat_messages_consultation ON chat_messages(consultation_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_lawyer_profiles_updated_at BEFORE UPDATE ON lawyer_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can read their own data)
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Lawyer profiles are publicly readable" ON lawyer_profiles
    FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Users can view their consultations" ON consultations
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

CREATE POLICY "Public can read public reviews" ON reviews
    FOR SELECT TO anon, authenticated USING (is_public = true);
