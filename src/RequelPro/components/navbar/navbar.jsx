import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import Connection from '../../models/connection.js';
import Table from '../../models/table.js';
import styles from './navbar.scss';

const links = [
  { icon: 'database', label: 'Structure', name: 'structure' },
  { icon: 'table', label: 'Content', name: 'content' },
  { icon: 'sitemap', label: 'Relations', name: 'relations' },
  { icon: 'info', label: 'Table Info', name: 'info' },
  { icon: 'terminal', label: 'Query', name: 'query' }
];

let getData = params => {
  let connection = null;
  let table = null;
  if (params.id) {
    connection = Connection.get(params.id);
  }
  if (params.tableId) {
    table = Table.get(params.tableId);
  }
  return { connection, table };
};

let Navbar = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  /*
   * Lifecycle
   */
  getInitialState() {
    let data = getData(this.context.router.getCurrentParams());
    data.links = links;
    return data;
  },
  componentDidMount() {
    Connection.on('change', this.onChange);
  },
  componentWillUnmount() {
    Connection.off('change', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState(getData(this.context.router.getCurrentParams()));
  },
  componentWillReceiveProps() {
    this.onChange();
  },
  onClick(link, e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.connection) {
      this.context.router.transitionTo(link.name, this.context.router.getCurrentParams());
    }
  },
  /*
   * Methods
   */
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
        return <a href="" key={link.name} className={link.classes} onClick={e => this.onClick(link, e)}>
          <i className={'fa fa-' + link.icon}></i>
          <label>{link.label}</label>
        </a>
      })}
      </div>
    );
  }
});

export default Navbar;
