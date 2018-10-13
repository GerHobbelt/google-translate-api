import { TranslateAPI, LangFrom } from './components/translate'
const DefaultAPI = new TranslateAPI()
const translate = DefaultAPI.translate.bind(DefaultAPI)
export { TranslateAPI, translate, LangFrom }
const Linguister: typeof DefaultAPI.translate & {
  LangFrom: typeof LangFrom
  TranslateAPI: typeof TranslateAPI
  translate: typeof translate
} = translate
Linguister.LangFrom = LangFrom
Linguister.TranslateAPI = TranslateAPI
Linguister.translate = translate
export default Linguister
Linguister['default'] = Linguister
module.exports = Linguister
