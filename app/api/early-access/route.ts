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
    const { email, name } = await req.json();

    const { error } = await supabase
      .from('early_access_users')
      .insert([{ email, name }]);

    if (error) {
      if (error.code === '23505') { // Duplicate email
        return NextResponse.json({ success: true, message: 'Already on the list!' });
      }
      throw error;
    }

    // Send Welcome Email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'WombCare <hello@remedy.wombcare.live>',
        to: email,
        subject: 'You are on the list! Welcome to WombCare',
        html: `
          <div style="font-family: sans-serif; text-align: center;">
            <h1 style="color: #db2777;">Welcome ${name || 'there'}!</h1>
            <p>You've successfully joined the early access list for WombCare.</p>
            <p>We'll notify you as soon as we launch new features for PCOD and hormonal wellness care.</p>
            <p style="color: #666; font-size: 12px;">Stay balanced,<br/>Team WombCare</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
