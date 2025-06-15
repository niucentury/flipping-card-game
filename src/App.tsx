import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { getUserFromLocal, createNewUser, saveUserToLocal, getAllUsers, updateUserScore, saveUser } from './services/userService';
import { type User } from './models/User';
import UserModal from './components/UserModal';
import Leaderboard from './components/Leaderboard';
import './components/UserModal.css';

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

const defaultThemes = [
  {
    name: '动物',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f431.svg', // 猫
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f436.svg', // 狗
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f98a.svg', // 狐狸
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f43c.svg', // 熊猫
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f412.svg', // 猴子
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f981.svg', // 狮子
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f418.svg', // 大象
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f407.svg', // 兔子
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f428.svg', // 考拉
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f992.svg', // 长颈鹿
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f99b.svg', // 河马
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f98f.svg', // 犀牛
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f993.svg', // 斑马
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f40a.svg', // 鳄鱼
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f427.svg', // 企鹅
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f405.svg'  // 老虎
    ],
    color: '#0ed2f7',
  },
  {
    name: '水果',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f34e.svg', // 苹果
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f34c.svg', // 香蕉
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f352.svg', // 樱桃
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f347.svg', // 葡萄
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f34a.svg', // 橙子
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f350.svg', // 梨
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f34d.svg', // 菠萝
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f349.svg', // 西瓜
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f353.svg', // 草莓
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1fad0.svg', // 蓝莓
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f353.svg', // 草莓
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f34b.svg', // 柠檬
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f351.svg', // 桃子
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f965.svg', // 椰子
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f95d.svg', // 猕猴桃
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f96d.svg'  // 芒果
    ],
    color: '#ffb347',
  },
  {
    name: '动漫',
    images: [
      '/flipping-card-game/images/nezha.webp', // 哪吒
      '/flipping-card-game/images/sunwukong.jpeg', // 孙悟空
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
    ],
    color: '#ff9ff3',
  },
  {
    name: '玩偶',
    images: [
      '/flipping-card-game/images/jiafeimao.png',
      '/flipping-card-game/images/xiaoxinqie.png',
      '/flipping-card-game/images/bingdundun.png',
      '/flipping-card-game/images/bull.png',
      '/flipping-card-game/images/caomeixiong.png',
      '/flipping-card-game/images/cat.png',
      '/flipping-card-game/images/cow.png',
      '/flipping-card-game/images/daidai.png',
      '/flipping-card-game/images/dog.png',
      '/flipping-card-game/images/guawu.png',
      '/flipping-card-game/images/heixingxing.png',
      '/flipping-card-game/images/kaka.png',
      '/flipping-card-game/images/kapibala.png',
      '/flipping-card-game/images/mengqiqi.png',
      '/flipping-card-game/images/mickey.png',
      '/flipping-card-game/images/panghu.png',
      '/flipping-card-game/images/piqiagou.png',
      '/flipping-card-game/images/qie.png',
      '/flipping-card-game/images/smallcat.png',
      '/flipping-card-game/images/smalldog.png',
      '/flipping-card-game/images/ultrama.png'
    ],
    color: '#f9e79f',
  },
  {
    name: '交通',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f697.svg', // 汽车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f6b2.svg', // 自行车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f68c.svg', // 公交车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/2708.svg',  // 飞机
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f6f3.svg', // 轮船
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f682.svg', // 火车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3cd.svg', // 摩托车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f681.svg', // 直升机
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f695.svg', // 出租车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f691.svg', // 救护车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f692.svg', // 消防车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f693.svg', // 警车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f69a.svg', // 卡车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f69b.svg', // 拖拉机
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f69c.svg', // 挖掘机
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f69b.svg'  // 拖拉机
    ],
    color: '#7ed957',
  },
  {
    name: '体育',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/26bd.svg', // 足球
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3c0.svg', // 篮球
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3d0.svg', // 排球
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3be.svg', // 网球
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/26be.svg', // 棒球
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3cc.svg', // 高尔夫
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3ca.svg', // 游泳
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3bf.svg', // 滑雪
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f6b2.svg', // 自行车
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f94a.svg', // 拳击
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3cb.svg', // 举重
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f3f9.svg', // 射击
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f93a.svg', // 击剑
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f938.svg', // 体操
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f94b.svg', // 柔道
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f94b.svg'  // 柔道
    ],
    color: '#4ecdc4',
  },{
    name: '写字表',
    images: [
    '写', '字', '洗', '讲', '进', '都', '唱', '站', '赶', '页', '户', '交', '父',
    '向', '边', '行', '草', '过', '找', '吓', '为', '怕', '家', '象', '没', 
    "到", "她", "空", "还", "干", "身", "星", "久", "巾",
    "豆", "斗", "笔", "知", "道", "平", "安", "放", 
    "灯", "车", "站", 
    "课","坐","老","师","国","百","听","时","点","林","高","兴","着","往","瓜","兔",
    "首","池","采","尖","角","早","玩","眼","泪","它","贝","气","机","台","伞","朵",
    "美","这","看","鱼","面","问","加","抱","饱","物","造","运","欢","房","网","对",
    "今","雪","细","夕","语","打","皮","跑","足","沙","包","习","近","远","学","玉",
    "义","册","支","电","衣","床","前","思","故","乡","地","色","把","样","笑","再",
    "节","米","间","分","吃","肉","止","斤","寸","丁","千","元","快","乐","当","书",
    "画","毛","自","己","他","回","们","叫","从","好","走","河","说","让","共","产",
    "党","太","阳","光","北","京","的","会","告","广","井","主","江","住","方","后",
    "春","夏","秋","冬","吹","花","飞","入","什","么","古","胡","双","言","青","清",
    "晴","苗","请","生","红","动","万","无","明","文","卡","片","合"
    ],
    color: '#9b59b6',
    isText: true
  },{
    name: '识字表',
    images: [
      "识","霜","吹","降","落","飘","游","池","姓","氏","李","张","弓","吴","孙","眼","睛",
      "保","护","事","情","吃","猜","凉","喜","欢","攻","令","感","动","组","识","计",
      "算","减","式","图","形","卡","合","唱","团","热","爱","怀","抱","幸","福","成",
      "城","毛","主","席","乡","亲","战","士","想","念","告","诉","座","广","场","非",
      "宽","洁","美","丽","认","连","选","圈","涂","试","练","急","直","哭","跟","忽",
      "然","听","喊","快","背","很","孤","单","每","种","邻","居","招","呼","怎","独",
      "跳","绳","羽","毛","球","劲","轮","排","母","静","思","床","疑","举","望","低",
      "胆","敢","勇","窗","睡","觉","乱","拉","样","端","粽","煮","盼","枣","甜","鲜",
      "肉","电","视","裤","被","捉","迷","藏","物","蚂","蚁","粮","食","运","结","网",
      "严","寒","酷","暑","朝","霞","操","暖","晨","细","杨","香","拔","拍","踢","跑",
      "铃","真","身","体","丢","沙","包","之","初","相","近","教","道","专","幼","鞭",
      "炮","泡","茶","饭","轻","穿","袍","浮","萍","诗","首","偷","泉","惜","照","柔",
      "荷","露","角","浪","迈","悄","虾","壳","娃","淘","装","像","次","给","摇","篮",
      "亮","晶","翅","膀","展","珠","停","坪","展","透","朵","阴","沉","闷","消","息",
      "要","腰","呀","忙","呢","吗","面","吧","棍","豆","汤","蚊","扇","椅","牵","织",
      "铅","笔","盒","具","仔","细","检","查","伙","伴","决","定","新","些","此","所",
      "钟","迟","等","已","经","表","位","虎","熊","注","意","通","遍","百","为","因",
      "舌","理","忘","第","猴","块","兴","掰","扛","扔","满","摘","追","捧","刷","梳",
      "洗","澡","脸","盆","姑","娘","咕","咚","棉","病","治","燕","帮","害","别","惊",
      "奇","熟","掉","湖","吓","鹿","象","野","拦","哪","领","壁","借","咬","难","爬",
      "您","拨","摆","过","孩","转","吵","现","顶","胖","票","户","交","父"
    ],
    color: '#9b59b6',
    isText: true
  },{
  name: '职业',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f468-200d-1f393.svg', // 学生
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f469-200d-1f393.svg', // 女学生
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f468-200d-1f3eb.svg', // 教师
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f469-200d-1f3eb.svg', // 女教师
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f468-200d-2695-fe0f.svg', // 医生
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f469-200d-2695-fe0f.svg', // 女医生
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f468-200d-1f527.svg', // 工程师
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f469-200d-1f527.svg', // 女工程师
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f468-200d-1f3a4.svg', // 歌手
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f469-200d-1f3a4.svg', // 女歌手
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f468-200d-1f373.svg', // 厨师
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f469-200d-1f373.svg', // 女厨师
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f468-200d-1f692.svg', // 消防员
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f469-200d-1f692.svg', // 女消防员
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f477.svg', // 建筑工人
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f477-200d-2640-fe0f.svg'  // 女建筑工人
    ],
    color: '#a78bfa',
  },
  {
    name: '旗帜',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e8-1f1f3.svg', // 中国
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1fa-1f1f8.svg', // 美国
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ef-1f1f5.svg', // 日本
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f0-1f1f7.svg', // 韩国
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1eb-1f1f7.svg', // 法国
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e9-1f1ea.svg', // 德国
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f7-1f1fa.svg', // 俄罗斯
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ec-1f1e7.svg', // 英国
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e8-1f1e6.svg', // 加拿大
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e6-1f1fa.svg', // 澳大利亚
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e7-1f1f7.svg', // 巴西
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ee-1f1f3.svg', // 印度
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ee-1f1f9.svg', // 意大利
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ea-1f1f8.svg', // 西班牙
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1f2-1f1fd.svg', // 墨西哥
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ff-1f1e6.svg'  // 南非
    ],
    color: '#ff6b6b',
  },
  {
    name: '自然',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/2600.svg',  // 太阳
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f30a.svg', // 海洋
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f30b.svg', // 火山
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f30f.svg', // 地球(亚洲)
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f315.svg', // 满月
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f319.svg', // 月牙
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/2601.svg',  // 云
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/2603.svg',  // 雪人
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/2604.svg',  // 彗星
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/26a1.svg',  // 闪电
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/26c5.svg',  // 太阳和云
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f300.svg', // 旋风
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f301.svg', // 雾
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f303.svg', // 夜景
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f304.svg', // 日出
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f305.svg', // 日出2
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f307.svg', // 日落
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f308.svg', // 彩虹
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f320.svg', // 流星
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f325.svg', // 太阳大云
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f326.svg', // 雨云
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f327.svg', // 下雨
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f328.svg', // 下雪
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f329.svg', // 闪电
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f32a.svg', // 龙卷风
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f32b.svg', // 雾
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f32c.svg', // 风脸
    ],
    color: '#1dd1a1',
  },
  {
    name: '生活',
    images: [
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f382.svg', // 生日蛋糕
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f37d.svg', // 餐具
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f37e.svg', // 瓶装饮料
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f37f.svg', // 爆米花
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f380.svg', // 礼物
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f381.svg', // 礼物盒
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f383.svg', // 南瓜灯
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f384.svg', // 圣诞树
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f386.svg', // 烟花
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f387.svg', // 烟花棒
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f388.svg', // 气球
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f389.svg', // 派对彩带
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f38a.svg', // 彩带球
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f38b.svg', // 日本娃娃
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f38c.svg', // 鲤鱼旗
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f38d.svg'  // 风铃
    ],
    color: '#feca57',
  },
  /*{
    name: '节日',
    images: [
      'https://emojicdn.elk.sh/🎆', // 春节
      'https://emojicdn.elk.sh/🎏', // 端午节
      'https://emojicdn.elk.sh/🎑', // 中秋节
      'https://emojicdn.elk.sh/🎄', // 圣诞节
      'https://emojicdn.elk.sh/🎃', // 万圣节
      'https://emojicdn.elk.sh/🧒', // 儿童节
      'https://emojicdn.elk.sh/💝', // 情人节
      'https://emojicdn.elk.sh/🎎', // 七夕
      'https://emojicdn.elk.sh/🇨🇳', // 国庆节
      'https://emojicdn.elk.sh/🛠️', // 劳动节
      'https://emojicdn.elk.sh/??', // 泼水节
      'https://emojicdn.elk.sh/🦃', // 感恩节
      'https://emojicdn.elk.sh/🌷', // 母亲节
      'https://emojicdn.elk.sh/👔', // 父亲节
      'https://emojicdn.elk.sh/📚', // 教师节
      'https://emojicdn.elk.sh/🎊'  // 新年
    ],
    color: '#ff6b6b',
  }*/
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
  //{ label: '测试', pairs: 1 },
  { label: '简单', pairs: 4 },
  //{ label: '中等', pairs: 6 },
  { label: '困难', pairs: 8 },// 卡牌总数为 pairs*2，即 32 张
  { label: '地狱', pairs: 12 },
];

function App() {
  // 用户初始化
  const initUser = () => {
    const user = getUserFromLocal();
    if (!user) {
      setCurrentUser(createNewUser());
      setShowUserModal(true);
    } else {
      setCurrentUser(user);
    }
  };

  // 初始化用户信息
  useEffect(() => {
    const initialize = async () => {
      initUser();
      try {
        const users = await getAllUsers();
        setLeaderboard(users);
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
  const [soundOn, setSoundOn] = useState(true);
  
  // 用户状态
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

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
    setScore(0); // 重置分数
    setCombo(0); // 重置连击
    setGameActive(true);
    setShowSettings(false);
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
            i === i1 || i === i2 ? { ...card, flipped: false } : card
          );
          setCards(updated);
          setCombo(0); // 重置连击
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

      // 保存用户分数
      if (currentUser) {
        const difficultyLabel = difficultyOptions.find(o => o.pairs === pairs)?.label || '';
        const currentTheme = defaultThemes[themeIdx]?.name || '';
        
        if (!currentTheme) {
          console.error('无效的主题索引:', themeIdx);
          return;
        }

        const updateAndRefresh = async () => {
          try {
            const updatedUser = await updateUserScore(
              currentUser,
              currentTheme,
              difficultyLabel,
              score
            );
            await saveUser(updatedUser);
            setCurrentUser(updatedUser);
            
            const users = await getAllUsers();
            setLeaderboard(users);
          } catch (error) {
            console.error('保存分数失败:', error);
          }
        };
        
        updateAndRefresh();
      }
    }
  }, [matchedCount, pairs, gameActive]);

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

  return (
    <div className="memory-game-container">
      {showSettings ? (
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
        <UserModal 
          initialUser={currentUser}
          onSave={handleSaveUser}
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
            <h3>选择难度</h3>
            <div className="difficulty-options">
              {difficultyOptions.map((option) => (
                <div 
                  key={option.label}
                  className={`difficulty-option ${pairs === option.pairs ? 'selected' : ''}`}
                  onClick={() => setPairs(option.pairs)}
                >
                  <div className="radio-button">
                    {pairs === option.pairs && <div className="radio-dot"></div>}
                  </div>
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="start-button" onClick={startGame}>开始游戏</button>
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
                  <button className="home-button" onClick={() => setShowSettings(true)}>返回首页</button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
