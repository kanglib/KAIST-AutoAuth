#!/usr/bin/env python3

import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from pprint import pprint

from imapclient import IMAPClient

from config import CRED, FOLDER, HOST, MAIL


def main():
    with IMAPClient(**MAIL) as client:
        client.login(*CRED)
        pprint(client.list_folders())

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            try:
                with IMAPClient(**MAIL) as client:
                    client.login(*CRED)
                    client.select_folder(FOLDER, readonly=True)

                    messages = client.search(['FROM', 'iamps@kaist.ac.kr'])
                    response = client.fetch(messages,
                                            ['INTERNALDATE', 'RFC822.TEXT'])
                    response = sorted(response.values(),
                                      key=lambda x: x[b'INTERNALDATE'])

                date = response[-1][b'INTERNALDATE'].timestamp()
                text = response[-1][b'RFC822.TEXT']
                pattern = br'sendValue2">(\d{6})'
                auth_code = re.search(pattern, text).group(1)
                if not auth_code:
                    raise
            except Exception:
                date = 0
                auth_code = b'000000'

            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(auth_code)
            self.wfile.write(b' ')
            self.wfile.write(str(int(date * 1000)).encode())

    httpd = HTTPServer(HOST, Handler)
    httpd.serve_forever()


if __name__ == '__main__':
    main()
