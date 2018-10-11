import test from 'ava'
import { translate } from '..'

test('translate some misspelled english text to dutch', async t => {
  try {
    const res = await translate('I spea Dutch', { from: 'en', to: 'nl' })

    if (res.from.text.autoCorrected || res.from.text.didYouMean) {
      t.is(res.from.text.value, 'I [speak] Dutch')
    } else {
      t.fail()
    }
  } catch (err) {
    t.fail(err.code)
  }
})
