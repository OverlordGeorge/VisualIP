let NetworkHandler = require('./my_modules/NetworkHandler/NetworkHandler').NetworkHandler;

//classes
let networkHandler = new NetworkHandler();

networkHandler.createNetworkFromLog(__dirname+'/data/accessMap.txt', () => {
   console.log("done training");
   networkHandler.checkNetwork(__dirname+'/data/accessTactravels.txt');
});

