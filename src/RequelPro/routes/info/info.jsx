import styles from './info.scss';
import React from 'react';
import layout from '../../services/layout.js';
import Tables from '../../components/tables/tables.jsx';

let Info = React.createClass({
  /*
   * Lifecycle
   */
  componentDidMount() {
    layout.maximize('#infoPage');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="infoPage">
        <div className="row">
          <div className="large-3 medium-4 columns">
            <Tables/>
          </div>
          <div className="large-9 medium-8 columns end">
          Info page
          </div>
        </div>
      </div>
    );
  }
});

export default Info;
