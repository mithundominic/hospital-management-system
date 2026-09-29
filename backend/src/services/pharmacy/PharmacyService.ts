// Responsibility: Business logic and database operations for pharmacy inventory and stock transactions

import { SupabaseClient } from "@supabase/supabase-js";
import type { InventoryItem } from "../../types";

export const queryCurrentInventory = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("inventory_current_stock")
    .select("*")
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};

export const createNewInventoryItem = async (
  supabase: SupabaseClient,
  hospitalId: string,
  itemData: Omit<
    InventoryItem,
    "id" | "hospital_id" | "created_at" | "updated_at"
  >,
) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .insert({
      hospital_id: hospitalId,
      name: itemData.name,
      category: itemData.category,
      unit: itemData.unit,
      reorder_level: itemData.reorder_level,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const recordStockTransaction = async (
  supabase: SupabaseClient,
  hospitalId: string,
  inventoryItemId: string,
  transactionData: {
    transaction_type: "purchase" | "dispense" | "adjustment" | "return";
    quantity: number;
    prescription_item_id?: string;
    performed_by: string;
    notes?: string;
  },
) => {
  const { data, error } = await supabase
    .from("stock_transactions")
    .insert({
      hospital_id: hospitalId,
      inventory_item_id: inventoryItemId,
      transaction_type: transactionData.transaction_type,
      quantity: transactionData.quantity,
      prescription_item_id: transactionData.prescription_item_id,
      performed_by: transactionData.performed_by,
      notes: transactionData.notes,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};
