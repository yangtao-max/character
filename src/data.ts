export interface Chapter {
  title: string;
  status: 'completed' | 'active' | 'locked';
  desc: string;
  icon: string;
}

export interface Hint {
  title: string;
  desc: string;
  text: string;
  location: string;
}

export interface Character {
  name: string;
  year: string;
  avatar: string;
  greeting: string;
  options: string[];
  reply: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  level: number;
  coverIcon: string;
  theme: string;
  mapTitle: string;
  mapIcon: string;
  chapters: Chapter[];
  hint: Hint;
  character: Character;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  books: Book[];
}

export const stories: Story[] = [
  {
    id: 'nautical',
    title: '航海探险',
    subtitle: '征服星辰大海',
    icon: 'sailing',
    color: 'blue',
    books: [
      {
        id: 'robinson',
        title: '鲁滨逊漂流记',
        author: '丹尼尔·笛福',
        level: 4,
        coverIcon: 'sailing',
        theme: 'blue',
        mapTitle: '鲁滨逊历险记',
        mapIcon: 'explore',
        chapters: [
          { title: '第一章：鲁滨逊漂流记的诞生', status: 'completed', desc: '已完成：笛福的书房', icon: 'menu_book' },
          { title: '第二章：鲁滨逊的传奇经历', status: 'active', desc: '当前任务：遭遇风暴与海盗', icon: 'directions_boat' },
          { title: '第三章：荒岛求生挑战', status: 'locked', desc: '需完成第二章', icon: 'lock' },
          { title: '第四章：重返人类社会', status: 'locked', desc: '需完成第三章', icon: 'lock' }
        ],
        hint: {
          title: '波利船长的提示',
          desc: '准备好迎接风暴了吗？',
          text: '鲁滨逊第一次出海就遇到了大风暴，我们需要帮他稳住船舵！',
          location: '几内亚海岸'
        },
        character: {
          name: '笛福',
          year: '1719年',
          avatar: 'defoe',
          greeting: '你好呀，小探险家！👋\n我是丹尼尔·笛福。听说你正在经历鲁滨逊的冒险，你觉得在荒岛上最重要的是什么？',
          options: ['那是关于“希望”', '那是关于“勇气”'],
          reply: '说得好！只要有希望和勇气，就没有克服不了的困难。'
        }
      },
      {
        id: 'moby',
        title: '白鲸',
        author: '赫尔曼·梅尔维尔',
        level: 5,
        coverIcon: 'water_drop',
        theme: 'cyan',
        mapTitle: '捕鲸之旅',
        mapIcon: 'sailing',
        chapters: [
          { title: '第一章：叫我以实玛利', status: 'completed', desc: '已完成：登船', icon: 'menu_book' },
          { title: '第二章：亚哈船长的执念', status: 'active', desc: '当前任务：寻找莫比·迪克', icon: 'explore' },
          { title: '第三章：最终的决战', status: 'locked', desc: '需完成第二章', icon: 'lock' },
          { title: '第四章：尾声与反思', status: 'locked', desc: '需完成第三章', icon: 'lock' }
        ],
        hint: {
          title: '水手的提示',
          desc: '小心那条白鲸！',
          text: '亚哈船长为了复仇已经失去理智，我们需要保持清醒。',
          location: '太平洋'
        },
        character: {
          name: '梅尔维尔',
          year: '1851年',
          avatar: 'melville',
          greeting: '你好！我是梅尔维尔。你觉得亚哈船长对白鲸的执念代表了什么？',
          options: ['那是关于“征服”', '那是关于“命运”'],
          reply: '深刻的见解。人类与自然、命运的抗争，往往伴随着毁灭。'
        }
      }
    ]
  },
  {
    id: 'literature',
    title: '文学经典',
    subtitle: '跨越时空的对话',
    icon: 'history_edu',
    color: 'emerald',
    books: [
      {
        id: 'guxiang',
        title: '故乡',
        author: '鲁迅',
        level: 5,
        coverIcon: 'auto_stories',
        theme: 'emerald',
        mapTitle: '鲁迅的故乡',
        mapIcon: 'map',
        chapters: [
          { title: '第一章：记忆中的故乡', status: 'completed', desc: '已完成：深冬的景象', icon: 'menu_book' },
          { title: '第二章：闰土的重逢', status: 'active', desc: '当前任务：理解闰土的变化', icon: 'group' },
          { title: '第三章：离开与希望', status: 'locked', desc: '需完成第二章', icon: 'lock' },
          { title: '第四章：新的道路', status: 'locked', desc: '需完成第三章', icon: 'lock' }
        ],
        hint: {
          title: '迅哥儿的提示',
          desc: '看到那层可悲的厚障壁了吗？',
          text: '闰土叫了一声“老爷”，这中间隔着的不只是时间，更是阶级。',
          location: '绍兴老家'
        },
        character: {
          name: '鲁迅',
          year: '1921年',
          avatar: 'luxun',
          greeting: '你好呀，小朋友！👋\n我是鲁迅。听说你在读《故乡》，关于故事的结局，你想知道些什么呢？',
          options: ['那是关于“希望”', '那是关于“改变”'],
          reply: '这个问题问得好！其实最后的希望，就像地上的路一样，走的人多了，也便成了路。'
        }
      },
      {
        id: 'littleprince',
        title: '小王子',
        author: '圣埃克苏佩里',
        level: 3,
        coverIcon: 'rocket_launch',
        theme: 'amber',
        mapTitle: '星际之旅',
        mapIcon: 'flight',
        chapters: [
          { title: '第一章：B612星球', status: 'completed', desc: '已完成：玫瑰的骄傲', icon: 'local_florist' },
          { title: '第二章：访问其他星球', status: 'active', desc: '当前任务：遇见狐狸', icon: 'pets' },
          { title: '第三章：地球上的领悟', status: 'locked', desc: '需完成第二章', icon: 'lock' },
          { title: '第四章：重返星空', status: 'locked', desc: '需完成第三章', icon: 'lock' }
        ],
        hint: {
          title: '飞行员的提示',
          desc: '真正重要的东西是肉眼看不到的',
          text: '用心去寻找，你就能明白驯服的意义。',
          location: '撒哈拉沙漠'
        },
        character: {
          name: '圣埃克苏佩里',
          year: '1943年',
          avatar: 'antoine',
          greeting: '你好，朋友。你觉得小王子为什么要离开他的玫瑰？',
          options: ['那是关于“成长”', '那是关于“寻找”'],
          reply: '是的，只有离开，才能明白什么是真正的爱与责任。'
        }
      }
    ]
  }
];
