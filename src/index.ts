import { TranslateAPI, LangFrom } from './components/translate'
const Default = new TranslateAPI()
const translate: typeof Default.translate = Default.translate.bind(Default)
export { translate }
export { TranslateAPI, LangFrom } from './components/translate'
export default { TranslateAPI, translate, LangFrom }
