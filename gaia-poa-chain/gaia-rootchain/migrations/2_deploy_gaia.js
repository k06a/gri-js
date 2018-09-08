var Plasma = artifacts.require("./RootChain.sol");

module.exports = function(deployer) {
  deployer.deploy(Plasma);
};
