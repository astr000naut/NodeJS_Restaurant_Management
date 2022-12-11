const express = require('express')
const {Nhanvien} = require('../models/models')
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op


const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        let user = await Nhanvien.findOne({
            where: {
                username: req.body.username
            }
        })
        if (user != null) {
            let password = user.password;
            if (password == req.body.password) {
                res.send({
                    status: "success",
                    message: "Đăng nhập thành công",
                    user: user
                })
            } else {
                res.send({
                    status: "fail",
                    message: "Sai tên đăng nhập hoặc mật khẩu",
                    user: {}
                })
            }
        } else {
            res.send({
                status: "fail",
                message: "Sai tên đăng nhập hoặc mật khẩu",
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
                message: "Tên đăng nhập này đã tồn tại",
                user: []
            })
        } else {
            let newUser = await Nhanvien.create({
                ten: req.body.ten,
                tuoi: req.body.tuoi,
                sdt: req.body.sdt,
                noio: req.body.noio,
                quequan: "",
                email: req.body.email,
                role: req.body.role,
                username: req.body.username,
                password: req.body.password
            });
            await newUser.save();
            res.send({
                status: "success",
                message: "Tạo mới tài khoản thành công",
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

router.get('/getallpersonnel', async (req, res) => {
    try {
        let userList = await Nhanvien.findAll({
            where: {
                role: {
                    [Op.ne]: 'quanly'
                } 
            }
        })
        res.send({
            status: "success",
            message: "Lấy danh sách nhân viên thành công",
            users: userList
        })

       
            
        
    } catch (error) {
        res.send({
            status: "fail",
            message: error,
            users: {}
        })
    }
})

router.put('/update', async (req, res) => {
    try {
        console.log("DMM")
        console.log(req.body)
        let user = await Nhanvien.findOne({
            where: {
                id: req.body.id 
            }
        })
        if (req.body.oldpass != "") {
            if (req.body.oldpass != user.password) 
                throw "Sai mật khẩu"
            user.ten = req.body.ten
            user.tuoi = req.body.tuoi
            user.sdt = req.body.sdt
            user.noio = req.body.noio 
            user.email = req.body.email
            user.password = req.body.newpass
            await user.save()
        } else {
            user.ten = req.body.ten
            user.tuoi = req.body.tuoi
            user.sdt = req.body.sdt
            user.noio = req.body.noio 
            user.email = req.body.email 
            await user.save() 
        }
        res.send({
            status: "success",
            message: "Cập nhật thông tin thành công",
            users: [user]
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: "fail",
            message: error,
            users: []
        })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        await Nhanvien.destroy({
            where: {
              id: req.params.id
            }
          });
        res.send({
            status: "success",
            message: "Xóa tài khoản thành công",
        })
    } catch (error) {
        res.status(400).send({
            status: "fail",
            message: error
        })
    }
})

module.exports = router