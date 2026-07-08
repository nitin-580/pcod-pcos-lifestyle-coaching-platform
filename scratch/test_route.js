const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uzxejobfqbjldutqplpx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGVqb2JmcWJqbGR1dHFwbHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4MDQ1OSwiZXhwIjoyMDg5MTU2NDU5fQ.Fc-70eYP_73PmR0NZYGaaE3GnTltco0wBnPk7OpyagQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, phone, specialization, credentials, referralCode, created_at')
      .eq('role', 'doctor');

    if (usersError) throw usersError;
    console.log('usersData length:', usersData ? usersData.length : 0);

    const { data: approvedReqs, error: approvedError } = await supabase
      .from('doctor_join_requests')
      .select('full_name, email, phone, specialization, medical_registration_number, status')
      .eq('status', 'approved');

    if (approvedError) throw approvedError;
    console.log('approvedReqs length:', approvedReqs ? approvedReqs.length : 0);

    const mergedDoctors = [...(usersData || [])];

    if (approvedReqs) {
      for (const req of approvedReqs) {
        if (!mergedDoctors.some(d => d.email.toLowerCase() === req.email.toLowerCase())) {
          mergedDoctors.push({
            id: req.email,
            name: req.full_name,
            email: req.email,
            phone: req.phone || '',
            specialization: req.specialization || '',
            credentials: req.medical_registration_number || '',
            referralCode: '',
            created_at: new Date().toISOString()
          });
        }
      }
    }
    console.log('mergedDoctors length:', mergedDoctors.length);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
