import React, { useEffect, useState } from 'react'
import { 
  Table, 
  Form, 
  Input, 
  Space,
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Button
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { 
  CloudServerOutlined, 
  ClusterOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { 
  CloudHost, 
  HostMetric, 
  ChannelSummaryMetric, 
  ChannelDetailMetric 
} from '../types'
import { 
  generateMockCloudHosts, 
  generateMockHostMetrics,
  generateMockChannelSummaryMetrics,
  generateMockChannelDetailMetrics
} from '../services/mockData'

const { TabPane } = Tabs

const MultiDimensionalMetrics: React.FC = () => {
  const [hosts, setHosts] = useState<CloudHost[]>([])
  const [hostMetrics, setHostMetrics] = useState<HostMetric[]>([])
  const [channelMetrics, setChannelMetrics] = useState<ChannelSummaryMetric[]>([])
  const [channelDetailMetrics, setChannelDetailMetrics] = useState<ChannelDetailMetric[]>([])
  
  const [filteredHostMetrics, setFilteredHostMetrics] = useState<HostMetric[]>([])
  const [filteredChannelMetrics, setFilteredChannelMetrics] = useState<ChannelSummaryMetric[]>([])
  const [filteredChannelDetailMetrics, setFilteredChannelDetailMetrics] = useState<ChannelDetailMetric[]>([])
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('host')
  
  const [searchForm] = Form.useForm()
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockHosts = generateMockCloudHosts(30)
      const mockHostMetrics = generateMockHostMetrics(mockHosts)
      const mockChannelMetrics = generateMockChannelSummaryMetrics(15)
      const mockChannelDetailMetrics = generateMockChannelDetailMetrics(mockChannelMetrics, mockHosts)
      
      setHosts(mockHosts)
      setHostMetrics(mockHostMetrics)
      setChannelMetrics(mockChannelMetrics)
      setChannelDetailMetrics(mockChannelDetailMetrics)
      
      setFilteredHostMetrics(mockHostMetrics)
      setFilteredChannelMetrics(mockChannelMetrics)
      setFilteredChannelDetailMetrics(mockChannelDetailMetrics)
      
      setLoading(false)
    }, 500)
  }
  
  const handleSearch = (values: any) => {
    const { ip } = values
    
    if (activeTab === 'host') {
      const filtered = hostMetrics.filter(metric => 
        ip ? metric.ip.includes(ip) : true
      )
      setFilteredHostMetrics(filtered)
    } else if (activeTab === 'channel') {
      const filtered = channelMetrics.filter(metric => 
        ip ? metric.channelName.includes(ip) : true
      )
      setFilteredChannelMetrics(filtered)
    } else if (activeTab === 'business') {
      const filtered = channelDetailMetrics.filter(metric => 
        ip ? metric.businessName.includes(ip) : true
      )
      setFilteredChannelDetailMetrics(filtered)
    }
  }
  
  const handleReset = () => {
    searchForm.resetFields()
    
    if (activeTab === 'host') {
      setFilteredHostMetrics(hostMetrics)
    } else if (activeTab === 'channel') {
      setFilteredChannelMetrics(channelMetrics)
    } else if (activeTab === 'business') {
      setFilteredChannelDetailMetrics(channelDetailMetrics)
    }
  }
  
  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }
  
  // Host metrics columns
  const hostColumns: ColumnsType<HostMetric> = [
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
      fixed: 'left',
      width: 150,
    },
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
    },
    {
      title: 'CPU使用率',
      dataIndex: 'cpuUsage',
      key: 'cpuUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '内存使用率',
      dataIndex: 'memoryUsage',
      key: 'memoryUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '磁盘使用率',
      dataIndex: 'diskUsage',
      key: 'diskUsage',
      render: (value) => `${value}%`,
    },
    {
      title: '网络读入速率',
      dataIndex: 'networkInRate',
      key: 'networkInRate',
      render: (value) => `${value} MB/s`,
    },
    {
      title: '网络写入速率',
      dataIndex: 'networkOutRate',
      key: 'networkOutRate',
      render: (value) => `${value} MB/s`,
    },
    {
      title: '进程数',
      dataIndex: 'processCount',
      key: 'processCount',
    },
    {
      title: '任务数',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
  ]
  
  // Channel metrics columns
  const channelColumns: ColumnsType<ChannelSummaryMetric> = [
    {
      title: '通道名',
      dataIndex: 'channelName',
      key: 'channelName',
      fixed: 'left',
      width: 150,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
    },
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
    },
    {
      title: '任务数',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
    {
      title: '成功任务数',
      dataIndex: 'successCount',
      key: 'successCount',
    },
    {
      title: '失败任务数',
      dataIndex: 'failedCount',
      key: 'failedCount',
    },
    {
      title: '空任务数',
      dataIndex: 'emptyCount',
      key: 'emptyCount',
    },
    {
      title: '消重任务数',
      dataIndex: 'dedupCount',
      key: 'dedupCount',
    },
    {
      title: '成功率',
      key: 'successRate',
      render: (_, record) => {
        const rate = record.taskCount ? 
          ((record.successCount / record.taskCount) * 100).toFixed(2) : '0.00'
        return `${rate}%`
      }
    }
  ]
  
  // Channel detail metrics columns
  const channelDetailColumns: ColumnsType<ChannelDetailMetric> = [
    {
      title: '业务名',
      dataIndex: 'businessName',
      key: 'businessName',
      fixed: 'left',
      width: 150,
    },
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
    },
    {
      title: '任务数',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
    {
      title: '成功任务数',
      dataIndex: 'successCount',
      key: 'successCount',
    },
    {
      title: '失败任务数',
      dataIndex: 'failedCount',
      key: 'failedCount',
    },
    {
      title: '空任务数',
      dataIndex: 'emptyCount',
      key: 'emptyCount',
    },
    {
      title: '消重任务数',
      dataIndex: 'dedupCount',
      key: 'dedupCount',
    },
    {
      title: '成功率',
      key: 'successRate',
      render: (_, record) => {
        const rate = record.taskCount ? 
          ((record.successCount / record.taskCount) * 100).toFixed(2) : '0.00'
        return `${rate}%`
      }
    }
  ]

  return (
    <div>
      <h1>多维度指标管理</h1>
      
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="云主机总数" 
              value={hosts.length} 
              prefix={<CloudServerOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="通道总数" 
              value={channelMetrics.length} 
              prefix={<ClusterOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="业务指标数" 
              value={channelDetailMetrics.length} 
              prefix={<DatabaseOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      {/* Search Form */}
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 24 }}
      >
        <Form.Item name="ip" label="搜索">
          <Input placeholder="请输入IP/通道名/业务名" />
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
      
      {/* Tabs for different dimensions */}
      <Tabs defaultActiveKey="host" onChange={handleTabChange}>
        <TabPane tab="云主机维度" key="host">
          <Table
            dataSource={filteredHostMetrics}
            columns={hostColumns}
            loading={loading && activeTab === 'host'}
            scroll={{ x: 1200 }}
            pagination={{ pageSize: 10 }}
            rowKey="ip"
          />
        </TabPane>
        <TabPane tab="通道维度" key="channel">
          <Table
            dataSource={filteredChannelMetrics}
            columns={channelColumns}
            loading={loading && activeTab === 'channel'}
            scroll={{ x: 1200 }}
            pagination={{ pageSize: 10 }}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="业务维度" key="business">
          <Table
            dataSource={filteredChannelDetailMetrics}
            columns={channelDetailColumns}
            loading={loading && activeTab === 'business'}
            scroll={{ x: 1200 }}
            pagination={{ pageSize: 10 }}
            rowKey={(record) => `${record.parentId}-${record.ip}`}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default MultiDimensionalMetrics