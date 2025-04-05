export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_goals: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          slug: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      deployment_examples: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          image_alt: string
          image_url: string
          machine_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id?: string
          image_alt: string
          image_url: string
          machine_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_alt?: string
          image_url?: string
          machine_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployment_examples_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_features: {
        Row: {
          created_at: string
          display_order: number
          feature: string
          id: string
          machine_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          feature: string
          id?: string
          machine_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          feature?: string
          id?: string
          machine_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_features_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_images: {
        Row: {
          alt: string
          created_at: string
          display_order: number
          height: number | null
          id: string
          machine_id: string
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt: string
          created_at?: string
          display_order?: number
          height?: number | null
          id?: string
          machine_id: string
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string
          created_at?: string
          display_order?: number
          height?: number | null
          id?: string
          machine_id?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_images_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_specs: {
        Row: {
          created_at: string
          id: string
          key: string
          machine_id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          machine_id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          machine_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_specs_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      machines: {
        Row: {
          created_at: string
          description: string
          id: string
          slug: string
          temperature: string
          title: string
          type: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          slug: string
          temperature: string
          title: string
          type: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          slug?: string
          temperature?: string
          title?: string
          type?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      product_type_benefits: {
        Row: {
          benefit: string
          created_at: string
          display_order: number
          id: string
          product_type_id: string
          updated_at: string
        }
        Insert: {
          benefit: string
          created_at?: string
          display_order?: number
          id?: string
          product_type_id: string
          updated_at?: string
        }
        Update: {
          benefit?: string
          created_at?: string
          display_order?: number
          id?: string
          product_type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_type_benefits_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      product_type_images: {
        Row: {
          alt: string
          created_at: string
          height: number | null
          id: string
          product_type_id: string
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt: string
          created_at?: string
          height?: number | null
          id?: string
          product_type_id: string
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string
          created_at?: string
          height?: number | null
          id?: string
          product_type_id?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_type_images_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      product_types: {
        Row: {
          created_at: string
          description: string
          id: string
          slug: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          slug: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          company: string
          created_at: string
          id: string
          image_alt: string | null
          image_url: string | null
          position: string
          quote: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          author: string
          company: string
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url?: string | null
          position: string
          quote: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          author?: string
          company?: string
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url?: string | null
          position?: string
          quote?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
