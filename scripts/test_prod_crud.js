const BASE_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api';
const ADMIN_KEY = 'nitinisacoderandstudent';

async function logResponse(name, res) {
  const status = res.status;
  const data = await res.json();
  const ok = res.ok ? '✅' : '❌';
  console.log(`${ok} ${name}: ${status}`);
  if (!res.ok) console.log('   Error:', JSON.stringify(data, null, 2));
  return data;
}

async function runTests() {
  console.log('🚀 STARTING FULL PRODUCTION CRUD TESTS...\n');

  // 1. Health & Public
  await logResponse('Health Check', await fetch(`${BASE_URL}/health`));
  await logResponse('Public Blogs List', await fetch(`${BASE_URL}/blogs`));

  // 2. Admin Stats & Users
  await logResponse('Admin Stats', await fetch(`${BASE_URL}/admin/stats`, { headers: { 'x-admin-api-key': ADMIN_KEY } }));
  await logResponse('Admin Users List', await fetch(`${BASE_URL}/admin/users`, { headers: { 'x-admin-api-key': ADMIN_KEY } }));

  // 3. Blog CRUD
  console.log('\n📝 Testing Blog CRUD...');
  const createBlog = await logResponse('Create Blog', await fetch(`${BASE_URL}/admin/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-api-key': ADMIN_KEY },
    body: JSON.stringify({
      title: 'CRUD Test Blog',
      content: '<p>Test content</p>',
      authorName: 'Tester',
      published: false,
      cover_image: 'https://example.com/test.jpg',
      excerpt: 'Test subheading'
    })
  }));

  if (createBlog.success && createBlog.data?.id) {
    const blogId = createBlog.data.id;
    await logResponse('Update Blog (PATCH)', await fetch(`${BASE_URL}/admin/blogs/${blogId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-api-key': ADMIN_KEY },
      body: JSON.stringify({ title: 'CRUD Test Blog (Updated)' })
    }));

    await logResponse('Delete Blog', await fetch(`${BASE_URL}/admin/blogs/${blogId}`, {
      method: 'DELETE',
      headers: { 'x-admin-api-key': ADMIN_KEY }
    }));
  }

  // 4. Career CRUD
  console.log('\n💼 Testing Career CRUD...');
  const createCareer = await logResponse('Create Career', await fetch(`${BASE_URL}/admin/careers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-api-key': ADMIN_KEY },
    body: JSON.stringify({
      title: 'CRUD Test Career',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Test description',
      requirements: ['Req 1'],
      active: true
    })
  }));

  if (createCareer.success && createCareer.data?.id) {
    const careerId = createCareer.data.id;
    await logResponse('Update Career (PATCH)', await fetch(`${BASE_URL}/admin/careers/${careerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-api-key': ADMIN_KEY },
      body: JSON.stringify({ title: 'CRUD Test Career (Updated)' })
    }));

    await logResponse('Delete Career', await fetch(`${BASE_URL}/admin/careers/${careerId}`, {
      method: 'DELETE',
      headers: { 'x-admin-api-key': ADMIN_KEY }
    }));
  }

  console.log('\n🏁 TESTS COMPLETE.');
}

runTests().catch(console.error);
