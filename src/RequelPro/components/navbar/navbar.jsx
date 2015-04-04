import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import Connection from '../../models/connection.js';

let Navbar = React.createClass({

  getInitialState() {
    return {
      connection: Connection.current(),
      links: [
        { icon: 'database', label: 'Structure', name: 'structure' },
        { icon: 'table', label: 'Content', name: 'content' },
        { icon: 'sitemap', label: 'Relations', name: 'relations' },
        { icon: 'info', label: 'Table Info', name: 'info' }
      ]
    };
  },

  onChange(...args) {
    console.log(args);
    this.setState({ connection: Connection.current() });
  },

  componentDidMount() {
    Connection.on('connect', this.onChange);
  },

  componentWillUnmount() {
    Connection.off('connect', this.onChange);
  },

  onLinkClick() {
    if (this.state.connection.id === 'none') {
      return false;
    }
  },

  render() {
    let classes = classnames({
      item: true,
      disabled: this.state.connection.id === 'none'
    });
    return (
      <div className="icon-bar five-up">
        <a className="item">
          <i className="fa fa-list"></i>
          <label>Databases</label>
        </a>
      {this.state.links.map(link => {
        return <Link key={link.name} className={classes} to={link.name} params={this.state.connection} onClick={this.onLinkClick}>
          <i className={'fa fa-' + link.icon}></i>
          <label>{link.label}</label>
        </Link>
      })}
      </div>
    );
  }
});

export default Navbar;
