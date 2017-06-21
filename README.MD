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
``` css
.icon-table{
  background: url('build/styles/images/table.png') no-repeat center;
}
// or
.icon-table:before{
  content: '';
  ...
}
```
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
        { text : 'item-0', command: 'cmd-0', cls: 'icon-table' },
        '-',
        { 
          text: 'item-1', items: [
            { text: 'item-1-0', command: 'cmd-1-0', disabled: true },
            { text: 'item-1-1', command: 'cmd-1-1' }
          ]
        }
      ], e)
  })

```
# API

``` typescript
ContextMenu.show(items: Array, e: Event): void
ContextMenu.hide(): void
/*
 * currently, only itemclick event
 */
ContextMenu.on(event: String, hanler: Function): void
ContextMenu.off(event: String, hanler?: Function): void
```