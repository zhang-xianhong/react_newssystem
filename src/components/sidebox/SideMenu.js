import React, { useState, useEffect } from 'react';
import { withRouter, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import axios from 'axios';
import './index.css';

import {
  UploadOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  AuditOutlined,
  FieldTimeOutlined,
  AppstoreOutlined,
  CloudDownloadOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons';
const { Sider } = Layout;
const { SubMenu } = Menu;
function getItem(label, key, icon, children, type) {
  return {
    label,
    key,
    icon,
    children,
    type,
  };
}

const items = [
  getItem('首页', '/home', <MailOutlined />),
  getItem('用户管理', '/user-manage', <UserOutlined />, [
    getItem('用户列表', '/user-manage/list', <UserOutlined />),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('权限管理', '/role-manage', <SettingOutlined />, [
    getItem('角色列表', '/role-manage/role/list', <SettingOutlined />),
    getItem('权限列表', '/role-manage/right/list', <SettingOutlined />),
  ]),
];

//定义一个图标与路由的映射表
const iconList={
  "/home": <HomeOutlined />,
  "/user-manage": <TeamOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <SecurityScanOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  "/news-manage": <MessageOutlined />,
  "/news-manage/add": <EditOutlined />,
  "/news-manage/draft": <DeleteOutlined />,
  "/news-manage/category": <AppstoreOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/audit-manage/audit": <AuditOutlined />,
  "/audit-manage/list": <AuditOutlined />,
  "/publish-manage": <UploadOutlined />,
  "/publish-manage/unpublished": <FieldTimeOutlined />,
  "/publish-manage/published": <UploadOutlined />,
  "/publish-manage/sunset": <CloudDownloadOutlined />
}

const getMenus = (menu) => {
  const { role: {rights} } = JSON.parse(localStorage.getItem('token'));
  // console.log('rights', rights);
  return menu.map((item) => {
    if (item.children?.length > 0 && item.pagepermisson === 1 && (rights.checked ? rights.checked.includes(item.key) : rights.includes(item.key))) {
      return {
        label: item.title,
        key: item.key,
        icon: iconList[item.key],
        children: getMenus(item.children)
      }
    }
    return (item.pagepermisson === 1) && getItem(item.title, item.key, iconList[item.key]);
  })
  // return res;
}

export default function SideMenu(props) {
  const [menu, setMenu] = useState([]);
  // console.log(111111, getMenus(menu));
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/rights?_embed=children').then(res => {
      // console.log('menu', res.data);
      setMenu(res.data);
    })
  }, [])
  const navigate = useNavigate();
  const location = useLocation();
  // console.log('location', location);
  const selectedKeys = [location.pathname];
  const openKeys = ['/' + location.pathname.split('/')[1]];

  // console.log(111, props);
  const onClick = (e) => {
    console.log(e);
    navigate(e.key);
  }
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">全球新闻发布系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={selectedKeys}
        // defaultSelectedKeys={['/home']}
        // defaultOpenKeys={['/home']}
        defaultOpenKeys={openKeys}
        // items={items}
        items={getMenus(menu)}
        onClick={onClick}
      />
    </Sider>
  )
}
