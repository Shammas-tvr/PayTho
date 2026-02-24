from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login 
from company.models import Company
from accounts.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
# Create your views here.

# Create your views here.


def company_login(request):
    if request.method == "POST":
        company_code = request.POST.get("company_code")
        username = request.POST.get("username")
        password = request.POST.get("password")

        try:
            company = Company.objects.get(
                company_code=company_code,
                is_active=True
            )
        except Company.DoesNotExist:
            return render(request, "company_login.html", {
                "error": "Invalid company code"
            })

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if (
            user is not None
            and user.company == company
            and user.is_active
        ):
            login(request, user)
            return redirect("company_dashboard")

        return render(request, "company_login.html", {
            "error": "Invalid credentials"
        })

    return render(request, "company_login.html")  



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