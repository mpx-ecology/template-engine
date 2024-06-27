import { describe, expect, test } from 'vitest'
import { createTemplateEngine } from '../src/index'
import { format } from './utils'

describe('event-optimize', () => {
  const templateEngine = createTemplateEngine('wx')
  templateEngine.baseLevel = 2
  test('catch-event', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [
          { nodeType: 'view', attrs: ['catchtap', 'catchtouchmove'] },
          { nodeType: 'swiper', attrs: ['catchtap', 'catchtouchmove'] }
        ]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_view">
        <view
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
          bindtouchmove="{{xs.invoke}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_static-view">
        <view>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_pure-view">
        <view>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_swiper">
        <swiper
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
          bindtouchmove="{{xs.invoke}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </swiper>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
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
  test('catch-event-with-tap', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [
          { nodeType: 'view', attrs: ['catchtap', 'bind:tap', 'bindtap'] }
        ]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_view">
        <view
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_static-view">
        <view>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_pure-view">
        <view>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
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

describe('ali-event-optimize', () => {
  const templateEngine = createTemplateEngine('ali')
  test('catch-event', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['catchTap', 'catchTouchmove'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" a:if="{{r}}" /></template>
      <template name="t_0_view">
        <view
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          onTap="{{xs.invoke}}"
          onTouchmove="{{xs.invoke}}"
        >
          <block a:for="{{i.c}}" a:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_static-view">
        <view>
          <block a:for="{{i.c}}" a:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_pure-view">
        <view>
          <block a:for="{{i.c}}" a:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      "
    `)
  })
  test('catch-event-with-tap', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['catchTap', 'onTap'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" a:if="{{r}}" /></template>
      <template name="t_0_view">
        <view
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          onTap="{{xs.invoke}}"
        >
          <block a:for="{{i.c}}" a:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_static-view">
        <view>
          <block a:for="{{i.c}}" a:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_pure-view">
        <view>
          <block a:for="{{i.c}}" a:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      "
    `)
  })
})
