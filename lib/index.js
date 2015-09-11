/*globals app:true */

require('mapbox.js')

var header = require('components/header');
var footer = require('components/footer');

var c = require('config');
var m = require('mithril');

var routes = require('routes');

// var moment = require('moment');
// require('moment/locale/pt-br');
// moment.locale('pt-br');

m.render(document.getElementById('container'), [
  m('#header'),
  m('#main'),
  m('#footer'),
  // m('#fb-root') // facebook sdk div
]);

routes.init();

m.mount(document.getElementById('header'), header);
m.mount(document.getElementById('footer'), footer);

// // redirect users from facebook to rigth page
// var arrayUrl = window.location.search.replace('&fb_ref=Default','').split('%2F');
// if (arrayUrl[1]) {
//   var gourl = '/'+arrayUrl[1]+'/'+arrayUrl[2];
//   m.route(gourl);
// }

// window.fbAsyncInit = function() {
//     FB.init({
//         appId      : c.getAppFacebookId(),
//         version    : 'v2.2'
//     });
// };