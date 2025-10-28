# app/utils/security.py
"""
Security utilities for ATLAS integration
Handles GI gate and Shield headers validation
"""

from typing import Optional, Tuple
from fastapi import HTTPException, Header
import base64
import hashlib
from ..crypto.ed25519 import ed25519_verify, canonical_json

def verify_gi_score(x_gi_score: Optional[str] = Header(None), min_threshold: float = 0.95) -> float:
    """
    Verify GI score header meets minimum threshold
    
    Args:
        x_gi_score: The X-GI-Score header value
        min_threshold: Minimum acceptable GI score
    
    Returns:
        The verified GI score
    
    Raises:
        HTTPException: If GI score is invalid or below threshold
    """
    if not x_gi_score:
        raise HTTPException(status_code=400, detail="X-GI-Score header required")
    
    try:
        gi_score = float(x_gi_score)
        if gi_score < min_threshold:
            raise HTTPException(
                status_code=403, 
                detail=f"GI score {gi_score} below threshold {min_threshold}"
            )
        if gi_score > 1.0:
            raise HTTPException(
                status_code=400,
                detail="GI score cannot exceed 1.0"
            )
        return gi_score
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid X-GI-Score format")

def verify_signature_headers(
    x_sig: Optional[str] = Header(None),
    x_key_id: Optional[str] = Header(None)
) -> Tuple[str, str]:
    """
    Verify signature headers are present and properly formatted
    
    Args:
        x_sig: The X-Sig header value
        x_key_id: The X-Key-Id header value
    
    Returns:
        Tuple of (signature, key_id)
    
    Raises:
        HTTPException: If headers are missing or malformed
    """
    if not x_sig:
        raise HTTPException(status_code=400, detail="X-Sig header required")
    if not x_key_id:
        raise HTTPException(status_code=400, detail="X-Key-Id header required")
    
    # Validate signature format
    if not x_sig.startswith("ed25519:"):
        raise HTTPException(status_code=400, detail="X-Sig must be in ed25519: format")
    
    # Validate key ID format (should be DID)
    if not x_key_id.startswith("did:web:"):
        raise HTTPException(status_code=400, detail="X-Key-Id must be a DID in did:web: format")
    
    return x_sig, x_key_id

def verify_request_signature(
    request_body: dict,
    signature: str,
    key_id: str,
    public_key_b64: str
) -> bool:
    """
    Verify the Ed25519 signature of a request
    
    Args:
        request_body: The request body as a dictionary
        signature: The signature in ed25519: format
        key_id: The key ID (DID)
        public_key_b64: The public key in base64
    
    Returns:
        True if signature is valid, False otherwise
    """
    try:
        # Extract signature from ed25519: prefix
        sig_b64 = signature.split(":", 1)[1]
        
        # Create canonical JSON representation
        canonical = canonical_json(request_body)
        
        # Verify signature
        return ed25519_verify(public_key_b64, canonical, sig_b64)
    except Exception:
        return False

def validate_shield_headers(
    x_gi_score: Optional[str] = Header(None),
    x_sig: Optional[str] = Header(None),
    x_key_id: Optional[str] = Header(None),
    min_gi: float = 0.95
) -> Tuple[float, str, str]:
    """
    Validate all Shield headers required for ATLAS operations
    
    Args:
        x_gi_score: The X-GI-Score header
        x_sig: The X-Sig header
        x_key_id: The X-Key-Id header
        min_gi: Minimum GI score threshold
    
    Returns:
        Tuple of (gi_score, signature, key_id)
    
    Raises:
        HTTPException: If any validation fails
    """
    gi_score = verify_gi_score(x_gi_score, min_gi)
    signature, key_id = verify_signature_headers(x_sig, x_key_id)
    
    return gi_score, signature, key_id

def check_tool_permissions(key_id: str, tool_name: str) -> bool:
    """
    Check if the key is authorized to use the specified tool
    
    Args:
        key_id: The DID of the requesting key
        tool_name: The name of the tool being used
    
    Returns:
        True if authorized, False otherwise
    """
    # TODO: Implement actual tool permission checking
    # This would integrate with the Shield policy system
    # For now, allow all authenticated requests
    return True

def log_security_event(
    event_type: str,
    key_id: str,
    gi_score: float,
    success: bool,
    details: dict = None
) -> None:
    """
    Log a security event for audit purposes
    
    Args:
        event_type: Type of security event
        key_id: The DID of the requesting key
        gi_score: The GI score of the request
        success: Whether the operation succeeded
        details: Additional details to log
    """
    # TODO: Implement actual logging to ledger
    # This would write to the Civic Ledger via Civic-Protocol-Core
    print(f"Security Event: {event_type} - Key: {key_id} - GI: {gi_score} - Success: {success}")
    if details:
        print(f"Details: {details}")