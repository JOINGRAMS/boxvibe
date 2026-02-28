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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          clerk_id: string
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          clerk_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          clerk_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      addresses: {
        Row: {
          address_detail: string | null
          address_name: string | null
          address_type: string | null
          appartment_no: string | null
          block: string
          building: string
          building_no: string | null
          city: string
          created_at: string
          customers_id: string | null
          flat: string | null
          floor_no: string | null
          house_no: string | null
          id: string
          instructions: string | null
          is_primary: boolean
          lat: number
          lng: number
          office_no: string | null
          officeName: string | null
          road: string
          updated_at: string
        }
        Insert: {
          address_detail?: string | null
          address_name?: string | null
          address_type?: string | null
          appartment_no?: string | null
          block: string
          building?: string
          building_no?: string | null
          city: string
          created_at?: string
          customers_id?: string | null
          flat?: string | null
          floor_no?: string | null
          house_no?: string | null
          id?: string
          instructions?: string | null
          is_primary: boolean
          lat: number
          lng: number
          office_no?: string | null
          officeName?: string | null
          road: string
          updated_at: string
        }
        Update: {
          address_detail?: string | null
          address_name?: string | null
          address_type?: string | null
          appartment_no?: string | null
          block?: string
          building?: string
          building_no?: string | null
          city?: string
          created_at?: string
          customers_id?: string | null
          flat?: string | null
          floor_no?: string | null
          house_no?: string | null
          id?: string
          instructions?: string | null
          is_primary?: boolean
          lat?: number
          lng?: number
          office_no?: string | null
          officeName?: string | null
          road?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customers_id_customers_id_fk"
            columns: ["customers_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      available_plan_addons: {
        Row: {
          addon_id: string | null
          created_at: string
          id: string
          plan_id: string | null
          updated_at: string
        }
        Insert: {
          addon_id?: string | null
          created_at?: string
          id?: string
          plan_id?: string | null
          updated_at: string
        }
        Update: {
          addon_id?: string | null
          created_at?: string
          id?: string
          plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "available_package_addons_addon_id_item_categories_id_fk"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "available_package_addons_package_id_packages_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_form: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          account_id: string | null
          activityLevel: string | null
          birthday: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          credit: number | null
          dislikes: string[] | null
          email: string
          gender: string | null
          goal: string | null
          height: string | null
          id: string
          mobile: string | null
          name: string | null
          package_id: string | null
          targetWeight: string | null
          updated_at: string | null
          weight: string | null
        }
        Insert: {
          account_id?: string | null
          activityLevel?: string | null
          birthday?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          credit?: number | null
          dislikes?: string[] | null
          email: string
          gender?: string | null
          goal?: string | null
          height?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          package_id?: string | null
          targetWeight?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Update: {
          account_id?: string | null
          activityLevel?: string | null
          birthday?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          credit?: number | null
          dislikes?: string[] | null
          email?: string
          gender?: string | null
          goal?: string | null
          height?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          package_id?: string | null
          targetWeight?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_categoryId_package_categories_id_fk"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_items: {
        Row: {
          created_at: string
          deleted_at: string | null
          delivery_id: string
          id: string
          item_category_id: string
          item_id: string
          item_variant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          delivery_id: string
          id?: string
          item_category_id: string
          item_id: string
          item_variant_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          delivery_id?: string
          id?: string
          item_category_id?: string
          item_id?: string
          item_variant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_items_delivery_id_subscription_deliveries_id_fk"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "subscription_deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_items_item_category_id_item_categories_id_fk"
            columns: ["item_category_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_items_item_id_items_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_items_item_variant_id_item_variants_id_fk"
            columns: ["item_variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_timings: {
        Row: {
          created_at: string
          deleted_at: string | null
          end_time: string
          id: string
          is_active: boolean
          start_time: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          end_time: string
          id?: string
          is_active?: boolean
          start_time: string
          updated_at: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          end_time?: string
          id?: string
          is_active?: boolean
          start_time?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_timings_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_plans: {
        Row: {
          account_id: string
          created_at: string
          id: string
          plan_id: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          plan_id: string
          updated_at: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          plan_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorite_vendors: {
        Row: {
          account_id: string
          created_at: string
          id: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          updated_at: string
          vendor_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
      featured_vendors: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_vendors_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      item_categories: {
        Row: {
          category: string
          category_ar: string
          category_en: string
          created_at: string
          icon: string | null
          id: string
          information_id: string | null
          is_primary: boolean
          type_id: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category: string
          category_ar: string
          category_en: string
          created_at?: string
          icon?: string | null
          id?: string
          information_id?: string | null
          is_primary?: boolean
          type_id?: string | null
          updated_at: string
          vendor_id?: string | null
        }
        Update: {
          category?: string
          category_ar?: string
          category_en?: string
          created_at?: string
          icon?: string | null
          id?: string
          information_id?: string | null
          is_primary?: boolean
          type_id?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_categories_information_id_meals_category_information_id_fk"
            columns: ["information_id"]
            isOneToOne: false
            referencedRelation: "meals_category_information"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_categories_type_id_item_categories_type_id_fk"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "item_categories_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_categories_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      item_categories_configuration: {
        Row: {
          configuration_label: string
          configuration_label_ar: string
          configuration_label_en: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          configuration_label: string
          configuration_label_ar: string
          configuration_label_en: string
          created_at?: string
          id?: string
          updated_at: string
        }
        Update: {
          configuration_label?: string
          configuration_label_ar?: string
          configuration_label_en?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      item_categories_configuration_item_categories: {
        Row: {
          id: string
          item_categories_configuration_id: string
          item_category_type_id: string
        }
        Insert: {
          id?: string
          item_categories_configuration_id: string
          item_category_type_id: string
        }
        Update: {
          id?: string
          item_categories_configuration_id?: string
          item_category_type_id?: string
        }
        Relationships: []
      }
      item_categories_type: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          name_ar: string
          name_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          name_ar: string
          name_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          name_ar?: string
          name_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      item_detail_categories: {
        Row: {
          category: string
          category_ar: string
          category_en: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          category: string
          category_ar: string
          category_en: string
          created_at?: string
          id?: string
          updated_at: string
        }
        Update: {
          category?: string
          category_ar?: string
          category_en?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      item_details: {
        Row: {
          created_at: string
          detail_category_id: string
          detail_value: string
          id: string
          item_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          detail_category_id: string
          detail_value: string
          id?: string
          item_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          detail_category_id?: string
          detail_value?: string
          id?: string
          item_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_details_detail_category_id_item_detail_categories_id_fk"
            columns: ["detail_category_id"]
            isOneToOne: false
            referencedRelation: "item_detail_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_details_item_id_items_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      item_items: {
        Row: {
          amount: number
          created_at: string
          id: string
          item_id: string
          item_item_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          item_id: string
          item_item_id: string
          updated_at: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          item_id?: string
          item_item_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      item_tags: {
        Row: {
          created_at: string
          id: string
          item_id: string
          tag_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          tag_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          tag_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_tags_item_id_items_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_tags_tag_id_vendor_item_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "vendor_item_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      item_variant_details: {
        Row: {
          created_at: string
          detail_category_id: string
          detail_value: string
          id: string
          item_variant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          detail_category_id: string
          detail_value: string
          id?: string
          item_variant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          detail_category_id?: string
          detail_value?: string
          id?: string
          item_variant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_variant_details_detail_category_id_item_detail_categories_"
            columns: ["detail_category_id"]
            isOneToOne: false
            referencedRelation: "item_detail_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_variant_details_item_variant_id_item_variants_id_fk"
            columns: ["item_variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      item_variants: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          item_id: string
          portion_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          item_id: string
          portion_id?: string | null
          slug: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          item_id?: string
          portion_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_variants_item_id_items_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_variants_portion_id_portions_id_fk"
            columns: ["portion_id"]
            isOneToOne: false
            referencedRelation: "portions"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name_ar: string
          name_en: string
          slug: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar: string
          name_en: string
          slug: string
          updated_at: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar?: string
          name_en?: string
          slug?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_portions: {
        Row: {
          created_at: string
          id: string
          meal_category_information_id: string | null
          portion_id: string | null
          price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_category_information_id?: string | null
          portion_id?: string | null
          price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_category_information_id?: string | null
          portion_id?: string | null
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_portions_meal_category_information_id_meals_category_infor"
            columns: ["meal_category_information_id"]
            isOneToOne: false
            referencedRelation: "meals_category_information"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_portions_portion_id_portions_id_fk"
            columns: ["portion_id"]
            isOneToOne: false
            referencedRelation: "portions"
            referencedColumns: ["id"]
          },
        ]
      }
      meals_category_information: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_day: {
        Row: {
          created_at: string
          day: string
          id: string
          is_active: boolean
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          is_active?: boolean
          updated_at: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_day_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_day_item_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          item_category_id: string | null
          menu_day_id: string | null
          package_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          item_category_id?: string | null
          menu_day_id?: string | null
          package_id?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          item_category_id?: string | null
          menu_day_id?: string | null
          package_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_day_item_categories_item_category_id_item_categories_id_fk"
            columns: ["item_category_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_day_item_categories_menu_day_id_menu_day_id_fk"
            columns: ["menu_day_id"]
            isOneToOne: false
            referencedRelation: "menu_day"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_day_item_categories_package_category_id_package_categories"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_day_items: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          menu_day_item_category_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          menu_day_item_category_id?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          menu_day_item_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_day_items_item_id_items_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_day_items_menu_day_item_category_id_menu_day_item_categori"
            columns: ["menu_day_item_category_id"]
            isOneToOne: false
            referencedRelation: "menu_day_item_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          amount: number
          created_at: string
          id: string
          item_id: string
          order_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          item_id: string
          order_id: string
          updated_at: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          item_id?: string
          order_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          day: number
          delivery_address_id: string
          delivery_time: string
          id: string
          is_canceled: boolean
          is_delivered: boolean
          is_paid: boolean
          plan_id: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day: number
          delivery_address_id: string
          delivery_time: string
          id?: string
          is_canceled: boolean
          is_delivered: boolean
          is_paid: boolean
          plan_id: string
          subscription_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          day?: number
          delivery_address_id?: string
          delivery_time?: string
          id?: string
          is_canceled?: boolean
          is_delivered?: boolean
          is_paid?: boolean
          plan_id?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          category: string
          category_ar: string
          category_en: string
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          is_active: boolean
          is_custom: boolean
          price_multiplier: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category: string
          category_ar: string
          category_en: string
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          is_custom?: boolean
          price_multiplier?: number
          updated_at: string
          vendor_id?: string | null
        }
        Update: {
          category?: string
          category_ar?: string
          category_en?: string
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          is_custom?: boolean
          price_multiplier?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_categories_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          amount_paid: number
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          reason: string | null
          reference_id: string | null
          updated_at: string
          vendor_customer_id: string | null
        }
        Insert: {
          amount: number
          amount_paid: number
          created_at?: string
          currency: string
          customer_id?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          reason?: string | null
          reference_id?: string | null
          updated_at?: string
          vendor_customer_id?: string | null
        }
        Update: {
          amount?: number
          amount_paid?: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reason?: string | null
          reference_id?: string | null
          updated_at?: string
          vendor_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_vendor_customer_id_vendor_customers_id_fk"
            columns: ["vendor_customer_id"]
            isOneToOne: false
            referencedRelation: "vendor_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_items: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          item_index: number
          plan_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_index: number
          plan_id?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          item_index?: number
          plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_items_item_id_item_categories_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_items_package_id_packages_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_packages: {
        Row: {
          created_at: string
          id: string
          package_id: string | null
          plan_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          package_id?: string | null
          plan_id?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          package_id?: string | null
          plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_package_categories_category_id_package_categories_id_fk"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_package_categories_package_id_packages_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_variance: {
        Row: {
          created_at: string
          id: string
          plan_id: string | null
          total_price: number
          updated_at: string
          variance_name_ar: string
          variance_name_en: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id?: string | null
          total_price: number
          updated_at: string
          variance_name_ar: string
          variance_name_en: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string | null
          total_price?: number
          updated_at?: string
          variance_name_ar?: string
          variance_name_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_variance_package_id_packages_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_variance_item_categories: {
        Row: {
          created_at: string
          id: string
          item_category_id: string | null
          package_variance_id: string | null
          portion_size: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_category_id?: string | null
          package_variance_id?: string | null
          portion_size?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          item_category_id?: string | null
          package_variance_id?: string | null
          portion_size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_variance_item_categories_item_category_id_package_items"
            columns: ["item_category_id"]
            isOneToOne: false
            referencedRelation: "plan_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_variance_item_categories_package_variance_id_package_va"
            columns: ["package_variance_id"]
            isOneToOne: false
            referencedRelation: "plan_variance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_variance_item_categories_portion_size_meal_portions_id_"
            columns: ["portion_size"]
            isOneToOne: false
            referencedRelation: "meal_portions"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          cover_image: string | null
          created_at: string
          desc_ar: string | null
          desc_en: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          desc_ar?: string | null
          desc_en?: string | null
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          updated_at: string
          vendor_id: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          desc_ar?: string | null
          desc_en?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
      portions: {
        Row: {
          calories: number
          created_at: string
          id: string
          name: string
          name_ar: string
          name_en: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          calories: number
          created_at?: string
          id?: string
          name: string
          name_ar: string
          name_en: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          calories?: number
          created_at?: string
          id?: string
          name?: string
          name_ar?: string
          name_en?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portions_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      selected_packages: {
        Row: {
          id: string
          package_id: string | null
          plan_id: string | null
        }
        Insert: {
          id?: string
          package_id?: string | null
          plan_id?: string | null
        }
        Update: {
          id?: string
          package_id?: string | null
          plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "selected_package_categories_category_id_package_categories_id_f"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selected_package_categories_package_id_packages_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_addons: {
        Row: {
          addon_id: string | null
          created_at: string
          id: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          addon_id?: string | null
          created_at?: string
          id?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          addon_id?: string | null
          created_at?: string
          id?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_addons_addon_id_item_categories_id_fk"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_addons_subscription_id_subscriptions_id_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_deliveries: {
        Row: {
          canceled_at: string | null
          completed_at: string | null
          created_at: string
          delivery_date: string
          id: string
          note: string | null
          paused_at: string | null
          status: Database["public"]["Enums"]["delivery_status"]
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          completed_at?: string | null
          created_at?: string
          delivery_date: string
          id?: string
          note?: string | null
          paused_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          completed_at?: string | null
          created_at?: string
          delivery_date?: string
          id?: string
          note?: string | null
          paused_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_deliveries_subscription_id_subscriptions_id_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_payments: {
        Row: {
          created_at: string
          id: number
          payment_id: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          payment_id: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          payment_id?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_payment_id_payments_id_fk"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_payments_subscription_id_subscriptions_id_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_tags: {
        Row: {
          created_at: string
          id: string
          subscription_id: string | null
          tag_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          subscription_id?: string | null
          tag_id?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          subscription_id?: string | null
          tag_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_tags_subscription_id_subscriptions_id_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_tags_tag_id_vendor_subscriptions_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "vendor_subscriptions_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_weekly_days: {
        Row: {
          created_at: string
          day: number
          id: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day: number
          id?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day?: number
          id?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_weekly_days_subscription_id_subscriptions_id_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          approved_at: string | null
          canceled_at: string | null
          category_id: string
          channel: string
          created_at: string
          created_by: string | null
          days_left: number
          deleted_at: string | null
          delivery_address_id: string | null
          delivery_days_price: number
          delivery_time_id: string | null
          id: string
          note: string | null
          number_of_days: number
          paid_at: string | null
          paused_at: string | null
          plan_id: string
          plan_variant_id: string | null
          resumed_at: string | null
          start_date: string
          status: string
          total_price: number
          updated_at: string
          updated_by: string | null
          vendor_customer_id: string
          vendor_id: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          canceled_at?: string | null
          category_id: string
          channel: string
          created_at?: string
          created_by?: string | null
          days_left: number
          deleted_at?: string | null
          delivery_address_id?: string | null
          delivery_days_price?: number
          delivery_time_id?: string | null
          id?: string
          note?: string | null
          number_of_days: number
          paid_at?: string | null
          paused_at?: string | null
          plan_id: string
          plan_variant_id?: string | null
          resumed_at?: string | null
          start_date: string
          status?: string
          total_price?: number
          updated_at: string
          updated_by?: string | null
          vendor_customer_id: string
          vendor_id: string
          version?: number
        }
        Update: {
          approved_at?: string | null
          canceled_at?: string | null
          category_id?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          days_left?: number
          deleted_at?: string | null
          delivery_address_id?: string | null
          delivery_days_price?: number
          delivery_time_id?: string | null
          id?: string
          note?: string | null
          number_of_days?: number
          paid_at?: string | null
          paused_at?: string | null
          plan_id?: string
          plan_variant_id?: string | null
          resumed_at?: string | null
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string
          updated_by?: string | null
          vendor_customer_id?: string
          vendor_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_category_id_package_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_delivery_address_id_addresses_id_fk"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_delivery_time_id_delivery_timings_id_fk"
            columns: ["delivery_time_id"]
            isOneToOne: false
            referencedRelation: "delivery_timings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_package_id_packages_id_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_package_variant_id_package_variance_id_fk"
            columns: ["plan_variant_id"]
            isOneToOne: false
            referencedRelation: "plan_variance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_vendor_customer_id_vendor_customers_id_fk"
            columns: ["vendor_customer_id"]
            isOneToOne: false
            referencedRelation: "vendor_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_addresses: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          id: string
          is_primary: boolean
          lang: number
          lat: number
          updated_at: string
          vendors_id: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          id?: string
          is_primary: boolean
          lang: number
          lat: number
          updated_at: string
          vendors_id: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          lang?: number
          lat?: number
          updated_at?: string
          vendors_id?: string
        }
        Relationships: []
      }
      vendor_customer_logs: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          log: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          log: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          log?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_logs_customer_id_vendor_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "vendor_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_logs_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_tags_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customers: {
        Row: {
          address_id: string | null
          country: string | null
          country_code: string | null
          created_at: string
          credit: number
          customer_id: string | null
          email: string
          id: string
          mobile: string | null
          name: string
          note: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          address_id?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          credit?: number
          customer_id?: string | null
          email: string
          id?: string
          mobile?: string | null
          name: string
          note?: string | null
          updated_at: string
          vendor_id?: string | null
        }
        Update: {
          address_id?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          credit?: number
          customer_id?: string | null
          email?: string
          id?: string
          mobile?: string | null
          name?: string
          note?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customers_address_id_addresses_id_fk"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customers_tags: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          tag_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          tag_id?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          tag_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customers_tags_customer_id_vendor_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "vendor_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_tags_tag_id_vendor_customer_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "vendor_customer_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_delivery_days: {
        Row: {
          day: number
          id: string
          is_active: boolean
          vendor_id: string
        }
        Insert: {
          day: number
          id?: string
          is_active?: boolean
          vendor_id: string
        }
        Update: {
          day?: number
          id?: string
          is_active?: boolean
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_delivery_days_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_delivery_timings: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_delivery_zone_delivery_time: {
        Row: {
          created_at: string
          delivery_time_id: string
          id: string
          updated_at: string
          vendor_delivery_zone_id: string
        }
        Insert: {
          created_at?: string
          delivery_time_id: string
          id?: string
          updated_at?: string
          vendor_delivery_zone_id: string
        }
        Update: {
          created_at?: string
          delivery_time_id?: string
          id?: string
          updated_at?: string
          vendor_delivery_zone_id?: string
        }
        Relationships: []
      }
      vendor_delivery_zones: {
        Row: {
          area_identifier: string | null
          center_lat: number | null
          center_lng: number | null
          coordinates: Json | null
          created_at: string
          delivery_charge: number | null
          id: string
          name: string
          radius: number | null
          updated_at: string
          vendor_id: string
          zone_type: string
        }
        Insert: {
          area_identifier?: string | null
          center_lat?: number | null
          center_lng?: number | null
          coordinates?: Json | null
          created_at?: string
          delivery_charge?: number | null
          id?: string
          name: string
          radius?: number | null
          updated_at?: string
          vendor_id: string
          zone_type: string
        }
        Update: {
          area_identifier?: string | null
          center_lat?: number | null
          center_lng?: number | null
          coordinates?: Json | null
          created_at?: string
          delivery_charge?: number | null
          id?: string
          name?: string
          radius?: number | null
          updated_at?: string
          vendor_id?: string
          zone_type?: string
        }
        Relationships: []
      }
      vendor_item_categories: {
        Row: {
          id: string
          item_categories_configuration_id: string
          vendor_id: string
        }
        Insert: {
          id?: string
          item_categories_configuration_id: string
          vendor_id: string
        }
        Update: {
          id?: string
          item_categories_configuration_id?: string
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_item_tags: {
        Row: {
          created_at: string
          id: string
          tag: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_item_tags_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_meals_portions: {
        Row: {
          id: string
          portion_id: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          portion_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          portion_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_meals_portions_portion_id_portions_id_fk"
            columns: ["portion_id"]
            isOneToOne: false
            referencedRelation: "portions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_meals_portions_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payment_methods: {
        Row: {
          created_at: string
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          updated_at: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payment_methods_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_subscription_frequency: {
        Row: {
          created_at: string
          deleted_at: string | null
          frequency_ar: string
          frequency_en: string
          frequency_price_multiplier: number
          id: string
          number_of_weeks: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          frequency_ar: string
          frequency_en: string
          frequency_price_multiplier: number
          id?: string
          number_of_weeks: number
          updated_at: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          frequency_ar?: string
          frequency_en?: string
          frequency_price_multiplier?: number
          id?: string
          number_of_weeks?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_subscription_frequency_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          id: string
          is_active: boolean
          number_of_days: number
          paused_at: string | null
          plan_id: string
          resumed_at: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          id?: string
          is_active: boolean
          number_of_days: number
          paused_at?: string | null
          plan_id: string
          resumed_at?: string | null
          start_date: string
          updated_at: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          number_of_days?: number
          paused_at?: string | null
          plan_id?: string
          resumed_at?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_subscriptions_packages: {
        Row: {
          created_at: string
          desc_ar: string | null
          desc_en: string | null
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          price: number
          tier: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          desc_ar?: string | null
          desc_en?: string | null
          id?: string
          is_active: boolean
          name_ar: string
          name_en: string
          price: number
          tier: number
          updated_at: string
        }
        Update: {
          created_at?: string
          desc_ar?: string | null
          desc_en?: string | null
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          price?: number
          tier?: number
          updated_at?: string
        }
        Relationships: []
      }
      vendor_subscriptions_tags: {
        Row: {
          created_at: string
          id: string
          tag: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          updated_at: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_subscriptions_tags_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_tags: {
        Row: {
          created_at: string
          id: string
          tag_ar: string
          tag_en: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag_ar: string
          tag_en: string
          updated_at: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag_ar?: string
          tag_en?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_tags_vendor_id_vendors_id_fk"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          about: string | null
          address_id: string | null
          brand_name: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string
          cover_image_url: string | null
          created_at: string
          currency: string
          delivery_fee: number | null
          id: string
          is_active: boolean
          is_free_trail: boolean
          item_categories_configuration_id: string | null
          logo_image_url: string | null
          name_ar: string
          name_en: string
          owner_id: string
          subscribed_at: string | null
          updated_at: string
          vendor_subscription_id: string | null
          vendor_type: Database["public"]["Enums"]["vendor_type"]
        }
        Insert: {
          about?: string | null
          address_id?: string | null
          brand_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country: string
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          delivery_fee?: number | null
          id?: string
          is_active: boolean
          is_free_trail: boolean
          item_categories_configuration_id?: string | null
          logo_image_url?: string | null
          name_ar: string
          name_en: string
          owner_id: string
          subscribed_at?: string | null
          updated_at: string
          vendor_subscription_id?: string | null
          vendor_type?: Database["public"]["Enums"]["vendor_type"]
        }
        Update: {
          about?: string | null
          address_id?: string | null
          brand_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          delivery_fee?: number | null
          id?: string
          is_active?: boolean
          is_free_trail?: boolean
          item_categories_configuration_id?: string | null
          logo_image_url?: string | null
          name_ar?: string
          name_en?: string
          owner_id?: string
          subscribed_at?: string | null
          updated_at?: string
          vendor_subscription_id?: string | null
          vendor_type?: Database["public"]["Enums"]["vendor_type"]
        }
        Relationships: []
      }
      vendors_users: {
        Row: {
          account_id: string
          created_at: string
          id: string
          is_owner: boolean
          updated_at: string
          vendors_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          is_owner?: boolean
          updated_at: string
          vendors_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          is_owner?: boolean
          updated_at?: string
          vendors_id?: string
        }
        Relationships: []
      }
      waiting_list_subscription: {
        Row: {
          approved_at: string | null
          created_at: string
          customer_id: string
          declined_at: string | null
          id: string
          package_id: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          customer_id: string
          declined_at?: string | null
          id?: string
          package_id: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          customer_id?: string
          declined_at?: string | null
          id?: string
          package_id?: string
          updated_at?: string
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
      delivery_status:
        | "scheduled"
        | "completed"
        | "canceled"
        | "paused"
        | "skipped"
        | "pending"
      payment_method: "credit_card" | "debit_card" | "apple_pay" | "cash"
      payment_reason: "subscription" | "other"
      payment_status: "pending" | "paid" | "failed"
      vendor_type: "MEAL_PLANS" | "GYMS"
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
  public: {
    Enums: {
      delivery_status: [
        "scheduled",
        "completed",
        "canceled",
        "paused",
        "skipped",
        "pending",
      ],
      payment_method: ["credit_card", "debit_card", "apple_pay", "cash"],
      payment_reason: ["subscription", "other"],
      payment_status: ["pending", "paid", "failed"],
      vendor_type: ["MEAL_PLANS", "GYMS"],
    },
  },
} as const
