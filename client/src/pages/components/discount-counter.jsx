import { useEffect, useState } from "react"; 


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
            <h3>Discount Codes: {discountCount}</h3>
        </div>
    );
};

export default DiscountCounter;