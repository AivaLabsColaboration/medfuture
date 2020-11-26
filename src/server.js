import 'dotenv/config'

import cors from 'cors'
import express, { request } from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import bodyParser from 'body-parser'

import { postToSheet, updateSheet, updatePayment } from './helpers'

const app = express()
const port = process.env.PORT || 3000
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const schema = gql`
  type Query {
    hello: String
    postToSheet(email: String!, apnt_date: String!, apnt_time: String!, first_name: String!, middle_name: String, last_name: String!, phone: String!, dob: String!, traveler: Boolean!, gender: String!, test: String!, order: String!, agreement: Boolean!): PostSuccess!
  }
  type PostSuccess {
    message: String
  }
`
const resolvers = {
  Query: {
    postToSheet: async (parent, args, context, info) => {
      try {
        const postOnSheet = await postToSheet(args)
        if(postOnSheet) {
          return {
            message: 'Form data has been successfully stored on Google Sheet'
          }
        }
        else {
          return {
            message: 'Something went wrong! Response couldn\'t be processed at this itme!'
          }
        }
      }
      catch(e) { }
    },
    hello: () => {
      return 'Hello World!'
    },
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
})

server.applyMiddleware({ app, path: '/graphql' })

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/hooks/order', async (req, res) => {
  const data = req.body
  console.log(data.note_attributes)
  let attribute = data.note_attributes.find(item => item.name == 'gsheet_id')

  const postData = {
    attribute: attribute && attribute.value ? attribute.value : 'AAAAA',
    order_id: data.id
  }
  try {
    console.log('Here')
    let update = await updateSheet(postData)
    res.json({ response: 'Submission Successfull' })
  }
  catch(e) {
    res.json({ response: 'Submission Failed', reason: e })
  }
  
})

app.post('/hooks/payment', async (req, res) => {
  const data = req.body
  console.log(data.id)
  try {
    let update = await updatePayment({order_id: data.id})
    res.json({ response: 'Submission Successfull' })
  }
  catch(e) {
    res.json({ response: 'Submission Failed', reason: e })
  }
})

app.listen(port, () => {
  console.log(`Apollo server on http://localhost:${port}/graphql`)
})