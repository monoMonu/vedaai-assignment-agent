import mongoose from 'mongoose'
import { MONGODB_URL } from '../config'

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL || '')
    console.log("Connected to mongodb successfully!")
  } catch (error) {
    console.log('Error connecting mongodb. Error: ', error)
  }
}

export default connectDB;