import React, { useState } from "react";

const Sazgaryab = ({ userId, isVIP }) => {
  const [productName, setProductName] = useState("");
  const [compatibleProducts, setCompatibleProducts] = useState([]);
  const [error, setError] = useState("");

  const fetchCompatibleProducts = async () => {
    if (productName.length < 3) {
      setError("Please enter a full product name.");
      setCompatibleProducts([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/sazgaryab/${userId}/${encodeURIComponent(productName)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        setCompatibleProducts([]);
      } else {
        setCompatibleProducts(data.compatibleProducts);
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch data.");
      setCompatibleProducts([]);
    }
  };

  return (
    <div>
      {isVIP && (
        <div>
          <h2>Sazgaryab - Find Compatible Products</h2>
          <input
            type="text"
            placeholder="Type product name..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <button onClick={fetchCompatibleProducts}>Search</button>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {compatibleProducts.length > 0 && (
            <ul>
              {compatibleProducts.map((product) => (
                <li key={product.ID}>
                  {product.Brand} {product.Model} ({product.Category})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Sazgaryab;