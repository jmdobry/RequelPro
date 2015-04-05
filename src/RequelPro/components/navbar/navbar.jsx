import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import Connection from '../../models/connection.js';
import styles from './navbar.scss';

let Navbar = React.createClass({
  /*
   * Lifecycle
   */
  getInitialState() {
    return {
      connection: Connection.current(),
      links: [
        { icon: 'database', label: 'Structure', name: 'structure' },
        { icon: 'table', label: 'Content', name: 'content' },
        { icon: 'sitemap', label: 'Relations', name: 'relations' },
        { icon: 'info', label: 'Table Info', name: 'info' },
        { icon: 'terminal', label: 'Query', name: 'query' }
      ]
    };
  },
  componentDidMount() {
    Connection.on('connect', this.onChange);
  },
  componentWillUnmount() {
    Connection.off('connect', this.onChange);
  },
  /*
   * Event Handlers
   */
  onChange() {
    this.setState({
      connection: Connection.current()
    });
  },
  onLinkClick(link, e) {
    if (this.state.connection.id === 'none') {
      e.preventDefault();
      e.stopPropagation();
    } else {
      let connection = Connection.current();
      connection.section = link.name;
      this.setState({ connection });
    }
  },
  /*
   * Methods
   */
  render() {
    this.state.links.forEach(link => {
      link.classes = classnames({
        item: true,
        disabled: this.state.connection.id === 'none',
        active: this.state.connection.section === link.name && this.state.connection.id !== 'none'
      });
    });
    return (
      <div className="icon-bar five-up">
      {this.state.links.map(link => {
        return <Link key={link.name} className={link.classes} to={link.name} params={this.state.connection}
          onClick={e => this.onLinkClick(link, e)}>
          <i className={'fa fa-' + link.icon}></i>
          <label>{link.label}</label>
        </Link>
      })}
      </div>
    );
  }
});

export default Navbar;
