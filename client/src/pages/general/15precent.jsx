import React, { useEffect, useState } from "react";

const ShoppingHistory = () => {
    const [history, setHistory] = useState([]);
    const [cashback, setCashback] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");


    useEffect(() => {
        const storedUser = localStorage.getItem("costumer");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        setUserId(user.ID);
        const fetchShoppingHistory = async () => {
            try {
                const response = await fetch(`http://localhost:5000/shopping/monthly/${user.ID}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch shopping history");
                }
                const data = await response.json();
                setHistory(data.shoppingHistory);
                setCashback(data.cashbackAmount);
            } catch (error) {
                console.error("Error fetching shopping history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShoppingHistory();
    }, [userId]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Last Month's Shopping Transactions</h2>
            {history?.length === null  ? (
                <p>No successful transactions found in the last month.</p>) : (
                <div>
                    <ul>
                        {history.map((cart, index) => (
                            <li key={index}>
                                <strong>Cart:</strong> {cart.Cart_number} |
                                <strong> Transaction:</strong> {cart.Tracking_code} |
                                <strong> Status:</strong> {cart.transaction_status} |
                                <strong> Final Price:</strong> ${cart.final_price}
                            </li>
                        ))}
                    </ul>
                    <h3>Total Cashback Earned: ${cashback * -1}</h3>
                </div>
            )}
        </div>
    );
};

export default ShoppingHistory;

	
