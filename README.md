# sol.place
your gateway to the solasystem

# How does it work?

1. Intercepts http request using a service worker. 
2. Gets the subdomain and fetches the .sol domain data if it exists.
3. If the data is in the correct format, then the service worker fetches the content from ipfs and serves it in the browser.

# Example website

https://github.com/solserer-labs/simple.site

https://grandrising.sol.place 

# Known Issue

Some issues could occur if the application thats being fetched also has a service worker. 
