import { NextResponse } from 'next/server';
import { getPublicApiBase } from '@/lib/api-config';

const ADMIN_API_KEY = 'nitinisacoderandstudent';

export async function GET() {
  try {
    const res = await fetch(`${getPublicApiBase()}/doctors/admin/active-list`, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-api-key': ADMIN_API_KEY
      }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Frontend API Proxy GET active list error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    const res = await fetch(`${getPublicApiBase()}/doctors/admin/${id}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-api-key': ADMIN_API_KEY
      },
      body: JSON.stringify(updateData)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Frontend API Proxy PATCH doctor profile error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${getPublicApiBase()}/doctors/admin/map-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-api-key': ADMIN_API_KEY
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Frontend API Proxy POST map user error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
