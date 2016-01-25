// import gui from 'nw.gui';
import {alert} from '../../../services'
import {utils} from 'js-data'

// export const ContextMenu = new gui.Menu();
export const ContextMenu = {}

// ContextMenu.append(new gui.MenuItem({
//   label: 'Copy',
//   click(e) {
//     ContextMenu.emit('copy', e);
//   },
//   key: 'c',
//   modifiers: 'cmd'
// }));

// ContextMenu.append(new gui.MenuItem({ type: 'separator' }));

// ContextMenu.append(new gui.MenuItem({
//   label: 'Edit row as JSON',
//   click() {
//     alert.error('Not yet implemented!');
//   },
//   key: 'e',
//   modifiers: 'cmd'
// }));

// ContextMenu.append(new gui.MenuItem({ type: 'separator' }));

// ContextMenu.append(new gui.MenuItem({
//   label: 'Add new row',
//   click(e) {
//     ContextMenu.emit('addRow', e);
//   },
//   key: 'a',
//   modifiers: 'alt-cmd'
// }));

utils.eventify(ContextMenu)
