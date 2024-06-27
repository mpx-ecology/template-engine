import {
  focusComponents,
  baseComponents,
  nestElements,
  singleQuote,
  voidElements
} from './components'
import { component, template, view, element, block, VNode } from './h'
import { isBooleanStringLiteral, isNumber } from './is'
import { getOptimizedComponentInfo } from './optimizer'
import {
  ContextData,
  Context,
  NodeType,
  Prop,
  ContextName,
  XsUtils,
  MpxGLobal
} from './shortcuts'
import { ModeConfig } from './type'
import {
  flatArrWithObjectToObject,
  hasOwn,
  isCustomEvent,
  processAddComponentRootView,
  toCamelCase,
  toDashed
} from './utils'
import config from '@mpxjs/webpack-plugin/lib/config'

export interface Component {
  nodeType: string
  attrs: Attributes
}

export type InputComponentConfig = {
  nodeType: string
  attrs?: (string | Attributes)[] | Attributes
}

export type InputComponentsOptions =
  | (InputComponentConfig | string)[]
  | Record<string, Record<string, string> | string[]>

export type InputOptions = {
  baseComponents?: InputComponentsOptions // view
  normalComponents?: InputComponentsOptions // .mpx
  runtimeComponents?: InputComponentsOptions // .runtime.mpx
  inlineSlot?: boolean
  templateCompilerConfig?: any
  proxyNormalComponentAttrs?: boolean
}

export type BuildComponentOptions = Record<string, Record<string, string>>

export interface BuildOptions {
  baseComponents: Component[] // view
  normalComponents: Component[] // .mpx
  runtimeComponents: Component[] // .runtime.mpx
  inlineSlot?: boolean
  templateCompilerConfig?: any
  proxyNormalComponentAttrs?: boolean
}

export type Attributes = Record<string, string>

export type SUPPORT_MODE =
  | 'wx'
  | 'ali'
  | 'swan'
  | 'qq'
  | 'tt'
  | 'dd'
  | 'web'
  | 'tenon'

export class BaseTemplate {
  protected exportExpr = 'module.exports ='
  protected isSupportRecursive = false
  protected buildOptions: BuildOptions = {
    baseComponents: [],
    normalComponents: [],
    runtimeComponents: []
  }
  /** 组件列表 */
  public baseComponents = baseComponents
  /** 可以 focus 聚焦的组件 */
  public focusComponents: Set<string> = focusComponents
  /** 不需要渲染子节点的元素 */
  public voidElements: Set<string> = voidElements
  /** 可以递归调用自身的组件 */
  public nestElements: Map<string, number> = nestElements

  modeConfig: ModeConfig

  mode = 'wx'

  private _baseLevel = 8

  set baseLevel(lv) {
    this._baseLevel = lv
  }

  get baseLevel() {
    return this._baseLevel
  }

  get Directive() {
    return this.modeConfig.directive
  }

  constructor(mode?: SUPPORT_MODE) {
    this.mode = mode || 'wx'
    this.modeConfig = config[this.mode]
  }

  protected isEvent(event: string) {
    const res = this.modeConfig.event.parseEvent(event)
    if (res) res.custom = isCustomEvent(res.eventName)
    return res
  }

  /**
   * 获取vnode节点属性
   * @param value -
   * @returns
   */
  protected getContext(value?: string, dynamic = true) {
    const v = value ? ContextName + '.' + value : ContextName
    return dynamic ? this.dynamicValue(v) : v
  }

  /**
   * 获取vnode节点data数据
   * @param value -
   * @returns
   */
  protected getContextData(value?: string, nodeType?: string): string {
    const baseComponent = nodeType && this.baseComponents[nodeType]
    if (baseComponent && value && baseComponent[value]) {
      return `${this.getXsUtils(XsUtils.B)}(${this.getContextData(value)}, ${baseComponent[value]})`
    }
    return ContextName + `.${Context.Data}` + (value ? `.${value}` : '')
  }

  protected getXsUtils(name: string) {
    return `${XsUtils.Module}.${name}`
  }

  protected transContext(keymap: string = ContextName) {
    return `${ContextName}:${keymap}`
  }

  // 模板动态值: {{ value }}
  protected dynamicValue(s: string) {
    return `{{${s}}}`
  }

  protected getTplName(name: string, level?: string | number) {
    return `t_${level === undefined ? `\${level}` : level}_` + name
  }

  protected getNextTplName(name: string, level?: string | number) {
    return this.getTplName(name, level === undefined ? `\${nextLevel}` : level)
  }

  private getChildren(comp: Component) {
    if (this.voidElements.has(comp.nodeType)) return
    return [
      block(
        {
          [this.Directive.for]: this.getContext(Context.Children),
          [this.Directive.key]: 'index'
        },
        [
          template({
            [Prop.Is]: this.getNextTplName(NodeType.Container),
            [Prop.Data]: this.dynamicValue(this.transContext('item'))
          })
        ]
      )
    ]
  }

  private buildAttribute(attrs: Attributes) {
    return Object.keys(attrs)
      .filter((v) => v !== Prop.RawTag)
      .reduce(
        (res, k) => {
          res[k] = this.isEvent(k) ? attrs[k] : this.dynamicValue(attrs[k])
          return res
        },
        {} as Record<string, string>
      )
  }

  // 递归生成基础模板，被注入到 base.wxml 当中的文本内容
  protected buildBaseTemplate() {
    return template({ [Prop.Name]: 'mpx_tmpl' }, [
      element({
        [Prop.R]: this.dynamicValue('r'),
        [this.Directive.if]: this.dynamicValue('r')
      })
    ])
  }

  // 构建组件的模板
  protected buildComponentTemplate(comp: Component) {
    return this.focusComponents.has(comp.nodeType)
      ? this.buildFocusComponentTemplate(comp)
      : this.buildStandardComponentTemplate(comp)
  }

  protected buildComponentsTemplate(buildOptions: BuildOptions) {
    const res: VNode[] = []
    buildOptions.baseComponents.forEach((component) => {
      res.push(...this.buildComponentTemplate(component))
    })
    return res
  }

  protected buildFocusComponentTemplate(comp: Component) {
    const child = this.getChildren(comp)

    const fAttrs = comp.attrs
    const bAttrs = { ...comp.attrs }
    delete bAttrs.focus

    const fName = this.getTplName(comp.nodeType) + '_f'
    const bName = this.getTplName(comp.nodeType) + '_b'

    return [
      template({ name: this.getTplName(comp.nodeType) }, [
        template({
          [Prop.Is]: this.dynamicValue(
            `${this.getContext('focus', false)} ? ${fName} : ${bName}`
          ),
          [Prop.Data]: this.dynamicValue(
            `${this.transContext()}${child ? ',cid:cid' : ''}`
          )
        })
      ]),
      template({ [Prop.Name]: fName }, [
        component(comp.nodeType, this.buildAttribute(fAttrs), child)
      ]),
      template({ [Prop.Name]: bName }, [
        component(comp.nodeType, this.buildAttribute(bAttrs), child)
      ])
    ]
  }

  protected buildStandardComponentTemplate(comp: Component) {
    const res: VNode[] = []
    const nodeType = comp.nodeType
    const children = this.getChildren(comp)
    const normalTemplate = template(
      { [Prop.Name]: this.getTplName(nodeType) },
      [
        component(
          comp.attrs.rawTag || nodeType,
          this.buildAttribute(comp.attrs),
          children
        )
      ]
    )
    res.push(normalTemplate)
    return res
  }

  protected buildPlainTextTemplate() {
    return template(
      {
        [Prop.Name]: this.getTplName(NodeType.Text),
        [Prop.Data]: this.dynamicValue(this.transContext())
      },
      [block({}, [this.getContext(Context.Text)])]
    )
  }

  protected buildRunTimeComponentsTemplate(buildOptions: BuildOptions) {
    const nodes: VNode[] = []
    buildOptions.runtimeComponents.forEach((v) => {
      nodes.push(
        template({ [Prop.Name]: this.getTplName(v.nodeType) }, [
          component(v.nodeType, this.buildAttribute(v.attrs))
        ])
      )
    })
    return nodes
  }

  // 包括 custom-wrapper、原生的小程序组件、第三方(例如 vant)的组件
  protected buildThirdPartyTemplate(buildOptions: BuildOptions) {
    if (buildOptions.inlineSlot)
      return this.buildThirdPartyTemplateInlineSlot(buildOptions)
    const nodes: VNode[] = []
    if (Object.keys(buildOptions.normalComponents).length) {
      nodes.push(
        this.buildSlotTemplate(
          template({
            [Prop.Is]: this.getNextTplName(NodeType.Container),
            [Prop.Data]: this.dynamicValue(this.transContext())
          })
        )
      )
      buildOptions.normalComponents.forEach((v) => {
        let componentNode = component(
          v.nodeType,
          this.buildAttribute(v.attrs),
          [
            block(
              {
                [this.Directive.for]: this.getContext(Context.Children),
                [this.Directive.forItem]: ContextName,
                [this.Directive.key]: 'index'
              },
              [
                template({
                  [Prop.Is]: this.getTplName(NodeType.Slot),
                  [Prop.Data]: this.dynamicValue(this.transContext())
                })
              ]
            )
          ]
        )
        if (this.buildOptions.proxyNormalComponentAttrs) {
          componentNode = processAddComponentRootView(componentNode)
        }
        nodes.push(
          template({ name: this.getTplName(v.nodeType) }, [componentNode])
        )
      })
    }

    nodes.push(...this.buildRunTimeComponentsTemplate(buildOptions))

    return nodes
  }

  protected buildThirdPartyTemplateInlineSlot(buildOptions: BuildOptions) {
    const nodes: VNode[] = []

    buildOptions.normalComponents.forEach((v) => {
      const child = [
        template({
          [Prop.Is]: this.getNextTplName(NodeType.Container),
          [Prop.Data]: this.getContext()
        })
      ]

      let componentNode = component(v.nodeType, this.buildAttribute(v.attrs), [
        block(
          {
            [this.Directive.for]: this.getContext(Context.Children),
            [this.Directive.key]: 'index',
            [this.Directive.forItem]: ContextName
          },
          [
            block(
              {
                [this.Directive.if]: this.dynamicValue(
                  this.getContextData(ContextData.Slot)
                )
              },
              [
                view(
                  {
                    slot: this.dynamicValue(
                      this.getContextData(ContextData.Slot)
                    )
                  },
                  child
                )
              ]
            ),
            block({ [this.Directive.else]: '' }, child)
          ]
        )
      ])

      if (this.buildOptions.proxyNormalComponentAttrs) {
        componentNode = processAddComponentRootView(componentNode)
      }

      nodes.push(
        template({ name: this.getTplName(v.nodeType) }, [componentNode])
      )
    })

    nodes.push(...this.buildRunTimeComponentsTemplate(buildOptions))

    return nodes
  }

  protected buildContainerTemplate(restart = false) {
    const tmpl: VNode[] = []
    if (restart) {
      tmpl.push(
        block(
          {
            [this.Directive.if]: this.dynamicValue(
              `${this.getContext(Context.NodeType, false)} === '${NodeType.Text}'`
            )
          },
          [
            template({
              [Prop.Is]: this.getTplName(NodeType.Text, '0'),
              [Prop.Data]: this.dynamicValue(this.transContext())
            })
          ]
        ),
        block({ [this.Directive.else]: '' }, [
          element({ r: this.getContext() })
        ])
      )
    } else {
      tmpl.push(
        template({
          [Prop.Is]: this.getTplName(this.getContext(Context.NodeType)),
          [Prop.Data]: this.dynamicValue(this.transContext())
        })
      )
    }

    return template({ [Prop.Name]: this.getTplName(NodeType.Container) }, tmpl)
  }

  protected buildSlotTemplate(child: VNode) {
    return template({ [Prop.Name]: this.getTplName(NodeType.Slot) }, [
      block(
        {
          [this.Directive.if]: this.dynamicValue(
            this.getContextData(ContextData.Slot)
          )
        },
        [
          view(
            { slot: this.dynamicValue(this.getContextData(ContextData.Slot)) },
            [child]
          )
        ]
      ),
      block({ [this.Directive.else]: '' }, [child])
    ])
  }

  protected genBaseComponentsAttrs(attrs: Attributes, nodeType: NodeType) {
    const newAttrs: Attributes = Object.create(null)
    for (const prop in attrs) {
      if (hasOwn(attrs, prop)) {
        let propValue = attrs[prop]
        // 事件绑定
        const eventParsed = this.isEvent(prop)
        if (eventParsed) {
          propValue = this.dynamicValue(this.getXsUtils(XsUtils.Invoke))
          newAttrs[Prop.DataEventConfig] = this.getContextData(
            toCamelCase(Prop.DataEventConfig)
          )
          newAttrs[Prop.DataMpxUid] = this.getContextData(ContextData.Uid)
        } else if (prop === Prop.RawTag) {
          // do nothing
        } else if (propValue === '') {
          // <button primary></button> 单属性值的处理
          propValue = this.getContextData(toCamelCase(prop), nodeType)
        } else if (isBooleanStringLiteral(propValue) || isNumber(+propValue)) {
          const dValue = this.getContextData(toCamelCase(prop), nodeType)
          propValue = `${dValue}===undefined?${propValue}:${dValue}`
        } else {
          const dValue = this.getContextData(toCamelCase(prop), nodeType)
          propValue = `${dValue}||${propValue || singleQuote('')}`
        }
        newAttrs[prop] = propValue
      }
    }
    // 添加默认的属性，events
    if (nodeType !== NodeType.Block) {
      if (newAttrs[Prop.Style] || newAttrs[Prop.Class]) {
        newAttrs[Prop.Style] = this.getContextData(ContextData.Style)
      }
      if (attrs[Prop.Class]) {
        newAttrs[Prop.Class] = this.getContextData(ContextData.Class)
      }
    }
    // swiper-item 去除 style 配置
    if (nodeType === NodeType.SwiperItem) {
      delete newAttrs[Prop.Style]
    }
    return newAttrs
  }

  // 标准化内置component
  protected createBaseComponents(components: Component[]): Component[] {
    const result: Component[] = []
    components.forEach((v) => {
      const nodeType = toDashed(v.nodeType) as NodeType
      if (nodeType === NodeType.Slot) {
        return result.push({
          nodeType,
          attrs: {
            [Prop.Slot]: this.getContextData(ContextData.Name)
          }
        })
      }
      // 获取优化后节点及属性
      const optimizedNodeInfo = getOptimizedComponentInfo(
        {
          nodeType,
          attrs: v.attrs
        },
        this.mode
      )
      const attrs: Attributes = this.genBaseComponentsAttrs(
        optimizedNodeInfo?.attrs || v.attrs,
        nodeType
      )
      if (optimizedNodeInfo?.optimizeTag) {
        const { nodeType: optimizedNodeType } = optimizedNodeInfo
        // view
        if (optimizedNodeType === nodeType) {
          result.push({
            nodeType,
            attrs
          })
        }
        // static-view
        if (
          optimizedNodeType === nodeType ||
          optimizedNodeType.startsWith('static')
        ) {
          result.push({
            nodeType: `static-${nodeType}`,
            attrs: this.genBaseComponentsAttrs(
              {
                ...optimizedNodeInfo.staticAttrs,
                rawTag: nodeType
              },
              nodeType
            )
          })
        }
        // pure
        result.push({
          nodeType: `pure-${nodeType}`,
          attrs: this.genBaseComponentsAttrs(
            {
              ...optimizedNodeInfo.pureAttrs,
              rawTag: nodeType
            },
            nodeType
          )
        })
      } else {
        result.push({
          nodeType,
          attrs
        })
      }
    })
    return result
  }

  // 标准化自定义component
  protected createNormalComponents(components: Component[]): Component[] {
    const result: Component[] = []
    components.forEach((v) => {
      const optimizedNodeInfo = getOptimizedComponentInfo(
        {
          nodeType: v.nodeType,
          attrs: v.attrs
        },
        this.mode
      )
      const attrs = { ...(optimizedNodeInfo?.attrs || v.attrs) }
      for (const prop in attrs) {
        const eventParsed = this.isEvent(prop)
        if (eventParsed) {
          attrs[prop] = eventParsed.custom
            ? this.dynamicValue(this.getXsUtils(XsUtils.Invoke))
            : MpxGLobal.Invoke
          attrs[Prop.DataEventConfig] = this.getContextData(
            toCamelCase(Prop.DataEventConfig)
          )
          attrs[Prop.DataMpxUid] = this.getContextData(ContextData.Uid)
        } else if (prop === Prop.MpxAttrs) {
          attrs[prop] = this.getContextData()
        } else if (prop === Prop.MpxShow) {
          const dValue = this.getContextData(ContextData.MpxShow)
          attrs[prop] = `${dValue} === undefined ? true : ${dValue}`
        } else if (prop === Prop.Class && !attrs[Prop.Style]) {
          attrs[Prop.Style] = this.getContextData(ContextData.Style)
          attrs[Prop.Class] = this.getContextData(ContextData.Class)
        } else {
          attrs[prop] = this.getContextData(toCamelCase(prop))
        }
      }
      result.push({
        nodeType: v.nodeType,
        attrs: attrs
      })
    })

    return result
  }

  protected normalizeInputComponentOptions(
    componentOptions?: InputComponentsOptions
  ): Component[] {
    if (!componentOptions) return []
    const res: Component[] = []
    if (Array.isArray(componentOptions)) {
      componentOptions.forEach((componentConfig) => {
        if (typeof componentConfig === 'string') {
          res.push({ nodeType: componentConfig, attrs: {} })
        } else {
          res.push({
            nodeType: componentConfig.nodeType,
            attrs: flatArrWithObjectToObject(componentConfig.attrs || [])
          })
        }
      })
    } else {
      // { view: {} }
      Object.keys(componentOptions).forEach((key: string) => {
        res.push({
          nodeType: key,
          attrs: flatArrWithObjectToObject(componentOptions[key])
        })
      })
    }
    return res
  }

  protected normalizeInputOptions(inputOptions: InputOptions) {
    const baseComponents = this.normalizeInputComponentOptions(
      inputOptions.baseComponents
    )
    const runtimeComponents = this.normalizeInputComponentOptions(
      inputOptions.runtimeComponents
    )
    const normalComponents = this.normalizeInputComponentOptions(
      inputOptions.normalComponents
    )
    this.buildOptions = {
      baseComponents: this.createBaseComponents(baseComponents),
      runtimeComponents: this.createNormalComponents(runtimeComponents),
      normalComponents: this.createNormalComponents(normalComponents),
      inlineSlot: inputOptions.inlineSlot || this.mode === 'ali' ? true : false,
      templateCompilerConfig: inputOptions.templateCompilerConfig,
      proxyNormalComponentAttrs: inputOptions.proxyNormalComponentAttrs
    }
  }
}
