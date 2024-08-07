const fs = require('fs')
const { createTemplateEngine } = require('../dist')

const templateEngine = createTemplateEngine('wx') // 'wx' | 'ali' | 'swan' | 'qq' | 'tt' | 'dd' | 'web' | 'tenon'

const templateCode = templateEngine.buildTemplate({
  baseComponents: ['view', 'button']
})

fs.writeFileSync('src/base.wxml', templateCode)
