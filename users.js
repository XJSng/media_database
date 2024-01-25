const express = require('express');
const { getDB } = require('./mongoUtil')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");
const {authenticateToken} = require ("./middlewares")
require('dotenv').config();

const router = express.Router();

// custom middleware for authenticating via token

// Routes here
router.post('/', async function(req,res){
    try{
    const db = getDB();
    const result = await db.collection('users').insertOne({
        'email': req.body.email,
        'password': await bcrypt.hash(req.body.password, 12)
    })
    res.json({
        'message':"Success",
        "result": result
    })
} catch (error) {
    res.status(428)
    res.json({ "error": "Please enter username and password"
    })
}

})

router.post('/login', async function(req, res){
    try {
        const db = getDB()
    const user = await db.collection("users").findOne({
        'email': req.body.email
    })

    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({
            "_id": user._id
        }, process.env.JWT_SECRET, {
            "expiresIn": "2h"
        })
        res.json ({
            "token":token
        })
    } else {
        res.status(401)
        res.json({
            'error': "Invalid credentials"
        })
    }
} catch (error) {
    res.status(500)
    res.json({
        "error": error
    })
}



})

// secure route SELECT authorization "BEARER TOKEN"  
router.get("/profile", authenticateToken, async function(req, res){
  console.log(req.data)
    // Changes need to be made
    const db = getDB();
    const user = await db.collection("users").findOne({
        "_id": new ObjectId(req.data._id)
    }, {
        projection: {
            'password': 0
        }
    });
res.json({
    "message":"Success",
    "user": user
})
})

module.exports = router;
