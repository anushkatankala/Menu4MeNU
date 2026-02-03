-- ============================================
-- YOUR POSTGRESQL DATABASE SCHEMA
-- Authentication + User Data
-- Run this in YOUR PostgreSQL database (the one with recipes)
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- Stores user profile information
-- user_id matches Supabase auth.users.id (UUID)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- This will match Supabase user ID
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    first_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. USER FAVORITES TABLE
-- ============================================
-- Stores which recipes users have favorited
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id BIGINT NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate favorites
    UNIQUE(user_id, recipe_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_recipe_id ON user_favorites(recipe_id);

-- ============================================
-- 3. HOUSEHOLDS TABLE
-- ============================================
-- Main household groups
CREATE TABLE IF NOT EXISTS households (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'My Household',
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. HOUSEHOLD MEMBERS TABLE
-- ============================================
-- Links users to households (many-to-many)
CREATE TABLE IF NOT EXISTS household_members (
    id SERIAL PRIMARY KEY,
    household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'owner' or 'member'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate memberships
    UNIQUE(household_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_household_members_household_id ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_user_id ON household_members(user_id);

-- ============================================
-- 5. HOUSEHOLD INVENTORY TABLE
-- ============================================
-- Items in household inventory
CREATE TABLE IF NOT EXISTS household_inventory (
    id SERIAL PRIMARY KEY,
    household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity TEXT,
    category TEXT DEFAULT 'Pantry',
    added_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_household_inventory_household_id ON household_inventory(household_id);

-- ============================================
-- 6. HOUSEHOLD NEEDED ITEMS TABLE
-- ============================================
-- Shopping list / needed items
CREATE TABLE IF NOT EXISTS household_needed_items (
    id SERIAL PRIMARY KEY,
    household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    added_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_household_needed_items_household_id ON household_needed_items(household_id);

-- ============================================
-- HELPER FUNCTION: Auto-create household for new users
-- ============================================
-- This function will be called from your backend when a user signs up
CREATE OR REPLACE FUNCTION create_user_household(p_user_id UUID, p_email TEXT, p_username TEXT, p_first_name TEXT)
RETURNS INTEGER AS $$
DECLARE
    v_household_id INTEGER;
BEGIN
    -- Insert user
    INSERT INTO users (id, email, username, first_name)
    VALUES (p_user_id, p_email, p_username, p_first_name)
    ON CONFLICT (id) DO NOTHING;
    
    -- Create household
    INSERT INTO households (name, created_by)
    VALUES ('My Household', p_user_id)
    RETURNING id INTO v_household_id;
    
    -- Add user as owner
    INSERT INTO household_members (household_id, user_id, role)
    VALUES (v_household_id, p_user_id, 'owner');
    
    RETURN v_household_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TEST QUERIES (Optional - to verify setup)
-- ============================================

-- Count tables created
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'user_favorites', COUNT(*) FROM user_favorites
UNION ALL
SELECT 'households', COUNT(*) FROM households
UNION ALL
SELECT 'household_members', COUNT(*) FROM household_members
UNION ALL
SELECT 'household_inventory', COUNT(*) FROM household_inventory
UNION ALL
SELECT 'household_needed_items', COUNT(*) FROM household_needed_items;

-- ============================================
-- COMPLETED!
-- ============================================
-- All user data tables created in YOUR PostgreSQL database
-- Supabase only handles authentication
