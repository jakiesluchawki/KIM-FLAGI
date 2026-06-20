# FUN WITH FLAGS / KIM-FLAGI

Interaktywny, źródłowy atlas weksylologiczny. Zawiera:

- 195 flag państwowych: 193 członków ONZ oraz Watykan i Palestynę;
- polską monografię każdej flagi z opisem konstrukcji, symboliką, kontekstem i źródłem;
- wyszukiwanie według państwa, stolicy, symbolu, koloru i rodziny wzoru oraz filtr zapisanych flag;
- pracownię z terminologią i ośmioma rodzinami projektowymi;
- sześć wielopaństwowych szlaków badawczych z postępem czytania;
- lokalny zeszyt badacza z zapisanymi flagami i własnymi notatkami;
- porównywarkę trzech flag z analizą podobieństwa i gotowymi zestawami;
- cztery tryby quizu: rozpoznawanie, wiedza i rozumowanie, rodziny wzorów oraz dedukcja z poszlak.

## Uruchomienie

```sh
npm install
npm run dev
```

## Kontrola jakości

```sh
npm test
npm run build
```

## Odtwarzanie danych

```sh
npm run data:atlas
```

Polecenie pobiera najnowszy snapshot repozytorium `factbook/factbook.json`, łączy go z polskimi nazwami ISO i lokalnym cache'em tłumaczeń, a następnie odtwarza `src/atlasCountries.js` oraz brakujące pliki flag.

## Publikacja

Projekt jest przygotowany dla GitHub Pages pod adresem `/KIM-FLAGI/`.

Szczegóły pochodzenia danych i licencji znajdują się w `DATA_SOURCES.md`. Każda monografia ma też bezpośredni odnośnik do własnego źródła.
