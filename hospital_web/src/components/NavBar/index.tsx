import React, { useEffect, useState } from 'react';
import {
  Tooltip,
  Button,
  Avatar,
  Select,
  Typography,
  Dropdown,
  Menu,
  Space,
  Message,
  Tag,
} from '@arco-design/web-react';
import { IconSunFill, IconMoonFill, IconUser } from '@arco-design/web-react/icon';
import { useSelector, useDispatch } from 'react-redux';
import { ReducerState } from '../../redux';
import useLocale from '../../utils/useLocale';
import Logo from '../../assets/logo.svg';
import history from '../../history';
import { logout } from '../../api/login';
import { randomColor2 } from '../../utils/color';

import styles from './style/index.module.less';

function Navbar() {
  const locale = useLocale();
  const theme = useSelector((state: ReducerState) => state.global.theme);
  const userInfo = useSelector((state: ReducerState) => state.login.userInfo);
  const dispatch = useDispatch();
  const [avatarColor, setAvatarColor] = useState('');

  useEffect(() => {
    const savedColor = localStorage.getItem('avatarColor');
    if (savedColor) {
      setAvatarColor(savedColor);
    } else {
      const newColor = randomColor2();
      localStorage.setItem('avatarColor', newColor);
      setAvatarColor(newColor);
    }
  }, []);

  const onMenuItemClick = async (key) => {
    if (key === 'logout') {
      const res: any = await logout();
      if (res.code === 0) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        Message.success(res.msg);
        history.push('/user/login');
      }
    } else if (key === 'person') {
      // console.log('person', key);
      history.push('/department');
    }
  };

  const authority = useSelector((state: ReducerState) => state.login.userInfo.authority);

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <Space size={8}>
          <Logo style={{ width: 32, height: 32 }} />
          <Typography.Title style={{ margin: 0, fontSize: 18 }} heading={5}>
            医院管理系统
          </Typography.Title>
        </Space>
      </div>
      <ul className={styles.right}>
        <li>
          <Select
            options={[
              { label: '中文', value: 'zh-CN' },
              { label: 'English', value: 'en-US' },
            ]}
            value={localStorage.getItem('arco-lang')}
            bordered={false}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: 'bl',
            }}
            onChange={(value) => {
              localStorage.setItem('arco-lang', value);
              window.location.reload();
            }}
          />
        </li>
        <li>
          <Tooltip
            content={
              theme === 'light'
                ? locale['settings.navbar.theme.toDark']
                : locale['settings.navbar.theme.toLight']
            }
          >
            <Button
              type="text"
              icon={theme === 'light' ? <IconMoonFill /> : <IconSunFill />}
              onClick={() =>
                dispatch({
                  type: 'toggle-theme',
                  payload: { theme: theme === 'light' ? 'dark' : 'light' },
                })
              }
              style={{ fontSize: 20 }}
            />
          </Tooltip>
        </li>
        {userInfo && (
          <li>
            {authority ? (
              <Tag icon={<IconUser />} color="red" style={{ marginRight: 10 }}>
                管理员
              </Tag>
            ) : (
              <Tag icon={<IconUser />} color="blue" style={{ marginRight: 10 }}>
                医生
              </Tag>
            )}
            <Avatar
              size={24}
              style={{
                marginRight: 8,
                backgroundColor: avatarColor,
              }}
            >
              {userInfo.name[0].toUpperCase()}
            </Avatar>
            <Dropdown
              trigger="click"
              droplist={
                <div>
                  <Menu onClickMenuItem={onMenuItemClick}>
                    <Menu.Item key="person">个人中心</Menu.Item>
                  </Menu>
                  <Menu onClickMenuItem={onMenuItemClick}>
                    <Menu.Item key="logout">退出登录</Menu.Item>
                  </Menu>
                </div>
              }
            >
              <Typography.Text className={styles.username}>{userInfo.name}</Typography.Text>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
