const express = require('express')
const timestamp = require('time-stamp')

const postRouter = require('./posts/postRouter.js')
const userRouter = require('./users/userRouter.js')

const server = express()

server.use(logger)
server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`
  <div style="display: flex; align-items: center;"><p style="margin: 0;">This project was deployed by:</p><h2 style="margin: 0;"> ${process.env.DEPLOYER}</h2></div>
    <p>Message of the Day: ${process.env.MOTD}</p>
    <p>Extra: ${process.env.OTHER_STUFF}</p>
  `)
})

//custom middleware

function logger(req, res, next) {
  console.log(`A ${req.method} request to ${req.url} at ${timestamp.utc('HH:mm:ss on DD/MM/YYYY')}`)
  next()
}

module.exports = server
