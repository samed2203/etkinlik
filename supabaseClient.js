
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://fmacsxnpoyanjmkavntz.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtYWNzeG5wb3lhbmpta2F2bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDU4NjUsImV4cCI6MjA2MjY4MTg2NX0.EbfPIadfyNn2OHGmMuR0N4sCCIbXXW09VUHNV7skm00'; // Supabase projenizin anonim API anahtarı

export const supabase = createClient(supabaseUrl, supabaseKey);
