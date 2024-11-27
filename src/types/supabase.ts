export interface Database {
  public: {
    Tables: {
      equipment_certifications: {
        Row: {
          id: string;
          equipment_id: string;
          certification_name: string;
          issue_date: string;
          expiry_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          certification_name: string;
          issue_date: string;
          expiry_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipment_id?: string;
          certification_name?: string;
          issue_date?: string;
          expiry_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipment_sustainability: {
        Row: {
          id: string;
          equipment_id: string;
          paper_saved: number;
          energy_saved: number;
          co2_reduced: number;
          trees_saved: number;
          water_saved: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          paper_saved?: number;
          energy_saved?: number;
          co2_reduced?: number;
          trees_saved?: number;
          water_saved?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipment_id?: string;
          paper_saved?: number;
          energy_saved?: number;
          co2_reduced?: number;
          trees_saved?: number;
          water_saved?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipment_status: {
        Row: {
          id: string;
          equipment_id: string;
          status: 'online' | 'offline' | 'error' | 'maintenance';
          last_check: string;
          details: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          status: 'online' | 'offline' | 'error' | 'maintenance';
          last_check: string;
          details?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipment_id?: string;
          status?: 'online' | 'offline' | 'error' | 'maintenance';
          last_check?: string;
          details?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipment_alerts: {
        Row: {
          id: string;
          equipment_id: string;
          type: 'error' | 'warning' | 'maintenance' | 'sustainability';
          severity: 'low' | 'medium' | 'high';
          message: string;
          status: 'active' | 'resolved';
          context: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          type: 'error' | 'warning' | 'maintenance' | 'sustainability';
          severity: 'low' | 'medium' | 'high';
          message: string;
          status: 'active' | 'resolved';
          context?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipment_id?: string;
          type?: 'error' | 'warning' | 'maintenance' | 'sustainability';
          severity?: 'low' | 'medium' | 'high';
          message?: string;
          status?: 'active' | 'resolved';
          context?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipment_history: {
        Row: {
          id: string;
          equipment_id: string;
          event_type: string;
          event_data: Record<string, any>;
          timestamp: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          event_type: string;
          event_data?: Record<string, any>;
          timestamp: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipment_id?: string;
          event_type?: string;
          event_data?: Record<string, any>;
          timestamp?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      equipment_costs: {
        Row: {
          id: string;
          equipment_id: string;
          cost_type: string;
          amount: number;
          date: string;
          details: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          cost_type: string;
          amount: number;
          date: string;
          details?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          equipment_id?: string;
          cost_type?: string;
          amount?: number;
          date?: string;
          details?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      print_jobs: {
        Row: {
          id: string;
          printer_id: string;
          user_id: string;
          document_id: string;
          status: 'pending' | 'printing' | 'completed' | 'failed' | 'cancelled';
          copies: number;
          pages: number;
          options: Record<string, any>;
          submit_time: string;
          complete_time?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          printer_id: string;
          user_id: string;
          document_id: string;
          status?: 'pending' | 'printing' | 'completed' | 'failed' | 'cancelled';
          copies: number;
          pages: number;
          options?: Record<string, any>;
          submit_time?: string;
          complete_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          printer_id?: string;
          user_id?: string;
          document_id?: string;
          status?: 'pending' | 'printing' | 'completed' | 'failed' | 'cancelled';
          copies?: number;
          pages?: number;
          options?: Record<string, any>;
          submit_time?: string;
          complete_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      scan_jobs: {
        Row: {
          id: string;
          printer_id: string;
          user_id: string;
          status: 'pending' | 'scanning' | 'completed' | 'failed' | 'cancelled';
          format: string;
          resolution: number;
          options: Record<string, any>;
          output_path?: string;
          submit_time: string;
          complete_time?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          printer_id: string;
          user_id: string;
          status?: 'pending' | 'scanning' | 'completed' | 'failed' | 'cancelled';
          format: string;
          resolution: number;
          options?: Record<string, any>;
          output_path?: string;
          submit_time?: string;
          complete_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          printer_id?: string;
          user_id?: string;
          status?: 'pending' | 'scanning' | 'completed' | 'failed' | 'cancelled';
          format?: string;
          resolution?: number;
          options?: Record<string, any>;
          output_path?: string;
          submit_time?: string;
          complete_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      printers: {
        Row: {
          id: string;
          name: string;
          model: string;
          location: string;
          capabilities: string[];
          status: 'online' | 'offline' | 'error' | 'maintenance';
          last_maintenance?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          model: string;
          location: string;
          capabilities?: string[];
          status?: 'online' | 'offline' | 'error' | 'maintenance';
          last_maintenance?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          model?: string;
          location?: string;
          capabilities?: string[];
          status?: 'online' | 'offline' | 'error' | 'maintenance';
          last_maintenance?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description?: string;
          file_url: string;
          file_type: string;
          file_size: number;
          user_id: string;
          created_at: string;
          updated_at: string;
          tags?: string[];
          version?: number;
          status: 'pending' | 'validated' | 'rejected';
          parent_id?: string;
          metadata?: {
            author?: string;
            lastModifiedBy?: string;
            pageCount?: number;
            keywords?: string[];
          };
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          file_url: string;
          file_type: string;
          file_size: number;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          tags?: string[];
          version?: number;
          status: 'pending' | 'validated' | 'rejected';
          parent_id?: string;
          metadata?: {
            author?: string;
            lastModifiedBy?: string;
            pageCount?: number;
            keywords?: string[];
          };
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          tags?: string[];
          version?: number;
          status?: 'pending' | 'validated' | 'rejected';
          parent_id?: string;
          metadata?: {
            author?: string;
            lastModifiedBy?: string;
            pageCount?: number;
            keywords?: string[];
          };
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
