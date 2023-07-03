module.exports = {
  // 创建诊室
  createSurgeryRequest: {
    name: {
      type: 'string',
      required: true,
      description: '诊室名称',
      example: '123',
    },
  },
  // 更新诊室
  updateSurgeryRequest: {
    name: {
      type: 'string',
      required: true,
      description: '诊室名称',
      example: '456',
    },
  },
}
