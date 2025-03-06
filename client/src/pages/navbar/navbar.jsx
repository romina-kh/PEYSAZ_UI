import {Link} from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [customerId, setCustomerId] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("costumer");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        setCustomerId(user.ID);
    }, [customerId]);


    return (
        <div className="navbar">
                    {customerId ? (
                        <div className="nav-container">
                            <div className="nav-links">
                                <Link to='/' className="nav-item">Profile</Link>
                                <Link to="/address" className="nav-item">Address</Link>
                                <Link to='/discounts'className="nav-item">Discounts</Link>
                                <Link to='/shopping' className="nav-item">Shopping</Link>
                                <Link to='/sazgaryab'className="nav-item">Sazgaryab</Link>
                            </div>
                            
                        </div>
                    ) : (
                        <div className="nav-container-2">
                            <div className="nav-links">
                                <Link to='/' className="nav-item">Home</Link>
                                <Link to="/" className="nav-item">About us</Link>
                                <Link to="/" className="nav-item">Services</Link>
                                
                            </div>
                            
                        </div>
                    )}

                </div>
        
    );
};

export default Navbar;