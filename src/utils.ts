import { Component } from './baseTemplate'
import { VNode, view } from './h'
import { Prop } from './shortcuts'
import { normalizeCondition } from '@mpxjs/webpack-plugin/lib/utils/match-condition'

export const EMPTY_OBJ: any = {}

export const EMPTY_ARR = []

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = (..._: unknown[]) => {
  return
}

export const defaultReconciler = Object.create(null)

/**
 * Boxed value.
 * @typeparam T - Value type.
 */
export interface Box<T> {
  v: T
}

/**
 * box creates a boxed value.
 *
 * @typeparam T - Value type.
 * @param v - Value.
 * @returns Boxed value.
 */
export const box = <T>(v: T) => ({ v })

/**
 * box creates a boxed value.
 *
 * @typeparam T - Value type.
 * @param b - Boxed value.
 * @returns Value.
 */
export const unbox = <T>(b: Box<T>) => b.v

export function toDashed(s: string) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function toCamelCase(s: string) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export const toKebabCase = function (string: string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (val: Record<any, any>, key: string | symbol) =>
  hasOwnProperty.call(val, key)

export function warn(condition: boolean, msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    if (condition) {
      console.warn(`[mpx warn] ${msg}`)
    }
  }
}

const commonBaseAttrs = /^(class|style|id|hidden)$/

export function isPureAttr(attr: string) {
  return commonBaseAttrs.test(attr)
}

export function filterObject<T extends Record<string, any>>(
  attrs: T,
  filter: (key: string) => boolean
): T {
  const res = { ...attrs }
  Object.keys(attrs).forEach((key) => {
    if (!filter(key)) delete res[key]
  })
  return res as T
}

export const flatArrWithObjectToObject = (
  arr: (string | Record<string, any>)[] | Record<string, any>
) => {
  const attrs: Record<string, any> = {}
  if (Array.isArray(arr)) {
    arr.forEach((v) => {
      if (typeof v === 'string') {
        attrs[v] = ''
      } else {
        Object.assign(attrs, flatArrWithObjectToObject(v))
      }
    })
  } else {
    Object.assign(attrs, arr)
  }
  return attrs
}

const customEvent = [
  'touchstart',
  'touchmove',
  'touchcancel',
  'touchend',
  'tap',
  'longpress',
  'longtap',
  'transitionend',
  'animationstart',
  'animationiteration',
  'animationend',
  'touchforcechange'
]

export const isCustomEvent = (eventName: string) =>
  customEvent.includes(eventName)

const MPX_ROOT_VIEW = 'mpx-root-view'

export const processAddComponentRootView = (component: VNode) => {
  const attrs = component.attrs || {}
  const processAttrsConditions = [
    {
      condition: /^(bind|catch|capture-bind|capture-catch):?((tap|touchstart|touchmove|touchcancel|touchend|longtap)?)(?:\.(.*))?$/,
      action: 'clone'
    },
    { condition: /^data-/, action: 'clone' },
    { condition: /^id$/, action: 'clone' },
    { condition: /^style$/, action: 'move' },
    { condition: /^slot$/, action: 'move' }
  ]
  const processAppendAttrsRules = [
    { name: 'class', value: `${MPX_ROOT_VIEW} host-${attrs[Prop.DataMpxUid]}` }
  ]

  const newAttrs: Component['attrs'] = {}

  function processClone(name: string) {
    newAttrs[name] = attrs[name]
  }

  function processMove(name: string) {
    newAttrs[name] = attrs[name]
    delete attrs[name]
  }

  function processAppendRules() {
    processAppendAttrsRules.forEach((rule) => {
      const getNeedAppendAttrValue = attrs[rule.name]
      const value = getNeedAppendAttrValue
        ? getNeedAppendAttrValue + ' ' + rule.value
        : rule.value
      newAttrs[rule.name] = value
    })
  }

  processAttrsConditions.forEach((item) => {
    const matcher = normalizeCondition(item.condition)
    Object.keys(attrs).forEach((name) => {
      if (matcher(name)) {
        if (item.action === 'clone') {
          processClone(name)
        } else if (item.action === 'move') {
          processMove(name)
        }
      }
    })
  })

  processAppendRules()

  return view(newAttrs, [component])
}
