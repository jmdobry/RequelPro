/**
 * @jsx React.DOM
 */
(function(window, document) {
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

    var tabNav = React.createClass({
          displayName: "tabNav",
          render: function() {
            var createTab = function(tab) {
              return <li class="tab-nav-item">{tab.connection.name}</li>;
            };
            return <ul id="tab-nav">{this.props.tabs.map(createTab)}</ul > ;
          }
        });

    var favoritesList = React.createClass({
          displayName: "favoritesList",
          render: function() {
            var createFav = function(fav) {
              return <li class="favs-list-item">{fav.name}</li>;
            };
            return <ul id="favs-list">{this.props.favorites.map(createFav)}</ul > ;
          }
        });

    var newConnection = React.createClass({
          displayName: "newConnection",
          render: function() {
            return (
              <div id="new-connection">
                <h1>Connect</h1>
              </div>
              );
          }
    });

  window.requelPro = React.createClass({
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
        <tabNav tabs={this.state.tabs} />
        <favoritesList favorites = {this.state.favorites}/>
        <newConnection/>
        <input id="import-file-dialog" type="file" accept=".gz" />
        </div>
        );
    }
  });

  window.gui = require("nw.gui");
  window.win = window.gui.Window.get();

  window.win.y = window.screen.availTop;
  window.win.x = window.screen.availLeft;
  window.win.height = window.screen.availHeight;
  window.win.width = window.screen.availWidth;

  React.renderComponent(window.requelPro(null), document.getElementById("main-view"));

  $(function () {
    gui.Window.get().show();
  });

  function Menu() {
    var gui = require("nw.gui");
    var menu = new gui.Menu();

    var cut = new gui.MenuItem({
        label: "Cut\t\t\t\u2318X",
        click: function() {
          document.execCommand("cut");
        }
      });

    var copy = new gui.MenuItem({
        label: "Copy\t\t\u2318C",
        click: function() {
          document.execCommand("copy");
        }
      });

    var paste = new gui.MenuItem({
        label: "Paste\t\t\u2318V",
        click: function() {
          document.execCommand("paste");
        }
      });

    var deleteOption = new gui.MenuItem({
        label: "Delete\t\t\u232b",
        click: function() {
          document.execCommand("delete");
        }
      });

    var selectAll = new gui.MenuItem({
        label: "Select All\t\t\u2318A",
        click: function() {
          document.execCommand("selectAll");
        }
      });

    menu.append(cut);
    menu.append(copy);
    menu.append(paste);
    menu.append(deleteOption);
    menu.append(selectAll);

    return menu;
  }

  var menu = new Menu();
  $(document).on("contextmenu", function(e) {
    e.preventDefault();
    menu.popup(e.originalEvent.x, e.originalEvent.y);
  });

  var editKey = "ctrl";
  if (process.platform === "darwin") {
    editKey = "command";
  }

  Mousetrap.bindGlobal(editKey + "+a", function() {
    document.execCommand("selectAll");
  });

  Mousetrap.bindGlobal(editKey + "+x", function() {
    document.execCommand("cut");
  });

  Mousetrap.bindGlobal(editKey + "+c", function() {
    document.execCommand("copy");
  });

  Mousetrap.bindGlobal(editKey + "+v", function() {
    document.execCommand("paste");
  });
})(window, document);
