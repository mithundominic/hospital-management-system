// Responsibility: Render hospital name and registration number inputs

import { Building2, FileText } from "lucide-react";
import { Input } from "@/components/ui/Input";

export interface BasicFieldsProps {
  name: string;
  setName: (v: string) => void;
  regNo: string;
  setRegNo: (v: string) => void;
}

export const OnboardingBasicFields = ({
  name,
  setName,
  regNo,
  setRegNo,
}: BasicFieldsProps) => (
  <>
    <Input
      label="Hospital / Clinic Name *"
      required
      value={name}
      onChange={(e) => setName(e.target.value)}
      icon={<Building2 className="h-5 w-5" />}
      placeholder="e.g. Apollo Grace Hospital"
    />
    <Input
      label="Registration / License Number"
      value={regNo}
      onChange={(e) => setRegNo(e.target.value)}
      icon={<FileText className="h-5 w-5" />}
      placeholder="e.g. CEA/2026/8921"
    />
  </>
);
