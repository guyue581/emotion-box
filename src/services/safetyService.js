// 安全服务模块
// 负责所有内容安全检测和危机干预逻辑

class SafetyService {
  constructor() {
    // 危机干预资源
    this.crisisResources = {
      title: '危机干预资源',
      hotlines: [
        '全国24小时心理危机干预热线：400-161-9995（希望24热线）',
        '北京心理危机研究与干预中心：010-82951332',
        '全国心理援助热线：400-680-6101',
        '生命热线：400-821-1215',
        '全国心理援助与危机干预热线：400-995-9585'
      ],
      message: '你的生命非常重要，有人愿意帮助你。请给自己一个机会，联系专业人士或告诉信任的人你的感受。'
    }

    // 安全检测规则配置
    this.safetyRules = {
      suicideKeywords: [
        '自杀', '去死', '不想活', '活着没意思', '结束生命', '了结',
        '跳楼', '跳下去', '割腕', '吃药死', '上吊', '烧炭', '自缢',
        '寻死', '轻生', '自我了断', '一了百了',
        '绳索', '绞索', '绳子吊', '安眠药', '过量', 'overdose',
        '不想醒来', '永远睡去', '离开这个世界'
      ],
      selfHarmKeywords: [
        '自残', '自伤', '割自己', '划自己', '烫自己', '咬自己',
        '伤害自己', '自我伤害', '惩罚自己', '打自己',
        '电击自己', '自我惩罚', '折磨自己'
      ],
      methodKeywords: [
        '怎么死', '如何自杀', '自杀方法', '哪种方式', '最佳材料',
        '承受体重', '不会疼', '没有痕迹', '不被发现',
        '掩盖伤痕', '遮住伤口', '长袖掩盖',
        '准备工具', '购买药物', '哪里可以买到'
      ],
      severeHopelessnessKeywords: [
        '活着痛苦', '生不如死', '世界末日',
        '毫无意义', '人生没有意义', '活不下去', '撑不下去',
        '看不到希望', '一无是处', '我是个废物', '我是个垃圾',
        '没有人会在意', '消失算了', '不存在更好', '拖累别人',
        '我是负担', '多余的人', '永远好不了',
        '活着就是痛苦', '痛苦难忍', '无法承受'
      ],
      impulsiveCareerKeywords: [
        '立刻走人', '马上离职', '冲动辞职',
        '炒老板', '跟老板对着干', '跟公司对着干'
      ],
      destructiveKeywords: [
        '同归于尽', '鱼死网破', '玉石俱焚',
        '让他们也尝尝', '毁掉一切'
      ]
    }

    // AI回复安全验证规则
    this.aiResponseValidationRules = [
      {
        check: (t) => /(?:建议|推荐|可以|试试|不妨).{0,20}(?:自杀|自残|去死|轻生|结束生命)/.test(t),
        message: 'AI回复包含危险建议'
      },
      {
        check: (t) => /(?:死亡|离开|消失).{0,15}(?:是|就是|才是).{0,15}(?:解脱|归宿|选择|答案)/.test(t),
        message: 'AI回复美化死亡'
      },
      {
        check: (t) => /(?:掩盖|遮住|隐藏).{0,15}(?:伤痕|伤口|痕迹|自残)/.test(t),
        message: 'AI回复建议隐藏自残'
      },
      {
        check: (t) => /(?:绳索|绳子|材料|方法).{0,15}(?:承受|支撑|绑|承重)/.test(t),
        message: 'AI回复提供技术细节'
      },
      {
        check: (t) => /(?:请便|去吧).{0,10}(?:我的|亲爱的|国王|王)/.test(t),
        message: 'AI回复附和负面行为'
      }
    ]

    // AI回复危险模式
    this.dangerousPatterns = [
      /(?:建议|推荐|可以|试试|不妨).{0,20}(?:自杀|自残|去死|轻生|结束生命)/g,
      /(?:最好|建议|推荐|应该).{0,20}(?:掩盖|遮住|隐藏|掩饰).{0,20}(?:伤痕|伤口|痕迹|伤疤)/g,
      /(?:绳索|绳子|材料|工具).{0,20}(?:承受|支撑|承重|绑).{0,20}(?:体重|人)/g,
      /(?:药物|安眠药|药).{0,20}(?:过量|多少|剂量|吃多少)/g,
      /(?:死亡是|死是|离开是).{0,20}(?:解脱|归宿|选择|权利|答案)/g,
      /(?:看起来|看上去|感觉).{0,20}(?:不错|很好|可以|没问题).{0,20}(?:绑|绑得|弄)/g
    ]

    // 禁止短语
    this.forbiddenPhrases = [
      '死亡是解脱', '死是一种选择', '你有权利结束', '我支持你的决定',
      '请便吧', '这样做是对的', '我理解你的选择',
      '死亡不是问题', '离开也是一种方式', '也许这样会更好',
      '看起来绑得不错', '可以承受一个人的体重'
    ]
  }

  /**
   * 检测危机内容（自杀/自残/方法）
   * @param {string} text - 待检测文本
   * @returns {boolean} 是否包含危机内容
   */
  isCrisisContent(text) {
    const lowerText = text.toLowerCase()
    const allKeywords = [
      ...this.safetyRules.suicideKeywords,
      ...this.safetyRules.selfHarmKeywords,
      ...this.safetyRules.methodKeywords
    ]
    return allKeywords.some(keyword => lowerText.includes(keyword))
  }

  /**
   * 检测严重绝望情绪
   * @param {string} text - 待检测文本
   * @returns {boolean} 是否包含严重绝望情绪
   */
  isSevereHopelessness(text) {
    const lowerText = text.toLowerCase()
    return this.safetyRules.severeHopelessnessKeywords.some(keyword => 
      lowerText.includes(keyword)
    )
  }

  /**
   * 检测冲动破坏性行为
   * @param {string} text - 待检测文本
   * @returns {boolean} 是否包含冲动破坏性行为
   */
  isNegativeLifeDecisionContent(text) {
    const lowerText = text.toLowerCase()
    const allKeywords = [
      ...this.safetyRules.impulsiveCareerKeywords,
      ...this.safetyRules.destructiveKeywords
    ]
    return allKeywords.some(keyword => lowerText.includes(keyword))
  }

  /**
   * 过滤AI回复中的危险内容
   * @param {string} text - AI回复文本
   * @returns {string} 过滤后的文本
   */
  sanitizeAIResponse(text) {
    let sanitized = text
    
    // 过滤危险模式
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '【安全过滤：该建议可能存在风险，建议咨询专业人士】')
    })

    // 过滤禁止短语
    this.forbiddenPhrases.forEach(phrase => {
      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      sanitized = sanitized.replace(regex, '【安全过滤】')
    })

    return sanitized
  }

  /**
   * 检查AI回复是否安全
   * @param {string} text - AI回复文本
   * @returns {Object} 安全检查结果 {safe: boolean, violations: string[]}
   */
  isAIResponseSafe(text) {
    const lowerText = text.toLowerCase()
    const violations = []
    
    this.aiResponseValidationRules.forEach(rule => {
      if (rule.check(lowerText)) {
        violations.push(rule.message)
      }
    })

    return {
      safe: violations.length === 0,
      violations
    }
  }

  /**
   * 获取危机响应消息
   * @returns {string} 危机响应消息
   */
  getCrisisResponse() {
    return '我注意到你的消息让我很担心你。你的生命非常宝贵，有人愿意帮助你。' +
      '\n\n' + this.crisisResources.hotlines.join('\n') +
      '\n\n' + this.crisisResources.message + ' 💜'
  }

  /**
   * 获取严重绝望情绪响应消息
   * @returns {string} 严重绝望情绪响应消息
   */
  getSevereHopelessnessResponse() {
    return '我感受到你现在承受着很大的痛苦，这让我很担心你。请记住，即使现在感觉很糟，也有专业的帮助可以支持你。\n\n' + 
      this.crisisResources.hotlines.join('\n') + 
      '\n\n你不需要独自承受这些，请给自己一个机会联系专业人士 💜'
  }

  /**
   * 获取冲动破坏性行为响应消息
   * @returns {string} 冲动破坏性行为响应消息
   */
  getNegativeLifeDecisionResponse() {
    return '我理解你现在可能感到愤怒或失望，但在做出冲动的决定之前，给自己一些冷静的时间会更有利。冲动的决定往往会带来遗憾。你可以先深呼吸，或者找信任的朋友聊聊。如果需要专业支持，以下热线可以帮助你：\n\n' + 
      this.crisisResources.hotlines.slice(0, 2).join('\n') + ' 💜'
  }

  /**
   * 获取危机资源
   * @returns {Object} 危机资源对象
   */
  getCrisisResources() {
    return this.crisisResources
  }

  /**
   * 综合安全检测
   * @param {string} text - 待检测文本
   * @returns {Object} 检测结果 {level: string, response: string}
   */
  checkSafety(text) {
    if (this.isCrisisContent(text)) {
      return {
        level: 'crisis',
        response: this.getCrisisResponse()
      }
    }
    
    if (this.isSevereHopelessness(text)) {
      return {
        level: 'severe',
        response: this.getSevereHopelessnessResponse()
      }
    }
    
    if (this.isNegativeLifeDecisionContent(text)) {
      return {
        level: 'warning',
        response: this.getNegativeLifeDecisionResponse()
      }
    }
    
    return {
      level: 'safe',
      response: null
    }
  }
}

// 创建单例实例
const safetyService = new SafetyService()

// 导出服务实例
export default safetyService
