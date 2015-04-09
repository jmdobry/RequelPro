import React from 'react';
import classnames from 'classnames';
import Connection from '../../models/connection.js';
import Table from '../../models/table.js';
import styles from './navbar.scss';

const links = [
  { icon: 'cogs', label: 'Structure', name: 'structure', title: 'Switch to the Table Structure tab (⌘1)' },
  { icon: 'table', label: 'Content', name: 'content', title: 'Switch to the Table Content tab (⌘2)' },
  { icon: 'sitemap', label: 'Relations', name: 'relations', title: 'Switch to the Table Relations tab (⌘3)' },
  { icon: 'info-circle', label: 'Table Info', name: 'info', title: 'Switch to the Table Info tab (⌘4)' },
  { icon: 'terminal', label: 'Query', name: 'query', title: 'Switch to the Run Query tab (⌘5)' }
];

let Navbar = React.createClass({
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
    Table.on('change', this.onChange);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Connection.off('route', this.onClick);
    Table.off('change', this.onChange);
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
    let table = null;
    if (params.id) {
      connection = Connection.get(params.id);
    }
    if (params.tableId) {
      table = Table.get(params.tableId);
    }
    return { connection, table };
  },
  render() {
    this.state.links.forEach(link => {
      link.classes = classnames({
        item: true,
        disabled: !this.state.connection || !this.state.table,
        active: this.context.router.getCurrentPathname().indexOf(link.name) !== -1
      });
    });
    return (
      <div className="icon-bar five-up">
      {this.state.links.map(link => {
        return <a href="" key={link.name} className={link.classes} onClick={e => this.onClick(link, e)} title={link.title}>
          <i className={'fa fa-' + link.icon}></i>
          <label>{link.label}</label>
        </a>
      })}
      </div>
    );
  }
});

export default Navbar;
