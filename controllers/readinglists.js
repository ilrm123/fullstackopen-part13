const router = require('express').Router()
const { tokenExtractor } = require('./blogs')

const { User, ReadingList, Session } = require('../models')

router.post('/api/readinglists', async (req, res, next) => {
    try {
      const readingList = await ReadingList.create({userId: req.body.user_id, blogId: req.body.blog_id, read: false})
      res.json(readingList)
    } catch (error) {
      next(error)
    }
  })

router.put('/api/readinglists/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    const session = await Session.findOne({
      where: {
        user_id: user.id
      }
    })

    if (!session) {
      throw new Error('Invalid session')
    }
  
    const readingList = await ReadingList.findByPk(req.params.id)
    if (user.id != readingList.user_id) {
      throw new Error('Unauthorized user!')
    }
    readingList.read = req.body.read
    await readingList.save()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router