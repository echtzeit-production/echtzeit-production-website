// Neue Kunden hier eintragen — Domain als Key, Ziel-Email als Wert.
// Mehrere Domains pro Kunde möglich (z.B. www + non-www).
export const clients = {
  'https://echtzeit-production.de':       'info@echtzeit-production.de',
  'https://www.echtzeit-production.de':   'info@echtzeit-production.de',
  'https://test.echtzeit-production.de':  'info@echtzeit-production.de',

  // FrischGetankt — Staging läuft auf der echtzeit-digital.de Subdomain,
  // frischgetankt.de/www zeigen aktuell noch auf die alte WordPress-Seite.
  // Beide schon eingetragen, damit der Umzug ohne Backend-Änderung klappt.
  'https://frischgetankt.echtzeit-digital.de': 'info@frischgetankt.de',
  'https://frischgetankt.de':                  'info@frischgetankt.de',
  'https://www.frischgetankt.de':              'info@frischgetankt.de',

  // Neue Kunden einfach hier ergänzen:
  // 'https://kunde2.de':     'info@kunde2.de',
  // 'https://www.kunde2.de': 'info@kunde2.de',
};
