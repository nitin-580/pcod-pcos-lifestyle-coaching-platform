const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uzxejobfqbjldutqplpx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGVqb2JmcWJqbGR1dHFwbHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4MDQ1OSwiZXhwIjoyMDg5MTU2NDU5fQ.Fc-70eYP_73PmR0NZYGaaE3GnTltco0wBnPk7OpyagQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: roles, error } = await supabase
    .from('user_roles')
    .select('*');
  console.log('User Roles:', roles, error);
}

check();
