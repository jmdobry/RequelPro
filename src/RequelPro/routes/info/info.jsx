import React from 'react';
import layout from '../../services/layout.js';
import Table from '../../models/table.js';
import styles from './info.scss';

let Info = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    let state = this.getState();
    state.table.getStatus();
    return state;
  },
  componentDidMount() {
    layout.maximize('#info');
    Table.on('change', this.onChange());
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.state.table.getStatus().then(table => {
      console.log(table);
      this.setState(this.getState());
    });
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
    let indexes = this.state.table.indexes ? this.state.table.indexes : [];
    console.log(indexes);
    return (
      <div id="info" className="panel">
        <h4>{this.state.table.name}</h4>
        <hr/>
        <div className="row">
          <div className="medium-6 columns">
            <div className="row">
              <div className="medium-3 columns">
                <table>
                  <thead>
                    <tr>
                      <th colSpan="2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Documents</td>
                      <td>~{this.state.table.doc_count_estimates ? this.state.table.doc_count_estimates[0] : ''}</td>
                    </tr>
                    <tr>
                      <td>Primary Key</td>
                      <td>{this.state.table.primary_key}</td>
                    </tr>
                    <tr>
                      <td>Durability</td>
                      <td>{this.state.table.durability}</td>
                    </tr>
                    <tr>
                      <td>Write Acks</td>
                      <td>{this.state.table.write_acks}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="medium-3 columns end">
                <table>
                  <thead>
                    <tr>
                      <th colSpan="2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>All Replicas Ready</td>
                      <td>{this.state.table.status.all_replicas_ready.toString()}</td>
                    </tr>
                    <tr>
                      <td>Ready for Outdated Reads</td>
                      <td>{this.state.table.status.ready_for_outdated_reads.toString()}</td>
                    </tr>
                    <tr>
                      <td>Ready for Reads</td>
                      <td>{this.state.table.status.ready_for_reads.toString()}</td>
                    </tr>
                    <tr>
                      <td>Ready for Writes</td>
                      <td>{this.state.table.status.ready_for_writes.toString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <h5>Indexes</h5>
              <hr/>
              {indexes.map(index => {
                return <div className="index">
                  <table>
                    <tbody>
                      <tr>
                        <td>Index</td>
                        <td>{index.index}</td>
                      </tr>
                      <tr>
                        <td>Outdated</td>
                        <td>{index.outdated ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <td>Ready</td>
                        <td>{index.ready ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <td>Multi</td>
                        <td>{index.multi ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <td>Geo</td>
                        <td>{index.geo ? 'Yes' : 'No'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>;
              })}
            </div>
          </div>
          <div className="medium-6 columns end">
          {this.state.table.shards.map(shard => {
            return <div className="shard">
              {shard.replicas.map(replica => {
                return <div className="replica">{replica}</div>;
              })}
            </div>;
          })}
          </div>
        </div>
      </div>
    );
  }
});

export default Info;
