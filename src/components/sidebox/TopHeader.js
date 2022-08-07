import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DownOutlined,
  SmileOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
const { Header } = Layout;

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();

  const { role: {roleName}, username} = JSON.parse(localStorage.getItem('token'));

  const logOut = () => {
    window.localStorage.removeItem('token');
    navigate('/login');
  };

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              {roleName}
            </a>
          ),
        },
        {
          key: '2',
          danger: true,
          label: (
            <a onClick={logOut}>Logout</a>
          ),
        },
      ]}
    />
  );
  return (
    <Header
        className="site-layout-background"
        style={{
          padding: '0 16px',
        }}
      >
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed),
        })}
        <div style={{float: 'right'}}>
          <span style={{ marginRight: '8px' }}>欢迎 <span style={{ color: '#1890ff' }}>{username}</span> 回来</span>
          <Dropdown overlay={menu}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
  )
}
