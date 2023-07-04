import Mock from 'mockjs';
import qs from 'query-string';
import setupMock from '../../utils/setupMock';

const Random = Mock.Random;
/*
{
  "data": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 2,
    "list": [
      {
        "_id": "64a2254bffa4462630f44715",
        "createTime": 1688347979,
        "updateTime": 0,
        "name": "内科",
        "description": "内科科室主要负责各种外科手术"
      },
      {
        "_id": "64a22540ffa4462630f44712",
        "createTime": 1688347968,
        "updateTime": 0,
        "name": "外科",
        "description": "外科科室主要负责各种外科手术"
      }
    ]
  },
  "code": 0,
  "msg": "请求成功"
}
*/
const data = Mock.mock({
  'list|55': [
    {
      '_id|8': /[A-Z][a-z][-][0-9]/,
      'name|4-8': /[A-Z]/,
      createTime: Random.datetime(),
      updateTime: Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/v1/department'), (params) => {
      switch (params.type) {
        case 'DELETE':
          const { _id } = JSON.parse(params.body);
          const deleteIndex = data.list.findIndex((item) => item._id === _id);
          data.list.splice(deleteIndex, 1);
          return {
            msg: '科室删除成功',
            data: null,
            code: 0,
          };
        case 'PUT':
          const body = JSON.parse(params.body);
          const putIndex = data.list.findIndex((item) => item._id === body._id);
          data.list[putIndex] = { ...data.list[putIndex], ...body };
          return {
            msg: '科室修改成功',
            data: null,
            code: 0,
          };
        case 'POST':
          const { name } = JSON.parse(params.body);
          // console.log(name);
          const returnData = Mock.mock({
            '_id|8': /[A-Z][a-z][-][0-9]/,
            name,
            articleNum: 0,
            createTime: Random.datetime(),
            updateTime: Random.datetime(),
          });
          data.list.unshift(returnData);
          return {
            msg: '科室添加成功',
            code: 0,
            data: returnData,
          };
        case 'GET':
        default:
          const { page = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
          const p = page as number;
          const ps = pageSize as number;
          return {
            data: {
              page: p,
              pageSize: ps,
              totalCount: 55,
              list: data.list.slice((p - 1) * ps, p * ps),
            },
            code: 0,
            msg: '请求成功',
          };
      }
    });
  },
});
