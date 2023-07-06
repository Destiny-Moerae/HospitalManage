import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Modal,
  Form,
  Message,
  Popconfirm,
  DatePicker,
  Select,
  Grid,
  Trigger,
  Typography,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import {
  TOGGLE_CONFIRM_LOADING,
  TOGGLE_VISIBLE,
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import useLocale from '../../utils/useLocale';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';
import { getList, create, update, remove } from '../../api/consult';
import { getList as getDepartmentList } from '../../api/department';
import { getList as getSurgeryList } from '../../api/surgery';
import { getList as getDoctorList } from '../../api/doctor';
import { EditableCell, EditableRow } from './edit';

const FormItem = Form.Item;
const Row = Grid.Row;
const Col = Grid.Col;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

function ConsultsTable() {
  const locale = useLocale();
  // 这里这个form就存储了表单的数据
  const [form] = Form.useForm();
  const [queryForm] = Form.useForm();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('添加出诊');
  const [departmentsQueryArr, setdepartmentsQueryArr] = useState([]);
  const [surgeriesQueryArr, setsurgeriesQueryArr] = useState([]);
  const [doctorsQueryArr, setdoctorsQueryArr] = useState([]);
  const [doctorsArr, setDoctorsArr] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSurgery, setSelectedSurgery] = useState(null);
  const onUpdate = async (row) => {
    // console.log(row);
    // console.log('update');
    dispatch({ type: TOGGLE_VISIBLE, payload: { visible: true } });
    form.setFieldsValue(row);
    setTitle('修改出诊');
  };

  const onDelete = async (row) => {
    // console.log(row);
    const res: any = await remove(row);
    if (res.code === 0) {
      fetchData();
      Message.success(res.msg);
    } else {
      Message.error('删除失败，请重试');
    }
  };
  const authority = useSelector((state: ReducerState) => state.login.userInfo.authority);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: '出诊医生',
      dataIndex: 'doctorName',
    },
    {
      title: '诊室名称',
      dataIndex: 'surgeryName',
    },
    {
      title: '科室名称',
      dataIndex: 'departmentName',
    },
    {
      title: '出诊日期',
      dataIndex: 'date',
      render: (_, record) => {
        return record.date ? dayjs(record.date).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
  ];
  if (authority === 1) {
    columns.push(
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (_, record) => {
          return record.createTime
            ? dayjs(record.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
            : '-';
        },
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        render: (_, record) => {
          return record.updateTime
            ? dayjs(record.updateTime * 1000).format('YYYY-MM-DD HH:mm:ss')
            : '-';
        },
      },
      {
        title: locale['searchTable.columns.operations'],
        dataIndex: 'operations',
        // 这里这个record表示的是当前行的数据
        render: (_, record) => (
          <div className={styles.operations}>
            <Button
              disabled={record.status}
              onClick={() => onUpdate(record)}
              type="text"
              size="small"
            >
              {locale['searchTable.columns.operations.update']}
            </Button>
            <Popconfirm
              disabled={record.status}
              focusLock
              title="确定要删除吗？"
              onOk={() => onDelete(record)}
              /* onCancel={() => {
          Message.error({
            content: 'cancel',
          });
        }} */
            >
              <Button disabled={record.status} type="text" status="danger" size="small">
                {locale['searchTable.columns.operations.delete']}
              </Button>
            </Popconfirm>
          </div>
        ),
      }
    );
  }

  const ConsultState = useSelector((state: ReducerState) => state.consult);

  const { data, pagination, loading, formParams, visible, confirmLoading } = ConsultState;

  const getQueryDepartments = async () => {
    const res: any = await getDepartmentList({
      page: 1,
      pageSize: 9999,
    });
    // console.log('DepartmentRes', res);
    setdepartmentsQueryArr(res.data.list);
  };

  const getQuerySurgeries = async () => {
    const res: any = await getSurgeryList({
      page: 1,
      pageSize: 9999,
      departmentId: selectedDepartment,
    });
    // console.log('SurgeryRes', res);
    setsurgeriesQueryArr(res.data.list);
  };

  const getQueryDoctors = async () => {
    const res: any = await getDoctorList({
      page: 1,
      pageSize: 9999,
      surgeryId: selectedSurgery,
    });
    // console.log('DoctorRes', res);
    setdoctorsQueryArr(res.data.list);
  };

  const getDoctors = async () => {
    const res: any = await getDoctorList({
      page: 1,
      pageSize: 9999,
    });
    setDoctorsArr(res.data.list);
  };

  useEffect(() => {
    getQueryDepartments();
    getDoctors();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData(current = 1, pageSize = 20, params = {}) {
    dispatch({ type: UPDATE_LOADING, payload: { loading: true } });
    try {
      const postData = {
        page: current,
        pageSize,
        ...params,
      };
      // console.log('postData', postData);
      const res: any = await getList(postData);
      // console.log('res', res.data.list);
      if (res.code === 0) {
        dispatch({ type: UPDATE_LIST, payload: { data: res.data.list } });
        dispatch({
          type: UPDATE_PAGINATION,
          payload: { pagination: { ...pagination, current, pageSize, total: res.data.totalCount } },
        });
        dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
        dispatch({ type: UPDATE_FORM_PARAMS, payload: { params } });
      }
    } catch (error) {}
  }

  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    fetchData(current, pageSize, formParams);
  }
  const onReset = () => {
    queryForm.resetFields();
    setSelectedDepartment(null);
    setSelectedSurgery(null);
    fetchData();
  };
  const onSearch = async () => {
    const query = await queryForm.getFields();
    // console.log('query', query);
    if (query.date) {
      query.startDate = dayjs(query.date[0]).unix();
      query.endDate = dayjs(query.date[1]).unix();
      delete query.date;
    }
    // console.log('query', query);
    fetchData(1, pagination.pageSize, query);
  };

  const onAdd = () => {
    dispatch({ type: TOGGLE_VISIBLE, payload: { visible: true } });
  };
  const onCancel = () => {
    dispatch({ type: TOGGLE_VISIBLE, payload: { visible: false } });
    form.resetFields();
  };
  const onOk = async () => {
    await form.validate();
    const data = form.getFields();
    // console.log('data', data);
    data.date = dayjs(data.date).unix();
    let func = create;
    if (data._id) {
      func = update;
    }
    dispatch({
      type: TOGGLE_CONFIRM_LOADING,
      payload: { confirmLoading: true },
    });
    const res: any = await func(data);
    if (res.code === 0) {
      dispatch({
        type: TOGGLE_CONFIRM_LOADING,
        payload: { confirmLoading: false },
      });
      onCancel();
      fetchData();
      Message.success(res.msg);
    } else {
      Message.error('添加失败，请重试');
    }
  };

  const Layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleDepartmentChange = async (value) => {
    setSelectedDepartment(value);
    setSelectedSurgery(null);
    queryForm.resetFields(['surgeryId']);
    queryForm.resetFields(['doctorId']);
  };
  useEffect(() => {
    if (selectedDepartment) {
      getQuerySurgeries();
    }
  }, [selectedDepartment]);

  const handleSurgeryChange = async (value) => {
    setSelectedSurgery(value);
    queryForm.resetFields(['doctorId']);
  };
  useEffect(() => {
    if (selectedSurgery) {
      getQueryDoctors();
    }
  }, [selectedSurgery]);

  return (
    <div className={styles.container}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>出诊管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card bordered={false}>
        <div className={styles.toolbar}>
          <div>
            <Button onClick={onAdd} type="primary" disabled={!authority}>
              添加出诊
            </Button>
          </div>
        </div>

        <Form form={queryForm} {...Layout} layout="horizontal" style={{ marginBottom: -10 }}>
          <Row>
            <Col span={8}>
              <FormItem field="departmentId" label="科室">
                <Select placeholder="请选择科室" onChange={handleDepartmentChange}>
                  {departmentsQueryArr.map((item) => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            {selectedDepartment && (
              <Col span={8}>
                <FormItem field="surgeryId" label="诊室">
                  <Select placeholder="请选择诊室" onChange={handleSurgeryChange}>
                    {surgeriesQueryArr.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            )}
            {selectedSurgery && (
              <Col span={8}>
                <FormItem field="doctorId" label="医生">
                  <Select placeholder="请选择医生">
                    {doctorsQueryArr.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.fullname}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            )}
          </Row>
          <Row>
            <Col span={8}>
              <FormItem field="date" label="出诊日期">
                <DatePicker.RangePicker showTime format="YYYY-MM-DD" />
              </FormItem>
            </Col>
            <Col span={8} />
            <Col span={6} offset={2}>
              <FormItem className={styles['search-btns']}>
                <div className={styles['search-btns-group']}>
                  <Trigger
                    popup={() => (
                      <Typography.Paragraph className={styles['trigger-popup']}>
                        重置
                      </Typography.Paragraph>
                    )}
                    showArrow
                    trigger="hover"
                  >
                    <Button onClick={onReset} style={{ marginRight: 10, marginBottom: 10 }}>
                      重置
                    </Button>
                  </Trigger>
                  <Button onClick={onSearch} type="primary">
                    搜索
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey="_id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          data={data}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          columns={columns}
          className={styles['table-demo-editable-cell']}
        />

        <Modal
          title={<div style={{ textAlign: 'left' }}>{title}</div>}
          visible={visible}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={onCancel}
        >
          <Form {...formItemLayout} form={form}>
            <FormItem
              field="doctorId"
              label="出诊医生"
              rules={[{ required: true, message: '请选择出诊医生' }]}
            >
              <Select placeholder="请选择出诊医生">
                {doctorsArr.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.fullname}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem label="出诊日期" field="date" rules={[{ required: true }]}>
              <DatePicker />
            </FormItem>
            <FormItem
              label="开始日期"
              field="startTime"
              rules={[{ required: true, message: '请填入开始日期' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem
              label="结束日期"
              field="endTime"
              rules={[{ required: true, message: '请填入结束日期' }]}
            >
              <Input placeholder="" />
            </FormItem>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default ConsultsTable;
