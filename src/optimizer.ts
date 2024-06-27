import { InputComponentConfig } from './baseTemplate'
import { NodeType, Prop } from './shortcuts'
import { ModeConfig } from './type'
import { flatArrWithObjectToObject, isPureAttr } from './utils'

export const OPTIMIZE_TAG_NODES = [
  NodeType.View,
  NodeType.Text,
  NodeType.Image
] as string[]

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('@mpxjs/webpack-plugin/lib/config')

export function getOptimizedComponentInfo(
  c: InputComponentConfig,
  mode = 'wx'
):
  | {
      nodeType: string
      attrs: Record<string, string>
      staticAttrs: Record<string, string>
      pureAttrs: Record<string, string>,
      optimizeTag: boolean
    }
  | undefined {
  let nodeType = c.nodeType
  if (!c.attrs) return
  const modeConfig: ModeConfig = config[mode]
  const originAttrs = flatArrWithObjectToObject(c.attrs)
  const attrs: Record<string, string> = {}
  const staticAttrs: Record<string, string> = {}
  const pureAttrs: Record<string, string> = {}
  let hasEvent = false // 有事件
  let hasStaticAttr = false // 有非pure属性
  Object.keys(originAttrs).forEach((name) => {
    if (name === Prop.DataEventConfig || name === Prop.DataMpxUid) return
    const value = originAttrs[name]
    const eventInfo = modeConfig.event.parseEvent(name)
    if (eventInfo) {
      hasEvent = true
      const event = modeConfig.event.getEvent(
        eventInfo.eventName,
        eventInfo.prefix
      )
      if (eventInfo.prefix === 'catch') {
        delete attrs[name]
        const bindEvent = modeConfig.event.getEvent(
          eventInfo.eventName,
          mode === 'ali' ? 'on' : 'bind'
        )
        // 替换catch=>bind
        attrs[bindEvent] = ''
      } else {
        // 去重
        attrs[event] = value
      }
    } else if (isPureAttr(name)) {
      attrs[name] = value
      staticAttrs[name] = value
      pureAttrs[name] = value
    } else {
      attrs[name] = value
      staticAttrs[name] = value
      hasStaticAttr = true
    }
  })

  if(OPTIMIZE_TAG_NODES.includes(c.nodeType)) {
    if (!hasStaticAttr && !hasEvent) {
      nodeType = `pure-${c.nodeType}`
    } else if (!hasEvent) {
      nodeType = `static-${c.nodeType}`
    }
  }

  return {
    nodeType,
    optimizeTag: OPTIMIZE_TAG_NODES.includes(c.nodeType),
    attrs,
    staticAttrs,
    pureAttrs
  }
}
