import { useEffect, useState } from "react";

const CartStateList = ({ customerId }) => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartStates = async () => {
            try {
                const response = await fetch(`http://localhost:5000/cart/cart-states/${customerId}`);
                const data = await response.json();

                if (data.carts.length > 0) {
                    setCarts(data.carts);
                } else {
                    setCarts([]);
                }
            } catch (error) {
                console.error("Error fetching cart states:", error);
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchCartStates();
        }
    }, [customerId]);

    return (
        <div>
            <h3>Shopping Cart Status</h3>
            {loading ? (
                <p>Loading...</p>
            ) : carts.length > 0 ? (
                <ul>
                    {carts.map((cart, index) => (
                        <li key={index}>
                            <strong>Cart #{cart.CNumber}</strong>: {cart.Cstatus}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No carts found</p>
            )}
        </div>
    );
};

export default CartStateList;