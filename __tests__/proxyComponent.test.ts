import { describe, expect, test } from 'vitest'
import { createTemplateEngine } from '../src/index'
import { format } from './utils'

const templateEngine = createTemplateEngine('wx')
templateEngine.baseLevel = 2

describe('normal', () => {
  test('event-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        normalComponents: [{ nodeType: 'ui-button', attrs: ['bind:tap', 'class', 'style', 'bindchange'] }],
        proxyNormalComponentAttrs: true
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_slot">
        <block wx:if="{{i.d.slot}}">
          <view slot="{{i.d.slot}}">
            <template is="t_1_container" data="{{i:i}}" />
          </view>
        </block>
        <block wx:else><template is="t_1_container" data="{{i:i}}" /></block>
      </template>
      <template name="t_0_ui-button">
        <view
          bindtap="{{xs.invoke}}"
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          style="{{i.d.style}}"
          class="{{i.d.class}} mpx-root-view host-{{i.d.uid}}"
        >
          <ui-button
            bindtap="{{xs.invoke}}"
            class="{{i.d.class}}"
            bindchange="__invoke"
            data-eventconfigs="{{i.d.dataEventconfigs}}"
            data-mpxuid="{{i.d.uid}}"
          >
            <block wx:for="{{i.c}}" wx:for-item="i" wx:key="index">
              <template is="t_0_slot" data="{{i:i}}" />
            </block>
          </ui-button>
        </view>
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
