import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup' // validation

const SignUp = () => {

    const schema = yup.object().shape({
        First_name: yup.string().required(),
        Last_name: yup.string().required(),
        Phone_number:yup.number().notRequired()
    });
    // register :link  
    // resolver link yup to form -- yup check validation
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)}); 
    const onSubmit = (data) => {
        console.log(data)
    }
//========
//we open {} because it is fucking js
    return(
        <div className='sign-up'>
            <form className='sign-up-form' onSubmit={handleSubmit(onSubmit)}>
                <h2>First Name:</h2>
                <input placeholder='Romina...' type='text' {...register("First_name")}/>
                <p className='error'>{errors.First_name?.message}</p> 
                <h2>Last Name:</h2>
                <input placeholder='Mohammadi...' type='text' {...register("Last_name")}/>
                <p className='error'>{errors.Last_name?.message}</p> 
                <h2>Phone number:</h2>
                <input placeholder='09123456789' type='text'{...register("Phone_number")}/>
                <p className='error'>{errors.Phone_number?.message}</p> 
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    )
} 

export default SignUp;


