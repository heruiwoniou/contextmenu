import dom from 'wind-dom'
var width
export const getScrollBarWidth = () => {
  if (width) return width
  var container = document.createElement('div')
  var content = document.createElement('div')

  dom.setStyle(container, 'height', '1px')
  dom.setStyle(container, 'width', '100%')
  dom.setStyle(container, 'overflow', 'scroll')
  dom.setStyle(container, 'marginLeft', '-99999px')
  dom.setStyle(container, 'position', 'fixed')

  dom.setStyle(content, 'width', '100%')
  dom.setStyle(content, 'height', '100px')

  container.appendChild(content)
  document.body.appendChild(container)
  width = container.offsetWidth - content.offsetWidth
  document.body.removeChild(container)

  return width
}
