import test from 'ava'
import { translate } from '..'

test('translate from auto to dutch', async t => {
  try {
    const res = await translate('translator', { from: 'auto', to: 'nl' })

    t.is(res.text, 'vertaler')
    t.false(res.from.language.didYouMean)
    t.is(res.from.language.iso, 'en')
    t.false(res.from.text.autoCorrected)
    t.is(res.from.text.value, '')
    t.false(res.from.text.didYouMean)
  } catch (err) {
    t.fail(err.code)
  }
})
