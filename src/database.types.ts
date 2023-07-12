export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tracks: {
        Row: {
          artist: string
          created_at: string | null
          id: number
          is_duplicated: boolean
          length: number | null
          title: string
        }
        Insert: {
          artist: string
          created_at?: string | null
          id?: number
          is_duplicated?: boolean
          length?: number | null
          title: string
        }
        Update: {
          artist?: string
          created_at?: string | null
          id?: number
          is_duplicated?: boolean
          length?: number | null
          title?: string
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
