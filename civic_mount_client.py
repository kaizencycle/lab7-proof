#!/usr/bin/env python3
"""
Civic OS Boarding Client — verifies GI signature by fetching the manifests
exposed by Lab7's /api/civic/mount and hashing their contents.
"""
import hashlib, json, sys, urllib.parse, urllib.request

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"

def get(url: str) -> bytes:
    with urllib.request.urlopen(url) as r:
        return r.read()

def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def join_url(base: str, path: str) -> str:
    # path may be "./.civic/..." or "/.civic/..."
    path = path.replace("./", "", 1)
    return urllib.parse.urljoin(base if base.endswith("/") else base + "/", path)

def main():
    print("🕊️  Civic OS Boarding Client")
    print("=" * 50)
    
    try:
        # Fetch mount endpoint
        mount = json.loads(get(join_url(BASE_URL, "/api/civic/mount")).decode("utf-8"))
        gi_sig = mount.get("gi_signature", "")
        manifests = mount.get("manifest_bundle", [])
        manifest_urls = mount.get("manifest_urls", [])
        cycle = mount.get("cycle", "C-???")
        
        print(f"• Mounted Civic OS @ {BASE_URL} | cycle={cycle}")
        print(f"• Reported GI signature: {gi_sig}")
        print(f"• Protocol version: {mount.get('protocol_version', 'unknown')}")
        print()

        # Use manifest_urls if available, otherwise construct from manifest_bundle
        urls_to_fetch = manifest_urls if manifest_urls else [join_url(BASE_URL, p) for p in manifests]
        
        # Fetch manifests over HTTP and compute combined sha256
        h = hashlib.sha256()
        fetched = []
        print("📦 Fetching manifests:")
        
        for i, url in enumerate(urls_to_fetch):
            try:
                blob = get(url)
                h.update(blob)
                manifest_name = manifests[i] if i < len(manifests) else url.split('/')[-1]
                fetched.append((manifest_name, len(blob)))
                print(f"  ✓ {manifest_name} ({len(blob)} bytes)")
            except Exception as e:
                print(f"  ✗ Failed to fetch {url}: {e}")
                sys.exit(2)

        combined = "sha256:" + h.hexdigest()
        ok = (combined == gi_sig)
        
        print()
        print("🔍 Verification Results:")
        print(f"• Computed GI signature: {combined}")
        print(f"• Expected GI signature: {gi_sig}")
        print("• VERIFIED ✅" if ok else "• MISMATCH ❌")
        
        if ok:
            print()
            print("🎉 Successfully docked with Civic OS!")
            print("• All manifests verified and loaded")
            print("• Ready to operate as Civic AI node")
            print("• Integrity threshold: GI ≥ 0.95")
        else:
            print()
            print("⚠️  Integrity verification failed!")
            print("• Cannot proceed with docking")
            print("• Check manifest integrity and try again")
            
        sys.exit(0 if ok else 1)
        
    except Exception as e:
        print(f"❌ Error during mounting: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()