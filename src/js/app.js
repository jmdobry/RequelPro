/**
 * @jsx React.DOM
 */
var gui = require("nw.gui");
var win = gui.Window.get();

win.on("loaded", function () {
  win.show();
  win.maximize();
  win.removeAllListeners("loaded");
});

function loadFavorites() {
  var favorites = [];
  try {
    var f = localStorage.getItem("favorites");
    if (f) {
      favorites = JSON.parse(f);
    } else {
      localStorage.setItem("favorites", favorites);
    }
  } catch (err) {
    console.error(err);
    console.error("Failed to load favorites!");
  }
  return favorites;
}

// var tabNav = React.createClass({
//   displayName: "tabNav",
//   render: function() {
//     var createTab = function(tab) {
//       return <li>{tab.connection.name}</li>;
//     };
//     return <ul>{this.props.tabs.map(createTab)}</ul>;
//   }
// });

var favoritesList = React.createClass({
  displayName: "favoritesList",
  render: function() {
    var createFav = function(fav) {
      return <li>{fav.name}</li>;
    };
    return <ul>{this.props.favorites.map(createFav)}</ul>;
  }
});

var requelPro = React.createClass({
  displayName: "RequelPro",
  getInitialState: function () {
    return {
      favorites: loadFavorites(),
      tabs: []
    };
  },
  render: function () {
    return (
      <div>
      <favoritesList favorites={this.state.favorites} />
      RequelPro
      </div>
      );
  }
});

React.renderComponent(requelPro(null), document.getElementById("main-view"));
