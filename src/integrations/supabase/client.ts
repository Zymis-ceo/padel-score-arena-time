// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qkcricnqzklymozjiaiu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY3JpY25xemtseW1vemppYWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzM2NTgsImV4cCI6MjA1OTg0OTY1OH0.jHM0xd2tMVJSXi2yeC4pFku1ctAV8SaGTRXt6QXuWCw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);