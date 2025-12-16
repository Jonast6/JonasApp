import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getEvents = async () => {
  const { data, error } = await supabase.from('event_details').select('*').order('event_date');
  if (error) throw error;
  return data;
};

export const getUpcomingEvents = async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('event_details').select('*').gte('event_date', today).order('event_date');
  if (error) throw error;
  return data;
};

export const getEventWithRegistrations = async (eventId: string) => {
  const { data: event } = await supabase.from('event_details').select('*').eq('id', eventId).single();
  const { data: registrations } = await supabase.from('registrations').select('*, user:users(*), registration_utensils(utensil_id, utensil:utensils(*))').eq('event_id', eventId);
  const { data: utensils } = await supabase.from('utensils').select('*').eq('season_id', event.season_id).order('display_order');
  return { event, registrations, utensils };
};

export const upsertRegistration = async (eventId: string, userId: string, status: string, guestCount: number, utensilIds: string[]) => {
  const { data: registration } = await supabase.from('registrations').upsert({ event_id: eventId, user_id: userId, status, guest_count: status === 'confirmed' ? guestCount : 0 }, { onConflict: 'event_id,user_id' }).select().single();
  await supabase.from('registration_utensils').delete().eq('registration_id', registration.id);
  if (status === 'confirmed' && utensilIds.length > 0) {
    await supabase.from('registration_utensils').insert(utensilIds.map(id => ({ registration_id: registration.id, utensil_id: id })));
  }
  return registration;
};

export const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*').order('name');
  if (error) throw error;
  return data;
};

export const getUtensils = async () => {
  const { data, error } = await supabase.from('utensils').select('*, season:seasons(*)').order('season_id').order('display_order');
  if (error) throw error;
  return data;
};

export const deleteEvent = async (eventId: string) => {
  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) throw error;
};

export default supabase;
