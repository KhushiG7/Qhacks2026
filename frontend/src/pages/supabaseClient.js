import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project info
const SUPABASE_URL = 'https://gkwadgfowemxbvrurvhi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2FkZ2Zvd2VteGJ2cnVydmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQ2NzEsImV4cCI6MjA4NjA3MDY3MX0.dtpL1RfQwZl340SlHsUXbTJH-8Fw_IBlP0DnSAJr5i8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

