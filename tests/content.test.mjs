import test from 'node:test'
import assert from 'node:assert/strict'
import { flags, quizQuestions, sources } from '../src/data.js'

test('atlas contains 20 unique flags', () => {
  assert.equal(flags.length, 20)
  assert.equal(new Set(flags.map((flag) => flag.code)).size, 20)
})

test('every flag has child-friendly core content', () => {
  for (const flag of flags) {
    assert.ok(flag.name && flag.hook && flag.story)
    assert.equal(flag.symbols.length, 3)
    assert.ok(flag.colors.length >= 2)
    assert.ok(flag.sourceIds.length >= 1)
  }
})

test('quiz answers are present among the options', () => {
  assert.equal(quizQuestions.length, 8)
  for (const question of quizQuestions) assert.ok(question.options.includes(question.answer))
})

test('every named source uses https', () => {
  for (const source of Object.values(sources)) assert.match(source.url, /^https:\/\//)
})
