import test from 'ava'
import translate from '..'

test('try to translate from an unsupported language', async t => {
  try {
    await translate('something', { from: 'js', to: 'en' })
    t.fail()
  } catch (err) {
    t.is(err.code, 400)
    t.is(err.message, "The language 'js' is not supported")
  }
})

test('try to translate to an unsupported language', async t => {
  try {
    await translate('something', { from: 'en', to: 'js' })
    t.fail()
  } catch (err) {
    t.is(err.code, 400)
    t.is(err.message, "The language 'js' is not supported")
  }
})
