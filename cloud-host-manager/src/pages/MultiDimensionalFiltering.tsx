import React, { useEffect, useState } from 'react'
import { 
  Form, 
  Button, 
  Tree, 
  Table, 
  Card, 
  DatePicker,
  Space
} from 'antd'
import type { DataNode } from 'antd/es/tree'
import type { ColumnsType } from 'antd/es/table'
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

const { RangePicker } = DatePicker

// Extend DataNode to include dimension property
interface MetricDataNode extends DataNode {
  dimension?: 'host' | 'channel' | 'business'
}

interface SelectedMetric {
  key: string
  title: string
  dimension: 'host' | 'channel' | 'business'
}

const MultiDimensionalFiltering: React.FC = () => {
  const [hosts, setHosts] = useState<CloudHost[]>([])
  const [hostMetrics, setHostMetrics] = useState<HostMetric[]>([])
  const [channelMetrics, setChannelMetrics] = useState<ChannelSummaryMetric[]>([])
  const [channelDetailMetrics, setChannelDetailMetrics] = useState<ChannelDetailMetric[]>([])
  
  const [metricTreeData, setMetricTreeData] = useState<MetricDataNode[]>([])
  const [hostTreeData, setHostTreeData] = useState<DataNode[]>([])
  
  const [selectedMetrics, setSelectedMetrics] = useState<SelectedMetric[]>([])
  const [selectedHosts, setSelectedHosts] = useState<string[]>([])
  
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isMetricPanelCollapsed, setIsMetricPanelCollapsed] = useState(false)
  
  const [form] = Form.useForm()
  
  // Initialize mock data
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
      
      // Initialize tree data
      initMetricTreeData()
      initHostTreeData(mockHosts)
      
      setLoading(false)
    }, 500)
  }
  
  // Initialize metric tree data
  const initMetricTreeData = () => {
    const hostMetrics: MetricDataNode[] = [
      { title: 'CPU使用率', key: 'cpuUsage', dimension: 'host' },
      { title: '内存使用率', key: 'memoryUsage', dimension: 'host' }, 
      { title: '磁盘使用率', key: 'diskUsage', dimension: 'host' },
      { title: '网络读入速率', key: 'networkInRate', dimension: 'host' },
      { title: '网络写入速率', key: 'networkOutRate', dimension: 'host' },
      { title: '进程数', key: 'processCount', dimension: 'host' },
      { title: '任务数', key: 'taskCount', dimension: 'host' },
    ]
    
    const channelMetrics: MetricDataNode[] = [
      { title: '任务数', key: 'taskCount', dimension: 'channel' },
      { title: '成功任务数', key: 'successCount', dimension: 'channel' },
      { title: '失败任务数', key: 'failedCount', dimension: 'channel' },
      { title: '空任务数', key: 'emptyCount', dimension: 'channel' },
      { title: '消重任务数', key: 'dedupCount', dimension: 'channel' },
      { title: '成功率', key: 'successRate', dimension: 'channel' },
    ]
    
    const businessMetrics: MetricDataNode[] = [
      { title: '任务数', key: 'taskCount', dimension: 'business' },
      { title: '成功任务数', key: 'successCount', dimension: 'business' },
      { title: '失败任务数', key: 'failedCount', dimension: 'business' },
      { title: '空任务数', key: 'emptyCount', dimension: 'business' },
      { title: '消重任务数', key: 'dedupCount', dimension: 'business' },
      { title: '成功率', key: 'successRate', dimension: 'business' },
    ]
    
    const treeData: MetricDataNode[] = [
      {
        title: '云主机维度',
        key: 'host-dimension',
        dimension: 'host',
        children: hostMetrics
      },
      {
        title: '通道维度',
        key: 'channel-dimension',
        dimension: 'channel',
        children: channelMetrics
      },
      {
        title: '业务维度',
        key: 'business-dimension',
        dimension: 'business',
        children: businessMetrics
      }
    ]
    
    setMetricTreeData(treeData)
  }
  
  // Initialize host tree data
  const initHostTreeData = (hosts: CloudHost[]) => {
    // Group hosts by vendor and region
    const vendorMap: Record<string, Record<string, CloudHost[]>> = {}
    
    hosts.forEach(host => {
      if (!vendorMap[host.vendor]) {
        vendorMap[host.vendor] = {}
      }
      if (!vendorMap[host.vendor][host.region]) {
        vendorMap[host.vendor][host.region] = []
      }
      vendorMap[host.vendor][host.region].push(host)
    })
    
    const treeData: DataNode[] = Object.keys(vendorMap).map(vendor => {
      const regionChildren: DataNode[] = Object.keys(vendorMap[vendor]).map(region => ({
        title: region,
        key: `region-${vendor}-${region}`,
        children: vendorMap[vendor][region].map(host => ({
          title: host.ip,
          key: host.ip,
          isLeaf: true
        }))
      }))
      
      return {
        title: vendor,
        key: `vendor-${vendor}`,
        children: regionChildren
      }
    })
    
    setHostTreeData(treeData)
  }
  
  // Handle metric selection
  const onMetricCheck = (checkedKeys: any) => {
    // Get all leaf nodes (actual metrics)
    const metrics: SelectedMetric[] = []
    
    const traverse = (nodes: MetricDataNode[], checked: string[]) => {
      nodes.forEach(node => {
        if (node.children) {
          traverse(node.children as MetricDataNode[], checked)
        } else if (checked.includes(node.key as string) && node.dimension) {
          metrics.push({
            key: node.key as string,
            title: node.title as string,
            dimension: node.dimension
          })
        }
      })
    }
    
    traverse(metricTreeData, checkedKeys)
    setSelectedMetrics(metrics)
  }
  
  // Handle host selection
  const onHostCheck = (checkedKeys: any) => {
    // Filter only host IPs (leaf nodes)
    const hosts = checkedKeys.filter((key: string) => !key.startsWith('vendor-') && !key.startsWith('region-'))
    setSelectedHosts(hosts)
  }
  
  // Generate table columns based on selected metrics
  const generateColumns = (): ColumnsType<any> => {
    const columns: ColumnsType<any> = [
      {
        title: '维度类型',
        key: 'dimensionType',
        render: (_, record) => {
          if (record.ip && !record.channelName && !record.businessName) return '云主机维度'
          if (record.channelName && !record.businessName) return '通道维度'
          if (record.businessName) return '业务维度'
          return '未知'
        }
      }
    ]
    
    // Add selected metric columns
    selectedMetrics.forEach(metric => {
      columns.push({
        title: metric.title,
        key: metric.key,
        dataIndex: metric.key,
        render: (value) => {
          // Format values based on metric type
          if (typeof value === 'number') {
            if (metric.key.includes('Rate') || metric.key.includes('Usage')) {
              return `${value}%`
            } else if (metric.key.includes('network')) {
              return `${value} MB/s`
            }
            return value
          }
          return value || '-'
        }
      })
    })
    
    return columns
  }
  
  // Handle search
  const handleSearch = () => {
    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter data based on selected metrics and hosts
      let resultData: any[] = []
      
      // Add host metrics if host dimension is selected
      if (selectedMetrics.some(m => m.dimension === 'host')) {
        let filteredHostMetrics = [...hostMetrics]
        
        // Filter by selected hosts
        if (selectedHosts.length > 0) {
          filteredHostMetrics = filteredHostMetrics.filter(metric => 
            selectedHosts.includes(metric.ip)
          )
        }
        
        // Add dimension type
        resultData = resultData.concat(
          filteredHostMetrics.map(metric => ({
            ...metric,
            dimensionType: 'host'
          }))
        )
      }
      
      // Add channel metrics if channel dimension is selected
      if (selectedMetrics.some(m => m.dimension === 'channel')) {
        resultData = resultData.concat(
          channelMetrics.map(metric => ({
            ...metric,
            dimensionType: 'channel'
          }))
        )
      }
      
      // Add business metrics if business dimension is selected
      if (selectedMetrics.some(m => m.dimension === 'business')) {
        resultData = resultData.concat(
          channelDetailMetrics.map(metric => ({
            ...metric,
            dimensionType: 'business'
          }))
        )
      }
      
      setFilteredData(resultData)
      setLoading(false)
    }, 500)
  }
  
  // Reset form
  const handleReset = () => {
    form.resetFields()
    setSelectedMetrics([])
    setSelectedHosts([])
    setFilteredData([])
  }
  
  // Toggle metric panel
  const toggleMetricPanel = () => {
    setIsMetricPanelCollapsed(!isMetricPanelCollapsed)
  }
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1>多维度筛选</h1>
      
      {/* 功能区 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
        >
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
      </Card>
      
      <div style={{ display: 'flex', flex: 1, gap: 16 }}>
        {/* 指标筛选区 */}
        {!isMetricPanelCollapsed && (
          <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 指标选择 */}
            <Card size="small" title="指标筛选" style={{ flex: 1 }}>
              <Tree
                checkable
                treeData={metricTreeData}
                onCheck={onMetricCheck}
                checkedKeys={selectedMetrics.map(m => m.key)}
                defaultExpandedKeys={['host-dimension', 'channel-dimension', 'business-dimension']}
              />
            </Card>
            
            {/* 云主机选择 */}
            <Card size="small" title="云主机筛选" style={{ flex: 1 }}>
              <Tree
                checkable
                treeData={hostTreeData}
                onCheck={onHostCheck}
                checkedKeys={selectedHosts}
                defaultExpandedKeys={hosts.map(host => `vendor-${host.vendor}`)}
                height={300}
              />
            </Card>
          </div>
        )}
        
        {/* 收起/展开按钮 */}
        <Button 
          onClick={toggleMetricPanel}
          style={{ alignSelf: 'center' }}
        >
          {isMetricPanelCollapsed ? '展开 >>' : '收起 <<'}
        </Button>
        
        {/* 指标展示区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Card size="small" title="指标展示" style={{ flex: 1 }}>
            <Table
              dataSource={filteredData}
              columns={generateColumns()}
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ y: 400 }}
              rowKey={(record) => `${record.dimensionType}-${record.ip || record.channelName || record.businessName}`}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MultiDimensionalFiltering