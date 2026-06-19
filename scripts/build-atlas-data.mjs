import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import countries from 'world-countries'

const projectRoot = path.resolve(import.meta.dirname, '..')
const factbookRoot = path.join(projectRoot, '.cache/factbook.json')
const outputPath = path.join(projectRoot, 'src/atlasCountries.js')
const translationPath = path.join(projectRoot, 'data/atlasTranslations.pl.json')

try {
  await fs.access(path.join(factbookRoot, '.git'))
  execFileSync('git', ['-C', factbookRoot, 'pull', '--ff-only'], { stdio: 'inherit' })
} catch {
  await fs.mkdir(path.dirname(factbookRoot), { recursive: true })
  execFileSync('git', ['clone', '--depth', '1', 'https://github.com/factbook/factbook.json.git', factbookRoot], { stdio: 'inherit' })
}

const decode = (value = '') => String(value)
  .replaceAll('<br>', '\n').replaceAll('<br/>', '\n').replaceAll('<br />', '\n')
  .replace(/<[^>]+>/g, '')
  .replaceAll('&nbsp;', ' ').replaceAll('&amp;', '&').replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'").replaceAll('&eacute;', 'é').replaceAll('&ocirc;', 'ô')
  .replaceAll('&aacute;', 'á').replaceAll('&iacute;', 'í').replaceAll('&ntilde;', 'ñ')
  .replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').replace(/[ \t]{2,}/g, ' ').trim()

const normalize = (value = '') => decode(value)
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/\bthe\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

const getText = (value) => {
  if (value == null) return ''
  if (typeof value === 'object') return decode(value.text ?? '')
  return decode(value)
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(full))
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(full)
  }
  return files
}

const regionNames = {
  Africa: 'Afryka', Americas: 'Ameryki', Asia: 'Azja', Europe: 'Europa', Oceania: 'Oceania', Antarctic: 'Antarktyda',
}

const polishNameOverrides = {
  CM: 'Kamerun', CI: 'Wybrzeże Kości Słoniowej', SS: 'Sudan Południowy',
  SZ: 'Eswatini', NL: 'Niderlandy', GB: 'Wielka Brytania',
}

const polishOfficialNameOverrides = {
  CM: 'Republika Kamerunu', CI: 'Republika Wybrzeża Kości Słoniowej', SS: 'Republika Sudanu Południowego',
  SZ: 'Królestwo Eswatini', NL: 'Królestwo Niderlandów', GB: 'Zjednoczone Królestwo Wielkiej Brytanii i Irlandii Północnej',
}

const colorWords = [
  ['sky blue', 'błękitny'], ['light blue', 'jasnoniebieski'], ['dark blue', 'granatowy'],
  ['crimson', 'karmazynowy'], ['maroon', 'bordowy'], ['scarlet', 'szkarłatny'],
  ['red', 'czerwony'], ['white', 'biały'], ['blue', 'niebieski'], ['green', 'zielony'],
  ['yellow', 'żółty'], ['gold', 'złoty'], ['black', 'czarny'], ['orange', 'pomarańczowy'],
  ['brown', 'brązowy'], ['purple', 'fioletowy'], ['gray', 'szary'], ['grey', 'szary'],
]

function extractColors(text) {
  const lower = text.toLowerCase()
  const hits = colorWords
    .map(([word, label]) => ({ label, index: lower.indexOf(word) }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index)
    .map(({ label }) => label)
  return [...new Set(hits)]
}

function extractFamilies(text) {
  const lower = text.toLowerCase()
  const checks = [
    ['Pasy', /\b(stripe|striped|band|bands|tricolor|tricolour)\b/],
    ['Krzyże', /\b(cross|saltire)\b/],
    ['Gwiazdy', /\bstar/],
    ['Półksiężyce', /\bcrescent\b/],
    ['Słońce', /\bsun\b/],
    ['Herby i godła', /\b(coat of arms|emblem|seal|shield)\b/],
    ['Zwierzęta', /\b(eagle|lion|bird|dragon|parrot|horse|cattle|llama|antelope|dove|crane|frigate|dolphin|bear|snake|serpent)\b/],
    ['Rośliny', /\b(tree|leaf|leaves|maple|cedar|palm|cotton|wreath|branch|flower|cactus|clove|nutmeg|sugarcane)\b/],
    ['Napisy', /\b(motto|inscription|script|words|written|text)\b/],
    ['Trójkąty', /\btriangle/],
  ]
  return checks.filter(([, pattern]) => pattern.test(lower)).map(([label]) => label)
}

function splitFlagText(rawText) {
  const text = decode(rawText)
  const descriptionMatch = text.match(/description:\s*([\s\S]*?)(?=\n\s*meaning:|$)/i)
  const meaningMatch = text.match(/meaning:\s*([\s\S]*)$/i)
  return {
    description: (descriptionMatch?.[1] ?? text).trim(),
    meaning: (meaningMatch?.[1] ?? '').trim(),
  }
}

const manualPaths = {
  CD: 'africa/cg.json', CG: 'africa/cf.json', CZ: 'europe/ez.json',
  FM: 'australia-oceania/fm.json', KR: 'east-n-southeast-asia/ks.json', KP: 'east-n-southeast-asia/kn.json',
  PS: 'middle-east/we.json', VA: 'europe/vt.json', GB: 'europe/uk.json',
}

const files = await walk(factbookRoot)
let translations = {}
try { translations = JSON.parse(await fs.readFile(translationPath, 'utf8')) } catch {}
const factbook = []
for (const file of files) {
  const data = JSON.parse(await fs.readFile(file, 'utf8'))
  const government = data.Government ?? {}
  const names = government['Country name'] ?? {}
  const short = getText(names['conventional short form'])
  const long = getText(names['conventional long form'])
  if (!short && !long) continue
  factbook.push({
    path: path.relative(factbookRoot, file), data, short, long,
    names: [short, long, getText(names['local short form']), getText(names['local long form'])].filter(Boolean),
  })
}

const byNormalizedName = new Map()
for (const entry of factbook) for (const name of entry.names) byNormalizedName.set(normalize(name), entry)

const targets = countries
  .filter((country) => country.unMember || ['PS', 'VA'].includes(country.cca2))
  .sort((a, b) => (a.translations.pol?.common ?? a.name.common).localeCompare(b.translations.pol?.common ?? b.name.common, 'pl'))

const records = []
const unmatched = []
for (const country of targets) {
  let fact = null
  const manual = manualPaths[country.cca2]
  if (manual) fact = factbook.find((entry) => entry.path === manual)
  if (!fact) {
    const candidates = [country.name.common, country.name.official, ...country.altSpellings]
    fact = candidates.map((name) => byNormalizedName.get(normalize(name))).find(Boolean) ?? null
  }
  if (!fact) unmatched.push(`${country.cca2} ${country.name.common}`)

  const government = fact?.data.Government ?? {}
  const geography = fact?.data.Geography ?? {}
  const flagField = government.Flag ?? {}
  const parsed = splitFlagText(getText(flagField))
  let description = parsed.description
  let meaning = parsed.meaning
  let note = decode(flagField.note ?? '')
  if (country.cca2 === 'PS') {
    description = 'three equal horizontal bands of black, white, and green, with a red isosceles triangle based on the hoist side'
    meaning = 'the four Pan-Arab colors connect the flag with the history and shared visual language of Arab national movements'
    note = 'the design belongs to the family of flags derived from the Arab Revolt flag of 1916'
  }
  const searchableText = `${description} ${meaning} ${note}`
  const polishName = polishNameOverrides[country.cca2] ?? country.translations.pol?.common ?? country.name.common
  const translated = translations[country.cca2.toLowerCase()] ?? {}

  records.push({
    code: country.cca2.toLowerCase(),
    code3: country.cca3,
    name: polishName,
    officialName: polishOfficialNameOverrides[country.cca2] ?? country.translations.pol?.official ?? country.name.official,
    englishName: country.name.common,
    localNames: Object.values(country.name.native ?? {}).map((name) => name.common).filter(Boolean),
    continent: regionNames[country.region] ?? country.region,
    subregion: country.subregion,
    capital: getText(government.Capital?.name) || country.capital?.join(', ') || '—',
    location: getText(geography.Location),
    description,
    meaning,
    note,
    nationalSymbols: getText(government['National symbol(s)']),
    nationalColors: getText(government['National color(s)']),
    independence: getText(government.Independence),
    descriptionPl: translated.description ?? '',
    meaningPl: translated.meaning ?? '',
    notePl: translated.note ?? '',
    nationalSymbolsPl: translated.nationalSymbols ?? '',
    nationalColorsPl: translated.nationalColors ?? '',
    independencePl: translated.independence ?? '',
    locationPl: translated.location ?? '',
    colors: extractColors(searchableText),
    families: extractFamilies(searchableText),
    source: fact ? `https://github.com/factbook/factbook.json/blob/master/${fact.path}` : 'https://www.fotw.info/flags/index.html',
    sourceLabel: fact ? 'World Factbook — profil i opis flagi' : 'Flags of the World — indeks państw',
  })
}

const header = `// Generated from CC0 World Factbook data and world-countries.\n// Run: npm run data:atlas\n\n`
await fs.writeFile(outputPath, `${header}export const atlasCountries = ${JSON.stringify(records, null, 2)}\n`)

const flagDirectory = path.join(projectRoot, 'public/flags')
await fs.mkdir(flagDirectory, { recursive: true })
for (const country of records) {
  const destination = path.join(flagDirectory, `${country.code}.svg`)
  try {
    await fs.access(destination)
  } catch {
    const response = await fetch(`https://flagcdn.com/${country.code}.svg`)
    if (!response.ok) throw new Error(`Flag download failed: ${country.code} ${response.status}`)
    await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()))
  }
}

console.log(`Generated ${records.length} flag records.`)
if (unmatched.length) console.log(`Missing Factbook matches (${unmatched.length}):\n${unmatched.join('\n')}`)
