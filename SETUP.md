# K-OS — Einrichtung der vereinten App

**K-OS** vereint die vier Programme in einer App:
**Files** (Ablage), **Studio** (Layout), **Draw** (Pixel) und **Vektor** (Pfade).
Der Farbstreifen links wechselt die Sicht; alle Linsen bleiben beim Wechsel geöffnet.
Files und Studio teilen sich dieselbe Dropbox-Verbindung.

Files und Studio können echte Projekte aus deiner Dropbox lesen.
Dazu sind zwei einmalige Schritte nötig, die nur du machen kannst:

- **Teil A** — die App online stellen (Hosting)
- **Teil B** — die App mit Dropbox verbinden

Ohne diese Schritte läuft die App weiterhin im **Demo-Modus** (mit Beispieldaten).
Der Demo-Modus funktioniert auch lokal per Doppelklick auf `index.html`.

> **Wichtig:** Der Dropbox-Login funktioniert **nicht** aus einer lokalen Datei
> (`file://…`). Er braucht eine echte Web-Adresse — deshalb zuerst Teil A.

---

## Dateien in diesem Ordner

| Datei | Zweck |
|---|---|
| `index.html` | Die K-OS Shell (Startbildschirm + Farbstreifen) |
| `files.html` | Linse **Files** — Ablage, Dropbox, Veröffentlichen |
| `studio.html` | Linse **Studio** — Layout, Vorlagen, PDF |
| `draw.html` | Linse **Draw** — Malen auf Pixelebenen |
| `vektor.html` | Linse **Vektor** — Pfade und Knoten |
| `logo.png` | Schriftzug für den Startbildschirm |
| `manifest.json` | Macht die App installierbar (PWA) |
| `sw.js` | Service Worker — App startet offline |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | App-Icons |
| `SETUP.md` | Diese Anleitung |

Alle Dateien gehören zusammen in **denselben Ordner**.

---

## Teil A — App online stellen (GitHub Pages, kostenlos)

1. Kostenloses Konto auf **github.com** anlegen (falls noch nicht vorhanden).
2. Oben rechts **+ → New repository**.
   - Name z. B. `kos-files`
   - **Public** auswählen (Pages ist für private Repos kostenpflichtig)
   - **Create repository**
3. Auf der neuen Seite **„uploading an existing file"** anklicken und
   **alle Dateien aus diesem Ordner** hineinziehen → **Commit changes**.
4. Im Repo oben auf **Settings → Pages**.
   - Unter **Source**: „Deploy from a branch"
   - Branch: **main**, Ordner: **/ (root)** → **Save**
5. Nach ca. 1 Minute erscheint oben die Adresse, z. B.:

   ```
   https://DEINNAME.github.io/kos-files/
   ```

   Diese URL ist ab jetzt deine App. Merke sie dir — sie wird in Teil B gebraucht.

> Aktualisieren später: einfach die geänderte `index.html` erneut hochladen
> (im Repo → Datei anklicken → Papierkorb/Upload → Commit). Pages aktualisiert sich selbst.

---

## Teil B — Mit Dropbox verbinden

### 1. Dropbox-App erstellen

1. Öffne **https://www.dropbox.com/developers/apps** → **Create app**.
2. Einstellungen:
   - **Choose an API:** „Scoped access"
   - **Type of access:** **App folder** — *(empfohlen; die App sieht dann nur
     ihren eigenen Ordner `Dropbox/Apps/K-OS Files`, nichts anderes)*
   - **Name:** z. B. `K-OS Files` (muss dropbox-weit eindeutig sein)
   - **Create app**

### 2. Redirect-URI eintragen

1. In der App-Console → Tab **Settings** → Abschnitt **OAuth 2 → Redirect URIs**.
2. Trage **beide** Modul-Adressen ein (die Shell selbst braucht keine) — je nach
   deiner Pages-URL aus Teil A, z. B.:

   ```
   https://DEINNAME.github.io/kos/files.html
   https://DEINNAME.github.io/kos/studio.html
   ```

   *(Genau diese Adressen zeigen dir Files bzw. Studio später auch im
   Verbindungs-Dialog an — dort gibt es einen Kopier-Button. Sie müssen
   zeichengenau übereinstimmen.)*
3. Nach jeder Adresse **Add** klicken.

> **Umstieg von der alten K-OS-Files-Installation:** Die bisherige Redirect-URI
> (z. B. `https://DEINNAME.github.io/kos-files/`) kann eingetragen bleiben.
> Liegt die neue App im **selben** Repo/Pfad wie vorher, bleibt deine bestehende
> Dropbox-Anmeldung sogar erhalten — die neuen URIs werden nur für künftige
> Logins gebraucht.

### 3. Berechtigungen setzen

1. Tab **Permissions**.
2. Diese Häkchen setzen:
   - `files.metadata.read`
   - `files.content.read`
   - `files.content.write` *(schon jetzt anhaken — wird ab v8/v9 gebraucht)*
   - `account_info.read`
3. **Submit** klicken.

   > Reihenfolge beachten: Permissions **vor** dem ersten Login setzen. Änderst
   > du sie später, einmal in der App trennen und neu verbinden.

### 4. App Key kopieren

- Zurück im Tab **Settings**: oben steht **App key** (eine Buchstaben-/Zahlenfolge).
  Diesen Key kopieren.

### 5. In der App verbinden

1. Deine Pages-URL im Browser öffnen.
2. Oben auf **„Demo-Modus"** tippen → Verbindungs-Dialog.
3. **App key** einfügen.
4. Bei Bedarf die angezeigte **Redirect-URI** mit dem Kopier-Button übernehmen
   und in der Dropbox-Konsole eintragen (Teil B.2).
5. **Mit Dropbox verbinden** → Dropbox fragt nach Erlaubnis → bestätigen.
6. Danach lädt die App deine Projekte. Fertig.

---

## Wie die App deine Dropbox liest

Nach dem Verbinden liegt der Arbeitsordner hier:

```
Dropbox/Apps/K-OS Files/
```

Regeln:

- **Jeder Unterordner = ein Projekt.** Der Ordnername ist der Projekttitel.
- Optionale Datei **`project.json`** direkt im Projektordner steuert Status,
  Tags, Cover, Pins und den Veröffentlichungs-Verlauf. Fehlt sie, rät die App
  sinnvolle Standardwerte (Status „Idee", automatisches Cover).
- Optionale Datei **`schedule.json`** im Hauptordner enthält geplante Posts.
- Empfohlene Unterordner je Projekt (die App erkennt sie an der Nummer):
  `01 Referenzen`, `02 Arbeitsdateien`, `03 Exporte`, `04 Social`.

> **Stand: Vollausbau (1.0-RC).** Die App liest und schreibt vollständig:
> Projekte/Ordner anlegen, Status, Pins, Cover, Tags, Upload (auch sehr große
> Dateien), Umbenennen, Verschieben, Löschen, Suche, Post-Planung in
> `schedule.json`, Sofort-Veröffentlichung (IG/FB via Meta, TikTok/Patreon per
> Assistent), Auto-Sync bei Dropbox-Änderungen, Offline-Start mit
> Änderungs-Warteschlange, „Offline halten" pro Datei und Android-Teilen-Ziel.
> Danach folgt nur noch Design/UX-Politur.

---

## Beispiel `project.json`

Direkt in einen Projektordner legen (z. B. `Mural Gastro Augsburg/project.json`):

```json
{
  "schema": "kos-files/1",
  "title": "Mural Gastro Augsburg",
  "status": "work",
  "tags": ["Auftrag", "Mural"],
  "cover": "cv-1",
  "coverFile": "03 Exporte/wand_final_v3.jpg",
  "pinned": [
    "02 Arbeitsdateien/wand_final_v3.psd",
    "briefing.pdf"
  ],
  "publishLog": [
    { "file": "wand_final_v3", "platform": "ig", "date": "2026-07-12" }
  ]
}
```

Felder:

- `status`: `idea` · `work` · `done` · `pub`
- `cover`: `cv-1` … `cv-6` (Platzhalter-Farbverlauf; echte Cover-Bilder folgen)
- `coverFile`: Pfad relativ zum Projektordner (für später)
- `pinned`: Liste von Pfaden relativ zum Projektordner
- `publishLog[].platform`: `ig` · `tt` · `fb` · `pt`

## Beispiel `schedule.json`

In den Hauptordner `Apps/K-OS Files/` legen:

```json
{
  "schema": "kos-schedule/1",
  "posts": [
    {
      "id": "s1",
      "project": "mural-gastro-augsburg",
      "work": "wand",
      "platform": "ig",
      "datetime": "2026-07-21T09:00",
      "title": "Mural Final — Feed Post"
    }
  ]
}
```

`project` ist der klein geschriebene, mit Bindestrichen verbundene Ordnername.

---

## Datenschutz / Sicherheit

- Die App läuft komplett im Browser. Es gibt **keinen Zwischenserver**.
- Der Login nutzt **OAuth 2.0 mit PKCE** und einem **state-Parameter**
  (CSRF-Schutz) — es wird **kein** App-Secret in der Seite gespeichert
  (das wäre unsicher), nur der öffentliche App Key.
- Eine **Content-Security-Policy** erlaubt Netzwerkverbindungen ausschließlich
  zur Dropbox-API und (fürs Veröffentlichen) zur Meta Graph API — die Seite
  kann technisch an keine andere Adresse Daten senden.
- Die Zugangs-Tokens liegen ausschließlich lokal in deinem Browser
  (`localStorage`) und gehen nur an Dropbox selbst.
- Mit **App folder**-Zugriff kann die App technisch nur ihren eigenen Ordner
  sehen — nicht deine übrige Dropbox.
- Der Code im öffentlichen Repo enthält **keine Kontodaten**: Der App Key wird
  erst von dir zur Laufzeit eingegeben. Andere Besucher deines Links sehen nur
  den Demo-Modus; Sitzungen sind pro Browser strikt getrennt.
- Trennen jederzeit: oben auf den Status tippen → **Verbindung trennen**.

---

## Teil C — Veröffentlichen (Instagram & Facebook über Meta)

Instagram/Facebook-Posts laufen direkt über die offizielle **Meta Graph API**
aus dem Browser. Dafür brauchst du einmalig eine eigene (kostenlose) Meta-App:

### 1. Meta-App anlegen
1. https://developers.facebook.com → **My Apps → Create App**.
2. Typ **Business** wählen, Namen vergeben (z. B. „K-OS Publisher").
3. Produkt **Facebook Login** hinzufügen → Einstellungen → unter
   **Valid OAuth Redirect URIs** exakt die Files-Adresse eintragen
   (dieselbe wie bei Dropbox, z. B. `https://DEINNAME.github.io/kos/files.html`).

### 2. Voraussetzungen auf Meta-Seite
- Deine **Instagram**-Präsenz muss ein **Business/Creator-Konto** sein und mit
  einer **Facebook-Seite** verknüpft (Instagram-App → Einstellungen → Konto →
  Seite verknüpfen). Du hast bereits ein Meta-Business-Konto — dann ist das
  meist schon erledigt.
- Solange die Meta-App im **Entwicklungsmodus** ist, funktioniert das Posten
  für Konten mit einer Rolle in der App (dich selbst als Admin) — für den
  Eigenbedarf völlig ausreichend, kein App-Review nötig.

### 3. In K-OS Files verbinden
1. Zahnrad (Einstellungen) → **Meta App-ID** eintragen → Speichern.
2. **Mit Meta anmelden** → Facebook-Login → Berechtigungen bestätigen.
3. Die App holt sich automatisch deine Seite + das verknüpfte IG-Konto.

**Wichtig:** Der Browser-Login liefert nur **kurzlebige Tokens** (~1–2 h).
Vor dem Veröffentlichen ggf. einfach erneut „Mit Meta anmelden" — das ist
1 Klick, da die Facebook-Sitzung besteht. (Langlebige Tokens würden das
App-Secret im Browser erfordern — unsicher, machen wir bewusst nicht.)

### TikTok & Patreon (Assistent)
Beide bieten **keine** Browser-Schnittstelle zum direkten Posten (TikTok nur
mit App-Review + Server; Patreon-API kann keine Posts erstellen und blockiert
Browser-Aufrufe). K-OS Files nutzt deshalb den **Assistenten**: Caption wird
kopiert, die Datei per Teilen-Dialog/Downloadlink bereitgestellt und die
Plattform geöffnet — du bestätigst dort nur noch.

---

## Teilen-Ziel (Android)

Ist die App **installiert** (Chrome → „App installieren"), erscheint
**K-OS Files** im Android-Teilen-Menü. Geteilte Bilder/Videos/PDFs landen in
einem Eingang; die App fragt dann, in welches Projekt und welchen Ordner sie
sollen. (iOS unterstützt Share-Target für Web-Apps leider nicht.)

---

## Offline-Verhalten

- Bei Verbindung wird der komplette Stand (Projekte, Planung, Vorschaubilder)
  lokal zwischengespeichert — die App **startet auch offline** mit dem letzten
  Stand („Offline-Stand" im Kopf).
- **Offline möglich:** Status ändern, Pinnen, Cover, Tags, Posts einplanen —
  Änderungen werden gemerkt und beim nächsten Kontakt automatisch
  nachsynchronisiert („n ausstehend").
- **Offline nicht möglich** (bewusst, wegen Konfliktgefahr): Upload,
  Umbenennen, Verschieben, Löschen, Projekt anlegen.
- Einzelne Dateien lassen sich per Datei-Menü → **„Offline halten"** komplett
  aufs Gerät laden (Punkt-Markierung) und dann auch offline öffnen/teilen.

---

## Auto-Sync

Bei bestehender Verbindung lauscht die App auf Dropbox-Änderungen (Longpoll).
Legst du am PC Dateien in den App-Ordner, aktualisiert sich die App von selbst
— ohne „Neu laden".

---

## Fehlerbehebung

| Problem | Lösung |
|---|---|
| „Verbinden erst nach Hosting möglich" | Du hast die Datei lokal geöffnet. Erst Teil A (Pages), dann über die `github.io`-URL verbinden. |
| „Token-Tausch fehlgeschlagen" / redirect mismatch | Redirect-URI in der Dropbox-Konsole muss **zeichengenau** der URL entsprechen, die die App im Dialog zeigt (inkl. `/` am Ende). |
| „Keine Projekte gefunden" | Im Ordner `Dropbox/Apps/K-OS Files` fehlen Unterordner. Einen anlegen, dann „Neu laden". |
| Nach Permissions-Änderung fehlen Rechte | In der App trennen und neu verbinden. |
| App aktualisiert sich nicht nach Upload | Kurz warten (Pages-Cache) oder Seite hart neu laden (Strg/Cmd+Shift+R). |
