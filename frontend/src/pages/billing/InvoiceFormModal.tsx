// Responsibility: Modal container for generating GST-compliant patient invoices and line items

import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Form } from '@/components/ui/Form';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Grid } from '@/components/ui/Grid';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ModalFooter } from '@/components/common/ModalFooter';
import { InvoiceLineItemRow } from './InvoiceLineItemRow';
import { InvoiceTotalsSection } from './InvoiceTotalsSection';
import { useInvoiceForm } from './useInvoiceForm';
import type { InvoiceFormModalProps } from './invoice.types';

export const InvoiceFormModal = ({ onClose, onSuccess, invoice }: InvoiceFormModalProps) => {
  const {
    loading, formData, setFormData, items, totals, patients,
    addItem, removeItem, updateItem, handleSubmit,
  } = useInvoiceForm(onClose, onSuccess, invoice);

  const patientOpts = [
    { value: '', label: 'Select Patient' },
    ...patients.map((p) => ({ value: p.id, label: p.full_name })),
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Generate Invoice"
      maxWidth="2xl"
      footer={
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Generate Invoice"
          isLoading={loading}
        />
      }
    >
      <Form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Grid cols={3} gap={3}>
            <Select
              label="Patient *"
              value={formData.patient_id}
              onChange={(e) => setFormData((p) => ({ ...p, patient_id: e.target.value }))}
              options={patientOpts}
              required
            />
            <Input
              label="Invoice Date"
              type="date"
              value={formData.invoice_date}
              onChange={(e) => setFormData((p) => ({ ...p, invoice_date: e.target.value }))}
            />
            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData((p) => ({ ...p, due_date: e.target.value }))}
            />
          </Grid>

          <Flex justify="between" align="center">
            <Text weight="semibold" size="sm">Line Items</Text>
            <Button variant="outline" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addItem}>
              Add Item
            </Button>
          </Flex>

          <Box className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {items.map((it, idx) => (
              <InvoiceLineItemRow
                key={idx}
                item={it}
                index={idx}
                canRemove={items.length > 1}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </Box>

          <InvoiceTotalsSection totals={totals} />
        </Box>
      </Form>
    </Modal>
  );
};

export default InvoiceFormModal;
