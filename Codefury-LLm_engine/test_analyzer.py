#!/usr/bin/env python3
"""
Test script for AI Art Analyzer
Demonstrates the comprehensive analysis capabilities
"""

import requests
import json
import time

def test_art_analyzer():
    """Test the AI art analyzer with sample image URLs"""
    
    # Sample image URLs for testing (replace with actual art image URLs)
    test_images = [
        "https://example.com/warli-art.jpg",
        "https://example.com/madhubani-painting.jpg",
        "https://example.com/pithora-art.jpg"
    ]
    
    # API endpoint
    api_url = "http://localhost:5001/analyze"
    
    print("🤖 AI Art Analyzer Test")
    print("=" * 50)
    
    for i, image_url in enumerate(test_images, 1):
        print(f"\n📸 Testing Image {i}: {image_url}")
        print("-" * 30)
        
        try:
            # Prepare request
            payload = {"imageUrl": image_url}
            
            # Make API call
            start_time = time.time()
            response = requests.post(api_url, json=payload, timeout=30)
            end_time = time.time()
            
            if response.status_code == 200:
                analysis = response.json()
                
                print(f"✅ Analysis completed in {end_time - start_time:.2f}s")
                print(f"🎨 Art Form: {analysis.get('predictedArtForm', 'Unknown')}")
                print(f"🎯 Confidence: {analysis.get('artFormConfidence', 0):.2%}")
                print(f"🌈 Dominant Colors: {', '.join(analysis.get('dominantColors', []))}")
                print(f"🏘️ Scene Type: {analysis.get('sceneType', 'Unknown')}")
                print(f"💰 Price Range: {analysis.get('priceRange', 'Unknown')}")
                print(f"🏷️ Tags: {', '.join(analysis.get('suggestedTags', [])[:5])}")
                
                # Show detailed analysis
                print("\n📊 Detailed Analysis:")
                print(f"  • Composition: {analysis.get('compositionType', 'Unknown')}")
                print(f"  • Color Harmony: {analysis.get('colorHarmony', 'Unknown')}")
                print(f"  • Line Quality: {analysis.get('lineQuality', 'Unknown')}")
                print(f"  • Cultural Context: {analysis.get('culturalContext', 'Unknown')}")
                print(f"  • Image Quality: {analysis.get('imageQuality', 'Unknown')}")
                print(f"  • Artistic Complexity: {analysis.get('artisticComplexity', 'Unknown')}")
                
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Test completed!")

def test_with_real_image():
    """Test with a real art image URL"""
    
    # You can replace this with any real art image URL
    real_image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Warli_painting.jpg/800px-Warli_painting.jpg"
    
    api_url = "http://localhost:5001/analyze"
    
    print(f"\n🎨 Testing with Real Image: {real_image_url}")
    print("-" * 50)
    
    try:
        payload = {"imageUrl": real_image_url}
        response = requests.post(api_url, json=payload, timeout=30)
        
        if response.status_code == 200:
            analysis = response.json()
            
            # Pretty print the full analysis
            print("📋 Complete Analysis Results:")
            print(json.dumps(analysis, indent=2, ensure_ascii=False))
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Test with sample URLs
    test_art_analyzer()
    
    # Test with real image (uncomment to test)
    # test_with_real_image()
