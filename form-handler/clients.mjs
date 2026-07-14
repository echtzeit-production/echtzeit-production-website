// Neue Kunden hier eintragen — Domain als Key.
// `to`:   Ziel-Postfach, wohin die Anfrage inhaltlich zugestellt wird.
// `from`: Absenderadresse für den SMTP-Versand über Brevo — MUSS eine in
//         Brevo verifizierte Sendedomain sein (SPF/DKIM), sonst Zustellprobleme.
//         Bis ein Kunde seine eigene Domain in Brevo verifiziert hat, läuft
//         `from` weiterhin über die verifizierte echtzeit-production.de.
// Mehrere Domains pro Kunde möglich (z.B. www + non-www).
export const clients = {
  'https://echtzeit-production.de':       { to: 'info@echtzeit-production.de', from: 'info@echtzeit-production.de' },
  'https://www.echtzeit-production.de':   { to: 'info@echtzeit-production.de', from: 'info@echtzeit-production.de' },
  'https://test.echtzeit-production.de':  { to: 'info@echtzeit-production.de', from: 'info@echtzeit-production.de' },

  // FrischGetankt — Staging läuft auf der echtzeit-digital.de Subdomain,
  // frischgetankt.de/www zeigen aktuell noch auf die alte WordPress-Seite.
  // Beide schon eingetragen, damit der Umzug ohne Backend-Änderung klappt.
  // frischgetankt.de ist als Brevo-Sendedomain verifiziert (SPF/DKIM), daher
  // `from` jetzt auf die eigene Domain umgestellt.
  'https://frischgetankt.echtzeit-digital.de': { to: 'info@frischgetankt.de', from: 'info@frischgetankt.de' },
  'https://frischgetankt.de':                  { to: 'info@frischgetankt.de', from: 'info@frischgetankt.de' },
  'https://www.frischgetankt.de':              { to: 'info@frischgetankt.de', from: 'info@frischgetankt.de' },

  // Neue Kunden einfach hier ergänzen:
  // 'https://kunde2.de': { to: 'info@kunde2.de', from: 'info@echtzeit-production.de' },
};
