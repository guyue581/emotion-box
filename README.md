# 🎁 情绪盲盒 (Emotion Box)

> 探索内心世界，发现治愈的力量

一款基于 AI 的治愈陪伴桌面应用，以"盲盒抽取"为核心交互，帮助你管理情绪、放松心情、记录生活。

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Electron](https://img.shields.io/badge/Electron-29-47848F?logo=electron)](https://www.electronjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.2.1-purple.svg)]()

---

## ✨ 功能特色

| 模块 | 功能 | 说明 |
|:---:|------|------|
| 🎁 **情绪盲盒** | 14 种情绪分类 + 随机治愈语录 | 支持 AI 生成和本地语录库，盲盒开启动画 |
| 📔 **心情日记** | 日记记录 + AI 情绪分析 | AI 返回情绪类型、强度评分、关键词和建议 |
| 🌈 **治愈生成器** | 语录 / 图片 / 故事 | 三种治愈内容类型，AI 生成 + 本地兜底 |
| 🎧 **声音盲盒** | 白噪音 / 轻音乐 / ASMR | 16 种内置声音，支持定时关闭和自定义音频 |
| 💬 **AI 治愈对话** | 三阶段心理咨询对话 | 倾听共情 → 理解陪伴 → 支持建议 |
| ⭐ **收藏系统** | 统一收藏管理 | 语录、图片、故事、声音一站式收藏 |

## 🖥️ 应用截图

<p align="center">
  <img src="public/icon.png" width="120" alt="情绪盲盒图标">
</p>

### 首页

应用首页采用 2×2 宫格布局，清晰展示四大功能入口。

### 情绪盲盒

选择当前情绪（14 种预设 + 自定义输入），通过盲盒动画抽取治愈语录。

### 心情日记

支持日期选择、心情标记、文字记录，以及 AI 智能情绪分析。

### 治愈生成器

三种内容类型：治愈语录、治愈图片、治愈小故事，支持收藏和换一个。

### 声音盲盒

内置 4 类 16 种声音，完整的音频播放器，支持定时关闭和音量控制。

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|:---:|------|
| Vue 3 | 3.5 | 前端框架（Composition API） |
| Vite | 5.4 | 构建工具 |
| Electron | 29 | 桌面应用框架 |
| TailwindCSS | 3.4 | 原子化 CSS |
| Pinia | 2.3 | 全局状态管理 |
| canvas-confetti | 1.9 | 盲盒开启动画特效 |

## 🤖 AI 模型支持

应用统一适配 8 种国内主流 AI 模型，用户可自由切换：

| 提供商 | 默认模型 |
|--------|---------|
| 豆包 (Doubao) | doubao-seed-2.0-pro |
| DeepSeek | deepseek-v4-flash |
| 通义千问 (Qwen) | qwen3.5-plus |
| Kimi (Moonshot) | kimi-k2.5 |
| 硅基流动 (SiliconFlow) | deepseek-ai/DeepSeek-V3 |
| 智谱AI (GLM) | glm-5 |
| 文心一言 (ERNIE) | ernie-4.0-8k |
| 讯飞星火 (Spark) | 4.0Ultra |

> 💡 未配置 AI 时自动降级到本地语录库（280+ 条），功能完全可用。

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0
- **操作系统**：Windows 10/11

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/guyue581/emotion-box.git

# 2. 进入项目目录
cd emotion-box

# 3. 安装依赖
npm install

# 4. 启动开发模式
npm run electron:dev
```

### 构建安装包

```bash
# 构建 Windows 安装包（NSIS）
npm run electron:build:win
```

> 💡 也可以直接双击 `启动开发.bat` 启动开发模式，或双击 `构建安装包.bat` 构建安装包。

## 📁 项目结构

```
emotion-box/
├── electron/
│   ├── main.js              # Electron 主进程
│   └── preload.js           # 安全桥接脚本
├── public/
│   ├── audio/               # 本地音频文件（16个）
│   ├── icon.ico             # 应用图标
│   └── icon.png             # 应用图标
├── src/
│   ├── assets/
│   │   └── quotes.js        # 本地语录库（14类，280+条）
│   ├── components/
│   │   ├── Home.vue         # 首页
│   │   ├── BoxOpen.vue      # 盲盒开启
│   │   ├── Result.vue       # 结果展示
│   │   ├── MoodDiary.vue    # 心情日记
│   │   ├── HealingGenerator.vue  # 治愈生成器
│   │   ├── VoiceBox.vue     # 声音盲盒
│   │   ├── Collection.vue   # 收藏管理
│   │   ├── AIChat.vue       # AI 对话
│   │   └── Settings.vue     # 设置页面
│   ├── services/
│   │   ├── apiService.js    # AI 多模型适配服务
│   │   └── safetyService.js # 安全检测服务
│   ├── stores/
│   │   └── app.js           # Pinia 全局状态
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   └── style.css            # 全局样式
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── 启动开发.bat
└── 构建安装包.bat
```

## 🛡️ 安全机制

作为心理健康类应用，内置三级安全检测体系：

| 级别 | 检测内容 | 响应方式 |
|:---:|------|------|
| 🔴 危机 | 自杀、自残相关 | 立即显示心理援助热线 |
| 🟠 严重 | 严重绝望情绪 | 显示关怀信息和热线 |
| 🟡 警告 | 冲动决策、破坏性行为 | 温和提醒和建议 |

- AI 回复经过多层安全过滤（危险建议检测 + 禁止短语替换）
- Electron 安全配置：`nodeIntegration: false` + `contextIsolation: true`
- 所有数据本地存储，API 配置不上传

## 📋 使用场景

| 场景 | 推荐功能 |
|------|---------|
| 工作压力大 | 声音盲盒 + 情绪盲盒 |
| 情绪低落 | 情绪盲盒 + AI 对话 |
| 睡前放松 | 声音盲盒（自然声音 + 定时关闭） |
| 情绪记录 | 心情日记 + AI 分析 |
| 需要灵感 | 治愈生成器 |
| 日常陪伴 | 每天抽取一句治愈语录 |

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

<p align="center">
  用 ❤️ 和 <a href="https://solo.ai">SOLO AI</a> 构建
</p>
