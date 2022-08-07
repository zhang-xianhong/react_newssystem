import React, { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import { Table, Button, Tag, Modal, message, Popover, Switch, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setReginList] = useState([]);
  const [isAddVisible, setAddVisible] = useState(false);
  const [isUpdateDisabled, setUpdateDisabled] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const addForm = useRef(null);

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
      filters: [
        {
          text: '全球',
          value: '全球'
        },
        ...regionList.map(item => {
          return {
            text: item.title,
            value: item.value
          }
        })
      ],
      onFilter: (value, item) => {
        // console.log(333, value, item); // value和item分别代表当前选择项和整行数据
        if (value === '全球') {
          return item.region === '';
        }
        return item.region === value;
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, record) => {
        return (<Switch checked={roleState} disabled={record.default} onChange={() => handleChange(record)} />)
      }
    },
    {
      title: '操作',
      render: (item, record) => {
        // 如果没有dataIndex，item即为每一行的数据
        // 如果有dataIndex，则item则为dataIndex对应的字段数据f
        return <div>
          <Button style={{ marginRight: 10 }} type="primary" shape="circle" icon={<EditOutlined />} size="small" disabled={record.default} onClick={() => { handleUpdate(record); }}/>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} size="small" disabled={record.default} onClick={() => { confirmMethod(record); }}/>
        </div>
      }
    }
  ];

  const confirmMethod = (item) => {
    console.log('confirmMethod', item);
    confirm({
      title: 'Are you sure you want to delete this item?',
      icon: <ExclamationCircleOutlined />,
      // content: 'hhh',
      onOk: () => {
        deleteMethod(item);
      },
      onCancel: () => {
        message.info('delete cancelled');
      }
    })
  };

  const deleteMethod = (item) => {
    // 当前状态同步 + 后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id));
    axios.delete(`http://localhost:5000/users/${item.id}`);
    message.success('delete success');
  };

  const handleChange = (item) => {
    // console.log('item changed', item);
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  };

  async function handleUpdate(item) {
    console.log('item updated', item);
    // 或者加async和await
    // setTimeout(() => {
    //   addForm.current.setFieldsValue(item)
    // }, 0);
    // setAddVisible(true);
    await setAddVisible(true);
    if (item.roleId === 1) {
      // 超级管理员角色，禁用区域
      setUpdateDisabled(true);
    } else {
      setUpdateDisabled(false);
    }
    addForm.current.setFieldsValue(item);
    setCurrentId(item.id);
  };

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));
  const roleObj = {
    "1": 'superadmin',
    "2": 'admin',
    "3": 'editor'
  }
  function getUsersList() {
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      //为登录的不同角色的用户分配对应的权限
      setDataSource(roleObj[roleId] === 'superadmin' ? res.data : [
        ...res.data.filter(item => item.username === username),
        ...res.data.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
      ]);
    })
  }
  function getReginList() {
    axios.get('http://localhost:5000/regions').then(res => {
      setReginList(res.data);
    })
  }
  function getRoleList() {
    axios.get('http://localhost:5000/roles').then(res => {
      setRoleList(res.data);
    })
  }
  useEffect(() => {
    getUsersList();
    getReginList();
    getRoleList();
  }, [roleId, region, username, roleObj]);

  const addUser = () => {
    setAddVisible(true);
  };
  const addFormOK =() => {
    addForm.current.validateFields().then(values => {
      console.log('Validate', values);
      setAddVisible(false);
      addForm.current.resetFields();
      // post到后端，生成id，再设置dataSource，方便后面删除和编辑
      if (currentId) { // 更新
        axios.patch(`http://localhost:5000/users/${currentId}`, values);
        setDataSource(dataSource.map(item => {
          if (item.id === currentId) {
            return {
              ...item,
              ...values,
              role: roleList.filter(data => data.id === values.roleId)[0]
            } 
          }
          return item;
        }))
        // setUpdateDisabled(!isUpdateDisabled);
      } else { // 新增
        axios.post(`http://localhost:5000/users`, {
          ...values,
          roleState: true,
          default: false,
        }).then((res) => {
          // console.log('2q2', res);
          setDataSource([...dataSource, {
            ...res.data,
            role: roleList.filter(item => item.id === values.roleId)[0]
          }]);
        })
      }
    }).catch(err => {
      console.log(err);
    })
  };
  return (
    <div>
      <Button type="primary" onClick={addUser}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
      <Modal
        visible={isAddVisible}
        title="新建用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { setAddVisible(false); setUpdateDisabled(!isUpdateDisabled) }}
        onOk={() => {
          addFormOK();
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm} isUpdateDisabled={isUpdateDisabled} currentId={currentId} />
      </Modal>
    </div>
  )
}
