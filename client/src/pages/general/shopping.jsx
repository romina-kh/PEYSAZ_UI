import { useEffect, useState } from "react";

const Last5Shopping = ({ customerId }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLast5Shopping = async () => {
            try {
                const response = await fetch(`http://localhost:5000/shopping/last-5-shopping/${customerId}`);
                const data = await response.json();

                if (data.last5Shopping.length > 0) {
                    setTransactions(data.last5Shopping);
                } else {
                    setTransactions([]);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchLast5Shopping();
        }
    }, [customerId]);

    return (
        <div>
            <h3>Last 5 Shopping Transactions</h3>
            {loading ? (
                <p>Loading...</p>
            ) : transactions.length > 0 ? (
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            <strong>Tracking Code:</strong> {transaction.TrackingCode} <br />
                            <strong>Status:</strong> {transaction.Status} <br />
                            <strong>Cart Number:</strong> {transaction.CartNumber} <br />
                            <strong>Locked Number:</strong> {transaction.LockedNumber} <br />
                            <strong>Date:</strong> {new Date(transaction.Timestamp).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No transactions found</p>
            )}
        </div>
    );
};

export default Last5Shopping;