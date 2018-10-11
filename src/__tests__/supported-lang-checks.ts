import test from 'ava'
import translate from '..'
const languages = translate.languages
test('test a supported language – by code', t => {
  t.true(languages.isSupported('en'))
})

test('test an unsupported language – by code', t => {
  t.false(languages.isSupported('js'))
})

test('test a supported language – by name', t => {
  t.true(languages.isSupported('english'))
})

test('test an unsupported language – by name', t => {
  t.false(languages.isSupported('javascript'))
})

test('get a language code by its name', t => {
  t.is(languages.getCode('english'), 'en')
})

test('get an unsupported language code by its name', t => {
  t.false(languages.getCode('javascript'))
})

test('get a supported language code by code', t => {
  t.is(languages.getCode('en'), 'en')
})

test("call getCode with 'undefined'", t => {
  t.is(languages.getCode(undefined), false)
})

test("call getCode with 'null'", t => {
  t.is(languages.getCode(null), false)
})

test('call getCode with an empty string', t => {
  t.is(languages.getCode(''), false)
})

test('call getCode with no arguments', t => {
  t.is(languages.getCode(), false)
})
