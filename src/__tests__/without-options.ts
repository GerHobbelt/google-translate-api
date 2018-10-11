import test from 'ava'
import { translate } from '..'

test('translate without any options', async t => {
  try {
    const res = await translate('vertaler')

    t.is(res.text, 'translator')
    t.false(res.from.language.didYouMean)
    t.is(res.from.language.iso, 'nl')
    t.false(res.from.text.autoCorrected)
    t.is(res.from.text.value, '')
    t.false(res.from.text.didYouMean)
  } catch (err) {
    t.fail(err.code)
  }
})
