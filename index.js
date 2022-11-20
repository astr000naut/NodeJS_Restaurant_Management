const express = require('express');
const userRouter = require('./routers/user')
const tableRouter = require('./routers/table')
const billRouter = require('./routers/bill')
const dishRouter = require('./routers/dish')
const socket = require('socket.io')

const app = express();
const PORT = 3000
require('dotenv').config()





app.use(express.json())
app.use('/user', userRouter)
app.use('/table', tableRouter)
app.use('/bill', billRouter)
app.use('/dish', dishRouter)




const server = app.listen(PORT, ()  => {
    console.log(`APP IS RUNNING ON PORT ${PORT}`)
})

const io = socket(server);
var count = 0;

io.on('connection', (socket) => {
    console.log("New socket connection: ")

    socket.on('counter', () => {
        ++ count;
        io.emit('counter', count);
    })
    console.log(io.engine.clientsCount);
})
