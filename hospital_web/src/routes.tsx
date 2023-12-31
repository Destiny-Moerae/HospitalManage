import React from 'react';
import {
  IconGift,
  IconHome,
  IconMobile,
  IconFolderAdd,
  IconUserGroup,
  IconUser,
  // IconMessage,
  // IconSettings,
  // IconHome,
  // IconStar,
  // IconNav,
} from '@arco-design/web-react/icon';

export const defaultRoute = 'welcome';

// const authority = parseInt(localStorage.getItem('authority') || '0', 10) || 0;
// const authority = useSelector((state: ReducerState) => state.login.userInfo.authority);
// console.log('authority', authority);
export const routes = [
  {
    name: 'menu.welcome',
    key: 'welcome',
    icon: <IconGift />,
    componentPath: 'welcome',
  },
  {
    name: 'menu.user',
    key: 'user',
    icon: <IconUser />,
    componentPath: 'user',
    authority: 999,
  },
  {
    name: 'menu.department',
    key: 'department',
    icon: <IconHome />,
    componentPath: 'department',
  },
  {
    name: 'menu.surgery',
    key: 'surgery',
    icon: <IconMobile />,
    componentPath: 'surgery',
  },
  {
    name: 'menu.doctor',
    key: 'doctor',
    icon: <IconUserGroup />,
    componentPath: 'doctor',
    // hide: true,
    authority: 1,
  },
  {
    name: 'menu.consult',
    key: 'consult',
    icon: <IconFolderAdd />,
    componentPath: 'consult',
  },
];
