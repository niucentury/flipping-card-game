import React from 'react';
import { type User } from '../models/User';
import './ShopModal.css';

interface ShopModalProps {
  user: User;
  onClose: () => void;
  onPurchase: (itemType: string, cost: number) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ user, onClose, onPurchase }) => {
  const items = [
    { 
      type: 'magicFinger', 
      name: '魔法手指', 
      price: 10, 
      description: '翻开卡片时保持透明状态',
      icon: '👆'
    },
    { 
      type: 'transparentPotion', 
      name: '透明药水', 
      price: 1, 
      description: '随机使3张未翻卡片变透明',
      icon: '🧪'
    },
    { 
      type: 'cruiseMissile', 
      name: '巡航导弹', 
      price: 1, 
      description: '自动匹配一对卡片',
      icon: '🚀'
    }
  ];

  return (
    <div className="shop-modal-overlay" onClick={onClose}>
      <div className="shop-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} hidden>×</button>
        <h2>道具商店</h2>
        <div className="coin-balance">拥有金币: <img src="/flipping-card-game/images/coin.jpeg" className="coin-image" alt="金币" /> {user.coins || 0}</div>
        
        <div className="items-list">
          {items.map(item => (
            <div key={item.type} className="shop-item">
              <div className="item-info">
                <div className="item-header">
                  <div className="item-icon">{item.icon}</div>
                  <div style={{display: 'block', width: '100%'}}>
                  <h3>{item.name}</h3>
                  <p style={{fontSize: '10px'}}>{item.description}</p>
                  <div className="item-price">拥有: {user.items[item.type] || 0} &nbsp;&nbsp; 价格: {item.price}</div>
                  </div>
                </div>
              </div>
              <button 
                className="buy-button"
                onClick={() => onPurchase(item.type, item.price)}
                disabled={(user.coins || 0) < item.price}
              >
                购买
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;