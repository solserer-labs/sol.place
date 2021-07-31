var CACHE_NAME = "cache-v1";

self.addEventListener("install", function (event) {
  //console.log("install eventss");
  //console.log(event);
});

self.importScripts("dnsbundle.js");
self.addEventListener("activate", function (event) {
  //console.log("SW activate:", event);
});
function isFile(pathname) {
  return pathname.split('/').pop().indexOf('.') > 0;
}
self.addEventListener("fetch", function (event) {
  //console.log("fetch event");
  //console.log(event);
  //console.log("REQUEST:", event.request.url);
  var parts = location.hostname.split(".");
  
  //console.log(self.registration.scope)
  var subdomain = parts.shift();
  var upperleveldomain = parts.join(".");
  //console.log("subdomain : ", subdomain);
  //console.log("updomain: ", upperleveldomain);
  //console.log("url ", event.request.url)
  if (
    (subdomain == "sol" && upperleveldomain == "place") ||
    (subdomain == "localhost" && upperleveldomain != "place")
  ) {
    
    event.respondWith(handleRequest(event.request, "beyond"));
  } else if (
    !event.request.url.includes("sol.place") &&
    !event.request.url.includes(subdomain + ".localhost")
  ) {
    event.respondWith(fetch(event.request));
  } else {
    
    if (isFile(event.request.url) || (event.request.url.trim() === location.origin.trim() || event.request.url.trim() === location.origin.trim() +"/")){
      event.respondWith(handleRequest(event.request, subdomain));
    } else {
      event.respondWith(handleRequest(new Request(location.origin.trim()), subdomain));
    }
  }
});
const getHash = async () => {};

var snsData = "";
const handleRequest = async (request, domain) => {
  if (snsData == "") {
    snsData = await dnsBundle.resolveDomainName(domain);
    let snsT = snsData.data.toString("utf-8").replace(/\0/g, "");
    let snsO = JSON.parse(snsT);
    snsData = snsO.ipsp;
    //console.log(snsData);
    //console.log("fetched sns data!");
  } else {
    //console.log("not fetching its stored!");
  }

  //let ipfsHash = snsData.data.toString('utf-8').replace(/\0/g, '');
  //need to store
  let ipfsHash = snsData; //snsData.data.toString('utf-8').replace(/\0/g, '');
  // let ipsp = JSON.parse(ipfsHash);
  // ipfsHash = ipsp.ipsp;
  let nUrl = request.url.replace(domain + ".", "");
  nUrl = nUrl.replace(
    "http://localhost:8000",
    "https://ipfs.infura.io/ipfs/" + ipfsHash
  );
  nUrl = nUrl.replace(
    "https://sol.place",
    "https://ipfs.infura.io/ipfs/" + ipfsHash
  );
  //console.log("REQUEST REPLACED:", nUrl);
  var req = new Request(nUrl, { redirect: "follow" });
  var cR = await caches.match(req);
  if (cR) {
    //console.log("cached response!");
    return cR;
  }
  let response = await fetch(req);
  //console.log("RESPONSE");
  //console.log(response);
  //if not found return default or somthing
  if (response.redirected) response = await fetch(response.url);
  var cacheR = response.clone();
  var cache = await caches.open(CACHE_NAME);
  if (!cacheR.url.includes("chrome-extension://")) {cache.put(req, cacheR)};
  return response;
};
