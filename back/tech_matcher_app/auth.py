from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from google.auth.exceptions import GoogleAuthError, TransportError
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount


class GoogleLogin(APIView):
    """
    Authenticate a Google Identity Services credential (Google ID token)
    and exchange it for TechMatcher's own JWT access/refresh tokens.
    """

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        credential = request.data.get("id_token")
        if not isinstance(credential, str) or not credential.strip():
            return Response(
                {"detail": "Не передан Google ID token (id_token)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_id = settings.GOOGLE_CLIENT_ID.strip()
        if not client_id:
            return Response(
                {"detail": "Google authentication is not configured on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            claims = id_token.verify_oauth2_token(
                credential,
                GoogleRequest(),
                audience=client_id,
            )
        except (ValueError, GoogleAuthError, TransportError):
            return Response(
                {"detail": "Недействительный или просроченный Google ID token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # verify_oauth2_token validates signature, issuer, expiry and audience.
        # Require a verified email before using it to locate/link a local account.
        email = claims.get("email", "")
        google_uid = claims.get("sub", "")
        if (
            not isinstance(email, str)
            or not email.strip()
            or claims.get("email_verified") is not True
            or not isinstance(google_uid, str)
            or not google_uid
        ):
            return Response(
                {"detail": "Google не подтвердил адрес электронной почты аккаунта."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = email.strip().lower()
        User = get_user_model()
        def claim_text(key):
            value = claims.get(key, "")
            return value.strip() if isinstance(value, str) else ""

        full_name = claim_text("name")
        given_name = claim_text("given_name")
        family_name = claim_text("family_name")
        if not given_name and full_name:
            parts = full_name.split(maxsplit=1)
            given_name = parts[0]
            if not family_name and len(parts) > 1:
                family_name = parts[1]

        # CustomUser requires first_name and last_name. Google may omit either,
        # so use non-empty fallbacks and let the user edit their profile later.
        given_name = (given_name or "Google user")[:50]
        family_name = (family_name or "User")[:50]

        try:
            with transaction.atomic():
                social_account = (
                    SocialAccount.objects.select_related("user")
                    .filter(provider="google", uid=google_uid)
                    .first()
                )
                if social_account:
                    user = social_account.user
                    if not user.is_active:
                        return Response(
                            {"detail": "Аккаунт пользователя отключён."},
                            status=status.HTTP_403_FORBIDDEN,
                        )
                else:
                    user = User.objects.filter(email__iexact=email).first()
                    if user is None:
                        user = User.objects.create_user(
                            email=email,
                            password=None,
                            first_name=given_name,
                            last_name=family_name,
                        )

                    if not user.is_active:
                        return Response(
                            {"detail": "Аккаунт пользователя отключён."},
                            status=status.HTTP_403_FORBIDDEN,
                        )

                    SocialAccount.objects.create(
                        user=user,
                        provider="google",
                        uid=google_uid,
                        extra_data=dict(claims),
                    )
        except IntegrityError:
            # Handles concurrent first-time logins without exposing DB details.
            return Response(
                {"detail": "Не удалось связать Google-аккаунт. Попробуйте ещё раз."},
                status=status.HTTP_409_CONFLICT,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )
