<template>
  <div class="mood-diary-container max-w-md mx-auto">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">📔 心情日记</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">记录今天的心情，让AI陪你分析</p>
    </div>

    <!-- 新建日记按钮 -->
    <button 
      v-if="!isWriting"
      @click="startWriting"
      class="w-full py-4 mb-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <span class="text-xl mr-2">✏️</span>
      写日记
    </button>

    <!-- 写日记表单 -->
    <div v-if="isWriting" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 mb-6">
      <!-- 日期选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📅 日期</label>
        <input 
          type="date" 
          v-model="newDiary.date"
          class="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none"
        />
      </div>

      <!-- 心情选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">😊 此刻心情</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="mood in moods"
            :key="mood.value"
            @click="newDiary.mood = mood.value"
            :class="[
              'px-3 py-2 rounded-xl text-xl transition-all duration-300',
              newDiary.mood === mood.value 
                ? 'bg-pink-100 dark:bg-pink-900 scale-110 shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
            :title="mood.label"
          >
            {{ mood.emoji }}
          </button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ currentMoodLabel }}</p>
      </div>

      <!-- 日记内容 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📝 今天发生了什么</label>
        <textarea
          v-model="newDiary.content"
          placeholder="写下今天让你有感触的事情..."
          rows="5"
          class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none resize-none"
        ></textarea>
        <div class="text-right text-xs text-gray-400 mt-1">{{ newDiary.content.length }}/500</div>
      </div>

      <!-- AI分析开关 -->
      <div class="mb-4 flex items-center justify-between">
        <span class="text-sm text-gray-700 dark:text-gray-300">🤖 AI分析心情</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="newDiary.enableAI" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
        </label>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button 
          @click="cancelWriting"
          class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          取消
        </button>
        <button 
          @click="saveDiary"
          :disabled="!canSave || saving"
          :class="[
            'flex-1 py-3 rounded-xl transition-all',
            canSave && !saving 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ saving ? '保存中...' : '保存日记' }}
        </button>
      </div>
    </div>

    <!-- AI分析结果 -->
    <div v-if="showAnalysis && analysisResult" class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl shadow-lg p-5 mb-6">
      <h3 class="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3">✨ AI分析结果</h3>
      
      <div class="space-y-3">
        <div class="flex items-center">
          <span class="text-2xl mr-3">{{ getMoodEmoji(analysisResult.emotionType) }}</span>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">情绪类型</p>
            <p class="font-medium text-gray-800 dark:text-white">{{ analysisResult.emotionType }}</p>
          </div>
        </div>
        
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">情绪强度</p>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-green-400 to-red-500 rounded-full"
                :style="{ width: analysisResult.intensity * 10 + '%' }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ analysisResult.intensity }}/10</span>
          </div>
        </div>

        <div v-if="analysisResult.keywords?.length">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">关键词</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="kw in analysisResult.keywords" 
              :key="kw"
              class="px-2 py-1 bg-white/70 dark:bg-gray-800/70 rounded-lg text-sm text-purple-600 dark:text-purple-300"
            >
              #{{ kw }}
            </span>
          </div>
        </div>

        <div v-if="analysisResult.suggestions?.length">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">💝 温暖的话</p>
          <p class="text-gray-700 dark:text-gray-300 italic">{{ analysisResult.suggestions[0] }}</p>
        </div>
      </div>
    </div>

    <!-- 日记列表 -->
    <div class="diary-list">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">📚 历史日记</h3>
      
      <div v-if="filteredDiaries.length === 0" class="text-center py-8 text-gray-400">
        <p class="text-4xl mb-2">📭</p>
        <p>还没有日记，写下第一篇吧~</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="diary in filteredDiaries" 
          :key="diary.id"
          @click="viewDiary(diary)"
          class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ getMoodEmoji(diary.mood) }}</span>
              <div>
                <p class="font-medium text-gray-800 dark:text-white">{{ formatDate(diary.date) }}</p>
                <p class="text-xs text-gray-400">{{ getMoodLabel(diary.mood) }}</p>
              </div>
            </div>
            <button 
              @click.stop="confirmDelete(diary)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              🗑️
            </button>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{{ diary.content }}</p>
          <div v-if="diary.aiAnalysis" class="mt-2 text-xs text-purple-500">
            ✨ AI分析: {{ diary.aiAnalysis.emotionType }}
          </div>
        </div>
      </div>
    </div>

    <!-- 日记详情弹窗 -->
    <div v-if="viewingDiary" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="viewingDiary = null">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ getMoodEmoji(viewingDiary.mood) }}</span>
            <div>
              <p class="font-bold text-lg text-gray-800 dark:text-white">{{ formatDate(viewingDiary.date) }}</p>
              <p class="text-sm text-gray-500">{{ getMoodLabel(viewingDiary.mood) }}</p>
            </div>
          </div>
          <button @click="viewingDiary = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">{{ viewingDiary.content }}</p>
        <div v-if="viewingDiary.aiAnalysis" class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 class="font-bold text-purple-600 dark:text-purple-400 mb-2">✨ AI分析</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">情绪强度: {{ viewingDiary.aiAnalysis.intensity }}/10</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">关键词: {{ viewingDiary.aiAnalysis.keywords?.join(', ') }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 italic">{{ viewingDiary.aiAnalysis.suggestions?.[0] }}</p>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="deletingDiary" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="deletingDiary = null">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">确认删除</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">确定要删除这篇日记吗？删除后无法恢复。</p>
        <div class="flex gap-3">
          <button @click="deletingDiary = null" class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl">取消</button>
          <button @click="doDelete" class="flex-1 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import apiService from '../services/apiService'

const store = useAppStore()

// 心情选项
const moods = [
  { value: 'happy', emoji: '😊', label: '开心' },
  { value: 'sad', emoji: '😢', label: '难过' },
  { value: 'angry', emoji: '😠', label: '生气' },
  { value: 'anxious', emoji: '😰', label: '焦虑' },
  { value: 'tired', emoji: '😴', label: '疲惫' },
  { value: 'loved', emoji: '❤️', label: '幸福' },
  { value: 'calm', emoji: '😐', label: '平静' },
  { value: 'excited', emoji: '🤩', label: '兴奋' },
]

const currentMoodLabel = computed(() => {
  const mood = moods.find(m => m.value === newDiary.value.mood)
  return mood ? mood.label : '请选择心情'
})

// 状态
const isWriting = ref(false)
const saving = ref(false)
const showAnalysis = ref(false)
const analysisResult = ref(null)
const viewingDiary = ref(null)
const deletingDiary = ref(null)

const newDiary = ref({
  date: new Date().toISOString().split('T')[0],
  mood: '',
  content: '',
  enableAI: true,
  aiAnalysis: null
})

// 计算属性
const canSave = computed(() => {
  return newDiary.value.mood && newDiary.value.content.trim().length > 0
})

const filteredDiaries = computed(() => {
  return store.moodDiaries.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 方法
function startWriting() {
  isWriting.value = true
  showAnalysis.value = false
  analysisResult.value = null
  newDiary.value = {
    date: new Date().toISOString().split('T')[0],
    mood: '',
    content: '',
    enableAI: true,
    aiAnalysis: null
  }
}

function cancelWriting() {
  isWriting.value = false
  showAnalysis.value = false
}

async function saveDiary() {
  if (!canSave.value || saving.value) return
  
  saving.value = true
  
  try {
    let aiAnalysis = null
    
    // 如果开启AI分析，先进行分析但不阻塞保存
    if (newDiary.value.enableAI && newDiary.value.content) {
      try {
        aiAnalysis = await analyzeMood(newDiary.value.content)
        analysisResult.value = aiAnalysis
      } catch (aiError) {
        console.error('AI分析失败，继续保存日记:', aiError)
        aiAnalysis = {
          emotionType: '分析中',
          intensity: 5,
          keywords: [],
          suggestions: ['每一天都是新的开始，保持微笑~']
        }
      }
    }
    
    const diary = {
      id: Date.now().toString(),
      date: newDiary.value.date,
      mood: newDiary.value.mood,
      content: newDiary.value.content,
      enableAI: newDiary.value.enableAI,
      aiAnalysis: aiAnalysis,
      timestamp: new Date().toISOString()
    }
    
    await store.saveMoodDiary(diary)
    
    // 显示分析结果（如果有）
    if (aiAnalysis) {
      showAnalysis.value = true
    }
    
    isWriting.value = false
    
    // 重置表单
    newDiary.value = {
      date: new Date().toISOString().split('T')[0],
      mood: '',
      content: '',
      enableAI: true,
      aiAnalysis: null
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

async function analyzeMood(content) {
  if (!store.settings.apiType || store.settings.apiType === 'none') {
    return {
      emotionType: '需要配置AI API',
      intensity: 5,
      keywords: [],
      suggestions: ['请在设置中配置AI API以获得更准确的分析']
    }
  }
  
  try {
    const prompt = `请分析以下日记内容的情绪状态，返回JSON格式：
    {
      "emotionType": "主要情绪（如：开心、难过、焦虑、平静等）",
      "intensity": 1-10的情绪强度数字,
      "keywords": ["关键词1", "关键词2"],
      "suggestions": ["一句温暖的建议"]
    }
    
    日记内容：${content}`
    
    const response = await apiService.chatWithAI(
      '你是一个情绪分析专家，擅长分析用户的日记内容并给出温暖建议。',
      prompt,
      store.settings
    )
    
    // 尝试解析JSON
    if (response) {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0])
        } catch (e) {
          console.error('JSON解析失败:', e)
        }
      }
    }
    
    return {
      emotionType: '温暖',
      intensity: 7,
      keywords: ['治愈'],
      suggestions: ['继续保持好心情~']
    }
  } catch (error) {
    console.error('AI分析失败:', error)
    return {
      emotionType: '分析中',
      intensity: 5,
      keywords: [],
      suggestions: ['每一天都是新的开始，保持微笑~']
    }
  }
}

function viewDiary(diary) {
  viewingDiary.value = diary
}

function confirmDelete(diary) {
  deletingDiary.value = diary
}

async function doDelete() {
  if (deletingDiary.value) {
    await store.deleteMoodDiary(deletingDiary.value.id)
    deletingDiary.value = null
    viewingDiary.value = null
  }
}

function getMoodEmoji(mood) {
  const m = moods.find(item => item.value === mood)
  return m ? m.emoji : '😐'
}

function getMoodLabel(mood) {
  const m = moods.find(item => item.value === mood)
  return m ? m.label : '未知'
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][date.getDay()]}`
}

// 初始化
onMounted(() => {
  store.loadMoodDiaries()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
