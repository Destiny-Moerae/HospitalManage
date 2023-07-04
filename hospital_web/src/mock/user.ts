import Mock from 'mockjs';
import setupMock from '../utils/setupMock';

setupMock({
  setup() {
    Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/v1/user/info'), () => {
      return {
        name: '王立群',
        avatar:
          'https://lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
        email: 'wangliqun@email.com',
        job: 'frontend',
        jobName: '前端开发工程师',
        organization: 'Frontend',
        organizationName: '前端',
        location: 'beijing',
        locationName: '北京',
        introduction: '王力群并非是一个真实存在的人。',
        personalWebsite: 'https://www.arco.design',
      };
    });

    // 登录
    Mock.mock(new RegExp('/api/v1/user/login'), (params) => {
      const { userName, password } = JSON.parse(params.body);
      if (!userName) {
        return {
          code: 0,
          data: null,
          msg: '用户名不能为空',
        };
      }
      if (!password) {
        return {
          code: 0,
          data: null,
          msg: '密码不能为空',
        };
      }
      if (userName === 'admin' && password === '123456') {
        return {
          data: {
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNjQzNjFkODViYzIwZTY1YWQ0MzE1NzA0Iiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiX2lkIjoiaW5pdCIsInVzZXJuYW1lIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX2lkIjp0cnVlLCJ1c2VybmFtZSI6dHJ1ZSwicGFzc3dvcmQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJwYXRoc1RvU2NvcGVzIjp7fSwiY2FjaGVkUmVxdWlyZWQiOnt9LCJzZXNzaW9uIjpudWxsLCIkc2V0Q2FsbGVkIjp7fSwiZW1pdHRlciI6eyJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfSwiJG9wdGlvbnMiOnsic2tpcElkIjp0cnVlLCJpc05ldyI6ZmFsc2UsIndpbGxJbml0Ijp0cnVlLCJkZWZhdWx0cyI6dHJ1ZX19LCJpc05ldyI6ZmFsc2UsIiRsb2NhbHMiOnt9LCIkb3AiOm51bGwsIl9kb2MiOnsiX2lkIjoiNjQzNjFkODViYzIwZTY1YWQ0MzE1NzA0IiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiJDJiJDEwJDhEb0UwVllKMzFyUTRuSHBjaVNmemUyMTJDMG9IR2psUmxBN3V2VXBOdjU4bEdoZnRUc1lPIn0sIiRpbml0Ijp0cnVlLCJpYXQiOjE2ODg0NzUyNTUsImV4cCI6MTY4ODQ3ODg1NX0.TXIue9343xIJg8bDiyn0zdTTIWeg6acCl9_QpUAO2jw',
            name: 'admin',
          },
          msg: '登录成功',
          code: 0,
        };
      }
      return {
        code: 0,
        data: null,
        msg: '账号或者密码错误',
      };
    });
  },
});
