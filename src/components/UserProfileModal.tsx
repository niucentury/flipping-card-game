import React, { useEffect, useState } from 'react';
import { type User } from '../models/User';
import './UserModal.css';

const getUserFromLocal = (): User | null => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

interface UserProfileModalProps {
  user: User;
  onEdit: () => void;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user: propUser, onEdit, onClose }) => {
  const [user, setUser] = useState<User>(propUser);
  
  useEffect(() => {
    const localUser = getUserFromLocal();
    if (localUser) {
      setUser(localUser);
    }
  }, []);
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={e => e.stopPropagation()}>
        <div className="user-info">
          <img src={user.avatar} alt="用户头像" className="user-avatar" />
          <div className="username">{user.username}</div>
          <button 
            className="edit-button"
            onClick={handleEdit}
            onMouseDown={e => e.stopPropagation()} style={{marginTop: '0px'}}
          >
            修改个人信息
          </button>
        </div>
        <h2 hidden>分数榜</h2>
        
        {(() => {
          const allDifficulties = ["简单", "困难", "地狱"];
          return allDifficulties.map(difficulty => {
            var themes = user.scores[difficulty];
            var scoresByDifficulty = [];
            for (const theme in themes) {
              const score = themes[theme];
              scoresByDifficulty.push({ theme, score: score.highScore });
            }
            scoresByDifficulty.sort((a, b) => b.score - a.score);
            scoresByDifficulty = scoresByDifficulty.slice(0, 3);
            
            return (
              <div key={difficulty} className="score-board">
                <h3 className="difficulty-title">分数榜-{difficulty}</h3>
                {scoresByDifficulty.length > 0 ? (
                  <>
                    {scoresByDifficulty.map(({theme, score, lastScore}) => (
                      <div key={`${theme}-${difficulty}`} className="score-item">
                        <span>{theme}</span>
                        <span>{score}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="score-item">暂无分数记录</div>
                )}
              </div>
            );
          });
        })()}
        <div className="button-group">
          <button 
            className="close-button"
            onClick={handleClose}
            onMouseDown={e => e.stopPropagation()} hidden
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;