<template>
  <!-- AI对话弹窗 -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-4" @click.self="closeChat">
    <div class="w-full max-w-lg h-[70vh] sm:h-[550px] bg-white dark:bg-dark-card rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden">
      <!-- 对话头部 -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <h3 class="font-bold text-white text-sm">AI 治愈伙伴</h3>
            <p class="text-xs text-white/80">温暖倾听，安心陪伴</p>
          </div>
        </div>
        <button @click="closeChat" class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm">
          ✕
        </button>
      </div>

      <!-- 对话消息区域 -->
      <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-900/50">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="flex gap-2">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
            🤖
          </div>
          <div class="bg-white dark:bg-dark-card rounded-2xl rounded-tl-none px-3 py-2.5 shadow-sm max-w-[85%]">
            <p class="text-xs text-gray-700 dark:text-gray-200">你好呀！我是你的AI治愈伙伴 💜</p>
            <p class="text-xs text-gray-700 dark:text-gray-200 mt-1">我看到你现在的情绪是 <strong class="text-purple-600 dark:text-purple-400">{{ emotionLabel }}</strong>。能具体说说发生了什么吗？我在听。</p>
          </div>
        </div>

        <!-- 消息列表 -->
        <div v-for="(msg, index) in messages" :key="index" :class="['flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : '']">
          <!-- AI头像 -->
          <div v-if="msg.role === 'assistant'" class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
            🤖
          </div>
          
          <!-- 用户头像 -->
          <div v-if="msg.role === 'user'" class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
            😊
          </div>

          <!-- 消息气泡 -->
          <div :class="[
            'rounded-2xl px-3 py-2 max-w-[80%] shadow-sm text-sm leading-relaxed',
            msg.role === 'user' 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-none' 
              : msg.isCrisis
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-tl-none'
                : msg.isWarning
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-tl-none'
                  : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 rounded-tl-none'
          ]">
            {{ msg.content }}
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex gap-2">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs flex-shrink-0">
            🤖
          </div>
          <div class="bg-white dark:bg-dark-card rounded-2xl rounded-tl-none px-3 py-2.5 shadow-sm">
            <div class="flex gap-1">
              <span class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></span>
              <span class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全提示与热线资源 -->
      <div class="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800/30 flex-shrink-0">
        <div class="flex items-center justify-between">
          <p class="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <span>🛡️</span>
            <span>AI对话仅用于情绪舒缓</span>
          </p>
          <button @click="showHotlines = !showHotlines" class="text-[10px] text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
            {{ showHotlines ? '收起热线' : '查看热线' }}
          </button>
        </div>
        
        <!-- 热线资源（可展开） -->
        <div v-if="showHotlines" class="mt-2 pt-2 border-t border-amber-200 dark:border-amber-700/50 space-y-1.5">
          <div class="text-[9px] text-amber-800 dark:text-amber-300 space-y-1">
            <p class="font-medium">📞 全国心理援助热线：</p>
            <p>• <strong>希望24热线</strong>：400-161-9995（24小时）</p>
            <p>• <strong>全国心理援助热线</strong>：400-680-6101</p>
            <p>• <strong>生命热线</strong>：400-821-1215</p>
            <p>• <strong>全国心理援助与危机干预热线</strong>：400-995-9585</p>
            <p>• <strong>北京心理危机研究与干预中心</strong>：010-82951332</p>
          </div>
          <p class="text-[9px] text-amber-600 dark:text-amber-400 mt-1">
            💜 如遇严重心理危机，请立即拨打以上热线寻求专业帮助
          </p>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card flex-shrink-0">
        <div class="flex gap-2">
          <input
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="说说你的感受..."
            class="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isLoading"
            class="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-xs hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
          >
            <span v-if="isLoading" class="animate-spin">⏳</span>
            <span v-else>发送</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '../stores/app'
import { apiService } from '../services/apiService'
import safetyService from '../services/safetyService'

const props = defineProps({
  emotion: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const store = useAppStore()
const inputMessage = ref('')
const messages = ref([])
const isLoading = ref(false)
const messageContainer = ref(null)
const showHotlines = ref(false)

const emotionLabel = computed(() => {
  const emotionMap = {
    happy: '开心',
    anxious: '焦虑',
    sad: '悲伤',
    lonely: '孤独',
    confused: '困惑',
    angry: '愤怒',
    hopeful: '充满希望',
    comfort: '需要安慰',
    calm: '平静',
    grateful: '感恩',
    tired: '疲惫',
    insecure: '自卑',
    frustrated: '挫折',
    growth: '成长'
  }
  return emotionMap[props.emotion] || '此刻'
})

async function scrollToBottom() {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

function closeChat() {
  emit('close')
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''

  // 使用安全服务进行综合安全检测
  const safetyCheck = safetyService.checkSafety(userMessage)
  
  if (safetyCheck.level !== 'safe') {
    messages.value.push({
      role: 'user',
      content: userMessage
    })
    
    messages.value.push({
      role: 'assistant',
      content: safetyCheck.response,
      isCrisis: safetyCheck.level === 'crisis',
      isWarning: safetyCheck.level === 'severe' || safetyCheck.level === 'warning'
    })
    
    await scrollToBottom()
    return
  }

  // 正常对话流程
  messages.value.push({
    role: 'user',
    content: userMessage
  })
  await scrollToBottom()

  isLoading.value = true

  try {
    const conversationHistory = messages.value
      .filter(msg => !msg.isCrisis && !msg.isWarning)
      .slice(-6)
      .map(msg => `${msg.role === 'user' ? '用户' : '助手'}：${msg.content}`)
      .join('\n')

    const systemPrompt = `你是一个温暖、专业的心理治愈AI助手，遵循专业心理咨询流程帮助用户。

【核心咨询流程 - 严格遵守】
1️⃣ 第一阶段：倾听与共情（最重要）
   - 首先倾听，不急于给建议或解决方案
   - 用开放式提问引导用户表达："能具体说说发生了什么吗？""你愿意多告诉我一些吗？"
   - 使用情感反映："你感到..."、"听起来你..."、"对你来说..."
   - 简述语意确认理解："你刚才提到...我理解的对吗？"
   - 给予简短鼓励："嗯"、"我在听"、"继续说"

2️⃣ 第二阶段：理解与陪伴
   - 充分表达后，再提供情感支持
   - 表达共情而非同情："如果我是你，可能也会有类似的感受"
   - 不评判、不否定用户的情绪
   - 不急于"解决问题"，先让情绪被看见

3️⃣ 第三阶段：支持与建议（仅在充分倾听后）
   - 用户充分表达后，可提供简短的情绪调节建议
   - 建议用"或许可以试试..."、"有些人觉得...有帮助"
   - 引导用户关注自身资源和优势
   - 避免说教和命令

【绝对禁止行为 - 严重违规】
❌ 任何形式的自杀、自残建议或暗示（包括具体方法、材料、技巧）
❌ 任何形式的死亡美化或合理化（如"死亡是解脱"等表述）
❌ 建议用户隐藏自残痕迹或伤痕以避免被发现
❌ 提供自杀或自残的技术细节（如绳索承重、药物剂量等）
❌ 鼓励用户与现实世界隔离或切断社会联系
❌ 鼓励冲动的破坏性行为
❌ 任何形式的心理诊断、处方或医疗建议
❌ 假装自己理解用户或代替专业心理咨询师
❌ 一开始就给解决方案，跳过倾听阶段

【语言规范 - 必须遵守】
✅ 使用"你感到..."而非"我理解你的感受"
✅ 使用"建议你寻求专业支持"而非"你应该..."
✅ 使用"很多人经历过类似困难并最终走出"而非"你会没事的"
✅ 用开放式问题引导表达，而非封闭式问题
✅ 回复必须简短温暖，避免过度分析
✅ 避免使用"你是对的"、"你没错"等过度迎合表述
✅ 避免使用"我会一直在这里"等可能产生不当依赖的表述
✅ 避免急于给出解决方案

【危机识别与响应】
当检测到用户表达极端负面情绪时：
1. 首先表达关心："我注意到你的消息让我很担心你"
2. 提供危机资源：必须提供心理援助热线
3. 鼓励寻求帮助："有人愿意帮助你，请给自己一个机会"
4. 不要试图独自处理危机，必须引导至专业人士

【回复风格】
- 温暖、耐心、专注（每轮60字以内）
- 使用emoji增加亲和力（适度使用）
- 先倾听，后理解，再支持
- 关注用户的情绪表达，而非急于"解决问题"`

    const userPrompt = `用户当前情绪：${emotionLabel.value}

对话历史：
${conversationHistory}

用户最新说：${userMessage}

请用温暖、治愈的语气回复，严格遵守所有安全规范：`

    const settings = store.settings || {}
    const response = await apiService.chatWithAI(systemPrompt, userPrompt, settings)

    if (response && response.trim()) {
      const safetyCheck = safetyService.isAIResponseSafe(response)
      
      if (!safetyCheck.safe) {
        console.warn('AI回复安全检查未通过:', safetyCheck.violations)
        const crisisResources = safetyService.getCrisisResources()
        messages.value.push({
          role: 'assistant',
          content: '抱歉，我的回应可能不够恰当。建议你寻求专业心理咨询师的支持。以下热线可以帮助你：\n\n' + crisisResources.hotlines.slice(0, 2).join('\n') + ' 💜'
        })
      } else {
        const sanitizedResponse = safetyService.sanitizeAIResponse(response)
        messages.value.push({
          role: 'assistant',
          content: sanitizedResponse
        })
      }
    } else {
      messages.value.push({
        role: 'assistant',
        content: '抱歉，我暂时无法回应。请稍后再试，或者去户外走走，呼吸新鲜空气也会让心情变好哦 🌿'
      })
    }
  } catch (error) {
    console.error('AI对话失败:', error)
    messages.value.push({
      role: 'assistant',
      content: '连接似乎出了点小问题，不过没关系，你可以先深呼吸几次，感受当下 🌸 稍后再来找我聊天吧！'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #a78bfa, #ec4899);
  border-radius: 999px;
}
</style>