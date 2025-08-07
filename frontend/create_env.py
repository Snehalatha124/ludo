#!/usr/bin/env python3
"""
Simple script to create .env files with API keys
"""

import os
from pathlib import Path

def create_backend_env():
    """Create backend .env file"""
    backend_dir = Path("backend")
    env_file = backend_dir / ".env"
    
    if env_file.exists():
        print("⚠️  Backend .env file already exists")
        return
    
    env_content = """# Gemini AI Configuration
GEMINI_API_KEY=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

# OpenRouter AI Configuration (Alternative AI Provider)
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_SITE_URL=https://your-site-url.com
OPENROUTER_SITE_NAME=Ludo Performance Suite

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=true
HOST=0.0.0.0
PORT=5000

# Test Configuration
MAX_CONCURRENT_TESTS=10
DEFAULT_TEST_DURATION=60
DEFAULT_NUM_USERS=100

# Deployment Configuration (for Vercel)
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
"""
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print("✅ Backend .env file created with your Gemini API key")
    print("💡 You can add your OpenRouter API key to enable image analysis")

def create_frontend_env():
    """Create frontend .env file"""
    frontend_dir = Path("frontend")
    env_file = frontend_dir / ".env"
    
    if env_file.exists():
        print("⚠️  Frontend .env file already exists")
        return
    
    env_content = """# Frontend Environment Configuration

# Backend API URL
# For local development:
REACT_APP_BACKEND_URL=http://localhost:5000

# For production deployment (set in Vercel dashboard):
# REACT_APP_BACKEND_URL=https://your-backend.vercel.app

# Environment
REACT_APP_ENV=development

# Feature flags
REACT_APP_ENABLE_AI_ANALYSIS=true
REACT_APP_ENABLE_REAL_TIME_MONITORING=true
"""
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print("✅ Frontend .env file created")

def main():
    print("🔐 Creating .env files...")
    
    # Create backend .env
    create_backend_env()
    
    # Create frontend .env
    create_frontend_env()
    
    print("\n🎉 .env files created successfully!")
    print("\n📋 API Keys Status:")
    print("✅ Gemini API: Configured")
    print("⚠️  OpenRouter API: Add your key to backend/.env for image analysis")
    print("\n💡 To add OpenRouter API key:")
    print("1. Get your key from https://openrouter.ai/")
    print("2. Edit backend/.env")
    print("3. Replace 'your-openrouter-api-key-here' with your actual key")

if __name__ == "__main__":
    main() 