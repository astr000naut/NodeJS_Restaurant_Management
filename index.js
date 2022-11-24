const express = require('express');
const userRouter = require('./routers/user')
const tableRouter = require('./routers/table')
const billRouter = require('./routers/bill')
const dishRouter = require('./routers/dish')
const socket = require('socket.io')

const dishHandler = require('./socketHandler/dishHandler')

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

const onConnection = (socket) => {
    dishHandler(io, socket);
    console.log("CLIENTS COUNT")
    console.log(io.engine.clientsCount)
}

io.on('connection', onConnection)
