import React,{useState, useEffect} from 'react'
import {Form,Input,message} from 'antd'
import { Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import Spinner from '../components/Spinner';
import "../styles/pages.css";

const Register = () => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    //form submit
    const submitHandler = async (values) => {
        try {
            setLoading(true);
            await axios.post('/api/v1/users/register',values);
            message.success('Registration Successfull');
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            message.error('Someting went wrong');
        }
    };

    //prevent for login user
    useEffect(()=> {
        if(localStorage.getItem("user")){
            navigate("/");
        }
    }, [navigate]);
  return (
    <>
    <header className="header">
                <div className="logo">
                    <h1>Spend Wisely</h1>
                </div>
            </header>
        <div className='register-page register-page-1'>
    {loading && <Spinner />}
    <Form layout="vertical" onFinish={submitHandler} className='register-form'>
        <h1 className='register-h1'>Register form</h1>
        <Form.Item label="Name" name="name" className='form-item'>
            <Input className='input' />
        </Form.Item>
        <Form.Item label="Email" name="email" className='form-item'>
            <Input type='email' className='input' />
        </Form.Item>
        <Form.Item label="Password" name="password" className='form-item'>
            <Input className='input' />
        </Form.Item>
        <div className='d-flex justify-content-between'>
            <Link to='/login' className='login-link'>Already Registered? <br/> Click here to login</Link>
            <button className='btn btn-primary register-button'>Register</button>
        </div>
    </Form>
</div>



    </>
  )
}

export default Register