var system = require('system');

if (system.args.length < 3) {
    console.log("Missing arguments.");
    phantom.exit();
}
//creating webserver
var server = require('webserver').create();
var port = parseInt(system.args[1]);
var urlPrefix = system.args[2];
//render url
var renderHtml = function(url, cb) {
    var page = require('webpage').create();
    //added user agent
     page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
    page.settings.loadImages = true;
    page.settings.localToRemoteUrlAccessEnabled = true;
    //added webpage width and height for better result
        page.viewportSize = {
      width: 800,
      height: 480
    };
    page.onCallback = function() {
        cb(page.content);
        page.close();
    };
    page.onConsoleMessage = function(msg, lineNum, sourceId) {
       console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
   };

   //you can change callback second. It's 15 second best for me
    page.onInitialized = function() {
       page.evaluate(function() {
            setTimeout(function() {
                window.callPhantom();
            }, 15000);
        });
    };
    page.open(url);
};
//server start
server.listen(port, function (request, response) {
    console.log(urlPrefix+request.url)
    renderHtml(urlPrefix+request.url, function(html) {
        response.statusCode = 200;
        response.write(html);
        response.close();
    });
});

console.log('Listening on ' + port + '...');
console.log('Press Ctrl+C to stop.');
