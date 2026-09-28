-- Migration 0016: Fix Memberships RLS Infinite Recursion
-- Date: 2026-09-28
-- Issue: The memberships_select_own_hospital policy had a circular dependency
--        where it queried the memberships table within its own policy definition,
--        causing infinite recursion error (42P17).
-- Fix: Replace with a simple check against auth.uid() and the current row.

-- Drop the problematic policy
drop policy if exists memberships_select_own_hospital on memberships;

-- Create a corrected policy that checks the current row directly
-- instead of querying memberships recursively
create policy memberships_select_own_hospital on memberships
    for select using (
        user_id = auth.uid() and status = 'active'
    );
