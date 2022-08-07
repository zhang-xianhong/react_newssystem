import { Button } from 'antd'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Radio } from 'antd';
import './Home.css';
export default function Home() {
  const handleClick = () => {
    // 查数据 get
    // axios.get('http://localhost:8000/posts').then(res => {
    //   console.log(res.data);
    // })
    // 增数据 post
    // axios.post('http://localhost:8000/posts', {
    //   title: 'Home',
    //   author: 'Zxh',
    // }).then(res => {
    //   console.log(444, res.data);
    // })
    // 修改 put/patch http://localhost:8000/posts/1
    // axios.patch('http://localhost:8000/posts/1'. {
    //   title: 'zxh-ddsds'
    // })

    // 删除 delete
    // axios.delete('http://localhost:8000/posts/1').then(res => {
    //   console.log(res);
    // })

    // 关联表 _embed
    axios.get('http://localhost:8000/posts?_embed=comments').then(res => {
      console.log(res.data);
    })

    // _expand
    axios.get('http://localhost:8000/comments?_expand=post').then(res => {
      console.log('_expand', res.data);
    })
  }

  const [value, setValue] = useState(1);

  const onChange = (e) => {
    setValue(e.target.value);
    if (e.target.value === 1) {
      console.log('hre')
      document.getElementById("upload").style.borderColor = '#f00 !important';
    }
  };

  return (
    <div>
      Home Page
      <Button type="primary" onClick={handleClick}>按钮</Button>
      <br />
      <Radio.Group onChange={onChange} value={value}>
      <Radio value={1} id="upload" style={{ width: '370px', padding: '10px 10px 24px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}>
                <div>
                  <div>本地上传配置</div>
                  <div style={{ color: '#bbb' }}>设备与威胁情报系统离线模式，只支持设备本地检测,需要定期导入离线威胁情报库。</div>
                </div>
              </Radio>
              <Radio value={2} style={{ width: '370px', padding: '10px 10px 24px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                <div>
                  <div>选择时间配置</div>
                  <div style={{ color: '#bbb' }}>设备与威胁情报系统在线模式，云端作为本地检测能力的补充，需提交检测对象到云端。</div>
                </div>
              </Radio>
        <Radio value="1">
          <div>1dsdsdsdsdssssssssssssssss</div>
          <div>iiiiiiiii</div>
        </Radio>
        <Radio value="2">2dsadsaaaaaaaaa</Radio>
        <Radio value="3">3dsadsadads</Radio>
        <Radio value="4">4weqew3qewq</Radio>
      </Radio.Group>
    </div>
  )
}
