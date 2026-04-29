<template>
  <div class="healing-generator max-w-md mx-auto">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">🌈 治愈生成器</h2>
    </div>

    <!-- 生成类型选择 -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="type in generateTypes"
          :key="type.value"
          @click="selectedType = type.value"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
            selectedType === type.value
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ type.emoji }} {{ type.label }}
        </button>
      </div>
    </div>

    <!-- 生成按钮 -->
    <button 
      v-if="!generating && !currentContent"
      @click="generateContent"
      class="w-full py-4 mb-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <span class="text-xl mr-2">✨</span>
      生成治愈内容
    </button>

    <!-- 加载中 -->
    <div v-if="generating" class="text-center py-8">
      <div class="inline-block animate-spin text-4xl mb-4">🌀</div>
      <p class="text-gray-500 dark:text-gray-400">正在生成治愈内容...</p>
    </div>

    <!-- 生成结果 -->
    <div v-if="currentContent && !generating" class="space-y-4">
      <!-- 语录卡片 -->
      <div v-if="currentContent.type === 'quote'" class="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl shadow-lg p-6">
        <div class="text-4xl mb-4 text-center">💫</div>
        <p class="text-lg text-gray-700 dark:text-gray-200 text-center leading-relaxed mb-4">
          "{{ currentContent.text }}"
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center">— {{ currentContent.author || '治愈语录' }}</p>
      </div>

      <!-- 图片卡片 -->
      <div v-if="currentContent.type === 'image'" class="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl shadow-lg p-4">
        <img 
          :src="currentContent.url" 
          alt="治愈图片"
          class="w-full rounded-xl shadow-md"
          @error="handleImageError"
        />
      </div>

      <!-- 故事卡片 -->
      <div v-if="currentContent.type === 'story'" class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl shadow-lg p-6">
        <div class="text-3xl mb-3 text-center">📖</div>
        <h3 class="font-bold text-gray-800 dark:text-white text-center mb-3">{{ currentContent.title }}</h3>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ currentContent.content }}</p>
      </div>

      <!-- 白噪音卡片 -->
      <div v-if="currentContent.type === 'audio'" class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg p-6">
        <div class="text-center mb-4">
          <button 
            @click="toggleAudio"
            class="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-3xl shadow-lg hover:shadow-xl transition-all"
            :class="{ 'animate-pulse': isPlaying }"
          >
            {{ isPlaying ? '⏸️' : '▶️' }}
          </button>
        </div>
        <p class="text-center text-gray-700 dark:text-gray-300 font-medium">{{ currentContent.title }}</p>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">{{ currentContent.duration }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button 
          @click="regenerate"
          class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          🔄 换一个
        </button>
        <button 
          @click="saveToCollection"
          class="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-colors flex items-center justify-center gap-2"
        >
          ❤️ 收藏
        </button>
      </div>

      <button 
        @click="currentContent = null"
        class="w-full py-2 text-gray-500 dark:text-gray-400 text-sm"
      >
        返回
      </button>
    </div>

    <!-- 历史记录 -->
    <div v-if="!currentContent && !generating" class="history-section">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">📜 最近生成</h3>
      
      <div v-if="store.healingHistory.length === 0" class="text-center py-6 text-gray-400">
        <p class="text-3xl mb-2">🌱</p>
        <p>还没有生成记录，开始创作吧~</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="(item, index) in store.healingHistory.slice(0, 10)" 
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-xl shadow p-3 hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <span class="text-2xl cursor-pointer" @click="currentContent = item">{{ getTypeEmoji(item.type) }}</span>
          <div class="flex-1 min-w-0 cursor-pointer" @click="currentContent = item">
            <p class="text-sm text-gray-700 dark:text-gray-300 truncate">
              {{ getPreviewText(item) }}
            </p>
            <p class="text-xs text-gray-400">{{ formatTime(item.time) }}</p>
          </div>
          <button 
            @click="deleteHistoryItem(index)"
            class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            title="删除"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Toast提示 -->
    <div 
      v-if="toast.show"
      class="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import apiService from '../services/apiService'

const store = useAppStore()

// 生成类型（移除白噪音，与声音盲盒功能去重）
const generateTypes = [
  { value: 'quote', emoji: '💬', label: '治愈语录' },
  { value: 'image', emoji: '🖼️', label: '治愈图片' },
  { value: 'story', emoji: '📖', label: '小故事' },
]

const selectedType = ref('quote')
const generating = ref(false)
const currentContent = ref(null)
const isPlaying = ref(false)
let audioElement = null
let toastTimer = null

const toast = ref({
  show: false,
  message: ''
})

// 方法
function showToast(message) {
  toast.value = { show: true, message }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

async function generateContent() {
  generating.value = true
  
  try {
    let content = null
    
    switch (selectedType.value) {
      case 'quote':
        content = await generateQuote()
        break
      case 'image':
        content = await generateImage()
        break
      case 'story':
        content = await generateStory()
        break
      case 'audio':
        content = getRandomAudio()
        break
    }
    
    if (content) {
      store.setHealingContent(content)
      currentContent.value = content
    }
  } catch (error) {
    console.error('生成失败:', error)
    showToast('生成失败，请重试')
  } finally {
    generating.value = false
  }
}

async function generateQuote() {
  const apiKey = store.settings.apiKey || store.settings.ak
  
  // 如果有API密钥，优先使用AI生成
  if (store.settings.apiType && store.settings.apiType !== 'none' && apiKey) {
    try {
      const prompt = `请生成一句温馨治愈的语录（30字以内），给疲惫的人带来温暖和力量。直接输出JSON格式：{"text": "语录内容", "author": "治愈语录"}`
      
      const response = await apiService.chatWithAI(
        '你是一个治愈系语录创作者，擅长写温暖人心、简洁有力的治愈语录。',
        prompt,
        store.settings
      )
      
      if (response) {
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return {
            type: 'quote',
            text: parsed.text || parsed.content || parsed.quote || '愿你被这个世界温柔以待',
            author: parsed.author || 'AI治愈语录',
            source: 'ai'
          }
        }
      }
    } catch (error) {
      console.error('AI生成语录失败:', error)
    }
  }
  
  // 无API或AI失败时使用本地语录
  const quotes = [
    { text: '今天的不开心就止于此吧，明天依旧光芒万丈', author: '治愈语录' },
    { text: '慢慢来，谁还没有一个努力的过程', author: '治愈语录' },
    { text: '生活总会给你答案，但不会马上告诉你', author: '治愈语录' },
    { text: '温柔是黑暗世界里永恒的光', author: '治愈语录' },
    { text: '把平凡的日子过成诗', author: '治愈语录' },
    { text: '阳光很暖，微风很甜，万物可期', author: '治愈语录' },
    { text: '愿你眼里的星星温柔泛滥，人间值得', author: '治愈语录' },
    { text: '种自己的花，爱自己的宇宙', author: '治愈语录' },
    { text: '别否定自己，你特别好，特别值得', author: '治愈语录' },
    { text: '星星发亮是为了让每一个人都能找到属于自己的星', author: '治愈语录' },
    { text: '生活原本沉闷，但跑起来就会有风', author: '治愈语录' },
    { text: '认真生活，就能找到被藏起来的糖果', author: '治愈语录' },
    { text: '你不必生来勇敢，天赋过人，只要能投入勤奋，诚诚恳恳', author: '治愈语录' },
    { text: '成为更好的人，这是新的约定', author: '治愈语录' },
    { text: '足够优秀再大方拥有，愿你熬过万丈孤独，藏下星辰大海', author: '治愈语录' },
    { text: '前路浩浩荡荡，万事尽可期待', author: '治愈语录' },
    { text: '愿你以渺小启程，以伟大结束', author: '治愈语录' },
    { text: '要善良，要勇敢，要像星星一样努力发光', author: '治愈语录' },
    { text: '最好的状态是未来可期', author: '治愈语录' },
    { text: '熬过最苦的日子，做最酷的自己', author: '治愈语录' },
    { text: '追光的人，终会光芒万丈', author: '治愈语录' },
    { text: '你要悄悄拔尖，然后惊艳所有人', author: '治愈语录' },
    { text: '努力只能及格，拼命才能优秀', author: '治愈语录' },
    { text: '知足且上进，温柔而坚定', author: '治愈语录' },
    { text: '万事都要全力以赴，包括开心', author: '治愈语录' },
    { text: '希望有人觉得认识我是件幸运的事', author: '治愈语录' },
    { text: '如果快乐太难，那么我祝你平安', author: '治愈语录' },
    { text: '愿生活明朗，万物可爱', author: '治愈语录' },
    { text: '日子常新，未来不远', author: '治愈语录' },
    { text: '你特别好，特别温柔，特别值得', author: '治愈语录' },
    { text: '所有的道别里，我最喜欢明天见', author: '治愈语录' },
    { text: '保持热爱，奔赴山海', author: '治愈语录' },
    { text: '山水万程，皆要好运', author: '治愈语录' },
    { text: '凡是过往，皆为序章', author: '治愈语录' },
    { text: '但行好事，莫问前程', author: '治愈语录' },
    { text: '心有猛虎，细嗅蔷薇', author: '治愈语录' },
    { text: '愿你所求皆如愿，所行化坦途', author: '治愈语录' },
    { text: '世间美好与你环环相扣', author: '治愈语录' },
    { text: '愿你被这个世界温柔以待', author: '治愈语录' },
    { text: '即使负重前行，也要向阳而生', author: '治愈语录' },
    { text: '慢慢来，谁还没有一个努力的过程', author: '治愈语录' },
    { text: '生活明朗，万物可爱', author: '治愈语录' },
    { text: '愿你眼里有光，心中有爱', author: '治愈语录' },
    { text: '不为模糊不清的未来担忧，只为清清楚楚的现在努力', author: '治愈语录' },
    { text: '你现在的努力，是为了以后有更多的选择', author: '治愈语录' },
    { text: '不要因为别人的一句话，就丢掉一整天的快乐', author: '治愈语录' },
    { text: '做自己喜欢的事，慢一点也没关系', author: '治愈语录' },
    { text: '愿你一生努力，一生被爱', author: '治愈语录' },
    { text: '所有的幸运，都是努力埋下的伏笔', author: '治愈语录' },
    { text: '与其羡慕别人，不如做好自己', author: '治愈语录' },
    { text: '没有白走的路，每一步都算数', author: '治愈语录' },
    { text: '愿你的生活常温暖，日子总是温柔又闪光', author: '治愈语录' },
    { text: '即使星星碎掉，溢出来的光也很好看', author: '治愈语录' },
    { text: '把耐心留住，惊喜会慢慢酝酿出来', author: '治愈语录' },
    { text: '愿你走过半生，归来仍是少年', author: '治愈语录' },
    { text: '世界很大，请带着努力继续成长', author: '治愈语录' },
    { text: '你要相信，你配得上这世间所有的美好', author: '治愈语录' },
  ]
  
  const quote = quotes[Math.floor(Math.random() * quotes.length)]
  return {
    type: 'quote',
    text: quote.text,
    author: quote.author,
    source: 'local'
  }
}

async function generateImage() {
  const apiKey = store.settings.apiKey || store.settings.ak
  
  // 定义图片主题池，确保文字描述和实际图片内容对应
  const themes = [
    { prompt: '宁静的日落海边，温暖柔和的光线', url: 'https://picsum.photos/seed/sunsetbeach/400/300', keyword: '海边日落' },
    { prompt: '雨后的彩虹，清新自然', url: 'https://picsum.photos/seed/rainbowsky/400/300', keyword: '彩虹' },
    { prompt: '森林中的小木屋，温馨治愈', url: 'https://picsum.photos/seed/forestcabin/400/300', keyword: '森林木屋' },
    { prompt: '可爱的猫咪在阳光下', url: 'https://picsum.photos/seed/catsun/400/300', keyword: '猫咪' },
    { prompt: '星空下的帐篷，浪漫梦幻', url: 'https://picsum.photos/seed/starrytent/400/300', keyword: '星空帐篷' },
    { prompt: '樱花盛开的春天', url: 'https://picsum.photos/seed/cherryblossom/400/300', keyword: '樱花' },
    { prompt: '清晨的薄雾森林', url: 'https://picsum.photos/seed/morningforest/400/300', keyword: '晨雾森林' },
    { prompt: '温暖的咖啡和书本', url: 'https://picsum.photos/seed/coffeebook/400/300', keyword: '咖啡书本' },
    { prompt: '雪山下的湖泊', url: 'https://picsum.photos/seed/snowlake/400/300', keyword: '雪山湖泊' },
    { prompt: '田野里的向日葵', url: 'https://picsum.photos/seed/sunflowerfield/400/300', keyword: '向日葵' },
    { prompt: '夜晚的萤火虫', url: 'https://picsum.photos/seed/fireflynight/400/300', keyword: '萤火虫' },
    { prompt: '秋天的落叶小径', url: 'https://picsum.photos/seed/autumnpat/400/300', keyword: '秋叶小径' },
    { prompt: '海边的灯塔', url: 'https://picsum.photos/seed/sealighthouse/400/300', keyword: '灯塔' },
    { prompt: '雨中的城市街道', url: 'https://picsum.photos/seed/raincity/400/300', keyword: '雨街' },
    { prompt: '山顶的云海日出', url: 'https://picsum.photos/seed/cloudsunrise/400/300', keyword: '云海日出' },
    { prompt: '花园里的蝴蝶', url: 'https://picsum.photos/seed/gardenbutterfly/400/300', keyword: '蝴蝶' },
    { prompt: '雪中的松树', url: 'https://picsum.photos/seed/snowpine/400/300', keyword: '雪松树' },
    { prompt: '湖边的天鹅', url: 'https://picsum.photos/seed/lakeswan/400/300', keyword: '天鹅' },
    { prompt: '沙漠中的绿洲', url: 'https://picsum.photos/seed/desertoasis/400/300', keyword: '绿洲' },
    { prompt: '烛光晚餐', url: 'https://picsum.photos/seed/candledinner/400/300', keyword: '烛光' },
  ]
  
  // 如果有API密钥，使用AI生成图片主题描述
  if (store.settings.apiType && store.settings.apiType !== 'none' && apiKey) {
    try {
      const prompt = `请描述一个治愈系的画面场景（20字以内），例如"夕阳下的海边"、"雨后的彩虹"等。直接输出场景描述即可，不要加任何解释。`
      
      const response = await apiService.chatWithAI(
        '你是一个画面描述专家，擅长用简洁优美的语言描述治愈系场景。',
        prompt,
        store.settings
      )
      
      if (response) {
        // 使用AI生成的描述，但随机选一个主题的图片URL（因为无法真正生成图片）
        const selected = themes[Math.floor(Math.random() * themes.length)]
        return {
          type: 'image',
          prompt: response.trim().substring(0, 30) || selected.prompt,
          url: selected.url,
          source: 'ai'
        }
      }
    } catch (error) {
      console.error('AI生成图片描述失败:', error)
    }
  }
  
  // 无API或AI失败时使用本地主题
  const selected = themes[Math.floor(Math.random() * themes.length)]
  return {
    type: 'image',
    prompt: selected.prompt,
    url: selected.url,
    source: 'local'
  }
}

async function generateStory() {
  const apiKey = store.settings.apiKey || store.settings.ak
  
  // 统一API检查逻辑
  if (!store.settings.apiType || store.settings.apiType === 'none' || !apiKey) {
    return getLocalStory()
  }
  
  try {
    const prompt = `请为用户写一个温馨治愈的短故事（300字以内），主题是给疲惫的人带来安慰。故事要有意义但不要太长。直接输出JSON格式：{"title": "故事标题", "content": "故事内容"}`
    
    const response = await apiService.chatWithAI(
      '你是一个温暖的故事创作者，擅长写治愈系短故事。',
      prompt,
      store.settings
    )
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return {
        type: 'story',
        ...JSON.parse(jsonMatch[0])
      }
    }
  } catch (error) {
    console.error('AI生成失败，使用本地故事:', error)
  }
  
  return getLocalStory()
}

function getLocalStory() {
  const stories = [
    {
      title: '小星星的旅程',
      content: `有一颗小星星，它觉得自己的光太微弱了，总是羡慕太阳和月亮的光芒。

一天晚上，它沮丧地问月亮姐姐："为什么我这么暗淡？"

月亮姐姐温柔地说："你知道吗？正是因为有无数微弱的光，才能汇成璀璨的星空。每一颗星星都有自己的位置，缺了谁都不行。"

小星星眨眨眼，似乎明白了什么。

从那以后，它不再羡慕别人，而是努力地闪烁着属于自己的光芒。因为它知道，在某个仰望星空的人眼里，它的光就是最特别的。

你也一样，不需要成为别人，做自己就好。`
    },
    {
      title: '一杯热可可',
      content: `女孩今天心情很差，一个人坐在咖啡店角落。

服务员走过来，递上一杯热可可："这是店里送的，天冷，喝点暖暖的。"

女孩愣住了："我没点这个..."

"我知道，但看你好像有点不开心。这杯可可没有多特别，只是一点心意。"

女孩捧着温热的杯子，眼眶红了。也许有时候治愈就是这么简单，不需要多华丽的话语，一点点善意就够了。

今天也要加油鸭~`
    },
    {
      title: '种子和希望',
      content: `老爷爷在院子里种下一颗种子。

邻居问："这么冷的天气，能发芽吗？"

老爷爷笑着说："种子知道什么时候该发芽，它只是在等待。"

几周后，嫩绿的芽破土而出。

有些事情不是没有发生，只是在等待对的时机。你现在付出的努力，也许正在土壤里悄悄积蓄力量。

耐心一点，好事正在来的路上。`
    },
    {
      title: '蜗牛和葡萄',
      content: `一只小蜗牛看到葡萄架上的葡萄，很想吃。

小鸟飞过来说："别费劲了，你爬得那么慢，等你爬上去葡萄都烂了。"

小蜗牛没有说话，只是默默地往上爬。

一天、两天、三天... 它终于爬到了葡萄架上。

虽然葡萄已经过季了，但它在攀爬的过程中，看到了从未见过的风景，遇到了志同道合的朋友，还发现了一片更甜的草莓地。

有时候，过程比结果更重要。你努力的每一步，都在悄悄改变你的人生。`
    },
    {
      title: '镜子里的微笑',
      content: `小镇上有一面神奇的镜子，传说对着它微笑的人，一整天都会好运。

小男孩试了试，对着镜子做了一个鬼脸，结果那天他被狗追、摔了一跤、还丢了零花钱。

他不服气，第二天认真地对着镜子微笑。那天他捡到了一块钱、交到了新朋友、还得到了老师的表扬。

他跑去问智者："为什么微笑会有魔法？"

智者说："镜子没有魔法，是你自己。当你微笑时，你看世界的角度就变了。"

原来，改变世界最好的方式，就是先改变自己的表情。`
    },
    {
      title: '最后一班地铁',
      content: `加班到深夜的她，错过了最后一班地铁。

站在空荡荡的站台上，她突然觉得好累，蹲下来抱住了自己。

这时，一个清洁工阿姨走过来，递给她一杯热水："姑娘，喝点热的暖暖身子。"

她抬起头，眼眶湿润了。

阿姨说："我女儿也总加班，每次我都给她留一盏灯。"

她捧着那杯热水，突然觉得自己并不孤单。在这个城市的某个角落，总有人在默默关心着你。

夜深了，但温暖从未缺席。`
    },
    {
      title: '会飞的气球',
      content: `小男孩的气球飞走了，他哭得很伤心。

爸爸指着天空说："你看，气球去和云朵做朋友了。"

小男孩抽泣着问："它还会回来吗？"

"不会了，但它会在天上看着你，变成彩虹的时候，就是它在对你笑。"

多年后，小男孩长大了。每次遇到失去，他都会抬头看看天空。

那些离开的人和事，并没有真正消失，只是换了一种方式陪伴着他。

学会放手，才能拥抱更广阔的天空。`
    },
    {
      title: '盲人和灯笼',
      content: `一个盲人每天晚上都会提着灯笼出门。

路人好奇地问："你又看不见，为什么要提灯笼？"

盲人笑着说："我虽然看不见，但别人能看见我。这样他们就不会撞到我了。"

路人恍然大悟："原来是为了自己啊。"

"不，"盲人说，"是为了别人，也是为了自己。帮助别人，就是帮助自己。"

善良从来不是单向的给予，它在照亮别人的同时，也温暖了自己。

愿你在帮助别人的路上，也遇见属于自己的光。`
    },
    {
      title: '石头和钻石',
      content: `一块石头羡慕钻石的光芒，它问钻石："为什么你能如此闪耀？"

钻石说："因为我承受了千万次的切割。"

石头沉默了。它想起自己一直躲在舒适的山洞里，从未经历过任何打磨。

"痛苦值得吗？"石头问。

"每一次切割都很痛，"钻石说，"但正是这些伤口，让光有了进来的地方。"

石头终于明白了：那些让你痛苦的磨砺，其实是让光照进来的裂缝。

你经历的每一次困难，都在让你变得更加璀璨。`
    },
    {
      title: '蒲公英的约定',
      content: `小蒲公英问妈妈："为什么我们要飞走？留在这里不好吗？"

妈妈说："因为远方有人在等你。"

"可是风会把我吹到哪里呢？"

"不知道，但每一片土地都需要种子，每一个角落都需要希望。"

小蒲公英乘着风飞走了。它落到了沙漠里、山坡上、窗台边... 无论在哪里，它都努力地生根发芽。

一年后，那些曾经荒凉的地方，开满了蒲公英的花。

也许你不知道自己会落在哪里，但请相信，你的存在本身就是一种希望。

去飞吧，去绽放吧，世界需要你。`
    },
    {
      title: '老人的花园',
      content: `小区里有一位老人，每天都会在花园里忙碌。

有人问他："您这么大年纪了，何必这么辛苦？"

老人笑着说："花不会因为我老了就不开，我也不会因为有花就不老。但当我种花的时候，我忘记了老。"

他指着一朵刚开的玫瑰："你看，这朵花昨天还是花苞，今天就开了。生命就是这样，每一天都有新的惊喜。"

路过的人们都会在他的花园前驻足，有人拍照，有人闻香，有人只是静静地看着。

老人说："我种的不是花，是路过的人的笑容。"

原来，治愈别人最好的方式，就是先让自己热爱生活。`
    },
    {
      title: '断弦的琴',
      content: `小提琴家最珍爱的琴断了一根弦。

他很难过，因为这是一把祖传的琴，再也找不到一样的弦了。

他试着用剩下的三根弦演奏，发现音色竟然有一种特别的美——空灵、清澈、带着一丝忧伤。

那场演出，他获得了最高的赞誉。

有记者问他："断了一根弦，为什么还能演奏得这么好？"

他说："人生就像这把琴，不可能永远四根弦都完好。但即使只有三根弦，也能奏出美妙的音乐。"

缺陷不是终点，而是另一种可能的开始。

你的不完美，正是你最独特的地方。`
    }
  ]
  
  return {
    type: 'story',
    ...stories[Math.floor(Math.random() * stories.length)]
  }
}

function getRandomAudio() {
  const audios = [
    { title: '雨后森林', duration: '10分钟循环', url: '' },
    { title: '海浪轻拍', duration: '15分钟循环', url: '' },
    { title: '篝火噼啪', duration: '10分钟循环', url: '' },
    { title: '鸟鸣山间', duration: '20分钟循环', url: '' },
    { title: '深夜虫鸣', duration: '10分钟循环', url: '' },
  ]
  
  return {
    type: 'audio',
    ...audios[Math.floor(Math.random() * audios.length)]
  }
}

function toggleAudio() {
  if (!currentContent.value?.url) {
    showToast('音频功能开发中...')
    return
  }
  
  if (!audioElement) {
    audioElement = new Audio(currentContent.value.url)
    audioElement.loop = true
  }
  
  if (isPlaying.value) {
    audioElement.pause()
    isPlaying.value = false
  } else {
    audioElement.play()
    isPlaying.value = true
  }
}

function regenerate() {
  generateContent()
}

async function saveToCollection() {
  if (!currentContent.value) return
  
  const content = currentContent.value
  
  // 根据类型构建统一的收藏数据
  const collection = {
    id: Date.now().toString(),
    type: content.type,
    timestamp: new Date().toISOString(),
    source: content.source || 'local'
  }
  
  // 根据内容类型填充对应字段
  if (content.type === 'quote') {
    collection.text = content.text
    collection.author = content.author
  } else if (content.type === 'image') {
    collection.url = content.url
    collection.prompt = content.prompt
  } else if (content.type === 'story') {
    collection.title = content.title
    collection.content = content.content
  }
  
  await store.addCollection(collection)
  showToast('已收藏~')
}

function handleImageError(e) {
  e.target.src = 'https://via.placeholder.com/400x300?text=图片加载失败'
}

function getTypeEmoji(type) {
  const typeMap = {
    quote: '💬',
    image: '🖼️',
    story: '📖',
    audio: '🎵'
  }
  return typeMap[type] || '✨'
}

function getPreviewText(item) {
  if (item.text) return item.text.substring(0, 30) + '...'
  if (item.title) return item.title
  if (item.type === 'image') return '🖼️ 治愈图片'
  return '未知内容'
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

function deleteHistoryItem(index) {
  store.removeHealingHistory(index)
  showToast('已删除')
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
})
</script>
