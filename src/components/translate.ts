import * as querystring from 'querystring'
import got = require('got')
import token = require('google-translate-token')

import Languages from './languages'
type Translation = {
  text: string
  from: {
    language: {
      didYouMean: boolean
      iso: string
    }
    text: {
      value: string
      autoCorrected: boolean
      didYouMean: boolean
    }
  }
  raw: Array<any>
}
/**
 * Translate a string using google's translate API
 * @param {String} text The text to translate
 * @param {Object} [opts={}] Options for the request
 * @returns {Object} The translation response
 */
function translate(
  text: string,
  opts: { text?: string; from?: string; to?: string; raw?: boolean } = {}
): Promise<Translation> {
  let e: any
  ;[opts.from, opts.to].forEach(function(lang) {
    if (lang && !Languages.isSupported(lang)) {
      e = new Error()
      e.code = 400
      e.message = "The language '" + lang + "' is not supported"
    }
  })
  if (e) {
    return new Promise(function(resolve, reject) {
      reject(e)
    })
  }

  opts.from = opts.from || 'auto'
  opts.to = opts.to || 'en'

  opts.from = Languages.getCode(opts.from) as string
  opts.to = Languages.getCode(opts.to) as string

  return token
    .get(text)
    .then(function(token: { name: 'tk'; value: string }) {
      const url = 'https://translate.google.com/translate_a/single'
      const data = {
        client: 'gtx',
        sl: opts.from,
        tl: opts.to,
        hl: opts.to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 7,
        q: text,
        tk: ''
      }
      data[token.name] = token.value

      return url + '?' + querystring.stringify(data)
    })
    .then(function(url: string) {
      return got(url)
        .then(function(res: { [key: string]: any }) {
          var result = {
            text: '',
            from: {
              language: {
                didYouMean: false,
                iso: ''
              },
              text: {
                autoCorrected: false,
                value: '',
                didYouMean: false
              }
            },
            raw: ''
          }

          if (opts.raw) {
            result.raw = res.body
          }

          var body = JSON.parse(res.body)
          body[0].forEach(function(obj: Array<string>) {
            if (obj[0]) {
              result.text += obj[0]
            }
          })

          if (body[2] === body[8][0][0]) {
            result.from.language.iso = body[2]
          } else {
            result.from.language.didYouMean = true
            result.from.language.iso = body[8][0][0]
          }

          if (body[7] && body[7][0]) {
            var str = body[7][0]

            str = str.replace(/<b><i>/g, '[')
            str = str.replace(/<\/i><\/b>/g, ']')

            result.from.text.value = str

            if (body[7][5] === true) {
              result.from.text.autoCorrected = true
            } else {
              result.from.text.didYouMean = true
            }
          }
          return result
        })
        .catch(function(err: any) {
          const e: any = new Error()
          if (err.statusCode !== undefined && err.statusCode !== 200) {
            e['code'] = 'BAD_REQUEST'
          } else {
            e['code'] = 'BAD_NETWORK'
          }
          throw e
        })
    })
}
namespace translate {
  export const languages = Languages
}
export default translate
