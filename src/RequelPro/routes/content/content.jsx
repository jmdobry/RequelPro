import styles from './content.scss';
import gui from 'nw.gui';
import React from 'react';
import _ from 'lodash';
import layout from '../../services/layout.js';
import alert from '../../services/alert.js';
import Table from '../../models/table.js';
import Tables from '../../components/tables/tables.jsx';
import Filter from './filter/filter.jsx';
import ContextMenu from './contextMenu/contextMenu.js'

const defaults = {
  page: 1,
  operator: null,
  value: null,
  field: null,
  sort: null,
  direction: null,
  count: 0,
  data: [],
  fields: [],
  selectedRow: null
};

let getData = params => {
  let table = null;
  if (params.tableId) {
    table = Table.get(params.tableId);
  }
  return _.defaults({
    table
  }, defaults);
};

let Content = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    let data = getData(this.context.router.getCurrentParams());
    this.getTablePage(data);
    return data;
  },
  componentDidMount() {
    Table.on('change', this.onChange);
    ContextMenu.on('copy', this.onCopyRow);
    ContextMenu.on('addRow', this.onAddRow);
    Table.on('addRow', this.onAddRow);
    layout.maximize('#contentTable', 37 + 26);
  },
  componentWillUnmount() {
    Table.off('change', this.onChange);
    ContextMenu.off('copy', this.onCopyRow);
    ContextMenu.off('addRow', this.onAddRow);
    Table.off('addRow', this.onAddRow);
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    let data = getData(this.context.router.getCurrentParams());
    if (data.table && this.state.table !== data.table) {
      this.getTablePage(data);
    }
    this.setState(data);
  },
  onRowSelect(row, e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      selectedRow: row
    });
  },
  onFieldSelect(e) {
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
    this.getTablePage(options);
  },
  onMenu(row, e) {
    e.preventDefault();
    e.stopPropagation();
    let haveRow = !!this.state.selectedRow;
    ContextMenu.items[0].enabled = haveRow;
    ContextMenu.items[2].enabled = haveRow;
    ContextMenu.popup(e.clientX, e.clientY);
  },
  onCopyRow(e) {
    if (e) {
      e.preventDefault();
    }
    alert.error('Not yet implemented!');
  },
  onPageForward(e) {
    e.preventDefault();
    if (this.state.hasMorePages) {
      this.getTablePage({ page: this.state.page + 1 });
    }
  },
  onPageBack(e) {
    e.preventDefault();
    if (this.state.page > 1) {
      this.getTablePage({ page: this.state.page - 1 });
    }
  },
  onRefresh(e) {
    e.preventDefault();
    this.getTablePage();
  },
  onDeleteSelectedRows(e) {
    e.preventDefault();
    if (Table.is(this.state.table)) {
      this.state.table.deleteRows(this.state.selectedRow).then(() => {
        return this.getTablePage();
      }, err => alert.error('Failed to delete row(s)!', err));
    }
  },
  onAddRow(e) {
    if (e) {
      e.preventDefault();
    }
    this.clearSelection();
    alert.error('Not yet implemented!');
  },
  onDuplicateSelectedRow(e) {
    e.preventDefault();
    alert.error('Not yet implemented!');
  },
  /*
   * Methods
   */
  getTablePage(options = {}) {
    options = _.defaults(options, this.state);
    let page = options.page;
    return (options.table || this.state.table).getData(options).then(result => {
      options.data = result.data;
      options.fields = this.extractFields(result.data);
      options.count = result.count;
      options.page = page;
      options.hasMorePages = Table.TABLE_PAGE_SIZE * page < result.count;
      this.setState(options);
    }).catch(err => alert.error('Failed to retrieve data!', err));
  },
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
      return <tr key={d.id} className={d === this.state.selectedRow ? 'active' : ''} onClick={e => this.onRowSelect(d, e)}
        onContextMenu={e => this.onMenu(d, e)}>
      {this.state.fields.map(f => {
        let v = this.format(d[f]);
        return <td key={d.id + '-' + f} className="contentField" onDoubleClick={this.onFieldSelect} title={v}>
        {v}
        </td>;
      })}
      </tr>;
    });
    let showingStart = (Table.TABLE_PAGE_SIZE * (this.state.page - 1)) + 1;
    let showingEnd = Math.min(Table.TABLE_PAGE_SIZE * this.state.page, this.state.count);
    return (
      <div id="contentPage" onClick={this.clearSelection}>
        <Filter onChange={this.getTablePage} fields={this.state.fields}/>
        <div id="contentTable" className="panel">
          <table>
            <thead>
              <tr>
            {this.state.fields.map(f => {
              return <th key={f} className="contentHeader" onClick={e => this.onSort(f, e)} title={'Sort by ' + f}>
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
        </div>
        <div id="bottomBar" className="panel">
          <div className="left">
            <ul className="button-group">
              <li onClick={this.onAddRow} title="Add row (⌥⌘A)">
                <a href="" className="button">
                  <i className="fa fa-plus"></i>
                </a>
              </li>
              <li onClick={this.onDeleteSelectedRows} title="Delete selected row(s) (⌦)">
                <a href="" className="button" disabled={!this.state.selectedRow}>
                  <i className="fa fa-minus"></i>
                </a>
              </li>
              <li onClick={this.onDuplicateSelectedRow} title="Duplicate selected row (⌘D)">
                <a href="" className="button" disabled={!this.state.selectedRow}>
                  <i className="fa fa-files-o"></i>
                </a>
              </li>
              <li onClick={this.onRefresh} title="Refresh table contents (⌘R)">
                <a href="" className="button">
                  <i className="fa fa-refresh"></i>
                </a>
              </li>
            </ul>
            <span id="rowText">
            Rows {showingStart} - {showingEnd} of ~{this.state.count} from table
            </span>
          </div>
          <div className="right">
            <ul className="pagination">
              <li className={'arrow' + (this.state.page === 1 ? ' unavailable' : '')} onClick={this.onPageBack}
                title="View previous page of results">
                <a href="">&laquo; Previous</a>
              </li>
              <li className={'arrow' + (this.state.hasMorePages ? '' : ' unavailable')} onClick={this.onPageForward}
                title="View next page of results">
                <a href="">Next &raquo;</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

export default Content;
