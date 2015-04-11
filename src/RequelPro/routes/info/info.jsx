import React from 'react';
import layout from '../../services/layout.js';
import alert from '../../services/alert.js';
import Table from '../../models/table.js';
import styles from './info.scss';
import pascalCase from 'mout/string/pascalCase';

let Info = React.createClass({
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
    layout.maximize('#info');
    Table.on('change', this.onChange);
    this.onChange();
  },
  componentWillUnmount() {
    Table.off('change', this.onChange());
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.state.table.getStatus().then(() => {
      this.setState(this.getState());
    }).catch(err => alert.error('Failed to retrieve table status!', err));
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
    return { table };
  },
  render() {
    let table = this.state.table;
    let indexes = table.indexes ? table.indexes : [];
    return (
      <div id="info" className="panel">
        <div className="row">
          <div className="medium-6 columns left-column">
            <h4>Table:&nbsp;&nbsp;
              <strong>{table.name}</strong>
            </h4>
            <hr/>
            <div className="row">
              <div className="medium-6 columns">
                <table id="details">
                  <thead>
                    <tr>
                      <th colSpan="2">
                        <strong>Details</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Documents</td>
                      <td>~{table.doc_count_estimates ? table.doc_count_estimates[0] : ''}</td>
                    </tr>
                    <tr>
                      <td>Primary Key</td>
                      <td>{table.primary_key}</td>
                    </tr>
                    <tr>
                      <td>Durability</td>
                      <td>{table.durability}</td>
                    </tr>
                    <tr>
                      <td>Write Acks</td>
                      <td>{table.write_acks}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="medium-6 columns end">
                <table id="status">
                  <thead>
                    <tr>
                      <th colSpan="2">
                        <strong>Status</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>All Replicas Ready</td>
                      <td className={table.status.all_replicas_ready ? 'success' : 'alert'}>
                        <i className={table.status.all_replicas_ready ? 'fa fa-circle' : 'fa fa-close'}></i>
                        {table.status.all_replicas_ready ? 'Yes' : 'No'}
                      </td>
                    </tr>
                    <tr>
                      <td>Ready for Outdated Reads</td>
                      <td className={table.status.ready_for_outdated_reads ? 'success' : 'alert'}>
                        <i className={table.status.ready_for_outdated_reads ? 'fa fa-circle' : 'fa fa-close'}></i>
                        {table.status.ready_for_outdated_reads ? 'Yes' : 'No'}
                      </td>
                    </tr>
                    <tr>
                      <td>Ready for Reads</td>
                      <td className={table.status.ready_for_reads ? 'success' : 'alert'}>
                        <i className={table.status.ready_for_reads ? 'fa fa-circle' : 'fa fa-close'}></i>
                        {table.status.ready_for_reads ? 'Yes' : 'No'}
                      </td>
                    </tr>
                    <tr>
                      <td>Ready for Writes</td>
                      <td className={table.status.ready_for_writes ? 'success' : 'alert'}>
                        <i className={table.status.ready_for_writes ? 'fa fa-circle' : 'fa fa-close'}></i>
                        {table.status.ready_for_writes ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <h5>Indexes</h5>
              <hr/>
              <div className="index">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <strong>Index</strong>
                      </th>
                      <th>Ready</th>
                      <th>Outdated</th>
                      <th>Multi</th>
                      <th>Geo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indexes.map(index => {
                      return <tr key={index.index}>
                        <td>{index.index}</td>
                        <td className={index.ready ? 'success' : 'alert'}>
                          <i className={index.ready ? 'fa fa-circle' : 'fa fa-close'}></i>
                          {index.ready ? 'Yes' : 'No'}
                        </td>
                        <td className={index.outdated ? 'alert' : 'success'}>
                          <i className={index.outdated ? 'fa fa-close' : 'fa fa-circle'}></i>
                          {index.outdated ? 'Yes' : 'No'}
                        </td>
                        <td>{index.multi ? 'Yes' : 'No'}</td>
                        <td>{index.geo ? 'Yes' : 'No'}</td>
                      </tr>;
                    })}
                    <tr className={indexes.length ? 'hidden' : ''}>
                      <td colSpan="5">No indexes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="medium-6 columns end right-column">
            <h4>Shards</h4>
            <hr/>
            <div className="shards">
              {table.shards.map(shard => {
                return <div className="shard panel">
                  {shard.replicas.map(replica => {
                    return <div className="replica">
                      <h6>
                        {replica.name}&nbsp;
                        <span className={replica.status === 'connected' ? 'success' : 'alery'}>
                          <i className={replica.status === 'connected' ? 'fa fa-circle' : 'fa fa-close'}></i>
                          {pascalCase(replica.status)}
                        </span>
                      &nbsp;
                        <span className={replica.state === 'ready' ? 'success' : 'alery'}>
                          <i className={replica.state === 'ready' ? 'fa fa-circle' : 'fa fa-close'}></i>
                          {pascalCase(replica.state)}
                        </span>
                      </h6>
                      <hr className="mini"/>
                    </div>;
                  })}
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Info;
