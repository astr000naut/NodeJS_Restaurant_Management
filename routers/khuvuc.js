const express = require('express')
const {Khuvuc, Ban} = require('../models/models')


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

router.post('/create', async (req, res) => {
    try {
        let khuvuc = req.body.khuvuc
        let oldKhuvuc = await Khuvuc.findOne({
            where: {
                khuvuc: khuvuc
            }
        })
        if (oldKhuvuc != null) {
            throw "This area has been existed"
        } else {
            console.log(req.body)
            let newKhuvuc = await Khuvuc.create({
                khuvuc: khuvuc,
                soban2: req.body.b2,
                soban4: req.body.b4,
                soban6: req.body.b6,
                soban8: req.body.b8
            })
            await newKhuvuc.save()
            
            let stt = 0;
            for (let i = 0; i < req.body.b2; ++ i) {
                ++ stt;
                let newTable = await Ban.create({
                    id: `${stt}_[${khuvuc}]`,
                    khuvuc: khuvuc,
                    socho: 2,
                    hoadonht: -1
                })
                await newTable.save()
            }
            for (let i = 0; i < req.body.b4; ++ i) {
                ++ stt;
                let newTable = await Ban.create({
                    id: `${stt}_[${khuvuc}]`,
                    khuvuc: khuvuc,
                    socho: 4,
                    hoadonht: -1
                })
                await newTable.save()
            }
            for (let i = 0; i < req.body.b6; ++ i) {
                ++ stt;
                let newTable = await Ban.create({
                    id: `${stt}_[${khuvuc}]`,
                    khuvuc: khuvuc,
                    socho: 6,
                    hoadonht: -1
                })
                await newTable.save()
            }
            for (let i = 0; i < req.body.b8; ++ i) {
                ++ stt;
                let newTable = await Ban.create({
                    id: `${stt}_[${khuvuc}]`,
                    khuvuc: khuvuc,
                    socho: 8,
                    hoadonht: -1
                })
                await newTable.save()
            }
            res.send({
                status: "success",
                message: "Create area success",
            })
        }
    } catch (error) {
        res.send({
            status: "fail",
            message: error,
        })
    }
})

router.post('/delete', async (req, res) => {
    try {
        console.log(req.body.khuvuc)
        let khuvuc = req.body.khuvuc
        let oldKhuvuc = await Khuvuc.findOne({
            where: {
                khuvuc: khuvuc
            }
        })
        if (oldKhuvuc != null) {
            await Ban.destroy({
                where: {
                    khuvuc: khuvuc
                }
            })
            await Khuvuc.destroy({
                where: {
                    khuvuc: khuvuc
                }
            })
         
            res.send({
                status: "success",
                message: "Delete area success",
            })
        } else {
            res.send({
                status: "success",
                message: "This area not exist"
            })
        }

    } catch (error) {
        res.send({
            status: "fail",
            message: error,
        })
    }
})




module.exports = router