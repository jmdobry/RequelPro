angular.module('templates-app', ['connect/controllers/connectPage.html', 'content/controllers/contentPage.html']);

angular.module("connect/controllers/connectPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("connect/controllers/connectPage.html",
    "<div id=\"connectPage\">\n" +
    "    <div class=\"row\">\n" +
    "        <form name=\"connectForm\" id=\"connectForm\" class=\"col-sm-4 col-sm-offset-4\"\n" +
    "              data-ng-submit=\"ConnectCtrl.connect()\">\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"host\">Host</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"host\" name=\"host\" placeholder=\"Default: 127.0.0.1\"/>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"port\">Port</label>\n" +
    "                <input type=\"number\" class=\"form-control\" id=\"port\" name=\"port\" placeholder=\"Default: 28015\"/>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"db\">Database</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"db\" name=\"db\" placeholder=\"Default: Null\"/>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"authKey\">Auth Key</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"authKey\" name=\"authKey\" placeholder=\"Default: Null\"/>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary\">Connect</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("content/controllers/contentPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/controllers/contentPage.html",
    "content\n" +
    "");
}]);
