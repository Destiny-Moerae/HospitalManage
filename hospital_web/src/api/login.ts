import { request } from './request';

export async function login(data) {
  return request({
    url: '/user/login',
    method: 'POST',
    data,
  });
}

export async function logout() {
  return request({
    url: '/user/logout',
    method: 'POST',
  });
}
