# DSFV – Dansk Selskab for Vestibulogi

Statisk hjemmeside (kun HTML, CSS og en lille bitte smule JavaScript) for dansk selskab for vestibulogi. 

## Filstruktur

```
index.html               Hjem
fagomraade.html          Om DSFV › Fagområde
vedtaegter.html          Om DSFV › Vedtægter
bestyrelse.html          Om DSFV › Bestyrelse
stiftelsesreferat.html   Om DSFV › Stiftelsesreferat
aarsmoede-2026.html      Årsmøde 2026
bliv-medlem.html         Bliv medlem
kontakt.html             Kontakt
404.html                 Vises hvis en side ikke findes
assets/css/style.css     Al styling (farver øverst i filen)
assets/js/site.js        Header, menu, footer og formularer
assets/img/              Billeder og favicon
.nojekyll                To let github know. 
```

## Se siden på din egen computer

Download filerne. 

Dobbeltklik på `index.html`, eller – lidt mere realistisk – åben mappen i terminalen og kør:

```bash
python -m http.server 8000
```

derefter åbnes on browser med hjemmesiden <http://localhost:8000>.

### Senere implementering og brug af domænet dsfv.dk

Under **Settings › Pages › Custom domain** skrives `www.dsfv.dk`. Hos domæneudbyderen oprettes en CNAME-post for `www`, der peger på `<dit-brugernavn>.github.io`. GitHub laver selv HTTPS-certifikat.

## Sådan redigerer man på hjemmesiden 

- **Tekst på en side:** åbn den pågældende `.html`-fil og ret teksten mellem tags, fx `<p>…</p>`. Det kan også gøres direkte i GitHubs webredigering (blyant-ikonet).
- **Menuen:** rettes ét sted – listen `NAV` øverst i `assets/js/site.js`. Ny side = kopier en eksisterende `.html`-fil, ret titel og indhold, og tilføj den til `NAV`.
- **E-mailadresse:** `email` i `SITE` øverst i `assets/js/site.js` (nu `sek@dsfv.dk`). Den bruges i footeren og af kontaktformularen.
- **Farver og skrifttyper:** variablerne øverst i `assets/css/style.css` (`--brand`, `--accent` osv.).
- **Næste års årsmøde:** kopier `aarsmoede-2026.html` til `aarsmoede-2027.html` og ret `NAV`.

## Om formularerne

GitHub Pages er statisk og kan ikke modtage formulardata. Kontaktformularen åbner derfor brugerens eget mailprogram på telefonen eller computeren, med en udfyldt e-mail til selskabets adresse. Det er gratis og kræver intet, men brugeren skal selv trykke *send*. Det kan være problematisk hvis brugeren benytter webmail - altså mail igennem browseren. 

Ønsker vi at formularer sendes direkte fra siden, kan vi tilføje en gratis tjeneste som Formspree eller Basin bruges: fjern `data-mailto` fra `<form>` i `kontakt.html` og tilføj `action="https://formspree.io/f/<jeres-id>" method="POST"`.
