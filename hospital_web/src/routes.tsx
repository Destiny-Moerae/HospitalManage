import React from 'react';
import {
  IconGift,
  IconHome,
  IconMobile,
  IconFolderAdd,
  IconUserGroup,
  // IconMessage,
  // IconSettings,
  // IconHome,
  // IconStar,
  // IconNav,
} from '@arco-design/web-react/icon';

export const defaultRoute = 'welcome';

export const routes = [
  {
    name: 'menu.welcome',
    key: 'welcome',
    icon: <IconGift />,
    componentPath: 'welcome',
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
  },
  {
    name: 'menu.consult',
    key: 'consult',
    icon: <IconFolderAdd />,
    componentPath: 'consult',
  },
];
