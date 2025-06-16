import React from 'react';
import { type User } from '../models/User';
import './UserModal.css';

interface UserProfileModalProps {
  user: User;
  onEdit: () => void;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onEdit, onClose }) => {
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
        <h2>个人信息</h2>
        <div className="user-info">
          <img src={user.avatar} alt="用户头像" className="user-avatar" />
          <div className="username">{user.username}</div>
        </div>
        <div className="button-group">
          <button 
            className="edit-button"
            onClick={handleEdit}
            onMouseDown={e => e.stopPropagation()}
          >
            修改个人信息
          </button>&nbsp;
          <button 
            className="close-button"
            onClick={handleClose}
            onMouseDown={e => e.stopPropagation()}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;