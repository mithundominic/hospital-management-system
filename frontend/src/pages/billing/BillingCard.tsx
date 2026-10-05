// Responsibility: Render individual invoice in card grid view
import { memo } from "react";
import { format } from "date-fns";
import { Receipt, Printer } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { invoiceStatusConfig, appConfig } from "@/configs";
import type { InvoiceStatus } from "@/constants";
import type { Invoice } from "@/types";

export interface BillingCardProps {
  invoice: Invoice;
  onPrint?: (invoice: Invoice) => void;
}

export const BillingCard = memo(({ invoice: inv, onPrint }: BillingCardProps) => {
  const badgeConfig = invoiceStatusConfig[inv.status as InvoiceStatus] || {
    label: (inv.status || "draft").replace("_", " "),
    variant: "default" as const,
  };
  const dateStr = inv.invoice_date || inv.issued_at || inv.created_at;
  const total = Number(inv.total_amount) || 0;
  const tax = Number(inv.tax_amount ?? ((inv.cgst_total ?? 0) + (inv.sgst_total ?? 0))) || 0;

  return (
    <DataCard
      title={inv.invoice_number}
      subtitle={dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "N/A"}
      icon={<Receipt className="h-6 w-6" />}
      badge={<Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>}
      fields={[
        {
          label: "Total Amount",
          value: `${appConfig.currency.symbol}${total.toLocaleString("en-IN")}`,
        },
        {
          label: "Tax / GST",
          value: `${appConfig.currency.symbol}${tax.toLocaleString("en-IN")}`,
        },
      ]}
      actions={
        onPrint ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint(inv)}
            icon={<Printer className="h-3.5 w-3.5" />}
          >
            Print
          </Button>
        ) : undefined
      }
    />
  );
});

BillingCard.displayName = "BillingCard";

export default BillingCard;
