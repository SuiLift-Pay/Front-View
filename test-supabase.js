// Test script to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vfjltxohmohgixmgcodn.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmamx0eG9obW9oZ2l4bWdjb2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODIwNTEsImV4cCI6MjA2OTA1ODA1MX0.Fu_ptzYt9Q3jkvH2wiXDQo7_B6VnWE2ebfcA6ym31WM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');

    // Test basic connection
    const { data, error } = await supabase
      .from('virtual_cards')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log('Total virtual_cards records:', data);
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

testSupabaseConnection();
