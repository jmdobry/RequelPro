import styles from './filter.scss';
import React from 'react';
import Table from '../../../models/table.js';

let Filter = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    return {
      table: Table.current(),
      value: '',
      field: 'id',
      operator: '==',
      operators: [
        '==',
        '!=',
        '>',
        '<',
        '>=',
        '<=',
        'in',
        'is null'
      ]
    };
  },
  componentDidMount() {
    Table.on('table', this.onChange);
  },
  componentWillUnmount() {
    Table.off('table', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState({
      table: Table.current()
    });
  },
  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.table.id === 'none') {
      return;
    }
    this.props.onChange(this.state);
  },
  onFieldSelect(e) {
    this.setState({
      field: e.target.value
    });
  },
  onOperatorSelect(e) {
    this.setState({
      operator: e.target.value
    });
  },
  onValueChange(e) {
    this.setState({
      value: e.target.value
    });
  },
  /*
   * Methods
   */
  render() {
    let disabled = this.state.table.id === 'none';
    return (
      <div id="filter" className="panel">
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="large-3 columns">
              <div className="row collapse">
                <div className="small-3 columns">
                  <label className="inline">Filter:</label>
                </div>
                <div className="small-9 columns end">
                  <label>
                    <select value={this.state.field} onChange={this.onFieldSelect} disabled={disabled} id="fieldSelect">
                      {this.props.fields.map(f => {
                        return <option key={f} value={f}>{f}</option>;
                      })}
                    </select>
                  </label>
                </div>
              </div>
            </div>
            <div className="large-1 columns">
              <label>
                <select value={this.state.operator} onChange={this.onOperatorSelect} disabled={disabled} id="operatorSelect">
                {this.state.operators.map(op => {
                  return <option key={op} value={op}>{op}</option>;
                })}
                </select>
              </label>
            </div>
            <div className="large-8 columns">
              <div className="row collapse">
                <div className="large-11 columns">
                  <input type="text" ref="value" value={this.state.value} onChange={this.onValueChange} disabled={disabled} placeholder="Enter filter value here..."/>
                </div>
                <div className="large-1 columns end">
                  <button type="submit" className="button success tiny" disabled={disabled}>Go</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export default Filter;
