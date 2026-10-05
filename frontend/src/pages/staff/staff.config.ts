// Responsibility: Configuration for staff table columns and role settings
import type { TableColumn } from "@/types/table.types";
import type { MembershipDto } from "@/services/staff.service";

export const STAFF_TABLE_COLUMNS: TableColumn<MembershipDto>[] = [
  { key: "member", header: "Staff Member" },
  { key: "role", header: "Role" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "status", header: "Status" },
];
