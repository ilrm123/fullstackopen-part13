const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/api/users', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/api/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/api/users/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: {username: req.params.username} })
    user.username = req.body.username
    await user.save()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router