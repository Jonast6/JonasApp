-- Fußball Event Manager - Datenbankschema
-- Supabase Migration Script
-- Version: 1.0

-- =====================================================
-- TABELLEN
-- =====================================================

-- Tabelle: users
-- Speichert alle Benutzer (Spieler + Admin)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelle: seasons
-- Definiert die verfügbaren Saisonen (Winter/Sommer)
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (name IN ('winter', 'summer')),
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initiale Saisonen einfügen
INSERT INTO seasons (name, display_name) VALUES 
  ('winter', 'Winter'),
  ('summer', 'Sommer');

-- Tabelle: utensils
-- Speichert alle Utensilien (pro Saison)
CREATE TABLE utensils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, season_id)
);

-- Initiale Utensilien einfügen
INSERT INTO utensils (name, season_id, display_order) 
SELECT 'Ball', id, 1 FROM seasons WHERE name = 'winter';

INSERT INTO utensils (name, season_id, display_order) 
SELECT name, (SELECT id FROM seasons WHERE name = 'summer'), display_order
FROM (VALUES 
  ('Leibchen', 1),
  ('Schlüssel', 2),
  ('Ball', 3),
  ('Pumpe', 4)
) AS t(name, display_order);

-- Tabelle: events
-- Speichert alle Events (Training, Match, etc.)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  time_from TIME NOT NULL,
  time_to TIME NOT NULL,
  location TEXT NOT NULL,
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
  notes TEXT,
  is_series BOOLEAN DEFAULT FALSE,
  series_id UUID, -- Für Events die Teil einer Serie sind
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnellere Abfragen
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_series ON events(series_id) WHERE series_id IS NOT NULL;

-- Tabelle: event_series
-- Speichert Event-Serien Definitionen
CREATE TABLE event_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Montag, 6=Sonntag
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  time_from TIME NOT NULL,
  time_to TIME NOT NULL,
  location TEXT NOT NULL,
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE RESTRICT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelle: registrations
-- Speichert Anmeldungen der Spieler zu Events
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'declined', 'pending')),
  guest_count INTEGER DEFAULT 0 CHECK (guest_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Index für schnellere Abfragen
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);

-- Tabelle: registration_utensils
-- Verknüpfung: Welcher Spieler bringt welche Utensilien mit
CREATE TABLE registration_utensils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  utensil_id UUID NOT NULL REFERENCES utensils(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(registration_id, utensil_id)
);

-- Index für schnellere Abfragen
CREATE INDEX idx_registration_utensils_reg ON registration_utensils(registration_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Updated_at Trigger
-- Aktualisiert automatisch das updated_at Feld
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger für utensils
CREATE TRIGGER update_utensils_updated_at
  BEFORE UPDATE ON utensils
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger für events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger für registrations
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS auf allen Tabellen
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE utensils ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_utensils ENABLE ROW LEVEL SECURITY;

-- Policy: Alle können seasons lesen
CREATE POLICY "Allow public read access to seasons"
  ON seasons FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Alle können utensils lesen
CREATE POLICY "Allow public read access to utensils"
  ON utensils FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admins können utensils verwalten
CREATE POLICY "Allow admins to manage utensils"
  ON utensils FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ));

-- Policy: Alle können events lesen
CREATE POLICY "Allow public read access to events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admins können events verwalten
CREATE POLICY "Allow admins to manage events"
  ON events FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ));

-- Policy: Admins können event_series verwalten
CREATE POLICY "Allow admins to manage event_series"
  ON event_series FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ));

-- Policy: Alle können ihre eigenen registrations sehen
CREATE POLICY "Users can read their own registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ));

-- Policy: Benutzer können ihre eigenen registrations erstellen/aktualisieren
CREATE POLICY "Users can manage their own registrations"
  ON registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own registrations"
  ON registrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Nur eigene registration_utensils verwalten
CREATE POLICY "Users can manage their own registration utensils"
  ON registration_utensils FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM registrations 
    WHERE registrations.id = registration_utensils.registration_id 
    AND registrations.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM registrations 
    WHERE registrations.id = registration_utensils.registration_id 
    AND registrations.user_id = auth.uid()
  ));

-- Policy: Users können alle users lesen (für Teilnehmerlisten)
CREATE POLICY "Users can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admins können users verwalten
CREATE POLICY "Allow admins to manage users"
  ON users FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
  ));

-- =====================================================
-- VIEWS (für einfachere Abfragen)
-- =====================================================

-- View: Event mit allen Details und Teilnehmer-Statistik
CREATE OR REPLACE VIEW event_details AS
SELECT 
  e.id,
  e.title,
  e.event_date,
  e.time_from,
  e.time_to,
  e.location,
  s.name as season_name,
  s.display_name as season_display_name,
  e.notes,
  e.is_series,
  e.series_id,
  COUNT(DISTINCT CASE WHEN r.status = 'confirmed' THEN r.user_id END) as confirmed_count,
  COUNT(DISTINCT CASE WHEN r.status = 'declined' THEN r.user_id END) as declined_count,
  COUNT(DISTINCT CASE WHEN r.status = 'pending' THEN r.user_id END) as pending_count,
  COALESCE(SUM(CASE WHEN r.status = 'confirmed' THEN r.guest_count ELSE 0 END), 0) as total_guests,
  e.created_at,
  e.updated_at
FROM events e
LEFT JOIN seasons s ON e.season_id = s.id
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, s.name, s.display_name;

-- =====================================================
-- DEMO DATA (Optional - zum Testen)
-- =====================================================

-- Demo Admin User
-- Passwort: admin123 (gehashed)
-- WICHTIG: In Produktion richtiges Hashing verwenden!
INSERT INTO users (email, name, is_admin, password_hash) VALUES
  ('admin@example.com', 'Administrator', true, '$2a$10$rOoKXZXZXZXZXZXZXZXZXO');

-- Demo Spieler
INSERT INTO users (email, name, is_admin, password_hash) VALUES
  ('max.mueller@example.com', 'Max Mueller', false, '$2a$10$rOoKXZXZXZXZXZXZXZXZXO'),
  ('anna.schmidt@example.com', 'Anna Schmidt', false, '$2a$10$rOoKXZXZXZXZXZXZXZXZXO'),
  ('tom.weber@example.com', 'Tom Weber', false, '$2a$10$rOoKXZXZXZXZXZXZXZXZXO'),
  ('lisa.meier@example.com', 'Lisa Meier', false, '$2a$10$rOoKXZXZXZXZXZXZXZXZXO'),
  ('david.klein@example.com', 'David Klein', false, '$2a$10$rOoKXZXZXZXZXZXZXZXZXO');

-- =====================================================
-- KOMMENTARE & DOKUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Alle Benutzer (Spieler und Administratoren)';
COMMENT ON TABLE seasons IS 'Verfügbare Saisonen (Winter/Sommer)';
COMMENT ON TABLE utensils IS 'Utensilien die zu Events mitgebracht werden können';
COMMENT ON TABLE events IS 'Alle Events (Trainings, Matches, etc.)';
COMMENT ON TABLE event_series IS 'Event-Serien Definitionen für wiederkehrende Events';
COMMENT ON TABLE registrations IS 'Anmeldungen von Spielern zu Events';
COMMENT ON TABLE registration_utensils IS 'Zuordnung welcher Spieler welche Utensilien mitbringt';

-- =====================================================
-- ENDE DES MIGRATIONS-SCRIPTS
-- =====================================================
