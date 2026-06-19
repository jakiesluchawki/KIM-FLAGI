import fs from 'node:fs/promises'
import path from 'node:path'
import { atlasCountries } from '../src/atlasCountries.js'

const projectRoot = path.resolve(import.meta.dirname, '..')
const outputPath = path.join(projectRoot, 'data/atlasTranslations.pl.json')
const separator = '\n@@@\n'
const fields = ['description', 'meaning', 'note', 'nationalSymbols', 'nationalColors', 'independence', 'location']

let cache = {}
try { cache = JSON.parse(await fs.readFile(outputPath, 'utf8')) } catch {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function translate(country, attempt = 1) {
  if (cache[country.code] && fields.every((field) => field in cache[country.code])) return
  const query = fields.map((field) => country[field] || '—').join(separator)
  const url = new URL('https://translate.googleapis.com/translate_a/single')
  url.searchParams.set('client', 'gtx')
  url.searchParams.set('sl', 'en')
  url.searchParams.set('tl', 'pl')
  url.searchParams.set('dt', 't')
  url.searchParams.set('q', query)
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const payload = await response.json()
    const text = payload[0].map((part) => part[0]).join('')
    const parts = text.split(/\s*@@@\s*/)
    if (parts.length !== fields.length) throw new Error(`expected ${fields.length} fields, got ${parts.length}`)
    cache[country.code] = Object.fromEntries(fields.map((field, index) => [field, parts[index] === '—' ? '' : parts[index].trim()]))
  } catch (error) {
    if (attempt < 4) {
      await sleep(500 * attempt)
      return translate(country, attempt + 1)
    }
    throw new Error(`${country.code}: ${error.message}`)
  }
}

const pending = atlasCountries.filter((country) => !cache[country.code])
for (let index = 0; index < pending.length; index += 5) {
  const batch = pending.slice(index, index + 5)
  await Promise.all(batch.map((country) => translate(country)))
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(cache, null, 2)}\n`)
  console.log(`Translated ${Math.min(index + batch.length, pending.length)}/${pending.length}`)
  await sleep(120)
}

console.log(`Translation cache contains ${Object.keys(cache).length} countries.`)
