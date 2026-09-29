// Responsibility: Create prescriptions with items (insert-only ledger)

/**
 * Create prescription with items in database
 * @param {Object} supabaseClient - User-scoped Supabase client
 * @param {Object} params - Prescription parameters
 * @returns {Promise<Object>} Created prescription with items
 */
async function createPrescription(supabaseClient, params) {
  const {
    hospital_id,
    encounter_id,
    prescribed_by,
    notes,
    items = [],
  } = params;

  const { data: prescription, error: rxError } = await supabaseClient
    .from("prescriptions")
    .insert({
      hospital_id,
      encounter_id,
      prescribed_by,
      notes,
    })
    .select()
    .single();

  if (rxError) throw rxError;

  let prescriptionItems = [];
  if (items.length > 0) {
    const { data: itemRows, error: itemsError } = await supabaseClient
      .from("prescription_items")
      .insert(
        items.map((item) => ({ ...item, prescription_id: prescription.id })),
      )
      .select();

    if (itemsError) throw itemsError;
    prescriptionItems = itemRows;
  }

  return { ...prescription, items: prescriptionItems };
}

module.exports = { createPrescription };
