import React, { useEffect, useState } from 'react'
import { 
  Table, 
  Form, 
  Input, 
  DatePicker,
  Space,
  Button
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { InefficientHost, CloudHost } from '../types'
import { 
  generateMockCloudHosts, 
  generateMockInefficientHosts 
} from '../services/mockData'

const { RangePicker } = DatePicker

const InefficientHosts: React.FC = () => {
  const [inefficientHosts, setInefficientHosts] = useState<InefficientHost[]>([])
  const [filteredHosts, setFilteredHosts] = useState<InefficientHost[]>([])
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
      const mockInefficient = generateMockInefficientHosts(mockHosts)
      setHosts(mockHosts)
      setInefficientHosts(mockInefficient)
      setFilteredHosts(mockInefficient)
      setLoading(false)
    }, 500)
  }
  
  const handleSearch = (values: any) => {
    const { ip, dateRange } = values
    const filtered = inefficientHosts.filter(host => {
      const ipMatch = ip ? host.ip.includes(ip) : true
      const dateMatch = dateRange && dateRange.length === 2 
        ? new Date(host.sampleTime) >= dateRange[0].$d && 
          new Date(host.sampleTime) <= dateRange[1].$d
        : true
      
      return ipMatch && dateMatch
    })
    setFilteredHosts(filtered)
  }
  
  const handleReset = () => {
    searchForm.resetFields()
    setFilteredHosts(inefficientHosts)
  }
  
  const getHostInfo = (ip: string) => {
    return hosts.find(host => host.ip === ip)
  }
  
  const columns: ColumnsType<InefficientHost> = [
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
      title: 'CPU使用率(周)',
      dataIndex: 'weeklyCpuUsage',
      key: 'weeklyCpuUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '内存使用率(周)',
      dataIndex: 'weeklyMemoryUsage',
      key: 'weeklyMemoryUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '磁盘使用率(周)',
      dataIndex: 'weeklyDiskUsage',
      key: 'weeklyDiskUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '网络读入速率(周)',
      dataIndex: 'weeklyNetworkInRate',
      key: 'weeklyNetworkInRate',
      render: (value) => `${value} MB/s`,
    },
    {
      title: '网络写入速率(周)',
      dataIndex: 'weeklyNetworkOutRate',
      key: 'weeklyNetworkOutRate',
      render: (value) => `${value} MB/s`,
    },
    {
      title: 'CPU使用率(月)',
      dataIndex: 'monthlyCpuUsage',
      key: 'monthlyCpuUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '内存使用率(月)',
      dataIndex: 'monthlyMemoryUsage',
      key: 'monthlyMemoryUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '磁盘使用率(月)',
      dataIndex: 'monthlyDiskUsage',
      key: 'monthlyDiskUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '网络读入速率(月)',
      dataIndex: 'monthlyNetworkInRate',
      key: 'monthlyNetworkInRate',
      render: (value) => `${value} MB/s`,
    },
    {
      title: '网络写入速率(月)',
      dataIndex: 'monthlyNetworkOutRate',
      key: 'monthlyNetworkOutRate',
      render: (value) => `${value} MB/s`,
    },
  ]

  return (
    <div>
      <h1>低效云主机</h1>
      
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
      
      {/* Inefficient Hosts Table */}
      <Table
        dataSource={filteredHosts}
        columns={columns}
        loading={loading}
        scroll={{ x: 2000 }}
        pagination={{ pageSize: 10 }}
        rowKey="ip"
      />
    </div>
  )
}

export default InefficientHosts