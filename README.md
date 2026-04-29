# 情绪盲盒 - 治愈心灵的桌面应用

<div align="center">
  <img src="https://img.shields.io/badge/Electron-29.1.0-47848F?style=flat-square&logo=electron" alt="Electron">
  <img src="https://img.shields.io/badge/Vue-3.4.21-4FC08D?style=flat-square&logo=vuedotjs" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-5.1.6-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?style=flat-square&logo=tailwindcss" alt="TailwindCSS">
</div>

## 📖 项目简介

情绪盲盒是一款治愈系桌面应用，通过抽取盲盒的形式，为用户提供专属的治愈语录。无论你此刻是开心、焦虑、难过还是迷茫，都能在这里找到心灵的慰藉。

## ✨ 功能特性

### 🎯 核心功能
- **情绪选择**：12种情绪类型可选，支持自定义输入
- **盲盒抽取**：精美的开箱动画，带来仪式感
- **治愈语录**：200+条精选治愈语录，分类管理
- **收藏功能**：收藏喜欢的语录，随时回顾
- **主题切换**：支持浅色/深色主题
- **自定义语录**：添加属于自己的治愈语录

### 🎨 设计亮点
- 渐变色UI设计，美观大方
- 流畅的动画效果，提升用户体验
- 粒子特效，增添趣味性
- 响应式布局，适配不同窗口大小

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | 前端框架，组合式API |
| Vite | 构建工具，快速热更新 |
| TailwindCSS | 原子化CSS框架 |
| Pinia | 状态管理 |
| Electron | 桌面应用框架 |
| canvas-confetti | 粒子特效 |

## 📁 项目结构

```
emotion-box/
├── electron/
│   ├── main.js          # Electron主进程
│   └── preload.js       # 预加载脚本
├── src/
│   ├── main.js          # Vue入口
│   ├── App.vue          # 根组件
│   ├── style.css        # 全局样式
│   ├── components/
│   │   ├── Home.vue     # 首页 - 情绪选择
│   │   ├── BoxOpen.vue  # 盲盒抽取页面
│   │   ├── Result.vue   # 结果展示页面
│   │   ├── Collection.vue # 收藏页面
│   │   └── Settings.vue # 设置页面
│   ├── assets/
│   │   └── quotes.js    # 语录库
│   └── stores/
│       └── app.js       # Pinia状态管理
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖

```bash
cd emotion-box
npm install
```

### 开发模式

```bash
# 启动Vite开发服务器 + Electron
npm run electron:dev
```

### 构建打包

```bash
# 构建Windows可执行文件
npm run electron:build:win
```

打包后的文件位于 `dist-electron/` 目录。

## 📦 打包说明

### Windows安装包
- 使用 electron-builder 进行打包
- 支持 NSIS 安装向导
- 自动创建桌面快捷方式和开始菜单

### 注意事项
- 打包后体积约 100-150MB
- 首次运行可能需要管理员权限
- 数据存储在用户目录 `%APPDATA%/emotion-box/`

## 💾 数据存储

应用数据存储位置：
- **Windows**: `%APPDATA%/emotion-box/`
- **macOS**: `~/Library/Application Support/emotion-box/`
- **Linux**: `~/.config/emotion-box/`

存储内容：
- `collections.json` - 收藏的语录
- `settings.json` - 用户设置
- `customQuotes.json` - 自定义语录

## 🎨 情绪分类

| 情绪 | Emoji | 描述 |
|------|-------|------|
| 开心 | 😊 | 快乐、愉悦的心情 |
| 焦虑 | 😔 | 紧张、不安的情绪 |
| 难过 | 😢 | 悲伤、失落的心情 |
| 孤独 | 😔 | 寂寞、渴望陪伴 |
| 迷茫 | 😵 | 困惑、不知所措 |
| 愤怒 | 😤 | 生气、不满的情绪 |
| 充满希望 | 💪 | 积极、向上的心态 |
| 需要安慰 | 🥺 | 脆弱、需要关爱 |
| 平静 | 😌 | 宁静、平和的心态 |
| 感恩 | 🙏 | 感激、珍惜的心情 |
| 疲惫 | 😴 | 劳累、需要休息 |
| 自卑 | 😔 | 不自信、需要鼓励 |

## 🔧 高级配置

### 自定义AI接口

在设置页面可以配置AI API Key，实现更智能的情绪分析功能。

### 自定义语录

用户可以添加自己喜欢的语录，这些语录会随机出现在盲盒中。

## 📄 许可证

MIT License

## 🙏 致谢

- 感谢所有提供治愈语录的创作者
- 使用了优秀的开源项目：Vue、Vite、TailwindCSS、Electron

---

**💝 愿每一份温暖都能被看见**
