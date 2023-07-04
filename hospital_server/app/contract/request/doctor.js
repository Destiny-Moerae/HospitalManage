module.exports = {
  // 创建医生
  createDoctorRequest: {
    fullname: {
      type: 'string',
      required: true,
      description: '医生名称',
      example: '李华',
    },
    name: {
      type: 'string',
      required: true,
      description: '医生账号',
      example: 'lihua123',
    },
    password: {
      type: 'string',
      required: true,
      description: '医生密码',
      example: '654321',
    },
    surgeryId: {
      type: 'string',
      required: true,
      example: '64a24096dd86990d81cf8991'
    },
    description: {
      type: 'string',
      description: '医生描述',
      example: '我是医生描述',
    },
    sex: {
      type: 'string',
      description: '医生性别',
      example: '男',
    },
    birth: {
      type: 'number',
      description: '医生出生年月',
      example: '628358400',
    },
    phone: {
      type: 'string',
      description: '医生电话',
      example: '12345678910',
    },
    fee: {
      type: 'number',
      description: '医生挂号费',
      example: '100',
    }
  },
  // 更新医生
  updateDoctorRequest: {
    description: {
      type: 'string',
      description: '医生描述新',
      example: '我是医生描述新',
    },
    fee: {
      type: 'number',
      description: '医生挂号费',
      example: '80'
    }
  },
}
