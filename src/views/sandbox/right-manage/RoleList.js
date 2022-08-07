import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tree } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [rightsList, setRightsList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        // 如果没有dataIndex，item即为每一行的数据
        // 如果有dataIndex，则item则为dataIndex对应的字段数据f
        return <div>
          <Button type="primary" shape="circle" icon={<EditOutlined />} size="small" style={{ marginRight: "10px" }}
            onClick={() => { setModalVisible(true); setCurrentRights(item.rights); setCurrentId(item.id); }}/>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} size="small" onClick={() => { confirmMethod(item); }}/>
        </div>
      }
    }
  ];

  const confirmMethod = (item) => {
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
    axios.delete(`http://localhost:5000/roles/${item.id}`);
    message.success('delete success');
  };

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      setDataSource(res.data);
    })
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      setRightsList(res.data);
    })
  }, []);

  const handleOk = () => {
    // 同步dataSource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item;
    }))
    // patch
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights
    })
    setModalVisible(false);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const onCheck = (checkedKeys) => {
    // console.log(11111, checkedKeys.checked)
    setCurrentRights(checkedKeys.checked);
  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly={true} // checkStrictly 可设置子项和父项脱离，不受限制
          // defaultExpandedKeys={currentRights}
          // defaultSelectedKeys={currentRights}
          // defaultCheckedKeys={currentRights} // defaultCheckedKeys为非受控组件
          checkedKeys={currentRights}
          // onSelect={onSelect}
          onCheck={onCheck}
          treeData={rightsList}
        />
      </Modal>
    </div>
  )
}
