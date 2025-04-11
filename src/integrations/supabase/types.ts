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
      blog_posts: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_goal_benefits: {
        Row: {
          benefit: string
          business_goal_id: string
          created_at: string
          display_order: number
          id: string
          updated_at: string
        }
        Insert: {
          benefit: string
          business_goal_id: string
          created_at?: string
          display_order?: number
          id?: string
          updated_at?: string
        }
        Update: {
          benefit?: string
          business_goal_id?: string
          created_at?: string
          display_order?: number
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_goal_benefits_business_goal_id_fkey"
            columns: ["business_goal_id"]
            isOneToOne: false
            referencedRelation: "business_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      business_goal_feature_images: {
        Row: {
          alt: string
          created_at: string
          feature_id: string
          height: number | null
          id: string
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt: string
          created_at?: string
          feature_id: string
          height?: number | null
          id?: string
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string
          created_at?: string
          feature_id?: string
          height?: number | null
          id?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_goal_feature_images_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "business_goal_features"
            referencedColumns: ["id"]
          },
        ]
      }
      business_goal_features: {
        Row: {
          business_goal_id: string
          created_at: string
          description: string
          display_order: number
          icon: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          business_goal_id: string
          created_at?: string
          description: string
          display_order?: number
          icon?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          business_goal_id?: string
          created_at?: string
          description?: string
          display_order?: number
          icon?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_goal_features_business_goal_id_fkey"
            columns: ["business_goal_id"]
            isOneToOne: false
            referencedRelation: "business_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      business_goals: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          image_alt: string | null
          image_url: string | null
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
          image_alt?: string | null
          image_url?: string | null
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
          image_alt?: string | null
          image_url?: string | null
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
      product_type_feature_images: {
        Row: {
          alt: string
          created_at: string
          feature_id: string
          height: number | null
          id: string
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt: string
          created_at?: string
          feature_id: string
          height?: number | null
          id?: string
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string
          created_at?: string
          feature_id?: string
          height?: number | null
          id?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_type_feature_images_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "product_type_features"
            referencedColumns: ["id"]
          },
        ]
      }
      product_type_features: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string | null
          id: string
          product_type_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon?: string | null
          id?: string
          product_type_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string | null
          id?: string
          product_type_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_type_features_product_type_id_fkey"
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
      technologies: {
        Row: {
          created_at: string
          description: string
          id: string
          image_alt: string | null
          image_url: string | null
          slug: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_alt?: string | null
          image_url?: string | null
          slug: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_alt?: string | null
          image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      technology_feature_items: {
        Row: {
          created_at: string
          display_order: number
          feature_id: string
          id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          feature_id: string
          id?: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          feature_id?: string
          id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technology_feature_items_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "technology_features"
            referencedColumns: ["id"]
          },
        ]
      }
      technology_features: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          section_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          section_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          section_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technology_features_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "technology_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      technology_images: {
        Row: {
          alt: string
          created_at: string
          display_order: number
          height: number | null
          id: string
          section_id: string | null
          technology_id: string
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
          section_id?: string | null
          technology_id: string
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
          section_id?: string | null
          technology_id?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "technology_images_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "technology_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technology_images_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      technology_sections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          section_type: string
          technology_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          section_type: string
          technology_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          section_type?: string
          technology_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technology_sections_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
