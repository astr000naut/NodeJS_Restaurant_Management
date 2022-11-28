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
            message: "Get unfinished bp dish list success",
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