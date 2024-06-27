import { describe, expect, test } from 'vitest'
import { createTemplateEngine } from '../src/index'
import { format } from './utils'

describe('mode', () => {
  test('ali', async () => {
    const templateEngine = createTemplateEngine('ali')
    const res = await format(
      templateEngine.buildTemplate({
        baseComponents: ['block'],
        runtimeComponents: ['abcd']
      })
    )
    expect(res).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" a:if="{{r}}" /></template>
      <template name="t_0_block">
        <block>
          <block a:for="{{i.c}}" a:key="index">
            <template is="t_0_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_abcd"><abcd /></template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      "
    `)
  })
  test('wx', async () => {
    const templateEngineWx = createTemplateEngine('wx')
    const res2 = await format(
      templateEngineWx.buildTemplate({
        baseComponents: ['block'],
        runtimeComponents: ['abcd']
      })
    )
    expect(res2).toMatchInlineSnapshot(`
      "<template name="mpx_tmpl"><element r="{{r}}" wx:if="{{r}}" /></template>
      <template name="t_0_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_1_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_0_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_0_abcd"><abcd /></template>
      <template name="t_0_container">
        <template is="t_0_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_1_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_2_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_1_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_1_abcd"><abcd /></template>
      <template name="t_1_container">
        <template is="t_1_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_2_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_3_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_2_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_2_abcd"><abcd /></template>
      <template name="t_2_container">
        <template is="t_2_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_3_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_4_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_3_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_3_abcd"><abcd /></template>
      <template name="t_3_container">
        <template is="t_3_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_4_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_5_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_4_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_4_abcd"><abcd /></template>
      <template name="t_4_container">
        <template is="t_4_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_5_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_6_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_5_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_5_abcd"><abcd /></template>
      <template name="t_5_container">
        <template is="t_5_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_6_block">
        <block>
          <block wx:for="{{i.c}}" wx:key="index">
            <template is="t_7_container" data="{{i:item}}" />
          </block>
        </block>
      </template>
      <template name="t_6_#text" data="{{i:i}}"><block>{{i.ct}}</block></template>
      <template name="t_6_abcd"><abcd /></template>
      <template name="t_6_container">
        <template is="t_6_{{i.nt}}" data="{{i:i}}" />
      </template>
      <template name="t_7_container">
        <block wx:if="{{i.nt === '#text'}}">
          <template is="t_0_#text" data="{{i:i}}" />
        </block>
        <block wx:else><element r="{{i}}" /></block>
      </template>
      "
    `)
  })
})
