<template>
  <div class="max-w-md mx-auto py-8">
    <!-- 标题 - 固定在顶部 -->
    <div class="text-center mb-6 animate-fade-in sticky top-0 z-30 -mx-4 px-4 py-3 bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg border-b border-gray-100/50 dark:border-gray-800/50">
      <h1 class="text-2xl font-bold text-gradient">⚙️ 设置</h1>
    </div>

    <!-- 设置内容 - 可滚动区域 -->
    <div class="space-y-6 pb-8 settings-scroll" style="max-height: calc(100vh - 140px); overflow-y: auto; padding-right: 8px;">
      <!-- 主题切换 -->
      <div class="card animate-fade-in animate-delay-100">
        <h3 class="font-medium mb-4 text-gray-700 dark:text-gray-200">主题切换</h3>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="setTheme('light')"
            :class="[
              'py-3 px-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2',
              store.theme === 'light' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                : 'border-gray-200 dark:border-gray-700'
            ]"
          >
            <div class="w-12 h-6 rounded-full bg-gradient-to-r from-blue-100 to-gray-100 mb-1"></div>
            <span>☀️</span>
            <span class="text-gray-700 dark:text-gray-300">浅色</span>
          </button>
          <button
            @click="setTheme('dark')"
            :class="[
              'py-3 px-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2',
              store.theme === 'dark' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                : 'border-gray-200 dark:border-gray-700'
            ]"
          >
            <div class="w-12 h-6 rounded-full bg-gradient-to-r from-gray-900 to-indigo-900 mb-1"></div>
            <span>🌙</span>
            <span class="text-gray-700 dark:text-gray-300">深色</span>
          </button>
        </div>
      </div>

      <!-- AI接口配置 -->
      <div class="card animate-fade-in animate-delay-200">
        <h3 class="font-medium mb-4 text-gray-700 dark:text-gray-200">AI接口配置（可选）</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          配置AI API后，打开盲盒时将获得AI生成的个性化治愈语录，内容更智能、更贴心
        </p>
        
        <!-- API配置说明（可折叠） -->
        <div class="mb-4">
          <button
            @click="showApiGuide = !showApiGuide"
            class="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <div class="flex items-center gap-2">
              <span class="text-purple-700 dark:text-purple-300">📖</span>
              <span class="text-sm font-medium text-purple-700 dark:text-purple-300">API配置快速指南</span>
            </div>
            <span class="text-purple-500 dark:text-purple-400 transition-transform duration-300" :class="{ 'transform rotate-180': showApiGuide }">
              ▼
            </span>
          </button>
          
          <div v-if="showApiGuide" class="mt-2 p-3 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg text-xs text-purple-600 dark:text-purple-400 space-y-1.5 animate-fade-in">
            <p><strong>🔹 DeepSeek</strong>：<a href="https://platform.deepseek.com" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">platform.deepseek.com</a> → 获取API Key</p>
            <p><strong>🔹 豆包</strong>：<a href="https://console.volcengine.com/ark" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">console.volcengine.com/ark</a> → 获取API Key或AK/SK</p>
            <p><strong>🔹 通义千问（百炼）</strong>：<a href="https://bailian.console.aliyun.com" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">bailian.console.aliyun.com</a> → 获取API Key</p>
            <p><strong>🔹 Kimi</strong>：<a href="https://platform.moonshot.cn" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">platform.moonshot.cn</a> → 获取API Key</p>
            <p><strong>🔹 硅基流动</strong>：<a href="https://cloud.siliconflow.cn" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">cloud.siliconflow.cn</a> → 获取API Key</p>
            <p><strong>🔹 智谱AI</strong>：<a href="https://open.bigmodel.cn" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">open.bigmodel.cn</a> → 获取API Key</p>
            <p><strong>🔹 文心一言</strong>：<a href="https://yiyan.baidu.com/developer" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">yiyan.baidu.com/developer</a> → 获取API Key</p>
            <p><strong>🔹 讯飞星火</strong>：<a href="https://xinghuo.xfyun.cn" target="_blank" class="underline hover:text-purple-800 dark:hover:text-purple-200">xinghuo.xfyun.cn</a> → 获取API Key</p>
          </div>
        </div>
        <div class="space-y-4">
          <!-- API类型选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API类型
            </label>
            <select
              v-model="apiType"
              class="input-field"
              @change="handleApiTypeChange"
            >
              <option value="none">无（使用本地语录库）</option>
              <option value="doubao">豆包</option>
              <option value="deepseek">DeepSeek</option>
              <option value="qwen">通义千问（百炼）</option>
              <option value="kimi">Kimi</option>
              <option value="siliconflow">硅基流动</option>
              <option value="glm">智谱AI</option>
              <option value="ernie">文心一言</option>
              <option value="spark">讯飞星火</option>
            </select>
          </div>
          
          <!-- API Key输入 -->
          <div v-if="apiType !== 'none'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <div class="flex gap-2">
              <input
                v-model="apiKey"
                :type="showApiKey ? 'text' : 'password'"
                :placeholder="`输入${apiTypeName} API Key...`"
                class="input-field flex-1"
              />
              <button
                @click="showApiKey = !showApiKey"
                class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {{ showApiKey ? '🔒' : '👁️' }}
              </button>
            </div>
            <!-- 显示API Key配置状态 -->
            <p v-if="isApiKeyConfigured" class="mt-2 text-xs text-green-500 flex items-center gap-1">
              <span>✓</span>
              <span>已配置 {{ apiTypeName }} API</span>
            </p>
          </div>
          
          <!-- 模型配置 -->
          <div v-if="apiType !== 'none'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              模型配置
            </label>
            
            <!-- 模式选择 -->
            <div class="flex gap-2 mb-2">
              <button
                @click="modelMode = 'preset'"
                :class="[
                  'flex-1 py-2 px-3 rounded-lg border-2 transition-all duration-300 text-sm',
                  modelMode === 'preset' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                预设模型
              </button>
              <button
                @click="modelMode = 'custom'"
                :class="[
                  'flex-1 py-2 px-3 rounded-lg border-2 transition-all duration-300 text-sm',
                  modelMode === 'custom' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                自定义
              </button>
            </div>
            
            <!-- 预设模型选择 -->
            <select v-if="modelMode === 'preset'" v-model="modelName" class="input-field">
              <option v-for="model in presetModels[apiType]" :key="model" :value="model">
                {{ model }}
              </option>
            </select>
            
            <!-- 自定义模型输入 -->
            <input
              v-if="modelMode === 'custom'"
              v-model="modelName"
              type="text"
              :placeholder="getCustomModelPlaceholder()"
              class="input-field"
            />
            
            <!-- 提示 -->
            <p v-if="modelMode === 'custom'" class="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
              {{ getCustomModelTip() }}
            </p>
          </div>
          
          <!-- 豆包AK/SK认证 -->
          <div v-if="apiType === 'doubao'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              认证方式
            </label>
            <div class="flex gap-4">
              <button
                @click="authType = 'api_key'"
                :class="[
                  'flex-1 py-2 px-3 rounded-lg border-2 transition-all duration-300',
                  authType === 'api_key' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                API Key
              </button>
              <button
                @click="authType = 'ak_sk'"
                :class="[
                  'flex-1 py-2 px-3 rounded-lg border-2 transition-all duration-300',
                  authType === 'ak_sk' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                AK/SK
              </button>
            </div>
            
            <!-- AK/SK输入 -->
            <div v-if="authType === 'ak_sk'" class="mt-3 space-y-3">
              <input
                v-model="ak"
                type="text"
                placeholder="输入 Access Key..."
                class="input-field"
              />
              <input
                v-model="sk"
                type="password"
                placeholder="输入 Secret Key..."
                class="input-field"
              />
            </div>
          </div>
          
          <!-- API保存模式 -->
          <div v-if="apiType !== 'none'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              保存模式
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                @click="saveMode = 'session'"
                :class="[
                  'py-2 px-3 rounded-lg border-2 transition-all duration-300 text-sm',
                  saveMode === 'session' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                本次保存
              </button>
              <button
                @click="saveMode = 'permanent'"
                :class="[
                  'py-2 px-3 rounded-lg border-2 transition-all duration-300 text-sm',
                  saveMode === 'permanent' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                长期保存
              </button>
              <button
                @click="saveMode = 'none'"
                :class="[
                  'py-2 px-3 rounded-lg border-2 transition-all duration-300 text-sm',
                  saveMode === 'none' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                不保存
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
              {{ saveModeDescription }}
            </p>
          </div>
          
          <!-- 测试连接按钮 -->
          <div v-if="apiType !== 'none'" class="flex gap-2">
            <button
              @click="testApiConnection"
              :disabled="isTestingApi"
              class="btn-secondary flex-1 disabled:opacity-50"
            >
              <span v-if="isTestingApi" class="animate-spin">⏳</span>
              <span v-else>🔗</span>
              <span>{{ isTestingApi ? '测试中...' : '测试连接' }}</span>
            </button>
            <button
              @click="saveApiSettings"
              class="btn-primary flex-1"
            >
              <span>💾</span>
              <span>保存配置</span>
            </button>
          </div>
          
          <!-- API连接状态 -->
          <div v-if="apiStatus" :class="[
            'p-3 rounded-lg text-sm flex items-center gap-2',
            apiStatus.success ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          ]">
            <span>{{ apiStatus.success ? '✓' : '✗' }}</span>
            <span>{{ apiStatus.message }}</span>
          </div>
          
          <p class="text-xs text-gray-400 dark:text-gray-500">
            您的API配置仅保存在本地，不会被上传
          </p>
        </div>
      </div>

      <!-- 自定义语录 -->
      <div class="card animate-fade-in animate-delay-300">
        <h3 class="font-medium mb-4 text-gray-700 dark:text-gray-200">自定义语录</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          添加属于你自己的治愈语录
        </p>
        
        <!-- 添加表单 -->
        <div class="space-y-3 mb-4">
          <input
            v-model="newQuote"
            type="text"
            placeholder="输入自定义语录..."
            class="input-field"
            @keyup.enter="addQuote"
          />
          <button
            @click="addQuote"
            :disabled="!newQuote.trim()"
            class="btn-primary w-full disabled:opacity-50"
          >
            添加语录
          </button>
        </div>

        <!-- 已添加的语录 -->
        <div v-if="store.customQuotes.length > 0" class="space-y-2">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            已添加 {{ store.customQuotes.length }} 条语录
          </p>
          <div
            v-for="item in store.customQuotes"
            :key="item.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <p class="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
              {{ item.text }}
            </p>
            <button
              @click="removeQuote(item.id)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 背景设置 -->
      <div class="card animate-fade-in animate-delay-500">
        <h3 class="font-medium mb-4 text-gray-700 dark:text-gray-200">🖼️ 背景设置</h3>
        <div class="space-y-4">
          <!-- 背景类型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">背景类型</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="setBackgroundType('default')"
                :class="[
                  'py-3 px-4 rounded-xl border-2 transition-all duration-300 text-sm',
                  store.settings?.backgroundType === 'default' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                ]"
              >
                🎨 默认
              </button>
              <button
                @click="setBackgroundType('custom')"
                :class="[
                  'py-3 px-4 rounded-xl border-2 transition-all duration-300 text-sm',
                  store.settings?.backgroundType === 'custom' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                ]"
              >
                🖼️ 自定义
              </button>
            </div>
          </div>
          
          <!-- 自定义背景图片 -->
          <div v-if="store.settings?.backgroundType === 'custom'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">上传背景图片</label>
            <label class="flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-gray-50 dark:bg-gray-800/50">
              <input
                type="file"
                accept="image/*"
                @change="handleBackgroundImageChange"
                class="hidden"
              />
              <div class="text-center">
                <span class="text-2xl block mb-1">📁</span>
                <span class="text-sm text-gray-600 dark:text-gray-300">点击选择图片</span>
                <p class="text-xs text-gray-400 mt-1">支持 jpg, png, gif</p>
              </div>
            </label>
            <div v-if="store.settings?.backgroundImage" class="mt-3 relative">
              <img 
                :src="store.settings.backgroundImage" 
                alt="背景预览" 
                class="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <div class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                当前背景预览
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div class="card animate-fade-in animate-delay-600">
        <h3 class="font-medium mb-4 text-gray-700 dark:text-gray-200">📱 关于</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">版本</span>
            <span class="text-gray-800 dark:text-gray-200">{{ appVersion }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">开发者</span>
            <span class="text-gray-800 dark:text-gray-200">古月开发</span>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            💝 愿每一份温暖都能被看见
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import { apiService } from '../services/apiService'

const store = useAppStore()

// 从 package.json 读取版本号
const appVersion = ref('2.2.1')

const apiType = ref('none')
const apiKey = ref('')
const authType = ref('api_key')
const ak = ref('')
const sk = ref('')
const modelName = ref('')
const showApiKey = ref(false)
const isTestingApi = ref(false)
const apiStatus = ref(null)
const saveMode = ref('session')
const doubaoModelMode = ref('preset')
const modelMode = ref('preset')
const showApiGuide = ref(false)

// 定时器ID，用于组件卸载时清理
let apiStatusTimer = null

// 各API的默认模型配置
const defaultModels = {
  deepseek: 'deepseek-v4-flash',
  doubao: 'doubao-seed-2-0-pro-260215',
  qwen: 'qwen3.5-plus',
  kimi: 'kimi-k2.5',
  siliconflow: 'deepseek-ai/DeepSeek-V3',
  glm: 'glm-5',
  ernie: 'ernie-4.0-8k',
  spark: '4.0Ultra'
}

// 所有API的预设模型列表
const presetModels = {
  deepseek: [
    'deepseek-v4-flash',
    'deepseek-v4-pro',
    'deepseek-chat',
    'deepseek-reasoner'
  ],
  doubao: [
    'doubao-seed-2-0-pro-260215',
    'doubao-seed-2-0-lite-260215',
    'doubao-seed-2-0-mini-260215',
    'doubao-seed-1-6-thinking-250715',
    'doubao-seed-1-6-flash-250615',
    'doubao-pro-32k',
    'doubao-1.5-pro-32k'
  ],
  qwen: [
    'qwen3.5-plus',
    'qwen3.5-397b-a17b',
    'qwen3-vl-plus',
    'qwen3-vl-flash',
    'qwen2.5',
    'qwen2',
    'qwen1.5'
  ],
  kimi: [
    'kimi-k2.5',
    'kimi-k2-0905',
    'kimi-k2-0905-preview',
    'moonshot-v1-8k',
    'moonshot-v1-32k',
    'moonshot-v1-128k'
  ],
  siliconflow: [
    'deepseek-ai/DeepSeek-V3',
    'deepseek-ai/DeepSeek-R1',
    'Qwen/Qwen2.5-72B-Instruct',
    'Qwen/Qwen2.5-32B-Instruct',
    'THUDM/glm-4-7b',
    'meta-llama/Llama-3.1-70B-Instruct'
  ],
  glm: [
    'glm-5',
    'glm-4.5',
    'glm-4',
    'glm-3-turbo',
    'glm-4-plus'
  ],
  ernie: [
    'ernie-4.0-8k',
    'ernie-3.5-8k',
    'ernie-speed-128k',
    'ernie-lite-8k'
  ],
  spark: [
    '4.0Ultra',
    '3.5Ultra',
    'lite',
    'pro-128k'
  ]
}

// 计算属性
const apiTypeName = computed(() => {
  const typeMap = {
    'doubao': '豆包',
    'deepseek': 'DeepSeek',
    'qwen': '通义千问（百炼）',
    'kimi': 'Kimi',
    'siliconflow': '硅基流动',
    'glm': '智谱AI',
    'ernie': '文心一言',
    'spark': '讯飞星火'
  }
  return typeMap[apiType.value] || ''
})

const isApiKeyConfigured = computed(() => {
  if (apiType.value === 'none') return false
  if (authType.value === 'api_key' && apiType.value === 'doubao') {
    return !!apiKey.value && !!modelName.value
  }
  if (authType.value === 'api_key') {
    return !!apiKey.value
  } else {
    return !!ak.value && !!sk.value && !!modelName.value
  }
})

const saveModeDescription = computed(() => {
  const descriptions = {
    'session': '关闭应用后清除，下次启动需重新输入',
    'permanent': '长期保存，除非手动清除',
    'none': '仅本次使用，关闭应用后自动清除'
  }
  return descriptions[saveMode.value] || ''
})
const newQuote = ref('')

// 初始化API配置
onMounted(async () => {
  await store.loadSettings()
  const settings = store.settings || {}
  apiType.value = settings.apiType || 'none'
  apiKey.value = settings.apiKey || ''
  authType.value = settings.authType || 'api_key'
  ak.value = settings.ak || ''
  sk.value = settings.sk || ''
  modelName.value = settings.modelName || ''
  saveMode.value = settings.saveMode || 'session'
})

// 处理API类型变化
function handleApiTypeChange() {
  if (apiType.value === 'none') {
    apiKey.value = ''
    authType.value = 'api_key'
    ak.value = ''
    sk.value = ''
    modelName.value = ''
    apiStatus.value = null
  } else {
    modelName.value = defaultModels[apiType.value] || ''
    modelMode.value = 'preset'
  }
}

// 获取自定义模型的占位符
function getCustomModelPlaceholder() {
  const placeholders = {
    deepseek: '输入模型名称（如 deepseek-v3）...',
    doubao: '输入 Endpoint ID（如 ep-20250512195705-c8kq4）...',
    qwen: '输入模型名称（如 qwen3.5-plus）...',
    kimi: '输入模型名称（如 kimi-k2.5）...',
    siliconflow: '输入模型名称（如 deepseek-ai/DeepSeek-V3）...',
    glm: '输入模型名称（如 glm-5）...',
    ernie: '输入模型名称（如 ernie-4.0-8k）...',
    spark: '输入模型名称（如 4.0Ultra）...'
  }
  return placeholders[apiType.value] || '输入模型名称...'
}

// 获取自定义模型的提示
function getCustomModelTip() {
  const tips = {
    deepseek: '💡 查看 DeepSeek 官网获取最新模型名称',
    doubao: '💡 Endpoint ID 从火山引擎控制台 → 方舟 → 推理接入点获取',
    qwen: '💡 查看百炼官网获取最新模型名称',
    kimi: '💡 查看 Kimi 官网获取最新模型名称',
    siliconflow: '💡 查看硅基流动官网获取完整模型列表',
    glm: '💡 查看智谱AI官网获取最新模型名称',
    ernie: '💡 查看文心一言开发者平台获取最新模型名称',
    spark: '💡 查看讯飞星火开放平台获取最新模型名称'
  }
  return tips[apiType.value] || '💡 查看对应API官网获取模型名称'
}

// 测试API连接 - 直接使用当前输入值，不需要先保存
async function testApiConnection() {
  console.log('testApiConnection 被调用')
  console.log('apiType:', apiType.value)
  
  let isValid = true
  let errorMsg = ''
  
  if (apiType.value === 'none') {
    isValid = false
    errorMsg = '请先选择API类型'
  } else if (!modelName.value) {
    isValid = false
    errorMsg = '请选择或输入模型名称'
  } else if (apiType.value === 'doubao') {
    if (authType.value === 'ak_sk') {
      if (!ak.value || !sk.value) {
        isValid = false
        errorMsg = '请填写 Access Key 和 Secret Key'
      }
    } else {
      if (!apiKey.value) {
        isValid = false
        errorMsg = '请填写 API Key'
      }
    }
  } else {
    if (!apiKey.value) {
      isValid = false
      errorMsg = '请填写 API Key'
    }
  }
  
  if (!isValid) {
    apiStatus.value = {
      success: false,
      message: errorMsg
    }
    return
  }

  isTestingApi.value = true
  apiStatus.value = null

  try {
    const settings = {
      apiType: apiType.value,
      apiKey: apiKey.value,
      authType: authType.value,
      ak: ak.value,
      sk: sk.value,
      modelName: modelName.value
    }

    console.log('开始测试API连接...')
    const result = await apiService.testConnection(settings)
    console.log('API测试结果:', result)

    if (result.success) {
      apiStatus.value = {
        success: true,
        message: result.message || '连接成功！API正常工作'
      }
    } else {
      apiStatus.value = {
        success: false,
        message: result.message || '连接失败，请检查配置'
      }
    }
  } catch (error) {
    console.error('API测试异常:', error)
    apiStatus.value = {
      success: false,
      message: `连接异常: ${error.message || '未知错误'}`
    }
  } finally {
    isTestingApi.value = false
  }
}

// 保存API配置
async function saveApiSettings() {
  store.settings = {
    ...store.settings,
    apiType: apiType.value,
    apiKey: apiKey.value,
    authType: authType.value,
    ak: ak.value,
    sk: sk.value,
    modelName: modelName.value,
    saveMode: saveMode.value
  }
  await store.saveSettings()
  
  apiStatus.value = {
    success: true,
    message: '配置已保存'
  }
  
  if (apiStatusTimer) clearTimeout(apiStatusTimer)
  apiStatusTimer = setTimeout(() => {
    apiStatus.value = null
  }, 3000)
}

function setTheme(theme) {
  store.setTheme(theme)
  
  const themes = ['light', 'dark']
  themes.forEach(t => {
    document.documentElement.classList.remove(`theme-${t}`)
  })
  document.documentElement.classList.add(`theme-${theme}`)
}

// 设置背景类型
function setBackgroundType(type) {
  store.updateSettings({ backgroundType: type })
}

// 处理背景图片变化
function handleBackgroundImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function(e) {
      store.updateSettings({ backgroundImage: e.target.result })
    }
    reader.readAsDataURL(file)
  }
}

async function addQuote() {
  if (!newQuote.value.trim()) return
  
  await store.addCustomQuote({
    id: Date.now().toString(),
    text: newQuote.value.trim(),
    timestamp: new Date().toISOString()
  })
  
  newQuote.value = ''
}

async function removeQuote(id) {
  await store.removeCustomQuote(id)
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (apiStatusTimer) clearTimeout(apiStatusTimer)
})
</script>

<style scoped>
.settings-scroll::-webkit-scrollbar {
  width: 4px;
}
.settings-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.settings-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 999px;
}
.settings-scroll {
  scrollbar-width: thin;
  scrollbar-color: #667eea transparent;
}
</style>
