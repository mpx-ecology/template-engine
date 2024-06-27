import { describe, expect, test } from 'vitest'
import { RecursiveTemplate } from '../src/template'
import { format } from './utils'

describe('render', () => {
  test('render', async () => {
    const recursiveTemplate = new RecursiveTemplate()
    const template = await format(
      recursiveTemplate.buildTemplate({
        baseComponents: [
          {
            nodeType: 'view',
            attrs: {
              class: '',
              style: '',
              'bind:tap': '',
              'data-eventconfigs': ''
            }
          },
          { nodeType: 'block', attrs: { style: '' } },
          {
            nodeType: 'image',
            attrs: {
              src: '',
              openImageRetry: '',
              class: '',
              style: '',
              mode: ''
            }
          },
          {
            nodeType: 'swiper-item',
            attrs: { class: '', 'bind:tap': '', 'data-eventconfigs': '' }
          },
          {
            nodeType: 'swiper',
            attrs: {
              id: '',
              autoplay: '',
              interval: '',
              circular: '',
              class: '',
              'bind:change': '',
              'data-eventconfigs': ''
            }
          },
          { nodeType: 'text', attrs: { class: '' } },
          {
            nodeType: 'd783097f6',
            attrs: {
              class: '',
              'catch:tap': '',
              'data-eventconfigs': '',
              rawTag: 'view'
            }
          }
        ],
        normalComponents: [
          {
            nodeType: 'm5f9d5dc4',
            attrs: {
              text: '',
              rules: '',
              class: ''
            }
          }
        ]
      })
    )

    expect(template).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_view">
        <view
          class="{{i.d.class}}"
          style="{{i.d.style}}"
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_static-view">
        <view class="{{i.d.class}}" style="{{i.d.style}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_pure-view">
        <view class="{{i.d.class}}" style="{{i.d.style}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_block">
        <block style="{{i.d.style}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_0_static-image">
        <image
          src="{{i.d.src}}"
          openImageRetry="{{i.d.openImageRetry}}"
          class="{{i.d.class}}"
          style="{{i.d.style}}"
          mode="{{xs.b(i.d.mode, 'scaleToFill')}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </image>
      </template>
      <template name="t_0_pure-image">
        <image class="{{i.d.class}}" style="{{i.d.style}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </image>
      </template>
      <template name="t_0_swiper-item">
        <swiper-item
          class="{{i.d.class}}"
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </swiper-item>
      </template>
      <template name="t_0_swiper">
        <swiper
          id="{{i.d.id}}"
          autoplay="{{xs.b(i.d.autoplay, false)}}"
          interval="{{xs.b(i.d.interval, 5000)}}"
          circular="{{xs.b(i.d.circular, false)}}"
          class="{{i.d.class}}"
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindchange="{{xs.invoke}}"
          style="{{i.d.style}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </swiper>
      </template>
      <template name="t_0_text">
        <text class="{{i.d.class}}" style="{{i.d.style}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </text>
      </template>
      <template name="t_0_d783097f6">
        <view
          class="{{i.d.class}}"
          data-eventconfigs="{{i.d.dataEventconfigs}}"
          data-mpxuid="{{i.d.uid}}"
          bindtap="{{xs.invoke}}"
          style="{{i.d.style}}"
        >
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_slot">
        <block wx:if="{{i.d.slot}}">
          <view slot="{{i.d.slot}}">
            <template is="t_0_container" data="{{i:i}}" />
          </view>
        </block>
        <block wx:else><template is="t_0_container" data="{{i:i}}" /></block>
      </template>
      <template name="t_0_m5f9d5dc4">
        <m5f9d5dc4
          text="{{i.d.text}}"
          rules="{{i.d.rules}}"
          class="{{i.d.class}}"
          style="{{i.d.style}}"
        >
          <block wx:for="{{i.c}}" wx:for-item="i" wx:key="index">
            <template is="t_0_slot" data="{{i:i}}" />
          </block>
        </m5f9d5dc4>
      </template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      "
    `)
  })
})
