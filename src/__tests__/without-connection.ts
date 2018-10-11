import { translate } from '..'
import test from 'ava'
import Mitm = require('mitm')
Mitm().on('request', (req, res) => {
  res.statusCode = 402
  res.end('Fail')
})
test('try to translate some text without an internet connection', async t => {
  try {
    const res = await translate('vertaler')
    t.fail()
  } catch (error) {
    t.is(error.code, 'BAD_NETWORK')
  }
})
