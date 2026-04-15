import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('doctor_join_requests')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    if (resend) {
      await resend.emails.send({
        from: 'WombCare <onboarding@remedy.wombcare.live>',
        to: body.email,
        subject: 'WombCare Provider Application Received',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h1 style="color: #db2777;">Thank you, Dr. ${body.full_name}!</h1>
            <p>We've received your application to join WombCare as a provider.</p>
            <p>Our medical board will review your credentials (Registration: ${body.medical_registration_number}) and get back to you within 2-3 business days.</p>
            <p>Stay balanced,<br/>Team WombCare</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
