from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import CustomUser
from companies.models import Branch





# CREATE BRANCH
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_branch_api(request):

    if request.user.role != CustomUser.Roles.COMPANY_ADMIN:
        return Response({"error": "Only company admin can create branches"}, status=403)

    name = request.data.get("name")
    location = request.data.get("location")

    branch = Branch.objects.create(
        company=request.user.company,
        name=name,
        location=location
    )

    return Response({
        "message": "Branch created successfully",
        "branch": branch.name
    })


