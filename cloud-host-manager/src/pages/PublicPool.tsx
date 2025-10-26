import React, { useEffect, useState } from 'react'
import { 
  Table, 
  Form, 
  Input, 
  Space,
  Button
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CloudHost, HostChangeRecord } from '../types'
import { 
  generateMockCloudHosts, 
  generateMockChangeRecords 
} from '../services/mockData'

const PublicPool: React.FC = () => {
  const [hosts, setHosts] = useState<CloudHost[]>([])
  const [filteredHosts, setFilteredHosts] = useState<CloudHost[]>([])
  const [changeRecords, setChangeRecords] = useState<HostChangeRecord[]>([])
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
      // Filter only public pool hosts (managementStatus = 3)
      const publicPoolHosts = mockHosts.filter(host => host.managementStatus === 3)
      const mockRecords = generateMockChangeRecords(mockHosts)
      setHosts(mockHosts)
      setChangeRecords(mockRecords)
      setFilteredHosts(publicPoolHosts)
      setLoading(false)
    }, 500)
  }
  
  const handleSearch = (values: any) => {
    const { ip } = values
    const filtered = hosts.filter(host => 
      host.managementStatus === 3 && 
      (ip ? host.ip.includes(ip) : true)
    )
    setFilteredHosts(filtered)
  }
  
  const handleReset = () => {
    searchForm.resetFields()
    const publicPoolHosts = hosts.filter(host => host.managementStatus === 3)
    setFilteredHosts(publicPoolHosts)
  }
  
  const getChangeRecord = (ip: string) => {
    // Get the most recent change record for this host
    return changeRecords
      .filter(record => record.ip === ip)
      .sort((a, b) => new Date(b.sampleTime).getTime() - new Date(a.sampleTime).getTime())[0]
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
      title: '进入公共池时间',
      key: 'enterTime',
      render: (_, record) => {
        const changeRecord = getChangeRecord(record.ip)
        return changeRecord ? changeRecord.sampleTime : '未知'
      }
    },
    {
      title: '进入原因',
      key: 'reason',
      render: (_, record) => {
        const changeRecord = getChangeRecord(record.ip)
        return changeRecord ? 
          <span>{changeRecord.remark} (从 {changeRecord.oldValue} 变更为 {changeRecord.newValue})</span> : 
          '未知'
      }
    },
    {
      title: '使用部门',
      dataIndex: 'userDepartment',
      key: 'userDepartment',
    },
  ]

  return (
    <div>
      <h1>公共池管理</h1>
      
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
      
      {/* Public Pool Hosts Table */}
      <Table
        dataSource={filteredHosts}
        columns={columns}
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />
    </div>
  )
}

export default PublicPool