const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.message.substring(0, 7) === "notNull") {
    return res.status(400).send({ error: "Null values present for non-nullable fields" })
  } else if (error.message === "Validation error: Validation isEmail on username failed") {
    return res.status(400).send({ error: "Username must be a valid email" })
  } else {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

blogsRouter.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      [Op.or]: [
          {      title: {
            [Op.substring]: req.query.search ? req.query.search : ''
          }},
          {      author: {
            [Op.substring]: req.query.search ? req.query.search : ''
          }}
      ]
    },
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

blogsRouter.post('/api/blogs', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    res.json(blog)
  } catch (error) {
    next(error)
  }

})

blogsRouter.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

blogsRouter.put('/api/blogs/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes = req.body.likes
    await blog.save()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = {blogsRouter, errorHandler}