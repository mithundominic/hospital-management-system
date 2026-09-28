// backend/src/services/prescriptions/PrescriptionService.ts
// Responsibility: Create prescriptions with items (insert-only ledger)

import { SupabaseClient } from '@supabase/supabase-js';
import { Prescription, PrescriptionItem } from '../../types';

interface PrescriptionParams {
  hospital_id: string;
  encounter_id: string;
  prescribed_by: string;
  notes?: string;
  items?: Array<Omit<PrescriptionItem, 'id' | 'prescription_id'>>;
}

interface PrescriptionWithItems extends Prescription {
  items: PrescriptionItem[];
}

/**
 * Create prescription with items in database
 * @param supabaseClient - User-scoped Supabase client
 * @param params - Prescription parameters
 * @returns Created prescription with items
 */
export async function createPrescription(
  supabaseClient: SupabaseClient,
  params: PrescriptionParams
): Promise<PrescriptionWithItems> {
  const { hospital_id, encounter_id, prescribed_by, notes, items = [] } = params;

  const { data: prescription, error: rxError } = await supabaseClient
    .from('prescriptions')
    .insert({
      hospital_id,
      encounter_id,
      prescribed_by,
      notes,
    })
    .select()
    .single();
  
  if (rxError) throw rxError;

  let prescriptionItems: PrescriptionItem[] = [];
  if (items.length > 0) {
    const { data: itemRows, error: itemsError } = await supabaseClient
      .from('prescription_items')
      .insert(items.map((item) => ({ ...item, prescription_id: prescription.id })))
      .select();
    
    if (itemsError) throw itemsError;
    prescriptionItems = itemRows as PrescriptionItem[];
  }

  return { ...prescription, items: prescriptionItems } as PrescriptionWithItems;
}
