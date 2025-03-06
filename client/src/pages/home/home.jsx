import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReferralCount from "../general/referral";
import DiscountCounter from "../components/discount-counter";
import Navbar from "../navbar/navbar";
import picture from "../../assets/1.png";
import profilepic from "../../assets/5.png";

const Home = () => {
    const [costumer, setCostumer] = useState(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const storedUser = localStorage.getItem("costumer");
            if (!storedUser) return;

            const parsedUser = JSON.parse(storedUser);
            try {
                const response = await fetch(`http://localhost:5000/costumers/profile/${parsedUser.ID}`);
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);

                setCostumer(result);
                localStorage.setItem("costumer", JSON.stringify(result));
            } catch (error) {
                console.error("Error fetching profile:", error.message);
            }
        };

        fetchProfile();
    }, []);

    const logout = () => {
        localStorage.removeItem("costumer");
        setCostumer(null);
    };

    const date = (time) => {
        const date = new Date(time);
        return date.toLocaleDateString();
    };

    return (
        <div className="home">
            {costumer ? (
                <div className="profile">
                    <img className="home-pic" src={profilepic} alt="profile" />
                    <Navbar />
                    <h1>WELCOME TO PEYSAZ</h1>
                    <div className="profile-info">
                        <h2>Profile:</h2>
                        <h3>First Name: {costumer.First_name}</h3>
                        <h3>Last Name: {costumer.Last_name}</h3>
                        <h3>Phone Number: {costumer.Phone_number}</h3>
                        <h4>⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘</h4>
                        <h3>Referral Code: {costumer.Referral_code}</h3>
                        <ReferralCount referralCode={costumer.Referral_code} />
                        <DiscountCounter costumer={costumer} />
                        <h3>Wallet Balance: {costumer.Wallet_balance}</h3>
                        <h4>⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘</h4>
                        <h3 className={costumer.isVIP ? "vip-badge" : "regular-user"}>
                            {costumer.isVIP ? "⭐️ VIP User ⭐️" : "⚜ Regular User ⚜"}
                        </h3>
                        <h3>Sign Up Date: {date(costumer.CTimestamp)}</h3>
                        {costumer.isVIP && <h3>Time Left: {costumer.VIP_Expires_In}</h3>}
                        <button className="btn-p" onClick={logout}>Logout</button>
                        <button className="btn-p" onClick={() => setVisible(true)}>Edit</button>
                        {visible && (
                            <EditProfile
                                costumer={costumer}
                                setCostumer={setCostumer}
                                onClose={() => setVisible(false)}
                            />
                        )}
                    </div>
                    
                    
                </div>
            ) : (
                <div className="not-logged-in">
                    <Navbar />
                <div className="image-container">
                    <img className="home-pic" src={picture} alt="Home" />
                    <div className="buttons">
                        <button className="btn" onClick={() => navigate("sign-in")}>Sign In</button>
                        <button className="btn" onClick={() => navigate("sign-up")}>Sign Up</button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

const EditProfile = ({ costumer, setCostumer, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        First_name: costumer.First_name || "",
        Last_name: costumer.Last_name || "",
        Phone_number: costumer.Phone_number || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/costumers/${costumer.ID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            alert("Profile updated successfully!");
            const updatedUser = { ...costumer, ...formData };
            localStorage.setItem("costumer", JSON.stringify(updatedUser));
            setCostumer(updatedUser);
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;

        try {
            const response = await fetch(`http://localhost:5000/costumers/${costumer.ID}`, {
                method: "DELETE",
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            alert("Account deleted successfully!");
            localStorage.removeItem("costumer");
            navigate("/sign-up");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="edit-profile">
            <label>First Name:</label>
            <input className="input" type="text" name="First_name" value={formData.First_name} onChange={handleChange} />
            
            <label>Last Name:</label>
            <input className="input" type="text" name="Last_name" value={formData.Last_name} onChange={handleChange} />
            
            <label>Phone Number:</label>
            <input className="input" type="text" name="Phone_number" value={formData.Phone_number} onChange={handleChange} />
            
            <button className="btn-p" onClick={handleUpdate}>Update Profile</button>
            <button className="btn-p" onClick={handleDelete}>Delete Account</button>
            <button className="btn-p" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default Home;
