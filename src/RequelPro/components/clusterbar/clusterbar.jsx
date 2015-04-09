import React from 'react';
import classnames from 'classnames';
import Connection from '../../models/connection.js';
import styles from './clusterbar.scss';

const links = [
  { icon: 'heartbeat', label: 'Status', name: 'status', title: 'Switch to the Status tab (⌘6)' },
  { icon: 'server', label: 'Servers', name: 'servers', title: 'Switch to the Servers tab (⌘7)' }
];

let Clusterbar = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    let data = this.getState();
    data.links = links;
    return data;
  },
  componentDidMount() {
    Connection.on('change', this.onChange);
    Connection.on('route', this.onClick);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Connection.off('route', this.onClick);
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(this.getState());
  },
  onClick(link, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (this.state.connection) {
      this.context.router.transitionTo(link.name, this.context.router.getCurrentParams());
    }
  },
  /*
   * Methods
   */
  getState() {
    let params = this.context.router.getCurrentParams();
    let connection = null;
    if (params.id) {
      connection = Connection.get(params.id);
    }
    return { connection };
  },
  render() {
    this.state.links.forEach(link => {
      link.classes = classnames({
        item: true,
        disabled: !this.state.connection,
        active: this.context.router.getCurrentPathname().indexOf(link.name) !== -1
      });
    });
    return (
      <div id="clusterBar">
        <div id="clusterLabel" className={this.state.connection ? 'active' : ''}>Cluster</div>
        <div className="icon-bar two-up">
      {this.state.links.map(link => {
        return <a href="" key={link.name} className={link.classes} onClick={e => this.onClick(link, e)} title={link.title}>
          <i className={'fa fa-' + link.icon}></i>
          <label>{link.label}</label>
        </a>
      })}
        </div>
      </div>
    );
  }
});

export default Clusterbar;
