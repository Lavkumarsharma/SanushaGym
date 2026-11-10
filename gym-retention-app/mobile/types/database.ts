export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          current_streak: number;
          total_check_ins: number;
          communication_opt_in: boolean;
          whatsapp_opt_in: boolean;
          email_opt_in: boolean;
          sms_opt_in: boolean;
          push_opt_in: boolean;
          join_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          current_streak?: number;
          total_check_ins?: number;
          communication_opt_in?: boolean;
          whatsapp_opt_in?: boolean;
          email_opt_in?: boolean;
          sms_opt_in?: boolean;
          push_opt_in?: boolean;
          join_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          current_streak?: number;
          total_check_ins?: number;
          communication_opt_in?: boolean;
          whatsapp_opt_in?: boolean;
          email_opt_in?: boolean;
          sms_opt_in?: boolean;
          push_opt_in?: boolean;
          join_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          type: string;
          duration_months: number;
          base_price: number;
          discount: number;
          final_amount: number;
          benefits: string[] | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          duration_months: number;
          base_price: number;
          discount: number;
          final_amount: number;
          benefits?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          duration_months?: number;
          base_price?: number;
          discount?: number;
          final_amount?: number;
          benefits?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          member_id: string;
          plan_id: string | null;
          plan_name: string | null;
          plan_type: string | null;
          base_price: number | null;
          discount: number | null;
          final_amount: number | null;
          expiry_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          plan_id?: string | null;
          plan_name?: string | null;
          plan_type?: string | null;
          base_price?: number | null;
          discount?: number | null;
          final_amount?: number | null;
          expiry_date: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          plan_id?: string | null;
          plan_name?: string | null;
          plan_type?: string | null;
          base_price?: number | null;
          discount?: number | null;
          final_amount?: number | null;
          expiry_date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          member_id: string;
          qr_session_id: string | null;
          source: string;
          check_in_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          qr_session_id?: string | null;
          source?: string;
          check_in_time?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          qr_session_id?: string | null;
          source?: string;
          check_in_time?: string;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          member_id: string;
          order_id: string | null;
          amount: number;
          status: string;
          provider: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          order_id?: string | null;
          amount: number;
          status?: string;
          provider?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          order_id?: string | null;
          amount?: number;
          status?: string;
          provider?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      add_ons: {
        Row: {
          id: string;
          name: string;
          type: string;
          price: number;
          validity_days: number;
          stock: number | null;
          trainer_name: string | null;
          trainer_qualification: string | null;
          cancellation_terms: string;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          price: number;
          validity_days: number;
          stock?: number | null;
          trainer_name?: string | null;
          trainer_qualification?: string | null;
          cancellation_terms: string;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          price?: number;
          validity_days?: number;
          stock?: number | null;
          trainer_name?: string | null;
          trainer_qualification?: string | null;
          cancellation_terms?: string;
          is_available?: boolean;
          created_at?: string;
        };
      };
      no_show_cases: {
        Row: {
          id: string;
          member_id: string;
          threshold_crossed_days: number;
          opened_at: string;
          is_resolved: boolean;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          threshold_crossed_days: number;
          opened_at?: string;
          is_resolved?: boolean;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          threshold_crossed_days?: number;
          opened_at?: string;
          is_resolved?: boolean;
          resolved_at?: string | null;
        };
      };
      follow_ups: {
        Row: {
          id: string;
          member_id: string;
          outcome: string | null;
          next_action_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          outcome?: string | null;
          next_action_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          outcome?: string | null;
          next_action_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          member_id: string;
          type: string;
          title: string;
          message: string;
          channel: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          type: string;
          title: string;
          message: string;
          channel: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          type?: string;
          title?: string;
          message?: string;
          channel?: string;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: string;
          old_values: string | null;
          new_values: string | null;
          changed_by: string | null;
          changed_at: string;
        };
        Insert: {
          id?: string;
          table_name: string;
          record_id: string;
          action: string;
          old_values?: string | null;
          new_values?: string | null;
          changed_by?: string | null;
          changed_at?: string;
        };
        Update: {
          id?: string;
          table_name?: string;
          record_id?: string;
          action?: string;
          old_values?: string | null;
          new_values?: string | null;
          changed_by?: string | null;
          changed_at?: string;
        };
      };
    };
    Views: {
      [_ in string]: never;
    };
    Functions: {
      [_ in string]: never;
    };
    Enums: {
      [_ in string]: never;
    };
    CompositeTypes: {
      [_ in string]: never;
    };
  };
}
