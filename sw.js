importScripts('js/sw-utils.js');

const STATIC_CACHE      = 'static_v3';
const DINAMIC_CACHE     = 'dinamic_v1';
const INMUTABLE_CACHE   = 'inmutable_v1';

const APP_SHELL = [
    '/',
    'index.html',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'img/favicon.ico',
    'css/style.css',
    'js/app.js',
    'js/sw-utils.js'
];


const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]


// INSTLACION
self.addEventListener('install', e =>{
    const cacheStatico = caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => 
        cache.addAll(APP_SHELL_INMUTABLE));

    
    e.waitUntil(Promise.all([cacheStatico, cacheInmutable]));
});

// ACTIVACION, BORRAR CACHES ANTIGUOS
self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        })
    })

    e.waitUntil(respuesta);
});


// FETCH
self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        if(res) {
            return res;
        } else{
                      
            return fetch(e.request).then(res => {
                return actualizaCachesDinamicos(DINAMIC_CACHE, e.request, res);
            })
        }
    })

    e.respondWith(respuesta);
})
