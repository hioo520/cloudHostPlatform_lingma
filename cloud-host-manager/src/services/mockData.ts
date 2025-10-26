// Mock data generation utilities
import { 
  CloudHost, 
  InefficientHost, 
  HostMetric, 
  ChannelSummaryMetric, 
  ChannelDetailMetric, 
  HostChangeRecord 
} from '../types'

// Generate mock cloud hosts
export const generateMockCloudHosts = (count: number = 20): CloudHost[] => {
  const vendors = ['阿里云', '腾讯云', '华为云', 'AWS', 'Azure']
  const regions = ['南京', '北京', '上海', '广州', '深圳']
  const systems = ['Windows Server 2008', 'Windows Server 2012', 'Ubuntu 18.04', 'CentOS 7', 'RedHat 8']
  const owners = ['张三', '李四', '王五', '赵六', '孙伟']
  const departments = [
    'DSC - 南京技术 - PEVC/WDS - 南京技术 - 股票',
    'DSC - 南京技术 - PEVC',
    '研发部 - 前端组',
    '运维部 - 基础设施组',
    '数据部 - 分析组'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `host-${i + 1}`,
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    cpu: Math.floor(Math.random() * 8) + 1,
    memory: Math.floor(Math.random() * 32) + 1,
    disk: Math.floor(Math.random() * 1000) + 100,
    bandwidth: Math.floor(Math.random() * 100) + 1,
    system: systems[Math.floor(Math.random() * systems.length)],
    onlineTime: `2025/10/${Math.floor(Math.random() * 20) + 1}`,
    owner: owners[Math.floor(Math.random() * owners.length)],
    userDepartment: departments[Math.floor(Math.random() * departments.length)],
    sharedDepartment: departments[Math.floor(Math.random() * departments.length)],
    enableStatus: Math.random() > 0.1 ? 1 : 2, // 90% enabled
    managementStatus: Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : 3) : 1, // 70% normal, 20% low usage, 10% public pool
    deviceStatus: Math.random() > 0.9 ? (Math.random() > 0.5 ? 2 : 3) : 1, // 90% normal, 5% missing metrics, 5% overload
  }))
}

// Generate mock inefficient hosts
export const generateMockInefficientHosts = (hosts: CloudHost[]): InefficientHost[] => {
  return hosts
    .filter(host => host.managementStatus === 2) // Only low usage hosts
    .map(host => ({
      ip: host.ip,
      sampleTime: '2025/10/20',
      weeklyCpuUsage: Math.floor(Math.random() * 30),
      weeklyMemoryUsage: Math.floor(Math.random() * 30),
      weeklyDiskUsage: Math.floor(Math.random() * 90) + 10,
      weeklyNetworkInRate: parseFloat((Math.random() * 5).toFixed(2)),
      weeklyNetworkOutRate: parseFloat((Math.random() * 30).toFixed(2)),
      monthlyCpuUsage: Math.floor(Math.random() * 30),
      monthlyMemoryUsage: Math.floor(Math.random() * 30),
      monthlyDiskUsage: Math.floor(Math.random() * 90) + 10,
      monthlyNetworkInRate: parseFloat((Math.random() * 5).toFixed(2)),
      monthlyNetworkOutRate: parseFloat((Math.random() * 30).toFixed(2)),
    }))
}

// Generate mock host metrics
export const generateMockHostMetrics = (hosts: CloudHost[]): HostMetric[] => {
  return hosts.map(host => ({
    ip: host.ip,
    sampleTime: '2025/10/20',
    cpuUsage: Math.floor(Math.random() * 100),
    memoryUsage: Math.floor(Math.random() * 100),
    diskUsage: Math.floor(Math.random() * 100),
    networkInRate: parseFloat((Math.random() * 100).toFixed(2)),
    networkOutRate: parseFloat((Math.random() * 100).toFixed(2)),
    processCount: Math.floor(Math.random() * 500) + 50,
    taskCount: Math.floor(Math.random() * 5000) + 100,
    runningProcesses: `process_${Math.floor(Math.random() * 100)},process_${Math.floor(Math.random() * 100) + 100}`
  }))
}

// Generate mock channel summary metrics
export const generateMockChannelSummaryMetrics = (count: number = 10): ChannelSummaryMetric[] => {
  const channels = ['FHBSD', 'XYZAB', 'LMNOP', 'QRSTU', 'VWXYZ']
  const taskTypes = ['LIST', 'DATA', 'DETAIL']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `channel-${i + 1}`,
    channelName: channels[Math.floor(Math.random() * channels.length)],
    taskType: taskTypes[Math.floor(Math.random() * taskTypes.length)],
    sampleTime: '2025/10/20',
    taskCount: Math.floor(Math.random() * 10000),
    successCount: Math.floor(Math.random() * 8000),
    failedCount: Math.floor(Math.random() * 2000),
    emptyCount: Math.floor(Math.random() * 1000),
    dedupCount: Math.floor(Math.random() * 500),
  }))
}

// Generate mock channel detail metrics
export const generateMockChannelDetailMetrics = (
  channels: ChannelSummaryMetric[], 
  hosts: CloudHost[]
): ChannelDetailMetric[] => {
  return channels.flatMap(channel => {
    const hostSample = hosts.slice(0, Math.min(5, hosts.length))
    return hostSample.map(host => ({
      parentId: channel.id,
      businessName: channel.channelName,
      ip: host.ip,
      sampleTime: channel.sampleTime,
      taskCount: Math.floor(Math.random() * 1000),
      successCount: Math.floor(Math.random() * 800),
      failedCount: Math.floor(Math.random() * 200),
      emptyCount: Math.floor(Math.random() * 100),
      dedupCount: Math.floor(Math.random() * 50),
    }))
  })
}

// Generate mock change records
export const generateMockChangeRecords = (hosts: CloudHost[]): HostChangeRecord[] => {
  return hosts.flatMap(host => {
    const operations = [
      { type: 1, old: '正常', new: '低利用率' },
      { type: 1, old: '低利用率', new: '正常' },
      { type: 2, old: '正常', new: '负载异常' },
      { type: 2, old: '负载异常', new: '正常' },
    ]
    
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    return [{
      sampleTime: '2025/10/20',
      ip: host.ip,
      operationType: operation.type,
      operator: '系统',
      oldValue: operation.old,
      newValue: operation.new,
      remark: 'SYSTEM("系统处理！")'
    }]
  })
}