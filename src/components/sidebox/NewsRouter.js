import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import axios from 'axios';

import Audit from '../../views/audit-manage/Audit';
import AuditList from '../../views/audit-manage/AuditList';

import Login from '../../views/login/Login';
import NewsAdd from '../../views/news-manage/NewsAdd';
import NewsCategory from '../../views/news-manage/NewsCategory';
import NewsDraft from '../../views/news-manage/NewsDraft';
import Home from '../../views/sandbox/home/Home';
import NewsSandBox from '../../views/sandbox/NewsSandBox';
import NoPermission from '../../views/sandbox/nopermission/NoPermission';
import RightList from '../../views/sandbox/right-manage/RightList';
import RoleList from '../../views/sandbox/right-manage/RoleList';
import UserList from '../../views/sandbox/user-manage/UserList';
import Published from '../publish-manage/Published';
import Sunset from '../publish-manage/Sunset';
import Unpublished from '../publish-manage/Unpublished';

const LocalRouterMap = {
    '/home': <Home />,
    '/user-manage/list': <UserList />,
    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,
    '/news-manage/add': <NewsAdd />,
    '/news-manage/draft': <NewsDraft />,
    '/news-manage/category': <NewsCategory />,
    '/audit-manage/audit': <Audit />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <Unpublished />,
    '/publish-manage/published': <Published />,
    '/publish-manage/sunset': <Sunset />
    // '/home': Home,
    // '/user-manage/list': UserList,
    // '/right-manage/role/list': RoleList,
    // '/right-manage/right/list': RightList,
    // '/news-manage/add': NewsAdd,
    // '/news-manage/draft': NewsDraft,
    // '/news-manage/category': NewsCategory,
    // '/audit-manage/audit': Audit,
    // '/audit-manage/list': AuditList,
    // '/publish-manage/unpublished': Unpublished,
    // '/publish-manage/published': Published,
    // '/publish-manage/sunset': Sunset
}
export default function NewsRouter() {
  const [backRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([
        axios.get('http://localhost:5000/rights'),
        axios.get('http://localhost:5000/children'),
    ]).then(res => {
        // console.log(999, res);
        setBackRouteList([...res[0].data, ...res[1].data]);
    })
  }, []);

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && item.pagepermisson === 1;
  };

  const {role: {rights}} = JSON.parse(localStorage.getItem('token'));

  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };
  return (
    <HashRouter>
        <Routes>
            <Route path='/login' element={<Login />} />
            {/* <Route path='/' element={<NewsSandBox />} />
            // V5的路由写法
            <Route path='/' render={() => <NewsSandBox />} /> */}
            {/* V6版本路由写法 */}
            <Route path='/' element={<MainRoute />}>
                {
                    backRouteList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item)) {
                           return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} exact />
                        }
                        return null;
                    })
                }
                {/* <Route path='/home' element={<Home />} />
                <Route path='/user-manage/list' element={<UserList />} />
                <Route path='/right-manage/role/list' element={<RoleList />} />
                <Route path='/right-manage/right/list' element={<RightList />} /> */}
                {/* V6版本重定向方式 */}
                <Route path='/' exact element={<Navigate to='/home' />} />
                {
                    backRouteList.length > 0 && <Route path='*' element={<NoPermission />} />
                }
            </Route>
        </Routes>
    </HashRouter>
  )
}
function MainRoute() {
    return localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to='/login' />;
}

{/* <Route path='/login' element={<Login />} /> */}
{/* <Route path='/' element={<NewsSandBox />} />
// V5的路由写法
<Route path='/' render={() => <NewsSandBox />} /> */}
{/* V6版本路由写法 */}
{/* <Route path='/' element={<Test />}>
    <Route path='/home' element={<Home />} />
    <Route path='/user-manage/list' element={<UserList />} />
    <Route path='/right-manage/role/list' element={<RoleList />} />
    <Route path='/right-manage/right/list' element={<RightList />} />
    V6版本重定向方式
    <Route path='/' exact element={<Navigate to='/home' />} />
    <Route path='*' element={<NoPermission />} />
</Route> */}