export const glossary = [
  { term: 'Drzewce', english: 'hoist', definition: 'Krawędź flagi przymocowana do masztu albo linki. Gdy opis mówi „przy drzewcu”, chodzi o tę stronę.' },
  { term: 'Swobodny brzeg', english: 'fly', definition: 'Krawędź najdalej od masztu. To ona porusza się najbardziej podczas wiatru.' },
  { term: 'Pole', english: 'field', definition: 'Główna powierzchnia i kolor tła flagi, na których umieszcza się pozostałe elementy.' },
  { term: 'Kanton', english: 'canton', definition: 'Wyróżniony górny róg przy drzewcu. Union Jack na flagach Australii i Nowej Zelandii znajduje się właśnie w kantonie.' },
  { term: 'Godło', english: 'charge', definition: 'Figura umieszczona na polu: gwiazda, słońce, zwierzę, roślina, tarcza albo inny znak.' },
  { term: 'Proporcje', english: 'ratio', definition: 'Stosunek wysokości do długości. 2:3 oznacza, że na każde dwie jednostki wysokości przypadają trzy długości.' },
  { term: 'Fimbriacja', english: 'fimbriation', definition: 'Wąski pasek oddzielający kolory lub figury, żeby nie zlewały się ze sobą. Dobrze widać ją na fladze RPA.' },
  { term: 'Trikolora', english: 'tricolour', definition: 'Flaga z trzema pasami, zwykle równymi. Pasy mogą być pionowe albo poziome.' },
  { term: 'Saltire', english: 'diagonal cross', definition: 'Krzyż w kształcie litery X, nazywany też krzyżem św. Andrzeja. Występuje między innymi na fladze Jamajki.' },
  { term: 'Sztandar herbowy', english: 'banner of arms', definition: 'Flaga, której całe pole odtwarza układ herbu. Nie jest tym samym co herb położony na zwykłym tle.' },
  { term: 'Flaga cywilna', english: 'civil flag', definition: 'Wariant przeznaczony do użycia przez obywateli. Nie każde państwo używa dokładnie tego samego wzoru dla obywateli, władz i wojska.' },
  { term: 'Weksylologia', english: 'vexillology', definition: 'Nauka o historii, symbolice i użyciu flag. Projektowanie flag nazywa się weksylografią.' },
]

export const flagFamilies = [
  {
    id: 'nordic', title: 'Krzyż nordycki', codes: ['dk', 'se', 'no', 'fi', 'is'],
    summary: 'Krzyż jest przesunięty w stronę drzewca, a nie wyśrodkowany. Najstarszym wzorem tej rodziny jest Dannebrog — flaga Danii.',
    questions: ['W którą stronę przesunięto krzyż?', 'Które kolory zmieniają się między państwami?', 'Czy wszystkie proporcje są identyczne?'],
  },
  {
    id: 'panarab', title: 'Barwy panarabskie', codes: ['ps', 'jo', 'kw', 'ae', 'sd', 'ye', 'iq', 'sy'],
    summary: 'Czerń, biel, zieleń i czerwień powracają w wielu flagach świata arabskiego. Układy są różne, a konkretna symbolika zależy od państwa i epoki.',
    questions: ['Gdzie pojawia się trójkąt?', 'Które flagi dodają gwiazdy?', 'Jak zmiana układu pasów zmienia rozpoznawalność?'],
  },
  {
    id: 'panslavic', title: 'Trikolory słowiańskie', codes: ['ru', 'sk', 'si', 'rs', 'hr'],
    summary: 'Biel, błękit i czerwień tworzą rodzinę podobnych trikolor. Herby i kolejność pasów pozwalają rozróżnić poszczególne państwa.',
    questions: ['Która flaga nie ma herbu?', 'Gdzie herb leży bliżej drzewca?', 'Jak odróżnić Słowację od Słowenii?'],
  },
  {
    id: 'southern-cross', title: 'Krzyż Południa', codes: ['au', 'nz', 'pg', 'ws', 'br'],
    summary: 'Ten sam gwiazdozbiór można przedstawić na kilka sposobów: inną liczbą gwiazd, liczbą ramion, kolorem i położeniem.',
    questions: ['Dlaczego Brazylia pokazuje więcej gwiazd?', 'Czym różnią się gwiazdy Australii i Nowej Zelandii?', 'Która flaga nie ma niebieskiego pola?'],
  },
  {
    id: 'union', title: 'Union Jack w kantonie', codes: ['au', 'nz', 'fj', 'tv'],
    summary: 'Umieszczenie Union Jacka w kantonie zapisuje historyczny związek z Wielką Brytanią. Pozostała część flagi nadaje państwu własną tożsamość.',
    questions: ['Co zajmuje pole poza kantonem?', 'Które wzory używają gwiazd?', 'Jaką część flagi zajmuje kanton?'],
  },
  {
    id: 'pan-african', title: 'Barwy panafrykańskie', codes: ['et', 'gh', 'sn', 'cm', 'gn', 'ml'],
    summary: 'Zieleń, żółć i czerwień upowszechniły się dzięki fladze Etiopii, państwa kojarzonego z niezależnością od kolonializmu. Nie każda flaga tłumaczy te barwy tak samo.',
    questions: ['Które pasy są pionowe, a które poziome?', 'Gdzie dodano gwiazdę?', 'Jak kolejność kolorów odróżnia Mali od Gwinei?'],
  },
  {
    id: 'crescent', title: 'Półksiężyc i gwiazda', codes: ['tr', 'tn', 'pk', 'dz', 'mr', 'my'],
    summary: 'Półksiężyc nie ma jednego uniwersalnego znaczenia ani jednego pochodzenia. Liczba gwiazd, ich ramion i relacja z półksiężycem są ważnymi cechami diagnostycznymi.',
    questions: ['Czy gwiazda zawsze ma pięć ramion?', 'Które flagi dodają pasy?', 'Jak zmienia się kierunek otwarcia półksiężyca?'],
  },
  {
    id: 'lookalikes', title: 'Prawie bliźniacze', codes: ['pl', 'id', 'mc', 'ro', 'td', 'ie', 'ci'],
    summary: 'Czasem różnicą jest kolejność kolorów, odcień albo proporcja. Właśnie dlatego dokładny opis techniczny jest ważniejszy niż szybkie wrażenie.',
    questions: ['Jak odróżnić Monako od Indonezji?', 'Dlaczego Rumunia i Czad nie są identyczne?', 'Która flaga jest lustrzanym odbiciem Irlandii?'],
  },
]

export const reasoningQuestions = [
  { code: 'np', prompt: 'Dlaczego opis flagi Nepalu nie mieści się w zwykłym schemacie „wysokość × długość”?', answer: 'Jej obrys tworzą dwa połączone proporce', options: ['Jest używana tylko pionowo', 'Jej obrys tworzą dwa połączone proporce', 'Nie ma ustalonych wymiarów', 'Jest zawsze kwadratowa'], explanation: 'Nepal jest jedynym państwem z flagą, która nie jest prostokątna ani kwadratowa. Jej konstrukcja jest opisana geometrycznie w konstytucji.' },
  { code: 'za', prompt: 'Co jest oficjalnym znaczeniem centralnego kształtu Y na fladze RPA?', answer: 'Zbieganie się różnych dróg we wspólną przyszłość', options: ['Sześć prowincji', 'Dwie wielkie rzeki', 'Zbieganie się różnych dróg we wspólną przyszłość', 'Górnicze tunele'], explanation: 'Rząd RPA wyraźnie zaznacza, że pojedynczym kolorom nie przypisano jednego oficjalnego znaczenia. Znaczenie ma przede wszystkim idea zbieżności.' },
  { code: 'ca', prompt: 'Dlaczego liść klonu na fladze Kanady ma 11 punktów, a nie 13?', answer: 'Jedenastopunktowy był czytelniejszy z daleka', options: ['Kanada miała 11 prowincji', 'Jedenastopunktowy był czytelniejszy z daleka', 'Tak wygląda każdy liść klonu', 'To liczba liter w nazwie kraju'], explanation: 'Prototypy testowano w ruchu i z dystansu. Uproszczenie poprawiło rozpoznawalność znaku na falującej tkaninie.' },
  { code: 'br', prompt: 'Co przedstawia układ gwiazd na fladze Brazylii?', answer: 'Niebo nad Rio de Janeiro 15 listopada 1889 roku', options: ['Losowy układ 27 gwiazd', 'Mapę stanów Brazylii', 'Niebo nad Rio de Janeiro 15 listopada 1889 roku', 'Gwiazdozbiór Wielkiej Niedźwiedzicy'], explanation: 'Każda gwiazda odpowiada jednostce federacji, ale ich układ jest astronomicznym obrazem nieba związanym z ogłoszeniem republiki.' },
  { code: 'gb', prompt: 'Dlaczego smok Walii nie został dodany do Union Jacka?', answer: 'Walia była już politycznie połączona z Anglią', options: ['Smok był zbyt skomplikowany', 'Walia zrezygnowała z własnych symboli', 'Walia była już politycznie połączona z Anglią', 'Union Jack powstał przed Walią'], explanation: 'Gdy w 1606 roku tworzono pierwszą flagę unii, Walię traktowano jako część królestwa Anglii.' },
  { code: 'us', prompt: 'Który element flagi USA zmienia się po przyjęciu nowego stanu?', answer: 'Liczba gwiazd w kantonie', options: ['Liczba pasów', 'Kolor czerwieni', 'Liczba gwiazd w kantonie', 'Proporcje flagi'], explanation: 'Trzynaście pasów pozostaje pamiątką po pierwotnych koloniach. Gwiazdy odpowiadają aktualnej liczbie stanów.' },
  { code: 'ch', prompt: 'Które stwierdzenie o fladze Szwajcarii jest najdokładniejsze?', answer: 'Oficjalna flaga lądowa jest kwadratowa', options: ['Każda jej wersja jest prostokątna', 'Oficjalna flaga lądowa jest kwadratowa', 'Krzyż dotyka krawędzi', 'Ma proporcje 2:3'], explanation: 'Szwajcarska flaga państwowa jest kwadratowa, ale istnieją szczególne prostokątne warianty, na przykład bandera morska.' },
  { code: 'kr', prompt: 'Jaką rolę pełnią cztery trygramy na fladze Korei Południowej?', answer: 'Reprezentują niebo, ziemię, wodę i ogień', options: ['Zapisują nazwę państwa', 'Oznaczają cztery prowincje', 'Reprezentują niebo, ziemię, wodę i ogień', 'Wyznaczają strony świata'], explanation: 'Trygramy są częścią systemu symbolicznego, a centralny taegeuk przedstawia relację przeciwstawnych i uzupełniających się sił.' },
  { code: 'in', prompt: 'Co odróżnia Aśoka Chakrę od zwykłego koła?', answer: 'Ma 24 dokładnie rozmieszczone szprychy', options: ['Jest ośmiokątna', 'Ma 24 dokładnie rozmieszczone szprychy', 'Zawsze jest czarna', 'Znajduje się przy drzewcu'], explanation: 'Granatowe koło w białym pasie ma 24 szprychy. Jest jednym z najbardziej precyzyjnie określonych elementów flagi Indii.' },
  { code: 'au', prompt: 'Co oznacza siódme ramię dużej Gwiazdy Wspólnoty Australii?', answer: 'Terytoria Australii', options: ['Siódmy kontynent', 'Terytoria Australii', 'Nową Zelandię', 'Siedem mórz'], explanation: 'Pierwotnie gwiazda miała sześć ramion dla sześciu stanów. Siódme dodano, by reprezentowało terytoria.' },
  { code: 'pl', prompt: 'Dlaczego biel znajduje się nad czerwienią na fladze Polski?', answer: 'Biel godła ma pierwszeństwo przed barwą pola tarczy', options: ['Jest jaśniejsza', 'Tak układają się kolory tęczy', 'Biel godła ma pierwszeństwo przed barwą pola tarczy', 'Zdecydował o tym przypadek'], explanation: 'Układ wywodzi się z heraldyki: biały Orzeł jest godłem, a czerwień jego polem.' },
  { code: 'jm', prompt: 'Jak weksylolog nazwie złoty ukośny krzyż na fladze Jamajki?', answer: 'Saltire', options: ['Kanton', 'Fimbriacja', 'Saltire', 'Trikolora'], explanation: 'Saltire to krzyż w kształcie litery X. Ten termin pozwala opisać konstrukcję bez oglądania obrazka.' },
]
