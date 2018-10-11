import test from 'ava'
import { translate } from '..'

test('translate some text and get the raw output alongside', async t => {
  try {
    const res = await translate('vertaler', { raw: true })
    t.truthy(res.raw)
  } catch (err) {
    t.fail(err.code)
  }
})
