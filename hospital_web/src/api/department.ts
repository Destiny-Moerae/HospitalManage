import { request } from './request';

export async function getList(params) {
  return request({
    url: '/department',
    params,
  });
}
export async function create(data) {
  return request({
    url: '/department',
    method: 'POST',
    data,
  });
}

export async function update(data) {
  return request({
    url: '/department',
    method: 'PUT',
    data,
  });
}

export async function updateStatus(data) {
  return request({
    url: '/department/status',
    method: 'PUT',
    data,
  });
}

export async function remove(data) {
  return request({
    url: '/department',
    method: 'DELETE',
    data,
  });
}
