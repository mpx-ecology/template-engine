import { describe, expect, test } from 'vitest'
import { createTemplateEngine } from '../src/index'
import { format } from './utils'

const templateEngine = createTemplateEngine('wx')
templateEngine.baseLevel = 2

describe('normal', () => {
  test('empty-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        runtimeComponents: ['d783097f6']
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_d783097f6"><d783097f6 /></template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_1_container">
        <block wx:if="{{i.nt === '#text'}}">
          <template is="t_0_#text" data="{{i:i}}" />
        </block>
        <block wx:else><element r="{{i}}" /></block>
      </template>
      "
    `)
  })
  test('event', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        runtimeComponents: [
          {
            nodeType: 'd783097f6',
            attrs: ['bind:tap']
          }
        ]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_d783097f6">
        <d783097f6
          bindtap="{{xs.invoke}}"
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
        />
      </template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_1_container">
        <block wx:if="{{i.nt === '#text'}}">
          <template is="t_0_#text" data="{{i:i}}" />
        </block>
        <block wx:else><element r="{{i}}" /></block>
      </template>
      "
    `)
  })
  test('attr-custom', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        runtimeComponents: [{
          nodeType: 'd783097f6',
          attrs: ['custom']
        }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_d783097f6"><d783097f6 custom="{{i.d.custom}}" /></template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_1_container">
        <block wx:if="{{i.nt === '#text'}}">
          <template is="t_0_#text" data="{{i:i}}" />
        </block>
        <block wx:else><element r="{{i}}" /></block>
      </template>
      "
    `)
  })
  test('attr-pure', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        runtimeComponents: [{
          nodeType: 'd783097f6',
          attrs: ['class', 'style']
        }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_d783097f6">
        <d783097f6 class="{{i.d.class}}" style="{{i.d.style}}" />
      </template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_1_container">
        <block wx:if="{{i.nt === '#text'}}">
          <template is="t_0_#text" data="{{i:i}}" />
        </block>
        <block wx:else><element r="{{i}}" /></block>
      </template>
      "
    `)
  })
})
