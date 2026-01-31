export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionTier = 'free' | 'starter' | 'pro'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing'
export type TestimonialStatus = 'pending' | 'approved' | 'rejected'
export type WidgetLayout = 'grid' | 'carousel' | 'spotlight' | 'wall' | 'badge'
export type MilestoneType = 'revenue' | 'users' | 'launch' | 'anniversary' | 'custom'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          website_url: string | null
          subscription_tier: SubscriptionTier
          subscription_status: SubscriptionStatus
          lemon_squeezy_customer_id: string | null
          lemon_squeezy_subscription_id: string | null
          testimonial_count: number
          widget_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          website_url?: string | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id?: string | null
          testimonial_count?: number
          widget_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          website_url?: string | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id?: string | null
          testimonial_count?: number
          widget_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      collection_pages: {
        Row: {
          id: string
          user_id: string
          slug: string
          title: string
          description: string | null
          logo_url: string | null
          primary_color: string
          questions: Json
          thank_you_message: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          title: string
          description?: string | null
          logo_url?: string | null
          primary_color?: string
          questions?: Json
          thank_you_message?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          title?: string
          description?: string | null
          logo_url?: string | null
          primary_color?: string
          questions?: Json
          thank_you_message?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          user_id: string
          collection_page_id: string | null
          author_name: string
          author_email: string | null
          author_title: string | null
          author_company: string | null
          author_avatar_url: string | null
          author_social_url: string | null
          content: string
          rating: number | null
          status: TestimonialStatus
          source: string
          source_url: string | null
          tags: string[]
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          collection_page_id?: string | null
          author_name: string
          author_email?: string | null
          author_title?: string | null
          author_company?: string | null
          author_avatar_url?: string | null
          author_social_url?: string | null
          content: string
          rating?: number | null
          status?: TestimonialStatus
          source?: string
          source_url?: string | null
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          collection_page_id?: string | null
          author_name?: string
          author_email?: string | null
          author_title?: string | null
          author_company?: string | null
          author_avatar_url?: string | null
          author_social_url?: string | null
          content?: string
          rating?: number | null
          status?: TestimonialStatus
          source?: string
          source_url?: string | null
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      widgets: {
        Row: {
          id: string
          user_id: string
          name: string
          layout: WidgetLayout
          testimonial_ids: string[]
          settings: Json
          is_active: boolean
          impressions: number
          clicks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          layout?: WidgetLayout
          testimonial_ids?: string[]
          settings?: Json
          is_active?: boolean
          impressions?: number
          clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          layout?: WidgetLayout
          testimonial_ids?: string[]
          settings?: Json
          is_active?: boolean
          impressions?: number
          clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          user_id: string
          type: MilestoneType
          title: string
          value: number | null
          target_value: number | null
          achieved_at: string | null
          settings: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: MilestoneType
          title: string
          value?: number | null
          target_value?: number | null
          achieved_at?: string | null
          settings?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: MilestoneType
          title?: string
          value?: number | null
          target_value?: number | null
          achieved_at?: string | null
          settings?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          provider: string
          access_token: string | null
          refresh_token: string | null
          expires_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: SubscriptionTier
      subscription_status: SubscriptionStatus
      testimonial_status: TestimonialStatus
      widget_layout: WidgetLayout
      milestone_type: MilestoneType
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type CollectionPage = Database['public']['Tables']['collection_pages']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type Widget = Database['public']['Tables']['widgets']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']
export type Integration = Database['public']['Tables']['integrations']['Row']

export interface WidgetSettings {
  backgroundColor: string
  textColor: string
  accentColor: string
  borderRadius: number
  showAvatar: boolean
  showRating: boolean
  showDate: boolean
  showCompany: boolean
  fontFamily: string
  maxTestimonials: number
  autoplay: boolean
  autoplayInterval: number
  showBranding: boolean
}

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  accentColor: '#3b82f6',
  borderRadius: 8,
  showAvatar: true,
  showRating: true,
  showDate: false,
  showCompany: true,
  fontFamily: 'system-ui',
  maxTestimonials: 10,
  autoplay: true,
  autoplayInterval: 5000,
  showBranding: true,
}

export const TIER_LIMITS = {
  free: {
    testimonials: 3,
    widgets: 1,
    collectionPages: 1,
    milestones: 0,
    removeBranding: false,
    integrations: false,
  },
  starter: {
    testimonials: 25,
    widgets: 3,
    collectionPages: 3,
    milestones: 3,
    removeBranding: true,
    integrations: false,
  },
  pro: {
    testimonials: Infinity,
    widgets: Infinity,
    collectionPages: Infinity,
    milestones: Infinity,
    removeBranding: true,
    integrations: true,
  },
} as const
