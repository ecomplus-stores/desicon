const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Busboy = require('busboy')
const { patchProductMetafield } = require('./lib/store-api')

if (!admin.apps.length) {
  admin.initializeApp()
}

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const ALLOWED_FIELDS = new Set(['fds', 'ficha_tecnica'])

const parseMultipart = (req) => new Promise((resolve, reject) => {
  const busboy = Busboy({ headers: req.headers, limits: { fileSize: MAX_FILE_SIZE } })
  const fields = {}
  let file = null
  let fileTooLarge = false

  busboy.on('field', (name, value) => { fields[name] = value })

  busboy.on('file', (name, stream, info) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('limit', () => { fileTooLarge = true })
    stream.on('end', () => {
      if (!fileTooLarge) {
        file = { buffer: Buffer.concat(chunks), filename: info.filename, mimeType: info.mimeType }
      }
    })
  })

  busboy.on('finish', () => {
    if (fileTooLarge) return reject(new Error('Arquivo maior que 15MB'))
    resolve({ fields, file })
  })
  busboy.on('error', reject)

  req.pipe(busboy)
})

module.exports = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.status(204).send('')
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const expectedPassword = process.env.DOCS_UPLOAD_PASSWORD
  if (!expectedPassword) {
    return res.status(500).json({ error: 'DOCS_UPLOAD_PASSWORD não configurada nas funções' })
  }
  if (req.get('Authorization') !== `Bearer ${expectedPassword}`) {
    return res.status(401).json({ error: 'senha inválida' })
  }

  try {
    const { fields, file } = await parseMultipart(req)
    const { productId, docType } = fields

    if (!productId || !ALLOWED_FIELDS.has(docType)) {
      return res.status(400).json({ error: 'productId e docType (fds|ficha_tecnica) são obrigatórios' })
    }
    if (!file) {
      return res.status(400).json({ error: 'arquivo não enviado' })
    }
    if (file.mimeType !== 'application/pdf') {
      return res.status(400).json({ error: 'apenas arquivos PDF são aceitos' })
    }

    const bucket = admin.storage().bucket()
    const storagePath = `docs/${productId}-${docType}.pdf`
    const storageFile = bucket.file(storagePath)

    await storageFile.save(file.buffer, {
      contentType: 'application/pdf',
      metadata: { cacheControl: 'public, max-age=300' }
    })
    await storageFile.makePublic()
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

    await patchProductMetafield(productId, docType, publicUrl)

    return res.status(200).json({ ok: true, url: publicUrl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'erro ao processar upload' })
  }
})
