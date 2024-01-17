const express = require("express")
const {connectToMongoDB} = require(`./db`)

const json = require("json")
const cors = require("cors")



const app = express()
// app.use(json) // using json
// app.use(cors()) // using cors

// routes
app.get("/", (req, res)=> {
    res.send('Hello, world!')
})


// Port running
const port = 3000
app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})