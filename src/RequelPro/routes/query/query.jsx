import React from 'react';
import layout from '../../services/layout.js';
import styles from './query.scss';
import Editor from './editor/editor.jsx';
import Results from './results/results.jsx';

let Query = React.createClass({
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
    layout.maximize('#query');
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
      <div id="query">
        <Editor/>
        <Results/>
      </div>
    );
  }
});

export default Query;
