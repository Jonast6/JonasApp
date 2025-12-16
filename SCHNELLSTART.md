# 🚀 Schnellstart-Anleitung

## Was du erhalten hast

✅ **Komplettes Projekt-Gerüst** mit:
- Datenbankschema (SQL Migration)
- React + TypeScript Konfiguration
- Supabase Integration
- GitHub Actions für CI/CD
- Vercel Deployment Setup
- Type Definitions
- App-Routing

⏳ **Noch zu ergänzen:**
- React UI-Komponenten (PlayerView, AdminView, etc.)
- CSS Styling (Design aus Mockups übertragen)
- Auth Hook Implementation
- HTML Entry Point

---

## 📤 Zu GitHub hochladen

### Schritt 1: GitHub Repository erstellen

1. Gehe zu https://github.com
2. Klick auf **"+"** → **"New repository"**
3. Name: `fussball-event-manager`
4. Klick **"Create repository"**

### Schritt 2: Alle Dateien hochladen

**Option A: Via Web-Interface (Einfach)**
1. Öffne dein neues Repository
2. Klick "uploading an existing file"
3. Ziehe den kompletten `fussball-event-manager` Ordner rein
4. Commit message: "Initial project setup"
5. Klick "Commit changes"

**Option B: Via Git Command Line**
```bash
cd fussball-event-manager
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/fussball-event-manager.git
git push -u origin main
```

---

## 🗄️ Supabase Setup

### Schritt 1: Projekt erstellen
1. Gehe zu https://supabase.com
2. "New project"
3. Wähle Name, Passwort, Region
4. Warte bis Projekt bereit ist (~2 Minuten)

### Schritt 2: Datenbank importieren
1. In Supabase: **SQL Editor**
2. "New query"
3. Kopiere Inhalt von `supabase_migration_001_initial_schema.sql`
4. Füge ein und klick **"Run"**
5. ✅ Erfolgreich wenn keine Fehler

### Schritt 3: API Keys kopieren
1. In Supabase: **Settings** → **API**
2. Kopiere:
   - `Project URL` → das ist deine `VITE_SUPABASE_URL`
   - `anon public` → das ist dein `VITE_SUPABASE_ANON_KEY`

---

## 🌐 Vercel Deployment

### Schritt 1: Vercel Account
1. Gehe zu https://vercel.com
2. Registriere dich (am besten mit GitHub)

### Schritt 2: Projekt importieren
1. "Add New..." → "Project"
2. Wähle dein GitHub Repository
3. Vercel erkennt automatisch Vite ✓
4. **Environment Variables** hinzufügen:
   - `VITE_SUPABASE_URL` = Deine Project URL
   - `VITE_SUPABASE_ANON_KEY` = Dein Anon Key
5. Klick **"Deploy"**

### Schritt 3: Fertig! 🎉
Nach ~2 Minuten ist deine App live unter:
`https://fussball-event-manager-XXX.vercel.app`

---

## ⚡ Lokale Entwicklung

### Voraussetzungen
- Node.js installiert (https://nodejs.org)
- Code-Editor (VS Code empfohlen)

### Schritte
```bash
# 1. In Projekt-Ordner wechseln
cd fussball-event-manager

# 2. .env Datei erstellen
cp .env.example .env
# Füge deine Supabase Credentials ein

# 3. Dependencies installieren
npm install

# 4. Dev-Server starten
npm run dev

# App läuft auf http://localhost:3000
```

---

## 📝 Was als nächstes?

### Priorität 1: React Komponenten erstellen

Die UI-Logik muss noch implementiert werden:

**Dateien zu erstellen:**
1. `src/main.tsx` - Entry Point
2. `src/hooks/useAuth.tsx` - Authentication
3. `src/pages/LoginPage.tsx` - Login Screen
4. `src/pages/PlayerView.tsx` - Spieler Matrix-Ansicht
5. `src/pages/AdminView.tsx` - Admin Tabs
6. `src/App.css` - Global Styling

**Design-Vorlagen:**
- Nutze `mockup-spieler-ansicht.html` als Vorlage
- Nutze `mockup-administrator-ansicht.html` als Vorlage
- Kopiere CSS-Styles aus den Mockups
- Übertrage das Layout in React Komponenten

### Priorität 2: Testing

1. Admin User in Supabase anlegen
2. Paar Test-Spieler anlegen
3. Test-Event erstellen
4. Anmeldung testen

### Priorität 3: Production-Ready

1. PWA Icons erstellen (192x192, 512x512 PNG)
2. Favicon hinzufügen
3. Sicherheit überprüfen (RLS Policies)
4. Performance testen

---

## 🆘 Häufige Probleme

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Supabase connection failed"
- Überprüfe `.env` Datei
- Keys müssen mit `VITE_` beginnen
- Server neu starten nach .env Änderung

### Build-Fehler
```bash
npm run build
# Zeigt TypeScript Fehler an
```

---

## 📚 Hilfreiche Links

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Vite:** https://vitejs.dev
- **Vercel:** https://vercel.com/docs

---

## ✅ Checkliste

- [ ] GitHub Repository erstellt
- [ ] Code hochgeladen
- [ ] Supabase Projekt erstellt
- [ ] Datenbank-Migration ausgeführt
- [ ] Vercel Deployment eingerichtet
- [ ] Environment Variables gesetzt
- [ ] Lokale Entwicklung funktioniert
- [ ] React Komponenten implementiert
- [ ] Design aus Mockups übertragen
- [ ] Erste Tests durchgeführt
- [ ] Production Deployment erfolgreich

---

## 🎯 Du bist bereit!

Du hast jetzt:
- ✅ Vollständiges Backend (Supabase)
- ✅ Projekt-Konfiguration
- ✅ Deployment-Pipeline
- ✅ Klare Roadmap

**Nächster Schritt:** 
Code auf GitHub hochladen und mit der UI-Entwicklung beginnen!

**Viel Erfolg! ⚽🚀**
