import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Progress } from 'antd'
import { 
  CloudServerOutlined, 
  DatabaseOutlined, 
  UsergroupAddOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { 
  CloudHost, 
  HostMetric 
} from '../types'
import { 
  generateMockCloudHosts, 
  generateMockHostMetrics 
} from '../services/mockData'

const Dashboard: React.FC = () => {
  const [hosts, setHosts] = useState<CloudHost[]>([])
  const [metrics, setMetrics] = useState<HostMetric[]>([])
  
  useEffect(() => {
    // Generate mock data
    const mockHosts = generateMockCloudHosts(50)
    const mockMetrics = generateMockHostMetrics(mockHosts)
    
    setHosts(mockHosts)
    setMetrics(mockMetrics)
  }, [])
  
  // Calculate statistics
  const totalHosts = hosts.length
  const publicPoolHosts = hosts.filter(h => h.managementStatus === 3).length
  
  // System distribution
  const windowsHosts = hosts.filter(h => h.system.toLowerCase().includes('windows')).length
  const linuxHosts = hosts.filter(h => h.system.toLowerCase().includes('linux') || 
                                      h.system.toLowerCase().includes('ubuntu') ||
                                      h.system.toLowerCase().includes('centos')).length
  
  // Resource usage calculation
  const avgCpuUsage = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length)
    : 0
    
  const avgMemoryUsage = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length)
    : 0
    
  const avgDiskUsage = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + m.diskUsage, 0) / metrics.length)
    : 0
  
  // Abnormal hosts
  const highCpuHosts = metrics.filter(m => m.cpuUsage > 80).length
  const highMemoryHosts = metrics.filter(m => m.memoryUsage > 80).length
  const highDiskHosts = metrics.filter(m => m.diskUsage > 90).length
  const offlineHosts = hosts.filter(h => h.deviceStatus === 2).length // 指标缺失
  
  // Table columns for abnormal hosts
  const columns: ColumnsType<CloudHost> = [
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
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
      title: '状态',
      key: 'status',
      render: (_, record) => {
        switch(record.deviceStatus) {
          case 1: return <Tag icon={<CheckCircleOutlined />} color="success">正常</Tag>
          case 2: return <Tag icon={<WarningOutlined />} color="warning">指标缺失</Tag>
          case 3: return <Tag icon={<WarningOutlined />} color="error">负载异常</Tag>
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
    }
  ]

  return (
    <div>
      <h1>云主机管理平台 - 仪表盘</h1>
      
      {/* Key Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="云主机总数" 
              value={totalHosts} 
              prefix={<CloudServerOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="公共池云主机" 
              value={publicPoolHosts} 
              prefix={<UsergroupAddOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Windows系统" 
              value={windowsHosts} 
              prefix={<DatabaseOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Linux系统" 
              value={linuxHosts} 
              prefix={<DatabaseOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      {/* Resource Usage */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card title="平均CPU使用率">
            <Progress type="circle" percent={avgCpuUsage} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="平均内存使用率">
            <Progress type="circle" percent={avgMemoryUsage} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="平均磁盘使用率">
            <Progress type="circle" percent={avgDiskUsage} />
          </Card>
        </Col>
      </Row>
      
      {/* Abnormal Hosts Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="CPU高负载数" 
              value={highCpuHosts} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="内存高负载数" 
              value={highMemoryHosts} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="磁盘高负载数" 
              value={highDiskHosts} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="机器不在线" 
              value={offlineHosts} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Abnormal Hosts Table */}
      <Card title="异常云主机列表">
        <Table 
          dataSource={hosts.filter(h => h.deviceStatus !== 1)} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          rowKey="id"
        />
      </Card>
    </div>
  )
}

export default Dashboard