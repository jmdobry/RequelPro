import styles from './filter.scss';
import React from 'react';
import _ from 'lodash';
import {Table} from '../../../models';

const operators = [
  '==',
  '!=',
  '>',
  '<',
  '>=',
  '<=',
  'in',
  'is null'
];

const defaults = {
  field: 'id',
  value: '',
  operator: '==',
  operators
};

export const Filter = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    return this.getData(this.context.router.getCurrentParams());
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(this.getData(this.context.router.getCurrentParams()));
  },
  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.table) {
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
  getData(params) {
    let table = null;
    if (params.tableId) {
      table = Table.get(params.tableId);
    }
    return _.defaults({
      table,
      field: this.state ? this.state.field : undefined,
      value: this.state ? this.state.value : undefined,
      operator: this.state ? this.state.operator : undefined
    }, defaults);
  },
  render() {
    let disabled = !this.state.table;
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
                  <label title="Choose a field you want to use for your search">
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
              <label title="Choose a search operator">
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
                  <input type="text" ref="value" value={this.state.value} onChange={this.onValueChange} disabled={disabled}
                    placeholder="Enter search value here..." title="Enter search value here..."/>
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
