const functions = require('firebase-functions')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')
const { findProductBySlug } = require('./lib/store-api')

process.env.STOREFRONT_LONG_CACHE = 'true'

const DOC_ROUTES = {
  fichastecnicas: 'ficha_tecnica',
  fds: 'fds'
}

exports.ssr = functions.https.onRequest(async (req, res) => {
  const [, routePrefix, slug] = req.path.split('/')
  const field = DOC_ROUTES[routePrefix]

  if (field && slug) {
    try {
      const product = await findProductBySlug(slug)
      const doc = product && product.metafields &&
        product.metafields.find(({ field: f, value }) => f === field && value)
      if (doc) {
        res.set('cache-control', 'public, max-age=300, s-maxage=60, must-revalidate')
        return res.redirect(302, doc.value)
      }
    } catch (err) {
      console.error(err)
    }
    return res.status(404).send('Documento não encontrado para este produto.')
  }

  return ssr(req, res)
})

exports.uploadDoc = require('./upload-doc')
