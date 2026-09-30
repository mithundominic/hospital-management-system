// Responsibility: Static configuration data for homepage clinical modules and highlights

import {
  Users,
  Bed,
  TestTube,
  Pill,
  Receipt,
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
} from "lucide-react";
import type { ClinicalModule, PlatformFeature } from "./home.types";

export const CLINICAL_MODULES: readonly ClinicalModule[] = [
  {
    id: "opd",
    title: "OPD & Consultations",
    tagline: "Outpatient Care",
    description: "Streamlined patient appointments, vitals capture, and SOAP clinical documentation.",
    icon: Users,
    badge: "Clinical",
    features: ["Patient demographics & MRN", "Doctor scheduling", "SOAP clinical notes"],
  },
  {
    id: "ipd",
    title: "IPD & Bed Management",
    tagline: "Inpatient Ward Care",
    description: "Real-time bed availability tracking, admission workflows, and ward occupancy metrics.",
    icon: Bed,
    badge: "Inpatient",
    features: ["Ward occupancy tracking", "Bed status mapping", "Admission to discharge"],
  },
  {
    id: "lab",
    title: "Laboratory Diagnostics",
    tagline: "Diagnostic Orders",
    description: "Digital diagnostic orders, test specimen tracking, and verified results entry.",
    icon: TestTube,
    badge: "Diagnostics",
    features: ["Complete test catalog", "Order status workflow", "Technician results validation"],
  },
  {
    id: "pharmacy",
    title: "Pharmacy & Stock Ledger",
    tagline: "Dispensing & Stock",
    description: "Audit-friendly stock transaction ledgers, inventory replenishment, and low-stock alerts.",
    icon: Pill,
    badge: "Inventory",
    features: ["Insert-only stock ledger", "Batch & expiry tracking", "Low stock alerts"],
  },
  {
    id: "billing",
    title: "Billing & GST Invoicing",
    tagline: "Financial Operations",
    description: "GST-compliant invoices with CGST/SGST itemization, payment records, and TPA claims.",
    icon: Receipt,
    badge: "Finance",
    features: ["GST invoice generation", "Split tax calculations", "TPA & insurance claims"],
  },
] as const;

export const PLATFORM_FEATURES: readonly PlatformFeature[] = [
  {
    id: "abdm",
    title: "ABDM & ABHA Readiness",
    description: "Ready for Ayushman Bharat Digital Mission, ABHA verification, and consent management.",
    icon: ShieldCheck,
    badgeText: "Compliance",
  },
  {
    id: "rls",
    title: "Zero-Leak Multi-Tenancy",
    description: "Strict PostgreSQL Row-Level Security ensuring absolute tenant data isolation.",
    icon: Lock,
    badgeText: "Security",
  },
  {
    id: "ledgers",
    title: "Insert-Only Audit Ledgers",
    description: "Financial transactions, prescriptions, and clinical notes are immutable by design.",
    icon: Database,
    badgeText: "Integrity",
  },
  {
    id: "rbac",
    title: "Granular Healthcare RBAC",
    description: "Fine-grained permissions for 9 roles: Admins, Doctors, Nurses, Clerks, and Pharmacists.",
    icon: UserCheck,
    badgeText: "Access Control",
  },
] as const;
