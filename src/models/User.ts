interface User {
  id: string;
  username: string;
  avatar: string;
  totalScore: number;
  lastLogin: Date;
  ip?: string;
  scores: {
    [theme: string]: {
      [difficulty: string]: {
        highScore: number;
        lastScore: number;
      }
    }
  };
}

const DEFAULT_AVATARS = [
  '/flipping-card-game/images/nezha.webp',
  '/flipping-card-game/images/sunwukong.jpeg',
  // 添加更多默认头像选项
  '/flipping-card-game/images/doraemon.webp', // 哆啦A梦
  '/flipping-card-game/images/conan.jpeg', // 柯南
  '/flipping-card-game/images/pikachu.jpeg', // 皮卡丘
  '/flipping-card-game/images/xiaoxin.webp', // 蜡笔小新
  '/flipping-card-game/images/hellokitty.jpeg', // 美少女战士
  '/flipping-card-game/images/huluwa.jpeg', // 葫芦娃
  '/flipping-card-game/images/xiyangyang.webp', // 喜羊羊
  '/flipping-card-game/images/weini.jpeg', // 威尼
  '/flipping-card-game/images/tom.webp', // 汤姆猫
  '/flipping-card-game/images/jerry.webp', // 杰瑞鼠
  '/flipping-card-game/images/mickey.jpg', // 米老鼠
  '/flipping-card-game/images/donaldduck.jpg', // 唐老鸭
  '/flipping-card-game/images/aobing.jpeg', // 敖丙
  '/flipping-card-game/images/xiaobai.jpeg'  // 小白
];

export { type User, DEFAULT_AVATARS };
