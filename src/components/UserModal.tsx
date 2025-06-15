import React, { useState } from 'react';
import { type User, DEFAULT_AVATARS } from '../models/User';
import { saveUser } from '../services/userService';

interface UserModalProps {
  initialUser?: User;
  onSave: (user: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({ initialUser, onSave }) => {
  const [username, setUsername] = useState(initialUser?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(initialUser?.avatar || DEFAULT_AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUser({
      ...(initialUser || {}),
      username: username.trim() || `玩家${Math.floor(Math.random() * 1000)}`,
      avatar: selectedAvatar,
      lastLogin: new Date()
    } as User).then(savedUser => {
      onSave(savedUser);
    }).catch(error => {
      console.error('保存用户失败:', error);
      alert('保存用户信息失败，请检查网络连接或稍后再试');
    });
  };

  return (
    <div className="modal-overlay">
      <div className="user-modal">
        <h2>设置您的个人信息</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入您的游戏昵称"
            />
          </div>
          
          <div className="form-group">
            <label>选择头像</label>
            <div className="avatar-grid">
              {DEFAULT_AVATARS.map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                  alt="头像选项"
                />
              ))}
            </div>
          </div>

          <button type="submit" className="save-button">
            保存信息
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
