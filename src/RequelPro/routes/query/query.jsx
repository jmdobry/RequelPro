import styles from './query.scss';
import React from 'react';
import layout from '../../services/layout.js';
import Tables from '../../components/tables/tables.jsx';

let Query = React.createClass({
  componentDidMount() {
    layout.maximize('#queryPage > .panel');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="queryPage">
        <div className="row">
          <div className="large-2 medium-3 columns side-area">
            <Tables/>
          </div>
          <div className="large-10 medium-9 columns end">
          Query page
          </div>
        </div>
      </div>
    );
  }
});

export default Query;
