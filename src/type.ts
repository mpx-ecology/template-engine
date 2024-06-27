
export type ModeConfig = {
  typeExtMap: {
    json: string
    script: string
    template: string
    styles: string
  }
  tabBar: {
    customKey: string
    itemKey: string
    iconKey: string
    activeIconKey: string
  }
  event: {
    parseEvent(attr: any):
      | {
          prefix: string
          eventName: string
          modifier: string
          custom: boolean
        }
      | undefined
    getEvent(eventName: any, prefix?: string): string
    defaultModelProp: string
    defaultModelEvent: string
    defaultModelValuePath: string
    shallowStringify(obj: any): string
  }
  wxs: {
    tag: string
    module: string
    src: string
    ext: string
    templatePrefix: string
  }
  directive: {
    if: string
    elseif: string
    else: string
    model: string
    modelProp: string
    modelEvent: string
    modelValuePath: string
    modelFilter: string
    for: string
    forIndex: string
    forItem: string
    key: string
    dynamicClass: string
    dynamicStyle: string
    ref: string
    show: string
  }
}
