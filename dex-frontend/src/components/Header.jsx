import { Link } from "react-router-dom";
import {ConnectButton} from "web3uikit"

const Header = () => {
    return ( 
        <div className="header">
            <div>
                <Link className="link" to="/">Swap</Link>
                <Link className="link" to="/pool">Pools</Link>
                <Link className="link" to="/create-pool">Create a Pool</Link>
            </div>
            <ConnectButton />
        </div>
     );
}
 
export default Header;