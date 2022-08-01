import { Button } from 'antd'
import React from 'react'
import axios from 'axios';
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
  return (
    <div>
      Home Page
      <Button type="primary" onClick={handleClick}>按钮</Button>
    </div>
  )
}
