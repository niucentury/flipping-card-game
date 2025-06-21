import React, { useState, useEffect } from 'react';
import './DualPlayerGame.css';
import { defaultThemes } from '../constants/themes';

interface Player {
  name: string;
  score: number;
  isActive: boolean;
}

interface Card {
  id: number;
  image: string;
  flipped: boolean;
  matched: boolean;
}

const DualPlayerGame: React.FC<{ 
  themeIdx: number;
  player1: string;
  player2: string;
  onExit: () => void;
}> = ({ themeIdx, player1, player2, onExit }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { name: player1, score: 0, isActive: true },
    { name: player2, score: 0, isActive: false }
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [isGamePaused, setGamePaused] = useState(false);

  // 初始化卡牌
  useEffect(() => {
    const images = shuffle(defaultThemes[themeIdx].images).slice(0, 18); // 6x6需要18对图片
    const cardList = [...images, ...images]
      .map((img, idx) => ({ id: idx, image: img, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(cardList);
  }, [themeIdx]);

  // 洗牌函数
  const shuffle = (array: any[]) => {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // 翻牌逻辑
  const handleFlip = (idx: number) => {
    if (flippedIndices.length >= 2 || cards[idx].flipped || cards[idx].matched) return;

    const newFlipped = [...flippedIndices, idx];
    const newCards = cards.map((card, i) => 
      i === idx ? { ...card, flipped: true } : card
    );
    
    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setTimeout(() => {
        const [i1, i2] = newFlipped;
        const activePlayerIndex = players.findIndex(p => p.isActive);
        
        if (newCards[i1].image === newCards[i2].image) {
          // 配对成功
          playSound('match');
          const updatedCards = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, matched: true } : card
          );
          setCards(updatedCards);
          
          // 当前玩家得分
          const updatedPlayers = [...players];
          updatedPlayers[activePlayerIndex].score += 1;
          setPlayers(updatedPlayers);
          
          // 检查游戏是否结束
          if (updatedCards.every(card => card.matched)) {
            endGame(updatedPlayers);
          }
        } else {
          // 配对失败
          playSound('fail');
          const updatedCards = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, flipped: false } : card
          );
          setCards(updatedCards);
          
          // 切换玩家
          const updatedPlayers = players.map((player, i) => ({
            ...player,
            isActive: i !== activePlayerIndex
          }));
          setPlayers(updatedPlayers);
        }
        
        setFlippedIndices([]);
      }, 1000);
    }
  };

  const playSound = (type: 'match' | 'fail') => {
    const soundFiles = {
      match: '/flipping-card-game/sounds/match.mp3',
      fail: '/flipping-card-game/sounds/fail.mp3'
    };
    const audio = new Audio(soundFiles[type]);
    audio.play().catch(e => console.error(`播放${type}音效失败:`, e));
  };

  const endGame = (finalPlayers: Player[]) => {
    setGameOver(true);
    const [p1, p2] = finalPlayers;
    setWinner(p1.score > p2.score ? p1.name : p2.score > p1.score ? p2.name : '平局');
  };

  return (
    <div className="dual-player-container">
      <div className="game-header">
      {players.map((player, index) => (
        <div 
          key={index} 
          className={`player-info ${player.isActive ? 'active' : ''}`}
        >
          <div className={`player-name-${index}`}>{player.name}</div>
          <div className={`player-score-${index}`}>得分: {player.score}</div>
          {player.isActive && <div className={`player-turn-indicator-${index}`}>轮到我了</div>}
        </div>
      ))}
      </div>
        <button 
          className="pause-button"
          onClick={() => {
            console.log('Pause button clicked');
            setGamePaused(true);
          }}
          style={{zIndex: 1001, right: '0px', marginTop: '-30px'}}
        >
          ⏸
        </button>


      <div className="dual-card-grid">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
            onClick={() => handleFlip(idx)}
          >
            <div className="card-inner">
              <div className="card-front">
              </div>
              <div className="card-back">
                {defaultThemes[themeIdx].isText ? (
                  <div className="text-card">{card.image}</div>
                ) : (
                <img src={card.image} alt="card" />
              )}</div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="dual-game-over">
          <h2>游戏结束!</h2>
          <p>{winner === '平局' ? '平局!' : `获胜者: ${winner}`}</p>
          <button onClick={onExit}>返回</button>
        </div>
      )}
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
              onClick={onExit}
            >
              返回首页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualPlayerGame;