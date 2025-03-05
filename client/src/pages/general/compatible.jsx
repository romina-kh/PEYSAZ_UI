import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";

const Sazgaryab = () => {
  const [productInput, setProductInput] = useState("");
  const [productSazgar, setProductSazgar] = useState({});
  const [common, setCommon] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [isVIP, setIsVIP] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/sazgaryab/all-products");
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    fetchProducts();
  }, []);

  const handleProductSelection = (product) => {
    setSelectedProducts((prevSelected) => {
        const exists = prevSelected.find((p) => p.ID === product.ID);
        if (exists) {
            return prevSelected.filter((p) => p.ID !== product.ID);
        } else {
            return [...prevSelected, product]; 
        }
    });
  };

  useEffect(() => {
          const storedUser = localStorage.getItem("costumer");
          if (!storedUser) return;
          const user = JSON.parse(storedUser);
          setUserId(user.ID);
          setIsVIP(user.isVIP);
      }, [userId]);

      const fetchCompatibleProducts = async () => {
        if (selectedProducts.length === 0) {
            setProductSazgar({});
            setCommon([]);
            return;
        }
    
        
        const formattedProducts = selectedProducts.map((p) => `${p.Category} ${p.Brand} ${p.Model}`).join(",");
    
        try {
            const response = await fetch(
                `http://localhost:5000/sazgaryab/${userId}/${formattedProducts}`
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Something went wrong.");
                setProductSazgar({});
                setCommon([]);
            } else {
                setProductSazgar(data.productSazgar || {});
                setCommon(data.common || []);
                setError("");
            }
        } catch (err) {
            setError("Failed to fetch data.");
            setProductSazgar({});
            setCommon([]);
        }
    };
    
    useEffect(() => {
        fetchCompatibleProducts();
    }, [selectedProducts, userId]);
  

  return (
    <div className="sazgaryab">
      <Navbar/>
      {isVIP && (
        <div className="sazgaryab-container">
          <h2>Sazgaryab - Find Compatible Products</h2>
          <div className="product-selection">
              <h3>Select Products</h3>
              <div className="checkbox-list">
                {allProducts.map((product) => (
                  <label key={product.ID} className="checkbox-item">
                      <input
                          type="checkbox"
                          value={product.ID}
                          checked={selectedProducts.some((p) => p.ID === product.ID)}
                          onChange={() => handleProductSelection(product)}
                      />
                      {product.Category} {product.Brand} {product.Model}
                  </label>
                ))}
              </div>
          </div>

          {error && <p className="error">{error}</p>}

          {Object.keys(productSazgar).length > 0 && (
            <div className="sazgaryab-res">
              {common.length > 0 ? (
            <div>
              <h3>Common Compatible Products</h3>
              <ul>
                {common.map((product) => (
                  <li className="common-li" key={product.ID}>
                    {product.Brand} {product.Model} ({product.Category})
                  </li>
                ))}
              </ul>
            </div>
          ):(
            <div>
              <h3>Common Compatible Products</h3>
              <p className="error">No Compatible Between Products!</p>
            </div>
          )}
             
              {Object.entries(productSazgar).map(([product, compatibles]) => (
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
                    <p className="error">No compatible products found.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sazgaryab;