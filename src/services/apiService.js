// API服务模块 - 支持多种AI模型

class ApiService {
  constructor() {
    this.apiEndpoints = {
      doubao: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      deepseek: 'https://api.deepseek.com/v1/chat/completions',
      qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      kimi: 'https://api.moonshot.cn/v1/chat/completions',
      siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
      glm: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      ernie: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
      spark: 'https://spark-api-open.xf-yun.com/v1/chat/completions'
    }
    
    this.modelNames = {
      doubao: 'doubao-seed-2-0-pro-260215',
      deepseek: 'deepseek-v4-flash',
      qwen: 'qwen3.5-plus',
      kimi: 'kimi-k2.5',
      siliconflow: 'deepseek-ai/DeepSeek-V3',
      glm: 'glm-5',
      ernie: 'ernie-4.0-8k',
      spark: '4.0Ultra'
    }
  }
  
  async getQuoteFromAI(emotion, settings) {
    if (!settings.apiType || settings.apiType === 'none') {
      return null
    }
    
    const { apiType, apiKey, authType, ak, sk, modelName } = settings
    
    try {
      const messages = [
        {
          role: 'system',
          content: '你是一个治愈系AI，专门为用户提供温暖、鼓励的话语。根据用户的情绪状态，生成一句简短、温馨的治愈语录，不要添加任何额外的解释或说明。语录要积极向上，充满正能量。'
        },
        {
          role: 'user',
          content: `用户现在的情绪是：${emotion}。请生成一句治愈语录。`
        }
      ]
      
      let response
      switch (apiType) {
        case 'doubao':
          response = await this.callDoubaoAPI(messages, apiKey, authType, ak, sk, modelName)
          break
        case 'deepseek':
          response = await this.callDeepSeekAPI(messages, apiKey, modelName)
          break
        case 'qwen':
          response = await this.callQwenAPI(messages, apiKey, modelName)
          break
        case 'kimi':
          response = await this.callKimiAPI(messages, apiKey, modelName)
          break
        case 'siliconflow':
          response = await this.callSiliconFlowAPI(messages, apiKey, modelName)
          break
        case 'glm':
          response = await this.callGLMAPI(messages, apiKey, modelName)
          break
        case 'ernie':
          response = await this.callErnieAPI(messages, apiKey, modelName)
          break
        case 'spark':
          response = await this.callSparkAPI(messages, apiKey, modelName)
          break
        default:
          return null
      }
      
      return this.extractContentFromResponse(response, apiType)
    } catch (error) {
      console.error('API调用失败:', error)
      return null
    }
  }
  
  // AI对话功能 - 支持多轮对话
  async chatWithAI(systemPrompt, userPrompt, settings) {
    if (!settings.apiType || settings.apiType === 'none') {
      return null
    }
    
    const { apiType, apiKey, authType, ak, sk, modelName } = settings
    
    try {
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ]
      
      let response
      switch (apiType) {
        case 'doubao':
          response = await this.callDoubaoAPI(messages, apiKey, authType, ak, sk, modelName)
          break
        case 'deepseek':
          response = await this.callDeepSeekAPI(messages, apiKey, modelName)
          break
        case 'qwen':
          response = await this.callQwenAPI(messages, apiKey, modelName)
          break
        case 'kimi':
          response = await this.callKimiAPI(messages, apiKey, modelName)
          break
        case 'siliconflow':
          response = await this.callSiliconFlowAPI(messages, apiKey, modelName)
          break
        case 'glm':
          response = await this.callGLMAPI(messages, apiKey, modelName)
          break
        default:
          return null
      }
      
      return this.extractContentFromResponse(response, apiType)
    } catch (error) {
      console.error('AI对话API调用失败:', error)
      return null
    }
  }
  
  // 测试API连接
  async testConnection(settings) {
    if (!settings.apiType || settings.apiType === 'none') {
      return { success: false, message: '请选择API类型' }
    }
    
    const { apiType, apiKey, authType, ak, sk, modelName } = settings
    
    try {
      const messages = [
        {
          role: 'user',
          content: '你好，请回复"连接成功"四个字。'
        }
      ]
      
      let response
      switch (apiType) {
        case 'doubao':
          response = await this.callDoubaoAPI(messages, apiKey, authType, ak, sk, modelName)
          break
        case 'deepseek':
          response = await this.callDeepSeekAPI(messages, apiKey, modelName)
          break
        case 'qwen':
          response = await this.callQwenAPI(messages, apiKey, modelName)
          break
        case 'kimi':
          response = await this.callKimiAPI(messages, apiKey, modelName)
          break
        case 'siliconflow':
          response = await this.callSiliconFlowAPI(messages, apiKey, modelName)
          break
        case 'glm':
          response = await this.callGLMAPI(messages, apiKey, modelName)
          break
        default:
          return { success: false, message: '不支持的API类型' }
      }
      
      const content = this.extractContentFromResponse(response, apiType)
      if (content) {
        return { success: true, message: `连接成功！API返回: "${content.substring(0, 20)}..."` }
      } else {
        return { success: false, message: 'API返回为空' }
      }
    } catch (error) {
      return { success: false, message: error.message || '连接失败' }
    }
  }
  
  async detectEmotion(text, settings) {
    if (!settings.apiType || settings.apiType === 'none') {
      return null
    }
    
    const { apiType, apiKey, authType, ak, sk, modelName } = settings
    
    try {
      const messages = [
        {
          role: 'system',
          content: '你是一个情绪分析专家，擅长根据用户的文本内容分析其情绪状态。请从以下情绪中选择一个最符合的：开心、焦虑、悲伤、孤独、困惑、平静、舒适、希望。'
        },
        {
          role: 'user',
          content: `请分析以下文本所表达的情绪：${text}`
        }
      ]
      
      let response
      switch (apiType) {
        case 'doubao':
          response = await this.callDoubaoAPI(messages, apiKey, authType, ak, sk, modelName)
          break
        case 'deepseek':
          response = await this.callDeepSeekAPI(messages, apiKey, modelName)
          break
        case 'qwen':
          response = await this.callQwenAPI(messages, apiKey, modelName)
          break
        case 'kimi':
          response = await this.callKimiAPI(messages, apiKey, modelName)
          break
        case 'siliconflow':
          response = await this.callSiliconFlowAPI(messages, apiKey, modelName)
          break
        case 'glm':
          response = await this.callGLMAPI(messages, apiKey, modelName)
          break
        default:
          return null
      }
      
      const result = this.extractContentFromResponse(response, apiType)
      if (!result) return null
      
      // 提取情绪类型
      const emotionMap = {
        '开心': 'happy',
        '焦虑': 'anxious',
        '悲伤': 'sad',
        '孤独': 'lonely',
        '困惑': 'confused',
        '平静': 'calm',
        '舒适': 'comfort',
        '希望': 'hopeful'
      }
      
      for (const [key, value] of Object.entries(emotionMap)) {
        if (result.includes(key)) {
          return value
        }
      }
      
      return null
    } catch (error) {
      console.error('情绪检测API调用失败:', error)
      return null
    }
  }
  
  async callDoubaoAPI(messages, apiKey, authType, ak, sk, modelName) {
    const endpoint = this.apiEndpoints.doubao
    const model = modelName || this.modelNames.doubao
    
    const payload = {
      model: model,
      messages: messages,
      max_completion_tokens: 500,
      temperature: 0.8
    }
    
    let headers
    if (authType === 'ak_sk' && ak && sk) {
      headers = await this.getDoubaoHeadersWithSignature(payload, ak, sk)
    } else {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`豆包API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  async callDeepSeekAPI(messages, apiKey, modelName) {
    const endpoint = this.apiEndpoints.deepseek
    const model = modelName || this.modelNames.deepseek
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`DeepSeek API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  async callQwenAPI(messages, apiKey, modelName) {
    const endpoint = this.apiEndpoints.qwen
    const model = modelName || this.modelNames.qwen
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`通义千问 API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  async callKimiAPI(messages, apiKey, modelName) {
    const endpoint = this.apiEndpoints.kimi
    const model = modelName || this.modelNames.kimi
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`Kimi API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  async callSiliconFlowAPI(messages, apiKey, modelName) {
    const endpoint = this.apiEndpoints.siliconflow
    const model = modelName || this.modelNames.siliconflow
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`硅基流动 API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  async callGLMAPI(messages, apiKey, modelName) {
    const endpoint = this.apiEndpoints.glm
    const model = modelName || this.modelNames.glm
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`智谱AI API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  async callErnieAPI(messages, apiKey, modelName) {
    const endpoint = this.apiEndpoints.ernie
    const model = modelName || this.modelNames.ernie
    
    const payload = {
      model: model,
      messages: messages,
      max_output_tokens: 500,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`文心一言 API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  async callSparkAPI(messages, apiKey, modelName) {
    const endpoint = this.apiEndpoints.spark
    const model = modelName || this.modelNames.spark
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`讯飞星火 API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  extractContentFromResponse(response, apiType) {
    switch (apiType) {
      case 'doubao':
        if (response.Data && response.Data.output && response.Data.output.choices) {
          return response.Data.output.choices[0]?.message?.content || null
        } else if (response.choices) {
          return response.choices[0]?.message?.content || null
        }
        break
      case 'deepseek':
      case 'qwen':
      case 'kimi':
      case 'siliconflow':
      case 'glm':
      case 'ernie':
      case 'spark':
        if (response.choices) {
          return response.choices[0]?.message?.content || null
        }
        break
    }
    return null
  }
  
  async getDoubaoHeadersWithSignature(payload, ak, sk) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').substring(0, 17) + 'Z'
    const host = 'ark.cn-beijing.volces.com'
    const path = '/api/v3/chat/completions'
    
    const body = JSON.stringify(payload)
    const payloadHash = await this.sha256(body)
    
    const canonicalHeaders = `content-type:application/json; charset=utf-8
host:${host}
x-content-sha256:${payloadHash}
x-date:${timestamp}\n`
    const signedHeaders = 'content-type;host;x-content-sha256;x-date'
    
    const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`
    const canonicalRequestHash = await this.sha256(canonicalRequest)
    
    const credentialScope = `${timestamp.substring(0, 8)}/cn-beijing/ark/request`
    const stringToSign = `VC-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${canonicalRequestHash}`
    
    const signature = await this.hmacSha256(stringToSign, sk)
    const credential = `${ak}/${credentialScope}`
    const authHeader = `VC-HMAC-SHA256 Credential=${credential}, SignedHeaders=${signedHeaders}, Signature=${signature}`
    
    return {
      'Content-Type': 'application/json; charset=utf-8',
      'Host': host,
      'X-Date': timestamp,
      'X-Content-Sha256': payloadHash,
      'Authorization': authHeader
    }
  }
  
  sha256(str) {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    return crypto.subtle.digest('SHA-256', data).then(buffer => {
      return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
    })
  }
  
  hmacSha256(str, key) {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const keyData = encoder.encode(key)
    return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then(importedKey => crypto.subtle.sign('HMAC', importedKey, data))
      .then(buffer => {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
      })
  }
}

export const apiService = new ApiService()
export default apiService