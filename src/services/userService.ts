import { type User, DEFAULT_AVATARS } from '../models/User';
import { 
  getAllUsersFromServer,
  saveUserToServer,
  updateUserScoreOnServer
} from './apiService';

// 获取当前用户(暂时保留本地缓存)
const getUserFromLocal = (): User | null => {
  const userStr = localStorage.getItem('flipping_card_user');
  return userStr ? JSON.parse(userStr) : null;
};

// 创建新用户
const createNewUser = (ip?: string): User => ({
  id: Math.random().toString(36).substring(2, 9),
  username: `玩家${Math.floor(Math.random() * 1000)}`,
  avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
  totalScore: 0,
  lastLogin: new Date(),
  ip,
  scores: {},
  items: {
    magicFinger: 100,
    transparentPotion: 100,
    cruiseMissile: 100
  }
});

// 更新用户分数(同步到服务端)
const updateUserScore = async (user: User, theme: string, difficulty: string, score: number): Promise<User> => {
  if (!theme || !difficulty || typeof score !== 'number') {
    console.error('无效的参数:', {theme, difficulty, score});
    return user;
  }

  // 本地更新
  const updatedUser = { 
    ...user,
    scores: user.scores || {}
  };
  
  updatedUser.totalScore = (updatedUser.totalScore || 0) + score;
  
  if (!updatedUser.scores[theme]) {
    updatedUser.scores[theme] = {};
  }
  
  updatedUser.scores[theme][difficulty] = {
    highScore: Math.max(score, updatedUser.scores[theme][difficulty]?.highScore || 0),
    lastScore: score
  };

  // 同步到服务端
  /*const serverUser = await updateUserScoreOnServer(
    updatedUser.id,
    theme,
    difficulty,
    score
  );*/
  
  return updatedUser;
};

// 获取所有用户(从服务端获取)
const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await getAllUsersFromServer();
    return users.sort((a, b) => b.totalScore - a.totalScore);
  } catch (error) {
    console.error('获取排行榜数据失败:', error);
    return [];
  }
};

// 仅保存用户到本地
const saveUserToLocal = (user: User): void => {
  localStorage.setItem('flipping_card_user', JSON.stringify(user));
};

// 保存用户(同步到服务端)
const saveUser = async (user: User): Promise<User> => {
  // 本地缓存
  saveUserToLocal(user);
  return user;
  
  // 同步到服务端
  /*try {
    const serverUser = await saveUserToServer(user);
    if (!serverUser) {
      throw new Error('服务端保存用户失败');
    }
    return serverUser;
  } catch (error) {
    console.error('保存用户到服务端失败:', error);
    // 回退到本地模式
    return user;
  }*/
};

export { 
  getUserFromLocal,
  createNewUser,
  updateUserScore,
  getAllUsers,
  saveUser,
  saveUserToLocal
};
