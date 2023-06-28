import { Link } from "react-router-dom";
import {ConnectButton} from "web3uikit"

const Header = () => {
    return ( 
        <div className="header">
            <div>
                <Link className="link" to="/pool">Pool</Link>
                <Link className="link" to="/">Swap</Link>
            </div>
            <ConnectButton />
        </div>
     );
}
 
export default Header;