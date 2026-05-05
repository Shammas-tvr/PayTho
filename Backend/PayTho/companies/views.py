from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import CustomUser
from companies.models import Company


# CREATE COMPANY
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_company_api(request):

    if request.user.role != CustomUser.Roles.SUPERADMIN:
        return Response({"error": "Not allowed"}, status=403)

    name = request.data.get("name")
    company_code = request.data.get("company_code")
    admin_username = request.data.get("admin_username")
    admin_password = request.data.get("admin_password")
    email=request.data.get("email")

    if Company.objects.filter(company_code=company_code).exists():
        return Response({"error": "Company code already exists"}, status=400)

    company = Company.objects.create(
        name=name,
        company_code=company_code
    )

    CustomUser.objects.create_user(
        username=admin_username,
        password=admin_password,
        email=email,
        role=CustomUser.Roles.COMPANY_ADMIN,
        company=company,
    
    )

    return Response({
        "message": "Company created successfully",
        "company": company.name
    })




# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def company_dashboard_api(request):

#     user = request.user

#     if not user.company:
#         return Response({"error":"No company assigned"},status=403)
    
#     company = user.company

#     total_user = CustomUser.objects.filter(company=company).count()
#     active_user = CustomUser.objects.filter(company=company, is_active=True).count()

#     recent_users = CustomUser.objects.filter(company = company).order_by("-date_joined")[:5]

#     recent_user_data = [
#         {
#             "username" : u.username,
#             "email" : u.email,
#             "joined" : u.date_joined
#         }
#         for u in recent_users
#     ]

#     return Response({
#         "company":{
#             "name":company.name,
#             "code" : company.company_code,
#         },
#         "stats" :{
#             "total_users" : total_user,
#              "acitve_users": active_user,
#         },
#         "recent_users" : recent_user_data
#     })
