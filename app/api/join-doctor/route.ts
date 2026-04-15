import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('doctor_join_requests')
      .insert([
        {
          full_name: body.full_name,
          email: body.email,
          phone: body.phone,
          specialization: body.specialization,
          qualification: body.qualification,
          experience_years: body.experience_years,
          hospital_clinic: body.hospital_clinic,
          city: body.city,
          consultation_mode: body.consultation_mode,
          medical_registration_number: body.medical_registration_number,
          agreed_to_terms: body.agreed_to_terms,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        message: error.message,
      }, { status: 400 });
    }

    // 2. Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'WombCare <onboarding@remedy.wombcare.live>', // Update with verified domain
          to: body.email,
          subject: 'Your WombCare doctor application is under review',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #db2777;">Welcome Dr. ${body.full_name}</h2>
              <p>Thank you for expressing interest in joining the WombCare doctor network.</p>
              <p>Your application is currently <strong>under review</strong>. Our medical board will verify your credentials (Registration No: ${body.medical_registration_number}) and get back to you within 3-5 business days.</p>
              <div style="background: #fdf2f8; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px; color: #701a75;"><strong>Status:</strong> Pending Review</p>
              </div>
              <p style="margin-top: 30px; font-size: 12px; color: #666;">Best regards,<br/>The WombCare Team</p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error('Mail error:', mailError);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
