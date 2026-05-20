// Neue Kunden hier eintragen — Domain als Key, Ziel-Email als Wert.
// Mehrere Domains pro Kunde möglich (z.B. www + non-www).
export const clients = {
  'https://echtzeit-production.de':       'info@echtzeit-production.de',
  'https://www.echtzeit-production.de':   'info@echtzeit-production.de',
  'https://test.echtzeit-production.de':  'info@echtzeit-production.de',

  // Neue Kunden einfach hier ergänzen:
  // 'https://kunde2.de':     'info@kunde2.de',
  // 'https://www.kunde2.de': 'info@kunde2.de',
};
