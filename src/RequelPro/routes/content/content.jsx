import styles from './content.scss';
import React from 'react';
import _ from 'lodash';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import Tables from '../../components/tables/tables.jsx';
import Filter from './filter/filter.jsx';

const TABLE_PAGE_SIZE = 100;

let Content = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    let table = Table.current();
    if (Table.is(table)) {
      this.onFilterChange({ table, sort: '', direction: '', page: 1, count: 0, data: [] });
    }
    return {
      table: Table.current(),
      data: [],
      fields: [],
      page: 1,
      sort: null,
      count: 0
    };
  },
  componentDidMount() {
    Table.on('table', this.onChange);
    layout.maximize('#contentTable', 37 + 26);
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
      this.onFilterChange({ table, sort: '', direction: '', page: 1, count: 0, data: [] });
    }
    this.setState({ table, fields: [], sort: '', direction: '', page: 1, count: 0, data: [] });
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
  onSort(field) {
    let options = {
      sort: '',
      direction: '',
      value: this.state.value,
      field: this.state.field,
      page: this.state.page,
      operator: this.state.operator
    };
    if (field === this.state.sort) {
      if (this.state.direction !== 'desc') {
        options.direction = 'desc';
        options.sort = field;
      }
    } else {
      options.sort = field;
      options.direction = 'asc';
    }
    this.onFilterChange(options);
  },
  onFilterChange(options) {
    if (!options.hasOwnProperty('page')) {
      options.page = this.state.page;
    }
    if (!options.hasOwnProperty('sort')) {
      options.sort = this.state.sort;
    }
    if (!options.hasOwnProperty('direction')) {
      options.direction = this.state.direction;
    }
    if (!options.hasOwnProperty('field')) {
      options.field = this.state.field;
    }
    if (!options.hasOwnProperty('value')) {
      options.value = this.state.value;
    }
    if (!options.hasOwnProperty('operator')) {
      options.operator = this.state.operator;
    }
    let page = this.state.page;
    return (options.table || this.state.table).getData(options).then(result => {

      while (TABLE_PAGE_SIZE * page > result.count && page) {
        page--;
      }
      options.data = result.data;
      options.fields = this.extractFields(result.data);
      options.count = result.count;
      options.page = page;
      options.hasMorePages = TABLE_PAGE_SIZE * page < result.count;
      this.setState(options);
    }).catch(err => alert.error('Failed to retrieve data!', err));
  },
  pageForward(e) {
    e.preventDefault();
    if (this.state.hasMorePages) {
      this.onFilterChange({ page: this.state.page + 1 });
    }
  },
  pageBack(e) {
    e.preventDefault();
    if (this.state.page > 1) {
      this.onFilterChange({ page: this.state.page - 1 });
    }
  },
  refresh(e) {
    e.preventDefault();
    this.onFilterChange({});
  },
  deleteSelectedRows(e) {
    e.preventDefault();
    if (Table.is(this.state.table)) {
      this.state.table.deleteRows(this.state.selectedRow).then(() => {
        return this.onFilterChange({});
      }, err => alert.error('Failed to delete row(s)!', err));
    }
  },
  addRow(e) {
    e.preventDefault();
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
    let showingStart = (TABLE_PAGE_SIZE * (this.state.page - 1)) + 1;
    let showingEnd = Math.min(TABLE_PAGE_SIZE * this.state.page, this.state.count);
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
                  return <th key={f} className="contentHeader" onClick={e => this.onSort(f, e)}>
                    {f}
                    <span id="sort-arrows" className="right">
                      <i id="up-sort" className={'fa fa-caret-up ' + (this.state.direction === 'asc' && this.state.sort === f ? 'active' : '')}></i>
                      <i id="down-sort" className={'fa fa-caret-down ' + (this.state.direction === 'desc' && this.state.sort === f ? 'active' : '')}></i>
                    </span>
                  </th>;
                })}
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
              <div className={this.state.table.id === 'none' ? '' : ' hide'}>
              Select a table to begin...
              </div>
            </div>
            <div id="bottomBar" className="panel">
              <div className="left">
                <ul className="button-group">
                  <li onClick={this.addRow}>
                    <a href="" className="button" disabled={this.state.table.id === 'none'}>
                      <i className="fa fa-plus"></i>
                    </a>
                  </li>
                  <li onClick={this.deleteSelectedRows}>
                    <a href="" className="button" disabled={!this.state.selectedRow || this.state.table.id === 'none'}>
                      <i className="fa fa-minus"></i>
                    </a>
                  </li>
                  <li onClick={this.refresh}>
                    <a href="" className="button" disabled={this.state.table.id === 'none'}>
                      <i className="fa fa-refresh"></i>
                    </a>
                  </li>
                </ul>
                <span id="rowText" className={this.state.table.id === 'none' ? 'hidden' : ''}>
                Rows {showingStart} - {showingEnd} of ~{this.state.count} from table
                </span>
              </div>
              <div className="right">
                <ul className="pagination">
                  <li className={'arrow' + (this.state.page === 1 ? ' unavailable' : '')} onClick={this.pageBack}>
                    <a href="">&laquo; Previous</a>
                  </li>
                  <li className={'arrow' + (this.state.hasMorePages ? '' : ' unavailable')} onClick={this.pageForward}>
                    <a href="">Next &raquo;</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Content;
