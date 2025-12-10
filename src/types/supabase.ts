export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      action_positions: {
        Row: {
          action_id: number
          created_at: string | null
          id: number
          position_id: number
        }
        Insert: {
          action_id: number
          created_at?: string | null
          id?: number
          position_id: number
        }
        Update: {
          action_id?: number
          created_at?: string | null
          id?: number
          position_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "action_positions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_positions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "action_positions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "action_positions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "action_positions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      actions: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          name_norm: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          name_norm?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          name_norm?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          action1: string | null
          action2: string | null
          action3: string | null
          amount: number | null
          created_at: string | null
          id: number
          invoice_id: string
          line_no: number
          performed_at: string | null
          position1: string | null
          position2: string | null
          position3: string | null
          position4: string | null
          position5: string | null
          quantity: number | null
          raw_label: string | null
          sub_no: number
          target: string | null
          task_type: string
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          action1?: string | null
          action2?: string | null
          action3?: string | null
          amount?: number | null
          created_at?: string | null
          id?: number
          invoice_id: string
          line_no: number
          performed_at?: string | null
          position1?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          quantity?: number | null
          raw_label?: string | null
          sub_no?: number
          target?: string | null
          task_type: string
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          action1?: string | null
          action2?: string | null
          action3?: string | null
          amount?: number | null
          created_at?: string | null
          id?: number
          invoice_id?: string
          line_no?: number
          performed_at?: string | null
          position1?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          quantity?: number | null
          raw_label?: string | null
          sub_no?: number
          target?: string | null
          task_type?: string
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoice_line_items_split: {
        Row: {
          action: string | null
          amount: number | null
          confidence_score: number | null
          created_at: string | null
          extraction_method: string | null
          id: number
          invoice_id: string
          is_cancelled: boolean
          is_latest: boolean
          line_no: number
          notes: string | null
          other: string | null
          quantity: number
          raw_label_full: string | null
          raw_label_part: string
          record_type: string | null
          set_name: string | null
          sub_no: number
          target: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          action?: string | null
          amount?: number | null
          confidence_score?: number | null
          created_at?: string | null
          extraction_method?: string | null
          id?: number
          invoice_id: string
          is_cancelled?: boolean
          is_latest?: boolean
          line_no: number
          notes?: string | null
          other?: string | null
          quantity?: number
          raw_label_full?: string | null
          raw_label_part: string
          record_type?: string | null
          set_name?: string | null
          sub_no: number
          target?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          action?: string | null
          amount?: number | null
          confidence_score?: number | null
          created_at?: string | null
          extraction_method?: string | null
          id?: number
          invoice_id?: string
          is_cancelled?: boolean
          is_latest?: boolean
          line_no?: number
          notes?: string | null
          other?: string | null
          quantity?: number
          raw_label_full?: string | null
          raw_label_part?: string
          record_type?: string | null
          set_name?: string | null
          sub_no?: number
          target?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_payments: {
        Row: {
          created_at: string | null
          id: number
          invoice_id: string
          notes: string | null
          payment_amount: number
          payment_date: string
          payment_method: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          invoice_id: string
          notes?: string | null
          payment_amount: number
          payment_date: string
          payment_method?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          invoice_id?: string
          notes?: string | null
          payment_amount?: number
          payment_date?: string
          payment_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_invoice"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoices: {
        Row: {
          billing_date: string | null
          billing_month: string | null
          created_at: string | null
          customer_category: string | null
          customer_name: string | null
          invoice_id: string
          invoice_number: string | null
          invoice_type: string | null
          issue_date: string | null
          order_id: string | null
          order_number: string | null
          original_invoice_id: string | null
          payment_status: string | null
          purchase_order_number: string | null
          registration_number: string | null
          remarks: string | null
          status: string | null
          subject: string | null
          subject_name: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          billing_date?: string | null
          billing_month?: string | null
          created_at?: string | null
          customer_category?: string | null
          customer_name?: string | null
          invoice_id: string
          invoice_number?: string | null
          invoice_type?: string | null
          issue_date?: string | null
          order_id?: string | null
          order_number?: string | null
          original_invoice_id?: string | null
          payment_status?: string | null
          purchase_order_number?: string | null
          registration_number?: string | null
          remarks?: string | null
          status?: string | null
          subject?: string | null
          subject_name?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          billing_date?: string | null
          billing_month?: string | null
          created_at?: string | null
          customer_category?: string | null
          customer_name?: string | null
          invoice_id?: string
          invoice_number?: string | null
          invoice_type?: string | null
          issue_date?: string | null
          order_id?: string | null
          order_number?: string | null
          original_invoice_id?: string | null
          payment_status?: string | null
          purchase_order_number?: string | null
          registration_number?: string | null
          remarks?: string | null
          status?: string | null
          subject?: string | null
          subject_name?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoices_original"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      legacy_line_item_raws: {
        Row: {
          id: number
          line_item_id: number
          raw_text: string
        }
        Insert: {
          id?: number
          line_item_id: number
          raw_text: string
        }
        Update: {
          id?: number
          line_item_id?: number
          raw_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_legacy_line_item"
            columns: ["line_item_id"]
            isOneToOne: true
            referencedRelation: "invoice_line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          name_norm: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          name_norm?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          name_norm?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      price_suggestions: {
        Row: {
          action_id: number
          created_at: string | null
          id: number
          last_used_at: string | null
          suggested_price: number
          target_id: number
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          action_id: number
          created_at?: string | null
          id?: number
          last_used_at?: string | null
          suggested_price: number
          target_id: number
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          action_id?: number
          created_at?: string | null
          id?: number
          last_used_at?: string | null
          suggested_price?: number
          target_id?: number
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_suggestions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_suggestions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "price_suggestions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "price_suggestions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "price_suggestions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "price_suggestions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_mappings: {
        Row: {
          created_at: string | null
          id: number
          normalized: string | null
          reading_hiragana: string
          reading_katakana: string
          updated_at: string | null
          word: string
          word_type: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          normalized?: string | null
          reading_hiragana?: string
          reading_katakana?: string
          updated_at?: string | null
          word: string
          word_type: string
        }
        Update: {
          created_at?: string | null
          id?: number
          normalized?: string | null
          reading_hiragana?: string
          reading_katakana?: string
          updated_at?: string | null
          word?: string
          word_type?: string
        }
        Relationships: []
      }
      registration_number_master: {
        Row: {
          category_code: string | null
          created_at: string
          id: string
          is_active: boolean
          last_used_at: string | null
          region: string | null
          registration_number: string
          sequence_number: string | null
          suffix: string | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          category_code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          region?: string | null
          registration_number: string
          sequence_number?: string | null
          suffix?: string | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category_code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          region?: string | null
          registration_number?: string
          sequence_number?: string | null
          suffix?: string | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      subject_master: {
        Row: {
          created_at: string
          id: string
          subject_name: string
          subject_name_kana: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          subject_name: string
          subject_name_kana?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          subject_name?: string
          subject_name_kana?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subject_registration_numbers: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          last_used_at: string | null
          registration_number_id: string
          subject_id: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          last_used_at?: string | null
          registration_number_id: string
          subject_id: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          last_used_at?: string | null
          registration_number_id?: string
          subject_id?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "subject_registration_numbers_registration_number_id_fkey"
            columns: ["registration_number_id"]
            isOneToOne: false
            referencedRelation: "registration_number_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_registration_numbers_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subject_master"
            referencedColumns: ["id"]
          },
        ]
      }
      target_action_positions: {
        Row: {
          action_id: number
          created_at: string | null
          id: number
          is_recommended: boolean | null
          position_id: number | null
          target_id: number
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          action_id: number
          created_at?: string | null
          id?: number
          is_recommended?: boolean | null
          position_id?: number | null
          target_id: number
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          action_id?: number
          created_at?: string | null
          id?: number
          is_recommended?: boolean | null
          position_id?: number | null
          target_id?: number
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "target_action_positions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "target_action_positions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "target_action_positions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "target_action_positions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "target_action_positions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "target_action_positions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "target_action_positions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "target_action_positions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
        ]
      }
      target_actions: {
        Row: {
          action_id: number
          created_at: string | null
          id: number
          target_id: number
        }
        Insert: {
          action_id: number
          created_at?: string | null
          id?: number
          target_id: number
        }
        Update: {
          action_id?: number
          created_at?: string | null
          id?: number
          target_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "target_actions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "target_actions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "target_actions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "target_actions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "target_actions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "target_actions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
        ]
      }
      targets: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          name_norm: string | null
          reading: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          name_norm?: string | null
          reading?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          name_norm?: string | null
          reading?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      task_master: {
        Row: {
          canonical_name: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          last_used_at: string | null
          sort_order: number
          updated_at: string
          usage_count: number
        }
        Insert: {
          canonical_name: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          sort_order?: number
          updated_at?: string
          usage_count?: number
        }
        Update: {
          canonical_name?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          sort_order?: number
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: number
          preference_key: string
          preference_value: string
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          preference_key: string
          preference_value: string
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          preference_key?: string
          preference_value?: string
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      work_history: {
        Row: {
          action_id: number | null
          created_at: string | null
          id: number
          invoice_id: number | null
          memo: string | null
          position_id: number | null
          quantity: number | null
          raw_label: string | null
          target_id: number | null
          task_type: string | null
          total_amount: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          action_id?: number | null
          created_at?: string | null
          id?: number
          invoice_id?: number | null
          memo?: string | null
          position_id?: number | null
          quantity?: number | null
          raw_label?: string | null
          target_id?: number | null
          task_type?: string | null
          total_amount?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          action_id?: number | null
          created_at?: string | null
          id?: number
          invoice_id?: number | null
          memo?: string | null
          position_id?: number | null
          quantity?: number | null
          raw_label?: string | null
          target_id?: number | null
          task_type?: string | null
          total_amount?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "work_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
        ]
      }
      work_item_positions: {
        Row: {
          created_at: string | null
          id: number
          position: string
          split_item_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          position: string
          split_item_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          position?: string
          split_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_positions_split_item"
            columns: ["split_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_line_items_split"
            referencedColumns: ["id"]
          },
        ]
      }
      work_set_details: {
        Row: {
          action_id: number
          created_at: string | null
          id: number
          memo: string | null
          position_id: number | null
          sort_order: number | null
          target_id: number
          updated_at: string | null
          work_set_id: number
        }
        Insert: {
          action_id: number
          created_at?: string | null
          id?: number
          memo?: string | null
          position_id?: number | null
          sort_order?: number | null
          target_id: number
          updated_at?: string | null
          work_set_id: number
        }
        Update: {
          action_id?: number
          created_at?: string | null
          id?: number
          memo?: string | null
          position_id?: number | null
          sort_order?: number | null
          target_id?: number
          updated_at?: string | null
          work_set_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_set_details_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_set_details_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_set_details_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_set_details_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "work_set_details_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_set_details_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_set_details_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_set_details_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_set_details_work_set_id_fkey"
            columns: ["work_set_id"]
            isOneToOne: false
            referencedRelation: "work_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      work_sets: {
        Row: {
          created_at: string | null
          id: number
          invoice_id: number | null
          quantity: number | null
          set_name: string
          total_amount: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          invoice_id?: number | null
          quantity?: number | null
          set_name: string
          total_amount?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          invoice_id?: number | null
          quantity?: number | null
          set_name?: string
          total_amount?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_management: {
        Row: {
          id: string
          google_email: string
          display_name: string | null
          status: "pending" | "approved" | "rejected"
          requested_at: string | null
          approved_at: string | null
          approved_by: string | null
          last_login_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          google_email: string
          display_name?: string | null
          status?: "pending" | "approved" | "rejected"
          requested_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          google_email?: string
          display_name?: string | null
          status?: "pending" | "approved" | "rejected"
          requested_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_info: {
        Row: {
          id: string
          user_id: string | null
          company_name: string | null
          company_name_kana: string | null
          representative_name: string | null
          postal_code: string | null
          prefecture: string | null
          city: string | null
          address: string | null
          building_name: string | null
          phone_number: string | null
          fax_number: string | null
          mobile_number: string | null
          email: string | null
          website: string | null
          fiscal_year_end_month: string | null
          tax_registration_number: string | null
          invoice_registration_number: string | null
          bank_name: string | null
          bank_branch: string | null
          account_type: string | null
          account_number: string | null
          account_holder: string | null
          remarks: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          company_name_kana?: string | null
          representative_name?: string | null
          postal_code?: string | null
          prefecture?: string | null
          city?: string | null
          address?: string | null
          building_name?: string | null
          phone_number?: string | null
          fax_number?: string | null
          mobile_number?: string | null
          email?: string | null
          website?: string | null
          fiscal_year_end_month?: string | null
          tax_registration_number?: string | null
          invoice_registration_number?: string | null
          bank_name?: string | null
          bank_branch?: string | null
          account_type?: string | null
          account_number?: string | null
          account_holder?: string | null
          remarks?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string | null
          company_name_kana?: string | null
          representative_name?: string | null
          postal_code?: string | null
          prefecture?: string | null
          city?: string | null
          address?: string | null
          building_name?: string | null
          phone_number?: string | null
          fax_number?: string | null
          mobile_number?: string | null
          email?: string | null
          website?: string | null
          fiscal_year_end_month?: string | null
          tax_registration_number?: string | null
          invoice_registration_number?: string | null
          bank_name?: string | null
          bank_branch?: string | null
          account_type?: string | null
          account_number?: string | null
          account_holder?: string | null
          remarks?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      available_actions_by_target: {
        Row: {
          action_id: number | null
          action_name: string | null
          sort_order: number | null
          target_id: number | null
          target_name: string | null
        }
        Relationships: []
      }
      available_positions_by_target_action: {
        Row: {
          action_id: number | null
          action_name: string | null
          is_recommended: boolean | null
          position_id: number | null
          position_name: string | null
          position_sort_order: number | null
          target_id: number | null
          target_name: string | null
          usage_count: number | null
        }
        Relationships: []
      }
      searchable_items: {
        Row: {
          id: number | null
          item_type: string | null
          match_type: string | null
          name: string | null
          search_text: string | null
          sort_order: number | null
        }
        Relationships: []
      }
      work_history_complete_view: {
        Row: {
          action_id: number | null
          action_name: string | null
          created_at: string | null
          id: number | null
          invoice_id: number | null
          memo: string | null
          position_id: number | null
          position_name: string | null
          quantity: number | null
          raw_label: string | null
          target_id: number | null
          target_name: string | null
          task_type: string | null
          total_amount: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "work_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
        ]
      }
      work_history_view: {
        Row: {
          action_id: number | null
          action_name: string | null
          created_at: string | null
          id: number | null
          invoice_id: number | null
          memo: string | null
          position_id: number | null
          position_name: string | null
          quantity: number | null
          raw_label: string | null
          target_id: number | null
          target_name: string | null
          task_type: string | null
          total_amount: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "work_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
        ]
      }
      work_set_details_view: {
        Row: {
          action_id: number | null
          action_name: string | null
          created_at: string | null
          id: number | null
          memo: string | null
          position_id: number | null
          position_name: string | null
          sort_order: number | null
          target_id: number | null
          target_name: string | null
          updated_at: string | null
          work_set_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_set_details_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_set_details_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_set_details_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["action_id"]
          },
          {
            foreignKeyName: "work_set_details_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "work_set_details_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_set_details_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_actions_by_target"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_set_details_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "available_positions_by_target_action"
            referencedColumns: ["target_id"]
          },
          {
            foreignKeyName: "work_set_details_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_set_details_work_set_id_fkey"
            columns: ["work_set_id"]
            isOneToOne: false
            referencedRelation: "work_sets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
