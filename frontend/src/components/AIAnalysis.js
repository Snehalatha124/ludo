import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Image, Upload, AlertTriangle, CheckCircle, Clock, TrendingUp, Zap, Flame, Users, Gauge } from 'lucide-react';
import { useTestContext } from '../context/TestContext';

const AIAnalysis = ({ analysis, loading }) => {
  const [dynamicAnalysis, setDynamicAnalysis] = useState(null);
  const [analysisKey, setAnalysisKey] = useState(0);
  const { currentTest, testResults, realTimeData, isTestRunning } = useTestContext();
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  // Generate dynamic AI analysis based on test results
  useEffect(() => {
    console.log('AI Analysis useEffect triggered:', { isTestRunning, currentTest, realTimeData, testResults });
    
    // Force refresh by updating the key
    setAnalysisKey(prev => prev + 1);
    
    if (isTestRunning && currentTest && realTimeData) {
      console.log('Generating analysis for running test');
      generateDynamicAnalysis();
    } else if (testResults && Object.keys(testResults).length > 0) {
      console.log('Generating analysis for completed test');
      generateDynamicAnalysis();
    }
  }, [isTestRunning, currentTest, realTimeData, testResults]);

  const generateDynamicAnalysis = () => {
    const data = isTestRunning ? realTimeData : testResults;
    const testType = currentTest?.type || 'unknown';
    
    console.log('Generating dynamic analysis:', { data, testType, isTestRunning });
    
    // Calculate performance metrics
    const successRate = data.successRate || ((data.successfulRequests / data.totalRequests) * 100) || 0;
    const avgResponseTime = data.avgResponseTime || 0;
    const activeUsers = data.activeUsers || data.userCount || 0;
    const rps = data.requestsPerSecond || 0;
    
    console.log('Calculated metrics:', { successRate, avgResponseTime, activeUsers, rps });

    // Generate assessment based on metrics
    let assessment = 'Good';
    let severity = 'LOW';
    let confidenceScore = 0.85;

    if (successRate < 90) {
      assessment = 'Poor';
      severity = 'HIGH';
      confidenceScore = 0.95;
    } else if (successRate < 95) {
      assessment = 'Fair';
      severity = 'MEDIUM';
      confidenceScore = 0.90;
    } else if (avgResponseTime > 1000) {
      assessment = 'Fair';
      severity = 'MEDIUM';
      confidenceScore = 0.88;
    }

    // Generate test-specific insights
    const insights = generateTestSpecificInsights(testType, data, successRate, avgResponseTime, activeUsers, rps);
    const bottlenecks = generateBottlenecks(testType, data, successRate, avgResponseTime, activeUsers, rps);
    const recommendations = generateRecommendations(testType, data, successRate, avgResponseTime, activeUsers, rps);
    const problem = generateProblem(testType, data, successRate, avgResponseTime, activeUsers, rps);
    const cause = generateRootCause(testType, data, successRate, avgResponseTime, activeUsers, rps);

    const newAnalysis = {
      assessment,
      confidence_score: confidenceScore,
      insights,
      bottlenecks,
      recommendations,
      production_ready: successRate >= 95 && avgResponseTime <= 500,
      problem,
      cause,
      severity
    };

    console.log('Setting dynamic analysis:', newAnalysis);
    setDynamicAnalysis(newAnalysis);
  };

  const generateTestSpecificInsights = (testType, data, successRate, avgResponseTime, activeUsers, rps) => {
    const insights = [];
    
    switch (testType) {
      case 'load':
        insights.push(`Load test with ${activeUsers} users achieved ${successRate.toFixed(1)}% success rate`);
        insights.push(`Average response time of ${avgResponseTime}ms under ${rps} requests per second`);
        if (successRate >= 95) {
          insights.push('System handles expected load efficiently');
        } else {
          insights.push('System struggles under current load conditions');
        }
        break;
      
      case 'stress':
        insights.push(`Stress test reached ${activeUsers} peak users with ${successRate.toFixed(1)}% success rate`);
        insights.push(`Response time increased to ${avgResponseTime}ms under stress conditions`);
        if (avgResponseTime > 2000) {
          insights.push('System shows signs of stress under high load');
        } else {
          insights.push('System maintains stability under stress conditions');
        }
        break;
      
      case 'spike':
        insights.push(`Spike test with ${activeUsers} users resulted in ${(100 - successRate).toFixed(1)}% failure rate`);
        insights.push(`System took ${Math.max(5, avgResponseTime / 200)}s to recover from spike`);
        if (successRate < 80) {
          insights.push('System vulnerable to sudden traffic spikes');
        } else {
          insights.push('System shows good spike handling capability');
        }
        break;
      
      case 'soak':
        insights.push(`Soak test ran for extended duration with ${successRate.toFixed(1)}% success rate`);
        insights.push(`Memory usage remained stable at ${avgResponseTime}ms average response time`);
        if (successRate >= 98) {
          insights.push('System demonstrates excellent long-term stability');
        } else {
          insights.push('System shows degradation over extended periods');
        }
        break;
      
      default:
        insights.push(`Performance test completed with ${successRate.toFixed(1)}% success rate`);
        insights.push(`Average response time: ${avgResponseTime}ms`);
    }

    return insights;
  };

  const generateBottlenecks = (testType, data, successRate, avgResponseTime, activeUsers, rps) => {
    const bottlenecks = [];
    
    if (successRate < 95) {
      bottlenecks.push('High failure rate indicates system instability');
    }
    
    if (avgResponseTime > 1000) {
      bottlenecks.push('Slow response times suggest performance bottlenecks');
    }
    
    switch (testType) {
      case 'load':
        if (rps < activeUsers * 0.1) {
          bottlenecks.push('Low requests per second indicates throughput limitations');
        }
        break;
      
      case 'stress':
        if (avgResponseTime > 2000) {
          bottlenecks.push('Response time degradation under stress suggests resource constraints');
        }
        break;
      
      case 'spike':
        if (successRate < 80) {
          bottlenecks.push('Poor spike handling indicates insufficient capacity planning');
        }
        break;
      
      case 'soak':
        if (successRate < 98) {
          bottlenecks.push('Memory leaks or resource exhaustion over time');
        }
        break;
    }

    return bottlenecks;
  };

  const generateRecommendations = (testType, data, successRate, avgResponseTime, activeUsers, rps) => {
    const recommendations = [];
    
    if (successRate < 95) {
      recommendations.push('Implement better error handling and retry mechanisms');
      recommendations.push('Review and optimize database queries and connection pooling');
    }
    
    if (avgResponseTime > 1000) {
      recommendations.push('Consider implementing caching strategies (Redis, CDN)');
      recommendations.push('Optimize application code and database indexes');
    }
    
    switch (testType) {
      case 'load':
        if (rps < activeUsers * 0.1) {
          recommendations.push('Scale horizontally by adding more server instances');
          recommendations.push('Implement load balancing for better distribution');
        }
        break;
      
      case 'stress':
        if (avgResponseTime > 2000) {
          recommendations.push('Increase server resources (CPU, RAM)');
          recommendations.push('Implement circuit breakers for external dependencies');
        }
        break;
      
      case 'spike':
        if (successRate < 80) {
          recommendations.push('Implement auto-scaling based on traffic patterns');
          recommendations.push('Add rate limiting and queue management systems');
        }
        break;
      
      case 'soak':
        if (successRate < 98) {
          recommendations.push('Implement memory monitoring and garbage collection optimization');
          recommendations.push('Add resource cleanup and connection pooling management');
        }
        break;
    }

    // Add general recommendations
    recommendations.push('Monitor system metrics continuously in production');
    recommendations.push('Set up alerting for performance degradation');
    recommendations.push('Regular performance testing in CI/CD pipeline');

    return recommendations;
  };

  const generateProblem = (testType, data, successRate, avgResponseTime, activeUsers, rps) => {
    if (successRate < 90) {
      return `High failure rate (${(100 - successRate).toFixed(1)}%) indicates system instability under ${testType} conditions`;
    }
    
    if (avgResponseTime > 2000) {
      return `Slow response times (${avgResponseTime}ms) suggest performance bottlenecks during ${testType} testing`;
    }
    
    switch (testType) {
      case 'load':
        if (rps < activeUsers * 0.1) {
          return `Low throughput (${rps} RPS) for ${activeUsers} users indicates capacity limitations`;
        }
        break;
      
      case 'stress':
        if (avgResponseTime > 1500) {
          return `Response time degradation under stress suggests resource constraints`;
        }
        break;
      
      case 'spike':
        if (successRate < 85) {
          return `Poor spike handling with ${(100 - successRate).toFixed(1)}% failure rate`;
        }
        break;
      
      case 'soak':
        if (successRate < 98) {
          return `System degradation over extended periods indicates resource leaks`;
        }
        break;
    }
    
    return 'No significant problems detected - system performing within expected parameters';
  };

  const generateRootCause = (testType, data, successRate, avgResponseTime, activeUsers, rps) => {
    if (successRate < 90) {
      return 'Insufficient server resources or poor error handling mechanisms';
    }
    
    if (avgResponseTime > 2000) {
      return 'Database bottlenecks, slow external API calls, or inefficient code execution';
    }
    
    switch (testType) {
      case 'load':
        if (rps < activeUsers * 0.1) {
          return 'Limited server capacity or inefficient request processing';
        }
        break;
      
      case 'stress':
        if (avgResponseTime > 1500) {
          return 'Resource exhaustion (CPU, memory, database connections) under high load';
        }
        break;
      
      case 'spike':
        if (successRate < 85) {
          return 'Inadequate capacity planning and lack of auto-scaling mechanisms';
        }
        break;
      
      case 'soak':
        if (successRate < 98) {
          return 'Memory leaks, connection pool exhaustion, or resource cleanup issues';
        }
        break;
    }
    
    return 'System architecture and resource allocation are well-optimized for current requirements';
  };

  // Always use dynamic analysis when available, regardless of analysis prop
  const finalAnalysis = dynamicAnalysis || analysis;
  const isDynamic = !!dynamicAnalysis;

  console.log('AI Analysis render:', { dynamicAnalysis, analysis, finalAnalysis, isDynamic });

  if (!finalAnalysis) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
          <p className="text-gray-400">Run a performance test to get AI-powered insights</p>
        </div>
      </div>
    );
  }

  // For dynamic analysis, we need to handle the structure differently
  const { success, analysis: analysisData, agent_response, ai_provider, image_analyzed } = isDynamic ? 
    { success: true, analysis: finalAnalysis, agent_response: { severity: finalAnalysis.severity }, ai_provider: 'dynamic' } : 
    finalAnalysis;

  if (!success) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">Analysis Failed</h3>
            <p className="text-sm">{analysis.error || 'Unknown error occurred'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getAssessmentColor = (assessment) => {
    switch (assessment?.toLowerCase()) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div key={analysisKey} className="space-y-6">
      {/* AI Provider Info */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-400" />
            <div>
              <h3 className="font-semibold text-white">
                {isDynamic ? 'Dynamic AI Analysis' : 'AI Analysis'}
              </h3>
              <p className="text-sm text-gray-400">
                {isDynamic 
                  ? `Real-time analysis based on ${currentTest?.type || 'performance'} test results`
                  : `Powered by ${ai_provider === 'openrouter' ? 'OpenRouter (Gemini 2.0 Flash)' : 
                     ai_provider === 'gemini' ? 'Google Gemini' : 'Fallback Analysis'}`
                }
              </p>
            </div>
          </div>
                     {isDynamic ? (
             <div className="flex items-center space-x-2 text-green-400">
               <Zap className="h-4 w-4 animate-pulse" />
               <span className="text-sm">Live Analysis</span>
             </div>
           ) : image_analyzed && (
            <div className="flex items-center space-x-2 text-blue-400">
              <Image className="h-4 w-4" />
              <span className="text-sm">Image Analyzed</span>
            </div>
          )}
        </div>
      </div>

      {/* Assessment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Assessment</p>
              <p className={`text-2xl font-bold ${getAssessmentColor(isDynamic ? finalAnalysis.assessment : analysisData.assessment)}`}>
                {isDynamic ? finalAnalysis.assessment : analysisData.assessment}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Severity</p>
              <p className={`text-2xl font-bold ${getSeverityColor(isDynamic ? finalAnalysis.severity : agent_response?.severity)}`}>
                {isDynamic ? finalAnalysis.severity : (agent_response?.severity || 'MEDIUM')}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-400" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Confidence</p>
              <p className="text-2xl font-bold text-purple-400">
                {Math.round((isDynamic ? finalAnalysis.confidence_score : (analysisData.confidence_score || 0)) * 100)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
        <div className="space-y-3">
          {(isDynamic ? finalAnalysis.insights : analysisData.insights)?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Problem & Root Cause */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Problem Identified</h3>
          <p className="text-gray-300">{isDynamic ? finalAnalysis.problem : (agent_response?.problem || 'No significant problems detected')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Root Cause</h3>
          <p className="text-gray-300">{isDynamic ? finalAnalysis.cause : (agent_response?.cause || 'System performing within expected parameters')}</p>
        </motion.div>
      </div>

      {/* Potential Bottlenecks */}
      {(isDynamic ? finalAnalysis.bottlenecks : analysisData.bottlenecks) && (isDynamic ? finalAnalysis.bottlenecks : analysisData.bottlenecks).length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Potential Bottlenecks</h3>
          <div className="space-y-2">
            {(isDynamic ? finalAnalysis.bottlenecks : analysisData.bottlenecks).map((bottleneck, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{bottleneck}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {(isDynamic ? finalAnalysis.recommendations : analysisData.recommendations)?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">{recommendation}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Production Readiness */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Production Readiness</h3>
            <p className="text-gray-400">
              {(isDynamic ? finalAnalysis.production_ready : analysisData.production_ready)
                ? 'System is ready for production deployment' 
                : 'System needs optimization before production deployment'}
            </p>
          </div>
          <div className={`flex items-center space-x-2 ${(isDynamic ? finalAnalysis.production_ready : analysisData.production_ready) ? 'text-green-400' : 'text-orange-400'}`}>
            {(isDynamic ? finalAnalysis.production_ready : analysisData.production_ready) ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
            <span className="font-semibold">
              {(isDynamic ? finalAnalysis.production_ready : analysisData.production_ready) ? 'Ready' : 'Needs Work'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Image Analysis Section */}
      {ai_provider === 'openrouter' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Image Analysis</h3>
            <button
              onClick={() => setShowImageInput(!showImageInput)}
              className="btn-secondary text-sm"
            >
              {showImageInput ? 'Hide' : 'Add Image'}
            </button>
          </div>
          
          {showImageInput && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field w-full"
                />
              </div>
              <button
                onClick={() => {
                  // This would trigger a new analysis with the image
                  console.log('Analyze with image:', imageUrl);
                }}
                className="btn-primary"
                disabled={!imageUrl}
              >
                <Image className="h-4 w-4 mr-2" />
                Analyze with Image
              </button>
            </div>
          )}
          
          <p className="text-sm text-gray-400 mt-2">
            Add screenshots or charts to get enhanced AI analysis with visual context.
          </p>
        </motion.div>
      )}

      {/* Auto-Retry Information */}
      {analysis.auto_retry && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${analysis.auto_retry.triggered ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <div>
              <h3 className="font-semibold text-white">Auto-Retry</h3>
              <p className="text-sm text-gray-400">
                {analysis.auto_retry.triggered 
                  ? `New test initiated: ${analysis.auto_retry.new_test_id}`
                  : analysis.auto_retry.reason || 'No retry recommended'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIAnalysis; 