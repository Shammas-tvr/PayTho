from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import CustomUser
from companies.models import Branch






# CREATE STAFF
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_staff_api(request):

    if request.user.role != CustomUser.Roles.COMPANY_ADMIN:
        return Response({"error": "Not allowed"}, status=403)

    company = request.user.company

    username = request.data.get("username")
    password = request.data.get("password")
    role = request.data.get("role")
    branch_id = request.data.get("branch")

    if role not in [
        CustomUser.Roles.MANAGER,
        CustomUser.Roles.STAFF,
        CustomUser.Roles.CASHIER,
    ]:
        return Response({"error": "Invalid role selected"}, status=400)

    try:
        branch = Branch.objects.get(id=branch_id, company=company)
    except Branch.DoesNotExist:
        return Response({"error": "Invalid branch"}, status=400)

    CustomUser.objects.create_user(
        username=username,
        password=password,
        role=role,
        company=company,
        branch=branch
    )

    return Response({
        "message": "Staff created successfully"
    })