import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Home, Settings, Users, Flame, Zap, Clock, 
  TrendingUp, Activity, CheckCircle, AlertTriangle, X,
  Heart, Gauge, Shield, Play
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTestContext } from '../context/TestContext';

const DashboardPage = ({ onNavigate }) => {
  const {
    currentTest,
    testResults,
    realTimeData,
    isTestRunning,
    testHistory,
    testData
  } = useTestContext();
  // Test Results Data
  const loadTestData = [
    { time: '0s', responseTime: 150 },
    { time: '10s', responseTime: 180 },
    { time: '20s', responseTime: 200 },
    { time: '30s', responseTime: 190 },
    { time: '40s', responseTime: 195 },
    { time: '50s', responseTime: 200 }
  ];

  const stressTestData = [
    { time: '0s', cpuUsage: 20 },
    { time: '10s', cpuUsage: 40 },
    { time: '20s', cpuUsage: 60 },
    { time: '30s', cpuUsage: 80 },
    { time: '40s', cpuUsage: 90 },
    { time: '50s', cpuUsage: 90 }
  ];

  const spikeTestData = [
    { category: 'Success', value: 80 },
    { category: 'Failed', value: 20 }
  ];

  const soakTestData = [
    { time: '0h', memory: 500 },
    { time: '0.5h', memory: 500 },
    { time: '1h', memory: 500 },
    { time: '1.5h', memory: 500 },
    { time: '2h', memory: 500 }
  ];

  const performanceTrendsData = [
    { day: 'Mon', responseTime: 180, successRate: 98.0 },
    { day: 'Tue', responseTime: 200, successRate: 97.0 },
    { day: 'Wed', responseTime: 190, successRate: 96.0 },
    { day: 'Thu', responseTime: 208, successRate: 97.5 },
    { day: 'Fri', responseTime: 195, successRate: 95.0 },
    { day: 'Sat', responseTime: 195, successRate: 96.5 },
    { day: 'Sun', responseTime: 200, successRate: 98.0 }
  ];

     // System Health Data - Dynamic based on test results
   const getSystemHealthData = () => {
     if (isTestRunning && realTimeData.successRate > 0) {
       const healthScore = Math.min(100, Math.max(0, realTimeData.successRate));
       return [
         { name: 'Overall Health', value: healthScore, color: '#10B981' },
         { name: 'Remaining', value: 100 - healthScore, color: '#8B5CF6' }
       ];
     }
     // If test is completed, use test results
     if (testResults && testResults.successfulRequests > 0) {
       const successRate = (testResults.successfulRequests / testResults.totalRequests) * 100;
       const healthScore = Math.min(100, Math.max(0, successRate));
       return [
         { name: 'Overall Health', value: healthScore, color: '#10B981' },
         { name: 'Remaining', value: 100 - healthScore, color: '#8B5CF6' }
       ];
     }
     return [
    { name: 'Overall Health', value: 85, color: '#10B981' },
    { name: 'Remaining', value: 15, color: '#8B5CF6' }
  ];
   };

   const getPerformanceScoreData = () => {
     if (isTestRunning && realTimeData.avgResponseTime > 0) {
       // Calculate performance score based on response time (lower is better)
       const responseTimeScore = Math.max(0, Math.min(100, 100 - (realTimeData.avgResponseTime / 10)));
       return [
         { name: 'Performance Score', value: responseTimeScore, color: '#10B981' },
         { name: 'Remaining', value: 100 - responseTimeScore, color: '#8B5CF6' }
       ];
     }
     // If test is completed, use test results
     if (testResults && testResults.avgResponseTime > 0) {
       const responseTimeScore = Math.max(0, Math.min(100, 100 - (testResults.avgResponseTime / 10)));
       return [
         { name: 'Performance Score', value: responseTimeScore, color: '#10B981' },
         { name: 'Remaining', value: 100 - responseTimeScore, color: '#8B5CF6' }
       ];
     }
     return [
    { name: 'Performance Score', value: 92, color: '#10B981' },
    { name: 'Remaining', value: 8, color: '#8B5CF6' }
  ];
   };

   const getStabilityIndexData = () => {
     if (isTestRunning && testData.responseTimes.length > 1) {
       // Calculate stability based on response time variance
       const responseTimes = testData.responseTimes;
       const mean = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
       const variance = responseTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / responseTimes.length;
       const stabilityScore = Math.max(0, Math.min(100, 100 - (variance / 100)));
       return [
         { name: 'Stability Index', value: stabilityScore, color: '#F59E0B' },
         { name: 'Remaining', value: 100 - stabilityScore, color: '#8B5CF6' }
       ];
     }
     // If test is completed, use test results for stability
     if (testResults && testResults.percentile95 > 0 && testResults.avgResponseTime > 0) {
       // Calculate stability based on how close 95th percentile is to average
       const stabilityRatio = testResults.avgResponseTime / testResults.percentile95;
       const stabilityScore = Math.max(0, Math.min(100, stabilityRatio * 100));
       return [
         { name: 'Stability Index', value: stabilityScore, color: '#F59E0B' },
         { name: 'Remaining', value: 100 - stabilityScore, color: '#8B5CF6' }
       ];
     }
     return [
    { name: 'Stability Index', value: 78, color: '#F59E0B' },
    { name: 'Remaining', value: 22, color: '#8B5CF6' }
  ];
   };

   const systemHealthData = getSystemHealthData();
   const performanceScoreData = getPerformanceScoreData();
   const stabilityIndexData = getStabilityIndexData();

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return X;
      default: return Activity;
    }
  };

  const recentTests = testHistory.length > 0 ? testHistory.slice(0, 3).map(test => ({
    type: test.type,
    details: `${test.userCount} users, ${test.avgResponse}ms avg response time`,
    timestamp: test.timestamp,
    status: test.iconClass,
    icon: getStatusIcon(test.icon)
  })) : [
    {
      type: "No Tests Yet",
      details: "Run your first performance test to see results here",
      timestamp: "",
      status: "default",
      icon: Activity
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-purple-400" />
                <h1 className="text-xl font-bold text-white">Performance Dashboard</h1>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => onNavigate('performance')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Performance Testing</span>
              </button>
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-2 text-purple-400 border-b-2 border-purple-400 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Real-Time Test Status */}
        {isTestRunning && (
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Test Running</h2>
                  <p className="text-gray-300">
                    {currentTest?.type?.charAt(0).toUpperCase() + currentTest?.type?.slice(1)} Test - {currentTest?.userCount} Users
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">{Math.round(realTimeData.testProgress || 0)}%</div>
                <div className="text-sm text-gray-300">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Progress</span>
                <span className="text-white font-semibold">{Math.round(realTimeData.testProgress || 0)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${realTimeData.testProgress || 0}%` }}
                ></div>
              </div>
            </div>
            
            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{realTimeData.activeUsers || 0}</div>
                <div className="text-sm text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{realTimeData.avgResponseTime || 0}ms</div>
                <div className="text-sm text-gray-300">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{realTimeData.successRate || 0}%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{realTimeData.requestsPerSecond || 0}</div>
                <div className="text-sm text-gray-300">RPS</div>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Test Results Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center mb-8">
           <h2 className="text-3xl font-bold text-white mb-4">
             {isTestRunning && currentTest 
               ? `${currentTest.type.charAt(0).toUpperCase() + currentTest.type.slice(1)} Test Results`
               : 'Real-Time Test Results'
             }
           </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
             {isTestRunning && currentTest 
               ? `Currently running ${currentTest.type} test with ${currentTest.userCount} users for ${currentTest.duration} seconds`
               : 'Monitor your performance tests in real-time with comprehensive analytics and detailed insights.'
             }
           </p>
           {isTestRunning && currentTest && (
             <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="text-center">
                 <div className="text-2xl font-bold text-blue-400">{currentTest.type.toUpperCase()}</div>
                 <div className="text-sm text-gray-400">Test Type</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-green-400">{currentTest.userCount}</div>
                 <div className="text-sm text-gray-400">Target Users</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-yellow-400">{currentTest.duration}s</div>
                 <div className="text-sm text-gray-400">Duration</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-purple-400">{Math.round(realTimeData.testProgress || 0)}%</div>
                 <div className="text-sm text-gray-400">Progress</div>
               </div>
             </div>
           )}
        </div>

        {/* Test Results Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Current Test Results */}
            {isTestRunning && currentTest ? (
              <>
                {/* Dynamic Test Results based on Test Type */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    {currentTest.type === 'load' && <Users className="h-6 w-6 text-teal-400" />}
                    {currentTest.type === 'stress' && <Flame className="h-6 w-6 text-red-400" />}
                    {currentTest.type === 'spike' && <Zap className="h-6 w-6 text-yellow-400" />}
                    {currentTest.type === 'soak' && <Clock className="h-6 w-6 text-blue-400" />}
                    <h3 className="text-lg font-bold text-white">
                      {currentTest.type.charAt(0).toUpperCase() + currentTest.type.slice(1)} Test Results
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="text-sm text-gray-300">{currentTest.userCount} Users Simulated</div>
                    <div className="text-sm text-gray-300">{realTimeData.avgResponseTime}ms Average Response Time</div>
                    <div className="text-lg font-bold text-green-400">{realTimeData.successRate}% Success Rate</div>
                  </div>
                  
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={testData.labels.map((label, index) => ({
                        time: label,
                        responseTime: testData.responseTimes[index] || 0
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line type="monotone" dataKey="responseTime" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Test Type Specific Metrics */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">
                      {currentTest.type === 'load' && 'Load Metrics'}
                      {currentTest.type === 'stress' && 'Stress Metrics'}
                      {currentTest.type === 'spike' && 'Spike Metrics'}
                      {currentTest.type === 'soak' && 'Soak Metrics'}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {currentTest.type === 'load' && (
                      <>
                        <div className="text-sm text-gray-300">{realTimeData.activeUsers} Active Users</div>
                        <div className="text-lg font-bold text-blue-400">{realTimeData.requestsPerSecond} RPS</div>
                        <div className="text-sm text-gray-300">{Math.round(realTimeData.testProgress || 0)}% Complete</div>
                      </>
                    )}
                    {currentTest.type === 'stress' && (
                      <>
                        <div className="text-sm text-gray-300">{realTimeData.activeUsers} Peak Users</div>
                        <div className="text-lg font-bold text-red-400">{Math.round(realTimeData.avgResponseTime / 10)}% CPU Usage</div>
                        <div className="text-sm text-gray-300">{realTimeData.avgResponseTime * 2}ms Max Response</div>
                      </>
                    )}
                    {currentTest.type === 'spike' && (
                      <>
                        <div className="text-sm text-gray-300">{realTimeData.activeUsers} Spike Users</div>
                        <div className="text-lg font-bold text-yellow-400">{100 - realTimeData.successRate}% Failure Rate</div>
                        <div className="text-sm text-gray-300">5s Recovery Time</div>
                      </>
                    )}
                    {currentTest.type === 'soak' && (
                      <>
                        <div className="text-sm text-gray-300">{realTimeData.activeUsers} Sustained Users</div>
                        <div className="text-lg font-bold text-blue-400">{realTimeData.avgResponseTime}ms Stable Response</div>
                        <div className="text-sm text-gray-300">{Math.round(realTimeData.testProgress || 0)}% Duration</div>
                      </>
                    )}
                  </div>
                  
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      {currentTest.type === 'spike' ? (
                        <BarChart data={[
                          { category: 'Success', value: realTimeData.successRate },
                          { category: 'Failed', value: 100 - realTimeData.successRate }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="category" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="value" fill="#10B981" />
                        </BarChart>
                      ) : (
                        <LineChart data={testData.labels.map((label, index) => ({
                          time: label,
                          metric: currentTest.type === 'stress' 
                            ? (testData.responseTimes[index] || 0) / 10  // CPU Usage for stress
                            : testData.requestsPerSecond[index] || 0     // RPS for others
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="metric" 
                            stroke={currentTest.type === 'stress' ? '#EF4444' : '#3B82F6'} 
                            strokeWidth={2} 
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Test Type Specific Chart */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    {currentTest.type === 'load' && <TrendingUp className="h-6 w-6 text-green-400" />}
                    {currentTest.type === 'stress' && <Flame className="h-6 w-6 text-red-400" />}
                    {currentTest.type === 'spike' && <Zap className="h-6 w-6 text-yellow-400" />}
                    {currentTest.type === 'soak' && <Clock className="h-6 w-6 text-blue-400" />}
                    <h3 className="text-lg font-bold text-white">
                      {currentTest.type === 'load' && 'Response Time Trend'}
                      {currentTest.type === 'stress' && 'CPU Usage Trend'}
                      {currentTest.type === 'spike' && 'Success/Failure Rate'}
                      {currentTest.type === 'soak' && 'Memory Stability'}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {currentTest.type === 'load' && (
                      <>
                        <div className="text-sm text-gray-300">Response Time Trend</div>
                        <div className="text-lg font-bold text-green-400">{realTimeData.avgResponseTime}ms</div>
                        <div className="text-sm text-gray-300">Test Progress: {Math.round(realTimeData.testProgress || 0)}%</div>
                      </>
                    )}
                    {currentTest.type === 'stress' && (
                      <>
                        <div className="text-sm text-gray-300">CPU Usage Trend</div>
                        <div className="text-lg font-bold text-red-400">{Math.round(realTimeData.avgResponseTime / 10)}%</div>
                        <div className="text-sm text-gray-300">Peak Load: {currentTest.userCount} Users</div>
                      </>
                    )}
                    {currentTest.type === 'spike' && (
                      <>
                        <div className="text-sm text-gray-300">Success vs Failure</div>
                        <div className="text-lg font-bold text-yellow-400">{realTimeData.successRate}% Success</div>
                        <div className="text-sm text-gray-300">{100 - realTimeData.successRate}% Failure</div>
                      </>
                    )}
                    {currentTest.type === 'soak' && (
                      <>
                        <div className="text-sm text-gray-300">Memory Stability</div>
                        <div className="text-lg font-bold text-blue-400">Stable</div>
                        <div className="text-sm text-gray-300">Duration: {Math.round(realTimeData.testProgress || 0)}%</div>
                      </>
                    )}
                  </div>
                  
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      {currentTest.type === 'soak' ? (
                        <LineChart data={testData.labels.map((label, index) => ({
                          time: label,
                          memory: 500 + (Math.random() * 50 - 25) // Simulated stable memory
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Line type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                      ) : (
                        <LineChart data={testData.labels.map((label, index) => ({
                          time: label,
                          successRate: testData.successRate[index] || 0
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="successRate" 
                            stroke={currentTest.type === 'stress' ? '#EF4444' : '#10B981'} 
                            strokeWidth={2} 
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
             <>
               {/* Demo Load Test Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Load Test Results</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="text-sm text-gray-300">100 Users Simulated</div>
              <div className="text-sm text-gray-300">200ms Average Response Time</div>
              <div className="text-lg font-bold text-green-400">98% Success Rate</div>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loadTestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="responseTime" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

               {/* Demo Stress Test Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Flame className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-bold text-white">Stress Test Results</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="text-sm text-gray-300">500 Peak Users</div>
              <div className="text-lg font-bold text-yellow-400">90% Peak CPU Usage</div>
              <div className="text-sm text-gray-300">2.5s Max Response Time</div>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stressTestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="cpuUsage" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

               {/* Demo Spike Test Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Spike Test Results</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="text-sm text-gray-300">1000 Spike Users</div>
              <div className="text-lg font-bold text-red-400">20% Failure Rate</div>
              <div className="text-sm text-gray-300">5s Recovery Time</div>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spikeTestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
             </>
           )}
        </div>

                 {/* Soak Test Results / Live Test Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-teal-400" />
             <h3 className="text-lg font-bold text-white">
               {isTestRunning && currentTest ? 'Live Test Summary' : 'Soak Test Results'}
             </h3>
           </div>
           
           {isTestRunning && currentTest ? (
             <>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                 <div className="text-center">
                   <div className="text-3xl font-bold text-white">{Math.round(realTimeData.testProgress || 0)}%</div>
                   <div className="text-sm text-gray-400">Progress</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold text-green-400">{realTimeData.activeUsers}</div>
                   <div className="text-sm text-gray-400">Active Users</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold text-blue-400">{realTimeData.requestsPerSecond}</div>
                   <div className="text-sm text-gray-400">RPS</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold text-yellow-400">{realTimeData.successRate}%</div>
                   <div className="text-sm text-gray-400">Success Rate</div>
                 </div>
          </div>
          
               <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={testData.labels.map((label, index) => ({
                     time: label,
                     responseTime: testData.responseTimes[index] || 0,
                     rps: testData.requestsPerSecond[index] || 0
                   }))}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                     <XAxis dataKey="time" stroke="#9CA3AF" />
                     <YAxis yAxisId="left" stroke="#10B981" />
                     <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                     <Tooltip 
                       contentStyle={{ 
                         backgroundColor: '#1F2937', 
                         border: '1px solid #374151',
                         borderRadius: '8px'
                       }}
                     />
                     <Line 
                       yAxisId="left"
                       type="monotone" 
                       dataKey="responseTime" 
                       stroke="#10B981" 
                       strokeWidth={2}
                       name="Response Time (ms)"
                     />
                     <Line 
                       yAxisId="right"
                       type="monotone" 
                       dataKey="rps" 
                       stroke="#3B82F6" 
                       strokeWidth={2}
                       name="RPS"
                     />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </>
           ) : (
             <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2h</div>
              <div className="text-sm text-gray-400">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">Stable</div>
              <div className="text-sm text-gray-400">Memory Status</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Memory Leaks</div>
            </div>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={soakTestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
             </>
           )}
        </div>

        {/* Real-time Performance Chart */}
        {isTestRunning && testData.labels.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Play className="h-6 w-6 text-green-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Live Performance Chart</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={testData.labels.map((label, index) => ({
                  time: label,
                  responseTime: testData.responseTimes[index] || 0,
                  requestsPerSecond: testData.requestsPerSecond[index] || 0,
                  successRate: testData.successRate[index] || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis yAxisId="left" stroke="#10B981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#EF4444" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Response Time (ms)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="requestsPerSecond" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Requests/sec"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Performance Trends */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
           <h3 className="text-lg font-bold text-white mb-4">
             {isTestRunning ? 'Live Performance Trends' : 'Performance Trends'}
           </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={
                 isTestRunning && testData.labels.length > 0 
                   ? testData.labels.map((label, index) => ({
                       time: label,
                       responseTime: testData.responseTimes[index] || 0,
                       successRate: testData.successRate[index] || 0
                     }))
                   : performanceTrendsData
               }>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                 <XAxis dataKey={isTestRunning ? "time" : "day"} stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#10B981" />
                <YAxis yAxisId="right" orientation="right" stroke="#22C55E" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Response Time (ms)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  name="Success Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health and Recent History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health Overview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
             <h3 className="text-lg font-bold text-white mb-6 text-center">
               {isTestRunning && currentTest 
                 ? `${currentTest.type.charAt(0).toUpperCase() + currentTest.type.slice(1)} Test Health Overview`
                 : 'System Health Overview'
               }
             </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Test Type Specific Health Metric 1 */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={systemHealthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {systemHealthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-white font-bold">{Math.round(systemHealthData[0].value)}%</span>
                  </div>
                </div>
                 <div className="text-sm text-gray-400">
                   {isTestRunning && currentTest ? (
                     currentTest.type === 'load' ? 'Load Capacity' :
                     currentTest.type === 'stress' ? 'Stress Tolerance' :
                     currentTest.type === 'spike' ? 'Spike Recovery' :
                     'Memory Stability'
                   ) : 'Overall Health'}
                 </div>
              </div>

               {/* Test Type Specific Health Metric 2 */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceScoreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {performanceScoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-white font-bold">{Math.round(performanceScoreData[0].value)}%</span>
                  </div>
                </div>
                 <div className="text-sm text-gray-400">
                   {isTestRunning && currentTest ? (
                     currentTest.type === 'load' ? 'Response Quality' :
                     currentTest.type === 'stress' ? 'CPU Efficiency' :
                     currentTest.type === 'spike' ? 'Error Rate' :
                     'Resource Usage'
                   ) : 'Performance Score'}
                 </div>
              </div>

               {/* Test Type Specific Health Metric 3 */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stabilityIndexData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {stabilityIndexData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-white font-bold">{Math.round(stabilityIndexData[0].value)}%</span>
                  </div>
                </div>
                 <div className="text-sm text-gray-400">
                   {isTestRunning && currentTest ? (
                     currentTest.type === 'load' ? 'Consistency' :
                     currentTest.type === 'stress' ? 'Peak Performance' :
                     currentTest.type === 'spike' ? 'Recovery Speed' :
                     'Long-term Stability'
                   ) : 'Stability Index'}
                 </div>
              </div>
            </div>
          </div>

          {/* Recent Test History */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-6">Recent Test History</h3>
            
            <div className="space-y-4">
              {recentTests.map((test, index) => {
                const IconComponent = test.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(test.status) }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{test.type}</div>
                      <div className="text-sm text-gray-300">{test.details}</div>
                      <div className="text-xs text-gray-400">{test.timestamp}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 