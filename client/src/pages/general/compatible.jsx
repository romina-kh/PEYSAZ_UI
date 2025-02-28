import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";

const Sazgaryab = () => {
  const [productInput, setProductInput] = useState("");
  const [productCompatibilities, setProductCompatibilities] = useState({});
  const [commonCompatibleProducts, setCommonCompatibleProducts] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [isVIP, setIsVIP] = useState("");



  useEffect(() => {
          const storedUser = localStorage.getItem("costumer");
          if (!storedUser) return;
          const user = JSON.parse(storedUser);
          setUserId(user.ID);
          setIsVIP(user.isVIP)
      }, [userId]);

  const fetchCompatibleProducts = async () => {
    if (productInput.length < 3) {
      setError("Please enter at least one valid product.");
      setProductCompatibilities({});
      setCommonCompatibleProducts([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/sazgaryab/${userId}/${encodeURIComponent(productInput)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        setProductCompatibilities({});
        setCommonCompatibleProducts([]);
      } else {
        setProductCompatibilities(data.productCompatibilities || {});
        setCommonCompatibleProducts(data.commonCompatibleProducts || []); 
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch data.");
      setProductCompatibilities({});
      setCommonCompatibleProducts([]);
    }
  };

  return (
    <div>
      <Navbar/>
      {isVIP && (
        <div>
          <h2>Sazgaryab - Find Compatible Products</h2>
          <input
            type="text"
            placeholder="Enter products (e.g., GPU RTX 3080, CPU i7-12700K)"
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
          />
          <button onClick={fetchCompatibleProducts}>Search</button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {Object.keys(productCompatibilities).length > 0 && (
            <div>
              <h3>Compatibility Results</h3>
              {Object.entries(productCompatibilities).map(([product, compatibles]) => (
                <div key={product}>
                  <h4>{product}</h4>
                  {compatibles.length > 0 ? (
                    <ul>
                      {compatibles.map((comp) => (
                        <li key={comp.ID}>
                          {comp.Brand} {comp.Model} ({comp.Category})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No compatible products found.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {commonCompatibleProducts.length > 0 && (
            <div>
              <h3>Common Compatible Products</h3>
              <ul>
                {commonCompatibleProducts.map((product) => (
                  <li key={product.ID}>
                    {product.Brand} {product.Model} ({product.Category})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sazgaryab;