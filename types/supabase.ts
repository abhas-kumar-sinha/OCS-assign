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
      users: {
        Row: {
          id: string
          userid: string
          password_hash: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          userid: string
          password_hash: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          userid?: string
          password_hash?: string
          role?: string
          created_at?: string
        }
      }
    }
  }
}