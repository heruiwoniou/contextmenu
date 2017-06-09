const placereg = /\s*$/

let getListener = function (obj, type, force) {
  var allListeners
  type = type.toLowerCase()
  return ((allListeners = (obj.__allListeners || (force && (obj.__allListeners = {})))) &&
    (allListeners[type] || (force && (allListeners[type] = []))))
}

let removeItem = function (array, item) {
  var i
  var l
  if (item === undefined) {
    for (i = array.length - 1; i >= 0; i--) { array.splice(i, 1) }
  } else {
    for (i = 0, l = array.length; i < l; i++) {
      if (array[i] === item) {
        array.splice(i, 1)
        i--
      }
    }
  }
}

let trim = function (str) {
  return str.replace(placereg, '')
}

export default class EventBase {
  addListener (types, listener) {
    let i
    let ti
    types = trim(types).split(/\s+/)
    for (i = 0; ti = types[i++];) {
      getListener(this, ti, true).push(listener)
    }
  }
  on (types, listener) {
    return this.addListener(types, listener)
  }
  off (types, listener) {
    return this.removeListener(types, listener)
  }
  trigger () {
    return this.fireEvent.apply(this, arguments)
  }
  removeListener (types, listener) {
    let i
    let ti
    types = trim(types).split(/\s+/)
    for (i = 0; ti = types[i++];) {
      removeItem(getListener(this, ti) || [], listener)
    }
  }
  fireEvent () {
    let types = arguments[0]
    types = trim(types).split(' ')
    let i
    let ti
    for (i = 0; ti = types[i++];) {
      var listeners = getListener(this, ti)
      var r
      var t
      var k
      if (listeners) {
        k = listeners.length
        var start = -1
        while (++start < k) {
          if (!listeners[start]) continue
          t = listeners[start].apply(this, arguments)
          if (t === true) {
            return t
          }
          if (t !== undefined) {
            r = t
          }
        }
      }
      if (t = this['on' + ti.toLowerCase()]) {
        r = t.apply(this, arguments)
      }
    }
    return r
  }
}
