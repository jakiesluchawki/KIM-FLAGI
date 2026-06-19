import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, ArrowSquareOut, Books, CheckCircle, Compass, Eye, Flag,
  GlobeHemisphereEast, GridFour, House, LinkSimple, MagnifyingGlass,
  Medal, Question, Shuffle, Sparkle, Star, Trophy, X,
} from '@phosphor-icons/react'
import { flags, quizQuestions, sources } from './data.js'

const BASE = import.meta.env.BASE_URL
const flagSrc = (code) => `${BASE}flags/${code}.svg`

const safeRead = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function App() {
  const [view, setView] = useState('home')
  const [selectedFlag, setSelectedFlag] = useState(null)
  const [seen, setSeen] = useState(() => safeRead('kim-flagi-seen', []))
  const [best, setBest] = useState(() => safeRead('kim-flagi-best', 0))

  const navigate = (next) => {
    setView(next)
    setSelectedFlag(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openFlag = (flag) => {
    setSelectedFlag(flag)
    setSeen((current) => {
      const next = current.includes(flag.code) ? current : [...current, flag.code]
      localStorage.setItem('kim-flagi-seen', JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    if (!selectedFlag) return
    const close = (event) => event.key === 'Escape' && setSelectedFlag(null)
    document.addEventListener('keydown', close)
    document.body.classList.add('dialog-open')
    return () => {
      document.removeEventListener('keydown', close)
      document.body.classList.remove('dialog-open')
    }
  }, [selectedFlag])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Przejdź do treści</a>
      <Header view={view} navigate={navigate} />
      <main id="main">
        {view === 'home' && <Home onOpen={openFlag} navigate={navigate} />}
        {view === 'atlas' && <Atlas seen={seen} onOpen={openFlag} />}
        {view === 'quiz' && <Quiz best={best} onBest={setBest} />}
        {view === 'collection' && <Collection seen={seen} best={best} navigate={navigate} />}
        {view === 'sources' && <Sources />}
      </main>
      <Footer navigate={navigate} />
      <MobileNav view={view} navigate={navigate} />
      {selectedFlag && <FlagDialog flag={selectedFlag} onClose={() => setSelectedFlag(null)} />}
    </div>
  )
}

const navItems = [
  { id: 'home', label: 'Start', icon: House },
  { id: 'atlas', label: 'Atlas', icon: GridFour },
  { id: 'quiz', label: 'Quiz', icon: Question },
  { id: 'collection', label: 'Odznaki', icon: Trophy },
]

function Header({ view, navigate }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')} aria-label="FUN WITH FLAGS, strona główna">
        <span className="brand-main">FUN<br />WITH<br />FLAGS</span>
        <span className="brand-kicker">KIM · ATLAS FLAG ŚWIATA</span>
      </button>
      <nav className="desktop-nav" aria-label="Główna nawigacja">
        {navItems.map(({ id, label }) => (
          <button key={id} className={view === id ? 'active' : ''} onClick={() => navigate(id)} aria-current={view === id ? 'page' : undefined}>{label}</button>
        ))}
      </nav>
      <button className="source-shortcut" onClick={() => navigate('sources')}><Books size={18} weight="bold" /> Źródła</button>
    </header>
  )
}

function Home({ onOpen, navigate }) {
  const mission = useMemo(() => flags[new Date().getDate() % flags.length], [])
  const ribbon = [...flags.slice(0, 10), ...flags.slice(0, 10)]
  return (
    <>
      <section className="hero section-pad">
        <div className="eyebrow"><Sparkle size={16} weight="fill" /> Interaktywny atlas młodego flagologa</div>
        <div className="hero-grid">
          <div>
            <h1>Każda flaga<br /><em>ma coś do powiedzenia.</em></h1>
            <p className="hero-copy">Rozszyfruj kolory, symbole i historie z całego świata. Patrz uważnie — na flagach nic nie znalazło się bez powodu.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => navigate('atlas')}>Otwórz atlas <ArrowRight size={20} weight="bold" /></button>
              <button className="button ghost" onClick={() => navigate('quiz')}>Zagraj w quiz</button>
            </div>
            <div className="hero-stats" aria-label="Zawartość atlasu">
              <span><strong>20</strong> flag</span><span><strong>5</strong> kontynentów</span><span><strong>8</strong> pytań</span>
            </div>
          </div>
          <button className="mission-card" onClick={() => onOpen(mission)} aria-label={`Odkryj flagę: ${mission.name}`}>
            <div className="mission-top"><span>Misja na dziś</span><Shuffle size={20} weight="bold" /></div>
            <div className={`mission-flag ${mission.code === 'np' ? 'is-nepal' : ''}`}><img src={flagSrc(mission.code)} alt={`Flaga: ${mission.name}`} /></div>
            <div className="mission-bottom"><div><small>Odkryj</small><strong>{mission.name}</strong></div><ArrowRight size={24} weight="bold" /></div>
          </button>
        </div>
      </section>

      <div className="flag-ribbon" aria-hidden="true">
        <div>{ribbon.map((flag, index) => <img key={`${flag.code}-${index}`} src={flagSrc(flag.code)} alt="" />)}</div>
      </div>

      <section className="method-section section-pad">
        <div className="section-heading split">
          <div><span className="eyebrow dark"><Eye size={16} weight="bold" /> Zostań detektywem flag</span><h2>Najpierw patrz.<br />Potem pytaj: „dlaczego?”</h2></div>
          <p>Kolor może pamiętać dawny herb. Gwiazda może być miejscem na mapie nieba. Nawet liczba pasków bywa wskazówką.</p>
        </div>
        <div className="method-grid">
          <article><span>01</span><Compass size={32} weight="duotone" /><h3>Znajdź kraj</h3><p>Zobacz flagę w atlasie i sprawdź, z którego kontynentu pochodzi.</p></article>
          <article><span>02</span><MagnifyingGlass size={32} weight="duotone" /><h3>Wytrop symbole</h3><p>Policz gwiazdy, obejrzyj kolory i znajdź nietypowy kształt.</p></article>
          <article><span>03</span><Medal size={32} weight="duotone" /><h3>Sprawdź pamięć</h3><p>Zagraj w quiz i wracaj po własny rekord.</p></article>
        </div>
      </section>

      <section className="records section-pad">
        <div className="section-heading"><span className="eyebrow"><Star size={16} weight="fill" /> Flagowe rekordy</span><h2>Niektóre flagi łamią zasady.</h2></div>
        <div className="record-grid">
          {flags.filter((f) => f.record).map((flag) => (
            <button key={flag.code} className="record-card" onClick={() => onOpen(flag)}>
              <img src={flagSrc(flag.code)} alt={`Flaga: ${flag.name}`} />
              <span>{flag.name}</span><strong>{flag.record}</strong><ArrowRight size={22} weight="bold" />
            </button>
          ))}
          <button className="record-card color-record" onClick={() => onOpen(flags.find((f) => f.code === 'za'))}>
            <div className="color-stack" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <span>Republika Południowej Afryki</span><strong>Sześć kolorów w jednym projekcie</strong><ArrowRight size={22} weight="bold" />
          </button>
        </div>
      </section>

      <section className="cta-strip section-pad">
        <GlobeHemisphereEast size={80} weight="duotone" />
        <div><span className="eyebrow dark">Gotowy?</span><h2>Świat czeka na odkrycie.</h2></div>
        <button className="button ink" onClick={() => navigate('atlas')}>Wyruszam <ArrowRight size={20} weight="bold" /></button>
      </section>
    </>
  )
}

function Atlas({ seen, onOpen }) {
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState('Wszystkie')
  const continents = ['Wszystkie', ...new Set(flags.map((flag) => flag.continent))]
  const visible = flags.filter((flag) => (continent === 'Wszystkie' || flag.continent === continent) && flag.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <section className="atlas section-pad page-top">
      <div className="page-intro">
        <span className="eyebrow dark"><GridFour size={16} weight="fill" /> Atlas flag</span>
        <h1>20 flag.<br /><em>20 opowieści.</em></h1>
        <p>Wybierz kartę. Najpierw przyjrzyj się fladze, potem odkryj, co oznaczają jej elementy.</p>
      </div>
      <div className="atlas-tools">
        <label className="search-box"><MagnifyingGlass size={22} /><span className="sr-only">Szukaj kraju</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Szukaj kraju…" /></label>
        <div className="filter-row" aria-label="Filtruj według kontynentu">
          {continents.map((item) => <button key={item} className={continent === item ? 'active' : ''} onClick={() => setContinent(item)}>{item}</button>)}
        </div>
      </div>
      <div className="atlas-count"><span>{visible.length} wyników</span><span>{seen.length} odkrytych</span></div>
      <div className="flag-grid">
        {visible.map((flag) => <FlagCard key={flag.code} flag={flag} seen={seen.includes(flag.code)} onOpen={onOpen} />)}
      </div>
      {!visible.length && <div className="empty-state"><MagnifyingGlass size={42} /><h2>Nie znaleźliśmy takiego kraju.</h2><p>Spróbuj innej nazwy albo wybierz wszystkie kontynenty.</p></div>}
    </section>
  )
}

function FlagCard({ flag, seen, onOpen }) {
  return (
    <button className="flag-card" onClick={() => onOpen(flag)}>
      <div className={`flag-image ${flag.code === 'np' ? 'is-nepal' : ''}`}><img src={flagSrc(flag.code)} alt={`Flaga: ${flag.name}`} /></div>
      <div className="flag-card-meta"><span>{flag.continent}</span>{seen && <span className="seen"><CheckCircle size={16} weight="fill" /> odkryta</span>}</div>
      <h2>{flag.name}</h2><p>{flag.hook}</p>
      <span className="open-label">Odkryj flagę <ArrowRight size={18} weight="bold" /></span>
    </button>
  )
}

function FlagDialog({ flag, onClose }) {
  const linkedSources = flag.sourceIds.map((id) => sources[id]).filter(Boolean)
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="flag-dialog" role="dialog" aria-modal="true" aria-labelledby="flag-title">
        <button className="dialog-close" onClick={onClose} aria-label="Zamknij"><X size={24} weight="bold" /></button>
        <div className="dialog-layout">
          <div className={`dialog-flag ${flag.code === 'np' ? 'is-nepal' : ''}`}><img src={flagSrc(flag.code)} alt={`Flaga: ${flag.name}`} /></div>
          <div className="dialog-content">
            <span className="eyebrow dark">{flag.continent}</span>
            <h2 id="flag-title">{flag.name}</h2>
            <p className="dialog-hook">{flag.hook}</p>
            <div className="fact-row"><span><small>Od roku</small><strong>{flag.year}</strong></span><span><small>Proporcje</small><strong>{flag.ratio}</strong></span><span><small>Kolory</small><strong>{flag.colors.length}</strong></span></div>
            <p className="story">{flag.story}</p>
            <div className="symbol-list">{flag.symbols.map((symbol) => <span key={symbol}><CheckCircle size={18} weight="fill" /> {symbol}</span>)}</div>
            <div className="dialog-sources">
              <strong><Books size={18} weight="bold" /> Sprawdź źródło</strong>
              {linkedSources.length ? linkedSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name}<ArrowSquareOut size={16} /></a>) : <a href={sources.images.url} target="_blank" rel="noreferrer">Opis grafiki i plik flagi<ArrowSquareOut size={16} /></a>}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Quiz({ best, onBest }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const question = quizQuestions[index]

  const choose = (option) => {
    if (answer) return
    setAnswer(option)
    if (option === question.answer) setScore((value) => value + 1)
  }
  const next = () => {
    if (index === quizQuestions.length - 1) {
      const finalScore = score + (answer === question.answer ? 0 : 0)
      const nextBest = Math.max(best, finalScore)
      localStorage.setItem('kim-flagi-best', JSON.stringify(nextBest))
      onBest(nextBest)
      setDone(true)
      return
    }
    setIndex((value) => value + 1)
    setAnswer(null)
  }
  const restart = () => { setIndex(0); setAnswer(null); setScore(0); setDone(false) }

  if (done) return (
    <section className="quiz-page section-pad page-top"><div className="quiz-result">
      <Medal size={88} weight="duotone" /><span className="eyebrow dark">Misja ukończona</span><h1>{score}/{quizQuestions.length}</h1>
      <p>{score === quizQuestions.length ? 'Perfekcyjny wynik. Masz oko flagowego detektywa!' : score >= 5 ? 'Świetny wynik. Kilka flag już nie ma przed Tobą tajemnic.' : 'Dobry początek. Atlas pomoże Ci pobić ten wynik.'}</p>
      <div className="result-best">Twój rekord: <strong>{Math.max(best, score)}/{quizQuestions.length}</strong></div>
      <button className="button primary" onClick={restart}>Zagraj jeszcze raz <Shuffle size={20} weight="bold" /></button>
    </div></section>
  )

  return (
    <section className="quiz-page section-pad page-top">
      <div className="page-intro compact"><span className="eyebrow dark"><Question size={16} weight="fill" /> Quiz flagowego detektywa</span><h1>Patrz uważnie.</h1><p>Osiem pytań. Jedna odpowiedź. Każda pomyłka to nowy trop.</p></div>
      <div className="quiz-progress"><span style={{ width: `${((index + 1) / quizQuestions.length) * 100}%` }} /><small>Pytanie {index + 1} z {quizQuestions.length}</small></div>
      <div className="quiz-card">
        <div className={`quiz-flag ${question.code === 'np' ? 'is-nepal' : ''}`}><img src={flagSrc(question.code)} alt="Flaga do rozpoznania" /></div>
        <div className="quiz-copy"><h2>{question.prompt}</h2>
          <div className="answers">{question.options.map((option) => {
            const correct = answer && option === question.answer
            const wrong = answer === option && option !== question.answer
            return <button key={option} className={`${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} onClick={() => choose(option)} disabled={Boolean(answer)}>{option}{correct && <CheckCircle size={22} weight="fill" />}{wrong && <X size={22} weight="bold" />}</button>
          })}</div>
          {answer && <div className={`answer-note ${answer === question.answer ? 'good' : ''}`} role="status"><strong>{answer === question.answer ? 'Brawo!' : 'Prawie!'}</strong> Poprawna odpowiedź: {question.answer}.<button onClick={next}>{index === quizQuestions.length - 1 ? 'Zobacz wynik' : 'Następne pytanie'} <ArrowRight size={18} weight="bold" /></button></div>}
        </div>
      </div>
    </section>
  )
}

function Collection({ seen, best, navigate }) {
  const badges = [
    { title: 'Pierwszy trop', text: 'Otwórz pierwszą flagę w atlasie.', earned: seen.length >= 1, icon: Eye },
    { title: 'Mały flagolog', text: 'Odkryj 5 różnych flag.', earned: seen.length >= 5, icon: Flag },
    { title: 'Wielki odkrywca', text: 'Odkryj 15 różnych flag.', earned: seen.length >= 15, icon: GlobeHemisphereEast },
    { title: 'Sokole oko', text: 'Zdobądź co najmniej 6 punktów w quizie.', earned: best >= 6, icon: Star },
    { title: 'Mistrz flag', text: 'Zdobądź komplet 8 punktów.', earned: best >= 8, icon: Trophy },
  ]
  return (
    <section className="collection section-pad page-top">
      <div className="page-intro"><span className="eyebrow dark"><Trophy size={16} weight="fill" /> Twoja kolekcja</span><h1>Odznaki<br /><em>młodego flagologa.</em></h1><p>Atlas pamięta postęp tylko na tym urządzeniu. Bez konta, logowania i wysyłania danych.</p></div>
      <div className="progress-panels"><article><strong>{seen.length}/20</strong><span>odkrytych flag</span><div><i style={{ width: `${(seen.length / flags.length) * 100}%` }} /></div></article><article><strong>{best}/8</strong><span>najlepszy wynik quizu</span><div><i style={{ width: `${(best / quizQuestions.length) * 100}%` }} /></div></article></div>
      <div className="badge-grid">{badges.map(({ title, text, earned, icon: Icon }) => <article key={title} className={earned ? 'earned' : ''}><Icon size={42} weight={earned ? 'fill' : 'duotone'} /><span>{earned ? 'Zdobyta' : 'Do zdobycia'}</span><h2>{title}</h2><p>{text}</p></article>)}</div>
      <div className="collection-actions"><button className="button primary" onClick={() => navigate('atlas')}>Odkrywaj flagi <GridFour size={20} weight="bold" /></button><button className="button ghost" onClick={() => navigate('quiz')}>Zagraj w quiz</button></div>
    </section>
  )
}

function Sources() {
  return (
    <section className="sources-page section-pad page-top">
      <div className="page-intro"><span className="eyebrow dark"><Books size={16} weight="fill" /> Źródła i uczciwe zasady</span><h1>Ciekawość<br /><em>lubi sprawdzać.</em></h1><p>Znaczenia flag bywają oficjalne, historyczne albo popularne. Gdy oficjalne źródło ostrzega przed jednym prostym znaczeniem — jak przy kolorach flagi RPA — mówimy o tym wprost.</p></div>
      <div className="source-note"><LinkSimple size={30} weight="duotone" /><div><strong>Jak pracowaliśmy?</strong><p>Opisy sprawdziliśmy przede wszystkim w serwisach rządowych i oficjalnych dokumentach. Pliki flag pochodzą z Flagpedii/FlagCDN, bazującej na Wikimedia Commons.</p></div></div>
      <div className="source-list">{Object.values(sources).map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{String(index + 1).padStart(2, '0')}</span><strong>{source.name}</strong><ArrowSquareOut size={20} /></a>)}</div>
    </section>
  )
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer"><div className="footer-brand">FUN WITH FLAGS</div><p>Bezpłatny atlas dla ciekawych świata. Bez kont, reklam i śledzenia.</p><button onClick={() => navigate('sources')}>Źródła i metodologia <ArrowRight size={18} /></button><a href="https://github.com/jakiesluchawki/KIM-FLAGI" target="_blank" rel="noreferrer">GitHub <ArrowSquareOut size={16} /></a></footer>
  )
}

function MobileNav({ view, navigate }) {
  return <nav className="mobile-nav" aria-label="Nawigacja mobilna">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => navigate(id)} aria-current={view === id ? 'page' : undefined}><Icon size={22} weight={view === id ? 'fill' : 'regular'} /><span>{label}</span></button>)}</nav>
}

export default App
