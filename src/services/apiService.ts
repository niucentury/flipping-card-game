import { type User } from '../models/User';

const API_BASE_URL = 'http://localhost:3000/api';

// 获取所有用户数据
export const getAllUsersFromServer = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('获取用户数据失败');
    return await response.json();
  } catch (error) {
    console.error('获取用户数据出错:', error);
    return [];
  }
};

// 保存用户数据
export const saveUserToServer = async (user: User): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.user)
    });
    if (!response.ok) throw new Error('保存用户数据失败');
    return await response.json();
  } catch (error) {
    console.error('保存用户数据出错:', error);
    return null;
  }
};

// 更新用户分数
export const updateUserScoreOnServer = async (
  userId: string, 
  theme: string, 
  difficulty: string, 
  score: number
): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/score`, {
      method: 'PATCH',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme, difficulty, score })
    });
    if (!response.ok) throw new Error('更新分数失败');
    return await response.json();
  } catch (error) {
    console.error('更新分数出错:', error);
    return null;
  }
};
