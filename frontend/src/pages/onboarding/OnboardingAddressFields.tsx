// Responsibility: Render address, city, state, and pincode inputs for hospital onboarding

import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Grid } from "@/components/ui/Grid";

export interface AddressFieldsProps {
  address: string;
  setAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  state: string;
  setState: (v: string) => void;
  pincode: string;
  setPincode: (v: string) => void;
}

export const OnboardingAddressFields = ({
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
}: AddressFieldsProps) => (
  <>
    <Input
      label="Street Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      icon={<MapPin className="h-5 w-5" />}
      placeholder="e.g. 42 Healthcare Boulevard"
    />
    <Grid cols={3} gap={4}>
      <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bengaluru" />
      <Input label="State" value={state} onChange={(e) => setState(e.target.value)} placeholder="Karnataka" />
      <Input label="PIN Code" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="560001" />
    </Grid>
  </>
);
