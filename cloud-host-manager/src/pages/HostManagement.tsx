import React, { useEffect, useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  message 
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { CloudHost } from '../types'
import { generateMockCloudHosts } from '../services/mockData'

// const { Option } = Select

const HostManagement: React.FC = () => {
  const [hosts, setHosts] = useState<CloudHost[]>([])
  const [filteredHosts, setFilteredHosts] = useState<CloudHost[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingHost, setEditingHost] = useState<CloudHost | null>(null)
  const [form] = Form.useForm()
  
  const [searchForm] = Form.useForm()
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockHosts = generateMockCloudHosts(30)
      setHosts(mockHosts)
      setFilteredHosts(mockHosts)
      setLoading(false)
    }, 500)
  }
  
  const handleSearch = (values: any) => {
    const filtered = hosts.filter(host => {
      return (
        (values.ip ? host.ip.includes(values.ip) : true) &&
        (values.vendor ? host.vendor.includes(values.vendor) : true) &&
        (values.region ? host.region.includes(values.region) : true) &&
        (values.system ? host.system.includes(values.system) : true) &&
        (values.owner ? host.owner.includes(values.owner) : true)
      )
    })
    setFilteredHosts(filtered)
  }
  
  const handleReset = () => {
    searchForm.resetFields()
    setFilteredHosts(hosts)
  }
  
  const showModal = (host?: CloudHost) => {
    if (host) {
      setEditingHost(host)
      form.setFieldsValue(host)
    } else {
      setEditingHost(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }
  
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  
  const onFinish = (values: CloudHost) => {
    if (editingHost) {
      // Update existing host
      const updatedHosts = hosts.map(host => 
        host.id === editingHost.id ? { ...host, ...values } : host
      )
      setHosts(updatedHosts)
      setFilteredHosts(updatedHosts)
      message.success('云主机信息更新成功')
    } else {
      // Add new host
      const newHost: CloudHost = {
        ...values,
        id: `host-${hosts.length + 1}`,
        enableStatus: 1,
        managementStatus: 1,
        deviceStatus: 1
      }
      const updatedHosts = [...hosts, newHost]
      setHosts(updatedHosts)
      setFilteredHosts(updatedHosts)
      message.success('云主机添加成功')
    }
    setIsModalVisible(false)
  }
  
  const handleDelete = (host: CloudHost) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除云主机 ${host.ip} 吗？`,
      onOk: () => {
        const updatedHosts = hosts.filter(h => h.id !== host.id)
        setHosts(updatedHosts)
        setFilteredHosts(updatedHosts)
        message.success('云主机删除成功')
      }
    })
  }
  
  const columns: ColumnsType<CloudHost> = [
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
      fixed: 'left',
      width: 150,
    },
    {
      title: '厂商',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'CPU(核)',
      dataIndex: 'cpu',
      key: 'cpu',
    },
    {
      title: '内存(GB)',
      dataIndex: 'memory',
      key: 'memory',
    },
    {
      title: '磁盘(GB)',
      dataIndex: 'disk',
      key: 'disk',
    },
    {
      title: '带宽(Mbps)',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
    },
    {
      title: '系统',
      dataIndex: 'system',
      key: 'system',
    },
    {
      title: '上线时间',
      dataIndex: 'onlineTime',
      key: 'onlineTime',
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '使用部门',
      dataIndex: 'userDepartment',
      key: 'userDepartment',
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        switch(record.deviceStatus) {
          case 1: return <Tag color="success">正常</Tag>
          case 2: return <Tag color="warning">指标缺失</Tag>
          case 3: return <Tag color="error">负载异常</Tag>
          default: return <Tag>未知</Tag>
        }
      }
    },
    {
      title: '管理状态',
      key: 'managementStatus',
      render: (_, record) => {
        switch(record.managementStatus) {
          case 1: return <Tag color="success">正常</Tag>
          case 2: return <Tag color="warning">低利用率</Tag>
          case 3: return <Tag color="processing">可申请（公共池）</Tag>
          default: return <Tag>未知</Tag>
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            size="small"
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h1>云主机管理</h1>
      
      {/* Search Form */}
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 24 }}
      >
        <Form.Item name="ip" label="云主机IP">
          <Input placeholder="请输入IP" />
        </Form.Item>
        <Form.Item name="vendor" label="厂商">
          <Input placeholder="请输入厂商" />
        </Form.Item>
        <Form.Item name="region" label="区域">
          <Input placeholder="请输入区域" />
        </Form.Item>
        <Form.Item name="system" label="系统">
          <Input placeholder="请输入系统" />
        </Form.Item>
        <Form.Item name="owner" label="负责人">
          <Input placeholder="请输入负责人" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              新增云主机
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      {/* Hosts Table */}
      <Table
        dataSource={filteredHosts}
        columns={columns}
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />
      
      {/* Add/Edit Modal */}
      <Modal
        title={editingHost ? "编辑云主机" : "新增云主机"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="ip"
            label="云主机IP"
            rules={[{ required: true, message: '请输入云主机IP!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="vendor"
            label="厂商"
            rules={[{ required: true, message: '请输入厂商!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="region"
            label="区域"
            rules={[{ required: true, message: '请输入区域!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="cpu"
            label="CPU(核)"
            rules={[{ required: true, message: '请输入CPU核数!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          
          <Form.Item
            name="memory"
            label="内存(GB)"
            rules={[{ required: true, message: '请输入内存大小!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          
          <Form.Item
            name="disk"
            label="磁盘(GB)"
            rules={[{ required: true, message: '请输入磁盘大小!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          
          <Form.Item
            name="bandwidth"
            label="带宽(Mbps)"
            rules={[{ required: true, message: '请输入带宽!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          
          <Form.Item
            name="system"
            label="系统"
            rules={[{ required: true, message: '请输入系统!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="onlineTime"
            label="上线时间"
            rules={[{ required: true, message: '请输入上线时间!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="owner"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="userDepartment"
            label="使用部门"
            rules={[{ required: true, message: '请输入使用部门!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingHost ? "更新" : "创建"}
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default HostManagement