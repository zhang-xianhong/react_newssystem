import React from 'react';
import { HashRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';

import Login from '../views/login/Login';
import Home from '../views/sandbox/home/Home';
import NewsSandBox from '../views/sandbox/NewsSandBox';
import NoPermission from '../views/sandbox/nopermission/NoPermission';
import RightList from '../views/sandbox/right-manage/RightList';
import RoleList from '../views/sandbox/right-manage/RoleList';
import UserList from '../views/sandbox/user-manage/UserList';

export default function IndexRouter() {
  return (
    <HashRouter>
        <Routes>
            <Route path='/login' element={<Login />} />
            {/* <Route path='/' element={<NewsSandBox />} />
            // V5的路由写法
            <Route path='/' render={() => <NewsSandBox />} /> */}
            {/* V6版本路由写法 */}
            <Route path='/' element={<Test />}>
                <Route path='/home' element={<Home />} />
                <Route path='/user-manage/list' element={<UserList />} />
                <Route path='/right-manage/role/list' element={<RoleList />} />
                <Route path='/right-manage/right/list' element={<RightList />} />
                {/* V6版本重定向方式 */}
                <Route path='/' exact element={<Navigate to='/home' />} />
                <Route path='*' element={<NoPermission />} />
            </Route>
        </Routes>
    </HashRouter>
  )
}


function Test() {
    return localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to='/login' />;
}