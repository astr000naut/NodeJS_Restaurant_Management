const express = require('express')
const {Mon, HoadonMon} = require('../models/models')


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
            message: "Tạo mới món ăn thành công",
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

router.delete('/delete/:id', async (req, res) => {
    try {
        
        console.log(req.params.id)
        let dish = await Mon.findOne({
            where: {
                id: req.params.id
            }
        })
        if (dish != null) {
            await dish.destroy()
        }
        res.send({
            status: "success",
            message: "Xóa món thành công",
        
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
            message: "Lấy danh sách món ăn thành công",
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

router.get('/getunfinished', async (req, res) => {
    try {
        let unfinishedBpDishList = await HoadonMon.findAll({
            where: {
                trangthai: "Chưa làm"
            }
        });
        let bp_dishe_list = []
        for (let i = 0; i < unfinishedBpDishList.length; ++ i) {
            bp_dishe_list.push({
                id: unfinishedBpDishList[i].id,
                ban: unfinishedBpDishList[i].ban,
                ten: unfinishedBpDishList[i].tenmon,
                gia: 0,
                soluong: unfinishedBpDishList[i].soluongmon,
                ghichu: unfinishedBpDishList[i].ghichu,
                trangthai: unfinishedBpDishList[i].trangthai,
                billId: unfinishedBpDishList[i].HoadonId
            })
        }
        res.send({
            status: "success",
            message: "Lấy danh sách món chưa làm thành công",
            bp_dishes: bp_dishe_list
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