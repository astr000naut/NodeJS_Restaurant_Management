const express = require('express')
const {Mon} = require('../models/models')


const router = express.Router()

router.post('/add', async (req, res) => {
    try {
        
        let newDish = await Mon.create({
           ten: req.body.ten,
           gia: req.body.gia
        })
        await newDish.save();
        res.send({
            status: "success",
            message: "Created new dish",
            dish: newDish
        })
    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            dish: {}
        })
    }
})

router.get('/getall', async (req, res) => {
    try {
        let allDish = await Mon.findAll();
        res.send({
            status: "success",
            message: "Get dish list success",
            dishes: allDish
        })

    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            dishes: {}
        })
    }
})



module.exports = router