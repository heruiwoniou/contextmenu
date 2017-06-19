import EventBase from './scripts/eventbase.js'
import dom from 'wind-dom'
import { getScrollBarWidth } from './scripts/scrollBarWidth.js'

class ContextMenu extends EventBase {
  constructor() {
    super()

    this.el = null
    this.handler = null
    this.x = null
    this.y = null
    this.scrollBarHeight = 10
    this.scrollBarWidth = 0
    this.placeholder = []
    this.max = {
      width: null,
      height: null
    }

    this.__init__()
  }

  show(items, e) {
    this.hide()
    if (!items || items.length === 0) return
    this.x = e.clientX
    this.y = e.clientY
    this.placeholder = []
    this.max.width = document.documentElement.offsetWidth - getScrollBarWidth()
    this.max.height = document.documentElement.offsetHeight
    this.__render__(items)
    let ul = this.el.querySelector('ul')
    dom.setStyle(this.el, 'left', this.x + 'px')
    dom.setStyle(this.el, 'top', this.y + 'px')
    dom.setStyle(ul, 'height', 'auto')
    dom.setStyle(ul, 'margin', '0')
    var width = this.el.offsetWidth
    if (this.x + width > document.body.offsetWidth) {
      dom.setStyle(this.el, 'left', this.x - width + 'px')
    }
    if (this.el.offsetHeight > this.max.height) {
      dom.addClass(this.el, 'contextmenu--scroll')
      dom.setStyle(ul, 'height', this.max.height - 10 - this.scrollBarHeight * 2 + 'px')
      dom.setStyle(ul, 'margin', this.scrollBarHeight + 'px 0')
      dom.setStyle(this.el, 'top', '2px')
    }
    dom.setStyle(this.el, 'marginTop', 0)
    this.__bindListener__()
  }

  hide() {
    dom.setStyle(this.el, 'marginTop', '')
    this.el.innerHTML = ''
    this.__clearPlaceHolder__()
    this.__destroyListner__()
  }

  __init__() {
    this.container = document.createElement('div')
    this.el = document.createElement('div')
    dom.addClass(this.container, 'contextmenu__container')
    dom.addClass(this.el, 'contextmenu')
    this.container.appendChild(this.el)
    document.body.appendChild(this.container)

    this.__bindGlobalListener__()
  }
  __scrollBarClickHandler__(e) {
    let el = e.target || e.toElement
    if (el.className.indexOf('contextmenu__scrollbar') === -1) return
    let up = el.classList[el.classList.length - 1] === 'contextmenu__scrollbar--top'
    let ul = up ? el.nextElementSibling : el.previousElementSibling
    ul.scrollTop = ul.scrollTop + (up ? -1 : 1) * 10
  }
  __clickHandler__(e) {
    if (!this.container.contains(e.target)) { this.hide() } else {
      var cmd
      var target = e.target
      // 待添加上级判断
      if (e.target.className !== 'contextmenu__item') return
      if (target && (cmd = target.getAttribute('command'))) {
        this.fireEvent('itemclick', e, cmd)
        this.hide()
      } else return false
    }
  }
  __mouseWheelHander__(e) {
    if (!this.container.contains(e.target)) { this.hide() }
  }
  __mouseOverHandler__(e) {
    var el = e.target || e.toElement
    if (el.className !== 'contextmenu__item') return
    if (!el.getAttribute('command')) {
      var parent = el.parentElement
      this.__setPlaceHolder__(parent.querySelector('.contextmenu--sub'))
    } else this.__clearPlaceHolder__(~~el.getAttribute('deep'))
  }

  __contenxtMenuHandler__(e) {
    if (!this.container.contains(e.target)) { this.hide() } else {
      e.preventDefault()
    }
  }
  __bindGlobalListener__() {
    dom.on(window, 'resize', () => this.hide())
    dom.on(document, 'click', (e) => this.__scrollBarClickHandler__(e))
  }
  __bindListener__() {
    this.mousewheelhandler = (e) => this.__mouseWheelHander__(e)
    this.clickhandler = (e) => this.__clickHandler__(e)
    this.mouseoverhandler = (e) => this.__mouseOverHandler__(e)
    dom.on(document, 'click', this.clickhandler)
    dom.on(document, 'mousewheel', this.mousewheelhandler)
    dom.on(document, 'mouseover', this.mouseoverhandler)
  }

  __destroyListner__() {
    if (this.mousewheelhandler === null) return
    dom.off(document, 'click', this.clickhandler)
    dom.off(document, 'mousewheel', this.mousewheelhandler)
    dom.off(document, 'mouseover', this.mouseoverhandler)
    this.mousewheelhandler = null
    this.clickhandler = null
    this.mouseoverhandler = null
  }

  __clearPlaceHolder__(index = 0) {
    var arr = this.placeholder.splice(index)
    arr.reverse().forEach(placeholder => {
      dom.setStyle(placeholder[0], 'marginTop', '')
      placeholder[1].parentNode.insertBefore(placeholder[0], placeholder[1])
      placeholder[1].parentNode.removeChild(placeholder[1])
    })
  }

  __setPlaceHolder__(el, addSub = false) {
    if (el) {
      let placeholder
      if (this.placeholder.length === 0 || addSub) {
        placeholder = [
          el,
          document.createElement('div')
        ]
        el.parentNode.insertBefore(placeholder[1], el)
        dom.setStyle(el, 'marginTop', '0')
        this.container.appendChild(el)
        this.placeholder.push(placeholder)
        let offset = {
            left: 0,
            top: 0
          },
          box = {
            width: placeholder[1].parentNode.offsetWidth,
            height: placeholder[1].parentNode.offsetHeight
          },
          p = placeholder[1],
          ul = el.querySelector('ul')
        do {
          offset.left += p.offsetLeft
          offset.top += p.offsetTop
        } while ((p = p.offsetParent))
        if (box.width + offset.left + el.offsetWidth >= this.max.width) {
          dom.setStyle(el, 'left', offset.left - el.offsetWidth + 'px')
        } else { dom.setStyle(el, 'left', box.width + offset.left + 'px') }
        if (el.offsetHeight > this.max.height) {
          dom.setStyle(el, 'top', '2px')
          dom.addClass(el, 'contextmenu--scroll')
          dom.setStyle(ul, 'height', this.max.height - 10 - this.scrollBarHeight * 2 + 'px')
          dom.setStyle(ul, 'margin', this.scrollBarHeight + 'px 0')
        } else if (offset.top + el.offsetHeight - box.height > this.max.height) {
          dom.setStyle(el, 'top', this.max.height - el.offsetHeight - 2 + 'px')
        } else { dom.setStyle(el, 'top', offset.top - box.height + 'px') }
      } else if (this.placeholder.length === ~~el.getAttribute('deep') && this.placeholder[this.placeholder.length - 1][0] !== el) {
        this.__clearPlaceHolder__(this.placeholder.length - 1)
        this.__setPlaceHolder__(el, true)
      } else if (this.placeholder.length < ~~el.getAttribute('deep')) {
        this.__setPlaceHolder__(el, true)
      } else if (this.placeholder.length > ~~el.getAttribute('deep')) {
        this.__clearPlaceHolder__(~~el.getAttribute('deep') - 1)
        this.__setPlaceHolder__(el, true)
      }
    }
  }
  __renderContext__(el, context, deep) {
    if (deep !== 0) {
      let sub = document.createElement('div')
      dom.addClass(sub, 'contextmenu contextmenu--sub')
      sub.setAttribute('deep', deep)
      el.appendChild(sub)
      el = sub
    }
    el.setAttribute('deep', deep)
    var scrollTop = document.createElement('a')
    var scrollBottom = document.createElement('a')
    scrollTop.setAttribute('href', 'javascript:;')
    scrollBottom.setAttribute('href', 'javascript:;')
    dom.addClass(scrollTop, 'contextmenu__scrollbar contextmenu__scrollbar--top')
    dom.addClass(scrollBottom, 'contextmenu__scrollbar contextmenu__scrollbar--bottom')
    el.appendChild(scrollTop)
    el.appendChild(context)
    el.appendChild(scrollBottom)
  }

  __render__(items, deep = 0) {
    let frag = document.createElement('ul')
    let i = -1
    let last
    while (++i !== items.length) {
      let item = items[i]
      let hasChild = false
      let li = document.createElement('li')
      if (item === '-' || !item) {
        li.className = 'contextmenu__line'
        if (last && last.className === 'contextmenu__line') continue
      } else {
        let text = document.createElement('a')
        let icon = document.createElement('i')
        let txt = document.createTextNode(item.text)
        icon.className = item.cls ? item.cls : ''
        text.appendChild(icon)
        text.appendChild(txt)
        text.className = 'contextmenu__item'
        if (item.command) text.setAttribute('command', item.command)
        text.setAttribute('deep', deep)
        li.appendChild(text)
        if (item.items && item.items !== 0) {
          let childNode = this.__render__(item.items, deep + 1)
          if (childNode) {
            this.__renderContext__(li, childNode, deep + 1)
            hasChild = true
          }
        }
      }
      if (!(item && !item.command && !hasChild) || item === '-' || !item) {
        frag.appendChild(li)
        last = li
      }
    }
    // clear start/end node
    let start, end
    while (frag.children.length !== 0) {
      start = frag.children[0]
      end = frag.children[frag.children.length - 1]
      if (!(start.className === 'contextmenu__line' ? frag.removeChild(start) : false) &&
        !(end.className === 'contextmenu__line' ? frag.removeChild(end) : false)) { break }
    }
    return deep === 0 ? this.__renderContext__(this.el, frag, deep) : (frag.childNodes.length === 0 ? null : frag)
  }
}

let contextmenu = null
export default {
  show(items, e) {
    if (contextmenu === null) contextmenu = new ContextMenu()
    contextmenu.show(items, e)
    e.preventDefault()
  },
  on() {
    if (contextmenu === null) contextmenu = new ContextMenu()
    contextmenu.on.apply(contextmenu, arguments)
  },
  off() {
    if (contextmenu === null) contextmenu = new ContextMenu()
    contextmenu.off.apply(contextmenu, arguments)
  }
}
