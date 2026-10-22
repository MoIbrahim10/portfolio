import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'

const files = (await readdir('dist/client/assets')).filter(name => /\.(?:js|css|woff2?)$/.test(name)).sort()
const assets = ['/brand/mo-mark-v3.svg', ...files.map(name => `/assets/${name}`)]
const template = await readFile('public/sw.js', 'utf8')
const version = createHash('sha256').update(template).update(JSON.stringify(assets)).digest('hex').slice(0, 16)
await writeFile('dist/client/sw.js', template.replace('__VERSION__', version).replace('__ASSETS__', JSON.stringify(assets)))
console.log(`Offline recovery: ${assets.length} assets, version ${version}`)
