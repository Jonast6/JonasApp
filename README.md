# ⚽ Fußball Event Manager

Eine Progressive Web App zur Verwaltung von Fußball-Events mit Anmeldung, Gästeverwaltung und Utensilienverwaltung.

## 📋 Projekt-Status

**✅ Bereitgestellt:**
- Datenbankschema (Supabase Migration)
- Projekt-Konfiguration (package.json, TypeScript, Vite, PWA)
- GitHub Actions Workflow
- Vercel Deployment Konfiguration
- Type Definitions
- Supabase Client mit Helper-Funktionen
- App-Routing-Struktur

**⏳ Noch zu erstellen:**
- React Komponenten (siehe unten)
- CSS Styling
- Auth Hook
- Utility Functions
- HTML Entry Point

---

## 🚀 Setup-Anleitung

### 1. Supabase Projekt erstellen

1. Gehe zu https://supabase.com
2. Erstelle ein neues Projekt
3. Warte bis das Projekt bereit ist

### 2. Datenbankschema importieren

1. Öffne dein Supabase Projekt
2. Gehe zu "SQL Editor"
3. Kopiere den Inhalt von `supabase_migration_001_initial_schema.sql`
4. Füge ihn ein und führe ihn aus
5. Überprüfe, dass alle Tabellen erstellt wurden

### 3. Umgebungsvariablen konfigurieren

1. Kopiere `.env.example` zu `.env`
2. Füge deine Supabase Credentials ein:
   - In Supabase: Settings > API
   - `VITE_SUPABASE_URL`: Project URL
   - `VITE_SUPABASE_ANON_KEY`: Anon public key

### 4. Dependencies installieren

```bash
npm install
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft auf http://localhost:3000

---

## 📁 Projekt-Struktur

```
fussball-event-manager/
├── .github/
│   └── workflows/
│       └── deploy.yml              ✅ GitHub Actions
├── public/
│   ├── favicon.ico                 ⏳ Zu erstellen
│   ├── pwa-192x192.png            ⏳ PWA Icon
│   └── pwa-512x512.png            ⏳ PWA Icon
├── src/
│   ├── components/                 ⏳ React Komponenten
│   │   ├── player/
│   │   │   ├── EventMatrix.tsx    ⏳ Matrix-Ansicht
│   │   │   ├── EventModal.tsx     ⏳ Event-Details Modal
│   │   │   └── StatusButton.tsx   ⏳ Status-Button Komponente
│   │   ├── admin/
│   │   │   ├── EventsTab.tsx      ⏳ Events-Verwaltung
│   │   │   ├── UsersTab.tsx       ⏳ Benutzer-Verwaltung
│   │   │   ├── UtensilsTab.tsx    ⏳ Utensilien-Verwaltung
│   │   │   └── EventForm.tsx      ⏳ Event-Formular
│   │   └── common/
│   │       ├── Header.tsx          ⏳ Header-Komponente
│   │       └── LoadingSpinner.tsx  ⏳ Loading Indikator
│   ├── hooks/
│   │   ├── useAuth.tsx             ⏳ Authentication Hook
│   │   ├── useEvents.ts            ⏳ Events Hook
│   │   └── useRegistrations.ts     ⏳ Registrations Hook
│   ├── lib/
│   │   └── supabase.ts             ✅ Supabase Client
│   ├── pages/
│   │   ├── LoginPage.tsx           ⏳ Login Seite
│   │   ├── PlayerView.tsx          ⏳ Spieler-Ansicht
│   │   └── AdminView.tsx           ⏳ Admin-Ansicht
│   ├── types/
│   │   ├── index.ts                ✅ Type Definitions
│   │   └── database.types.ts       ⏳ Generated Types
│   ├── utils/
│   │   ├── icons.ts                ⏳ Icon-Mapping
│   │   └── dateHelpers.ts          ⏳ Datums-Helper
│   ├── App.tsx                     ✅ Haupt-App
│   ├── App.css                     ⏳ Global CSS
│   ├── main.tsx                    ⏳ Entry Point
│   └── vite-env.d.ts               ⏳ Vite Types
├── .env.example                    ✅
├── .gitignore                      ✅
├── package.json                    ✅
├── tsconfig.json                   ✅
├── tsconfig.node.json              ✅
├── vercel.json                     ✅
├── vite.config.ts                  ✅
└── README.md                       ✅ Diese Datei
```

---

## 🔧 Fehlende Komponenten - Implementierungs-Hinweise

### Entry Point (src/main.tsx)
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Auth Hook (src/hooks/useAuth.tsx)
- Erstelle Context für Authentication
- Verwalte User State
- Implementiere signIn, signOut Funktionen
- Nutze `getCurrentUser` aus supabase.ts

### Player View (src/pages/PlayerView.tsx)
- Matrix-Layout wie im Mockup
- 3 Event-Spalten (horizontal scrollbar)
- Alle Spieler in Zeilen
- Status-Buttons mit Icons
- Event Modal bei Klick

### Admin View (src/pages/AdminView.tsx)
- Tabs für Events, Benutzer, Utensilien
- Event-Tabelle
- Modals für Create/Edit
- Verwende Admin-Mockup als Design-Vorlage

### CSS Styling
**Spieler-Ansicht:**
- Hintergrund: #000000 (schwarz)
- Text: #FFFFFF (weiß)
- Überschriften: #00FF88 (hellgrün)
- Status Grün: #00AA44
- Status Rot: #CC0000
- Status Grau: #333333

**Admin-Ansicht:**
- Hintergrund: #FFFFFF (weiß)
- Text: #000000 (schwarz)
- Überschriften: #00FF88 (hellgrün)

### Icon-Mapping (src/utils/icons.ts)
```typescript
export const getUtensilIcon = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes('ball')) return '⚽';
  if (normalized.includes('leibchen')) return '🦺';
  if (normalized.includes('schlüssel')) return '🔑';
  if (normalized.includes('pumpe')) return '🎈';
  return '📦'; // Default icon
};
```

---

## 🌐 Deployment

### GitHub

1. Erstelle Repository auf github.com
2. Initialisiere Git lokal:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Vercel

#### Option 1: Automatisch via GitHub
1. Gehe zu https://vercel.com
2. "Import Project" → Wähle dein GitHub Repo
3. Vercel erkennt automatisch Vite
4. Füge Environment Variables hinzu:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

#### Option 2: GitHub Actions (bereits konfiguriert)
1. Gehe zu GitHub Repository → Settings → Secrets
2. Füge hinzu:
   - `VERCEL_TOKEN` (von vercel.com/account/tokens)
   - `VERCEL_ORG_ID` (von .vercel/project.json nach erstem Manual Deploy)
   - `VERCEL_PROJECT_ID` (von .vercel/project.json)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Bei jedem Push auf `main` deployt GitHub Actions automatisch

---

## 📱 PWA (Progressive Web App)

Die App ist bereits als PWA konfiguriert:
- ✅ Service Worker (automatisch generiert)
- ✅ Manifest (in vite.config.ts)
- ✅ Offline-Caching
- ⏳ Icons fehlen noch (erstelle 192x192 und 512x512 PNG)

Nach dem Deployment können Nutzer die App auf ihrem Smartphone "installieren".

---

## 🔐 Sicherheit

### Wichtig vor Production:
1. **Passwort-Hashing:** Die Demo-Passwörter im SQL-Script sind Platzhalter
   - Nutze Supabase Auth statt custom Passwörter
   - Oder implementiere bcrypt für Passwort-Hashing

2. **Row Level Security:** Bereits konfiguriert in der Migration
   - Teste RLS Policies gründlich
   - Überprüfe, dass User nur ihre eigenen Daten sehen/ändern

3. **Environment Variables:** 
   - Niemals in Git committen
   - Nur in Vercel/GitHub Secrets

---

## 🧪 Testing

### Manuelle Tests:
1. **Als Spieler:**
   - Login
   - Events sehen
   - Anmelden/Abmelden
   - Gäste hinzufügen
   - Utensilien auswählen

2. **Als Admin:**
   - Login als Admin
   - Event erstellen (einzeln)
   - Event-Serie erstellen
   - Event bearbeiten (Serie-Warnung)
   - Benutzer erstellen
   - Utensilien verwalten

### Supabase Admin User:
- Email: `admin@example.com`
- Passwort: Setze im SQL-Editor oder via Supabase Auth Dashboard

---

## 📚 Dokumentation

- **Projekt-Ausgangslage:** `docs/projekt-ausgangslage.md`
- **App-Spezifikation:** `docs/app-spezifikation.md`
- **Mockups:** `mockups/`

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Überprüfe `.env` Datei
- Stelle sicher, dass die Keys mit `VITE_` beginnen
- Starte Dev-Server neu

### "Row Level Security" Fehler
- Überprüfe, dass du als authentifizierter User eingeloggt bist
- Überprüfe RLS Policies in Supabase Dashboard

### Build-Fehler
- Lösche `node_modules` und `package-lock.json`
- `npm install` erneut
- Überprüfe TypeScript Fehler mit `npm run build`

---

## 🎯 Nächste Schritte

1. **Vervollständige React Komponenten**
   - Nutze die Mockups als Design-Vorlage
   - Implementiere die beschriebene Funktionalität
   - Teste gründlich

2. **Design verfeinern**
   - Responsive Design testen
   - PWA Icons erstellen
   - Micro-Interactions hinzufügen

3. **Deployment**
   - Auf GitHub pushen
   - Vercel einrichten
   - Testen in Production

4. **Feedback & Iteration**
   - Von echten Nutzern testen lassen
   - Bugs fixen
   - Features erweitern

---

## 💡 Erweiterungsmöglichkeiten

- 📧 E-Mail-Benachrichtigungen
- 📊 Statistiken (Anwesenheit, etc.)
- 💬 Chat/Kommentare
- 🗓️ Kalender-Export (iCal)
- 🌦️ Wetter-Integration
- 📱 Push-Notifications

---

## 📄 Lizenz

Private Nutzung

---

## 🤝 Support

Bei Fragen oder Problemen:
- Überprüfe dieses README
- Konsultiere die Spezifikation
- Teste Schritt für Schritt

**Viel Erfolg mit deinem Projekt! ⚽🚀**
