import { useEffect, useState } from "react"; //useEffect: all time
import { useNavigate } from "react-router-dom";
import AddressManager from "../address/address";
import ReferralCount from "../referral/referral";

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
                localStorage.setItem("costumer", JSON.stringify(result)); // Save updated profile
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
        <div>
            <h1>WELCOME TO PEYSAZ</h1>
            {costumer ? (
                <div>
                    <h2>Profile: </h2>
                    <h3>Sign Up Date: {date(costumer.CTimestamp)}</h3>
                    <h3>ID: {costumer.ID}</h3>
                    <h3>First Name: {costumer.First_name} </h3>
                    <h3>Last Name: {costumer.Last_name} </h3>
                    <h3>Phone Number: {costumer.Phone_number}</h3>
                    <h3>Referral Code : {costumer.Referral_code}</h3>
                    <ReferralCount referralCode={costumer.Referral_code}/>
                    <DiscountCounter costumer={costumer}/>
                    <h3>Wallet Balance: {costumer.Wallet_balance}</h3>
                    <h3>Status: {costumer.isVIP ? "⭐️ VIP User ⭐️" : "Regular User"}</h3>
                    {costumer.isVIP && <h3>Time Left: {costumer.VIP_Expires_In}</h3>}
                    <button onClick={logout}>Logout</button>
                    <button onClick={() => setVisible(true)}>Edit</button>
                    {visible && (
                        <EditProfile
                            costumer={costumer}
                            setCostumer={setCostumer}
                            onClose={() => setVisible(false)}
                        />
                    )}
                    <AddressManager userId={costumer.ID}/>
                </div>
            ) : (
                <div>
                    <h2>You are NOT logged in(ای شیطون فکر کردی حالیم نمیشه؟)!</h2>
                    <button onClick={() => navigate("sign-in")}>Sign In</button>
                    <button onClick={() => navigate("sign-up")}>Sign Up</button>
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
        <div>
            <label>First Name:</label>
            <input type="text" name="First_name" value={formData.First_name} onChange={handleChange} />

            <label>Last Name:</label>
            <input type="text" name="Last_name" value={formData.Last_name} onChange={handleChange} />

            <label>Phone Number:</label>
            <input type="text" name="Phone_number" value={formData.Phone_number} onChange={handleChange} />

            <button onClick={handleUpdate}>Update Profile</button>
            <button onClick={handleDelete} >Delete Account</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

const DiscountCounter = ({ costumer }) => {
    const [discountCount, setDiscountCount] = useState(0);

    const fetchDiscounts = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/referrals/discounts/${id}`);
            const data = await response.json();
            return data.discountCount;
        } catch (error) {
            console.error("Error fetching discount codes:", error);
            return 0;
        }
    };

    useEffect(() => {
        if (costumer?.ID) {
            fetchDiscounts(costumer.ID).then(setDiscountCount);
        }
    }, [costumer?.ID]);

    return (
        <div>
            <h3>Discount Codes Earned: {discountCount}</h3>
        </div>
    );
};

export default Home;