import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// GET: Fetch all doctor join requests
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('doctor_join_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Update request status (Approve/Reject)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    // 1. Update status in table
    const { data: requestData, error: updateError } = await supabase
      .from('doctor_join_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. If approved, add to user_roles
    if (status === 'approved') {
      await supabase
        .from('user_roles')
        .upsert([{ email: requestData.email, role: 'doctor' }], { onConflict: 'email' });

      // Send Approval Email
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'WombCare <onboarding@remedy.wombcare.live>',
          to: requestData.email,
          subject: 'Action Required: Your WombCare Doctor Account is Approved!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
              <h1 style="color: #db2777;">Congratulations Dr. ${requestData.full_name}!</h1>
              <p>Your application to join the WombCare network has been approved.</p>
              <p>You can now sign in to your provider dashboard using your registered email: <strong>${requestData.email}</strong></p>
              <a href="https://wombcare.live/login" style="display: inline-block; padding: 12px 24px; background: #db2777; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">Go to Dashboard</a>
            </div>
          `,
        });
      }
    } else if (status === 'rejected') {
        // Send Rejection Email
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
              from: 'WombCare <onboarding@remedy.wombcare.live>',
              to: requestData.email,
              subject: 'Update regarding your WombCare application',
              html: `<p>Dear Dr. ${requestData.full_name}, thank you for your interest. At this time, we are unable to proceed with your application. Feel free to re-apply in 6 months.</p>`,
            });
        }
    }

    return NextResponse.json({ success: true, data: requestData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
