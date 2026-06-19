import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, ArrowSquareOut, ArrowsLeftRight, BookOpenText, Books, Brain,
  CheckCircle, Compass, Eye, Flag, Funnel, GlobeHemisphereEast, GridFour,
  House, LinkSimple, MagnifyingGlass, MapPin, Palette, Question, Ruler,
  Scales, Shuffle, Sparkle, TreeStructure, X,
} from '@phosphor-icons/react'
import { flags as curatedFlags, sources } from './data.js'
import { atlasCountries } from './atlasCountries.js'
import { flagFamilies, glossary, reasoningQuestions } from './knowledge.js'

const BASE = import.meta.env.BASE_URL
const flagSrc = (code) => `${BASE}flags/${code}.svg`
const curatedByCode = new Map(curatedFlags.map((flag) => [flag.code, flag]))
const countriesByCode = new Map(atlasCountries.map((country) => [country.code, country]))
const getCountry = (code) => countriesByCode.get(code)
const short = (text, length = 150) => text?.length > length ? `${text.slice(0, length).trim()}…` : text

const safeRead = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

const countrySummary = (country) => {
  const curated = curatedByCode.get(country.code)
  return curated?.hook || short(country.meaningPl || country.descriptionPl || 'Otwórz monografię i przeanalizuj konstrukcję flagi.')
}

const navItems = [
  { id: 'home', label: 'Start', icon: House },
  { id: 'atlas', label: 'Atlas', icon: GridFour },
  { id: 'lab', label: 'Pracownia', icon: BookOpenText },
  { id: 'compare', label: 'Porównaj', icon: Scales },
  { id: 'quiz', label: 'Quiz', icon: Question },
]

function PowerApp() {
  const [view, setView] = useState('home')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [seen, setSeen] = useState(() => safeRead('kim-flagi-seen-v2', []))
  const [compareCodes, setCompareCodes] = useState(['pl', 'id', 'mc'])

  const navigate = (next) => {
    setView(next)
    setSelectedCountry(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openCountry = (countryOrCode) => {
    const country = typeof countryOrCode === 'string' ? getCountry(countryOrCode) : countryOrCode
    if (!country) return
    setSelectedCountry(country)
    setSeen((current) => {
      const next = current.includes(country.code) ? current : [...current, country.code]
      localStorage.setItem('kim-flagi-seen-v2', JSON.stringify(next))
      return next
    })
  }

  const compareCountry = (country) => {
    setCompareCodes((current) => {
      if (current.includes(country.code)) return current
      return [country.code, ...current].slice(0, 3)
    })
    navigate('compare')
  }

  return (
    <div className="app-shell power-atlas">
      <a className="skip-link" href="#main">Przejdź do treści</a>
      <Header view={view} navigate={navigate} />
      <main id="main">
        {view === 'home' && <Home seen={seen} openCountry={openCountry} navigate={navigate} />}
        {view === 'atlas' && <Atlas seen={seen} openCountry={openCountry} />}
        {view === 'lab' && <KnowledgeLab openCountry={openCountry} navigate={navigate} setCompareCodes={setCompareCodes} />}
        {view === 'compare' && <Compare codes={compareCodes} setCodes={setCompareCodes} openCountry={openCountry} />}
        {view === 'quiz' && <Quiz openCountry={openCountry} />}
        {view === 'sources' && <Sources />}
      </main>
      <Footer navigate={navigate} />
      <MobileNav view={view} navigate={navigate} />
      {selectedCountry && <CountryDialog country={selectedCountry} onClose={() => setSelectedCountry(null)} onCompare={compareCountry} />}
    </div>
  )
}

function Header({ view, navigate }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')} aria-label="FUN WITH FLAGS, strona główna">
        <span className="brand-main">FUN<br />WITH<br />FLAGS</span>
        <span className="brand-kicker">KIM · ATLAS FLAG ŚWIATA</span>
      </button>
      <nav className="desktop-nav" aria-label="Główna nawigacja">
        {navItems.map(({ id, label }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => navigate(id)} aria-current={view === id ? 'page' : undefined}>{label}</button>)}
      </nav>
      <button className="source-shortcut" onClick={() => navigate('sources')}><Books size={18} /> Źródła</button>
    </header>
  )
}

function Home({ seen, openCountry, navigate }) {
  const mission = useMemo(() => atlasCountries[(new Date().getDate() * 7) % atlasCountries.length], [])
  const featured = ['np', 'za', 'br', 'gb'].map(getCountry)
  return (
    <>
      <section className="hero section-pad power-hero">
        <div className="eyebrow"><Sparkle size={16} weight="fill" /> Atlas weksylologiczny</div>
        <div className="hero-grid">
          <div>
            <h1>Nie zgaduj flag.<br /><em>Naucz się je czytać.</em></h1>
            <p className="hero-copy">Pełny katalog państw świata, techniczne opisy konstrukcji, symbolika, rodziny wzorów i historie, które wyjaśniają, dlaczego flaga wygląda właśnie tak.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => navigate('atlas')}>Otwórz 195 monografii <ArrowRight size={20} /></button>
              <button className="button ghost" onClick={() => navigate('lab')}>Wejdź do pracowni</button>
            </div>
            <div className="hero-stats" aria-label="Zakres atlasu">
              <span><strong>195</strong> państw</span><span><strong>10</strong> rodzin wzorów</span><span><strong>3</strong> tryby quizu</span>
            </div>
          </div>
          <button className="mission-card" onClick={() => openCountry(mission)} aria-label={`Otwórz monografię: ${mission.name}`}>
            <div className="mission-top"><span>Monografia dnia · {mission.code3}</span><Compass size={20} /></div>
            <div className={`mission-flag ${mission.code === 'np' ? 'is-nepal' : ''}`}><img src={flagSrc(mission.code)} alt={`Flaga: ${mission.name}`} /></div>
            <div className="mission-bottom"><div><small>{mission.continent}</small><strong>{mission.name}</strong></div><ArrowRight size={24} /></div>
          </button>
        </div>
      </section>

      <section className="method-section section-pad power-method">
        <div className="section-heading split">
          <div><span className="eyebrow"><Eye size={16} /> Metoda</span><h2>Od konstrukcji<br />do historii.</h2></div>
          <p>Najpierw opisujesz to, co rzeczywiście widać: pole, pasy, kanton, godła i proporcje. Dopiero potem przechodzisz do znaczeń, pochodzenia i zmian w czasie.</p>
        </div>
        <div className="method-grid">
          <article><span>01</span><Ruler size={34} /><h3>Analiza konstrukcji</h3><p>Techniczny opis każdej flagi uczy precyzyjnego języka: drzewce, swobodny brzeg, fimbriacja, godło i proporcje.</p></article>
          <article><span>02</span><TreeStructure size={34} /><h3>Rodziny wzorów</h3><p>Krzyże nordyckie, barwy panarabskie, trikolory słowiańskie i flagi, które wyglądają niemal identycznie.</p></article>
          <article><span>03</span><Brain size={34} /><h3>Rozumowanie</h3><p>Quiz nie pyta tylko „co to za kraj?”. Sprawdza także symbolikę, historię, geometrię i reguły rozróżniania.</p></article>
        </div>
      </section>

      <section className="featured-monographs section-pad">
        <div className="section-heading split">
          <div><span className="eyebrow dark"><BookOpenText size={16} /> Głębokie wejścia</span><h2>Cztery flagi,<br />cztery inne problemy.</h2></div>
          <p>Każda z tych monografii otwiera inny temat: geometrię, oficjalną symbolikę, astronomię albo nakładanie się znaków historycznych.</p>
        </div>
        <div className="featured-grid">{featured.map((country, index) => <button key={country.code} onClick={() => openCountry(country)}>
          <span>{String(index + 1).padStart(2, '0')} · {country.continent}</span>
          <img src={flagSrc(country.code)} alt={`Flaga: ${country.name}`} />
          <h3>{country.name}</h3><p>{countrySummary(country)}</p><span className="text-link">Czytaj monografię <ArrowRight size={18} /></span>
        </button>)}</div>
      </section>

      <section className="atlas-progress-strip section-pad">
        <div><span className="eyebrow dark">Twój indeks</span><strong>{seen.length}/195</strong><p>otwartych monografii na tym urządzeniu</p></div>
        <button className="button ink" onClick={() => navigate('atlas')}>Kontynuuj badanie <ArrowRight size={20} /></button>
      </section>
    </>
  )
}

function Atlas({ seen, openCountry }) {
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState('Wszystkie')
  const [family, setFamily] = useState('Wszystkie')
  const [color, setColor] = useState('Wszystkie')
  const [limit, setLimit] = useState(48)
  const continents = ['Wszystkie', ...new Set(atlasCountries.map((country) => country.continent))]
  const families = ['Wszystkie', ...new Set(atlasCountries.flatMap((country) => country.families))]
  const colors = ['Wszystkie', ...new Set(atlasCountries.flatMap((country) => country.colors))]

  useEffect(() => setLimit(48), [search, continent, family, color])

  const visible = atlasCountries.filter((country) => {
    const haystack = [country.name, country.englishName, country.officialName, country.capital, country.descriptionPl, country.meaningPl, ...country.localNames, ...country.families, ...country.colors].join(' ').toLocaleLowerCase('pl')
    return (!search || haystack.includes(search.toLocaleLowerCase('pl'))) &&
      (continent === 'Wszystkie' || country.continent === continent) &&
      (family === 'Wszystkie' || country.families.includes(family)) &&
      (color === 'Wszystkie' || country.colors.includes(color))
  })

  const reset = () => { setSearch(''); setContinent('Wszystkie'); setFamily('Wszystkie'); setColor('Wszystkie') }
  return (
    <section className="atlas section-pad page-top power-atlas-page">
      <div className="page-intro">
        <span className="eyebrow dark"><GridFour size={16} /> Pełny atlas państw</span>
        <h1>195 flag.<br /><em>Każda opisana.</em></h1>
        <p>Szukaj nie tylko po nazwie kraju. Wpisz „orzeł”, „półksiężyc”, „trójkąt”, „zielony” albo nazwę stolicy. Atlas przeszukuje konstrukcję, symbolikę i kontekst.</p>
      </div>
      <div className="atlas-tools advanced-tools">
        <label className="search-box"><MagnifyingGlass size={22} /><span className="sr-only">Szukaj w atlasie</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Kraj, symbol, kolor, stolica…" /></label>
        <div className="select-grid">
          <FilterSelect label="Kontynent" value={continent} onChange={setContinent} options={continents} />
          <FilterSelect label="Rodzina wzoru" value={family} onChange={setFamily} options={families} />
          <FilterSelect label="Kolor" value={color} onChange={setColor} options={colors} />
          <button className="reset-filters" onClick={reset}><Funnel size={18} /> Wyczyść filtry</button>
        </div>
      </div>
      <div className="atlas-count"><span>{visible.length} wyników</span><span>{seen.length} otwartych monografii</span></div>
      <div className="flag-grid power-flag-grid">{visible.slice(0, limit).map((country) => <CountryCard key={country.code} country={country} seen={seen.includes(country.code)} openCountry={openCountry} />)}</div>
      {visible.length > limit && <button className="load-more" onClick={() => setLimit((value) => value + 48)}>Pokaż kolejne 48 <ArrowRight size={18} /></button>}
      {!visible.length && <div className="empty-state"><MagnifyingGlass size={42} /><h2>Brak takiego zestawu cech.</h2><p>Wyczyść jeden filtr albo użyj szerszego hasła.</p><button className="button ghost" onClick={reset}>Wyczyść filtry</button></div>}
    </section>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return <label className="filter-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

function CountryCard({ country, seen, openCountry }) {
  return <button className="flag-card country-card" onClick={() => openCountry(country)}>
    <div className={`flag-image ${country.code === 'np' ? 'is-nepal' : ''}`}><img loading="lazy" src={flagSrc(country.code)} alt={`Flaga: ${country.name}`} /></div>
    <div className="flag-card-meta"><span>{country.code3} · {country.continent}</span>{seen && <span className="seen"><CheckCircle size={15} weight="fill" /> otwarta</span>}</div>
    <h2>{country.name}</h2><p>{countrySummary(country)}</p>
    <div className="micro-tags">{country.families.slice(0, 2).map((item) => <span key={item}>{item}</span>)}</div>
    <span className="open-label">Monografia <ArrowRight size={18} /></span>
  </button>
}

function CountryDialog({ country, onClose, onCompare }) {
  const [tab, setTab] = useState('construction')
  const curated = curatedByCode.get(country.code)
  const curatedSources = curated?.sourceIds?.map((id) => sources[id]).filter(Boolean) ?? []
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', close)
    document.body.classList.add('dialog-open')
    return () => { document.removeEventListener('keydown', close); document.body.classList.remove('dialog-open') }
  }, [onClose])

  const tabs = [
    ['construction', 'Konstrukcja'], ['meaning', 'Symbolika'], ['context', 'Kontekst'], ['sources', 'Źródła'],
  ]
  return <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="flag-dialog country-dialog" role="dialog" aria-modal="true" aria-labelledby="country-title">
      <button className="dialog-close" onClick={onClose} aria-label="Zamknij"><X size={24} /></button>
      <div className="country-dialog-head">
        <div className={`dialog-flag ${country.code === 'np' ? 'is-nepal' : ''}`}><img src={flagSrc(country.code)} alt={`Flaga: ${country.name}`} /></div>
        <div><span className="eyebrow dark">{country.code3} · {country.continent}</span><h2 id="country-title">{country.name}</h2><p>{country.officialName}</p>
          <div className="head-actions"><button className="button primary" onClick={() => onCompare(country)}><ArrowsLeftRight size={18} /> Porównaj</button><span>{country.capital}</span></div>
        </div>
      </div>
      <div className="monograph-tabs" role="tablist" aria-label="Rozdziały monografii">{tabs.map(([id, label]) => <button role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}>{label}</button>)}</div>
      <div className="monograph-body">
        {tab === 'construction' && <section><span className="chapter-label">01 · Opis techniczny</span><h3>Co dokładnie widać?</h3><p className="lead-text">{country.descriptionPl || country.description}</p>
          <div className="fact-columns"><div><strong>Barwy wykryte w opisie</strong><div className="micro-tags large">{country.colors.map((item) => <span key={item}>{item}</span>)}</div></div><div><strong>Rodziny i elementy</strong><div className="micro-tags large">{country.families.map((item) => <span key={item}>{item}</span>)}</div></div></div>
          {curated && <div className="curated-facts"><span><small>Wzór od</small><strong>{curated.year}</strong></span><span><small>Proporcje</small><strong>{curated.ratio}</strong></span><span><small>Liczba barw</small><strong>{curated.colors.length}</strong></span></div>}
        </section>}
        {tab === 'meaning' && <section><span className="chapter-label">02 · Znaczenie i pochodzenie</span><h3>Co można powiedzieć na podstawie źródeł?</h3>{curated?.story && <p className="lead-text">{curated.story}</p>}<p>{country.meaningPl || 'Źródło nie wydziela osobnej, oficjalnej interpretacji symboliki. To ważna informacja: brak oficjalnego znaczenia nie powinien być zastępowany legendą.'}</p>{country.notePl && <aside className="source-caution"><strong>Uwaga źródłowa</strong><p>{country.notePl}</p></aside>}</section>}
        {tab === 'context' && <section><span className="chapter-label">03 · Kontekst państwa</span><h3>Flaga nie istnieje w próżni.</h3><dl className="context-grid"><div><dt>Stolica</dt><dd>{country.capital}</dd></div><div><dt>Położenie</dt><dd>{country.locationPl || country.location || '—'}</dd></div><div><dt>Niepodległość / powstanie</dt><dd>{country.independencePl || country.independence || '—'}</dd></div><div><dt>Symbole narodowe</dt><dd>{country.nationalSymbolsPl || country.nationalSymbols || '—'}</dd></div><div><dt>Barwy narodowe</dt><dd>{country.nationalColorsPl || country.nationalColors || '—'}</dd></div><div><dt>Nazwy miejscowe</dt><dd>{country.localNames.join(' · ') || '—'}</dd></div></dl></section>}
        {tab === 'sources' && <section><span className="chapter-label">04 · Pochodzenie informacji</span><h3>Sprawdź podstawę opisu.</h3><div className="monograph-sources"><a href={country.source} target="_blank" rel="noreferrer"><div><strong>{country.sourceLabel}</strong><span>Opis konstrukcji, znaczenia i kontekst państwa</span></div><ArrowSquareOut size={20} /></a>{curatedSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><div><strong>{source.name}</strong><span>Źródło monografii pogłębionej</span></div><ArrowSquareOut size={20} /></a>)}<a href="https://flagpedia.net/about" target="_blank" rel="noreferrer"><div><strong>Flagpedia / FlagCDN</strong><span>Plik graficzny flagi i informacja o pochodzeniu</span></div><ArrowSquareOut size={20} /></a></div><p className="method-note">Polski tekst jest tłumaczeniem opisu źródłowego; oryginał pozostaje dostępny pod linkiem. Przy twierdzeniach spornych pokazujemy uwagę zamiast ukrywać niepewność.</p></section>}
      </div>
    </section>
  </div>
}

function KnowledgeLab({ openCountry, navigate, setCompareCodes }) {
  const compareSet = (codes) => { setCompareCodes(codes.slice(0, 3)); navigate('compare') }
  return <section className="knowledge-lab page-top">
    <div className="section-pad page-intro"><span className="eyebrow dark"><BookOpenText size={16} /> Pracownia weksylologiczna</span><h1>Język, który<br /><em>porządkuje flagi.</em></h1><p>To nie jest lista ciekawostek. To zestaw narzędzi do samodzielnej analizy: terminologia, rodziny wzorów i pytania, które pozwalają wykrywać podobieństwa oraz wyjątki.</p></div>
    <section className="glossary-section section-pad"><div className="section-heading split"><div><span className="eyebrow dark"><Ruler size={16} /> Słownik</span><h2>12 pojęć podstawowych.</h2></div><p>Gdy potrafisz nazwać części flagi, możesz porównywać je znacznie dokładniej niż przez „podobna” albo „inna”.</p></div><div className="glossary-grid">{glossary.map((item, index) => <article key={item.term}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.term}</h3><small>{item.english}</small><p>{item.definition}</p></article>)}</div></section>
    <section className="families-section section-pad"><div className="section-heading split"><div><span className="eyebrow"><TreeStructure size={16} /> Typologia</span><h2>Rodziny wzorów.</h2></div><p>Rodzina nie zawsze oznacza jedno pochodzenie. Czasem łączy wspólną historię, czasem konstrukcję, a czasem tylko problem rozpoznawczy.</p></div><div className="family-list">{flagFamilies.map((family, index) => <article key={family.id}><div className="family-number">{String(index + 1).padStart(2, '0')}</div><div><h3>{family.title}</h3><p>{family.summary}</p><ul>{family.questions.map((question) => <li key={question}>{question}</li>)}</ul></div><div className="family-flags">{family.codes.slice(0, 5).map((code) => { const country = getCountry(code); return country && <button key={code} onClick={() => openCountry(country)}><img src={flagSrc(code)} alt={`Flaga: ${country.name}`} /><span>{country.name}</span></button> })}</div><button className="compare-family" onClick={() => compareSet(family.codes)}>Porównaj przykłady <ArrowsLeftRight size={18} /></button></article>)}</div></section>
  </section>
}

function Compare({ codes, setCodes, openCountry }) {
  const selected = codes.map(getCountry).filter(Boolean)
  const sharedColors = selected.length ? selected[0].colors.filter((color) => selected.every((country) => country.colors.includes(color))) : []
  const sharedFamilies = selected.length ? selected[0].families.filter((family) => selected.every((country) => country.families.includes(family))) : []
  const setAt = (index, code) => setCodes((current) => current.map((item, itemIndex) => itemIndex === index ? code : item))
  return <section className="compare-page section-pad page-top">
    <div className="page-intro"><span className="eyebrow dark"><Scales size={16} /> Laboratorium porównawcze</span><h1>Różnica jest<br /><em>w szczególe.</em></h1><p>Ustaw obok siebie trzy flagi. Porównywarka zestawia nie tylko obrazy, lecz także opis techniczny, barwy, rodziny wzorów i znaczenia.</p></div>
    <div className="compare-selectors">{[0,1,2].map((index) => <label key={index}><span>Flaga {index + 1}</span><select value={codes[index]} onChange={(event) => setAt(index, event.target.value)}>{atlasCountries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}</select></label>)}</div>
    <div className="comparison-summary"><div><strong>Wspólne barwy</strong><p>{sharedColors.join(' · ') || 'Brak barwy wspólnej dla całej trójki'}</p></div><div><strong>Wspólna rodzina</strong><p>{sharedFamilies.join(' · ') || 'Brak wspólnej kategorii w tej typologii'}</p></div></div>
    <div className="compare-grid">{selected.map((country) => <article key={country.code}><button className="compare-flag" onClick={() => openCountry(country)}><img src={flagSrc(country.code)} alt={`Flaga: ${country.name}`} /></button><span>{country.code3} · {country.continent}</span><h2>{country.name}</h2><div><strong>Barwy</strong><p>{country.colors.join(', ') || '—'}</p></div><div><strong>Elementy</strong><p>{country.families.join(', ') || 'układ indywidualny'}</p></div><div><strong>Opis konstrukcji</strong><p>{country.descriptionPl}</p></div><div><strong>Symbolika</strong><p>{country.meaningPl || country.notePl || 'Źródło nie wydziela osobnej interpretacji.'}</p></div><button className="text-link" onClick={() => openCountry(country)}>Pełna monografia <ArrowRight size={18} /></button></article>)}</div>
  </section>
}

function Quiz({ openCountry }) {
  const [mode, setMode] = useState(null)
  const [run, setRun] = useState(0)
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const questions = useMemo(() => mode ? buildQuestions(mode) : [], [mode, run])
  const question = questions[index]

  const start = (nextMode) => { setMode(nextMode); setRun((value) => value + 1); setIndex(0); setAnswer(null); setScore(0); setDone(false) }
  const choose = (option) => { if (answer) return; setAnswer(option); if (option === question.answer) setScore((value) => value + 1) }
  const next = () => { if (index === questions.length - 1) setDone(true); else { setIndex((value) => value + 1); setAnswer(null) } }

  if (!mode) return <QuizModePicker start={start} />
  if (done) return <section className="quiz-page section-pad page-top"><div className="quiz-result advanced-result"><Brain size={78} /><span className="eyebrow dark">Seria zakończona</span><h1>{score}/{questions.length}</h1><p>{score >= questions.length - 1 ? 'Bardzo mocny wynik. Rozpoznajesz nie tylko flagi, ale też zasady ich budowy.' : score >= questions.length * .6 ? 'Dobra analiza. Warto otworzyć monografie pytań, które sprawiły kłopot.' : 'To nie był test na pamięć krótką. Wejdź do pracowni, a potem spróbuj ponownie.'}</p><div className="result-actions"><button className="button primary" onClick={() => start(mode)}>Nowa seria <Shuffle size={18} /></button><button className="button ghost" onClick={() => setMode(null)}>Zmień tryb</button></div></div></section>

  return <section className="quiz-page section-pad page-top"><div className="page-intro compact"><span className="eyebrow dark"><Question size={16} /> {modeLabel(mode)}</span><h1>{mode === 'recognition' ? 'Rozpoznaj bez podpowiedzi.' : mode === 'reasoning' ? 'Wyjaśnij, nie zgaduj.' : 'Znajdź wspólną regułę.'}</h1></div><div className="quiz-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /><small>Pytanie {index + 1} z {questions.length}</small></div><div className="quiz-card advanced-quiz-card"><QuizVisual question={question} /><div className="quiz-copy"><h2>{question.prompt}</h2><div className="answers">{question.options.map((option) => { const correct = answer && option === question.answer; const wrong = answer === option && option !== question.answer; return <button key={option} className={`${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} onClick={() => choose(option)} disabled={Boolean(answer)}>{option}{correct && <CheckCircle size={22} weight="fill" />}{wrong && <X size={22} />}</button> })}</div>{answer && <div className={`answer-note advanced-note ${answer === question.answer ? 'good' : ''}`} role="status"><strong>{answer === question.answer ? 'Trafnie.' : 'Nie tym razem.'}</strong><p>{question.explanation}</p><div>{question.code && <button className="secondary-answer-action" onClick={() => openCountry(question.code)}>Otwórz monografię</button>}<button onClick={next}>{index === questions.length - 1 ? 'Zobacz wynik' : 'Następne pytanie'} <ArrowRight size={18} /></button></div></div>}</div></div></section>
}

function QuizModePicker({ start }) {
  const modes = [
    { id: 'recognition', icon: Eye, title: 'Rozpoznawanie', meta: '10 flag · cały świat', text: 'Losowe flagi z pełnego katalogu. Odpowiedzi zmieniają się przy każdej serii.' },
    { id: 'reasoning', icon: Brain, title: 'Wiedza i rozumowanie', meta: '10 pytań · poziom głęboki', text: 'Symbolika, historia, geometria i reguły. Każda odpowiedź ma wyjaśnienie.' },
    { id: 'families', icon: TreeStructure, title: 'Rodziny wzorów', meta: '8 zestawów · analiza porównawcza', text: 'Trzy flagi tworzą zestaw. Twoim zadaniem jest nazwać wspólną konstrukcję albo tradycję.' },
  ]
  return <section className="quiz-modes section-pad page-top"><div className="page-intro"><span className="eyebrow dark"><Brain size={16} /> Trening</span><h1>Trzy różne<br /><em>rodzaje wiedzy.</em></h1><p>Rozpoznanie obrazu to dopiero początek. Osobne tryby ćwiczą pamięć wzrokową, rozumowanie i dostrzeganie rodzin projektowych.</p></div><div className="mode-grid">{modes.map(({ id, icon: Icon, title, meta, text }) => <button key={id} onClick={() => start(id)}><Icon size={42} /><span>{meta}</span><h2>{title}</h2><p>{text}</p><strong>Rozpocznij <ArrowRight size={18} /></strong></button>)}</div></section>
}

function QuizVisual({ question }) {
  if (question.codes) return <div className="quiz-flag family-quiz-visual">{question.codes.map((code) => <img key={code} src={flagSrc(code)} alt={`Flaga: ${getCountry(code)?.name}`} />)}</div>
  return <div className={`quiz-flag ${question.code === 'np' ? 'is-nepal' : ''}`}><img src={flagSrc(question.code)} alt="Flaga analizowana w pytaniu" /></div>
}

function buildQuestions(mode) {
  if (mode === 'reasoning') return shuffle(reasoningQuestions).slice(0, 10)
  if (mode === 'families') return shuffle(flagFamilies).map((family) => ({
    codes: family.codes.slice(0, 3), prompt: 'Jaka rodzina najlepiej opisuje wspólną cechę tych flag?', answer: family.title,
    options: shuffle([family.title, ...flagFamilies.filter((item) => item.id !== family.id).slice(0, 3).map((item) => item.title)]),
    explanation: family.summary,
  }))
  return shuffle(atlasCountries).slice(0, 10).map((country) => {
    const distractors = shuffle(atlasCountries.filter((item) => item.code !== country.code && item.continent === country.continent)).slice(0, 3)
    return { code: country.code, prompt: 'Którego państwa jest to flaga?', answer: country.name, options: shuffle([country.name, ...distractors.map((item) => item.name)]), explanation: country.descriptionPl }
  })
}

function shuffle(items) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) { const target = Math.floor(Math.random() * (index + 1)); [copy[index], copy[target]] = [copy[target], copy[index]] }
  return copy
}
const modeLabel = (mode) => ({ recognition: 'Rozpoznawanie', reasoning: 'Wiedza i rozumowanie', families: 'Rodziny wzorów' }[mode])

function Sources() {
  const core = [
    { name: 'World Factbook — końcowe archiwum 2026', url: 'https://github.com/factbook/factbook.json', role: 'Opisy konstrukcji i znaczeń flag oraz kontekst państw; dane CC0.' },
    { name: 'Flags of the World', url: 'https://www.fotw.info/', role: 'Największa baza weksylologiczna: flagi państwowe, historyczne, regionalne i specjalne.' },
    { name: 'Flagpedia / FlagCDN', url: 'https://flagpedia.net/about', role: 'Aktualne pliki flag bazujące na Wikimedia Commons.' },
    { name: 'world-countries', url: 'https://github.com/mledoze/countries', role: 'Nazwy polskie, kody ISO i klasyfikacja państw.' },
  ]
  return <section className="sources-page section-pad page-top"><div className="page-intro"><span className="eyebrow dark"><Books size={16} /> Źródła i metodologia</span><h1>Duży atlas<br /><em>musi być sprawdzalny.</em></h1><p>Każda monografia wskazuje własne źródło. Oficjalne znaczenie, interpretacja historyczna i popularna legenda nie są traktowane jak to samo.</p></div><div className="source-note"><LinkSimple size={30} /><div><strong>Jak czytać pewność?</strong><p>Gdy źródło nie podaje oficjalnej symboliki, atlas mówi o tym wprost. Gdy istnieje wariant cywilny, państwowy albo spór o reprezentację, uwaga zostaje zachowana w monografii.</p></div></div><div className="source-list">{core.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{source.name}</strong><small>{source.role}</small></div><ArrowSquareOut size={20} /></a>)}{Object.values(sources).filter((source) => !source.name.includes('Flagpedia')).map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{String(index + 5).padStart(2, '0')}</span><strong>{source.name}</strong><ArrowSquareOut size={20} /></a>)}</div></section>
}

function Footer({ navigate }) {
  return <footer className="site-footer"><div className="footer-brand">FUN WITH FLAGS</div><p>195 monografii flag państwowych, pracownia weksylologiczna i trening rozumowania. Bez kont, reklam i śledzenia.</p><button onClick={() => navigate('sources')}>Źródła i metodologia <ArrowRight size={18} /></button><a href="https://github.com/jakiesluchawki/KIM-FLAGI" target="_blank" rel="noreferrer">GitHub <ArrowSquareOut size={16} /></a></footer>
}

function MobileNav({ view, navigate }) {
  return <nav className="mobile-nav power-mobile-nav" aria-label="Nawigacja mobilna">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => navigate(id)} aria-current={view === id ? 'page' : undefined}><Icon size={21} weight={view === id ? 'fill' : 'regular'} /><span>{label}</span></button>)}</nav>
}

export default PowerApp
