module.exports = {
  // 创建出诊
  createConsultRequest: {
    doctorId: {
      type: 'string',
      required: true,
      description: '医生id',
      example: '64a240e4dd86990d81cf8998',
    },
    date: {
      type: 'number',
      required: true,
      example: 1688400000
    },
    startTime: {
      type: 'number',
      required: true,
      example: 8
    },
    endTime: {
      type: 'number',
      required: true,
      example: 9
    }
  },
  // 更新出诊
  updateConsultRequest: {
    doctorId: {
      type: 'string',
      required: true,
      description: '医生id',
      example: '64a240e4dd86990d81cf8998',
    },
    date: {
      type: 'number',
      required: true,
      example: 1688313600
    },
    startTime: {
      type: 'number',
      required: true,
      example: 11
    },
    endTime: {
      type: 'number',
      required: true,
      example: 13
    }
  },
}
