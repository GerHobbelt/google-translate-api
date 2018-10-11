import Linguister from '..'
import {get} from 'https'
import { IncomingMessage } from 'http';
new Promise<IncomingMessage>(resolve => get('https://jsonplaceholder.typicode.com/comments', resolve)).then(res => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => JSON.parse(body).forEach(comment => Linguister(comment.name).then(res => console.log(res.text))))
})