import { TranslateAPI, LangFrom } from './components/translate'
const Default = new TranslateAPI()
const translate = Default.translate.bind(Default)
const Linguister: typeof Default.translate & {
  LangFrom: typeof LangFrom
  TranslateAPI: typeof TranslateAPI
} = translate
Linguister.LangFrom = LangFrom
Linguister.TranslateAPI = TranslateAPI
export { translate, TranslateAPI, LangFrom }
export default Linguister
