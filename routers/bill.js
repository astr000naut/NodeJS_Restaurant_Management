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
         console.log(req.body);
        req.body.dishes.forEach(async element => {
            await HoadonMon.create({
                soluongmon: element.soluong,
                ghichu: element.ghichu,
                MonId: element.id,
                HoadonId: req.body.bill_id
            })
        });
        res.send({
            status: "success",
            message: "Add dish success",
            bill: {}
        })
    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            bill: {}
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
        console.log(req.query.id)
        let dish_list = []
        let hoadonmon = await HoadonMon.findAll({
            where: {
                HoadonId: req.query.id
            }
        })
        for (let i = 0; i < hoadonmon.length; ++ i) {
            let mon = await Mon.findOne({where: {id: hoadonmon[i].MonId}})
            let dish = {
                id: hoadonmon[i].MonId,
                ten: mon.ten,
                gia: hoadonmon[i].soluongmon * mon.gia,
                soluong: hoadonmon[i].soluongmon,
                ghichu: hoadonmon[i].ghichu
            }
            dish_list.push(dish)
        }
    

        console.log(dish_list);

        res.send({
            status: "success",
            message: "Get bill's dishes success",
            dishes: dish_list
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