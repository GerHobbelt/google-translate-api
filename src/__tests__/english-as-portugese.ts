import test from 'ava'
import { translate } from '..'

test('translate some english text setting the source language as portuguese', async t => {
  try {
    const res = await translate('translator', { from: 'pt', to: 'nl' })

    t.true(res.from.language.didYouMean)
    t.is(res.from.language.iso, 'en')
  } catch (err) {
    t.fail(err.code)
  }
})
