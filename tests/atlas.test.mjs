import test from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { atlasCountries } from '../src/atlasCountries.js'
import { flagFamilies, glossary, reasoningQuestions } from '../src/knowledge.js'

test('atlas covers 193 UN members plus Vatican and Palestine', () => {
  assert.equal(atlasCountries.length, 195)
  assert.equal(new Set(atlasCountries.map((country) => country.code)).size, 195)
  assert.equal(new Set(atlasCountries.map((country) => country.name)).size, 195)
  assert.ok(atlasCountries.some((country) => country.code === 'va'))
  assert.ok(atlasCountries.some((country) => country.code === 'ps'))
})

test('every monograph has Polish technical content and a source', () => {
  for (const country of atlasCountries) {
    assert.ok(country.name)
    assert.ok(country.descriptionPl.length > 8, `${country.code} missing description`)
    assert.match(country.source, /^https:\/\//)
    assert.ok(country.continent)
  }
})

test('every national flag asset exists locally', async () => {
  await Promise.all(atlasCountries.map((country) => access(new URL(`../public/flags/${country.code}.svg`, import.meta.url))))
})

test('advanced learning layer is substantial and references valid countries', () => {
  assert.ok(glossary.length >= 12)
  assert.ok(flagFamilies.length >= 8)
  assert.ok(reasoningQuestions.length >= 10)
  const codes = new Set(atlasCountries.map((country) => country.code))
  for (const family of flagFamilies) for (const code of family.codes) assert.ok(codes.has(code), `${family.id}: ${code}`)
  for (const question of reasoningQuestions) assert.ok(codes.has(question.code), question.code)
})
