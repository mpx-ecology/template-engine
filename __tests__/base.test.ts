import { describe, expect, test } from 'vitest'
import { createTemplateEngine } from '../src/index'
import { format } from './utils'

const templateEngine = createTemplateEngine('wx')
templateEngine.baseLevel = 2

describe('block', () => {
  test('empty-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: ['block']
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </block>
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
  test('pure-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'block', attrs: ['style', 'class'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_block">
        <block style="{{i.d.style}}" class="{{i.d.class}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </block>
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
  test('custom-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'block', attrs: ['custom'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_block">
        <block custom="{{i.d.custom}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </block>
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
  test('event', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'block', attrs: ['bind:tap'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_block">
        <block
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </block>
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

// optimized node
// 带event  => view + static + pure,
// 不带event，但是有自定义属性  => static + pure
// 只有 class, style, data-  => pure
describe('view', () => {
  test('empty-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: ['view']
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
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
  test('event', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['bind:tap'] }]
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
  test('custom-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['custom'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_static-view">
        <view custom="{{i.d.custom}}">
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
  test('custom-attr-number', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: { custom: '1' } }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_static-view">
        <view custom="{{i.d.custom===undefined?1:i.d.custom}}">
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
  test('custom-attr-bool', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: { custom: 'false' } }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_static-view">
        <view custom="{{i.d.custom===undefined?false:i.d.custom}}">
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
  test('custom-attr-string', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: { custom: 'custom' } }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_static-view">
        <view custom="{{i.d.custom||custom}}">
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
  test('pure-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['class'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_pure-view">
        <view class="{{i.d.class}}" style="{{i.d.style}}">
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
  test('data-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['data-test'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_static-view">
        <view data-test="{{i.d.dataTest}}">
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
  test('data-event-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['data-test', 'bindtap'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_view">
        <view
          data-test="{{i.d.dataTest}}"
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
        <view data-test="{{i.d.dataTest}}">
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
  test('data-event-pure-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'view', attrs: ['data-test', 'bindtap', 'class'] }]
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_view">
        <view
          data-test="{{i.d.dataTest}}"
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
          class="{{i.d.class}}"
          style="{{i.d.style}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_static-view">
        <view
          data-test="{{i.d.dataTest}}"
          class="{{i.d.class}}"
          style="{{i.d.style}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_pure-view">
        <view class="{{i.d.class}}" style="{{i.d.style}}">
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

describe('swiper', () => {
  test('default-value-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'swiper', attrs: ['duration'] }]
      })
    )
    // remove style
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_swiper">
        <swiper duration="{{xs.b(i.d.duration, 500)}}">
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
})

describe('swiper-item', () => {
  test('style-attr', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [{ nodeType: 'swiper-item', attrs: ['style'] }]
      })
    )
    // remove style
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_swiper-item">
        <swiper-item>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </swiper-item>
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

describe('slot', () => {
  test('slot', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: ['slot']
      })
    )
    // remove style
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_slot">
        <view slot="{{i.d.name}}">
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