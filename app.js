const express = require('express')
const app = express()
//const morgan = require('morgan')
const mongoose = require('mongoose')
const {MONGODB,PORT} = require('./config/keys')
const SocketIo = require('socket.io')
// models user and post
require('./models/user')
require('./models/post')
const routerAuth = require('./routes/auth')
const routerPosts = require('./routes/post')
const routerUser = require('./routes/user')

mongoose.connect(MONGODB,{
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify : false
})
//Conectado
mongoose.connection.on('connected',()=>{
    console.log("Conectado en mongo")
})
//Error
mongoose.connection.on('error',(err)=>{
    console.log(`Error : ${err}`)
})

//app.use(morgan('dev'))
app.use(express.json())
app.use(routerAuth)
app.use(routerPosts)
app.use(routerUser)

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path  = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}

const server = app.listen(PORT, ()=>{
    console.log("Corriendo")
})

const io = SocketIo(server)
let connectCounter = 0;

io.on('connection',(socket)=>{
    socket.on('post:onlypost',(data)=>{
        socket.broadcast.emit('post:onlypost',data)
    })
    socket.on('post:deletePost',(data)=>{
        socket.broadcast.emit('post:deletePost',data)
    })
    connectCounter++; 
    socket.on('disconnect', function() { 
        connectCounter-- 
        socket.broadcast.emit('conteo',connectCounter)
    })
    io.sockets.emit('conteo',connectCounter)
})