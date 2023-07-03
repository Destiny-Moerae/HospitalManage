module.exports = {
  // 创建诊室
  createSurgeryRequest: {
    name: {
      type: 'string',
      required: true,
      description: '诊室名称',
      example: '123',
    },
    departmentId: {
      type: 'string',
      required: true,
      example: '64a0d45d84191e4dfcb49da3'
    },
    description: {
      type: 'string',
      description: '诊室描述',
      example: '我是诊室描述',
    }
  },
  // 更新诊室
  updateSurgeryRequest: {
    name: {
      type: 'string',
      required: true,
      description: '诊室名称',
      example: '456',
    },
    description: {
      type: 'string',
      description: '诊室描述',
      example: '我是诊室描述',
    }
  },
}
