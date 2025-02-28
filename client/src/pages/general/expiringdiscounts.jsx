import { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";

const ExpiringDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("costumer");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        setUserId(user.ID);
        const fetchExpiringDiscounts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/discounts/expiring/${userId}`);
                const data = await response.json();
                setDiscounts(data.expiringDiscounts);
            } catch (error) {
                console.error("Error fetching expiring discount codes:", error);
            }
        };

        if (userId) {
            fetchExpiringDiscounts();
        }
    }, [userId]);

    return (
        <div>
            <Navbar/>
            <h3>Expiring Discount Codes</h3>
            {discounts.length === 0 ? (
                <p>No discounts expiring soon.</p>
            ) : (
                <ul>
                    {discounts.map((discount) => (
                        <li key={discount.DCODE}>
                            <strong>Code:</strong> {discount.DCODE} <br />
                            <strong>Expires on:</strong> {new Date(discount.DTimestamp).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ExpiringDiscounts;