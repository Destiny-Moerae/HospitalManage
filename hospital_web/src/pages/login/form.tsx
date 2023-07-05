import { Form, Input, Button, Radio } from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useRef, useState } from 'react';

import { useDispatch } from 'react-redux';
import styles from './style/index.module.less';
import history from '../../history';
import useLocale from '../../utils/useLocale';
import { login as adminLogin } from '../../api/login';

export default function LoginForm() {
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // const [form] = Form.useForm();
  // 这里使用useLocale()获取当前语言，此时local是一个对象，包含了当前语言的所有翻译
  const local = useLocale();
  const dispatch = useDispatch();

  // 登录成功后，将token存储到localStorage中，同时将用户信息存储到redux中，最后跳转到首页
  function afterLoginSuccess(params) {
    // 记录登录状态
    localStorage.setItem('token', params.token);
    localStorage.setItem('authority', params.authority);
    // 记录用户信息到redux中
    dispatch({
      type: 'LOGIN',
      payload: params,
    });
    // 跳转首页
    window.location.href = history.createHref({
      pathname: '/',
    });
  }

  async function login(params) {
    setErrorMessage('');
    setLoading(true);
    try {
      const res: any = await adminLogin(params);
      if (res.data) {
        if (res.code === 0) {
          afterLoginSuccess(res.data);
        }
      } else {
        setErrorMessage(res.msg);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values);
    });
    /* 
    // 官方推荐使用form.validate()
    try {
      await form.validate();
      const values = await form.getFields();
      console.log(values);
    } catch (error) {} */
  }

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>医院管理系统</div>
      <div className={styles['login-form-sub-title']}>登录 医院管理系统</div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form className={styles['login-form']} layout="vertical" ref={formRef}>
        <Form.Item
          field="name"
          rules={[
            { required: true, message: local['login.p_userName'] },
            {
              match: /^[\u4E00-\u9FA5A-Za-z0-9_]{5,20}$/,
              message: local['login.p_userName_pattern'],
            },
          ]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={local['login.p_userName']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[
            { required: true, message: local['login.p_password'] },
            {
              match: /^[A-Za-z0-9_]{6,20}$/,
              message: local['login.p_password_pattern'],
            },
          ]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={local['login.p_password']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item field="authority" initialValue={0}>
          <Radio.Group defaultValue={0}>
            <Radio value={0}>医生</Radio>
            <Radio value={1}>管理员</Radio>
          </Radio.Group>
        </Form.Item>
        <Button type="primary" long onClick={onSubmitClick} loading={loading}>
          {local['login.login']}
        </Button>
      </Form>
    </div>
  );
}
