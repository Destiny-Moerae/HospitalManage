module.exports = {
  // 创建科室
  createDepartmentRequest: {
    name: {
      type: 'string',
      required: true,
      description: '科室名称',
      example: '外科',
    },
    description: {
      type: 'string',
      required: false,
      description: '科室描述',
      example: '外科科室主要负责各种外科手术',
    },
  },
  // 更新科室
  updateDepartmentRequest: {
    name: {
      type: 'string',
      required: true,
      description: '科室名称',
      example: '内科',
    },
    description: {
      type: 'string',
      required: false,
      description: '科室描述',
      example: '内科科室主要负责各种内科手术',
    },
  },
};
