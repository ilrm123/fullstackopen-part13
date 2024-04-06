const router = require('express').Router()
const sequelize = require('sequelize')

const { Blog } = require('../models')

router.get('/api/authors', async (req, res) => {
    const authors = await Blog.findAll({
      attributes: ['author', [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'], [sequelize.fn('SUM', sequelize.col('likes')), 'likes']],
      group: ['author']
    })
    res.json(authors)
  })

module.exports = router