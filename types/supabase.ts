export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      conversation_lists: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          list_id: string | null
          name: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          list_id?: string | null
          name: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          list_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_lists_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_lists_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          friendship_id: string | null
          id: string
          owner_id: string | null
          type: Database["public"]["Enums"]["conversation_type"]
        }
        Insert: {
          created_at?: string | null
          friendship_id?: string | null
          id?: string
          owner_id?: string | null
          type: Database["public"]["Enums"]["conversation_type"]
        }
        Update: {
          created_at?: string | null
          friendship_id?: string | null
          id?: string
          owner_id?: string | null
          type?: Database["public"]["Enums"]["conversation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "conversations_friendship_id_fkey"
            columns: ["friendship_id"]
            isOneToOne: false
            referencedRelation: "friends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          accepted: boolean | null
          created_at: string
          id: string
          receiver: string
          sender: string
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string
          id?: string
          receiver: string
          sender: string
        }
        Update: {
          accepted?: boolean | null
          created_at?: string
          id?: string
          receiver?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_receiver_fkey"
            columns: ["receiver"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          created_at: string
          id: string
          name: string | null
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lists_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          list_id: string
          sender: string | null
          tmdb_id: number
          tmdb_type: Database["public"]["Enums"]["tmdb_type_enum"]
        }
        Insert: {
          created_at?: string
          id?: string
          list_id: string
          sender?: string | null
          tmdb_id: number
          tmdb_type: Database["public"]["Enums"]["tmdb_type_enum"]
        }
        Update: {
          created_at?: string
          id?: string
          list_id?: string
          sender?: string | null
          tmdb_id?: number
          tmdb_type?: Database["public"]["Enums"]["tmdb_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          first_name: string | null
          id: string
          last_name: string | null
          urls: string[] | null
          username: string | null
          full_name: string | null
        }
        Insert: {
          bio?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          urls?: string[] | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          urls?: string[] | null
          username?: string | null
        }
        Relationships: []
      }
      watched: {
        Row: {
          created_at: string
          id: string
          tmdb_id: number
          tmdb_type: Database["public"]["Enums"]["tmdb_type_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tmdb_id: number
          tmdb_type: Database["public"]["Enums"]["tmdb_type_enum"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tmdb_id?: number
          tmdb_type?: Database["public"]["Enums"]["tmdb_type_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watched_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      messages_with_watched: {
        Row: {
          created_at: string | null
          id: string | null
          list_id: string | null
          sender: string | null
          tmdb_id: number | null
          tmdb_type: Database["public"]["Enums"]["tmdb_type_enum"] | null
          watched: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_fkey"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      full_name: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      get_conversation_id_for_duo: {
        Args: {
          requester_id: string
          requesting_id: string
        }
        Returns: string
      }
      get_conversations: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["CompositeTypes"]["conversation_with_user"][]
      }
      get_users_in_conversation: {
        Args: {
          p_conversation_id: string
        }
        Returns: {
          id: string
          first_name: string
          last_name: string
          username: string
          bio: string
          urls: string[]
        }[]
      }
    }
    Enums: {
      conversation_type: "group" | "friend"
      tmdb_type_enum: "movie" | "tv"
    }
    CompositeTypes: {
      conversation_with_user: {
        conversation_id: string | null
        conversation_type:
          | Database["public"]["Enums"]["conversation_type"]
          | null
        conversation_created_at: string | null
        friendship_id: string | null
        user_id: string | null
        first_name: string | null
        last_name: string | null
        username: string | null
        bio: string | null
        urls: string[] | null
      }
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
