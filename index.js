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
         res.send('Welcome to FMC database!')
      })

      // CREATING THE PORT ROUTE
      app.post('/equipment', async (req, res) => {
         try {
            const { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service } = req.body
            // Validation
            if (!name || !dateOfPurchase || !equipmentType || !modelNumber || !generalRemarks || !service) { return res.status(400).json({ message: "Missing required fields" }) }

            const newEquipment = { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service }
            const result = await db.collection('equipment_list').insertOne(newEquipment)
            res.status(201).json(result)

         } catch (error) {
            res.status(500).json({ message: "Error adding new equipment", error: error.message })
         }
      })

      // GET ALL EQUIPMENT
      app.get('/equipment', async (req, res) => {
         try {
            const equipments = await db.collection('equipment_list').find({}).toArray()

            // fetch services
            const services = await db.collection('volunteers').find({}).toArray()
            const serviceMap = {};

            //Create service map using for loop
            // for (const i = 0; i < services.length; i++) {
            //    const service = services[i]
            //    serviceMap[service._id] = service.name;
            // }

            res.json(equipments)
         } catch (error) {
            res.status(500).json({ message: 'Error fetching equipment list', error: error.message })
         }
      })

      //GET EQUIPMENT BY ID
      app.get('/equipment/:id', async (req, res) => {
         try {
            const id = new ObjectId(req.params.id)
            const equipment = await db.collection("equipment_list").findOne({ _id: id })
            if (equipment) {
               res.json(equipment)
            } else {
               res.status(404).json({ message: 'Equipment not found' })
            }
         } catch (error) {
            res.status(500).json({ message: 'Error fetching this equipment', error: error.message })
         }
      })

      // PUT EQUIPMENT BY ID
      app.put("/equipment/:id", async (req, res)=>{
         try {
            const id = new ObjectId(req.params.id);
            const { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service } = req.body

            // Validation
            if (!name || !dateOfPurchase || !equipmentType || !modelNumber || !generalRemarks || !service) { 
               return res.status(400).json({ message: "Missing required fields" }) }

const updateData = { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service };
               const result = await db.collection('equipment_list').updateOne(
                  {_id: id},
                  {$set:updateData}
               )
               if (result.modifiedCount === 0) {
                  return res.status(404).json({ message: "No equipment found with this ID, or no new data provided"})
               }
               res.json({message: "Equipment updated successfully"})

         } catch(error){
            res.status(500).json({ message: "Error updating Equipment", error: error.message})
         }
      })

      //get all livestream services
      app.get('/livestream', async (req, res) => {
         try {
            // Fetch all livestream services
            let livestreams = await db.collection('livestream_service').find({}).toArray()
            // Fetch all volunteers
            const volunteers = await db.collection('volunteers').find({}).toArray();
            const volunteerMap = {};

            const equipments = await db.collection('equipment_list').find({}).toArray();
            const equipmentMap = {}

            //Create volunteer map
            for (let i = 0; i < volunteers.length; i++) {
               const volunteer = volunteers[i]
               volunteerMap[volunteer._id] = volunteer.name
            }

            //Create equipment map
            for (let i = 0; i < equipments.length; i++) {
               const equipment = equipments[i]
               equipmentMap[equipment._id] = equipment.name
            }

            // Replace volunteer IDs with volunteer names in 
            for (let j = 0; j < livestreams.length; j++) {
               const livestream = livestreams[j]
               // CHECK if livestream is an tag
               if (Array.isArray(livestream.volunteers)) {
                  for (let k = 0; k < livestream.volunteers.length; k++) {
                     const volunteerId = livestream.volunteers[k]


                     if (volunteerMap[volunteerId]) {
                        livestream.volunteers[k] = volunteerMap[volunteerId]
                     }
                  }
               }

            }

             // Replace equipment IDs with equipment names in 
             for (let j = 0; j < livestreams.length; j++) {
               const livestream = livestreams[j]

               if (Array.isArray(livestream.equipment_list)) {
                  for (let k = 0; k < livestream.equipment_list.length; k++) {
                     const equipmentId = livestream.equipment_list[k]


                     if (equipmentMap[equipmentId]) {
                        livestream.equipment_list[k] = equipmentMap[equipmentId]
                     }
                  }
               }

            }

            res.json(livestreams)
         } catch (error) {
            res.status(500).json({ message: 'Error fetching livestream list', error: error.message })
         }
      })

      //get all volunteers
      app.get('/volunteers', async (req, res) => {
         try {
            const user = await db.collection('volunteers').find({}).toArray()
            res.json(user)
         } catch (error) {
            res.status(500).json({ message: 'Error fetching volunteer list', error: error.message })
         }
      })

      //update one equipment



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
