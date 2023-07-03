module.exports = {
  // 创建诊室
  createSurgeryRequest: {
    name: {
      type: 'string',
      required: true,
      description: '诊室名称',
      example: '123',
    },
    description: {
      type: 'string',
      required: false,
      description: '诊室描述',
      example: '123',
    },
    departmentId: {
      type: 'string',
      required: true,
      description: '科室id',
      example: '64a21c2429341b4e3873202e',
    },
  },
  // 更新诊室
  updateSurgeryRequest: {
    name: {
      type: 'string',
      required: false,
      description: '诊室名称',
      example: '456',
    },
    description: {
      type: 'string',
      required: false,
      description: '诊室描述',
      example: '456',
    },
    departmentId: {
      type: 'string',
      required: true,
      description: '科室id',
      example: '64a21c2429341b4e3873202e',
    },
  },
};
