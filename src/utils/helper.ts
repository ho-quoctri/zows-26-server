import * as bcrypt from 'bcrypt';

export const hashPasswordHelper = async (plainPassword: string): Promise<string | null> => {
  try {
    const saltOrRounds = 10; // Độ mạnh của việc băm, có thể điều chỉnh
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    console.log('Error hashing password:', error)
    return null
  }
}

export const comparePasswordHelper = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.log('Error comparing password:', error)
    return false
  }
}