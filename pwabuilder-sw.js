//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache-v8';
var precacheFiles = [
  '/',
  '/index.html?v=1234',
  '/index2.html',
  '/bill.html',
  '/checkout.html',
  '/pay.html',
  '/register.html',
  '/register2.html',
  '/assets/automat.png',
  '/assets/checked-symbol.svg',
  '/assets/logo_smarpay.svg',
  '/Roboto-Regular.woff',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css',
  'https://code.jquery.com/jquery-3.2.1.slim.min.js',
  'https://unpkg.com/popper.js@1.12.6/dist/umd/popper.js',
  'https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js'
      /* Add an array of files to precache for your app */
    ];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function(evt) {
  console.log('[PWA Builder] The service worker is being installed.');
  evt.waitUntil(precache().then(function() {
    console.log('[PWA Builder] Skip waiting on install');
    return self.skipWaiting();
  }));
});


//allow sw to control of current page
self.addEventListener('activate', function(event) {
  console.log('[PWA Builder] Claiming clients for current page');
  console.log('claims', self.clients);
  return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  console.log('[PWA Builder] The service worker is serving the asset.'+ evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the 
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request){
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function(response){ return response});
}
