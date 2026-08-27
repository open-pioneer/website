---
title: Sicherheitsrichtlinie
template: splash
---

[English version](/security/policy-en/)

Open Pioneer Trails ist ein Open-Source-Framework zur Entwicklung clientseitiger Web-GIS-Anwendungen. Diese Seite beschreibt, wie Sicherheitslücken in Open Pioneer Trails gemeldet werden können und wie wir mit solchen Meldungen umgehen.

## Definition einer Schwachstelle

Als Sicherheitsschwachstelle verstehen wir einen Fehler oder eine Schwäche in einem der Open-Pioneer-Trails-Pakete, in der zugehörigen Dokumentation/Webseite oder in der zur Bereitstellung dieser Angebote genutzten Infrastruktur (z. B. Repository-Hosting, Build- und Release-Pipeline), durch die die Schutzziele der Informationssicherheit gefährdet werden können – also die **Vertraulichkeit, Integrität oder Verfügbarkeit** von Systemen und Daten.

Gemeldet werden sollten nur Schwachstellen, die tatsächlich ausnutzbar sind und ein erkennbares Sicherheitsrisiko darstellen, etwa unautorisierter Zugriff, das Ausführen fremden Codes oder die Manipulation von Daten. Nicht als Schwachstelle im Sinne dieser Richtlinie gelten insbesondere: Social-Engineering-Versuche, Probleme, die ausschließlich auf veralteten oder nicht mehr unterstützten Browsern beruhen, unverifizierte Ergebnisse automatisierter Scanner, Denial-of-Service-Angriffe sowie allgemeine Support-Anfragen.

## Geltungsbereich

Diese Richtlinie gilt für:

- die von der Open-Pioneer-Trails-Community entwickelten und veröffentlichten Software-Pakete (u. a. unter [github.com/open-pioneer](https://github.com/open-pioneer))
- die Projekt-Webseite(n) unter den Domains openpioneer.dev, www.openpioneer.dev und open-pioneer.github.io/website/
- die zur Bereitstellung dieser Angebote genutzte Infrastruktur (Repository-Hosting, Versionskontrolle, Build- und Release-Pipeline), soweit sie den Steward-Organisationen des Projekts zuzurechnen ist

Anwendungen, die auf Basis von Open Pioneer Trails von Dritten entwickelt und betrieben werden, fallen nicht in den Geltungsbereich dieser Richtlinie. Schwachstellen in solchen Anwendungen sollten direkt an deren jeweiligen Betreiber gemeldet werden.

## Meldung einer Schwachstelle

Bitte melden Sie vermutete Sicherheitslücken per E-Mail an [security@openpioneer.dev](mailto:security@openpioneer.dev).

Ihre Meldung sollte idealerweise enthalten:

- eine Beschreibung der Schwachstelle und der möglichen Auswirkungen
- das betroffene Paket, die betroffene Komponente oder die betroffene URL (inkl. Versionsangabe, sofern zutreffend)
- eine nachvollziehbare Schritt-für-Schritt-Anleitung zur Reproduktion (Proof of Concept)
- relevante technische Details (z. B. Version, Zeitpunkt, verwendete Werkzeuge)
- optional: Ihre Kontaktdaten für Rückfragen
- optional: Ihre Einschätzung der Kritikalität

## Vorgehensweise

Nach Eingang Ihrer Meldung reagieren wir umgehend und arbeiten mit Ihnen zusammen, um die Schwachstelle zu verstehen und zu analysieren. Zur Bewertung des Schweregrads orientieren wir uns an etablierten Standards (z. B. CVSS). Die Priorität für die Behebung ergibt sich aus Auswirkung, Schweregrad und Komplexität der Ausnutzbarkeit. Wir halten Sie über den Fortschritt der Bearbeitung auf dem Laufenden.

## Was Sie von uns erwarten können

Wir verpflichten uns dazu,

- Ihre Meldung zeitnah zu beantworten und gemeinsam mit Ihnen die Schwachstelle zu verstehen und zu validieren,
- Sie über den Fortschritt bei der Bearbeitung auf dem Laufenden zu halten,
- erkannte Schwachstellen im Rahmen der Möglichkeiten eines Open-Source-Projekts zeitnah zu beheben.

Open Pioneer Trails ist Open-Source-Software und als solche von zahlreichen Pflichten des Cyber Resilience Acts (CRA, Verordnung (EU) 2024/2847) befreit. Die Steward-Organisationen des Projekts (derzeit con terra GmbH und 52°North GmbH) stellen jedoch Entwicklungs-Ressourcen, Code-Reviews, Release-Management und die Bearbeitung von Schwachstellenmeldungen bereit und unterliegen dadurch ab dem 11. September 2026 den Melde- und Informationspflichten aus Art. 14 CRA. Aktiv ausgenutzte Schwachstellen werden entsprechend an die zuständige nationale CSIRT bzw. ENISA gemeldet; Nutzer, zu denen eine direkte Beziehung besteht, werden im gebotenen Rahmen informiert.

## So unterstützen Sie den Prozess

Wir bitten Sie,

- gefundene Schwachstellen zeitnah zu melden,
- die Privatsphäre anderer zu wahren und Systeme, Daten oder die Nutzererfahrung nicht zu beeinträchtigen,
- ausschließlich den oben genannten offiziellen Meldeweg zu nutzen,
- Informationen über die Schwachstelle bis zur Behebung vertraulich zu behandeln,
- Tests auf die im Geltungsbereich dieser Richtlinie genannten Systeme zu beschränken,
- nicht mehr Daten einzusehen oder zu verändern, als zum Nachweis der Schwachstelle erforderlich ist,
- von Denial-of-Service-Angriffen und Erpressungsversuchen abzusehen.

## Offenlegung

Mit dem Absenden einer Schwachstellenmeldung erklären Sie sich damit einverstanden,

- Informationen über die Schwachstelle nicht öffentlich zu machen und nicht an unbeteiligte Dritte weiterzugeben, bis die Schwachstelle geprüft und angemessene Maßnahmen ergriffen wurden oder eine mit uns abgestimmte Offenlegungsfrist abgelaufen ist,
- die Schwachstelle nicht über das zur Feststellung und Meldung erforderliche Maß hinaus zu nutzen und insbesondere keine Daten oder Datensätze einzusehen, zu verändern, herunterzuladen oder zu löschen,
- die an Ihrem Standort geltenden Gesetze und Vorschriften einzuhalten,
- die geltenden Datenschutzbestimmungen zu beachten und insbesondere personenbezogene Daten Dritter nicht ohne gültige Rechtsgrundlage offenzulegen,
- nach bestem Wissen berechtigt zu sein, die übermittelten Informationen und Anhänge zu übermitteln.

Auf Wunsch nennen wir Sie im Rahmen einer koordinierten Offenlegung als Entdecker der Schwachstelle.
