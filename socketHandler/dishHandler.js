module.exports = (io, socket) => {
    const dish_list = (dish_list) => {
        console.log("SOCKET IO RECEIVED DATA")
        console.log(dish_list)
        io.emit('dish_list_bep', dish_list)
    }

    socket.on('dish_list_pv', dish_list)
}