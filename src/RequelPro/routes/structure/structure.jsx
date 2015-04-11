import React from 'react';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import styles from './structure.scss';

let Structure = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return this.getState();
  },
  componentDidMount() {
    layout.maximize('#structureTable', 26);
    this.inferSchema();
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    let state = this.getState();
    this.setState(state);
    this.inferSchema(state.table);
  },
  onRowSelect(row, e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      selectedRow: row
    });
  },
  onMenu(row, e) {
    e.preventDefault();
    e.stopPropagation();
    //let haveRow = !!this.state.selectedRow;
    //ContextMenu.items[0].enabled = haveRow;
    //ContextMenu.items[2].enabled = haveRow;
    //ContextMenu.popup(e.clientX, e.clientY);
  },
  /*
   * Methods
   */
  getState() {
    let params = this.context.router.getCurrentParams();
    let table = null;
    if (params.tableId) {
      table = Table.get(params.tableId);
    }
    return { table, fields: [] };
  },
  inferSchema(table) {
    (table || this.state.table).getFieldsAndTypes().then(fields => {
      this.setState({ fields });
    });
  },
  render() {
    let fields = this.state.fields.map(f => {
      let max = f.types[0];
      f.types.forEach(type => {
        if (type.reduction >= max.reduction) {
          max = type;
        }
      });
      return <tr key={f.name} className={f === this.state.selectedRow ? 'active' : ''} onClick={e => this.onRowSelect(f, e)}
        onContextMenu={e => this.onMenu(f, e)}>
        <td>{f.name}</td>
        <td>{max.group}</td>
      </tr>;
    });
    return (
      <div id="structure">
        <div id="structureTable" className="panel">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>{fields}</tbody>
          </table>
        </div>
      </div>
    );
  }
});

export default Structure;
