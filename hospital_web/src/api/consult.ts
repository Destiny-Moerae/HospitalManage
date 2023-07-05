import { request } from './request';

export async function getList(params) {
  return request({
    url: '/consult',
    params,
  });
}
export async function create(data) {
  return request({
    url: '/consult',
    method: 'POST',
    data,
  });
}

export async function update(data) {
  return request({
    url: '/consult',
    method: 'PUT',
    data,
  });
}

export async function remove(data) {
  return request({
    url: '/consult',
    method: 'DELETE',
    data,
  });
}
