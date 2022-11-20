const express = require('express')
const {Nhanvien} = require('../models/models')


const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        let user = await Nhanvien.findAll({
            where: {
                username: req.body.username
            }
        })
        if (user.length > 0) {
            let password = user[0].password;
            if (password == req.body.password) {
                res.send({
                    status: "success",
                    message: "Login success",
                    user: user[0]
                })
            } else {
                res.send({
                    status: "fail",
                    message: "Wrong username or password",
                    user: {}
                })
            }
        } else {
            res.send({
                status: "fail",
                message: "Wrong username or password",
                user: {}
            })
        }
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/create', async (req, res) => {
    try {
        let user = await Nhanvien.findAll({
            where: {
                username: req.body.username
            }
        })
        if (user.length > 0) {
            res.status(400).send({
                status: "fail",
                message: "Username existed",
                user: []
            })
        } else {
            let newUser = await Nhanvien.create({
                ten: req.body.ten,
                tuoi: req.body.tuoi,
                sdt: req.body.sdt,
                noio: req.body.noio,
                quequan: req.body.quequan,
                email: req.body.email,
                role: req.body.role,
                username: req.body.username,
                password: req.body.password
            });
            await newUser.save();
            res.send({
                status: "success",
                message: "Created new user",
                user: req.body
            })
        }

    } catch (error) {
        res.status(400).send({
            status: "fail",
            message: error,
            user: []
        })
    }
})

module.exports = router