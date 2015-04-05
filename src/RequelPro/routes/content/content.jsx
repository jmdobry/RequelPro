import styles from './content.scss';
import React from 'react';
import Connection from '../../models/connection.js';
import Tables from '../../components/tables/tables.jsx';

let Content = React.createClass({
  /*
   * Methods
   */
  render() {
    return (
      <div id="contentPage">
        <div className="row">
          <div className="large-3 medium-4 columns">
            <Tables/>
          </div>
          <div className="large-9 medium-8 columns end">
          Content page
          </div>
        </div>
      </div>
    );
  }
});

export default Content;
