import test from 'ava'
import { translate } from '..'

test('translate from dutch to english using language names instead of codes', async t => {
  try {
    const res = await translate('iets', { from: 'dutch', to: 'english' })
    if (res instanceof Error) throw res
    t.is(res.from.language.iso, 'nl')
    t.is(res.text, 'something')
  } catch (err) {
    t.fail(err.code)
  }
})
