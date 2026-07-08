import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';

export async function GET() {
  if (!supabase) return NextResponse.json({ success: false, message: 'Supabase admin client not configured' }, { status: 500 });

  try {
    // 1. Fetch user roles where role is doctor
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('email')
      .eq('role', 'doctor');

    if (roleError) throw roleError;

    // 2. Fetch approved doctor requests
    const { data: approvedReqs, error: approvedError } = await supabase
      .from('doctor_join_requests')
      .select('full_name, email, phone, specialization, medical_registration_number, status')
      .eq('status', 'approved');

    if (approvedError) throw approvedError;

    const emails = (roleData || []).map(r => r.email);
    const approvedEmails = (approvedReqs || []).map(r => r.email);
    const allEmails = Array.from(new Set([...emails, ...approvedEmails]));

    let usersData: any[] = [];
    if (allEmails.length > 0) {
      const { data: fetchUsers, error: fetchUsersError } = await supabase
        .from('users')
        .select('id, name, email, phone, specialization, credentials, referralCode, created_at')
        .in('email', allEmails);

      if (fetchUsersError) throw fetchUsersError;
      usersData = fetchUsers || [];
    }

    const mergedDoctors = [...usersData];

    // Merge in approved requests that may not have user profile entries yet
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

    // Fetch registrations (users who are not doctors)
    const { data: registrations, error: regError } = await supabase
      .from('users')
      .select('id, name, email, phone, age, weight, cycleRegularity, symptoms, country, role')
      .neq('role', 'doctor');

    if (regError) throw regError;

    return NextResponse.json({
      success: true,
      doctors: mergedDoctors,
      registrations: registrations || []
    });
  } catch (error: any) {
    console.error('API GET doctors error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!supabase) return NextResponse.json({ success: false, message: 'Supabase admin client not configured' }, { status: 500 });

  try {
    const { id, name, email, phone, specialization, credentials, referralCode } = await req.json();

    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        email,
        phone,
        specialization,
        credentials,
        referralCode
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API PATCH doctors error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ success: false, message: 'Supabase admin client not configured' }, { status: 500 });

  try {
    const { action, user, doctorId, doctorName, doctorReferralCode } = await req.json();

    if (action === 'patient') {
      const { error } = await supabase
        .from('patients')
        .insert([{
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          age: Number(user.age) || 0,
          weight: Number(user.weight) || 0,
          cycle_regular: user.cycleRegularity || 'Regular',
          symptoms: user.symptoms || '',
          country: user.country || 'India',
          referred_by: doctorId
        }]);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('referrals')
        .insert([{
          patientName: user.name,
          mobile: user.phone || '',
          email: user.email,
          problem: user.symptoms || '',
          doctorId: doctorId,
          doctorReferralCode: doctorReferralCode || '',
          referralStatus: 'pending'
        }]);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API POST map doctor error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
