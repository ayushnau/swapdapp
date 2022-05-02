import React, { Component } from 'react';
import Identicon from 'identicon.js'

class Navbar extends Component {
    render() {
        const data = new Identicon('d3b07384d113edec49eaa6238ad5ff00', 420).toString();
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="http://www.dappuniversity.com/bootcamp"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        EthSwap
                    </a>
                    <p style={{ color: "white" }}>{this.props.account}</p>
                        <img width='30' height='30' src= {`data:image/png;base64,${data}`}/>;
                        
                </nav>

            </div>
        );
    }
}

export default Navbar;



//how to built erc20 token tutorial 27:40