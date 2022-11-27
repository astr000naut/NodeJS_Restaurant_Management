const express = require('express')
const {Hoadon, Ban, HoadonMon, Mon, Nhanvien} = require('../models/models')


const router = express.Router()

router.post('/create', async (req, res) => {
    try {
        
        let newBill = await Hoadon.create({
           taoboi: req.body.taoboi,
           BanId: req.body.ban,
           gia: 0
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
        let tong_gia = 0
        for (let i = 0; i < dishes.length; ++ i) {
            let hoadonmon = await HoadonMon.create({
                soluongmon: dishes[i].soluong,
                ghichu: dishes[i].ghichu,
                trangthai: dishes[i].trangthai,
                MonId: dishes[i].id,
                HoadonId: req.body.bill_id
            })
            tong_gia += dishes[i].gia
            await hoadonmon.save()
            hoadonmonId.push(hoadonmon.id)
        }
        let hoadon = await Hoadon.findOne({
            where: {
                id: req.body.bill_id
            }
        })
        hoadon.gia = tong_gia
        await hoadon.save()
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
router.get('/getone', async (req, res) => {
    try {
        console.log("ABC")
        console.log(req.query.id)
        let bill = await Hoadon.findOne({
            where: {
                id: req.query.id
            }
        })
        let nhanvientao = await Nhanvien.findOne({
            where:{
                id: bill.taoboi
            }
        })
        let date = bill.createdAt
        let dateObj = new Date(date)
        dateObj.setTime(dateObj.getTime() + 6 * 60 * 60 * 1000)
        res.send({
            status: "success",
            message: "Get bill success",
            bill: {
                id: bill.id,
                taoboi: nhanvientao.ten,
                ban: bill.BanId,
                thanhtoanboi: bill.thanhtoanboi,
                createdAt: dateObj.toUTCString(),
                updatedAt: bill.updatedAt,
                gia: bill.gia
            } 
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
                id: hoadonmon[i].id,
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

router.put('/updatebpdish', async (req, res) => {
    try {
        
        console.log(req.body)
        let bp_dish = await HoadonMon.findOne({
            where: {
                id: req.body.bp_dish_id
            }
        })
        if (req.body.type == "capnhat") {
            bp_dish.soluongmon = req.body.soluong
            bp_dish.ghichu = req.body.ghichu
            await bp_dish.save()

            res.send({
                status: "success",
                message: "Update bill's bp dish success"
            })
        }
        if (req.body.type == "xoa") {
            await bp_dish.destroy()
            res.send({
                status: "success",
                message: "Delete bill's bp dish success"
            })
        }

    } catch (error) {
        res.send({
            status: "fail",
            message: error
        })
    }
})



module.exports = router