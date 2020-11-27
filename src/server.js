import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'

import { postToSheet, updateSheet, updatePayment } from './helpers'

const app = express()
const port = process.env.PORT || 3000
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/sheet', async (req, res) => {
	try {
		const postOnSheet = await postToSheet(req.body)
		if(postOnSheet) {
			res.status(201).json({ message: 'Form data has been successfully stored on Google Sheet' })
		}
		else {
			res.status(421).json({ message: 'Something went wrong!' })
		}
	}
	catch(e) {
		res.status(400).json({ message: 'Response couldn\'t be processed at this itme!' })
	}
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
  console.log(`Express server on http://localhost:${port}`)
})