import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, useNavigate, useSearchParams} from 'react-router-dom';
import { useForm } from 'react-hook-form';


const ReadingReportForm = ()=>{
  //const [meterId, setMeterId] = useState();
  const [meterData, setMeterData] = useState(0.0);
  const [reading, setReading] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [message,setMessage] = useState('');
  //const [token,setToken] = useState(localStorage.getItem('jwtToken'));
  const [searchParams] = useSearchParams();
  const {register, handleSubmit,formState:{errors}} = useForm();
  
  const meterId = searchParams.get('id');
  const token = localStorage.getItem('authToken');
  
  const GET_METER_INFO_URL = '';
  const POST_METER_READING_URL = `api/meters/${id}/readings`;

  useEffect(()=>{
    //const urlParams = new URLSearchParams(window.location.search);
    //const id = urlParams.get('id');
    //setMeterId(id);
    if(id){
      axios.get(`${GET_METER_INFO_URL}/${id}`)
      .then(response =>{
        setMeterData(response.data)
      })
      .catch(error => {
        setErrorMessage('扫描水表失败！请稍后再试。');
        console.log('Error fetching meter data:', error);
      })
    }else{
        // TODO: handle scenario - no water meter id
    }
  },[]);

  const onSubmit = () => {
    if(meterId && reading) {
      axios.post(`/api/meters/${meterId}/readings`,{reading: parseFloat(reading)})
      .then(response =>{
        setMessage('抄表成功！');
      })
      .catch(error=>{
        setErrorMessage('系统忙，抄表失败！请稍后再试');
        console.log('Error submitting reading:', error);
      });
    }
  };

  return(
    <div>
      <h2>水表抄表页面</h2>
      {meterData?(
        <Form onSubmit={handleSubmit(onSubmit)}>
          <p>水表ID：{meterData.id}</p>
          <p>水表定位：{meterData.location}</p>
          <input 
            type='number'
            step='0.01'
            {...register('reading',{required:'请输入读数'})}
            onChange={e=>setReading(e.target.value)}
            placeholder='输入水表读数'
          />
          {errors.reading && <p>{errors.reading.message}</p>}
          <button type='submit'>确认</button>
          {message && <p>{message}</p>}
        </Form>
        ):(
        <p>正在加载数据</p>
        )}
    </div>
  );
}

export default ReadingReportForm;