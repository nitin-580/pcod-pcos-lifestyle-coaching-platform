// const fetch = require('node-fetch'); // Node 20+ supports fetch natively

const BASE_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api';
const ADMIN_KEY = 'nitinisacoderandstudent';

async function testApi() {
  console.log('🚀 Starting API Diagnostics...\n');

  const endpoints = [
    { name: 'Public Blogs', url: `${BASE_URL}/blogs`, method: 'GET' },
    { name: 'Public Careers', url: `${BASE_URL}/careers`, method: 'GET' },
    { name: 'Admin Stats', url: `${BASE_URL}/admin/stats`, method: 'GET', admin: true },
    { name: 'Admin Users', url: `${BASE_URL}/admin/users`, method: 'GET', admin: true },
    { name: 'Admin Blogs', url: `${BASE_URL}/admin/blogs`, method: 'GET', admin: true },
    { name: 'Admin Careers', url: `${BASE_URL}/admin/careers`, method: 'GET', admin: true },
  ];

  for (const ep of endpoints) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (ep.admin) headers['x-admin-api-key'] = ADMIN_KEY;

      const res = await fetch(ep.url, { method: ep.method, headers });
      const data = await res.json();

      if (res.ok) {
        console.log(`✅ ${ep.name}: SUCCESS (${res.status})`);
        if (Array.isArray(data.data)) {
          console.log(`   Found ${data.data.length} items`);
        } else if (data.data) {
          console.log(`   Data received: ${Object.keys(data.data).join(', ')}`);
        }
      } else {
        console.log(`❌ ${ep.name}: FAILED (${res.status})`);
        console.log(`   Error: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.log(`💥 ${ep.name}: ERROR`);
      console.log(`   ${err.message}`);
    }
    console.log('---');
  }

  // Test Blog Creation
  console.log('\n📝 Testing Blog Creation...');
  try {
    const res = await fetch(`${BASE_URL}/admin/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-api-key': ADMIN_KEY
      },
      body: JSON.stringify({
        title: 'Diagnostic Test Blog',
        content: '<p>This is a test <b>bold</b> and <i>italic</i> content.</p>',
        authorName: 'Diagnostic Bot (Snake Case)',
        published: false,
        contentType: 'html',
        cover_image: 'https://example.com/test.jpg'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Blog Creation: SUCCESS');
      console.log(`   New Blog ID: ${data.data?.id}`);
    } else {
      console.log('❌ Blog Creation: FAILED');
      console.log(`   Error: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log('💥 Blog Creation: ERROR');
    console.log(`   ${err.message}`);
  }

  // Test Career Creation
  console.log('\n💼 Testing Career Creation...');
  try {
    const res = await fetch(`${BASE_URL}/admin/careers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-api-key': ADMIN_KEY
      },
      body: JSON.stringify({
        title: 'Diagnostic Test Job',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        description: 'Test job description',
        requirements: ['Requirement 1', 'Requirement 2'],
        active: false
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Career Creation: SUCCESS');
      console.log(`   New Career ID: ${data.data?.id}`);
    } else {
      console.log('❌ Career Creation: FAILED');
      console.log(`   Error: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log('💥 Career Creation: ERROR');
    console.log(`   ${err.message}`);
  }
}

testApi();
