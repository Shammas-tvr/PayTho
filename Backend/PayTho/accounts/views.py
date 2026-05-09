from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import CustomUser
from companies.models import Company, Branch
from .serializers import LoginSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):

    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    login_type = serializer.validated_data['login_type']
    password = serializer.validated_data['password']

    # ====================== AUTHENTICATION ======================
    if login_type == 'superadmin':
        user = _authenticate_superadmin(serializer.validated_data['email'], password)

    elif login_type == 'admin':
        user = _authenticate_company_admin(serializer.validated_data['email'], password)

    elif login_type == 'staff':
        user = _authenticate_staff(
            company_code=serializer.validated_data['company_code'],
            username=serializer.validated_data['username'],
            password=password
        )

    elif login_type == 'branch':
        user = _authenticate_branch(
            company_code=serializer.validated_data['company_code'],
            branch_code=serializer.validated_data['branch_code'],
            username=serializer.validated_data['username'],
            password=password
        )
    else:
        return Response({"error": "Invalid login_type"}, status=status.HTTP_400_BAD_REQUEST)

    if not user:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    # ====================== JWT TOKEN ======================
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['company_id'] = str(user.company_id) if user.company_id else None
    refresh['branch_id'] = str(user.branch_id) if user.branch_id else None

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'role': user.role,
        'username': user.username,
        'company_id': user.company_id,
        'branch_id': user.branch_id,
        'is_superadmin': user.is_superadmin(),
        'is_company_level': user.is_company_level(),
        'is_branch_level': user.is_branch_level(),
        'can_manage_branch_users': user.can_manage_branch_users(),
        'login_type': login_type,
    })


# ====================== AUTH HELPERS ======================

def _authenticate_superadmin(email: str, password: str):
    try:
        user = CustomUser.objects.get(
            email=email,
            role=CustomUser.Roles.SUPERADMIN,
            is_active=True
        )
    except CustomUser.DoesNotExist:
        return None
    return authenticate(username=user.username, password=password)


def _authenticate_company_admin(email: str, password: str):
    try:
        user = CustomUser.objects.get(email=email, is_active=True)
    except CustomUser.DoesNotExist:
        return None

    if user.is_superadmin():
        return None   # Superadmin cannot login as company admin

    if not user.is_company_level():
        return None

    return authenticate(username=user.username, password=password)


def _authenticate_staff(company_code: str, username: str, password: str):
    try:
        company = Company.objects.get(company_code=company_code)
    except Company.DoesNotExist:
        return None

    try:
        user = CustomUser.objects.get(
            username=username,
            company=company,
            branch__isnull=True,
            is_active=True
        )
    except CustomUser.DoesNotExist:
        return None

    if user.is_superadmin() or not user.is_company_level():
        return None

    return authenticate(username=user.username, password=password)


def _authenticate_branch(company_code: str, branch_code: str, username: str, password: str):
    try:
        company = Company.objects.get(company_code=company_code)
        branch = Branch.objects.get(company=company, branch_code=branch_code)
    except (Company.DoesNotExist, Branch.DoesNotExist):
        return None

    try:
        user = CustomUser.objects.get(
            username=username,
            company=company,
            branch=branch,
            is_active=True
        )
    except CustomUser.DoesNotExist:
        return None

    if not user.is_branch_level():
        return None

    return authenticate(username=user.username, password=password)