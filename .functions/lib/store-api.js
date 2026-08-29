const axios = require('axios')

const STORE_ID = 51372
const STORE_API = 'https://api.e-com.plus/v1'

const findProductBySlug = async (slug) => {
  const { data } = await axios.get(`${STORE_API}/products.json`, {
    params: { slug, store_id: STORE_ID, fields: '_id,slug,sku,name,metafields' },
    headers: { 'X-Store-ID': STORE_ID }
  })
  return data.result && data.result[0]
}

const searchProducts = async (term) => {
  const { data } = await axios.get(`${STORE_API}/products.json`, {
    params: {
      store_id: STORE_ID,
      fields: '_id,slug,sku,name',
      // busca simples por nome; a API também aceita sku= diretamente
      name: term,
      limit: 8
    },
    headers: { 'X-Store-ID': STORE_ID }
  })
  return data.result || []
}

const patchProductMetafield = async (productId, field, value) => {
  const authenticationId = process.env.STORE_MY_ID
  const accessToken = process.env.STORE_ACCESS_TOKEN
  if (!authenticationId || !accessToken) {
    throw new Error('Credenciais da Store API não configuradas (STORE_MY_ID / STORE_ACCESS_TOKEN)')
  }

  const { data: product } = await axios.get(`${STORE_API}/products/${productId}.json`, {
    params: { store_id: STORE_ID, fields: 'metafields' },
    headers: { 'X-Store-ID': STORE_ID }
  })

  const metafields = (product.metafields || []).filter(m => m.field !== field)
  metafields.push({ namespace: 'docs_uploader', field, value })

  return axios.patch(
    `${STORE_API}/products/${productId}.json`,
    { metafields },
    {
      headers: {
        'X-Store-ID': STORE_ID,
        'X-My-ID': authenticationId,
        'X-Access-Token': accessToken
      }
    }
  )
}

module.exports = { findProductBySlug, searchProducts, patchProductMetafield, STORE_ID }
