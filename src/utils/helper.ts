import * as bcrypt from 'bcrypt';
import { Response } from 'express';

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

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refresh_token', refreshToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'strict',
    path: '/',
  });
};
