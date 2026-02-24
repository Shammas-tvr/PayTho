from django.shortcuts import render,redirect
from .models import Company
from django.contrib.auth import authenticate,login
from accounts.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
# Create your views here.

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




            
@login_required
def company_dashboard(request):

    if request.user.role not in [
        CustomUser.Roles.COMPANY_ADMIN,
        CustomUser.Roles.MANAGER
    ]:
        return HttpResponseForbidden("Not allowed")
    
    return render(request,"company_dashboard.html")