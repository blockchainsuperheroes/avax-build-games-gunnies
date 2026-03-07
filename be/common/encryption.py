from base64 import urlsafe_b64decode, urlsafe_b64encode

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from django.conf import settings


class AESCipher:
    def __init__(self, key=None, ivc=None):
        self.key = bytes(key, "utf-8") if key else bytes(settings.ENCRYPT_PASSWORD, "utf-8")
        self.ivc = bytes(ivc, "utf-8") if ivc else bytes(settings.ENCRYPT_INITVECTOR, "utf-8")
        self.cipher = Cipher(algorithms.AES(self.key), modes.CBC(self.ivc), backend=default_backend())
        self.padder = padding.PKCS7(128).padder()
        self.unpadder = padding.PKCS7(128).unpadder()

    def encrypt(self, raw):
        data = raw.encode("utf-8")
        data = self.padder.update(data) + self.padder.finalize()
        encryptor = self.cipher.encryptor()
        enc_text = encryptor.update(data) + encryptor.finalize()
        ct_out = urlsafe_b64encode(enc_text)
        return ct_out.decode("utf-8")

    def decrypt(self, enc):
        data = urlsafe_b64decode(enc)
        decryptor = self.cipher.decryptor()
        plain = decryptor.update(data) + decryptor.finalize()
        plain = self.unpadder.update(plain) + self.unpadder.finalize()
        return plain.decode("utf-8")


def encrypt_data(data, key=None, ivc=None):
    cipher = AESCipher(key=key, ivc=ivc)
    return cipher.encrypt(str(data))


def decrypt_data(data, key=None, ivc=None):
    cipher = AESCipher(key=key, ivc=ivc)
    return cipher.decrypt(str(data))
