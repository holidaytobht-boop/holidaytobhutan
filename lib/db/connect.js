import mongoose from 'mongoose'
import { config } from '@/lib/db/env.js'

const globalForMongoose = globalThis
const RETRY_COOLDOWN_MS = 60000
const CONNECT_TIMEOUT_MS = 5000

if (!globalForMongoose._mongooseState) {
  globalForMongoose._mongooseState = {
    connected: false,
    connectPromise: null,
    lastFailedAt: null,
  }
}

const state = globalForMongoose._mongooseState

function logAtlasHint(message) {
  if (/whitelist|IP that isn't|network/i.test(message)) {
    console.warn(
      '💡  MongoDB Atlas: Network Access → Add IP Address → include your current public IP (or 0.0.0.0/0 for dev).'
    )
  }
}

export const connectDB = async () => {
  if (!config.mongoUri) {
    if (!state.lastFailedAt) {
      console.warn('⚠️  MONGODB_URI is not set. Using local file data store.')
      state.lastFailedAt = Date.now()
    }
    return null
  }

  if (config.mongoUri.includes('<db_username>') || config.mongoUri.includes('<db_password>')) {
    if (!state.lastFailedAt) {
      console.warn('⚠️  MONGODB_URI still contains placeholder credentials. Using local file data store.')
      state.lastFailedAt = Date.now()
    }
    return null
  }

  if (mongoose.connection.readyState === 1) {
    state.connected = true
    state.lastFailedAt = null
    return mongoose.connection
  }

  if (state.connectPromise) {
    return state.connectPromise
  }

  const now = Date.now()
  if (state.lastFailedAt && now - state.lastFailedAt < RETRY_COOLDOWN_MS) {
    return null
  }

  state.connectPromise = (async () => {
    try {
      mongoose.set('strictQuery', true)
      const conn = await mongoose.connect(config.mongoUri, {
        dbName: config.dbName,
        serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
        connectTimeoutMS: CONNECT_TIMEOUT_MS,
        socketTimeoutMS: 45000,
      })
      state.connected = true
      state.lastFailedAt = null
      console.log('✅  Database connected successfully with MongoDB')
      console.log(`🍃  Host: ${conn.connection.host} | Database: ${conn.connection.name}`)
      return conn
    } catch (err) {
      state.connected = false
      state.lastFailedAt = Date.now()
      console.error(`❌  MongoDB connection error: ${err.message}`)
      console.warn('⚠️  Falling back to local file store until MongoDB is reachable.')
      logAtlasHint(err.message)
      try {
        await mongoose.disconnect()
      } catch {
        // ignore cleanup errors
      }
      return null
    } finally {
      state.connectPromise = null
    }
  })()

  return state.connectPromise
}

export const isDbConnected = () => state.connected && mongoose.connection.readyState === 1
