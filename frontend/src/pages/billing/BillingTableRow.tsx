// Responsibility: Render single invoice table row with formatted currency and status badge

import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { invoiceStatusConfig, appConfig } from "@/configs";
import type { InvoiceStatus } from "@/constants";
import type { Invoice } from "@/types";

export interface BillingTableRowProps {
  invoice: Invoice;
}

export const BillingTableRow = ({ invoice: inv }: BillingTableRowProps) => {
  const badgeConfig = invoiceStatusConfig[inv.status as InvoiceStatus] || {
    label: inv.status,
    variant: "default" as const,
  };

  return (
  <TableRow>
    <TableCell>
      <Text weight="medium" className="font-mono text-primary-600">
        {inv.invoice_number}
      </Text>
    </TableCell>
    <TableCell>
      <Text size="sm">
        {inv.invoice_date ? format(new Date(inv.invoice_date), "dd MMM yyyy") : "N/A"}
      </Text>
    </TableCell>
      <TableCell>
        <Text weight="semibold">
          {appConfig.currency.symbol}{inv.total_amount.toLocaleString("en-IN")}
        </Text>
      </TableCell>
      <TableCell>
        <Text size="sm" variant="muted">
          {appConfig.currency.symbol}{inv.tax_amount.toLocaleString("en-IN")}
        </Text>
      </TableCell>
      <TableCell>
        <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
      </TableCell>
    </TableRow>
  );
};

export default BillingTableRow;
