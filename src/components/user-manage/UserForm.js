import React, { forwardRef, useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
    // console.log('66666', props, ref);
  const { regionList, roleList } = props;
  const [isDisabled, setIsDisabled] = useState(false);
  const [flag, setFlag] = useState(null);
  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);
  useEffect(() => {
    setFlag(props.currentId);
  }, props.currentId);

  const {roleId, region} = JSON.parse(localStorage.getItem('token'));
  const roleObj = {
    "1": 'superadmin',
    "2": 'admin',
    "3": 'editor'
  }
  const checkRegionDisabled = (item) => {
    if (flag) { // 编辑
        if (roleObj[roleId] === 'superadmin') {
            return false;
        } else {
            return true;
        }
    } else { // 添加
        if (roleObj[roleId] === 'superadmin') {
            return false;
        } else {
            return item.value !== region;
        }
    }
  };

  const checkRoleDisabled = (item) => {
    if (flag) { // 编辑
        if (roleObj[roleId] === 'superadmin') {
            return false;
        } else {
            return true;
        }
    } else { // 添加
        if (roleObj[roleId] === 'superadmin') {
            return false;
        } else {
            return roleObj[item.id] !== 'editor';
        }
    }
  };
  return (
    <Form
        // form={form}
        // layout="vertical"
        // name="form_in_modal"
        // initialValues={{ modifier: 'public' }}
        ref={ref}
    >
        <Form.Item
        name="username"
        label="用户名"
        labelAlign="right"
        rules={[{ required: true, message: '请输入用户名' }]}
        >
        <Input />
        </Form.Item>
        <Form.Item
        name="password"
        label="密码"
        labelAlign="right"
        rules={[{ required: true, message: '请输入密码' }]}
        >
        <Input />
        </Form.Item>
        <Form.Item
        name="region"
        label="区域"
        rules={isDisabled ? [] : [{ required: true, message: '请选择区域' }]}
        >
        <Select disabled={isDisabled}>
            {regionList.map(item => <Option key={item.id} value={item.value} disabled={checkRegionDisabled(item)}>{item.title}</Option>)}
        </Select>
        </Form.Item>
        <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
        >
        <Select onChange={ value => {
            if (value === 1) {
                setIsDisabled(true);
                ref.current.setFieldsValue({
                    region: ''
                })
            } else {
                setIsDisabled(false);
            }
        }}>
            {roleList.map(item => <Option key={item.id} value={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>)}
        </Select>
        </Form.Item>
    </Form>
  )
})

export default UserForm;