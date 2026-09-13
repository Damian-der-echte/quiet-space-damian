# QuietSpace – Einbindung

## 1. Ordnerstruktur

Lege die Dateien genau so ab:

```text
quietspace_final_v4/
├── index.html
├── app.js
├── styles.css
├── server.js
├── package.json
├── regeln.mp4
├── roomes_images/
│   ├── 101.jpg
│   ├── 104.jpg
│   ├── 108.jpg
│   ├── 201.jpg
│   ├── 204.jpg
│   ├── E06.jpg
│   ├── E08.jpg
│   ├── E12.jpg
│   ├── extra.jpg
│   └── H4.jpg
└── assets/
    ├── lageplan_design_reference.png
    └── raumplaene_design_reference.png
```

`roomes_images` muss genauso geschrieben sein, weil `app.js` diesen Pfad verwendet.

Die beiden Dateien im Ordner `assets` sind Designreferenzen und werden von der App nicht benötigt. Du kannst sie behalten oder später löschen.

## 2. Alte Dateien ersetzen

Wenn du bereits einen QuietSpace-Ordner hast:

1. Ersetze `index.html` vollständig.
2. Ersetze `app.js` vollständig.
3. Ersetze `styles.css` vollständig.
4. Ersetze `server.js` vollständig.
5. Ersetze `package.json` vollständig.
6. Ersetze bzw. ergänze den Ordner `roomes_images` mit allen zehn Bildern aus diesem Paket.

Nicht alte CSS-Blöcke zusätzlich darunterkopieren. Die mitgelieferte `styles.css` ist die komplette Version.

## 3. Starten

Voraussetzung: Node.js ist installiert.

Öffne ein Terminal im Projektordner und führe aus:

```bash
npm start
```

Danach im Browser öffnen:

```text
http://localhost:3220
```

## 4. Was neu ist

- Raumpläne basieren auf den gelieferten Raumfotos und verwenden unterschiedliche Möblierungen.
- Räume, Möbel und Sitzplätze sind in einem festen Raster angeordnet, damit nichts überlappt.
- Fenster werden nur dort eingezeichnet, wo sie je Raumtyp sinnvoll sind.
- Stromanschlüsse werden über den Toggler direkt an den passenden Tischen dargestellt.
- Der Lageplan verwendet ein echtes Gebäuderaster: Räume und Gang können sich nicht überlappen.
- Etagen haben unterschiedliche Anordnungen statt immer derselben Vorlage.
- Der Ausgang befindet sich nur dort, wo er im Erdgeschoss sinnvoll ist.
- Unter „Meine Reservationen“ ist die Liste die Standardansicht; Kalender ist eine separate Ansicht.
- Jede Reservation hat nur noch sinnvolle Aktionen: Einchecken, Updaten, Stornieren.
- „Updaten“ öffnet eine eigene Bearbeitungsseite für Raum, Platz, Datum, Zeit, Zweck und Notiz.
- Kein Verlängern-, Erneut-buchen- oder „Im Kalender ansehen“-Button pro Reservation.
- Lehrpersonen können im Raumplan freie Plätze sperren und gesperrte Plätze wieder freigeben.
- Die Hilfe enthält aufklappbare Detailinformationen zu allen Hauptbereichen.
- Das Video wird im Hilfebereich „Buchen“ direkt abgespielt und unterstützt den Vollbildmodus.
- Buchungszeiten, Serienzeiträume und zeitliche Doppelbelegungen werden validiert.
- Die Tastaturbedienung wurde mit Sprunglink, sichtbaren Fokusrahmen und kontrollierten Fokuswechseln verbessert.
- Status werden zusätzlich zur Farbe mit Text und Symbolen dargestellt.
- Mobile Bedienelemente haben grössere Klickflächen und mehr Abstand; reduzierte Bewegung wird berücksichtigt.
- Falsche Antworten im Regeltest erhalten eine verständliche Begründung.

## 5. Bilder austauschen

Falls du später ein Raumfoto ersetzen möchtest, kannst du das Bild im Ordner `roomes_images` austauschen. Der Dateiname muss gleich bleiben.

Beispiel:

```text
roomes_images/E06.jpg
```

## 6. Regeltest zurücksetzen (nur zum Testen)

Der bestandene Regeltest wird im Browser gespeichert. Falls du ihn beim Entwickeln erneut testen möchtest, führe in der Browser-Konsole aus:

```js
localStorage.removeItem("quietspace-rule-test-passed")
location.reload()
```

Manuell geänderte Platzsperren werden ebenfalls im Browser gespeichert. Zum Zurücksetzen:

```js
localStorage.removeItem("quietspace-seat-blocks")
location.reload()
```

Für den eigentlichen Prototyp musst du das nicht machen.
