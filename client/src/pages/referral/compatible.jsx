import React, { useState } from "react";

const CompatibilityChecker = ({ userId }) => {
    const [componentType, setComponentType] = useState("");
    const [compatibleProducts, setCompatibleProducts] = useState([]);
    const [error, setError] = useState("");

    const fetchCompatibleProducts = async () => {
        if (!componentType.trim()) {
            setError("Please enter a component type.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/compatible/${userId}/${componentType}`);
            const data = await response.json();

            if (data.message) {
                setError(data.message);
                setCompatibleProducts([]);
            } else {
                setCompatibleProducts(data.compatibleProducts);
                setError("");
            }
        } catch (err) {
            setError("Failed to fetch compatible products.");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            fetchCompatibleProducts();
        }
    };

    return (
        <div>
            <h2>Check Compatibility</h2>
            <input
                type="text"
                placeholder="Enter component type (e.g., GPU, CPU, SSD)"
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h3>Compatible Products:</h3>
            <ul>
                {compatibleProducts.map((product, index) => (
                    <li key={index}>
                        <strong>Brand:</strong> {product.Brand} | 
                        <strong> Model:</strong> {product.Model} | 
                        <strong> Price:</strong> ${product.Current_price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompatibilityChecker;