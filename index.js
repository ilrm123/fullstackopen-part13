require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({}))

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  const blog = new Blog(req.body)
  const savedBlog = await blog.save()

  res.json(savedBlog)
})

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
