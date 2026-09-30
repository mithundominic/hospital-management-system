// Responsibility: Business logic for public tenant onboarding and initial administrator provisioning

import { publicClient } from "../../config/supabase";
import type { CreateHospitalDTO } from "../../types";

export interface OnboardingPayload extends CreateHospitalDTO {
  admin_email?: string;
  email?: string;
  admin_password?: string;
  password?: string;
}

export const onboardNewHospital = async (
  payload: OnboardingPayload,
  bearerToken?: string,
) => {
  const email = (payload.admin_email || payload.email)?.trim();
  const password = payload.admin_password || payload.password;

  let hospital = null;
  let userId: string | null = null;
  let session = null;

  if (email && password) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const { data: regData, error: regError } = await publicClient.rpc(
      "register_hospital_and_admin",
      {
        p_email: email,
        p_password: password,
        p_name: payload.name.trim(),
        p_registration_number: payload.registration_number?.trim() || null,
        p_address: payload.address?.trim() || null,
        p_city: payload.city?.trim() || null,
        p_state: payload.state?.trim() || null,
        p_pincode: payload.pincode?.trim() || null,
      },
    );

    if (regError) {
      throw new Error(`Failed to onboard hospital: ${regError.message}`);
    }

    hospital = regData.hospital;
    userId = regData.user_id;

    const { data: signInData, error: signInError } =
      await publicClient.auth.signInWithPassword({
        email,
        password,
      });

    if (!signInError && signInData?.session) {
      session = signInData.session;
    }
  } else if (bearerToken) {
    const { data, error } = await publicClient.auth.getUser(bearerToken);
    if (error || !data?.user) {
      throw new Error("UNAUTHENTICATED: Invalid or expired bearer token");
    }
    userId = data.user.id;

    const { data: rpcHospital, error: rpcError } = await publicClient.rpc(
      "create_hospital_for_user",
      {
        p_user_id: userId,
        p_name: payload.name.trim(),
        p_registration_number: payload.registration_number?.trim() || null,
        p_address: payload.address?.trim() || null,
        p_city: payload.city?.trim() || null,
        p_state: payload.state?.trim() || null,
        p_pincode: payload.pincode?.trim() || null,
      },
    );

    if (rpcError) {
      throw new Error(`Failed to create hospital tenant: ${rpcError.message}`);
    }

    hospital = rpcHospital;
  } else {
    throw new Error(
      "Missing administrator credentials. Provide admin_email and admin_password (or an Authorization Bearer token) to initialize the hospital.",
    );
  }

  return {
    hospital,
    admin: { id: userId, email: email || null },
    session,
  };
};
