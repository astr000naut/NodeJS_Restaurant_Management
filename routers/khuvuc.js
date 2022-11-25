const express = require('express')
const {Khuvuc} = require('../models/models')


const router = express.Router()


router.get('/getall', async (req, res) => {
    try {
        let allArea = await Khuvuc.findAll();
        res.send({
            status: "success",
            message: "Get area list success",
            areas: allArea
        })

    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            areas: {}
        })
    }
})



module.exports = router