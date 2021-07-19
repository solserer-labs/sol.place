var sns = require('@solana/spl-name-service')
var sol = require("@solana/web3.js")
const SOL_TLD_AUTHORITY = new sol.PublicKey(
    "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
    );
var connection = new sol.Connection('https://api.mainnet-beta.solana.com')
async function resolveDomainName(domainName) {
    let hashedDomainName = await sns.getHashedName(domainName);
    let inputDomainKey = await sns.getNameAccountKey(
      hashedDomainName,
      undefined,
      SOL_TLD_AUTHORITY,
    );
    try {
        const registry = await sns.NameRegistryState.retrieve(
          connection,
          inputDomainKey,
        );
        //console.log(registry.owner.toBase58())
        //console.log(registry.data.toString())
        return registry;
      } catch (err) {
        console.warn(err);
        return undefined;
      }
}
module.exports = {resolveDomainName: resolveDomainName};

//resolveDomainName(connection, "hodl")
