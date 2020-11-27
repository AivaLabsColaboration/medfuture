import 'dotenv/config'
import FormData from 'form-data'

export function postToSheet (data) {
  return new Promise(async (resolve, reject) => {
    if(!data) reject({message: `Expect object as an argument but got ${typeof(data)}`})

    const formData = new FormData();
    formData.append('Email Address', data.email)
    formData.append('Date de votre Rendez-vous / date of your appointment', data.appnt_date)
    formData.append('Heure de votre Rendez-vous / Hour of your appointment', data.appnt_time)
    formData.append('Prénom / First name', data.first_name)
    formData.append('Deuxième prénom / Middle name', data.middle_name)
    formData.append('Nom de famille / Last Name', data.last_name)
    formData.append('Téléphone / Phone', data.phone)
    formData.append('Date de naissance / Date of birth', data.dob)
    formData.append('Êtes vous un voyageur ? Are you a traveler?', data.traveler ? "Yes" : "No")
    formData.append('Sexe / Sex', data.gender)
    formData.append('Test', data.test)
    formData.append('Order ID', data.order)
    formData.append('Pyament Status', 'Pending')
    formData.append('Accord / Agreement', data.agreement ? 'Accepted' : 'Not Accepted')
    try {
      formData.submit(process.env.SCRIPT_URI, (error, res) => {
				if(error) {
          console.log(error)
          reject(error)
        }
        resolve(true)
      })
    }
    catch(e) {
      if(e) {
        console.log("error", e)
        reject({error: e, message: 'Cannot post to the sheet'})
      }
    }
    console.log(data)
    
  })
}

export function updateSheet (data) {
  return new Promise(async (resolve, reject) => {
    if(!data) reject({message: `Expect object as an argument but got ${typeof(data)}`})
    console.log(data)
    const formData = new FormData();

    formData.append('request', 'update');
    formData.append('attribute', data.attribute);
    formData.append('order_id', data.order_id);
    console.log('Happen')
    try {
      formData.submit(process.env.SCRIPT_URI, (error, res) => {
        if(error) {
          console.log(error)
          reject(error)
        }
        resolve(true)
      })
    }
    catch(e) {
      if(e) {
        console.log("error", e)
        reject({error: e, message: 'Cannot post to the sheet'})
      }
    }
  })
}

export function updatePayment (data) {
  return new Promise(async (resolve, reject) => {
    if(!data) reject({message: `Expect object as an argument but got ${typeof(data)}`})
    console.log(data)
    const formData = new FormData();

    formData.append('request', 'payment_update');
    formData.append('order_id', data.order_id);
    console.log('Payment Update')
    try {
      formData.submit(process.env.SCRIPT_URI, (error, res) => {
        if(error) {
          console.log(error)
          reject(error)
        }
        resolve(true)
      })
    }
    catch(e) {
      if(e) {
        console.log("error", e)
        reject({error: e, message: 'Cannot post to the sheet'})
      }
    }
  })
}