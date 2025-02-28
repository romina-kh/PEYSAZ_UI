import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";

const AddressManager = () => {
    const [addresses, setAddresses] = useState([]);
    const [province, setProvince] = useState("");
    const [remainder, setRemainder] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {

        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const storedUser = localStorage.getItem("costumer");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        setUserId(user.ID);
        try {
            const response = await fetch(`http://localhost:5000/addresses/${user.ID}`);
            const data = await response.json();
            setAddresses(data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const addAddress = async () => {
        if (!province) return alert("Province is required!");

        try {
            const response = await fetch(`http://localhost:5000/addresses/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Province: province, Remainder: remainder }),
            });

            if (!response.ok) throw new Error("Failed to add address");
            alert("Address added successfully!");

            setProvince("");
            setRemainder("");
            fetchAddresses(); // Refresh list
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

    const deleteAddress = async (province) => {
        try {
            const response = await fetch(`http://localhost:5000/addresses/${userId}/${province}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete address");
            alert("Address deleted successfully!");

            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    return (
        <div>
            <Navbar/>
            <h2>Manage Addresses</h2>

            <label>Province:</label>
            <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} />

            <label>Remainder:</label>
            <input type="text" value={remainder} onChange={(e) => setRemainder(e.target.value)} />

            <button onClick={addAddress}>Add Address</button>

            <h3>Saved Addresses</h3>
            <ul>
                {addresses.map((address, index) => (
                    <li key={index}>
                        <strong>{address.Province}</strong>: {address.Remainder}
                        <button onClick={() => deleteAddress(address.Province)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddressManager;