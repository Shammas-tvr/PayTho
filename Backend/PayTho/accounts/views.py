from django.contrib.auth import authenticate,login 
from companies.models import Company
from accounts.models import CustomUser
from rest_framework_simplejwt.tokens  import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status



@api_view(["POST"])
def superadmin_login_api(request):

    username=request.data.get("username")
    password=request.data.get("password")

    user=authenticate(username=username,password=password)


    if user is not None and user.role == CustomUser.Roles.SUPERADMIN:

        refresh=RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username
        }, status=status.HTTP_200_OK)

    return Response(
        {"error": "invalid superadmin credentials"},
        status=status.HTTP_401_UNAUTHORIZED
    )

# checking user logged or log out 
@api_view(["GET"])
def check_auth_api(request):

    if request.user.is_authenticated:
        return Response({
            "authenticated": True,
            "username": request.user.username
        }, status=200)

    return Response({
        "authenticated": False
    }, status=401)
    


# Create your views here.
@api_view(["POST"])
def company_login_api(request):

    print("DATA:", request.data) 

    company_code = request.data.get("company_code")
    username = request.data.get("username")
    password = request.data.get("password")


    try:
        company = Company.objects.get(
            company_code=company_code,
            is_active=True
        )
    except Company.DoesNotExist:
        return Response(
            {"error":"invalid company code"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request,username=username,password=password)
    print("USER:", user)

    if (
        user is not None
        and user.company == company
        and user.is_active
    ):
        refresh=RefreshToken.for_user(user)

        return Response({
            "refresh":str(refresh),
            "access":str(refresh.access_token),
            "role":user.role,
            "company":user.company.name
        })
    
    return Response(
        {"error":"invalid credentials"},
        status=status.HTTP_401_UNAUTHORIZED
    )
        





#company users authendication 
@api_view(["POST"])
def company_users_login_api(request):

    company_code=request.data.get("company_code")
    username=request.data.get("username")
    password=request.data.get("password")

    try:
        company=Company.objects.get(company_code=company_code,is_active=True)
    except Company.DoesNotExist:
        return Response(
            {"error":"Invalid company code"},
            status=status.HTTP_400_BAD_REQUEST
        )    
    user=authenticate(request,username=username,password=password)

    if (
        user is not None
        and user.company == company 
        and user.role != CustomUser.Roles.SUPERADMIN
        and user.is_active
    ):
        login(request,user)

        if user.role in [
            CustomUser.Roles.COMPANY_ADMIN,
            CustomUser.Roles.MANAGER
        ]:
            dasboard="company_dashboard"
        elif  user.role in [
            CustomUser.Roles.STAFF,
            CustomUser.Roles.CASHIER
        ]:
            dasboard="unknown"

        return Response(
            {
                "message":"Login Successful",
                "username":user.username,
                "role":user.role,
                "redirect":dasboard
            },
            status=status.HTTP_200_OK
        )        
    return Response(
        {"error":"invalid credentials"},
        status=status.HTTP_401_UNAUTHORIZED
    )


            

