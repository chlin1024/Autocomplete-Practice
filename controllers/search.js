import es from '../models/es.js'

export const autoComplete = async (req, res) => {
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
}

export const searchMoreInfo = async (req, res) => {
  try {
    const { q } = req.body
    const searchKey = q.split(' ')
    const data = await es.search({
      index: 'movies',
      body: {
        query: {
          bool: {
            should: [
              {
                regexp: {
                  title: `.*${searchKey[0].toLowerCase()}.*`,
                },
              },
              {
                regexp: {
                  overview: `.*${searchKey[0].toLowerCase()}.*`,
                },
              },
              {
                wildcard: {
                  'genres.keyword': `*${searchKey[0].toLowerCase()}*`,
                },
              },
            ],
          },
        },
        highlight: {
          fields: {
            title: {},
            overview: {},
            'genres.keyword': {},
          },
        },
      },
    })
    console.log(data)
    console.log(data.hits.hits[0].highlight)
    const info = data.hits.hits.map(ele => ({
      ...ele._source,
      highlight: ele.highlight,
    }))
    const resData =
      searchKey.length > 1
        ? info.filter(ele => ele.toLowerCase().includes(q.trim().toLowerCase()))
        : info
    return res.json(resData)
  } catch (err) {
    console.error(err)
    return res.json(err)
  }
}
