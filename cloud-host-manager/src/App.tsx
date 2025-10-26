import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import Dashboard from './pages/Dashboard'
import HostManagement from './pages/HostManagement'
import HostChangeManagement from './pages/HostChangeManagement'
import InefficientHosts from './pages/InefficientHosts'
import PublicPool from './pages/PublicPool'
import MultiDimensionalMetrics from './pages/MultiDimensionalMetrics'
import './App.css'

const { Header, Content, Sider } = Layout

const AppMenu: React.FC = () => {
  const navigate = useNavigate()
  
  const menuItems = [
    {
      key: 'dashboard',
      label: '仪表盘',
    },
    {
      key: 'host-management',
      label: '云主机管理',
    },
    {
      key: 'host-change-management',
      label: '云主机变更管理',
    },
    {
      key: 'inefficient-hosts',
      label: '低效云主机',
    },
    {
      key: 'public-pool',
      label: '公共池管理',
    },
    {
      key: 'multi-dimensional-metrics',
      label: '多维度指标管理',
    },
  ]
  
  const handleClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'host-management':
        navigate('/host-management')
        break
      case 'host-change-management':
        navigate('/host-change-management')
        break
      case 'inefficient-hosts':
        navigate('/inefficient-hosts')
        break
      case 'public-pool':
        navigate('/public-pool')
        break
      case 'multi-dimensional-metrics':
        navigate('/multi-dimensional-metrics')
        break
      default:
        navigate('/')
    }
  }
  
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['dashboard']}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
      onClick={handleClick}
    />
  )
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="logo" />
          <h2 style={{ color: 'white', textAlign: 'center' }}>云主机管理平台</h2>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: colorBgContainer }}>
            <AppMenu />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/host-management" element={<HostManagement />} />
                <Route path="/host-change-management" element={<HostChangeManagement />} />
                <Route path="/inefficient-hosts" element={<InefficientHosts />} />
                <Route path="/public-pool" element={<PublicPool />} />
                <Route path="/multi-dimensional-metrics" element={<MultiDimensionalMetrics />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App