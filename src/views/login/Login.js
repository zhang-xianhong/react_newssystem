import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './Login.css';

// import Particles from 'react-particles-js'; // 实现粒子效果，npm中已弃用
// import Particles from 'react-tsparticles'; // react tsparticles实现登录粒子效果

export default function Login() {
  const navigate  = useNavigate();
  const onFinish = (values) => {
    axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      console.log(111, res.data);
      if (res.data.length === 0) { // 无此用户或者无权限
        message.error('用户名或密码不匹配');
      } else {
        localStorage.setItem('token', JSON.stringify(res.data[0]));
        navigate('/');
      }
    })
    console.log(values);
  };
  return (
    <div style={{ background: 'rgb(35, 39, 65)', height: '100%' }}>
      {/* <Particles /> */}
      <div className="formContainer">
        <div className="logintitle">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
