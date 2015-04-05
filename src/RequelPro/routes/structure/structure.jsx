import styles from './structure.scss';
import React from 'react';
import layout from '../../services/layout.js';
import Tables from '../../components/tables/tables.jsx';

let Structure = React.createClass({
  componentDidMount() {
    layout.maximize('#structurePage > .panel');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="structurePage">
        <div className="row">
          <div className="large-3 medium-4 columns">
            <Tables/>
          </div>
          <div className="large-9 medium-8 columns end">
          Structure page
          </div>
        </div>
      </div>
    );
  }
});

export default Structure;
