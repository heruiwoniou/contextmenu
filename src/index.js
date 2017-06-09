import EventBase from './scripts/eventbase.js'
import dom from 'wind-dom'

class ContextMenu extends EventBase {
  constructor () {
    super()

    this.el = null
    this.handler = null
    this.x = null
    this.y = null

    this.__init__()
  }

  show (items, e) {
    this.hide()
    if (!items || items.length === 0) return
    this.x = e.clientX
    this.y = e.clientY
    this.__render__(items)
    dom.setStyle(this.el, 'left', this.x + 'px')
    dom.setStyle(this.el, 'top', this.y + 'px')
    dom.setStyle(this.el, 'marginLeft', '-99999px')
    dom.setStyle(this.el, 'display', 'block')
    var width = this.el.offsetWidth
    if (this.x + width > document.body.offsetWidth) {
      dom.setStyle(this.el, 'left', this.x - width + 'px')
    }

    dom.setStyle(this.el, 'marginLeft', 0)
    this.__bindListener__()
  }

  hide () {
    dom.setStyle(this.el, 'display', 'none')
    this.el.innerHTML = ''
    this.__destroyListner__()
  }

  __init__ () {
    this.el = document.createElement('div')
    dom.addClass(this.el, 'contextmenu')
    document.body.appendChild(this.el)

    this.__initEvent__()
  }

  __bindListener__ () {
    this.handler = (e) => {
      if (!this.el.contains(e.target)) { this.hide() }
    }
    dom.on(document, 'click', this.handler)
    dom.on(document, 'mousewheel', this.handler)
  }

  __destroyListner__ () {
    if (this.handler === null) return
    dom.off(document, 'click', this.handler)
    dom.off(document, 'mousewheel', this.handler)
    this.handler = null
  }

  __initEvent__ () {
    dom.on(this.el, 'click', (e) => {
      var cmd
      var target = e.target
      if (e.target.className !== 'item') return
      if (target && (cmd = target.getAttribute('command'))) {
        this.fireEvent('itemclick', e, cmd)
        this.hide()
      } else return false
    })
    dom.on(this.el, 'mouseover', (e) => {
      var el = e.target || e.toElement
      if (el.className !== 'item') return
      var dl = 'swap-display-left'
      var dr = 'swap-display-right'
      if (!el.getAttribute('command')) {
        var parent = el.parentElement
        var ul = parent.querySelector('ul')
        var w = this.x + parent.offsetWidth + ul.offsetWidth
        var d = w > (document.body.offsetWidth - 10)
        dom.removeClass(parent, d ? dr : dl)
        dom.addClass(parent, d ? dl : dr)
      }
    })
    dom.on(this.el, 'contextmenu', (e) => e.preventDefault())
  }

  __render__ (items, deep = 0) {
    let frag = document.createElement('ul')
    let i = -1
    let last
    while (++i !== items.length) {
      let item = items[i]
      let hasChild = false
      let li = document.createElement('li')
      if (item === '-' || !item) {
        li.className = 'line'
        if (last && last.className === 'line') continue
      } else {
        let text = document.createElement('a')
        let icon = document.createElement('i')
        let txt = document.createTextNode(item.text)
        icon.className = item.cls ? item.cls : ''
        text.appendChild(icon)
        text.appendChild(txt)
        text.className = 'item'
        if (item.command) text.setAttribute('command', item.command)
        text.setAttribute('deep', deep)
        li.appendChild(text)
        if (item.items && item.items !== 0) {
          let childNode = this.__render__(item.items, deep + 1)
          if (childNode) {
            li.appendChild(childNode)
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
      if (!(start.className === 'line' ? frag.removeChild(start) : false) &&
        !(end.className === 'line' ? frag.removeChild(end) : false)) { break }
    }
    return deep === 0 ? this.el.appendChild(frag) : (frag.childNodes.length === 0 ? null : frag)
  }
}

let contextmenu = null
export default {
  show (items, e) {
    if (contextmenu === null) contextmenu = new ContextMenu()
    contextmenu.show(items, e)
    e.preventDefault()
  },
  on () {
    if (contextmenu === null) contextmenu = new ContextMenu()
    contextmenu.on.apply(contextmenu, arguments)
  },
  off () {
    if (contextmenu === null) contextmenu = new ContextMenu()
    contextmenu.off.apply(contextmenu, arguments)
  }
}
