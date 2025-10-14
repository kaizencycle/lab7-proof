#!/usr/bin/env python3
"""
Lab7 Background Agent - "made lab7 edit"
Monitors lab7-edits folder and processes changes automatically
"""
import os
import sys
import time
import subprocess
from pathlib import Path
from datetime import datetime
import json

class Lab7BackgroundAgent:
    def __init__(self):
        self.edits_dir = Path("lab7-edits")
        self.agent_log = "logs/background_agent.jsonl"
        self.setup_logging()
        self.last_check = {}
        
    def setup_logging(self):
        """Setup agent logging"""
        os.makedirs("logs", exist_ok=True)
        if not os.path.exists(self.agent_log):
            with open(self.agent_log, "w", encoding='utf-8') as f:
                f.write("")
    
    def log_agent_action(self, action, details):
        """Log agent actions"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "agent": "lab7_background",
            "action": action,
            "details": details
        }
        with open(self.agent_log, "a", encoding='utf-8') as f:
            f.write(json.dumps(log_entry) + "\n")
    
    def check_for_changes(self):
        """Check if there are changes in lab7-edits"""
        changes_detected = False
        
        for version in ["v1", "v2", "v3"]:
            version_dir = self.edits_dir / version
            if not version_dir.exists():
                continue
                
            # Get current file count and modification times
            current_files = {}
            for file_path in version_dir.rglob("*"):
                if file_path.is_file():
                    current_files[str(file_path)] = file_path.stat().st_mtime
            
            # Compare with last check
            last_files = self.last_check.get(version, {})
            
            if current_files != last_files:
                changes_detected = True
                self.log_agent_action("changes_detected", {
                    "version": version,
                    "files_changed": len(current_files),
                    "previous_files": len(last_files)
                })
            
            self.last_check[version] = current_files
        
        return changes_detected
    
    def process_edits(self):
        """Process lab7 edits using the auto-merge script"""
        try:
            print("[AGENT] Processing lab7 edits...")
            self.log_agent_action("merge_triggered", {"reason": "changes_detected"})
            
            # Run the auto-merge script
            result = subprocess.run([
                sys.executable, 
                "scripts/auto_merge_edits.py"
            ], capture_output=True, text=True, cwd=Path.cwd())
            
            success = result.returncode == 0
            
            self.log_agent_action("merge_completed", {
                "success": success,
                "stdout": result.stdout,
                "stderr": result.stderr
            })
            
            if success:
                print("[AGENT] Successfully processed lab7 edits!")
                print("[AGENT] made lab7 edit - COMPLETE")
                # Ensure folders are empty after successful merge
                self.ensure_empty_folders()
            else:
                print(f"[AGENT] Error processing edits: {result.stderr}")
            
            return success
            
        except Exception as e:
            self.log_agent_action("merge_error", {"error": str(e)})
            print(f"[AGENT] Exception during processing: {e}")
            return False
    
    def ensure_empty_folders(self):
        """Ensure v1, v2, v3 folders are empty after merge"""
        edits_dir = Path("lab7-edits")
        for version in ["v1", "v2", "v3"]:
            version_dir = edits_dir / version
            version_dir.mkdir(exist_ok=True)
            # Clean any remaining files
            for item in version_dir.rglob("*"):
                if item.is_file():
                    item.unlink()
                elif item.is_dir() and not any(item.iterdir()):
                    item.rmdir()
        print("[AGENT] Ensured v1, v2, v3 folders are empty and ready for next edits")
    
    def run_continuous(self, check_interval=30):
        """Run the agent continuously"""
        print("[AGENT] Lab7 Background Agent Starting...")
        print("[AGENT] Monitoring lab7-edits folder...")
        print("[AGENT] Command prompt: 'made lab7 edit'")
        print(f"[AGENT] Check interval: {check_interval} seconds")
        print("[AGENT] Press Ctrl+C to stop")
        
        self.log_agent_action("agent_started", {
            "check_interval": check_interval,
            "command_prompt": "made lab7 edit"
        })
        
        try:
            while True:
                if self.check_for_changes():
                    print("[AGENT] Changes detected in lab7-edits!")
                    self.process_edits()
                else:
                    print(f"[AGENT] No changes detected. Next check in {check_interval}s...")
                
                time.sleep(check_interval)
                
        except KeyboardInterrupt:
            print("\n[AGENT] Shutting down gracefully...")
            self.log_agent_action("agent_stopped", {"reason": "user_interrupt"})
        except Exception as e:
            print(f"[AGENT] Unexpected error: {e}")
            self.log_agent_action("agent_error", {"error": str(e)})
    
    def run_once(self):
        """Run the agent once to process any pending changes"""
        print("[AGENT] Lab7 Background Agent - Single Run")
        print("[AGENT] Command prompt: 'made lab7 edit'")
        
        if self.check_for_changes():
            print("[AGENT] Changes detected, processing...")
            return self.process_edits()
        else:
            print("[AGENT] No changes detected")
            return True

def main():
    agent = Lab7BackgroundAgent()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--once":
        # Single run mode
        success = agent.run_once()
        sys.exit(0 if success else 1)
    else:
        # Continuous mode
        agent.run_continuous()

if __name__ == "__main__":
    main()
