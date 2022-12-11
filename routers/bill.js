const express = require('express')
const { Sequelize } = require('sequelize')
const {Hoadon, Ban, HoadonMon, Mon, Nhanvien} = require('../models/models')
const Op = Sequelize.Op


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
            message: "Tạo mới hóa đơn thành công",
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
        let hoadon = await Hoadon.findOne({
            where: {
                id: req.body.bill_id
            }
        })
        for (let i = 0; i < dishes.length; ++ i) {
            let hoadonmon = await HoadonMon.create({
                soluongmon: dishes[i].soluong,
                ghichu: dishes[i].ghichu,
                trangthai: dishes[i].trangthai,
                MonId: dishes[i].id,
                HoadonId: req.body.bill_id,
                ban: hoadon.BanId,
                tenmon: dishes[i].ten,
                gia: dishes[i].gia * dishes[i].soluong
            })
            tong_gia += hoadonmon.gia
            await hoadonmon.save()
            hoadonmonId.push(hoadonmon.id)
        }
        
        hoadon.gia += tong_gia
        await hoadon.save()
        res.send({
            status: "success",
            message: "Thêm mới món thành công",
            hoadonmonId: hoadonmonId
        })
    } catch (error) {
        console.log(error)
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
       
        let date = bill.createdAt
        let dateObj = new Date(date)
        dateObj.setTime(dateObj.getTime() + 7 * 60 * 60 * 1000)
        res.send({
            status: "success",
            message: "Lấy hóa đơn thành công",
            bill: {
                id: bill.id,
                taoboi: bill.taoboi,
                ban: bill.BanId,
                thanhtoanboi: bill.thanhtoanboi,
                createdAt: dateObj.toUTCString(),
                updatedAt: bill.updatedAt,
                gia: bill.gia,
                
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

router.get('/filter', async (req, res) => {
    try {
        
        console.log(req.query)
        let fDate = new Date(`${req.query.fy}-${req.query.fm}-${req.query.fd}`)
        let tDate = new Date(`${req.query.ty}-${req.query.tm}-${req.query.td}`)
        fDate.setHours(7)
        tDate.setHours(31)
        console.log(fDate.toISOString())
        let billList = await Hoadon.findAll({
            where: {
                createdAt: {
                    [Op.gte]: fDate.toISOString(),
                    [Op.lte]: tDate.toISOString()
                },
 
            }
        })
        let billListResponse = []
        for (let i = 0; i < billList.length; ++ i) {
            if (billList[i].thanhtoanboi == "done") {
                let date = billList[i].createdAt
                let dateObj = new Date(date)
                dateObj.setTime(dateObj.getTime() + 7 * 60 * 60 * 1000)
                billListResponse.push({
                    id: billList[i].id,
                    taoboi: billList[i].taoboi,
                    ban: billList[i].BanId,
                    thanhtoanboi: "",
                    createdAt: dateObj.toUTCString(),
                    updatedAt: billList[i].updatedAt,
                    gia: billList[i].gia,
                })
            }
        }
        console.log(billListResponse)
        res.send({
            status: "success",
            message: "Tìm kiếm hóa đơn thành công",
            bills: billListResponse
        })

    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            bills: billListResponse
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
        for (let i = 0; i < hoadonmon.length; ++ i) {
            let bpdish = {
                id: hoadonmon[i].id,
                ban: hoadonmon[i].ban,
                ten: hoadonmon[i].tenmon,
                gia: hoadonmon[i].gia,
                soluong: hoadonmon[i].soluongmon,
                ghichu: hoadonmon[i].ghichu,
                trangthai: hoadonmon[i].trangthai,
                billId: req.query.id
            }
            bpdish_list.push(bpdish)
        }
    
        res.send({
            status: "success",
            message: "Lấy danh sách món của hóa đơn thành công",
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
        let hoadon = await Hoadon.findOne({
            where: {
                id: bp_dish.HoadonId
            }
        })
        if (req.body.type == "capnhat") {
            let bp_dish_old_price = bp_dish.gia
            let giamon = Math.round(bp_dish.gia / bp_dish.soluongmon)
            bp_dish.soluongmon = req.body.soluong
            bp_dish.gia = bp_dish.soluongmon * giamon
            bp_dish.ghichu = req.body.ghichu

            hoadon.gia += (bp_dish.gia - bp_dish_old_price)
            await hoadon.save()

            await bp_dish.save()

            res.send({
                status: "success",
                message: "Cập nhật món cho hóa đơn thành công"
            })
        }
        if (req.body.type == "xoa") {
            hoadon.gia -= bp_dish.gia
            await hoadon.save()
            await bp_dish.destroy()
            res.send({
                status: "success",
                message: "Hủy món thành công"
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