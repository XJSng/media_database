const express = require("express")
// Refers to the router object
const userRoutes = require("./users")
const cors = require("cors")

const { connectToMongoDB } = require(`./mongoUtil`)
const { ObjectId } = require('mongodb')
const { authenticateToken } = require("./middlewares")

const app = express()
const port = 3000

app.use(cors()) // using cors
app.use(express.json()); // use json

async function main() {
   try {
      const db = await connectToMongoDB()

      // ADD VARIOUS ROUTES HERE
      app.get('/', (req, res) => {
         res.send('Welcome to FMC database!')
      })

      // CREATING THE PORT ROUTE
      // CREATE EQUIPMENT
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

      // GET ALL EQUIPMENT AUTHENTICATION REQUIRED
      app.get('/equipment', authenticateToken, async (req, res) => {
         try {
            const equipments = await db.collection('equipment_list').find({}).toArray()
            // fetch Equipments
            res.json(equipments)
         } catch (error) {
            res.status(500).json({ message: 'Error fetching equipment list', error: error.message })
         }
      })

      // GET ONE EQUIPMENT BY ID
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
      app.put("/equipment/:id", async (req, res) => {
         try {
            const id = new ObjectId(req.params.id);
            const { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service } = req.body

            // Validation
            if (!name || !dateOfPurchase || !equipmentType || !modelNumber || !generalRemarks || !service) {
               return res.status(400).json({ message: "Missing required fields" })
            }

            const updateData = { name, dateOfPurchase, equipmentType, modelNumber, generalRemarks, service };
            const result = await db.collection('equipment_list').updateOne(
               { _id: id },
               { $set: updateData }
            )
            if (result.modifiedCount === 0) {
               return res.status(404).json({ message: "No equipment found with this ID, or no new data provided" })
            }
            res.json({ message: "Equipment updated successfully" })

         } catch (error) {
            res.status(500).json({ message: "Error updating Equipment", error: error.message })
         }
      })

      // DELETE AN EQUIPMENT BY ID
      app.delete("/equipment/:id", async (req, res) => {
         try {
            await db.collection("equipment_list").deleteOne({
               '_id': new ObjectId(req.params.id)
            })
            res.json({
               "message": "Equipment successfully deleted"
            })
         }
         catch (error) {
            res.status(500).json({ message: "Error deleting equipment", error: error.message })
         }
      })

      // GET ALL LIVESTREAM SERVICES
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

            // REPLACE EQUIPMENT ID WITH EQUIPMENT NAME
            for (let j = 0; j < livestreams.length; j++) {
               const livestream = livestreams[j]

               if (Array.isArray(livestream.equipmentList)) {
                  for (let k = 0; k < livestream.equipmentList.length; k++) {
                     const equipmentId = livestream.equipmentList[k]


                     if (equipmentMap[equipmentId]) {
                        livestream.equipmentList[k] = equipmentMap[equipmentId]
                     }
                  }
               }

            }

            res.json(livestreams)
         } catch (error) {
            res.status(500).json({ message: 'Error fetching livestream list', error: error.message })
         }
      })

      // CREATE LIVESTREAM SERVICES
      app.post("/livestream", async (req, res) => {
         try {
            const { livestreamDate, director, volunteers, equipmentList } = req.body
            // Validation
            if (!livestreamDate || !director || !volunteers || !equipmentList) { return res.status(400).json({ message: "Missing required fields" }) }
            if (!Array.isArray(equipmentList) || !Array.isArray(volunteers)) {
               return res.status(400).json({ message: "equipments or volunteers must be an array" })
            }
            const newLivestream = { livestreamDate, director, volunteers, equipmentList }
            const result = await db.collection('livestream_service').insertOne(newLivestream)
            res.status(201).json(result)

         } catch (error) {
            res.status(500).json({ message: "Error adding new livestream service", error: error.message })
         }
      })

      // PUT LIVESTREAM BY ID
      app.put("/livestream/:id", async (req, res) => {
         try {
            const id = new ObjectId(req.params.id);
            const { livestreamDate, director, equipmentList, volunteers } = req.body

            // Validation
            if (!livestreamDate || !director || !equipmentList || !volunteers) {
               return res.status(400).json({ message: "Missing required fields" })
            }
            if (!Array.isArray(equipmentList) || !Array.isArray(volunteers)) {
               return res.status(400).json({ message: "equipments or volunteers must be an array" })
            }

            const updateData = { livestreamDate, director, equipmentList, volunteers };

            const result = await db.collection('livestream_service').updateOne(
               { _id: id },
               { $set: updateData }
            )
            if (result.modifiedCount === 0) {
               return res.status(404).json({ message: "No livestream found with this ID, or no new data provided" })
            }
            res.json({ message: "Equipment updated successfully" })

         } catch (error) {
            res.status(500).json({ message: "Error updating Equipment", error: error.message })
         }
      })

      // DELETE LIVESTREAM BY ID
      app.delete("/livestream/:id", async (req, res) => {
         try {
            await db.collection("livestream_service").deleteOne({
               '_id': new ObjectId(req.params.id)
            })
            res.json({
               "message": "Livestream service successfully deleted"
            })
         }
         catch (error) {
            res.status(500).json({ message: "Error deleting livestream service", error: error.message })
         }
      })

      // GET ALL VOLUNTEERS
      app.get('/volunteers', async (req, res) => {
         try {
            const user = await db.collection('volunteers').find({}).toArray()
            res.json(user)
         } catch (error) {
            res.status(500).json({ message: 'Error fetching volunteer list', error: error.message })
         }
      })

      // CREATE A VOLUNTEER
      app.post("/volunteers", async (req, res) => {
         try {
            const { name, dob, email, phoneNumber } = req.body
            // Validation
            if (!name || !dob || !email || !phoneNumber) { return res.status(400).json({ message: "Missing required fields" }) }

            const newVolunteer = { name, dob, email, phoneNumber }
            const result = await db.collection('volunteers').insertOne(newVolunteer)
            res.status(201).json(result)

         } catch (error) {
            res.status(500).json({ message: "Error adding new volunteer", error: error.message })
         }
      })

      // PUT VOLUNTEER BY ID
      app.put("/volunteers/:id", async (req, res) => {
         try {
            const id = new ObjectId(req.params.id);
            const { name, dob, email, phoneNumber } = req.body

            // Validation
            if (!name || !dob || !email || !phoneNumber) {
               return res.status(400).json({ message: "Missing required fields" })
            }

            const updateData = { name, dob, email, phoneNumber };
            const result = await db.collection('volunteers').updateOne(
               { _id: id },
               { $set: updateData }
            )
            if (result.modifiedCount === 0) {
               return res.status(404).json({ message: "No volunteer found with this ID, or no new data provided" })
            }
            res.json({ message: "Volunteer updated successfully" })

         } catch (error) {
            res.status(500).json({ message: "Error updating volunteer", error: error.message })
         }
      })

      // DELETE VOLUNTEER BY ID
      app.delete("/volunteers/:id", async (req, res) => {
         try {
            const id = req.params.id
            if (!ObjectId.isValid(id)) {
               return res.status(400).json({ message: "Invalid volunteer ID" });
            }
            await db.collection("volunteers").deleteOne({
               '_id': new ObjectId(id)
            })
            res.json({
               "message": "Volunteer successfully deleted"
            })
         }
         catch (error) {
            res.status(500).json({ message: "Error deleting volunteer", error: error.message })
         }
      })

      // Resgister the user route
      app.use("/users", userRoutes)



   } catch (error) {
      console.error('Error connecting to MongoDB', error)
   }


}

// execute main
main()

// PORT RUNNING HERE
app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
})