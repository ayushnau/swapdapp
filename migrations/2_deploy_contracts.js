
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
    //deploy token 
  await deployer.deploy(Token);
    const token = await Token.deployed();

    //eth swap
   await deployer.deploy(EthSwap ,token.address);
    const ethSwap = await EthSwap.deployed();

  //transfer all the tokens to ethswap(1 million)
  await token.transfer(ethSwap.address,'1000000000000000000000000')
};