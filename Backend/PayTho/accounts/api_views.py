
from django.contrib.auth import authenticate,login 
from company.models import Company
from accounts.models import CustomUser
from rest_framework_simplejwt.tokens  import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


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
def company_users_login(request):
    if request.method =="POST":
        company_code = request.POST.get("company_code")
        username=request.POST.get("username")
        password=request.POST.get("password")

        try:
            company=Company.objects.get(company_code=company_code,is_active=True)
        except Company.DoesNotExist:
            return render(request,"company_users_login.html",{
                "error":"invalid company code"
            })    
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
                return redirect("company_dashboard")
            
            elif user.role is [
                CustomUser.Roles.STAFF,
                CustomUser.Roles.CASHIER,
            ]:
                return redirect("billing_dashboard")
            
        return render(request,"company_users_login.html",{
            "error":"invalid credentials"
        })
    return render(request,"company_users_login.html")

            


def superadmin_login(request):
    if request.method == "POST":
        username=request.POST.get("username")
        password=request.POST.get("password")

        user=authenticate(request,username=username, password=password)
        print(user)

        if user is not None and user.role == CustomUser.Roles.SUPERADMIN:
            login(request,user)
            return redirect("superadmin_dashboard")
        
        return render(request,"superadmin_login.html",{
            "error":"invalid superadmin  credentials"
        })
    
    return render(request,"superadmin_login.html")