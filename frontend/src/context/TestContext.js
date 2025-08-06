import React, { createContext, useContext, useState, useEffect } from 'react';

const TestContext = createContext();

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};

export const TestProvider = ({ children }) => {
  const [currentTest, setCurrentTest] = useState(null);
  const [testResults, setTestResults] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    percentile95: 0,
    peakRPS: 0,
    userCount: 0
  });
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    avgResponseTime: 0,
    successRate: 0,
    requestsPerSecond: 0,
    testProgress: 0
  });
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [testData, setTestData] = useState({
    labels: [],
    responseTimes: [],
    requestsPerSecond: [],
    successRate: []
  });

  // Update real-time data
  const updateRealTimeData = (data) => {
    setRealTimeData(data);
  };

  // Update test results
  const updateTestResults = (results) => {
    setTestResults(results);
  };

  // Start test
  const startTest = (testConfig) => {
    setCurrentTest(testConfig);
    setIsTestRunning(true);
    setTestResults({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      percentile95: 0,
      peakRPS: 0,
      userCount: testConfig.userCount
    });
    setRealTimeData({
      activeUsers: 0,
      avgResponseTime: 0,
      successRate: 0,
      requestsPerSecond: 0,
      testProgress: 0
    });
    setTestData({
      labels: [],
      responseTimes: [],
      requestsPerSecond: [],
      successRate: []
    });
  };

  // Stop test
  const stopTest = () => {
    setIsTestRunning(false);
    setCurrentTest(null);
  };

           // Add test to history
         const addTestToHistory = (testData) => {
           setTestHistory(prev => [testData, ...prev.slice(0, 9)]); // Keep last 10 tests
         };

         // Remove test from history
         const removeTestFromHistory = (index) => {
           setTestHistory(prev => prev.filter((_, i) => i !== index));
         };

  // Update test data for charts
  const updateTestData = (data) => {
    setTestData(data);
  };

  const value = {
    currentTest,
    testResults,
    realTimeData,
    isTestRunning,
    testHistory,
    testData,
    updateRealTimeData,
    updateTestResults,
    startTest,
    stopTest,
    addTestToHistory,
    removeTestFromHistory,
    updateTestData
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
}; 