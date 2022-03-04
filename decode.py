#!/usr/bin/env python3

import hashlib
import json
from base64 import b64decode, urlsafe_b64decode

from Crypto.Cipher import AES
from PIL import Image
from pyzbar import pyzbar as zb

ct = zb.decode(Image.open('qr.png'))[0].data
ct = urlsafe_b64decode(ct)

# https://kauth.kaist.ac.kr:21443/restAPI/appConfig
key = b64decode('WnB2NmhMeXVMeU01V05hMA==')
cipher = AES.new(key, AES.MODE_CBC, iv=key)

user = cipher.decrypt(ct)
user = user[:-user[-1]]
user = json.loads(user)

m = hashlib.sha256()
m.update(user['userId'].encode())
m.update(user['otpPin'].encode())
print(m.hexdigest())
