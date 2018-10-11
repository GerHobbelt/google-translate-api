import test from 'ava'
import { LangFrom } from '..'
test('test a supported language – by code', t => {
  t.truthy(LangFrom('en'))
})

test('test an unsupported language – by code', t => {
  t.false(LangFrom('js'))
})

test('test a supported language – by name', t => {
  t.truthy(LangFrom('english'))
})

test('get a language code by its name', t => {
  t.is(LangFrom('english'), 'en')
})

test('get an unsupported language code by its name', t => {
  t.false(LangFrom('javascript'))
})

test('get a supported language code by code', t => {
  t.is(LangFrom('en'), 'en')
})

test('call getCode with an empty string', t => {
  t.is(LangFrom(''), false)
})
