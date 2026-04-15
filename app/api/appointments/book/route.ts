import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  
  try {
    const { userId, doctorName, appointmentDate, notes, email, patientName } = await req.json();

    const { data, error } = await supabase
      .from('wombcare_appointments')
      .insert([
        { 
          user_id: userId, 
          doctor_name: doctorName, 
          appointment_date: appointmentDate, 
          notes,
          status: 'scheduled' 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    if (resend && email) {
      const dateObj = new Date(appointmentDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      await resend.emails.send({
        from: 'WombCare Appointments <appointments@remedy.wombcare.live>',
        to: email,
        subject: 'Appointment Confirmed: WombCare Wellness Session',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #db2777; color: white; padding: 20px; text-align: center;">
              <h2>Session Confirmed!</h2>
            </div>
            <div style="padding: 20px;">
              <p>Hi ${patientName || 'Wellness seeker'},</p>
              <p>Your appointment has been successfully booked with <strong>${doctorName}</strong>.</p>
              
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
                <p style="margin: 5px 0;"><strong>Mode:</strong> Online Video Consultation</p>
              </div>

              <p style="font-size: 14px; color: #6b7280;">You will receive the meeting link 15 minutes before the session starts.</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
