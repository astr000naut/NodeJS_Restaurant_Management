const express = require('express')
const {Hoadon, Ban, HoadonMon, Mon} = require('../models/models')


const router = express.Router()

router.post('/create', async (req, res) => {
    try {
        
        let newBill = await Hoadon.create({
           taoboi: req.body.taoboi,
           BanId: req.body.ban
        })
        await newBill.save();
        let ban = await Ban.findOne({
            where: {
                id: req.body.ban
            }
        })
        ban.hoadonht = newBill.id;
        await ban.save();
        res.send({
            status: "success",
            message: "Created new bill",
            bill: newBill
        })
    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            bill: {}
        })
    }
})

router.post('/adddish', async (req, res) => {
    try {
        let dishes = req.body.dishes
        console.log(dishes);
        let hoadonmonId = []
        for (let i = 0; i < dishes.length; ++ i) {
            let hoadonmon = await HoadonMon.create({
                soluongmon: dishes[i].soluong,
                ghichu: dishes[i].ghichu,
                trangthai: dishes[i].trangthai,
                MonId: dishes[i].id,
                HoadonId: req.body.bill_id
            })
            await hoadonmon.save()
            // BP DISH OBJECT
            hoadonmonId.push(hoadonmon.id)
            console.log(hoadonmonId)
        }
        res.send({
            status: "success",
            message: "Add dish success",
            hoadonmonId: hoadonmonId
        })
    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            hoadonmonId: {}
        })
    }
})
router.get('/get/:id', async (req, res) => {
    try {
        let bill = await Hoadon.findOne({
            where: {
                id: req.params.id
            }
        })
        res.send({
            status: "success",
            message: "Get bill success",
            bill: bill 
        })

    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            bill: {}
        })
    }
})

router.get('/getalldish', async (req, res) => {
    try {
        let bpdish_list = []
        let hoadonmon = await HoadonMon.findAll({
            where: {
                HoadonId: req.query.id
            }
        })
        let hoadon = await Hoadon.findOne({
            where: {
                id: req.query.id
            }
        })
        for (let i = 0; i < hoadonmon.length; ++ i) {
            let mon = await Mon.findOne({where: {id: hoadonmon[i].MonId}})
            let bpdish = {
                id: hoadonmon[i].MonId,
                ban: hoadon.BanId,
                ten: mon.ten,
                gia: hoadonmon[i].soluongmon * mon.gia,
                soluong: hoadonmon[i].soluongmon,
                ghichu: hoadonmon[i].ghichu,
                trangthai: hoadonmon[i].trangthai,
                billId: req.query.id
            }
            bpdish_list.push(bpdish)
        }
    
        res.send({
            status: "success",
            message: "Get bill's bp dishes success",
            bp_dishes: bpdish_list
        })

    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            bp_dishes: {}
        })
    }
})



module.exports = router