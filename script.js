


if ('serviceWorker' in navigator) { 
    var interceptorLoaded = navigator.serviceWorker.controller!=null;
    window.addEventListener('load', function() { 
      navigator.serviceWorker.register('sw.js')
      .then(function(registration){
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          if(!interceptorLoaded){
            //refresh after interceptor was loaded but only if the interceptor was not already loaded.
            //window.location=window.location.href; 
            window.location.reload();

          }
      },
        function(err) { // registration failed :( 
        console.log('ServiceWorker registration failed: ', err); 
      }); 
  }); 
}    