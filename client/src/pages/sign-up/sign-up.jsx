import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup' // validation
import {useNavigate} from 'react-router-dom'

const SignUp = () => {

    const navigate = useNavigate();

    const schema = yup.object().shape({
        First_name: yup.string().required(),
        Last_name: yup.string().required(),
        Phone_number:yup.number().required(),
        ID: yup.string().required(),
        Wallet_balance: yup.string().required()
    });
    // register :link  
    // resolver link yup to form -- yup check validation
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)}); 
    
    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:5000/costumers", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (res.ok){
                localStorage.setItem("costumer", JSON.stringify(res.costumer));
                navigate("/");

            } else {
                console.error(result.message)
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
//========
//we open {} because it is js
    return(
        <div className='sign-up'>
            <form className='sign-up-form' onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign up</h1>
                <h2>First Name:</h2>
                <input placeholder='Romina...' type='text' {...register("First_name")}/>
                <p className='error'>{errors.First_name?.message}</p> 
                <h2>Last Name:</h2>
                <input placeholder='Mohammadi...' type='text' {...register("Last_name")}/>
                <p className='error'>{errors.Last_name?.message}</p> 
                <h2>Phone number:</h2>
                <input placeholder='09123456789' type='text'{...register("Phone_number")}/>
                <p className='error'>{errors.Phone_number?.message}</p> 
                <h2>ID:</h2>
                <input placeholder='09123456789' type='text'{...register("ID")}/>
                <p className='error'>{errors.Phone_number?.message}</p> 
                <h2>Balance:</h2>
                <input placeholder='09123456789' type='text'{...register("Wallet_balance")}/>
                <p className='error'>{errors.Phone_number?.message}</p> 
                
                <button type='submit'>Sign Up</button>

                <h3>Already have an account?</h3>
                <button onClick={() => {navigate("/sign-in")}}>Sign In</button>
            </form>
        </div>
    )
} 

export default SignUp;


