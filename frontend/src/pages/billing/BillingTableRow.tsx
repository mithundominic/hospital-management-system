// Responsibility: Render single invoice table row with formatted currency and status badge

import { memo } from "react";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { invoiceStatusConfig, appConfig } from "@/configs";
import type { InvoiceStatus } from "@/constants";
import type { Invoice } from "@/types";

export interface BillingTableRowProps {
  invoice: Invoice;
  onPrint?: (invoice: Invoice) => void;
}

export const BillingTableRow = memo(({ invoice: inv, onPrint }: BillingTableRowProps) => {
  const badgeConfig = invoiceStatusConfig[inv.status as InvoiceStatus] || {
    label: (inv.status || "draft").replace("_", " "),
    variant: "default" as const,
  };
  const dateStr = inv.invoice_date || inv.issued_at || inv.created_at;
  const total = Number(inv.total_amount) || 0;
  const tax = Number(inv.tax_amount ?? ((inv.cgst_total ?? 0) + (inv.sgst_total ?? 0))) || 0;

  return (
    <TableRow>
      <TableCell>
        <Text weight="medium" className="font-mono text-primary-600">
          {inv.invoice_number}
        </Text>
      </TableCell>
      <TableCell>
        <Text size="sm">
          {dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "N/A"}
        </Text>
      </TableCell>
      <TableCell>
        <Text weight="semibold">
          {appConfig.currency.symbol}
          {total.toLocaleString("en-IN")}
        </Text>
      </TableCell>
      <TableCell>
        <Text size="sm" variant="muted">
          {appConfig.currency.symbol}
          {tax.toLocaleString("en-IN")}
        </Text>
      </TableCell>
      <TableCell>
        <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
      </TableCell>
      <TableCell className="text-right">
        {onPrint && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Printer className="h-4 w-4" />}
            onClick={() => onPrint(inv)}
            title="Print Tax Invoice"
          />
        )}
      </TableCell>
    </TableRow>
  );
});

BillingTableRow.displayName = "BillingTableRow";

export default BillingTableRow;
