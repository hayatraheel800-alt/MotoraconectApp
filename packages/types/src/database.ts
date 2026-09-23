export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string; seller_id: string; status: string; title: string; make: string; model: string; variant: string | null;
          year: number; mileage_km: number | null; price_amount: number; currency_code: string; country_code: string; city: string | null;
          body_type: string | null; fuel_type: string | null; transmission: string | null; drivetrain: string | null;
          engine_cc: number | null; engine_power_kw: number | null; registration_year: number | null; description: string | null;
          vin_last6: string | null; is_negotiable: boolean; search_document: unknown; created_at: string; updated_at: string; published_at: string | null;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["vehicles"]["Row"], "id" | "created_at" | "updated_at" | "search_document">> & {
          title: string; make: string; model: string; year: number; price_amount: number; seller_id: string; id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Row"]>;
        Relationships: [];
      };
      vehicle_images: {
        Row: { id: string; vehicle_id: string; storage_path: string; sort_order: number; alt_text: string | null; created_at: string; };
        Insert: { id?: string; vehicle_id: string; storage_path: string; sort_order?: number; alt_text?: string | null; created_at?: string; };
        Update: Partial<Database["public"]["Tables"]["vehicle_images"]["Row"]>;
        Relationships: [];
      };
      profiles: { Row: { id: string; full_name: string | null; username: string | null; avatar_url: string | null; phone: string | null; bio: string | null; country_code: string | null; city: string | null; created_at: string; updated_at: string; }; Insert: Record<string, never>; Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>; Relationships: []; };
      roles: { Row: { id: string; name: string; description: string | null; created_at: string; }; Insert: Partial<Database["public"]["Tables"]["roles"]["Row"]>; Update: Partial<Database["public"]["Tables"]["roles"]["Row"]>; Relationships: []; };
      user_roles: { Row: { user_id: string; role_id: string; created_at: string; }; Insert: { user_id: string; role_id: string }; Update: Partial<Database["public"]["Tables"]["user_roles"]["Row"]>; Relationships: []; };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};