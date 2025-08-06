#!/usr/bin/env python3
"""
Test script to verify JMeter connection and configuration
"""

import os
import subprocess
import sys
from pathlib import Path

def test_jmeter_connection():
    """Test if JMeter is properly configured and accessible"""
    
    # Get JMeter home path
    jmeter_home = os.getenv('JMETER_HOME', 'C:\\Users\\Sneha\\Downloads\\apache-jmeter-5.6.3')
    print(f"🔍 Checking JMeter installation at: {jmeter_home}")
    
    # Check if JMeter directory exists
    if not os.path.exists(jmeter_home):
        print(f"❌ JMeter directory not found: {jmeter_home}")
        return False
    
    print(f"✅ JMeter directory found: {jmeter_home}")
    
    # Check for JMeter executable
    if os.name == 'nt':  # Windows
        jmeter_bin = os.path.join(jmeter_home, 'bin', 'jmeter.bat')
    else:  # Unix/Linux
        jmeter_bin = os.path.join(jmeter_home, 'bin', 'jmeter')
    
    if not os.path.exists(jmeter_bin):
        print(f"❌ JMeter executable not found: {jmeter_bin}")
        return False
    
    print(f"✅ JMeter executable found: {jmeter_bin}")
    
    # Test JMeter version
    try:
        result = subprocess.run([jmeter_bin, '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ JMeter version check successful:")
            print(f"   {result.stdout.strip()}")
        else:
            print(f"❌ JMeter version check failed:")
            print(f"   {result.stderr.strip()}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ JMeter version check timed out")
        return False
    except Exception as e:
        print(f"❌ Error checking JMeter version: {e}")
        return False
    
    # Check for Java
    try:
        result = subprocess.run(['java', '-version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ Java is available")
            # Extract Java version from stderr (Java prints version to stderr)
            java_version = result.stderr.split('\n')[0]
            print(f"   {java_version}")
        else:
            print("❌ Java version check failed")
            return False
    except FileNotFoundError:
        print("❌ Java not found. Please install Java (JRE or JDK)")
        return False
    except Exception as e:
        print(f"❌ Error checking Java: {e}")
        return False
    
    # Test JMeter help command
    try:
        result = subprocess.run([jmeter_bin, '--help'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ JMeter help command successful")
        else:
            print("❌ JMeter help command failed")
            return False
    except Exception as e:
        print(f"❌ Error running JMeter help: {e}")
        return False
    
    print("\n🎉 JMeter connection test completed successfully!")
    print("✅ JMeter is properly configured and ready to use")
    return True

def test_jmeter_runner():
    """Test the JMeterRunner class"""
    try:
        from jmeter_runner import JMeterRunner
        
        print("\n🔍 Testing JMeterRunner class...")
        runner = JMeterRunner()
        
        print(f"✅ JMeterRunner initialized")
        print(f"   JMeter Home: {runner.jmeter_home}")
        print(f"   JMeter Bin: {runner.jmeter_bin}")
        print(f"   Results Dir: {runner.results_dir}")
        
        # Test creating a simple JMX file
        test_config = {
            'id': 'test_connection',
            'type': 'Load Test',
            'url': 'http://localhost:3000',
            'users': 10,
            'duration': 30,
            'ramp_up': 5,
            'think_time': 1000
        }
        
        jmx_file = runner.create_jmx_file(test_config)
        print(f"✅ JMX file created: {jmx_file}")
        
        # Check if JMX file exists
        if os.path.exists(jmx_file):
            print(f"✅ JMX file exists and is accessible")
        else:
            print(f"❌ JMX file not found: {jmx_file}")
            return False
        
        return True
        
    except ImportError as e:
        print(f"❌ Error importing JMeterRunner: {e}")
        return False
    except Exception as e:
        print(f"❌ Error testing JMeterRunner: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting JMeter Connection Test...\n")
    
    # Test basic JMeter connection
    jmeter_ok = test_jmeter_connection()
    
    if jmeter_ok:
        # Test JMeterRunner class
        runner_ok = test_jmeter_runner()
        
        if runner_ok:
            print("\n🎉 All tests passed! JMeter is ready to use.")
            sys.exit(0)
        else:
            print("\n❌ JMeterRunner test failed.")
            sys.exit(1)
    else:
        print("\n❌ JMeter connection test failed.")
        sys.exit(1) 