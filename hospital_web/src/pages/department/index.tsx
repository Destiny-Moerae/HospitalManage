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
import { getList, create, update, remove } from '../../api/department';
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

function DepartmentsTable() {
  const locale = useLocale();
  // 这里这个form就存储了表单的数据
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('添加科室');

  const onUpdate = async (row) => {
    // console.log(row);
    // console.log('update');
    dispatch({ type: TOGGLE_VISIBLE, payload: { visible: true } });
    form.setFieldsValue(row);
    setTitle('修改科室');
  };
  const authority = useSelector((state: ReducerState) => state.login.userInfo.authority);

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
      title: '科室名称',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '科室介绍',
      dataIndex: 'description',
      editable: true,
    },
  ];
  // 如果有权限，就显示操作列
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

  const DepartmentState = useSelector((state: ReducerState) => state.department);

  const { data, pagination, loading, formParams, visible, confirmLoading } = DepartmentState;

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
    // console.log('data', data);
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
        <Breadcrumb.Item>科室管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card bordered={false}>
        <div className={styles.toolbar}>
          <div>
            {authority ? (
              <Button onClick={onAdd} type="primary">
                添加科室
              </Button>
            ) : null}
          </div>
          <div>
            <Input.Search
              style={{ width: 300 }}
              searchButton
              placeholder="请输入科室名称"
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
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          columns={columns.map((column) =>
            column.editable
              ? {
                  ...column,
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
              label="科室名称"
              field="name"
              rules={[{ required: true, message: '请输入科室名称' }]}
            >
              <Input placeholder="" />
            </FormItem>
            <FormItem
              label="科室介绍"
              field="description"
              rules={[{ required: true, message: '请输入科室介绍' }]}
            >
              <Input placeholder="" />
            </FormItem>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default DepartmentsTable;
