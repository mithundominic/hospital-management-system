// Responsibility: Seed demo hospital and hospital administrator membership
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in backend/.env");
  process.exit(1);
}

const supabase = createClient(url, key);
const DEMO_USER_ID = "02eb4624-b59d-4a77-9445-ec21ccbdce7e";
const DEMO_EMAIL = "demo@hospital.com";
const DEMO_PASSWORD = "Demo123!@#";

const getOrCreateHospital = async (): Promise<string> => {
  const { data: existing } = await supabase
    .from("hospitals")
    .select("id, name")
    .eq("name", "Demo General Hospital")
    .single();

  if (existing) {
    console.log("✓ Demo hospital already exists:", existing.name);
    return existing.id;
  }

  const { data, error } = await supabase
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

  if (error || !data) throw new Error(`Failed to create hospital: ${error?.message}`);
  console.log("✓ Created demo hospital:", data.name);
  return data.id;
};

const setupMembership = async (hospitalId: string, roleId: string): Promise<void> => {
  const { data: existing } = await supabase
    .from("memberships")
    .select("id")
    .eq("user_id", DEMO_USER_ID)
    .eq("hospital_id", hospitalId)
    .eq("role_id", roleId)
    .single();

  if (existing) {
    console.log("✓ Demo user already has membership");
    return;
  }

  const { error } = await supabase.from("memberships").insert({
    user_id: DEMO_USER_ID,
    hospital_id: hospitalId,
    role_id: roleId,
    status: "active",
  });
  if (error) throw new Error(`Failed to create membership: ${error.message}`);
  console.log("✓ Created demo user membership");
};

const setupDemo = async (): Promise<void> => {
  console.log("🏥 Setting up demo hospital...\n");
  const hospitalId = await getOrCreateHospital();

  const { data: role, error } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "HospitalAdmin")
    .single();
  if (error || !role) throw new Error("HospitalAdmin role not found.");

  await setupMembership(hospitalId, role.id);
  console.log(`\n✅ Demo setup complete! Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}\n`);
};

void setupDemo().catch((err: Error) => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});
