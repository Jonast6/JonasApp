// Type definitions for the Fußball Event Manager application

export interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  name: 'winter' | 'summer';
  display_name: string;
  created_at: string;
}

export interface Utensil {
  id: string;
  name: string;
  season_id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  event_date: string; // ISO date string
  time_from: string; // HH:mm format
  time_to: string; // HH:mm format
  location: string;
  season_id: string;
  notes?: string;
  is_series: boolean;
  series_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EventWithDetails extends Event {
  season_name: 'winter' | 'summer';
  season_display_name: string;
  confirmed_count: number;
  declined_count: number;
  pending_count: number;
  total_guests: number;
}

export interface EventSeries {
  id: string;
  title: string;
  weekday: number; // 0-6, 0=Monday
  date_from: string;
  date_to: string;
  time_from: string;
  time_to: string;
  location: string;
  season_id: string;
  notes?: string;
  created_at: string;
}

export type RegistrationStatus = 'confirmed' | 'declined' | 'pending';

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: RegistrationStatus;
  guest_count: number;
  created_at: string;
  updated_at: string;
}

export interface RegistrationUtensil {
  id: string;
  registration_id: string;
  utensil_id: string;
  created_at: string;
}

// Combined types for UI components
export interface RegistrationWithUser extends Registration {
  user: User;
  utensils: Utensil[];
}

export interface EventRegistrationData {
  event: EventWithDetails;
  registrations: RegistrationWithUser[];
  utensils: Utensil[];
}

// Form types
export interface EventFormData {
  title: string;
  event_date: string;
  time_from: string;
  time_to: string;
  location: string;
  season_id: string;
  notes?: string;
}

export interface EventSeriesFormData {
  title: string;
  weekday: number;
  date_from: string;
  date_to: string;
  time_from: string;
  time_to: string;
  location: string;
  season_id: string;
  notes?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
}

export interface UtensilFormData {
  name: string;
  season_id: string;
}

export interface RegistrationFormData {
  status: RegistrationStatus;
  guest_count: number;
  utensil_ids: string[];
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

// Utility types
export type { Database } from './database.types';
