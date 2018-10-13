const { TranslateAPI } = require('..')
const API = new TranslateAPI(5000)
require('readline').createInterface({
  input: process.stdin
}).on('line', line => {
  // translate could be imported directly from the module here, running off the main object which has its own request queue
  API.translate(line, { raw: true }).then(res => console.log(JSON.stringify(res)))
})