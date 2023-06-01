import express from 'express'
import dotenv from 'dotenv'
import es from './models/es.js'
import bodyParser from 'body-parser'

const app = express()

dotenv.config()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/autocomplete', async (req, res) => {
  try {
    const { q } = req.body

    const searchKey = q.split(' ')

    const data = await es.search({
      index: 'movies',
      body: {
        query: {
          regexp: {
            title: `.*${searchKey[0].toLowerCase()}.*`,
          },
        },
      },
    })
    const titles = data.hits.hits.map(ele => ele._source.title)
    const resData =
      searchKey.length > 1
        ? titles.filter(ele =>
            ele.toLowerCase().includes(q.trim().toLowerCase())
          )
        : titles
    return res.json(resData)
  } catch (err) {
    console.error(err)
    return res.json(err)
  }
})

app.get('/search', function (req, res) {
  es.search(
    {
      index: indexname,
      body: {
        query: {
          multi_match: {
            query: req.query.search,
            fields: ['title', 'overview'],
          },
        },
      },
    },
    function (error, response) {
      res.json({ result: response })
    }
  )
})

app.post('/searchmore', async (req, res) => {
  try {
    const { q } = req.body
    const searchKey = q.split(' ')
    const data = await es.search({
      index: 'movies',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['title', 'overview', 'genres'],
          },
        },
      },
    })
    const info = data.hits.hits.map(ele => ele._source)
    const resData =
      searchKey.length > 1
        ? info.filter(ele => ele.toLowerCase().includes(q.trim().toLowerCase()))
        : info
    return res.json(resData)
  } catch (err) {
    console.error(err)
    return res.json(err)
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
