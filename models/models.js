const {DataTypes} = require('sequelize')
const sequelize = require('../db')


const Nhanvien = sequelize.define('Nhanvien', {
    ten: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tuoi: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sdt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quequan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

const Ban = sequelize.define('Ban', {
    khuvuc: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    socho: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hoadonht: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
})

const Hoadon = sequelize.define('Hoadon', {
    taoboi: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    thanhtoanboi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gia: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
})

const Mon = sequelize.define('Mon', {
    ten: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    gia: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
})

const HoadonMon = sequelize.define('HoadonMon', {
    soluongmon: DataTypes.INTEGER,
    ghichu: DataTypes.STRING,
    trangthai: DataTypes.STRING
},{
    timestamps: true
})

Hoadon.hasMany(HoadonMon)
Mon.hasMany(HoadonMon)

Ban.hasMany(Hoadon)



// sequelize.sync({force: true});

module.exports = {Nhanvien, Hoadon, Ban, Mon, HoadonMon};
    
   
    



