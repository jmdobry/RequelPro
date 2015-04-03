import React from 'react';
import Connection from '../../models/connection.js';

let Navtabs = React.createClass({

  getInitialState() {
    return {
      connection: Connection.current(),
      connections: Connection.getAll()
    };
  },

  onChange(...args) {
    console.log(args);
    this.setState({ connection: Connection.current(), connections: Connection.getAll() });
  },

  componentDidMount() {
    Connection.on('change', this.onChange);
    Connection.on('connect', this.onChange);
  },

  componentWillUnmount() {
    Connection.off('change', this.onChange);
    Connection.off('connect', this.onChange);
  },

  onClick() {

  },

  render() {
    let num = 'hide';
    switch (this.state.connections.length) {
      case 1:
        num = 'one-up';
        break;
      case 2:
        num = 'two-up';
        break;
      case 3:
        num = 'three-up';
        break;
      case 4:
        num = 'four-up';
        break;
      case 5:
        num = 'five-up';
        break;
      case 6:
        num = 'six-up';
        break;
      case 7:
        num = 'seven-up';
        break;
      case 8:
        num = 'eight-up';
        break;
    }
    return (
      <div className={'icon-bar ' + num}>
      {this.state.connections.map(connection => {
        let classes = 'item';
        if (connection === this.state.connection) {
          classes += ' active';
        }
        return <a className={classes} href="" onClick={this.onClick.bind(null, connection)}>
          <label>{connection.host + '/' + connection.name}</label>
        </a>;
      })}
      </div>
    );
  }
});

export default Navtabs;
