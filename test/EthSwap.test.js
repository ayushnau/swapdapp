const { assert } = require('chai')
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545')
const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n){
return  web3.utils.toWei(n, 'ether');
}
contract('EthSwap',([deployer, investor])=>{
let token,ethSwap;
    before(async ()=>{
         token = await Token.new()
         ethSwap = await EthSwap.new(token.address)
        //transfer all tokens to EhtSwap (1million)
        await token.transfer(ethSwap.address, tokens('1000000')) 
    })
    describe('Token deployement',async()=>{
        it('contract has a name',async ()=>{
            const name= await token.name()
            assert.equal(name , 'DApp Token')
        })
    })
    describe('EthSwap deployement',async()=>{
        it('contract has a name',async ()=>{
            const name= await ethSwap.name()
            assert.equal(name , 'EthSwap Instant Exchange')
        })
        
        it('contract has a tokens',async ()=>{
            let balance = await token.balanceOf(ethSwap.address)       
            assert.equal(balance.toString(),tokens('1000000'))    
        })

    })

    describe('buyTokens()' , async()=>{
        let result;
        before(async ()=>{
            //purchase token before each example
         result =   await  ethSwap.buyTokens({from: investor , value: web3.utils.toWei('1', 'ether')})

       })
        it('allows user to instantly puchase token from ethswap for a fixed price' , async ()=>{
            //check investor balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))


            //check ethSwap balace after purchase
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(),tokens('999900'));
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(),web3.utils.toWei('1', 'ether'))


            const event  =  result.logs[0].args;
            assert.equal(event.account,investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(),tokens('100').toString());
            assert.equal(event.rate.toString(),'100');
        })
    })





    describe('selltokens()' , async()=>{
        let result;
        before(async ()=>{
            //the investor must approve the purchase
            await token.approve(ethSwap.address, tokens('100'), {from: investor})
            //Investor sells the tokens
            result = await ethSwap.sellTokens(tokens('100'),{ from :investor})

       })
        it('allows user to instantly sell token to ethswap for a  fixed price' , async ()=>{
          //check investor balance after purchase
             let investorBalance = await token.balanceOf(investor)
             assert.equal(investorBalance.toString(), tokens('0'))

             //check ethSwap balance after purchase
             let ethSwapBalance = await token.balanceOf(ethSwap.address)
             assert.equal(ethSwapBalance.toString(),tokens('1000000'));
             ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
             assert.equal(ethSwapBalance.toString(),web3.utils.toWei('0', 'ether'));
 
            //check logs are emited with correct data
             const event  =  result.logs[0].args;
             assert.equal(event.account,investor);
             assert.equal(event.token, token.address);
             assert.equal(event.amount.toString(),tokens('100').toString());
             assert.equal(event.rate.toString(),'100');

             //FAILURE: investor can't sell more tokens than they hafe
             await ethSwap.sellTokens(tokens('500'), {from :investor}).should.be.rejected;
        })
    })






})