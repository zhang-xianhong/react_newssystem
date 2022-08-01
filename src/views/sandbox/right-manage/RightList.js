import React, { useState, useEffect } from 'react';

import axios from 'axios';
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/rights').then(res => {
      console.log('Right', res.data);
      setDataSource(res.data);
    })
  }, []);
  return (
    <div>RightList</div>
  )
}
