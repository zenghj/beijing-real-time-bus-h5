import Vue from 'vue'
import Message from './Message.vue' // 这里的Message只是一个组件的配置对象
const MessageConstructor = Vue.extend(Message) // 生成构造函数
export default function message(text, duration = 1000) {
  let instance = new MessageConstructor({
    el: document.createElement('div'),
    propsData: {
      text: String(text), 
      duration,
    }
  })
  document.body.appendChild(instance.$el)
}