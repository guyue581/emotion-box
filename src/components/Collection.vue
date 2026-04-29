<template>
  <div class="max-w-md mx-auto py-8">
    <!-- 标题 -->
    <div class="text-center mb-8 animate-fade-in">
      <h1 class="text-2xl font-bold text-gradient mb-2">❤️ 我的收藏</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        共 {{ store.collections.length }} 条收藏
      </p>
    </div>

    <!-- 空状态 -->
    <div v-if="store.collections.length === 0" class="text-center py-16 animate-fade-in">
      <div class="text-6xl mb-4">💝</div>
      <p class="text-gray-500 dark:text-gray-400 mb-2">还没有收藏</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">开启盲盒或生成治愈内容后收藏吧</p>
      <button
        @click="goHome"
        class="btn-primary mt-6"
      >
        去开启盲盒 ✨
      </button>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="space-y-4">
      <div
        v-for="(item, index) in store.collections"
        :key="item.id || index"
        class="card animate-fade-in"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <!-- 语录内容 -->
        <div v-if="getItemType(item) === 'quote'" class="mb-4">
          <p class="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
            "{{ item.text }}"
          </p>
          <p v-if="item.author" class="text-sm text-gray-500 dark:text-gray-400 text-right mt-2">
            —— {{ item.author }}
          </p>
        </div>

        <!-- 图片内容 -->
        <div v-else-if="getItemType(item) === 'image'" class="mb-4">
          <img 
            :src="item.url || item.extra?.url" 
            alt="收藏图片"
            class="w-full rounded-xl shadow-md"
            @error="handleImageError"
          />
        </div>

        <!-- 故事内容 -->
        <div v-else-if="getItemType(item) === 'story'" class="mb-4">
          <h3 class="font-bold text-gray-800 dark:text-white text-center mb-3">
            📖 {{ item.title || item.extra?.title }}
          </h3>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm line-clamp-4">
            {{ item.content || item.extra?.content }}
          </p>
        </div>

        <!-- 声音盲盒内容 -->
        <div v-else-if="getItemType(item) === 'voice'" class="mb-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ item.emoji || item.extra?.emoji || '🎵' }}</span>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">
                {{ item.name || item.extra?.name || '收藏的声音' }}
              </p>
              <p class="text-xs text-gray-400">
                {{ item.category || item.extra?.category || '声音盲盒' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 默认内容（兜底显示） -->
        <div v-else class="mb-4">
          <p class="text-gray-700 dark:text-gray-200 leading-relaxed">
            {{ getDisplayText(item) }}
          </p>
        </div>
        
        <!-- 底部信息 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <!-- 来源标签 -->
            <span 
              v-if="item.source === 'ai'"
              class="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-full text-xs text-purple-600 dark:text-purple-400"
            >
              <span>🤖</span>
              <span>AI生成</span>
            </span>
            <span 
              v-else-if="item.source === 'local'"
              class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-full text-xs text-gray-500 dark:text-gray-400"
            >
              <span>📚</span>
              <span>本地</span>
            </span>
            <!-- 情绪标签 -->
            <span 
              v-if="getEmotionInfo(item.emotion)"
              class="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full text-xs text-primary-600 dark:text-primary-400"
            >
              <span>{{ getEmotionInfo(item.emotion).emoji }}</span>
              <span>{{ getEmotionInfo(item.emotion).label }}</span>
            </span>
            <!-- 日期 -->
            <span class="text-xs text-gray-400">
              {{ formatDate(item.timestamp) }}
            </span>
          </div>
          
          <!-- 删除按钮 -->
          <button
            @click="removeItem(item.id)"
            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="删除"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showDeleteConfirm = false">
      <div class="bg-white dark:bg-dark-card rounded-2xl p-6 mx-4 animate-scale-in">
        <p class="text-lg mb-4 text-center">确定要删除这条收藏吗？</p>
        <div class="flex gap-4 justify-center">
          <button
            @click="showDeleteConfirm = false"
            class="px-6 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            class="px-6 py-2 rounded-full bg-red-500 text-white"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { emotionMap } from '../assets/quotes'

const store = useAppStore()

const showDeleteConfirm = ref(false)
const itemToDelete = ref(null)

function goHome() {
  store.setView('home')
}

function getEmotionInfo(emotion) {
  return emotionMap[emotion] || null
}

function getItemType(item) {
  // 优先使用明确的type字段
  if (item.type === 'quote') return 'quote'
  if (item.type === 'image') return 'image'
  if (item.type === 'story') return 'story'
  if (item.type === 'voice') return 'voice'
  
  // 兼容没有type字段的旧数据
  if (item.text) return 'quote'
  if (item.url && !item.text) return 'image'
  if (item.title && item.content) return 'story'
  if (item.name && item.emoji) return 'voice'
  return 'unknown'
}

function getDisplayText(item) {
  // 兼容不同来源的收藏数据结构
  if (item.text) return item.text
  if (item.content) return item.content
  if (item.extra && item.extra.text) return item.extra.text
  if (item.extra && item.extra.title) return item.extra.title
  if (item.extra && item.extra.prompt) return item.extra.prompt
  return '收藏内容'
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function removeItem(id) {
  itemToDelete.value = id
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (itemToDelete.value) {
    await store.removeCollection(itemToDelete.value)
  }
  showDeleteConfirm.value = false
  itemToDelete.value = null
}

function handleImageError(e) {
  e.target.src = 'https://via.placeholder.com/400x300?text=图片加载失败'
}

onMounted(async () => {
  await store.loadCollections()
})
</script>

<style scoped>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
