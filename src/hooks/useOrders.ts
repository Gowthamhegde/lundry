"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Order, OrderItem, OrderStatus } from "@/lib/database.types";

export type OrderWithItems = Order & { order_items: OrderItem[] };

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function useOrders() {
  const [orders,  setOrders]  = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) { setOrders([]); return; }

      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const token = await getAuthToken();
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchOrders();
  };

  return { orders, loading, error, refetch: fetchOrders, updateOrderStatus };
}
