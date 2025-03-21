import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup' 
import {useNavigate} from 'react-router-dom'

const SignUp = () => {

    const navigate = useNavigate(); 

    const schema = yup.object().shape({
        First_name: yup.string().required("First Name is Required!"),
        Last_name: yup.string().required("Last Name is Required!"),
        Phone_number:yup.number("Phone Number Must be a Number").required("Phone Number is Required!").typeError("Phone Number is Required!"),
    });

    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)}); 
    
    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:5000/costumers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            const result = await res.json();
    
            if (res.ok) {
                localStorage.setItem("costumer", JSON.stringify(result.costumer)); 
                navigate("/");
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return(
        <div className='sign-up'>
            <h1>Sign Up to Peysaz</h1>
            <form className='sign-up-form' onSubmit={handleSubmit(onSubmit)}>
                <h2>First Name:</h2>
                <input placeholder='John...' type='text' {...register("First_name")}/>
                <p className='error'>{errors.First_name?.message}</p> 
                <h2>Last Name:</h2>
                <input placeholder='Doe...' type='text' {...register("Last_name")}/>
                <p className='error'>{errors.Last_name?.message}</p> 
                <h2>Phone number:</h2>
                <input placeholder='09123456789' type='text'{...register("Phone_number")}/>
                <p className='error'>{errors.Phone_number?.message}</p> 
                <button type='submit'>Sign Up</button>
                <h3>Already have an account?</h3>
                <button className='sing-in-button' onClick={() => {navigate("/sign-in")}}>Sign In</button>
            </form>
        </div>
    )
} 

export default SignUp;


