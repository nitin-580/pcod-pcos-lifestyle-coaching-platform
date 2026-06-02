const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uzxejobfqbjldutqplpx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGVqb2JmcWJqbGR1dHFwbHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4MDQ1OSwiZXhwIjoyMDg5MTU2NDU5fQ.Fc-70eYP_73PmR0NZYGaaE3GnTltco0wBnPk7OpyagQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectTable(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (error) {
      console.log(`❌ Error querying table "${tableName}":`, error.message);
      return;
    }
    if (data && data.length > 0) {
      console.log(`✅ Table "${tableName}" has columns:`, Object.keys(data[0]));
    } else {
      console.log(`ℹ️ Table "${tableName}" exists but is empty.`);
    }
  } catch (e) {
    console.log(`❌ Exception querying table "${tableName}":`, e.message);
  }
}

async function run() {
  console.log('Inspecting Supabase tables...');
  await inspectTable('profiles');
  await inspectTable('wombcare_profiles');
  await inspectTable('cycles');
  await inspectTable('wombcare_cycles');
  await inspectTable('symptoms');
  await inspectTable('wombcare_symptoms');
  await inspectTable('chat_history');
  await inspectTable('wombcare_chat_history');
  await inspectTable('health_records');
  await inspectTable('wombcare_health_records');
  await inspectTable('wombcare_live_chats');
}

run();
