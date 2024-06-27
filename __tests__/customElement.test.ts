import { describe, expect, test } from 'vitest'
import { createCustomElementTemplate } from '../src'

describe('createCustomElementTemplate', () => {
  test('normal', async () => {
    expect(createCustomElementTemplate()).toMatchInlineSnapshot(`
      "<template>
        <wxs module="xs" src="~@mpxjs/template-engine/dist/utils.wxs"/>
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
      </script>"
    `)
    expect(createCustomElementTemplate('test')).toMatchInlineSnapshot(`
      "<template>
        test
        <wxs module="xs" src="~@mpxjs/template-engine/dist/utils.wxs"/>
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
      </script>"
    `)
  })
})
