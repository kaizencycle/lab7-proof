# app/utils/capsule_verify.py
"""
Capsule verification utilities for ATLAS integration
This is a placeholder implementation that would integrate with @civic/oaa-memory
"""

from typing import Dict, Any, List
import hashlib
import json
from datetime import datetime

def verify_capsule(capsule: Dict[str, Any], min_gi: float = 0.95, require_signers: List[str] = None) -> Dict[str, Any]:
    """
    Verify a .gic capsule according to ATLAS standards
    
    Args:
        capsule: The capsule data to verify
        min_gi: Minimum GI score threshold
        require_signers: List of required signers (optional)
    
    Returns:
        Dict with 'ok' boolean and 'errors' list
    """
    errors = []
    
    # Basic structure validation
    required_fields = ["id", "kind", "owner", "gi", "created"]
    for field in required_fields:
        if field not in capsule:
            errors.append(f"Missing required field: {field}")
    
    # ID format validation (should be sha256 hash)
    if "id" in capsule:
        if not capsule["id"].startswith("sha256:"):
            errors.append("ID must be in sha256: format")
        else:
            # Validate it's a proper sha256 hash
            hash_part = capsule["id"][7:]  # Remove "sha256:" prefix
            if len(hash_part) != 64 or not all(c in "0123456789abcdef" for c in hash_part.lower()):
                errors.append("ID must be a valid sha256 hash")
    
    # GI score validation
    if "gi" in capsule:
        try:
            gi_score = float(capsule["gi"])
            if gi_score < min_gi:
                errors.append(f"GI score {gi_score} below minimum {min_gi}")
            if gi_score > 1.0:
                errors.append("GI score cannot exceed 1.0")
        except (ValueError, TypeError):
            errors.append("Invalid GI score format")
    
    # Kind validation
    valid_kinds = ["memory", "attestation", "policy", "state", "organization"]
    if "kind" in capsule and capsule["kind"] not in valid_kinds:
        errors.append(f"Invalid kind: {capsule['kind']}. Must be one of {valid_kinds}")
    
    # Owner validation (should be a valid identifier)
    if "owner" in capsule:
        owner = capsule["owner"]
        if not isinstance(owner, str) or not owner.strip():
            errors.append("Owner must be a non-empty string")
        elif not owner.endswith(".gic"):
            errors.append("Owner must end with .gic")
    
    # Created timestamp validation
    if "created" in capsule:
        try:
            created_str = capsule["created"]
            if isinstance(created_str, str):
                # Try to parse ISO format
                datetime.fromisoformat(created_str.replace("Z", "+00:00"))
            else:
                errors.append("Created timestamp must be a string in ISO format")
        except (ValueError, TypeError):
            errors.append("Invalid created timestamp format")
    
    # Content validation (if present)
    if "content" in capsule:
        content = capsule["content"]
        if not isinstance(content, (dict, list)):
            errors.append("Content must be a dictionary or list")
    
    # Signature validation (if present)
    if "signature" in capsule:
        sig = capsule["signature"]
        if not isinstance(sig, str) or not sig.startswith("ed25519:"):
            errors.append("Signature must be in ed25519: format")
    
    # Merkle root validation (if present)
    if "merkle_root" in capsule:
        merkle = capsule["merkle_root"]
        if not isinstance(merkle, str) or not merkle.startswith("sha256:"):
            errors.append("Merkle root must be in sha256: format")
    
    # Schema version validation (if present)
    if "schema_version" in capsule:
        schema_ver = capsule["schema_version"]
        if not isinstance(schema_ver, str) or not schema_ver.startswith("v"):
            errors.append("Schema version must be a string starting with 'v'")
    
    return {
        "ok": len(errors) == 0,
        "errors": errors
    }

def generate_capsule_id(content: Dict[str, Any]) -> str:
    """
    Generate a sha256 ID for a capsule based on its content
    """
    # Create a canonical representation for hashing
    canonical = json.dumps(content, sort_keys=True, separators=(',', ':'))
    content_hash = hashlib.sha256(canonical.encode('utf-8')).hexdigest()
    return f"sha256:{content_hash}"

def validate_capsule_schema(capsule: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate capsule against the expected schema
    """
    errors = []
    
    # Check for unexpected fields
    expected_fields = {
        "id", "kind", "owner", "gi", "created", "content", 
        "signature", "merkle_root", "schema_version", "metadata"
    }
    
    for field in capsule.keys():
        if field not in expected_fields:
            errors.append(f"Unexpected field: {field}")
    
    return {
        "ok": len(errors) == 0,
        "errors": errors
    }