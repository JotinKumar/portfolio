const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role key (you'll need to get this)
const supabase = createClient(
  'https://ucmaqrmombalhiydynkv.supabase.co',
  'YOUR_SERVICE_ROLE_KEY', // Replace with your service role key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createAdminUser() {
  const email = 'admin@jotin.in';
  const password = 'admin123456'; // Change this to a secure password

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return;
    }

    console.log('Admin user created successfully:', {
      id: data.user.id,
      email: data.user.email
    });
  } catch (error) {
    console.error('Script error:', error);
  }
}

createAdminUser();