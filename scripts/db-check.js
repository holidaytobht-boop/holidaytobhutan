const fs = require('fs')
const mongoose = require('mongoose')

function loadEnv() {
  const files = ['.env.local', '.env']
  for (const file of files) {
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (!line || line.startsWith('#') || !line.includes('=')) continue
      const index = line.indexOf('=')
      const key = line.slice(0, index).trim()
      const value = line.slice(index + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  }
}

loadEnv()

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME || 'holidaytobhutan'

if (!uri) {
  console.error('MONGODB_URI is not set. Add it to .env or .env.local')
  process.exit(1)
}

mongoose
  .connect(uri, { dbName, serverSelectionTimeoutMS: 10000 })
  .then((conn) => {
    console.log('OK Connected to MongoDB')
    console.log(`   Host: ${conn.connection.host}`)
    console.log(`   Database: ${conn.connection.name}`)
    return mongoose.disconnect()
  })
  .catch(async (err) => {
    console.error('FAIL', err.message)
    if (/whitelist|IP that isn't|network|ReplicaSetNoPrimary/i.test(err.message)) {
      console.error('')
      console.error('Atlas fix: MongoDB Atlas -> Network Access -> Add IP Address')
      try {
        const ip = await fetch('https://api.ipify.org').then((r) => r.text())
        console.error(`Your current public IP appears to be: ${ip}`)
        console.error('Add this IP in Atlas, wait 1-2 minutes, then restart the dev server.')
      } catch {
        // ignore
      }
    }
    process.exit(1)
  })
