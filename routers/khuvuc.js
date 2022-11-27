const express = require('express')
const {Khuvuc} = require('../models/models')


const router = express.Router()


router.get('/getall', async (req, res) => {
    try {
        let allArea = await Khuvuc.findAll();
        let areas = []
        allArea.forEach(area => {
            areas.push(area.khuvuc)
        })
        areas.push("Tất cả")
        res.send({
            status: "success",
            message: "Get area list success",
            areas: areas
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