# CONTEXTMENU

![display](https://heruiwoniou.github.io/assets/images/contextmenu.gif)

# INSTALL
```
yarn install / npm install
```
# RUN
```
npm run dev
npm run server

```
# USE
``` javascript
// listener event
ContextMenu.on('itemclick', function (type, e, cmd) {
  console.log(arguments)
})
// bind comtextmenu event
document.querySelector('.somedom')
  .addEventListener('contextmenu', 
    function (e) {
      ContextMenu.show([
        { text : 'item-0', command: 'cmd-0' },
        '-',
        { 
          text: 'item-1', items: [
            { text: 'item-1-0', command: 'cmd-1-0' },
            { text: 'item-1-1', command: 'cmd-1-1' }
          ]
        }
      ], e)
  })

```