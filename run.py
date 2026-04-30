#!/usr/bin/env python3

"""
Simple HTTP Server for Tachistoscope Lab
Serves the application with CORS headers enabled
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), format % args))

def main():
    PORT = 8000
    
    # Change to script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    Handler = CORSRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🚀 Tachistoscope Lab Server Started")
            print(f"📍 Serving on http://localhost:{PORT}")
            print(f"📂 Directory: {os.getcwd()}")
            print(f"⌨️  Press Ctrl+C to stop\n")
            
            # Check if lib files exist
            lib_files = ['lib/three.min.js', 'lib/chart.min.js']
            missing_files = [f for f in lib_files if not os.path.exists(f)]
            
            if missing_files:
                print("⚠️  Missing library files:")
                for f in missing_files:
                    print(f"   - {f}")
                print("\n   Run: bash setup.sh")
                print("   Or download manually from the documentation\n")
            else:
                print("✓ All libraries found\n")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use")
            print(f"   Try a different port: python3 run.py 8001")
            sys.exit(1)
        else:
            print(f"❌ Error: {e}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}")
            sys.exit(1)
    main()
