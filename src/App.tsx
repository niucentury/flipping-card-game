import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { getUserFromLocal, createNewUser, saveUserToLocal, getAllUsers, updateUserScore, saveUser } from './services/userService';
import { type User } from './models/User';
import UserModal from './components/UserModal';
import Leaderboard from './components/Leaderboard';
import './components/UserModal.css';
import UserProfileModal from './components/UserProfileModal';
import ShopModal from './components/ShopModal';
import './components/ShopModal.css';
import DualPlayerGame from './components/DualPlayerGame';

// 音效文件路径(使用本地音效文件)
const soundFiles = {
  flip: '', // 不使用翻牌音效
  match: '/flipping-card-game/sounds/match.mp3', // 配对成功音效
  fail: '/flipping-card-game/sounds/fail.mp3', // 配对失败音效
  win: [
    '/flipping-card-game/sounds/win1.mp3',
    '/flipping-card-game/sounds/win2.mp3'
  ]  // 随机胜利音效
};

import { defaultThemes } from './constants/themes';

function shuffle<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface CardType {
  id: number;
  image: string;
  flipped: boolean;
  matched: boolean;
  transparent?: boolean;
  bling?: boolean;
}

const difficultyOptions = [
  //{ label: '测试', pairs: 1 },
  { label: '简单', pairs: 4 },
  //{ label: '中等', pairs: 6 },
  { label: '困难', pairs: 8 },// 卡牌总数为 pairs*2，即 32 张
  { label: '地狱', pairs: 12 },
  { label: '双人', pairs: 18 },
];

function App() {
  // 用户状态
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // 金币状态
  const [coins, setCoins] = useState(currentUser?.coins || 0);
  
  // 道具商店状态
  const [showShopModal, setShowShopModal] = useState(false);
  
  // 道具价格
  const itemPrices = {
    magicFinger: 100,
    transparentPotion: 10,
    cruiseMissile: 2
  };

  const useItem = (itemType: string) => {
    // 验证道具类型和数量
    if (!['magicFinger', 'transparentPotion', 'cruiseMissile'].includes(itemType) || 
        items[itemType] <= 0 || 
        isGameOver) {
      return;
    }

    // 确保道具数量不会出现负值
    const newCount = Math.max(0, items[itemType] - 1);
    const updatedItems = {
      ...items,
      [itemType]: newCount
    };
    setItems(updatedItems);
    
    // 同步更新用户数据
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        items: updatedItems
      };
      saveUserToLocal(updatedUser);
      setCurrentUser(updatedUser); // 确保状态一致
    }

    switch(itemType) {
      case 'magicFinger':
        setItems(prevItems => {
          setIsMagicFingerActive(true);
          setIsMagicFingerUsed(true);
          return prevItems;
        });
        // 魔法手指动画效果
        const magicFingerElement = document.createElement('div');
        magicFingerElement.className = 'magic-finger-animation';
        magicFingerElement.innerHTML = '👆';
        document.body.appendChild(magicFingerElement);
        
        // 显示"魔法已生效"提示
        const magicEffectText = document.createElement('div');
        magicEffectText.className = 'magic-effect-text';
        magicEffectText.textContent = '魔法已生效';
        document.body.appendChild(magicEffectText);
        
        // 提示消失
        setTimeout(() => {
          magicFingerElement.remove();
          magicEffectText.remove();
        }, 2000);
        break;

      case 'transparentPotion':
        // 透明药水：随机3张未翻卡片变透明并添加bling效果
        const unflipped = cards.filter(c => !c.flipped && !c.matched);
        const targets = [];
        for (let i = 0; i < Math.min(3, unflipped.length); i++) {
          const randomIndex = Math.floor(Math.random() * unflipped.length);
          targets.push(unflipped[randomIndex].id);
        }
        setCards(cards.map(card => 
          targets.includes(card.id) ? {...card, transparent: true, bling: true} : card
        ));
        setTimeout(() => {
          setCards(cards.map(card => 
            targets.includes(card.id) ? {...card, transparent: true, bling: false} : card
          ));
        }, 3000); // 3秒后关闭bling效果
        break;

      case 'cruiseMissile':
        // 锁定交互
        setLock(true);
        
        // 优先处理已翻开一张卡片的情况
        const flippedCard = cards.find(c => c.flipped && !c.matched);
        if (flippedCard) {
          // 查找匹配的另一张卡片
          const matchedCard = cards.find(c => 
            !c.flipped && !c.matched && c.image === flippedCard.image && c.id !== flippedCard.id
          );
          
          if (matchedCard) {
            setFlippedIndices([]);
            // 获取道具按钮位置
            const missileButton = document.querySelector('.item-container:nth-child(3) .item-button');
            if (missileButton) {
              const buttonRect = missileButton.getBoundingClientRect();
              const startX = buttonRect.left + buttonRect.width / 2;
              const startY = buttonRect.top + buttonRect.height / 2;
              
              // 获取目标卡牌位置
              const targetCard = document.querySelector('.card:nth-of-type(' + matchedCard.id + ')');
              
              if (targetCard) {
                // 创建导弹元素
                const missile = document.createElement('div');
                missile.className = 'cruise-missile';
                missile.style.left = `${startX}px`;
                missile.style.top = `${startY}px`;
                missile.innerHTML = '🚀';
                document.body.appendChild(missile);
                const targetRect = targetCard.getBoundingClientRect();
                
                // 导弹飞行动画
                setTimeout(() => {
                  missile.style.transition = 'all 0.5s ease-out';
                  missile.style.left = `${targetRect.left + targetRect.width / 2}px`;
                  missile.style.top = `${targetRect.top + targetRect.height / 2}px`;
                  
                  // 卡牌翻开并计算分数
                  setTimeout(() => {
                    missile.remove();
                    setCards(cards.map(card => 
                      card.id === matchedCard.id || card.id === flippedCard.id
                        ? {...card, flipped: true, matched: true} 
                        : card
                    ));
                    setMatchedCount(prev => prev + 1);
                    
                    // 计算连击和分数
                    const newCombo = combo + 1;
                    setCombo(newCombo);
                    const points = newCombo > 1 ? newCombo : 1;
                    setScore(s => s + points);
                    
                    // 播放匹配音效并恢复交互
                    if (soundOn) playSound('match');
                    setLock(false);
                  }, 500);
                }, 100);
              }
            }
            return;
          }
        }
        
        // 如果没有已翻开的卡片，则自动匹配一对卡片
        const unmatched = cards.filter(c => !c.matched);
        for (let i = 0; i < unmatched.length; i++) {
          for (let j = i + 1; j < unmatched.length; j++) {
            if (unmatched[i].image === unmatched[j].image) {
              // 获取道具按钮位置
              const missileButton = document.querySelector('.item-container:nth-child(3) .item-button');
              if (missileButton) {
                const buttonRect = missileButton.getBoundingClientRect();
                const startX = buttonRect.left + buttonRect.width / 2;
                const startY = buttonRect.top + buttonRect.height / 2;
                
                // 获取目标卡牌位置
                const card1 = document.querySelector('.card:nth-of-type(' + unmatched[i].id + ')');
                const card2 = document.querySelector('.card:nth-of-type(' + unmatched[j].id + ')');
                
                if (card1 && card2) {
                  // 创建导弹元素
                  const missile = document.createElement('div');
                  missile.className = 'cruise-missile';
                  missile.style.left = `${startX}px`;
                  missile.style.top = `${startY}px`;
                  missile.innerHTML = '🚀';
                  document.body.appendChild(missile);
                  const card1Rect = card1.getBoundingClientRect();
                  const card2Rect = card2.getBoundingClientRect();
                  
                  // 导弹飞行动画
                  setTimeout(() => {
                    missile.style.transition = 'all 0.5s ease-out';
                    missile.style.left = `${card1Rect.left + card1Rect.width / 2}px`;
                    missile.style.top = `${card1Rect.top + card1Rect.height / 2}px`;
                    
                    // 第一个卡牌翻开
                    setTimeout(() => {
                      missile.remove();
                      setCards(cards.map(card => 
                        card.id === unmatched[i].id ? {...card, flipped: true} : card
                      ));
                      
                      // 创建第二个导弹
                      const missile2 = document.createElement('div');
                      missile2.className = 'cruise-missile';
                      missile2.style.left = `${startX}px`;
                      missile2.style.top = `${startY}px`;
                      missile2.innerHTML = '🚀';
                      document.body.appendChild(missile2);
                      
                      // 第二个导弹飞行动画
                      setTimeout(() => {
                        missile2.style.transition = 'all 0.5s ease-out';
                        missile2.style.left = `${card2Rect.left + card2Rect.width / 2}px`;
                        missile2.style.top = `${card2Rect.top + card2Rect.height / 2}px`;
                        
                        // 第二个卡牌翻开并计算分数
                        setTimeout(() => {
                          missile2.remove();
                          setCards(cards.map(card => 
                            card.id === unmatched[i].id || card.id === unmatched[j].id 
                              ? {...card, flipped: true, matched: true} 
                              : card
                          ));
                          setMatchedCount(prev => prev + 1);
                          
                          // 计算连击和分数
                          const newCombo = combo + 1;
                          setCombo(newCombo);
                          const points = newCombo > 1 ? newCombo : 1;
                          setScore(s => s + points);
                          
                          // 播放匹配音效并恢复交互
                          if (soundOn) playSound('match');
                          setLock(false);
                        }, 500);
                      }, 100);
                    }, 500);
                  }, 100);
                }
              }
              return;
            }
          }
        }
        // 如果没有找到匹配对，也恢复交互
        setLock(false);
        break;
    }
  };
  // 用户初始化
  const initUser = () => {
    const user = getUserFromLocal();
    if (!user) {
      const newUser = createNewUser();
      setCurrentUser(newUser);
      setItems(newUser.items);
      setShowUserModal(true);
    } else {
      if (user.items === undefined) {
          user.items = {
            magicFinger: 100,
            transparentPotion: 100,
            cruiseMissile: 100
          };
          saveUserToLocal(user);
      }
      setCurrentUser(user);
      setItems(user.items);
    }
  };

  // 初始化用户信息
  useEffect(() => {
    const initialize = async () => {
      initUser();
      try {
        //const users = await getAllUsers();
        //setLeaderboard(users);
      } catch (error) {
        console.error('初始化排行榜失败:', error);
      }
    };
    
    initialize();
  }, []);

  // 配置项
  const [themeIdx, setThemeIdx] = useState(0);
  const [pairs, setPairs] = useState(difficultyOptions[0].pairs);
  const [showSettings, setShowSettings] = useState(true);
  const [showSinglePlayerGame, setSinglePlayerGame] = useState(false);
  const [showDualPlayerGame, setShowDualPlayerGame] = useState(false);
  const [showCoin, setShowCoin] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // 游戏状态
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [steps, setSteps] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [items, setItems] = useState<{
    magicFinger: number;
    transparentPotion: number;
    cruiseMissile: number;
  }>(currentUser?.items || {
    magicFinger: 100,
    transparentPotion: 100,
    cruiseMissile: 100
  });
  const [isMagicFingerActive, setIsMagicFingerActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMagicFingerUsed, setIsMagicFingerUsed] = useState(false);
  const [isGamePaused, setGamePaused] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(difficultyOptions[0]);

  // 计时器
  useEffect(() => {
    let interval: number | null = null;
    if (gameActive && matchedCount < pairs && !isGamePaused) {
      interval = window.setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [gameActive, matchedCount, pairs, isGamePaused]);

  const startGame = () => {
    setShowSettings(false);
    if (difficultySelected.label === '双人') {
      setShowCoin(false);
      setShowDualPlayerGame(true);
    } else {
      setShowCoin(true);
      // 初始化卡牌
      // pairs 表示对数，图片数量应为 pairs，卡牌总数为 pairs*2
      const images = shuffle(defaultThemes[themeIdx].images).slice(0, pairs);
      const cardList: CardType[] = shuffle(
        images.concat(images).map((img, idx) => ({
          id: 0,
          image: img,
          flipped: false,
          matched: false
        }))
      ).map((card, idx) => ({...card, id: idx + 1}));
      setCards(cardList);
      setMatchedCount(0);
      setFlippedIndices([]);
      setLock(false);
      setGameActive(true);
      setSteps(0);
      setTimer(0);
      setScore(0); // 重置分数
      setCombo(0); // 重置连击
      setIsMagicFingerActive(false); // 重置魔法手指状态
      setIsGameOver(false); // 重置游戏结束状态
      setIsMagicFingerUsed(false); // 重置魔法手指使用状态
      setSinglePlayerGame(true);
    }
  };

  // 播放音效函数(带错误处理和音量控制)
  const playSound = (type: 'flip' | 'match' | 'fail' | 'win') => {
    try {
      const sound = type === 'win' 
        ? soundFiles.win[Math.floor(Math.random() * soundFiles.win.length)]
        : soundFiles[type];
      const audio = new Audio(sound);
      audio.preload = 'auto';
      // 设置不同音效的音量
      if (type === 'fail') {
        audio.volume = 1; // 调高失败音效音量
      } else {
        audio.volume = 0.2; // 默认音量
      }
      audio.play().catch(e => console.error(`播放${type}音效失败:`, e));
    } catch (e) {
      console.error(`初始化${type}音效失败:`, e);
    }
  };


  // 翻牌逻辑
  const handleFlip = (idx: number) => {
    if (lock || cards[idx].flipped || cards[idx].matched || isGamePaused) return;
    const newFlipped = [...flippedIndices, idx];
    const newCards = cards.map((card, i) =>
      i === idx ? { 
        ...card, 
        flipped: true,
        transparent: isMagicFingerActive // 如果魔法手指激活则新翻牌变透明
      } : card
    );
    setCards(newCards);
    setFlippedIndices(newFlipped);
    
    if (newFlipped.length === 2) {
      setLock(true);
      setSteps((s) => s + 1);
      setTimeout(() => {
        const [i1, i2] = newFlipped;
        if (newCards[i1].image === newCards[i2].image) {
          // 配对成功
          if (soundOn) playSound('match');
          const updated = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, matched: true } : card
          );
          setCards(updated);
          setMatchedCount((c) => c + 1);
          
          // 计分逻辑
          const newCombo = combo + 1;
          setCombo(newCombo);
          const points = newCombo > 1 ? newCombo : 1;
          setScore(s => {
            const newScore = s + points;
            console.log(`得分更新: +${points} (连击: ${newCombo}), 总分: ${newScore}`);
            return newScore;
          });
        } else {
          // 配对失败
          if (soundOn) playSound('fail');
          const updated = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, flipped: false,
              transparent: isMagicFingerActive } : card
          );
          setCards(updated);
          setCombo(0); // 重置连击
        }
        setFlippedIndices([]);
        setLock(false);
      }, 900);
    }
  };

  // 胜利音效和金币计算
  const winEffect = () => {
    if (matchedCount === pairs && gameActive) {
      playSound('win');
      setGameActive(false);
      setIsGameOver(true);
      
      // 创建从中间放出的礼花效果
      const colors = ['#ff6b6b', '#4ecdc4', '#a78bfa', '#ff9ff3', '#7ed957'];
      const container = document.createElement('div');
      container.className = 'confetti-effect';
      
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.setProperty('--random-x', `${Math.random() * 2 - 1}`);
        confetti.style.setProperty('--random-y', `${Math.random() * 2 - 1}`);
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = confetti.style.width;
        confetti.style.animationDuration = `${Math.random() * 4 + 4}s`;
        confetti.style.animationDelay = `${Math.random()}s`;
        const randomChars = ['★', '你', '真', '棒'];
        confetti.innerHTML = randomChars[Math.floor(Math.random() * randomChars.length)];
        container.appendChild(confetti);
      }
      
      document.body.appendChild(container);
      setTimeout(() => {
        document.body.removeChild(container);
      }, 5000);

      // 保存用户分数和计算金币
      if (currentUser) {
        const difficultyLabel = difficultyOptions.find(o => o.pairs === pairs)?.label || '';
        const currentTheme = defaultThemes[themeIdx]?.name || '';
        
        if (!currentTheme) {
          console.error('无效的主题索引:', themeIdx);
          return;
        }

        // 计算金币奖励
        let coinsEarned = 0;
        if (difficultyLabel === '简单') {
          coinsEarned = Math.floor(score / 5);
        } else if (difficultyLabel === '困难' || difficultyLabel === '地狱') {
          coinsEarned = Math.floor(score / 10);
        }
        
        const updateAndRefresh = async () => {
          try {
            const updatedUser = {
              ...await updateUserScore(
                currentUser,
                currentTheme,
                difficultyLabel,
                score
              ),
              coins: (currentUser.coins || 0) + coinsEarned
            };
            await saveUser(updatedUser);
            setCurrentUser(updatedUser);
            
            // 显示金币获得提示
            if (coinsEarned > 0) {
              // 创建金币获得通知
              const coinNotification = document.createElement('div');
              coinNotification.className = 'coin-notification';
              coinNotification.innerHTML = `
                <div class="coin-animation-container">
                  <div class="coin-text">+${coinsEarned}</div>
                  ${Array(coinsEarned).fill('<img src="/flipping-card-game/images/coin.jpeg" class="coin-animation" alt="金币" />').join('')}
                </div>
              `;
              document.body.appendChild(coinNotification);
              
              // 金币飞入动画
              setTimeout(() => {
                coinNotification.classList.add('animate');
                setTimeout(() => {
                  coinNotification.remove();
                }, 1000);
              }, 100);
            }
            
            //const users = await getAllUsers();
            //setLeaderboard(users);
          } catch (error) {
            console.error('保存分数失败:', error);
          }
        };
        
        updateAndRefresh();
      }
    }
  };
  useEffect(winEffect, [matchedCount, pairs, gameActive]);

  // 主题色
  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', defaultThemes[themeIdx].color);
  }, [themeIdx]);

  const handleRestart = () => {
    startGame();
  };

  // 用户保存函数
  const handleSaveUser = (user: User) => {
    saveUserToLocal(user);
    setCurrentUser(user);
    setShowUserModal(false);
  };

  // 购买道具函数
  const buyItem = (itemType: string) => {
    const price = itemPrices[itemType];
    if (coins >= price) {
      setCoins(coins - price);
      setItems({
        ...items,
        [itemType]: items[itemType] + 1
      });
      
      if (currentUser) {
        saveUserToLocal({
          ...currentUser,
          coins: coins - price,
          items: {
            ...items,
            [itemType]: items[itemType] + 1
          }
        });
      }
    }
  };

  return (
    <div className="memory-game-container">
      {showCoin && (<div 
        className="coin-display user-profile-button" 
        onClick={() => setShowShopModal(true)}
        title={`当前金币: ${currentUser?.coins || 0}`}
      >
        <img src="/flipping-card-game/images/coin.jpeg" className="coin-image" alt="金币" />
        <span className="coin-amount">{currentUser?.coins || 0}</span>
      </div>)}
      {showSettings && (
        <div className="settings-panel">
      <button 
        className="user-profile-button"
        onClick={() => setShowUserModal(true)}
      >
        {currentUser && (
          <>
            <img src={currentUser.avatar} alt="用户头像" />
            <span>{currentUser.username}</span>
          </>
        )}
      </button>
      {showUserModal && currentUser && (
        <UserProfileModal 
          user={currentUser}
          onEdit={() => {
            setShowUserModal(false);
            setShowEditModal(true);
          }}
          onClose={() => setShowUserModal(false)}
        />
      )}
      {showEditModal && currentUser && (
        <UserModal
          initialUser={currentUser}
          onSave={(updatedUser) => {
            handleSaveUser(updatedUser);
            setShowEditModal(false);
          }}
          onCancel={() => {
            setShowEditModal(false);
            setShowUserModal(false);
          }}
        />
      )}
          <h1>记忆翻牌配对</h1>
          
          <div className="theme-selection">
            <h3 hidden>选择主题</h3>
            <div className="theme-options" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginTop: '15px'
            }}>
              {defaultThemes.map((theme, index) => (
                <div 
                  key={theme.name}
                  className={`theme-option ${themeIdx === index ? 'selected' : ''}`}
                  onClick={() => setThemeIdx(index)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >{theme.isText ? (
                      <div className="text-card" style={{width: '50px', height: '50px',fontSize: '2rem',fontWeight: 'bold',color: 'black', margin: '0 0 8px'}}>{theme.images[0]}</div>
                    ) : (
                    <img src={theme.images[0]} alt={theme.name} style={{width: '50px', height: '50px'}} />
                    )}
                  <span style={{marginTop: '5px', fontSize: '12px'}}>{theme.name}</span>
                  {themeIdx === index && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="difficulty-selection">
            <h3>选择模式</h3>
            <div className="difficulty-options">
              {difficultyOptions.map((option) => (
                <div 
                  key={option.label}
                  className={`difficulty-option ${pairs === option.pairs ? 'selected' : ''}`}
                  onClick={() => {
                    setPairs(option.pairs);
                    setDifficultySelected(option);
                  }}>
                  <span style={{marginTop: '5px', fontSize: '14px', fontWeight: '500'}}>{option.label}</span>
                  {pairs === option.pairs && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <button className="start-button" onClick={startGame}>开始游戏</button>
        </div>
      )}
      {showSinglePlayerGame && (
        <>
          <div className="card-grid">
            {cards.map((card, idx) => (
              <div
                key={card.id}
                className={`card${card.flipped || card.matched ? ' flipped' : ''}${card.transparent ? ' transparent' : ''}${pairs === 12 ? ' hell-difficulty' : ''}`}
                onClick={() => handleFlip(idx)}
              >
                <div className="card-inner">
                  <div className={`card-front${card.bling && card.transparent ? ' bling' : ''}`}>
                    {defaultThemes[themeIdx].isText ? (
                      <div className="text-card front">{card.image}</div>
                    ) : (
                    <img src={card.image} alt="card" className="front"/>
                    )}
                  </div>
                  <div className="card-back">
                    {defaultThemes[themeIdx].isText ? (
                      <div className="text-card">{card.image}</div>
                    ) : (
                    <img src={card.image} alt="card" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="game-header">
            <button 
              className="pause-button"
              onClick={() => {
                console.log('Pause button clicked');
                setGamePaused(true);
              }}
              disabled={isGameOver}
              style={{zIndex: 100}}
            >
              ⏸
            </button>
            <div className="artistic-score-display">
              <div className="score-item">
                <span className="score-label">分数</span>
                <span className="score-value">{score}</span>
              </div>
              <div className="score-item">
                <span className="score-label">连击</span>
                <span className="score-value">{combo}</span>
              </div>
            </div>
            <button hidden
              className="leaderboard-button"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              {showLeaderboard ? '隐藏排行榜' : '查看排行榜'}
            </button>
          </div>
          
          <div className="item-panel">
            <div className="item-container">
              <button 
                className="item-button"
                onClick={() => useItem('magicFinger')}
                disabled={items.magicFinger <= 0 || isMagicFingerUsed || isGameOver}
              >
                <div className="item-icon">👆</div>
                <div className="item-name">魔法手指</div>
                <div className="item-count">{items.magicFinger}</div>
              </button>
            </div>
            <div className="item-container">
              <button 
                className="item-button"
                onClick={() => useItem('transparentPotion')}
                disabled={items.transparentPotion <= 0 || isGameOver}
              >
                <div className="item-icon">🧪</div>
                <div className="item-name">透明药水</div>
                <div className="item-count">{items.transparentPotion}</div>
              </button>
            </div>
            <div className="item-container">
              <button 
                className="item-button"
                onClick={() => useItem('cruiseMissile')}
                disabled={items.cruiseMissile <= 0 || isGameOver || lock}
              >
                <div className="item-icon">🚀</div>
                <div className="item-name">巡航导弹</div>
                <div className="item-count">{items.cruiseMissile}</div>
              </button>
            </div>
          </div>

          {isGamePaused && (
            <div className="pause-modal">
              <div className="pause-modal-content">
                <h2>游戏已暂停</h2>
                <button 
                  className="pause-modal-button"
                  onClick={() => setGamePaused(false)}
                >
                  继续游戏
                </button>
                <button 
                  className="pause-modal-button"
                  onClick={() => {
                    setGamePaused(false);
                    setShowSettings(true);
                    setSinglePlayerGame(false);
                    setShowDualPlayerGame(false);
                    setShowCoin(true);
                  }}
                >
                  返回首页
                </button>
              </div>
            </div>
          )}
          {showLeaderboard && (
              <Leaderboard 
                users={leaderboard}
                theme={defaultThemes[themeIdx].name}
                difficulty={difficultyOptions.find(o => o.pairs === pairs)?.label}
              />
            )}
          <div className="game-info">
            {matchedCount === pairs && (
              <>
                <div className="confetti-effect"></div>
                <div className="game-buttons">
                  <button className="restart-button" onClick={startGame}>重新开始</button>
                  <button className="home-button" onClick={() => {setShowSettings(true);setSinglePlayerGame(false);}}>返回首页</button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* 道具商店Modal */}
      {showShopModal && (
        <ShopModal
          user={currentUser}
          onPurchase={(itemType, cost) => {
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                coins: (currentUser.coins || 0) - cost,
                items: {
                  ...currentUser.items,
                  [itemType]: (currentUser.items[itemType] || 0) + 1
                }
              };
              saveUserToLocal(updatedUser);
              setCurrentUser(updatedUser);
              setItems(updatedUser.items); // 同步更新道具状态
            }
          }}
          onClose={() => {
            setShowShopModal(false);
          }}
        />
      )}

      {showDualPlayerGame && (
        <DualPlayerGame
          themeIdx={themeIdx}
          player1="小麦"
          player2="小麦爸爸"
          onExit={() => {
            setGamePaused(false);
            setShowSettings(true);
            setShowDualPlayerGame(false);
            setShowCoin(true);
          }}
        />
      )}
    </div>
  );
}

export default App;