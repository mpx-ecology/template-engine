import { describe, expect, test } from 'vitest'
import { getOptimizedComponentInfo } from '../src/optimizer'

describe('getOptimizedComponentTag', () => {
  test('normal', async () => {
    expect(
      getOptimizedComponentInfo({
        nodeType: 'view',
        attrs: {
          class: ''
        }
      })?.nodeType
    ).toBe('pure-view')
    expect(
      getOptimizedComponentInfo({
        nodeType: 'view',
        attrs: {
          class: '',
          c: ''
        }
      })?.nodeType
    ).toBe('static-view')
    expect(
      getOptimizedComponentInfo({
        nodeType: 'view',
        attrs: {
          class: '',
          bindtap: ''
        }
      })?.nodeType
    ).toBe('view')
  })
})
