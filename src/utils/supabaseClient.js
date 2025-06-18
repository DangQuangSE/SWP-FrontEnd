import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://opyzfdzbjsnurxpqhmzy.supabase.co'; // Thay bằng URL của bạn
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9weXpmZHpianNudXJ4cHFobXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjcyODYsImV4cCI6MjA2NTg0MzI4Nn0.MLPOK9hDzSI-kADmvwx9M5zusLReZIDOt7tv2GuTs-c'; // Thay bằng key của bạn
export const supabase = createClient(supabaseUrl, supabaseKey);