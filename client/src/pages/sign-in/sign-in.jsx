import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup' // validation
import {useNavigate} from "react-router-dom";
import { useState } from 'react';

const SignIn = () => {

    const [login, setLogin] = useState("");
    
    const navigate = useNavigate();

    const schema = yup.object().shape({
          Phone_number:yup.number().notRequired()
    });
    // register :link  
    // resolver link yup to form -- yup check validation
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)}); 


    const onSubmit = async (data) => {
        try {
          const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Phone_number: data.Phone_number }), 
          });
      
          const res = await response.json();
      
          if (!response.ok) {
            throw new Error(res.message || "Login failed");
            
          }
      
         
          localStorage.setItem("costumer", JSON.stringify(res.costumer));

          navigate("/");
      
         
        } catch (error) {
          console.error("Error logging in:", error.message);
          setLogin("(>ᴗ•) !بچه خوشگل میبینم که به حرفم گوش نمیدی!گفتم که اگه اکانت نداری این دکمه ی پایین رو آٰروم فشار بده");
        }
      };
      
      
    return(
        <div className='sign-in'>
            <form className='sign-in-form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Sign in</h1>
                <h2>Phone number:</h2>
                <input placeholder='09123456789' type='text'{...register("Phone_number")}/>
                <p className='error'>{errors.Phone_number?.message}</p> 
                <button type='submit'>Sign in</button>
                <p>{login}</p>
                <h3>Don't have an account?</h3>
                <button onClick={() => {navigate("/sign-up")}}>Sign Up</button>
            </form>
        </div>
    )
} 

export default SignIn;


