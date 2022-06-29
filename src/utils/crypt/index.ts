import bcrypt from 'bcrypt'
import logger from '../logger'

export async function createHash(data: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10)
    const encryptedData = await bcrypt.hash(data, salt)
    
    return encryptedData
  } catch (error) {
    logger.error('Error encrypting data', error)
  }

  return ""
}

export async function validateHash(data: string, hash: string): Promise<boolean> {
  try {
    const validateHash = await bcrypt.compare(data, hash)

    return validateHash
  } catch (error) {
    logger.error('Error encrypting data', error)
  }

  return false
}