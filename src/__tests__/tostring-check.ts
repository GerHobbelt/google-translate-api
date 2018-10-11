import test from 'ava'
import { translate } from '..'

test('translate some text and get response using toString', async t => {
  try {
    const res = await translate('vertaler')
    t.is(`${res}`, 'translator')
  } catch (err) {
    t.fail(err.code)
  }
})
