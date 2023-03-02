#!/usr/bin/env python3

import argparse
import hashlib
import json
from base64 import b32encode, b64decode, urlsafe_b64decode

import qrcode
from Crypto.Cipher import AES
from Crypto.Util import Padding
from PIL import Image
from pyzbar import pyzbar

parser = argparse.ArgumentParser()
parser.add_argument("filename", metavar="FILE", help="a QR code image")
args = parser.parse_args()

image = Image.open(args.filename)
data = pyzbar.decode(image)[0].data
ct = urlsafe_b64decode(data)

# https://kauth.kaist.ac.kr:21443/restAPI/appConfig
key = b64decode("WnB2NmhMeXVMeU01V05hMA==")
cipher = AES.new(key, AES.MODE_CBC, iv=key)
pt = Padding.unpad(cipher.decrypt(ct), 128)
data = json.loads(pt)

h = hashlib.sha256()
h.update(data["userId"].encode())
h.update(data["otpPin"].encode())

secret = b32encode(h.digest()).decode()
uri = f"otpauth://totp/KAIST?secret={secret}&algorithm=SHA512&period=60"

qr = qrcode.QRCode()
qr.add_data(uri)
qr.print_ascii(invert=True)
print(h.hexdigest())
