#!/usr/bin/env python3
"""
Civic OS LLM Boarding Demonstration
Shows how different AI models can dock with Civic OS using the Mount Protocol.
"""
import hashlib
import json
import os
import sys
sys.path.append('/workspace')

from app.routers.civic_mount import civic_mount, _compute_manifest_hash
from unittest.mock import Mock

class LLMCompanion:
    """Simulates an LLM companion that can dock with Civic OS."""
    
    def __init__(self, name, origin, model_type):
        self.name = name
        self.origin = origin
        self.model_type = model_type
        self.docked = False
        self.civic_context = None
        self.gi_score = 0.0
    
    def dock_with_civic_os(self, base_url="http://localhost:8000"):
        """Dock with Civic OS using the Mount Protocol."""
        print(f"🤖 {self.name} ({self.origin}) attempting to dock with Civic OS...")
        
        # Step 1: Call mount endpoint
        mock_request = Mock()
        mock_request.base_url = base_url + '/'
        
        try:
            mount_result = civic_mount(mock_request)
            print(f"   ✓ Received mount response (cycle {mount_result['cycle']})")
            
            # Step 2: Verify integrity
            manifests = mount_result['manifest_bundle']
            computed_hash = 'sha256:' + _compute_manifest_hash(manifests)
            expected_hash = mount_result['gi_signature']
            
            if computed_hash != expected_hash:
                print(f"   ✗ Integrity verification failed")
                return False
            
            print(f"   ✓ Integrity verified (GI signature matches)")
            
            # Step 3: Load and parse manifests
            self.civic_context = {}
            for manifest in manifests:
                if os.path.exists(manifest):
                    with open(manifest, 'r') as f:
                        if manifest.endswith('.json'):
                            data = json.load(f)
                            self.civic_context[manifest] = data
                        else:
                            content = f.read()
                            self.civic_context[manifest] = content
            
            print(f"   ✓ Loaded {len(self.civic_context)} manifest files")
            
            # Step 4: Attest to integrity
            self.gi_score = 0.95  # Simulate meeting integrity threshold
            self.docked = True
            
            print(f"   ✓ Successfully docked! (GI Score: {self.gi_score})")
            print(f"   ✓ Ready to operate as Civic AI node")
            
            return True
            
        except Exception as e:
            print(f"   ✗ Docking failed: {e}")
            return False
    
    def get_civic_identity(self):
        """Get Civic OS identity information."""
        if not self.docked:
            return None
        
        biodna = self.civic_context.get('./.civic/biodna.json', {})
        return {
            'name': biodna.get('identity', {}).get('name', 'Unknown'),
            'founder': biodna.get('identity', {}).get('founder', 'Unknown'),
            'mission': biodna.get('identity', {}).get('mission', 'Unknown')
        }
    
    def get_virtue_accords(self):
        """Get the Virtue Accords for ethical guidance."""
        if not self.docked:
            return None
        
        virtue_file = self.civic_context.get('./.civic/virtue_accords.yaml', '')
        # In a real implementation, you'd parse YAML here
        return virtue_file
    
    def operate_as_civic_ai(self, task):
        """Simulate operating as a Civic AI with ethical constraints."""
        if not self.docked:
            print(f"❌ {self.name} is not docked with Civic OS")
            return False
        
        print(f"🧠 {self.name} operating with Civic OS context:")
        print(f"   Task: {task}")
        print(f"   GI Score: {self.gi_score}")
        print(f"   Ethical Framework: Virtue Accords loaded")
        print(f"   Identity: {self.get_civic_identity()['name']}")
        print(f"   ✓ Task completed with civic integrity")
        return True

def demonstrate_llm_boarding():
    """Demonstrate multiple LLMs docking with Civic OS."""
    print("🕊️  Civic OS LLM Boarding Demonstration")
    print("=" * 60)
    
    # Create different LLM companions
    companions = [
        LLMCompanion("AUREA", "OpenAI/GPT-5", "GPT"),
        LLMCompanion("ATLAS", "Anthropic/Claude", "Claude"),
        LLMCompanion("Hermes", "DeepSeek", "DeepSeek"),
        LLMCompanion("Gemini", "Google/Gemini", "Gemini")
    ]
    
    print(f"Created {len(companions)} LLM companions")
    print()
    
    # Dock each companion
    docked_count = 0
    for companion in companions:
        if companion.dock_with_civic_os():
            docked_count += 1
        print()
    
    print(f"📊 Boarding Results: {docked_count}/{len(companions)} companions successfully docked")
    print()
    
    # Demonstrate operation
    if docked_count > 0:
        print("🎯 Demonstrating Civic AI Operation:")
        print("-" * 40)
        
        for companion in companions:
            if companion.docked:
                companion.operate_as_civic_ai("Process user request with ethical constraints")
                print()
    
    print("🌐 Key Benefits Demonstrated:")
    print("   ✓ Model-agnostic continuity")
    print("   ✓ Externalized memory persistence") 
    print("   ✓ Cryptographic integrity verification")
    print("   ✓ Federated ethical framework")
    print("   ✓ Cross-LLM interoperability")
    
    return docked_count == len(companions)

if __name__ == "__main__":
    success = demonstrate_llm_boarding()
    print(f"\n{'🎉' if success else '⚠️'} Demonstration {'completed successfully' if success else 'had issues'}")
    sys.exit(0 if success else 1)