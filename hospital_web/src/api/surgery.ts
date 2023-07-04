import { request } from './request';

export async function getList(params) {
  return request({
    url: '/surgery',
    params,
  });
}
export async function create(data) {
  return request({
    url: '/surgery',
    method: 'POST',
    data,
  });
}

export async function update(data) {
  return request({
    url: '/surgery',
    method: 'PUT',
    data,
  });
}

export async function remove(data) {
  return request({
    url: '/surgery',
    method: 'DELETE',
    data,
  });
}
