self.addEventListener("install", function (event) {
  console.log("install event");
  console.log(event);
  //cache sns result.
});
//wildcard *.localhost
//event.waituntil (fetch stuff from sns)
//if stuff matches protocol then display ipfs/arweave etc. otherwise jst print out the text
self.importScripts('dnsbundle.js');


self.addEventListener("fetch", function (event) {
  console.log("fetch event");
  console.log(event);
  console.log("REQUEST:", event.request.url);
  var parts = location.hostname.split(".");
  var subdomain = parts.shift();
  var upperleveldomain = parts.join(".");
  console.log("subdomain : ", subdomain);
  event.respondWith(
    handleRequest(event.request, subdomain)
    );
});

const handleRequest = async (request, domain) => {
  let snsData = await dnsBundle.resolveDomainName(domain);
  //console.log("sns data: " + snsData.data.toString().trim())
  let ipfsHash = snsData.data.toString('utf-8').replace(/\0/g, '');
  let nUrl = request.url.replace(domain + ".", "");
  nUrl = nUrl.replace(
    "http://localhost:8000",
    "https://ipfs.infura.io/ipfs/" + ipfsHash
  );
  nUrl = nUrl.replace(
    "https://sol.place/",
    "https://ipfs.infura.io/ipfs/" + ipfsHash
  );
  console.log("REQUEST REPLACED:", nUrl);
  var req = new Request(nUrl, { redirect: "follow" });
  let response = await fetch(req);
  console.log("RESPONSE");
  console.log(response);
  //if not found return default or somthing
  if (response.redirected) response = await fetch(response.url);
  return response;
};
