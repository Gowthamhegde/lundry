// Auto-generated type definitions for the Supabase schema.
// Regenerate with: npx supabase gen types typescript --project-id <your-project-id>

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          icon: string | null;
          badge: string | null;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price?: number;
          category?: string;
          icon?: string | null;
          badge?: string | null;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          icon?: string | null;
          badge?: string | null;
          sort_order?: number;
          active?: boolean;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_phone: string;
          pickup_address: string;
          pickup_date: string | null;
          pickup_time: string | null;
          notes: string | null;
          status: OrderStatus;
          estimated_total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          customer_name: string;
          customer_phone: string;
          pickup_address: string;
          pickup_date?: string | null;
          pickup_time?: string | null;
          notes?: string | null;
          status?: OrderStatus;
          estimated_total?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: OrderStatus;
          notes?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          service_id: string | null;
          name: string;
          price: number;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          service_id?: string | null;
          name: string;
          price: number;
          quantity?: number;
        };
        Update: {
          quantity?: number;
        };
      };
      site_config: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type OrderStatus =
  | 'Order received'
  | 'Picked up'
  | 'Being cleaned'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled';

export type Profile    = Database['public']['Tables']['profiles']['Row'];
export type Service    = Database['public']['Tables']['services']['Row'];
export type Order      = Database['public']['Tables']['orders']['Row'];
export type OrderItem  = Database['public']['Tables']['order_items']['Row'];
export type SiteConfig = Database['public']['Tables']['site_config']['Row'];
