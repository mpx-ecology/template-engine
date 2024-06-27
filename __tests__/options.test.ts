import { describe, expect, test } from 'vitest'
import { createTemplateEngine } from '../src/index'
import { format } from './utils'

const templateEngine = createTemplateEngine('wx')
templateEngine.baseLevel = 2

describe('option', () => {
  test('normal', async () => {
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: [
          {
            nodeType: 'block',
            attrs: {
              class: ''
            }
          },
          'view',
          {
            nodeType: 'image',
            attrs: ['class', { style: '' }]
          }
        ],
        normalComponents: ['a'],
        runtimeComponents: {
          b: []
        }
      })
    )

    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_block">
        <block class="{{i.d.class}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_0_pure-view">
        <view>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </view>
      </template>
      <template name="t_0_pure-image">
        <image class="{{i.d.class}}" style="{{i.d.style}}">
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </image>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_slot">
        <block wx:if="{{i.d.slot}}">
          <view slot="{{i.d.slot}}">
            <template is="t_1_container" data="{{i:i}}" />
          </view>
        </block>
        <block wx:else><template is="t_1_container" data="{{i:i}}" /></block>
      </template>
      <template name="t_0_a">
        <a>
          <block wx:for="{{i.c}}" wx:for-item="i" wx:key="index">
            <template is="t_0_slot" data="{{i:i}}" />
          </block>
        </a>
      </template>
      <template name="t_0_b"><b /></template>
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
