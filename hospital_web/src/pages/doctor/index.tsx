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
  Select,
  DatePicker,
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
import { getList, create, update, remove } from '../../api/doctor';
import { getList as getSurgeryList } from '../../api/surgery';
import { EditableCell, EditableRow } from './edit';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

function DoctorsTable() {
  const locale = useLocale();
  // 这里这个form就存储了表单的数据
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('添加医生');
  const [surgeriesArr, setSurgeriesArr] = useState([]);

  const onUpdate = async (row) => {
    // console.log(row);
    // console.log('update');
    dispatch({ type: TOGGLE_VISIBLE, payload: { visible: true } });
    form.setFieldsValue(row);
    setTitle('修改医生');
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

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: '医生姓名',
      dataIndex: 'fullname',
      editable: true,
      fixed: 'left',
      width: 120,
    },
    {
      title: '隶属诊室',
      dataIndex: 'surgeryName',
    },
    {
      title: '出诊费',
      dataIndex: 'fee',
      editable: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      editable: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      editable: true,
    },
    {
      title: '身份证号',
      dataIndex: 'IDCard',
      editable: true,
    },
    {
      title: '医生介绍',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: '账号',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '密码',
      dataIndex: 'password',
      editable: true,
    },
    {
      title: '出生日期',
      dataIndex: 'birth',
      render: (_, record) => {
        return record.birth ? dayjs(record.birth).format('YYYY-MM-DD') : '-';
      },
    },
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
      fixed: 'right',
      width: 140,
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
    },
  ];

  const DoctorState = useSelector((state: ReducerState) => state.doctor);

  const { data, pagination, loading, formParams, visible, confirmLoading } = DoctorState;

  const getSurgeries = async () => {
    const res: any = await getSurgeryList({
      page: 1,
      pageSize: 9999,
    });
    console.log('res', res);
    setSurgeriesArr(res.data.list);
  };

  useEffect(() => {
    getSurgeries();
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
      console.log('postData', postData);
      const res: any = await getList(postData);
      console.log('res', res.data.list);
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

  function onSearch(name) {
    fetchData(1, pagination.pageSize, { name });
  }

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
    console.log('data', data);
    data.birth = dayjs(data.birth).unix();
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
      dispatch({
        type: TOGGLE_CONFIRM_LOADING,
        payload: { confirmLoading: false },
      });
    }
  };

  const onHandleSave = async (row) => {
    const res: any = await update(row);
    if (res.code === 0) {
      fetchData();
      Message.success(res.msg);
    } else {
      Message.error('修改失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>医生管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card bordered={false}>
        <div className={styles.toolbar}>
          <div>
            <Button onClick={onAdd} type="primary">
              添加医生
            </Button>
          </div>
          <div>
            <Input.Search
              style={{ width: 300 }}
              searchButton
              placeholder="请输入医生名称"
              onSearch={onSearch}
            />
          </div>
        </div>
        <Table
          rowKey="_id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          data={data}
          scroll={{
            x: 1600,
            y: 400,
          }}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          columns={columns.map((column) =>
            column.editable
              ? {
                  ...(column as any),
                  onCell: () => ({
                    onHandleSave,
                  }),
                }
              : column
          )}
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
              label="医生名称"
              field="fullname"
              rules={[{ required: true, message: '请输入医生名称' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem label="性别" field="sex" rules={[{ required: true, message: '请输入性别' }]}>
              <Input placeholder="" />
            </FormItem>
            <FormItem label="出生日期" field="birth" rules={[{ required: true }]}>
              <DatePicker />
            </FormItem>
            <FormItem
              label="电话"
              field="phone"
              rules={[{ required: true, message: '请输入电话号码' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem
              label="身份证号"
              field="IDCard"
              rules={[{ required: true, message: '请输入身份证号' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem
              label="出诊费"
              field="fee"
              rules={[{ required: true, message: '请输入出诊费' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem
              label="医生介绍"
              field="description"
              rules={[{ required: true, message: '请输入医生介绍' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem label="账号" field="name" rules={[{ required: true, message: '请输入账号' }]}>
              <Input placeholder="" />
            </FormItem>
            <FormItem
              label="密码"
              field="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem
              field="surgeryId"
              label="隶属诊室"
              rules={[{ required: true, message: '请选择隶属诊室' }]}
            >
              <Select placeholder="请选择隶属诊室">
                {surgeriesArr.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default DoctorsTable;
