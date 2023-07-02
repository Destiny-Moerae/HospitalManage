module.exports = {
  // 创建科室
  createDepartmentRequest: {
    name: {
      type: 'string',
      required: true,
      description: '科室名称',
      example: '123',
    },
  },
  // 更新科室
  updateDepartmentRequest: {
    name: {
      type: 'string',
      required: true,
      description: '科室名称',
      example: '456',
    },
  },
}
