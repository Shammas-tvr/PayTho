from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import CustomUser


# SUPERADMIN DASHBOARD
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def superadmin_dashboard_api(request):

    if request.user.role != CustomUser.Roles.SUPERADMIN:
        return Response({"error": "Not allowed"}, status=403)

    return Response({
        "message": "Welcome Superadmin",
        "username": request.user.username
    })


# COMPANY DASHBOARD
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def company_dashboard_api(request):

    if request.user.role not in [
        CustomUser.Roles.COMPANY_ADMIN,
        CustomUser.Roles.MANAGER
    ]:
        return Response({"error": "Not allowed"}, status=403)

    return Response({
        "company": request.user.company.name if request.user.company else None,
        "username": request.user.username,
        "role": request.user.role
    })
