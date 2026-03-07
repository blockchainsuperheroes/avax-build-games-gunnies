import jwt
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework.permissions import BasePermission

from .models import User


class MyOwnTokenAuthentication(TokenAuthentication):
    def auth_fail_exc(self, msg):
        raise exceptions.AuthenticationFailed(msg)

    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b"bearer":
            return None

        if len(auth) == 1:
            msg = "Invalid token header. No credentials provided."
            self.auth_fail_exc(msg)

        elif len(auth) > 2:
            msg = "Invalid token header"
            self.auth_fail_exc(msg)

        try:
            token = auth[1]
            if token == "null":
                msg = "Null token not allowed"
                self.auth_fail_exc(msg)

        except UnicodeError:
            msg = "Invalid token header. Token string should not contain invalid characters."
            self.auth_fail_exc(msg)

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, key):
        try:
            payload = jwt.decode(key, settings.SECRET_KEY, algorithms="HS256")

            token_type = payload.get("type", None)

            if token_type != "access_token":
                msg = {"detail": "Token is invalid"}
                self.auth_fail_exc(msg)

            try:
                user_id = payload["id"]
                user = User.objects.get(id=user_id, is_deleted=False)
            except User.DoesNotExist:
                msg = {"detail": "User Not Found"}
                self.auth_fail_exc(msg)

        except jwt.ExpiredSignatureError:
            msg = {"detail": "Token Expired"}
            self.auth_fail_exc(msg)

        except (jwt.InvalidTokenError, jwt.DecodeError):
            msg = {"detail": "Token is invalid"}
            self.auth_fail_exc(msg)

        return (user, key)


# class EncryptedTokenAuthentication(MyOwnTokenAuthentication):
#     def auth_fail_exc(self, msg):
#         raise exceptions.AuthenticationFailed(msg)

#     def authenticate_credentials(self, key):
#         try:
#             payload = jwt.decode(key, settings.SECRET_KEY, algorithms="HS256")
#             token_type = payload.get("type", None)

#             if token_type != "match_session_token":
#                 msg = {"detail": "Token is invalid"}
#                 self.auth_fail_exc(msg)

#             secret_key = key[-32:]

#         except jwt.ExpiredSignatureError:
#             msg = {"detail": "Token Expired"}
#             self.auth_fail_exc(msg)

#         except (jwt.InvalidTokenError, jwt.DecodeError):
#             msg = {"detail": "Token is invalid"}
#             self.auth_fail_exc(msg)

#         return (None, secret_key)


class EncryptedTokenAuthentication(TokenAuthentication):
    def auth_fail_exc(self, msg):
        raise exceptions.AuthenticationFailed(msg)

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != b"bearer":
            return None

        if len(auth) == 1:
            self.auth_fail_exc("Invalid token header. No credentials provided")

        if len(auth) > 2:
            self.auth_fail_exc("Invalid token header")

        try:
            token = auth[1].decode()
        except UnicodeError:
            self.auth_fail_exc("Token contains invalid characters.")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            self.auth_fail_exc("Token Expired")
        except (jwt.InvalidTokenError, jwt.DecodeError):
            self.auth_fail_exc("Token is invalid")

        if payload.get("type") != "match_session_token":
            self.auth_fail_exc("Token is invalid")

        assignment_id = payload.get("assignment_id")
        if not assignment_id:
            self.auth_fail_exc("Token is invalid")

        request.assignment_id = assignment_id

        return (None, token)


class HasValidEncryptedToken(BasePermission):
    def has_permission(self, request, view):
        return request.auth is not None


class ApiKeyAuth(BasePermission):
    def has_permission(self, request, view):
        api_key_secret = request.META.get("HTTP_API_KEY")
        if not api_key_secret:
            return False
        return api_key_secret == settings.API_KEY_SECRET
