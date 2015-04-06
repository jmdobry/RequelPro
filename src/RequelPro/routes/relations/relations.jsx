import styles from './relations.scss';
import React from 'react';
import layout from '../../services/layout.js';
import Tables from '../../components/tables/tables.jsx';

let Relations = React.createClass({
  componentDidMount() {
    layout.maximize('#relationsPage > .panel');
  },
  /*
   * Methods
   */
  render() {
    return (
      <div id="relationsPage">
        <div className="row">
          <div className="large-2 medium-3 columns side-area">
            <Tables/>
          </div>
          <div className="large-10 medium-9 columns end">
          Relations page
          </div>
        </div>
      </div>
    );
  }
});

export default Relations;
