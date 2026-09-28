// Responsibility: Initialize and export the Supabase client for authentication only

import { createClient } from '@supabase/supabase-js';
import config from './config';

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
);
