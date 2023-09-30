import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import '../styles/pages.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const submitHandler = async (values) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/v1/users/login', values);
            setLoading(false);
            message.success('Login success');
            localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
            navigate('/');
        } catch (error) {
            setLoading(false);
            message.error('Something went wrong');
        }
    };

    // Prevent login for authenticated users
    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            <header className="header">
                <div className="logo">
                    <h1>Spend Wisely</h1>
                </div>
            </header>
            {loading && <Spinner />}
            <div className='register-page register-page-1'>
                <Form layout="vertical" onFinish={submitHandler} className='register-form'>
                    <h1 className='register-h1'>Login form</h1>
                    <Form.Item label="Email" name="email" className='form-item'>
                        <Input type='email' className='input' />
                    </Form.Item>
                    <Form.Item label="Password" name="password" className='form-item'>
                        <Input className='input' />
                    </Form.Item>
                    <div className='d-flex justify-content-between'>
                        <Link to='/register' className='login-link'>Not a user? <br /> Click here to Register</Link>
                        <button className='btn btn-primary register-button'>Login</button>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default Login;
