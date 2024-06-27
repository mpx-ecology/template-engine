import fs from 'fs'
import simulate from 'miniprogram-simulate'
import { describe, expect, test } from 'vitest'
import { InputOptions, createTemplateEngine } from '../src/template'
import path from 'path'

function initTemplateComponent(componentConfig: InputOptions) {
  const templateEngine = createTemplateEngine('wx')
  fs.writeFileSync(
    path.resolve('./__tests__/components/dynamic/index.wxml'),
    [
      `<template is="t_0_container" data="{{ i: r }}" wx:if="{{ r && r.nt }}"></template>`,
      templateEngine.buildTemplate(componentConfig)
    ].join('\n'),
    {
      encoding: 'utf-8'
    }
  )
}

function renderComponent(vNode) {
  const id = simulate.load(path.resolve('./__tests__/components/dynamic/index'))
  const comp = simulate.render(id, {
    r: vNode
  })
  return comp
}

describe('render', () => {
  test('render', () => {
    initTemplateComponent({
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
          attrs: { src: '', openImageRetry: '', class: '', style: '', mode: '' }
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
        },
        { nodeType: 'button', attrs: {} }
      ],
      normalComponents: [{
        nodeType: 'm5f9d5dc4',
        attrs: {
          text: '',
          rules: '',
          class: ''
        }
      }]
    })

    const comp = renderComponent({
      nt: 'view',
      d: {
        uid: 2,
        style: 'color: red',
        a: '1'
      },
      c: [
        {
          nt: 'swiper',
          d: {
            uid: 3
          },
          c: []
        },
        {
          nt: 'button',
          d: {
            uid: 4,
            type: 'primary',
            style: 'color: red'
          }
        },
        {
          nt: 'm5f9d5dc4',
          d: {
            uid: 4,
            type: 'primary',
            style: 'color: red'
          },
          c: [
            {
              d: {
                slot: 'test',
                style: 'color: red',
                class: 'slot-view-class'
              },
              nt: 'view'
            }
          ]
        }
      ],
      scopeProcessed: true
    })

    expect(comp.toJSON()).toMatchSnapshot()
  })
})
