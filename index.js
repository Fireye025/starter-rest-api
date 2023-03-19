const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const scores = db.collection("scores")

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

app.get('/scores', async (req, res) => {
    const items = await scores.list()
    var data = JSON.stringify(items)
    for(var item in data["results"]){
      if(item["collection"] == "scores"){
        console.log(item["key"])
      }
    }
    console.log(JSON.stringify(items)[0])
    res.json(items).end()
  })

app.post('/scores', async (req, res) => {
    const item = await scores.set(req.body.name, {score: req.body.score})
    console.log(JSON.stringify(item))
    res.json(item).end()
  })

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
