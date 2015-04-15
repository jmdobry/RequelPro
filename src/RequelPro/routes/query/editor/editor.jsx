import React from 'react';
import CodeMirror from 'codemirror';
import codemirrorMode from 'codemirror/mode/javascript/javascript.js';
import codemirrorCloseBrackets from 'codemirror/addon/edit/closebrackets.js';
import codemirrorMatchBrackets from 'codemirror/addon/edit/matchbrackets.js';
import codemirrorStyles from 'codemirror/lib/codemirror.css'
import codemirrorTheme from 'codemirror/theme/neo.css'
import layout from '../../../services/layout.js';
import styles from './editor.scss';

let codemirror = null;

let Editor = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return this.getState();
  },
  componentDidMount() {
    codemirror = CodeMirror(document.getElementById('codemirror'), {
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      mode: 'javascript',
      theme: 'neo',
      value: ''
    });
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(this.getState());
  },
  /*
   * Methods
   */
  getState() {
    return {};
  },
  render() {
    return (
      <div id="editor" className="panel">
        <div id="codemirror"></div>
      </div>
    );
  }
});

export default Editor;
