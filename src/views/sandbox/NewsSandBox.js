import React, { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, HashRouter } from 'react-router-dom';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

import SideMenu from '../../components/sidebox/SideMenu'
import TopHeader from '../../components/sidebox/TopHeader'
// css
import './NewsSandBox.css';
// antd
import { Layout } from 'antd'
const { Content } = Layout;


export default function NewsSandBox() {
  nProgress.start();
  useEffect(() => {
    nProgress.done();
  })
  return (
    <Layout>
        <SideMenu />
        <Layout className="site-layout">
          <TopHeader />
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
    </Layout>
  )
}
