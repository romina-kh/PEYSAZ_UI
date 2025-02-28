import {Link} from "react-router-dom"

const Navbar = () => {


    return (
        <div className="navbar">
            <div className="nav-container">
                <div className="nav-links">
                    <Link to='/' className="nav-item">Profile</Link>
                    <Link to="/address" className="nav-item">Address</Link>
                    <Link to='/discounts'className="nav-item">Discounts</Link>
                    <Link to='/shopping' className="nav-item">Shopping</Link>
                    <Link to='/sazgaryab'className="nav-item">Sazgaryab</Link>
                </div>
            </div>
        </div>
        
    );
};

export default Navbar;