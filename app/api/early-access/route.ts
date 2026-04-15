import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  
  try {
    const { email, name } = await req.json();

    const { error } = await supabase
      .from('early_access_users')
      .insert([{ email, name }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already on the list!' });
      }
      throw error;
    }

    if (resend) {
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
