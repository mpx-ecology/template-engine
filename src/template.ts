/**
 * Fork from \@tarojs/shared for generating base template
 *
 * 这里我们需要关心的小程序种类有两类：
 * 1. 模板递归：
 *  - 支持：tmpl0 套 tmpl0
 *  - 不支持：这就使得我们必须生成多级的模板，tmpl0 套 tmpl1，tmpl1 套 tmpl2……
 *           直到超过阈值 N (N = config.miniapp.baseLevel) tmplN 会套组件 comp，组件 comp 重新再套 tmpl0。
 * 2. 小程序脚本语言（wxs, sjs, etc...）：
 *  - 支持：可以在模板使用函数缩减模板大小或提高性能（存疑），例如判断一个值是不是假值（falsy value）。
 *         将来或许会把数据序列化^1 的操作也放到小程序脚本语言里。
 *  - 不支持：使用纯 *xml 语法
 *
 */

import { InputOptions, BaseTemplate, SUPPORT_MODE } from './baseTemplate'
import { toHtml } from './h'

export { InputOptions }

export class RecursiveTemplate extends BaseTemplate {
  isSupportRecursive = true

  public buildTemplate = (inputOptions: InputOptions) => {
    this.normalizeInputOptions(inputOptions)
    const code = `
      const nextLevel = 0;
      return \`${toHtml([
        this.buildBaseTemplate(),
        ...this.buildComponentsTemplate(this.buildOptions),
        this.buildPlainTextTemplate(),
        ...this.buildThirdPartyTemplate(this.buildOptions),
        this.buildContainerTemplate()
      ])}\`
    `
    const template = new Function('level', code)(0)
    return template
  }
}

export class UnRecursiveTemplate extends BaseTemplate {
  isSupportRecursive = false

  public buildTemplate = (inputOptions: InputOptions) => {
    this.normalizeInputOptions(inputOptions)
    const buildFloor = this.createFloorBuilder()
    const template = new Array(this.baseLevel)
      .fill('')
      .reduce(
        (a, _, i) => a + buildFloor(i),
        `${toHtml([this.buildBaseTemplate()])}`
      )
    return template
  }

  protected createFloorBuilder() {
    const code = `
    const nextLevel = level + 1;
    const restart = ${this.baseLevel} === nextLevel;
    if (restart) return \`${toHtml(this.buildContainerTemplate(true))}\`;
    return \`${toHtml([
      ...this.buildComponentsTemplate(this.buildOptions),
      this.buildPlainTextTemplate(),
      ...this.buildThirdPartyTemplate(this.buildOptions),
      this.buildContainerTemplate()
    ])}\`
    `
    return new Function('level', code)
  }
}

export function createTemplateEngine(mode?: SUPPORT_MODE) {
  if (mode === 'ali') return new RecursiveTemplate(mode)
  return new UnRecursiveTemplate(mode)
}

export function createSetupTemplate() {
  return `<template is="t_0_container" data="{{ i: r }}" wx:if="{{r && r.nt}}"></template>`
}

export function createSetupWxsTemplate() {
  return `<wxs module="xs" src="~@mpxjs/template-engine/dist/utils.wxs"/>`
}

export function createCustomElementTemplate(prefix = '') {
  return `<template>${prefix ? '\n  ' + prefix : ''}
  ${createSetupWxsTemplate()}
</template>

<script>
// element 里面需要承载所有需要走运行时渲染的组件
import { createComponent } from '@mpxjs/core'

createComponent({
  options: {
    addGlobalClass: true,
    styleIsolation: 'shared',
    // todo: 超过基础模板的层数，virtualHost 置为 true，避免样式规则失效
    virtualHost: true
  },
  properties: {
    r: { // vdom 数据
      type: Object,
      value: {
        nt: 'block'
      }
    }
  },
  data: {
    // 运行时组件的标识
    mpxCustomElement: true
  },
  computed: {
    vnodeData () {
      const data = this.r.d || {}
      return data
    },
    // 当前组件的 uid
    uid () {
      return this.vnodeData.uid
    }
  }
})
</script>

<style>

</style>

<script type="application/json">
{
  "component": true,
  "usingComponents": {}
}
</script>`
}
