import { request } from './request';

export async function getList(params) {
  return request({
    url: '/doctor',
    params,
  });
}
export async function create(data) {
  return request({
    url: '/doctor',
    method: 'POST',
    data,
  });
}

export async function update(data) {
  return request({
    url: '/doctor',
    method: 'PUT',
    data,
  });
}

export async function remove(data) {
  return request({
    url: '/doctor',
    method: 'DELETE',
    data,
  });
}
