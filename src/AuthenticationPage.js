import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useForm} from 'react-hook-form';

const LOGIN_URL = ''
const SIGNUP_URL = ''
const AuthenticationPage = ()=>{
    //const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
    //const [error, setError]= useState('');
    const navigate = useNavigate();
    const {register, handleSubmit, formState:{errors}} = useForm();


    const toggleMode = ()=>{
        setIsLoginMode((mode)=>!mode);
    }

    const transformData = (data,mapping) =>{
        const transformedData = {}
        for(const key in data){
            transformData[mapping[key] || key] = data[key];
        }
    }

    const onSubmit = async (data)=>{

        const mapping ={
            username:'username',
            password:'password'
        }

        data = transformData(data,mapping);

        try{
            const url = isLoginMode?LOGIN_URL:SIGNUP_URL;
            const response = await axios.post(url,data);
            if(isLoginMode) {
                    localStorage.setItem('authToken', response,data,token);
                    navigate('/meter-reading');
            } else {
                setIsLoginMode(true)
                alert('用户注册成功！请登陆。');
            }
            setError('')
        } catch(error){
            setError(isLoginMode?'用户名或密码错误！':'注册失败！');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>{isLoginMode? '登陆':'注册'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>用户名：</label>
                    <input
                        type='text'
                        {...register('username',{required:'请输入用户名'})}
                    />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div>
                    <label>密码：</label>
                    <input
                        type='password'
                        {...register('password',{required:'请输入密码'})}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type='submit'>
                    {isLoginMode? '用户登陆':'用户注册'}
                </button>
            </form>
            <button onClick={toggleMode}>
                    {isLoginMode? '点击注册用户':'点击登陆'}
            </button>
        </div>
    );


}
export default AuthenticationPage;