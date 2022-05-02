pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap{
     string public name = "EthSwap Instant Exchange";
     Token public token;
     uint public rate = 100;
     event TokensPurchased(
          address account,
          address token,
          uint amount,
          uint rate
     );
     event TokensSold(
          address account,
          address token,
          uint amount,
          uint rate
     );

     constructor(Token _token) public{
          token = _token;
     }
     function buyTokens() public payable{

          // calculate the no. of token to buy
          uint tokenAmount = msg.value * rate;
          //require the ethswap account have enough token 
          require(token.balanceOf(address(this))>= tokenAmount);
          //transfer tokens to the user
          token.transfer(msg.sender, tokenAmount);
          //emit an event 
          emit TokensPurchased(msg.sender,address(token),tokenAmount, rate);
     }
     
     function sellTokens(uint _amount) public payable{
          //user can't sell more tokens than they have
          require(token.balanceOf(msg.sender) >= _amount);
         //calculate the amount of ether to redeem
         uint etherAmount = _amount/rate;
         //require that ethSwap has enough Ether
         require(address(this).balance >= etherAmount);
          //performs sale
          token.transferFrom(msg.sender, address(this), _amount);
          msg.sender.transfer(etherAmount);
           //emit an event 
          emit TokensSold(msg.sender,address(token),_amount, rate);

     }
}
