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
  var bool = null
  var user = null

  if (req.query.read == 'false') {
    bool = false
  } else if (req.query.read == 'true') {
    bool = true
  } else {
    user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
          through: {
            as: 'readinglists',
            attributes: ['read', 'id'],
          }
        }
      ]
    })
  }

  if (bool != null) {
    user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
          through: {
            as: 'readinglists',
            attributes: ['read', 'id'],
            where: {
              read: bool
            }
          }
        }
      ]
    })
  }

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