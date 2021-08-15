#!/usr/bin/env python3
# https://github.com/googleworkspace/python-samples/blob/master/gmail/quickstart/quickstart.py

from __future__ import print_function

import base64
import os.path
import re
from http.server import BaseHTTPRequestHandler, HTTPServer

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
PORT = 8080


def main():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=PORT)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('gmail', 'v1', credentials=creds)

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            messages = service.users().messages()
            results = messages.list(userId='me',
                                    q='from:iamps@kaist.ac.kr',
                                    includeSpamTrash=True).execute()

            auth_codes = []
            for m in results.get('messages', []):
                message = messages.get(userId='me', id=m['id'],
                                       format='raw').execute()
                raw = base64.urlsafe_b64decode(message['raw'])
                pattern = br'sendValue2">(\d{6})'
                code = re.search(pattern, raw).group(1)
                if code:
                    auth_codes.append((int(message['internalDate']), code))
            auth_codes.sort(reverse=True)
            auth_codes.append((0, b'000000'))

            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(auth_codes[0][1])
            self.wfile.write(b' ')
            self.wfile.write(str(auth_codes[0][0]).encode())

    httpd = HTTPServer(('', PORT), Handler)
    httpd.serve_forever()


if __name__ == '__main__':
    main()
