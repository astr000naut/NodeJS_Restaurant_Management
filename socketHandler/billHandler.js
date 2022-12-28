const {Ban, Hoadon} = require('../models/models')
module.exports = (io, socket) => {
    
    const bill_created_pv = async (tableId) => {
        console.log("RECEIVED SOCKET CREATED");
        io.emit('tn_tl_bill_created', tableId)    
    }

    const bill_done_tn = async (tableId) => {
        console.log("RECEIVED SOCKET DONE");
        let ban = await Ban.findOne({
            where: {
                id: tableId
            }
        })
        let hoadon = await Hoadon.findOne({
            where: {
                id: ban.hoadonht
            }
        })
        ban.hoadonht = -1
        hoadon.thanhtoanboi = "done"
        await ban.save()
        await hoadon.save()
        console.log("EMIT" + tableId);
        io.emit('bill_done_pv', tableId) 
        io.emit('bill_done_pv_tl', 1)   
    }

    socket.on('bill_created_pv', bill_created_pv)
    socket.on('bill_done_tn', bill_done_tn)
}