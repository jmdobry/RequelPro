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
          <div className="large-2 medium-3 columns side-area">
            <Tables/>
          </div>
          <div className="large-10 medium-9 columns end">
          Info page
          </div>
        </div>
      </div>
    );
  }
});

export default Info;
