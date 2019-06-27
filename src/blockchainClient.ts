const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('/usr/src/app/IBP');


export module BlockChainModule {

  export class BlockchainClient {
    async connectToNetwork() {

      const gateway = new Gateway();

      try {
        console.log('connecting to Fabric network...')


        const identityLabel = 'app-admin';
        let connectionProfile = JSON.parse(fs.readFileSync('/usr/src/app/networkConnection.json', 'utf8'));

        let connectionOptions = {
          identity: identityLabel,
          wallet: wallet,
          discovery: {
            asLocalhost: false,
            enabled: true
          }
        };

        // Connect to gateway using network.yaml file and our certificates in _idwallet directory
        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Connected to Fabric gateway.');

        // Connect to our local fabric
        const network = await gateway.getNetwork('teamXX-channel1');

        console.log('Connected to mychannel. ');

        // Get the contract we have installed on the peer
        const contract = await network.getContract('papercontract');

        let networkObj = {
          contract: contract,
          network: network
        };

        return networkObj;

      } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
      } finally {
        console.log('Done connecting to network.');
        // gateway.disconnect();
      }

    }

    async redeem(args: any) {

      console.log('args for redeem: ')
      console.log(args)

      let response = await args.contract.submitTransaction(args.function,
        args.issuer, args.paperNumber, args.redeemingOwner, args.redeemDateTime
      );

      return response;
    }

    async buy(args: any) {

      console.log('args for buy: ')
      console.log(args)

      let response = await args.contract.submitTransaction(args.function,
        args.issuer, args.paperNumber, args.currentOwner, args.newOwner,
        args.price, args.purchaseDateTime
      );

      return response;

    }

    async issue(args: any) {

      console.log('args for issue: ')
      console.log(args)

      let response = await args.contract.submitTransaction(args.function,
        args.issuer, args.paperNumber, args.issueDateTime, args.maturityDateTime,
        args.faceValue, args.paperRate
      );

      return response;
    }

    async getpapers(args: any) {

      console.log('args for getpapers: ')
      console.log(args)

      let response = await args.contract.submitTransaction(args.function,
        args.issuer
      );

      return response;
    }
  }
}
