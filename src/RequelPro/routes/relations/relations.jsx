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
          <div className="large-3 medium-4 columns">
            <Tables/>
          </div>
          <div className="large-9 medium-8 columns end">
          Relations page
          </div>
        </div>
      </div>
    );
  }
});

export default Relations;
