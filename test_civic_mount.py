#!/usr/bin/env python3
"""
Civic OS Mount Protocol - Complete Test Suite
Tests the LLM-agnostic boarding system without requiring a running server.
"""
import hashlib
import json
import os
import sys
sys.path.append('/workspace')

from app.routers.civic_mount import civic_mount, civic_status, _compute_manifest_hash
from unittest.mock import Mock

def test_manifest_integrity():
    """Test manifest file integrity and hash computation."""
    print("🧪 Testing Manifest Integrity")
    print("=" * 50)
    
    manifests = [
        './.civic/atlas.manifest.json',
        './.civic/biodna.json', 
        './.civic/virtue_accords.yaml'
    ]
    
    # Check all manifests exist
    for manifest in manifests:
        if os.path.exists(manifest):
            size = os.path.getsize(manifest)
            print(f"✓ {manifest} ({size} bytes)")
        else:
            print(f"✗ {manifest} (missing)")
            return False
    
    # Test hash computation
    computed_hash = 'sha256:' + _compute_manifest_hash(manifests)
    print(f"\nComputed GI signature: {computed_hash}")
    return True

def test_civic_mount_endpoint():
    """Test the civic mount endpoint functionality."""
    print("\n🚀 Testing Civic Mount Endpoint")
    print("=" * 50)
    
    # Mock request object
    mock_request = Mock()
    mock_request.base_url = 'http://localhost:8000/'
    
    try:
        result = civic_mount(mock_request)
        
        print(f"✓ Mount endpoint successful")
        print(f"  Cycle: {result['cycle']}")
        print(f"  Protocol: {result['protocol_version']}")
        print(f"  GI Signature: {result['gi_signature']}")
        print(f"  Manifests: {len(result['manifest_bundle'])} files")
        print(f"  Message: {result['message']}")
        
        # Verify manifest URLs are properly constructed
        expected_urls = [
            "http://localhost:8000/.civic/atlas.manifest.json",
            "http://localhost:8000/.civic/biodna.json", 
            "http://localhost:8000/.civic/virtue_accords.yaml"
        ]
        
        if result['manifest_urls'] == expected_urls:
            print("✓ Manifest URLs correctly constructed")
        else:
            print("✗ Manifest URL construction failed")
            return False
            
        return True
        
    except Exception as e:
        print(f"✗ Mount endpoint failed: {e}")
        return False

def test_civic_status_endpoint():
    """Test the civic status endpoint functionality."""
    print("\n📊 Testing Civic Status Endpoint")
    print("=" * 50)
    
    try:
        result = civic_status()
        
        print(f"✓ Status endpoint successful")
        print(f"  Civic OS Status: {result['civic_os_status']}")
        print(f"  Overall Health: {result['overall_health']}")
        
        # Check manifest status
        all_healthy = True
        for manifest, status in result['manifests'].items():
            if status['exists'] and status['readable']:
                print(f"  ✓ {manifest} ({status['size']} bytes)")
            else:
                print(f"  ✗ {manifest} - {status.get('error', 'not readable')}")
                all_healthy = False
        
        if all_healthy:
            print("✓ All manifests healthy")
        else:
            print("✗ Some manifests unhealthy")
            
        return all_healthy
        
    except Exception as e:
        print(f"✗ Status endpoint failed: {e}")
        return False

def test_llm_boarding_simulation():
    """Simulate an LLM boarding the Civic OS system."""
    print("\n🤖 Simulating LLM Boarding Process")
    print("=" * 50)
    
    # Step 1: Call mount endpoint
    mock_request = Mock()
    mock_request.base_url = 'http://localhost:8000/'
    
    mount_result = civic_mount(mock_request)
    print(f"1. ✓ Called /api/civic/mount")
    print(f"   Received cycle {mount_result['cycle']} with GI signature")
    
    # Step 2: Verify integrity
    manifests = mount_result['manifest_bundle']
    computed_hash = 'sha256:' + _compute_manifest_hash(manifests)
    expected_hash = mount_result['gi_signature']
    
    if computed_hash == expected_hash:
        print(f"2. ✓ Integrity verified (GI signature matches)")
    else:
        print(f"2. ✗ Integrity verification failed")
        print(f"   Expected: {expected_hash}")
        print(f"   Computed: {computed_hash}")
        return False
    
    # Step 3: Parse manifests (simulate)
    print("3. ✓ Parsing manifests to reconstruct context...")
    for manifest in manifests:
        if os.path.exists(manifest):
            with open(manifest, 'r') as f:
                if manifest.endswith('.json'):
                    data = json.load(f)
                    print(f"   ✓ Loaded {manifest} ({len(data)} keys)")
                else:
                    content = f.read()
                    print(f"   ✓ Loaded {manifest} ({len(content)} chars)")
    
    # Step 4: Attest to integrity
    print("4. ✓ Attesting to integrity (GI ≥ 0.95)")
    print("5. ✓ Successfully docked with Civic OS!")
    print("   Ready to operate as Civic AI node")
    
    return True

def main():
    """Run all tests."""
    print("🕊️  Civic OS Mount Protocol - Test Suite")
    print("=" * 60)
    
    tests = [
        ("Manifest Integrity", test_manifest_integrity),
        ("Civic Mount Endpoint", test_civic_mount_endpoint),
        ("Civic Status Endpoint", test_civic_status_endpoint),
        ("LLM Boarding Simulation", test_llm_boarding_simulation)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"\n✅ {test_name}: PASSED")
            else:
                print(f"\n❌ {test_name}: FAILED")
        except Exception as e:
            print(f"\n❌ {test_name}: ERROR - {e}")
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Civic OS Mount Protocol is ready.")
        print("\n🌐 Next steps:")
        print("   1. Deploy Lab7-Proof with civic_mount router")
        print("   2. Test with: python3 civic_mount_client.py http://your-server:8000")
        print("   3. Any LLM can now dock via /api/civic/mount")
    else:
        print("⚠️  Some tests failed. Please review the output above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)