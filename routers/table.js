const express = require('express')
const {Ban, Khuvuc} = require('../models/models')


const router = express.Router()

router.post('/create', async (req, res) => {
    try {
        //console.log(req.body);
        let newTable = await Ban.create({
            khuvuc: req.body.khuvuc,
            socho: req.body.socho,
            hoadonht: req.body.hoadonht
        })
        let khuvuc = await Khuvuc.findAll({
            where: {
                khuvuc: req.body.khuvuc
            }
            
        })
        if (khuvuc.length == 0) {
            let khuvucmoi = await Khuvuc.create({
                khuvuc: req.body.khuvuc
            })
            await khuvucmoi.save()
        }
        await newTable.save();
        res.send({
            status: "success",
            message: "Created new table",
            table: req.body
        })
    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            table: {}
        })
    }
})
router.get('/getall', async (req, res) => {
    try {
        let allTable = await Ban.findAll();
        res.send({
            status: "success",
            message: "Get table list success",
            tables: allTable
        })

    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            tables: {}
        })
    }
})

module.exports = router