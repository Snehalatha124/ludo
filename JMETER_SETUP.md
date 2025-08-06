# JMeter Setup Guide

This guide will help you set up Apache JMeter for the Ludo Performance Testing Suite.

## 📋 Prerequisites

- Java 8 or higher (JMeter requires Java)
- Windows, macOS, or Linux operating system
- At least 2GB RAM available for JMeter

## 🚀 Installation Steps

### Step 1: Install Java

#### Windows
1. Download OpenJDK or Oracle JDK from:
   - OpenJDK: https://adoptium.net/
   - Oracle JDK: https://www.oracle.com/java/technologies/downloads/
2. Run the installer and follow the setup wizard
3. Verify installation: `java -version`

#### macOS
```bash
# Using Homebrew
brew install openjdk

# Or download from Oracle/Adoptium websites
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install openjdk-11-jdk
```

### Step 2: Download JMeter

1. Go to the official Apache JMeter website: https://jmeter.apache.org/download_jmeter.cgi
2. Download the latest version (currently 5.6.2)
3. Extract the downloaded file to a directory of your choice

### Step 3: Set Environment Variables

#### Windows
1. Open System Properties → Advanced → Environment Variables
2. Add new System Variable:
   - Variable name: `JMETER_HOME`
   - Variable value: `C:\apache-jmeter-5.6.2` (or your JMeter path)
3. Add `%JMETER_HOME%\bin` to your PATH variable

#### macOS/Linux
Add to your shell profile (`.bashrc`, `.zshrc`, etc.):
```bash
export JMETER_HOME=/path/to/apache-jmeter-5.6.2
export PATH=$PATH:$JMETER_HOME/bin
```

### Step 4: Verify Installation

Open a terminal/command prompt and run:
```bash
jmeter -v
```

You should see JMeter version information.

## 🔧 Configuration

### JMeter Properties

Create or edit `jmeter.properties` in the JMeter bin directory:

```properties
# Memory settings
heap_size=1024m
max_heap_size=2048m

# GUI settings (for development)
jmeter.save.saveservice.output_format=xml
jmeter.save.saveservice.response_data=true
jmeter.save.saveservice.samplerData=true

# Performance settings
httpclient.timeout=30000
httpclient4.retrycount=1
```

### Test Plan Templates

The application automatically generates JMX files for different test types:

- **Load Test**: Normal load testing with steady user count
- **Stress Test**: High load testing to find breaking point  
- **Spike Test**: Sudden load spikes to test system resilience
- **Soak Test**: Extended duration testing for stability

## 🧪 Test Parameters

### Supported Parameters

| Parameter | Description | Range | Default |
|-----------|-------------|-------|---------|
| Users | Number of concurrent users | 1-1000 | 100 |
| Duration | Test duration in seconds | 60-3600 | 600 (10 min) |
| Ramp-up | Time to ramp up all users | 1-300 | 10 |
| Think Time | Delay between requests (ms) | 0-10000 | 1000 |

### Test Type Configurations

#### Load Test
- **Purpose**: Baseline performance measurement
- **Typical Settings**: 50-200 users, 5-15 minutes
- **Use Case**: Normal expected load

#### Stress Test  
- **Purpose**: Find system breaking point
- **Typical Settings**: 200-500 users, 10-20 minutes
- **Use Case**: Beyond normal capacity

#### Spike Test
- **Purpose**: Test system resilience
- **Typical Settings**: 150-300 users, 3-10 minutes
- **Use Case**: Sudden traffic spikes

#### Soak Test
- **Purpose**: Long-term stability testing
- **Typical Settings**: 50-100 users, 30-60 minutes
- **Use Case**: Memory leaks, degradation

## 📊 Results Analysis

### JMeter Output Files

The application generates several output files:

- **JTL File**: Raw test results in CSV format
- **Log File**: JMeter execution logs
- **Report Directory**: HTML report with charts and statistics

### Key Metrics

- **Throughput (TPS)**: Transactions per second
- **Response Time**: Average, median, 95th percentile
- **Error Rate**: Percentage of failed requests
- **Active Users**: Concurrent users during test

## 🔍 Troubleshooting

### Common Issues

#### JMeter Not Found
```
Error: JMeter not found in PATH
```
**Solution**: Verify JMETER_HOME environment variable is set correctly.

#### Out of Memory
```
Error: Java heap space
```
**Solution**: Increase heap size in `jmeter.properties`:
```properties
heap_size=2048m
max_heap_size=4096m
```

#### Permission Denied
```
Error: Permission denied when creating files
```
**Solution**: Ensure write permissions to the results directory.

#### Network Issues
```
Error: Connection refused
```
**Solution**: 
1. Verify target URL is accessible
2. Check firewall settings
3. Ensure target application is running

### Performance Tips

1. **Use Non-GUI Mode**: Always use `-n` flag for production tests
2. **Monitor System Resources**: Watch CPU, memory, and network usage
3. **Start Small**: Begin with low user counts and gradually increase
4. **Use Distributed Testing**: For high load, use multiple JMeter instances

## 🚀 Integration with Ludo Performance Suite

### Automatic JMX Generation

The application automatically creates optimized JMX files based on your test configuration:

1. Select test type and parameters in the UI
2. Application generates appropriate JMX file
3. JMeter executes the test plan
4. Results are parsed and analyzed by AI

### Real-time Monitoring

- Test progress updates every 2 seconds
- Live metrics display during test execution
- Automatic result analysis upon completion

### AI-Powered Analysis

- JMeter results are automatically analyzed by AI
- Intelligent insights and recommendations
- Performance bottleneck identification
- Auto-retry recommendations

## 📚 Additional Resources

- [JMeter Official Documentation](https://jmeter.apache.org/usermanual/index.html)
- [JMeter Best Practices](https://jmeter.apache.org/usermanual/best-practices.html)
- [Performance Testing Guide](https://jmeter.apache.org/usermanual/jmeter_proxy_step_by_step.pdf)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify JMeter installation with `jmeter -v`
3. Review JMeter logs in the `jmeter_results` directory
4. Check system resources during test execution

---

**Note**: JMeter requires significant system resources for high-load testing. Ensure your system has adequate CPU, memory, and network capacity for your intended test scenarios. 