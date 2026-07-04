import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Map frontend camelCase to snake_case table columns
    const dbPayload = {
      name: data.name,
      age: Number(data.age),
      city: data.city || null,
      height: Number(data.height),
      weight: Number(data.weight),
      occupation: data.occupation || null,
      work_schedule: data.workschedule || null,
      pcos: data.pcos,
      cycle_pattern: data.cyclePattern || [],
      medications: data.medications || null,
      thyroid: data.thyroid || null,
      diabetes: data.diabetes || null,
      htn: data.htn || null,
      fatty_liver: data.fattyliver || null,
      vitamins: data.vitamins || [],
      other_conditions: data.otherConditions || null,
      diet: data.diet || null,
      allergies: data.allergies || null,
      food_prefs: data.foodPrefs || null,
      wake_time: data.wakeTime || null,
      bed_time: data.bedTime || null,
      sleep_hours: data.sleepHours ? Number(data.sleepHours) : null,
      water_intake: data.waterIntake ? Number(data.waterIntake) : null,
      activity_level: data.activityLevel || null,
      daily_steps: data.dailySteps ? Number(data.dailySteps) : null,
      exercise_routine: data.exerciseRoutine || null,
      stress_level: Number(data.stressLevel),
      goals: data.goals || [],
    };

    const { error } = await supabase
      .from('wombcare_health_assessments')
      .insert([dbPayload]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = req.headers.get('x-admin-api-key') || searchParams.get('apiKey');

    // Simple auth check matching the admin API key
    if (key !== 'nitinisacoderandstudent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('wombcare_health_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
