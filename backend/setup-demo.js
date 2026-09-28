// Setup demo hospital and admin user
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env file
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.SUPABASE_URL;
const supabaseSecretKey = envVars.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in backend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecretKey);

const DEMO_USER_ID = "02eb4624-b59d-4a77-9445-ec21ccbdce7e";
const DEMO_EMAIL = "demo@hospital.com";
const DEMO_PASSWORD = "Demo123!@#";

async function setupDemo() {
  console.log("🏥 Setting up demo hospital...\n");

  try {
    // 1. Check if hospital already exists
    const { data: existingHospitals, error: hospitalCheckError } =
      await supabase
        .from("hospitals")
        .select("id, name")
        .eq("name", "Demo General Hospital")
        .single();

    let hospitalId;

    if (existingHospitals) {
      console.log("✓ Demo hospital already exists:", existingHospitals.name);
      hospitalId = existingHospitals.id;
    } else {
      // Create demo hospital
      const { data: hospital, error: hospitalError } = await supabase
        .from("hospitals")
        .insert({
          name: "Demo General Hospital",
          registration_number: "DEMO-2024-001",
          address: "123 Medical Street",
          city: "Demo City",
          state: "Demo State",
          pincode: "123456",
          is_active: true,
        })
        .select()
        .single();

      if (hospitalError) {
        throw new Error(`Failed to create hospital: ${hospitalError.message}`);
      }

      hospitalId = hospital.id;
      console.log("✓ Created demo hospital:", hospital.name);
    }

    // 2. Get HospitalAdmin role
    const { data: adminRole, error: roleError } = await supabase
      .from("roles")
      .select("id, name")
      .eq("name", "HospitalAdmin")
      .single();

    if (roleError || !adminRole) {
      throw new Error(
        "HospitalAdmin role not found. Please run migrations first.",
      );
    }

    console.log("✓ Found HospitalAdmin role");

    // 3. Check if membership already exists
    const { data: existingMembership } = await supabase
      .from("memberships")
      .select("id")
      .eq("user_id", DEMO_USER_ID)
      .eq("hospital_id", hospitalId)
      .eq("role_id", adminRole.id)
      .single();

    if (existingMembership) {
      console.log("✓ Demo user already has membership");
    } else {
      // Create membership
      const { error: membershipError } = await supabase
        .from("memberships")
        .insert({
          user_id: DEMO_USER_ID,
          hospital_id: hospitalId,
          role_id: adminRole.id,
          status: "active",
        });

      if (membershipError) {
        throw new Error(
          `Failed to create membership: ${membershipError.message}`,
        );
      }

      console.log("✓ Created demo user membership");
    }

    console.log("\n✅ Demo setup complete!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Demo Account Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Email:    ${DEMO_EMAIL}`);
    console.log(`   Password: ${DEMO_PASSWORD}`);
    console.log(`   Hospital: Demo General Hospital`);
    console.log(`   Role:     HospitalAdmin`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setupDemo();
