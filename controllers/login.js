const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/api/login', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({
    token: token,
    user_id: user.id
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

router.delete('/api/logout/:id', async (request, response) => {
  await Session.destroy({ where: { user_id:  request.params.id }})
  response.send(200)
})

module.exports = router