import { stringify } from 'querystring'
import { get } from 'https'

class LinguistError extends Error {
  public code: string
  public constructor(message: string, code = 'UNDEFINED') {
    super(message)
    this.code = code
  }
}

const languages = {
  auto: 'Automatic',
  af: 'Afrikaans',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  hy: 'Armenian',
  az: 'Azerbaijani',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  bs: 'Bosnian',
  bg: 'Bulgarian',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ny: 'Chichewa',
  'zh-cn': 'Chinese Simplified',
  'zh-tw': 'Chinese Traditional',
  co: 'Corsican',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  nl: 'Dutch',
  en: 'English',
  eo: 'Esperanto',
  et: 'Estonian',
  tl: 'Filipino',
  fi: 'Finnish',
  fr: 'French',
  fy: 'Frisian',
  gl: 'Galician',
  ka: 'Georgian',
  de: 'German',
  el: 'Greek',
  gu: 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  haw: 'Hawaiian',
  iw: 'Hebrew',
  hi: 'Hindi',
  hmn: 'Hmong',
  hu: 'Hungarian',
  is: 'Icelandic',
  ig: 'Igbo',
  id: 'Indonesian',
  ga: 'Irish',
  it: 'Italian',
  ja: 'Japanese',
  jw: 'Javanese',
  kn: 'Kannada',
  kk: 'Kazakh',
  km: 'Khmer',
  ko: 'Korean',
  ku: 'Kurdish (Kurmanji)',
  ky: 'Kyrgyz',
  lo: 'Lao',
  la: 'Latin',
  lv: 'Latvian',
  lt: 'Lithuanian',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ms: 'Malay',
  ml: 'Malayalam',
  mt: 'Maltese',
  mi: 'Maori',
  mr: 'Marathi',
  mn: 'Mongolian',
  my: 'Myanmar (Burmese)',
  ne: 'Nepali',
  no: 'Norwegian',
  ps: 'Pashto',
  fa: 'Persian',
  pl: 'Polish',
  pt: 'Portuguese',
  ma: 'Punjabi',
  ro: 'Romanian',
  ru: 'Russian',
  sm: 'Samoan',
  gd: 'Scots Gaelic',
  sr: 'Serbian',
  st: 'Sesotho',
  sn: 'Shona',
  sd: 'Sindhi',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  es: 'Spanish',
  su: 'Sundanese',
  sw: 'Swahili',
  sv: 'Swedish',
  tg: 'Tajik',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  cy: 'Welsh',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zu: 'Zulu'
}
type langISO = keyof typeof languages

type Translation = {
  /** The translated text */
  text: string
  /** The original text */
  from: {
    language: {
      /** True if the API suggested a correction in the source language */
      didYouMean: boolean
      /** The code of the language that the API has recognized in the text */
      iso: langISO
    }
    text: {
      /** The untranslated auto corrected text or suggested text */
      value: string
      /** True if the API has auto corrected the text */
      autoCorrected: boolean
      /** True if the API has suggested corrections to the text */
      didYouMean: boolean
    }
  }
  /** The raw response from th egoogle translate server */
  raw: Array<any>
}
/**
 * Practically never does anything. Gonna have to look into how the api actually works
 * @private
 * @param {string} TKK Previous TKK
 * @return {string} The fetched token
 */
function getToken(TKK: string): any {
  // TODO: Simplify this login farther
  return new Promise(resolve =>
    get('https://translate.google.com', res => {
      let body = ''
      res.on('data', chunk => (body += chunk))
      res.on('end', () => {
        var code = body.match(/TKK=(.*?)\(\)\)'\);/g)
        if (code) eval(code[0])
        resolve(TKK)
      })
    })
  ).then((TKK: any) => {
    let b = Number(TKK.split('.')[0]) || 0
    let i = b
    let j: any = '+-a^+6'
    for (let c = 0; c < j.length - 2; c += 3) {
      let d = j.charAt(c + 2)
      d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d)
      d = '+' == j.charAt(c + 1) ? i >>> d : i << d
      i = '+' == j.charAt(c) ? (i + d) & 4294967295 : i ^ d
    }
    j = '+-3^+b+-f'
    for (let c = 0; c < j.length - 2; c += 3) {
      let d = j.charAt(c + 2)
      d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d)
      d = '+' == j.charAt(c + 1) ? i >>> d : i << d
      i = '+' == j.charAt(c) ? (i + d) & 4294967295 : i ^ d
    }
    let a = i ^ b
    if (0 > a) a = ((a & 2147483647) + 2147483648) % 1e6
    return a.toString() + '.' + (a ^ b)
  })
}
/**
 * Returns the ISO 639-1 code of the desiredLang – if it is supported by Google Translate
 * @param {string} query – the name or the code of the desired language
 * @returns {string} The ISO 639-1 code of the language
 */
export function LangFrom(query: string): string | undefined {
  return (
    Object.keys(languages).find(
      key => languages[key].toLowerCase() === query.toLowerCase()
    ) || (languages[query] ? query : undefined)
  )
}
/**
 * Used to spawn api requests. Will handle a ratelimit
 */
export class TranslateAPI {
  private TKK = '0'
  private lastreq = 0
  public ratelimit: number
  public constructor(ratelimit: number = 1000) {
    this.ratelimit = ratelimit
  }
  /**
   * Translate a string using google's translate API
   * @param {String} text The text to translate
   * @param {Object} [opts={}] Options for the request
   * @param {String} [opts.from] The language to translate from
   * @param {String} [opts.to] The language to translate to
   * @returns {Promise<Translation>} The translation response
   */
  public translate(
    text: string,
    opts: {
      /** The language to translate from */
      from?: string
      /** The language to translate to */
      to?: string
    } = {}
  ): Promise<Translation> {
    const options = {
      from: LangFrom(opts.from || 'auto') || 'auto',
      to: LangFrom(opts.to || 'en') || 'en'
    }
    const startat = (this.lastreq =
      Date.now() > this.lastreq + this.ratelimit
        ? Date.now()
        : this.lastreq + this.ratelimit)
    return new Promise((resolve, reject) => {
      setTimeout(
        () => resolve(this._translate(text, options.from, options.to)),
        startat - Date.now()
      )
    })
  }
  private _translate(query, from, to): Promise<Translation> {
    return new Promise(async (resolve, reject) => {
      get(
        'https://translate.google.com/translate_a/single?' +
          stringify({
            client: 'gtx',
            sl: from,
            tl: to,
            hl: to,
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            ie: 'UTF-8',
            oe: 'UTF-8',
            otf: 1,
            ssel: 0,
            tsel: 0,
            kc: 7,
            q: query,
            tk: (this.TKK = await getToken(this.TKK))
          }),
        res => {
          let body = ''
          res.on('data', chunk => (body += chunk))
          res.on('error', reject)
          res.on('end', () => {
            let parsed
            try {
              parsed = JSON.parse(body)
            } catch (error) {
              return reject(
                new LinguistError(
                  'Failed to connect to google API',
                  'BAD_NETWORK'
                )
              )
            }
            resolve({
              text: parsed[0].reduce(
                (str, arr) => (arr[0] ? str + arr[0] : str),
                ''
              ),
              from: {
                language: {
                  didYouMean: parsed[2] !== parsed[8][0][0],
                  iso: parsed[8][0][0]
                },
                text: {
                  autoCorrected: parsed[7] ? parsed[7][5] : false,
                  value: parsed[7]
                    ? parsed[7][0]
                        .replace(/<b><i>/g, '[')
                        .replace(/<\/i><\/b>/g, ']')
                    : '',
                  didYouMean: parsed[7] ? !parsed[7][5] : false
                }
              },
              raw: parsed
            })
          })
        }
      )
    })
  }
}
