import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Table, Button, Tag, Modal, message, Popover, Switch  } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
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
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        // 如果没有dataIndex，item即为每一行的数据
        // 如果有dataIndex，则item则为dataIndex对应的字段数据f
        return <div>
          <Popover title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'} content={<div><Switch checked={item.pagepermisson} onChange={() => switchMethod(item) } /></div>}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} style={{ marginRight: '10px' }} size="small" disabled={item.pagepermisson === undefined} />
          </Popover>
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} size="small" onClick={() => { confirmMethod(item); }}/>
        </div>
      }
    }
  ];

  const switchMethod = (item) => {
    // 改变某一项会直接影响到数据源dataSource
    item.pagepermisson = item.pagepermisson === 1 ? 0: 1;
    setDataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
    RightsList();
  };

  const confirmMethod = (item) => {
    // console.log('confirmMethod', item);
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
    if (item.grade === 1) {
      // 删除一级目录
      axios.delete(`http://localhost:5000/rights/${item.id}`);
      setDataSource(dataSource.filter(data => data.id !== item.id));
      // RightsList();
    } else {
      // 删除二级目录
      // console.log(item.rightId);
      let filterParentList = dataSource.filter(data => data.id === item.rightId);
      filterParentList[0].children = filterParentList[0].children.filter(data => data.id !== item.id);
      axios.delete(`http://localhost:5000/children/${item.id}`);
      setDataSource([...dataSource]);
      // RightsList();
    }
    message.success('delete success');
  };

  function RightsList() {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      console.log('Right', res.data);
      const data = res.data;
      // 将首页的children字段置空
      data.forEach(item => {
        if (item.children.length === 0) {
          item.children = '';
        }
      })
      setDataSource(data);
    })
  }
  useEffect(() => {
    RightsList();
  }, []);
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />;
    </div>
  )
}
