import React from 'react';
import { type User } from '../models/User';

interface LeaderboardProps {
  users: User[];
  theme?: string;
  difficulty?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, theme, difficulty }) => {
  const getScores = () => {
    if (import.meta.env.MODE === 'development') {
      console.log('[Leaderboard] 获取排行榜数据', { 
        theme, 
        difficulty, 
        usersCount: users.length 
      });
    }
    if (theme && difficulty) {
      // 特定主题和难度的排行榜
      return users
        .filter(user => {
          const hasScore = user.scores?.[theme]?.[difficulty];
          if (import.meta.env.MODE === 'development' && !hasScore) {
            console.log('[Leaderboard] 用户无对应分数', {
              username: user.username,
              theme,
              difficulty
            });
          }
          return hasScore;
        })
        .map(user => ({
          username: user.username,
          avatar: user.avatar,
          score: user.scores[theme][difficulty].highScore
        }))
        .sort((a, b) => b.score - a.score);
    } else {
      // 全局排行榜
      return users
        .map(user => ({
          username: user.username,
          avatar: user.avatar,
          score: user.totalScore
        }))
        .sort((a, b) => b.score - a.score);
    }
  };

  const scores = getScores();

  if (import.meta.env.MODE === 'development') {
    console.log('[Leaderboard] 排行榜数据结果', {
      scores,
      filteredCount: scores.length,
      topScore: scores[0]?.score || 0
    });
  }

  return (
    <div className="leaderboard">
      <h3>{theme && difficulty ? `${theme} - ${difficulty}排行榜` : '全局排行榜'}</h3>
      <div className="leaderboard-list">
        {scores.slice(0, 10).map((item, index) => (
          <div key={index} className="leaderboard-item">
            <span className="rank">{index + 1}</span>
            <img src={item.avatar} alt="用户头像" className="avatar" />
            <span className="username">{item.username}</span>
            <span className="score">{item.score}分</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
