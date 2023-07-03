module.exports = {
  // 创建医生
  createDoctorRequest: {
    name: {
      type: 'string',
      required: true,
      description: '医生名称',
      example: '李华',
    },
    surgeryId: {
      type: 'string',
      required: true,
      example: '64a21da426eb097b68926abf'
    },
    description: {
      type: 'string',
      description: '医生描述',
      example: '我是医生描述',
    }
  },
  // 更新医生
  updateDoctorRequest: {
    name: {
      type: 'string',
      required: true,
      description: '医生名称',
      example: '张三',
    },
    description: {
      type: 'string',
      description: '医生描述新',
      example: '我是医生描述新',
    }
  },
}
