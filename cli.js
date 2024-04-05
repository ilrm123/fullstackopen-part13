require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false})

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

const getBlogs = async () => {
    const blogs = await Blog.findAll()

    blogs.map((x) => {console.log(`${x.author}: '${x.title}', ${x.likes} likes`)})

    return null
}

getBlogs()
