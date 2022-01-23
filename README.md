## DiversIT Social Platform

Aufrufbar unter: https://mintistcool-be74c.web.app/

## Entwickler Installationsanleitung
Was muss installiert werden um mitentwickelt zu können? (verwendeter Quelltext-Editor --> VS Code): \
a) Node.js (https://nodejs.org/en/) \
b) Angular CLI (in Commandline: npm install -g @angular/cli) \
c) Visual Studio Code (https://code.visualstudio.com/) \
d) git (https://git-scm.com/downloads) --> (user.email und user.name konfigurieren!) \
d1) In Commandline: git config --global user.email "..." \
d2) In Commandline: git config --global user.name "..." \
\
Speziell (Nur beim Auftreten von Fehlermeldungen dass eine Komponente nicht installiert ist): \
e) Angular Devkit (in Commandline: npm install --save-dev @angular-devkit/build-angular) \
f) Angular Compiler CLI (in Commandline: npm install --save-dev @angular/compiler-cli) \
g) Angular Compiler (in Commandline: npm install --save-dev @angular/compiler) \
\
Starten der Angular-Web-App (ACHTUNG: Darauf achten dass man im Terminal im richtigen Ordner ist): \
h) Node_Modules installieren --> npm install \
i) Webserver starten --> ng serve (Default-Host: http://localhost:4200)

## Dokumentation
Die Dokumentation kann gefunden werden im Verzeichnis ./diversIT/documentation/index.html.

Zusätzlich ist in der folgenden Abbildung die Komponentenstruktur dargestellt.
<img src="https://github.com/stefan-hinterhoelzl/DiversIT/blob/main/diversIT/src/assets/documentation/diversIT-Component-hierarchy.svg?raw=true" alt="Darstellung der Komponentenhierarchie - Laden Fehlgeschlagen">

Die Verbindung an die von Firebase bereitgestellten Services sieht wie folgt aus:
<img src="https://github.com/stefan-hinterhoelzl/DiversIT/blob/main/diversIT/src/assets/documentation/diversIT-firebase-service-model.svg?raw=true" alt="Darstellung der DiversIT und Firebase Service verbindung - Laden Fehlgeschlagen">

Schlussendlich wird in folgender Abbildung, das "Datenbankschema" der Firestore NoSQL Datenbank dargestellt.
<img src="https://github.com/stefan-hinterhoelzl/DiversIT/blob/main/diversIT/src/assets/documentation/firestore-schema.svg?raw=true" alt="Darstellung des Firestore 'Datebankschemas' - Laden Fehlgeschlagen">