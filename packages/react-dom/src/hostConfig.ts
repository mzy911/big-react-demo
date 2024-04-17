import { FiberNode } from 'react-reconciler/src/fiber';
import { HostComponent, HostText } from 'react-reconciler/src/workTags';
import { Props } from 'shared/ReactTypes';
import { updateFiberProps, DOMElement } from './SyntheticEvent';

export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

// 创建 DOM 节点
export const createInstance = (type: string, props: Props): Instance => {
  // TODO 处理props
  const element = document.createElement(type) as unknown;
  updateFiberProps(element as DOMElement, props);
  return element as DOMElement;
};

// 向父元素中插入子元素
export const appendInitialChild = (
  parent: Instance | Container,
  child: Instance
) => {
  parent.appendChild(child);
};

// 创建文本节点
export const createTextInstance = (content: string) => {
  return document.createTextNode(content);
};

export const appendChildToContainer = appendInitialChild;

// commit 的 更新
export const commitUpdate = (fiber: FiberNode) => {
  switch (fiber.tag) {
    case HostText:
      const text = fiber.memoizedProps?.content;
      return commitTextUpdate(fiber.stateNode, text);
    case HostComponent:
      return updateFiberProps(fiber.stateNode, fiber.memoizedProps);
    default:
      if (__DEV__) {
        console.warn('未实现的Update类型', fiber);
      }
      break;
  }
};

export const commitTextUpdate = (
  textInstance: TextInstance,
  content: string
) => {
  textInstance.textContent = content;
};

export const removeChild = (
  child: Instance | TextInstance,
  container: Container
) => {
  container.removeChild(child);
};

export const insertChildToContainer = (
  child: Instance,
  container: Container,
  before: Instance
) => {
  container.insertBefore(child, before);
};

// 判断环境中是否支持微任务，支持使用 Promise 否则使用 setTimeout
export const scheduleMicroTask =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : typeof Promise === 'function'
    ? (callback: (...args: any) => void) => Promise.resolve(null).then(callback)
    : setTimeout;

export const hideInstance = (instance: Instance) => {
  const style = (instance as HTMLElement).style;
  style.setProperty('display', 'none', 'important');
};

export const unHideInstance = (instance: Instance) => {
  const style = (instance as HTMLElement).style;
  style.display = '';
};

export const hideTextInstance = (textInstance: TextInstance) => {
  textInstance.nodeValue = '';
};

export const unHideTextInstance = (
  textInstance: TextInstance,
  text: string
) => {
  textInstance.nodeValue = text;
};
