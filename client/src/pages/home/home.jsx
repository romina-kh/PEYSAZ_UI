import { useEffect, useState } from "react"; //useeffrect:all time
import {useNavigate} from "react-router-dom";

const Home = () =>
{
    const [costumer , setCostumer] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const stored = localStorage.getItem("costumer");
        if (stored)
        {
            setCostumer(JSON.parse(stored));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("costumer");
        setCostumer(null);
    };

    return(

        <div>
            <h1>WELLCOME TO PEYSAZ</h1>
            {
                costumer ? (
                    <div>
                        <h2>Profile: </h2>
                        <h3>ID: {costumer.ID}</h3>
                        <h3>First Name: {costumer.First_name} </h3>
                        <h3>Last Name: {costumer.Last_name} </h3>
                        <h3>Phone Number: {costumer.Phone_number}</h3>
                        <h3>Wallet Balance: {costumer.Wallet_balance}</h3>
                        <button onClick={logout}>Logout</button>
                    </div>

                ) : (
                    <div>
                        <h2>You are NOT logged in(ای شیطون فکر کردی حالیم نمیشه؟)!</h2>
                        <button onClick={() => {navigate("sign-in")}}>Sign In</button>
                        <button onClick={() => {navigate("sign-up")}}>Sign Up</button>
                    </div>

                )

            }
        </div>
    )
}

export default Home;