import { NodeType } from './shortcuts'

export type VNode = {
  tag: string
  attrs?: Record<string, string>
  children?: (VNode | string)[]
}

export function h(
  tag: VNode['tag'],
  attrs: VNode['attrs'],
  children: VNode['children']
) {
  return {
    tag,
    attrs,
    children
  }
}

function buildAttrString(vnode: VNode) {
  const result: string[] = []
  Object.entries(vnode.attrs || {}).forEach(function ([key, value]) {
    if (key.startsWith('__')) return
    result.push(value ? key + '="' + value + '"' : key)
  })
  return result.join(' ')
}

export function toHtml(vnode?: VNode | VNode[] | string): string {
  if (Array.isArray(vnode)) return vnode.map((v) => toHtml(v)).join('')
  if (typeof vnode === 'undefined' || vnode === null) return ''
  if (typeof vnode === 'string') return vnode

  const tagName = vnode.tag
  const attributes = buildAttrString(vnode)

  const html: string[] = []

  // Open tag
  html.push('<' + tagName)
  if (attributes.length) html.push(' ' + attributes)
  html.push(vnode.children?.length ? '>' : '/>')
  // children
  vnode.children?.forEach(function (child) {
    html.push(toHtml(child))
  })
  // End Tag
  vnode.children?.length && html.push('</' + tagName + '>')
  return html.join('')
}

export function createNodeGenerator(type: string) {
  return function createNode(
    attrs: VNode['attrs'],
    children?: VNode['children']
  ) {
    return h(type, attrs, children)
  }
}

export const template = createNodeGenerator(NodeType.Template)
export const view = createNodeGenerator(NodeType.View)
export const block = createNodeGenerator(NodeType.Block)
export const element = createNodeGenerator(NodeType.Element)
export const wxs = createNodeGenerator(NodeType.Wxs)
export const component = (
  nodeType: string,
  attrs: VNode['attrs'],
  children?: VNode['children']
) => {
  switch (nodeType) {
    case NodeType.Slot:
    case NodeType.CatchView:
    case NodeType.StaticView:
    case NodeType.PureView:
      nodeType = NodeType.View
      break
    case NodeType.StaticText:
      nodeType = NodeType.Text
      break
    case NodeType.StaticImage:
      nodeType = NodeType.Image
      break
  }
  return createNodeGenerator(nodeType)(attrs, children)
}
