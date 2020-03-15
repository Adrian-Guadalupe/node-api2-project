const express = require('express')
const postsRouter = require('./posts-router.js')

const server = express()

server.use(express.json())
server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
   res.send('Hi, Everyone!')
})

module.exports = server