import React, { useEffect, useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Form, 
  Input, 
  DatePicker,
  Modal
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { RedoOutlined } from '@ant-design/icons'
import { HostChangeRecord, CloudHost } from '../types'
import { 
  generateMockCloudHosts, 
  generateMockChangeRecords 
} from '../services/mockData'

const { RangePicker } = DatePicker

const HostChangeManagement: React.FC = () => {
  const [changeRecords, setChangeRecords] = useState<HostChangeRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<HostChangeRecord[]>([])
  const [hosts, setHosts] = useState<CloudHost[]>([])
  const [loading, setLoading] = useState(false)
  
  const [searchForm] = Form.useForm()
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockHosts = generateMockCloudHosts(30)
      const mockRecords = generateMockChangeRecords(mockHosts)
      setHosts(mockHosts)
      setChangeRecords(mockRecords)
      setFilteredRecords(mockRecords)
      setLoading(false)
    }, 500)
  }
  
  const handleSearch = (values: any) => {
    const { ip, dateRange } = values
    const filtered = changeRecords.filter(record => {
      const ipMatch = ip ? record.ip.includes(ip) : true
      const dateMatch = dateRange && dateRange.length === 2 
        ? new Date(record.sampleTime) >= dateRange[0].$d && 
          new Date(record.sampleTime) <= dateRange[1].$d
        : true
      
      return ipMatch && dateMatch
    })
    setFilteredRecords(filtered)
  }
  
  const handleReset = () => {
    searchForm.resetFields()
    setFilteredRecords(changeRecords)
  }
  
  const handleRestore = (record: HostChangeRecord) => {
    Modal.confirm({
      title: '确认恢复',
      content: `确定要将云主机 ${record.ip} 的状态恢复到最新状态吗？`,
      onOk: () => {
        // In a real app, this would call an API to restore the state
        // For demo purposes, we'll just show a message
        Modal.success({
          title: '状态恢复成功',
          content: `云主机 ${record.ip} 的状态已恢复到最新状态`
        })
      }
    })
  }
  
  const getHostInfo = (ip: string) => {
    return hosts.find(host => host.ip === ip)
  }
  
  const columns: ColumnsType<HostChangeRecord> = [
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
      fixed: 'left',
      width: 150,
    },
    {
      title: '厂商',
      key: 'vendor',
      render: (_, record) => {
        const host = getHostInfo(record.ip)
        return host ? host.vendor : '未知'
      }
    },
    {
      title: '区域',
      key: 'region',
      render: (_, record) => {
        const host = getHostInfo(record.ip)
        return host ? host.region : '未知'
      }
    },
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
    },
    {
      title: '操作类型',
      key: 'operationType',
      render: (_, record) => {
        switch(record.operationType) {
          case 1: return <Tag color="blue">管理状态</Tag>
          case 2: return <Tag color="green">设备状态</Tag>
          default: return <Tag>未知</Tag>
        }
      }
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '原始值',
      dataIndex: 'oldValue',
      key: 'oldValue',
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      key: 'newValue',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
            icon={<RedoOutlined />} 
            onClick={() => handleRestore(record)}
            size="small"
          >
            恢复最新状态
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h1>云主机变更管理</h1>
      
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
        <Form.Item name="dateRange" label="时间范围">
          <RangePicker />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      {/* Change Records Table */}
      <Table
        dataSource={filteredRecords}
        columns={columns}
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 10 }}
        rowKey={(record) => `${record.ip}-${record.sampleTime}`}
      />
    </div>
  )
}

export default HostChangeManagement