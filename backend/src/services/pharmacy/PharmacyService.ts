// Responsibility: Business logic and database operations for pharmacy inventory and stock transactions

import { SupabaseClient } from "@supabase/supabase-js";
import type { InventoryItem } from "../../types";

export const queryCurrentInventory = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data: stockData, error: stockErr } = await supabase
    .from("inventory_current_stock")
    .select("inventory_item_id, hospital_id, name, unit, reorder_level, current_stock")
    .eq("hospital_id", hospitalId);
  if (stockErr) throw stockErr;

  const { data: itemData } = await supabase
    .from("inventory_items")
    .select("id, category")
    .eq("hospital_id", hospitalId);

  const categoryMap = new Map(itemData?.map((i) => [i.id, i.category]) || []);

  return stockData?.map((item) => ({
    id: item.inventory_item_id,
    inventory_item_id: item.inventory_item_id,
    item_name: item.name,
    name: item.name,
    category: categoryMap.get(item.inventory_item_id) || "medicine",
    unit: item.unit,
    unit_of_measure: item.unit,
    reorder_level: item.reorder_level,
    quantity_in_stock: Number(item.current_stock),
    current_stock: Number(item.current_stock),
    hospital_id: item.hospital_id,
  }));
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
