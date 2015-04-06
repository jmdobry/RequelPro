import styles from './content.scss';
import React from 'react';
import _ from 'lodash';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import Tables from '../../components/tables/tables.jsx';
import Filter from './filter/filter.jsx';

let Content = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    let table = Table.current();
    if (Table.is(table)) {
      this.onFilterChange({ table });
    }
    return {
      table: Table.current(),
      data: [],
      fields: []
    };
  },
  componentDidMount() {
    Table.on('table', this.onChange);
    layout.maximize('#contentTable', 37);
  },
  componentWillUnmount() {
    Table.off('table', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    let table = Table.current();
    if (Table.is(table) && table !== this.state.table) {
      this.onFilterChange({ table });
    }
    this.setState({ table, fields: [] });
  },
  selectRow(row, e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      selectedRow: row
    });
  },
  selectField(e) {
    e.stopPropagation();
  },
  clearSelection() {
    this.setState({ selectedRow: null });
  },
  onFilterChange(options) {
    return options.table.getData(options).then(data => {
      this.setState({
        data,
        fields: this.extractFields(data)
      });
    }).catch(err => alert.error('Failed to retrieve data!', err));
  },
  /*
   * Methods
   */
  extractFields(data) {
    let fields = [];
    data.forEach(d => {
      fields = fields.concat(Object.keys(d));
    });
    return _.uniq(fields).sort();
  },
  format(v) {
    if (_.isDate(v)) {
      return v.toString();
    } else if (_.isUndefined(v)) {
      return '';
    }
    return v;
  },
  render() {
    let rows = this.state.data.map(d => {
      return <tr key={d.id} className={d === this.state.selectedRow ? 'active' : ''} onClick={e => this.selectRow(d, e)}>
      {this.state.fields.map(f => {
        return <td key={d.id + '-' + f} className="contentField" onDoubleClick={this.selectField}>
        {this.format(d[f])}
        </td>;
      })}
      </tr>;
    });
    return (
      <div id="contentPage" onClick={this.clearSelection}>
        <div className="row">
          <div className="large-2 medium-3 columns side-area">
            <Tables/>
          </div>
          <div className="large-10 medium-9 columns end">
            <Filter onChange={this.onFilterChange} fields={this.state.fields}/>
            <div id="contentTable" className="panel">
              <table className={this.state.table.id === 'none' ? ' hidden' : ''}>
                <thead>
                  <tr>
                {this.state.fields.map(f => {
                  return <th key={f} className="contentHeader">{f}</th>;
                })}
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
              <div className={this.state.table.id === 'none' ? '' : ' hide'}>
              Select a table to begin...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Content;
