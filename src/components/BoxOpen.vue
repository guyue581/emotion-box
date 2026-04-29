<template>
  <div class="max-w-md mx-auto py-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
    <!-- 盲盒容器 -->
    <div class="relative mb-12">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-64 h-64 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <!-- 盲盒 -->
      <div 
        class="box-container perspective-1000"
        @click="!isOpening && startOpen()"
      >
        <!-- 盒子主体 -->
        <div 
          :class="[
            'box-inner preserve-3d',
            isShaking ? 'animate-shake' : 'animate-float',
            isOpening ? 'animate-fade-out' : ''
          ]"
          :style="{
            transform: isOpening ? 'rotateY(180deg) scale(0.8)' : 'rotateY(0deg) scale(1)',
            transition: 'transform 0.8s ease-in-out'
          }"
        >
          <!-- 盒子前面 -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-3xl 
                 shadow-2xl flex items-center justify-center relative overflow-hidden transform-gpu backface-hidden">
            <!-- 装饰条纹 -->
            <div class="absolute inset-0 opacity-20">
              <div class="absolute top-0 left-0 right-0 h-4 bg-white/30"></div>
              <div class="absolute bottom-0 left-0 right-0 h-4 bg-white/30"></div>
              <div class="absolute left-0 top-0 bottom-0 w-4 bg-white/20"></div>
              <div class="absolute right-0 top-0 bottom-0 w-4 bg-white/20"></div>
            </div>
            
            <!-- 盒子蝴蝶结 -->
            <div class="box-bow animate-bounce-light" style="animation-delay: 0.5s;">
            </div>
            
            <!-- 问号 -->
            <span class="text-6xl text-white/90 font-bold animate-pulse">?</span>
            
            <!-- 光晕效果 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            <!-- 星星装饰 -->
            <div v-for="i in 8" :key="i" class="absolute text-white/40" :style="{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              fontSize: `${12 + Math.random() * 8}px`
            }">
              ✨
            </div>
          </div>
          
          <!-- 盒子后面 -->
          <div class="absolute inset-0 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-3xl 
                 shadow-2xl flex items-center justify-center relative overflow-hidden transform-gpu backface-hidden rotate-y-180">
            <span class="text-6xl text-white/90 font-bold">✨</span>
          </div>

        </div>

        <!-- 打开的盒子（动画时显示） -->
        <div 
          v-if="isOpening"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="text-8xl animate-scale-in">🎁</div>
        </div>
      </div>

      <!-- 粒子效果容器 -->
      <canvas ref="confettiCanvas" class="confetti-container" style="z-index: 0;"></canvas>
    </div>

    <!-- 提示文字 -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gradient mb-3 animate-fade-in">
        {{ statusText }}
      </h2>
      <p class="text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto animate-fade-in animate-delay-100">
        {{ subText }}
      </p>
    </div>

    <!-- 开启按钮 -->
    <button
      v-if="!isOpening && !isOpened"
      @click="startOpen"
      class="btn-primary animate-glow text-lg px-8 py-4"
    >
      ✨ 开启盲盒 ✨
    </button>

    <!-- 重试按钮 -->
    <button
      v-if="isOpened"
      @click="reset"
      class="btn-primary text-lg px-8 py-4"
    >
      🔄 再来一次
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import { getRandomQuote } from '../assets/quotes'
import { apiService } from '../services/apiService'
import confetti from 'canvas-confetti'

const store = useAppStore()

const isShaking = ref(false)
const isOpening = ref(false)
const isOpened = ref(false)
const confettiCanvas = ref(null)

// 定时器和动画帧ID，用于组件卸载时清理，防止泄漏
let shakeTimer = null
let openTimer = null
let confettiRafId = null
let confettiInstance = null

const statusText = computed(() => {
  if (isOpening.value) return '正在打开...'
  if (isOpened.value) return '✨ 恭喜你获得治愈语录'
  return '点击开启你的治愈盲盒'
})

const subText = computed(() => {
  if (isOpening.value) return '命运正在揭晓...'
  if (isOpened.value) return '这份温暖只属于你'
  return '每一份温暖都在等待你'
})

function startOpen() {
  if (isOpening.value || isOpened.value) return
  
  isShaking.value = true
  
  // 摇晃1.5秒后打开
  shakeTimer = setTimeout(async () => {
    isShaking.value = false
    isOpening.value = true
    
    // 触发粒子效果
    triggerConfetti()
    
    // 动画结束后显示结果
    openTimer = setTimeout(async () => {
      // 根据情绪获取语录
      const emotion = store.selectedEmotion === 'custom' ? getRandomEmotionForCustom() : store.selectedEmotion
      let quote
      let quoteSource = 'local' // 默认为本地来源
      
      // 尝试从AI获取语录
      if (store.settings?.apiType && store.settings.apiType !== 'none') {
        try {
          const aiQuote = await apiService.getQuoteFromAI(emotion, store.settings)
          if (aiQuote) {
            // 尝试解析AI返回的JSON格式
            let quoteText = aiQuote
            try {
              const jsonMatch = aiQuote.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                quoteText = parsed.text || parsed.content || parsed.quote || aiQuote
              }
            } catch (e) {
              // 不是JSON格式，直接使用原始文本
            }
            quote = quoteText
            quoteSource = 'ai'
          } else {
            // AI获取失败，使用本地语录
            quote = getRandomQuote(emotion)
          }
        } catch (error) {
          console.error('AI API调用失败:', error)
          // API调用失败，使用本地语录
          quote = getRandomQuote(emotion)
        }
      } else {
        // 未配置API，使用本地语录
        quote = getRandomQuote(emotion)
      }
      
      store.setQuote({
        text: quote,
        emotion: emotion,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        source: quoteSource // 添加来源信息
      })
      
      isOpened.value = true
      isOpening.value = false
      store.setView('result')
    }, 1500)
  }, 1500)
}

function getRandomEmotionForCustom() {
  // 对于自定义输入，随机选择一个情绪
  const emotions = ['happy', 'anxious', 'sad', 'lonely', 'confused', 'calm', 'comfort', 'hopeful']
  return emotions[Math.floor(Math.random() * emotions.length)]
}

function triggerConfetti() {
  if (!confettiCanvas.value) return
  
  confettiInstance = confetti.create(confettiCanvas.value, {
    resize: true,
    useWorker: false
  })
  
  // 多次烟花效果
  const duration = 3000
  const end = Date.now() + duration

  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7']

  ;(function frame() {
    // 顶部烟花
    confettiInstance({
      particleCount: 5,
      angle: 90,
      spread: 60,
      origin: { y: 0.5 },
      colors: colors,
      scalar: 1.2
    })
    
    // 左侧烟花
    confettiInstance({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: colors
    })
    
    // 右侧烟花
    confettiInstance({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors: colors
    })

    if (Date.now() < end) {
      confettiRafId = requestAnimationFrame(frame)
    }
  }())
}

function cleanup() {
  // 清除定时器
  if (shakeTimer) {
    clearTimeout(shakeTimer)
    shakeTimer = null
  }
  if (openTimer) {
    clearTimeout(openTimer)
    openTimer = null
  }
  
  // 取消动画帧
  if (confettiRafId) {
    cancelAnimationFrame(confettiRafId)
    confettiRafId = null
  }
  
  // 清理confetti实例
  if (confettiInstance) {
    confettiInstance.reset && confettiInstance.reset()
    confettiInstance = null
  }
  
  // 彻底清理canvas，防止Electron中残留遮挡
  if (confettiCanvas.value) {
    const ctx = confettiCanvas.value.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, confettiCanvas.value.width, confettiCanvas.value.height)
    }
    confettiCanvas.value.style.display = 'none'
    // 从DOM中移除canvas，确保不会遮挡后续页面
    if (confettiCanvas.value.parentNode) {
      confettiCanvas.value.parentNode.removeChild(confettiCanvas.value)
    }
  }
}

function reset() {
  // 先清理进行中的动画
  cleanup()
  
  isShaking.value = false
  isOpening.value = false
  isOpened.value = false
}

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
@keyframes fade-out {
  from {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
  to {
    opacity: 0;
    transform: scale(0.5) rotateY(180deg);
  }
}

.animate-fade-out {
  animation: fade-out 0.8s ease-out forwards;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
