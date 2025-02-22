import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup' // validation

const SignIn = () => {

    const schema = yup.object().shape({
          Phone_number:yup.number().notRequired()
    });
    // register :link  
    // resolver link yup to form -- yup check validation
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)}); 
    const onSubmit = (data) => {
        console.log(data)
    }

    return(
        <div className='sign-in'>
            <form className='sign-in-form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Sign in</h1>
                <h2>Phone number:</h2>
                <input placeholder='09123456789' type='text'{...register("Phone_number")}/>
                <p className='error'>{errors.Phone_number?.message}</p> 
                <button type='submit'>Sign in</button>
            </form>
        </div>
    )
} 

export default SignIn;


