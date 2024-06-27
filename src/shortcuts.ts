// 字符串简写
export const enum NodeType {
  // nodeType
  View = 'view',
  Swiper = 'swiper',
  SwiperItem = 'swiper-item',
  Block = 'block',
  Text = '#text',
  Image = 'image',
  Slot = 'slot',
  Template = 'template',
  Element = 'element',
  CatchView = 'catch-view',
  StaticView = 'static-view',
  PureView = 'pure-view',
  StaticText = 'static-text',
  StaticImage = 'static-image',
  Container = 'container',
  Icon = 'icon',
  Progress = 'progress',
  RichText = 'rich-text',
  Button = 'button',
  Checkbox = 'checkbox',
  CheckboxGroup = 'checkbox-group',
  Form = 'form',
  Input = 'input',
  Label = 'label',
  Picker = 'picker',
  PickerView = 'picker-view',
  PickerViewColumn = 'picker-view-column',
  Radio = 'radio',
  RadioGroup = 'radio-group',
  Slider = 'slider',
  Switch = 'switch',
  CoverImage = 'cover-image',
  Textarea = 'textarea',
  CoverView = 'cover-view',
  MovableArea = 'movable-area',
  MovableView = 'movable-view',
  ScrollView = 'scroll-view',
  Navigator = 'navigator',
  Audio = 'audio',
  Camera = 'camera',
  LivePlayer = 'live-player',
  Video = 'video',
  Canvas = 'canvas',
  Ad = 'ad',
  WebView = 'webview',
  Map = 'map',
  SlotView = 'slot-view',
  Wxs = 'wxs'
}

// <view {Prop[key]}="{any}" />
export const enum Prop {
  RawTag = 'rawTag',
  MpxAttrs = 'mpxAttrs',
  MpxShow = 'mpxShow',
  Style = 'style',
  Class = 'class',
  DataMpxUid = 'data-mpxuid',
  DataEventConfig = 'data-eventconfigs',
  Data = 'data',
  Name = 'name',
  Is = 'is',
  R = 'r',
  Slot = 'slot'
}

// temlate 渲染上下文的简写
// data="{{ i }}", 一般情况下 i = VNode
export const ContextName = 'i'

// 渲染上下文的属性
// {ContextName}.{ContextName[key]} => i.xxx
export const enum Context {
  Children = 'c',
  Text = 'ct',
  NodeType = 'nt',
  Data = 'd'
}

// template 上下文中的Data
// {ContextName}.{ContextName.Data}.{ContextName.Data[key]} => i.d.xxx
export const ContextData = {
  Style: 'style',
  Class: 'class',
  Name: 'name',
  Uid: 'uid',
  MpxShow: 'mpxShow',
  DataMpxUid: 'uid',
  Slot: 'slot'
}


export const enum XsUtils {
  Module = 'xs',
  B = 'b', // 获取默认值
  Invoke = 'invoke' // 执行xs的event代理
}

export const enum MpxGLobal {
  Invoke = '__invoke'
}