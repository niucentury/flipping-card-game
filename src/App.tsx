import React, { useState, useEffect } from 'react';
import './App.css';

const defaultThemes = [
  {
    name: '职业',
    images: [
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f468-200d-1f393.png', // 学生
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f469-200d-1f393.png', // 女学生
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f468-200d-1f3eb.png', // 教师
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f469-200d-1f3eb.png', // 女教师
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f468-200d-2695-fe0f.png', // 医生
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f469-200d-2695-fe0f.png', // 女医生
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f468-200d-1f527.png', // 工程师
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f469-200d-1f527.png', // 女工程师
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f468-200d-1f3a4.png', // 歌手
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f469-200d-1f3a4.png', // 女歌手
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f468-200d-1f373.png', // 厨师
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f469-200d-1f373.png', // 女厨师
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f468-200d-1f692.png', // 消防员
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f469-200d-1f692.png', // 女消防员
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f477.png', // 建筑工人
      'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f477-200d-2640-fe0f.png'  // 女建筑工人
    ],
    color: '#a78bfa',
  },
  {
    name: '野生动物',
    images: [
      'https://cdn-icons-png.flaticon.com/512/616/616408.png', // 猫
      'https://cdn-icons-png.flaticon.com/512/616/616430.png', // 狗
      'https://cdn-icons-png.flaticon.com/512/2226/2226907.png', // 狐狸
      'https://cdn-icons-png.flaticon.com/512/2226/2226913.png', // 熊猫
      'https://cdn-icons-png.flaticon.com/512/2226/2226923.png', // 猴子
      'https://cdn-icons-png.flaticon.com/512/2226/2226917.png', // 狮子
      'https://cdn-icons-png.flaticon.com/512/2226/2226899.png', // 大象
      'https://cdn-icons-png.flaticon.com/512/2226/2226921.png', // 兔子
      'https://cdn-icons-png.flaticon.com/512/2226/2226897.png', // 考拉
      'https://cdn-icons-png.flaticon.com/512/2226/2226911.png', // 长颈鹿
      'https://cdn-icons-png.flaticon.com/512/2226/2226915.png', // 河马
      'https://cdn-icons-png.flaticon.com/512/2226/2226925.png', // 犀牛
      'https://cdn-icons-png.flaticon.com/512/2226/2226919.png', // 斑马
      'https://cdn-icons-png.flaticon.com/512/2226/2226905.png', // 鳄鱼
      'https://cdn-icons-png.flaticon.com/512/2226/2226903.png', // 企鹅
      'https://cdn-icons-png.flaticon.com/512/2226/2226909.png'  // 老虎
    ],
    color: '#0ed2f7',
  },
  {
    name: '热带水果',
    images: [
      'https://cdn-icons-png.flaticon.com/512/415/415733.png', // 苹果
      'https://cdn-icons-png.flaticon.com/512/2909/2909653.png', // 香蕉
      'https://cdn-icons-png.flaticon.com/512/2909/2909777.png', // 樱桃
      'https://cdn-icons-png.flaticon.com/512/2909/2909757.png', // 葡萄
      'https://cdn-icons-png.flaticon.com/512/2909/2909783.png', // 橙子
      'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', // 梨
      'https://cdn-icons-png.flaticon.com/512/2909/2909781.png', // 菠萝
      'https://cdn-icons-png.flaticon.com/512/2909/2909785.png', // 西瓜
      'https://cdn-icons-png.flaticon.com/512/2909/2909749.png', // 草莓
      'https://cdn-icons-png.flaticon.com/512/2909/2909745.png', // 蓝莓
      'https://cdn-icons-png.flaticon.com/512/2909/2909747.png', // 树莓
      'https://cdn-icons-png.flaticon.com/512/2909/2909751.png', // 柠檬
      'https://cdn-icons-png.flaticon.com/512/2909/2909753.png', // 桃子
      'https://cdn-icons-png.flaticon.com/512/2909/2909755.png', // 椰子
      'https://cdn-icons-png.flaticon.com/512/2909/2909761.png', // 猕猴桃
      'https://cdn-icons-png.flaticon.com/512/2909/2909763.png'  // 芒果
    ],
    color: '#ffb347',
  },
  {
    name: '交通工具',
    images: [
      'https://cdn-icons-png.flaticon.com/512/744/744465.png', // 汽车
      'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', // 自行车
      'https://cdn-icons-png.flaticon.com/512/3473/3473785.png', // 公交车
      'https://cdn-icons-png.flaticon.com/512/1829/1829519.png', // 飞机
      'https://cdn-icons-png.flaticon.com/512/1829/1829541.png', // 轮船
      'https://cdn-icons-png.flaticon.com/512/1829/1829553.png', // 火车
      'https://cdn-icons-png.flaticon.com/512/744/744515.png', // 摩托车
      'https://cdn-icons-png.flaticon.com/512/1829/1829535.png', // 直升机
      'https://cdn-icons-png.flaticon.com/512/3473/3473459.png', // 出租车
      'https://cdn-icons-png.flaticon.com/512/3473/3473465.png', // 救护车
      'https://cdn-icons-png.flaticon.com/512/3473/3473471.png', // 消防车
      'https://cdn-icons-png.flaticon.com/512/3473/3473477.png', // 警车
      'https://cdn-icons-png.flaticon.com/512/3473/3473483.png', // 卡车
      'https://cdn-icons-png.flaticon.com/512/3473/3473489.png', // 拖拉机
      'https://cdn-icons-png.flaticon.com/512/3473/3473495.png', // 挖掘机
      'https://cdn-icons-png.flaticon.com/512/3473/3473501.png'  // 推土机
    ],
    color: '#7ed957',
  },
  {
    name: '国家旗帜',
    images: [
      'https://cdn-icons-png.flaticon.com/512/197/197374.png', // 中国
      'https://cdn-icons-png.flaticon.com/512/197/197484.png', // 美国
      'https://cdn-icons-png.flaticon.com/512/197/197604.png', // 日本
      'https://cdn-icons-png.flaticon.com/512/197/197582.png', // 韩国
      'https://cdn-icons-png.flaticon.com/512/197/197560.png', // 法国
      'https://cdn-icons-png.flaticon.com/512/197/197571.png', // 德国
      'https://cdn-icons-png.flaticon.com/512/197/197615.png', // 俄罗斯
      'https://cdn-icons-png.flaticon.com/512/197/197408.png', // 英国
      'https://cdn-icons-png.flaticon.com/512/197/197507.png', // 加拿大
      'https://cdn-icons-png.flaticon.com/512/197/197452.png', // 澳大利亚
      'https://cdn-icons-png.flaticon.com/512/197/197387.png', // 巴西
      'https://cdn-icons-png.flaticon.com/512/197/197593.png', // 印度
      'https://cdn-icons-png.flaticon.com/512/197/197375.png', // 意大利
      'https://cdn-icons-png.flaticon.com/512/197/197576.png', // 西班牙
      'https://cdn-icons-png.flaticon.com/512/197/197461.png', // 墨西哥
      'https://cdn-icons-png.flaticon.com/512/197/197608.png'  // 南非
    ],
    color: '#ff6b6b',
  },
  {
    name: '体育运动',
    images: [
      'https://cdn-icons-png.flaticon.com/512/889/889392.png', // 足球
      'https://cdn-icons-png.flaticon.com/512/889/889417.png', // 篮球
      'https://cdn-icons-png.flaticon.com/512/889/889425.png', // 排球
      'https://cdn-icons-png.flaticon.com/512/889/889435.png', // 网球
      'https://cdn-icons-png.flaticon.com/512/889/889444.png', // 棒球
      'https://cdn-icons-png.flaticon.com/512/889/889452.png', // 高尔夫
      'https://cdn-icons-png.flaticon.com/512/889/889460.png', // 游泳
      'https://cdn-icons-png.flaticon.com/512/889/889468.png', // 滑雪
      'https://cdn-icons-png.flaticon.com/512/889/889476.png', // 自行车
      'https://cdn-icons-png.flaticon.com/512/889/889484.png', // 拳击
      'https://cdn-icons-png.flaticon.com/512/889/889492.png', // 举重
      'https://cdn-icons-png.flaticon.com/512/889/889500.png', // 射击
      'https://cdn-icons-png.flaticon.com/512/3663/3663366.png', // 击剑
      'https://cdn-icons-png.flaticon.com/512/3663/3663378.png', // 体操
      'https://cdn-icons-png.flaticon.com/512/3663/3663386.png', // 柔道
      'https://cdn-icons-png.flaticon.com/512/3663/3663394.png'  // 跆拳道
    ],
    color: '#4ecdc4',
  }
];

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
}

const difficultyOptions = [
  { label: '8张', pairs: 4 },
  { label: '16张', pairs: 8 },
  { label: '32张', pairs: 16 }, // 卡牌总数为 pairs*2，即 32 张
];

function App() {
  // 配置项
  const [themeIdx, setThemeIdx] = useState(0);
  const [pairs, setPairs] = useState(difficultyOptions[1].pairs);
  const [showSettings, setShowSettings] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  // 游戏状态
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [steps, setSteps] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  // 计时器
  useEffect(() => {
    let interval: number | null = null;
    if (gameActive && matchedCount < pairs) {
      interval = window.setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [gameActive, matchedCount, pairs]);

  // 初始化卡牌
  const startGame = () => {
    // pairs 表示对数，图片数量应为 pairs，卡牌总数为 pairs*2
    const images = shuffle(defaultThemes[themeIdx].images).slice(0, pairs);
    const cardList: CardType[] = shuffle(
      images.concat(images).map((img, idx) => ({
        id: idx,
        image: img,
        flipped: false,
        matched: false,
      }))
    );
    setCards(cardList);
    setMatchedCount(0);
    setFlippedIndices([]);
    setLock(false);
    setSteps(0);
    setTimer(0);
    setGameActive(true);
    setShowSettings(false);
  };

  // 音效已禁用
  const playSound = () => {};

  // 翻牌逻辑
  const handleFlip = (idx: number) => {
    if (lock || cards[idx].flipped || cards[idx].matched) return;
    const newFlipped = [...flippedIndices, idx];
    const newCards = cards.map((card, i) =>
      i === idx ? { ...card, flipped: true } : card
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
          playSound('match');
          const updated = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, matched: true } : card
          );
          setCards(updated);
          setMatchedCount((c) => c + 1);
        } else {
          // 失败音效
          playSound('fail');
          const updated = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, flipped: false } : card
          );
          setCards(updated);
        }
        setFlippedIndices([]);
        setLock(false);
      }, 900);
    }
  };

  // 胜利音效
  useEffect(() => {
    if (matchedCount === pairs && gameActive) {
      playSound('win');
      setGameActive(false);
    }
  }, [matchedCount, pairs, gameActive]);

  const handleRestart = () => {
    setShowSettings(true);
    setGameActive(false);
    setTimer(0);
  };

  // 主题色
  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', defaultThemes[themeIdx].color);
  }, [themeIdx]);

  return (
    <div className="memory-game-container">
      {showSettings ? (
        <div className="settings-panel">
          <h1>记忆翻牌配对游戏</h1>
          <h2>游戏设置</h2>
          <div>
            <label>主题：</label>
            <select value={themeIdx} onChange={e => setThemeIdx(Number(e.target.value))}>
              {defaultThemes.map((t, i) => (
                <option value={i} key={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>难度：</label>
            <select value={pairs} onChange={e => setPairs(Number(e.target.value))}>
              {difficultyOptions.map(opt => (
                <option value={opt.pairs} key={opt.label}>{opt.label}（{opt.pairs * 2}张）</option>
              ))}
            </select>
          </div>
          <div>
            <label>音效：</label>
            <input type="checkbox" checked={soundOn} onChange={e => setSoundOn(e.target.checked)} />
            <span>{soundOn ? '开' : '关'}</span>
          </div>
          <button onClick={startGame}>开始游戏</button>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {cards.map((card, idx) => (
              <div
                key={card.id}
                className={`card${card.flipped || card.matched ? ' flipped' : ''}`}
                onClick={() => handleFlip(idx)}
              >
                <div className="card-inner">
                  <div className="card-front"></div>
                  <div className="card-back">
                    <img src={card.image} alt="card" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="game-info">
            {/* <p>已配对：{matchedCount} / {pairs}</p>
            <p>步数：{steps}，用时：{timer} 秒</p>
            {matchedCount === pairs && <p>🎉 恭喜你完成游戏！</p>}
            <button id="return" onClick={handleRestart}>返回首页</button> */}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
