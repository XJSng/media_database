const express = require("express")
const cors = require("cors")

const { connectToMongoDB } = require(`./db`)
const { ObjectId } = require('mongodb')

const app = express()
const port = 3000

app.use(cors()) // using cors
app.use(express.json());

async function main() {
   try {
      const db = await connectToMongoDB()

      // ADD VARIOUS ROUTES HERE
      app.get('/', (req, res) => {
         res.send('Hello, world!')
      })

      // CREATING THE PORT ROUTE
      app.post('/equipment', async (req, res) => {
         try {
            const { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service } = req.body
            // Validation
            if (!name || !dateOfPurchase || !equipmentType || !modelNumber || !generalRemarks || !service) { return res.status(400).json({ message: "Missing required fields" }) }

            const newEquipment = { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service }
            const result = await db.collection('equipment-list').insertOne(newEquipment)
            res.status(201).json(result)

         } catch (error) {
            res.status(500).json({ message: "Error adding new equipment", error: error.message })
         }
      })

      // get all equipments
      app.get('/equipment', async (req, res) => {
         try {
            const equipments = await db.collection('equipment-list').find({}).toArray()
            res.json(equipments)
         } catch (error) {
            res.status(500).json({ message: 'Error fetching equipment list', error: error.message })
         }
      })

      //get one equipment
      app.get('/equipment/:id', async (req, res) => {
         try {
            const id = new ObjectId(req.params.id)
            const equipment = await db.collection('equipment-list').findOne({ _id: id })
            if (equipment) {
               res.json(equipment)
            } else {
               res.status(404).json({ message: 'Equipment not found' })
            }
         } catch (error) {
            res.status(500).json({ message: 'Error fetching this equipment', error: error.message })
         }
      })



      // PORT RUNNING HERE
      app.listen(port, () => {
         console.log(`Server is running on port ${port}`)
      })


   } catch (error) {
      console.error('Error connecting to MongoDB', error)
   }

}
// execute main
main()
