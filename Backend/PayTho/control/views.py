from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login
from accounts.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from company.models import Company,Branch




@login_required
def superadmin_dashboard(request):
    if request.user.role != CustomUser.Roles.SUPERADMIN:
        return redirect("superadmin_login")
    
    return render(request,"superadmin_dashboard.html")



@login_required
def create_company(request):

    if request.user.role != CustomUser.Roles.SUPERADMIN:
        return HttpResponseForbidden("Not allowed")
    
    if request.method == "POST":
        name = request.POST.get("name")
        company_code = request.POST.get("company_code")
        admin_username = request.POST.get("admin_username")
        admin_password=request.POST.get("admin_password")

        if Company.objects.filter(company_code=company_code).exists():
            return render(request,"create_company.html",{
                "error":"company code already exists"
            })
        
        company=Company.objects.create(
            name=name,
            company_code=company_code
        )

        CustomUser.objects.create_user(
            username=admin_username,
            password=admin_password,
            role=CustomUser.Roles.COMPANY_ADMIN,
            company=company
        )

        return redirect("superadmin_dashboard")
    
    return render(request,"create_company.html")

@login_required
def company_dashboard(request):
    #Allow only company_admin and manager
    if request.user.role not in [
        CustomUser.Roles.COMPANY_ADMIN,
        CustomUser.Roles.MANAGER
    ]:
        return HttpResponseForbidden("Not allowed")
    
    context={
        "company":request.user.company,
        "user":request.user,
    }
    
    return render(request,"company_dashboard.html",context)


@login_required
def create_branch(request):

    #the branch creation only allowed company_admin 
    if request.user.role != CustomUser.Roles.COMPANY_ADMIN:
        return HttpResponseForbidden("only company Admin can create the Branches")
    
    if request.method == "POST":
        name=request.POST.get("name")
        location=request.POST.get("location")

        Branch.objects.create(company=request.user.company,name=name,location=location)

        return redirect("company_dashboard")
    
    return render(request,"create_branch.html")



@login_required
def create_staff(request):
    if request.user.role != CustomUser.Roles.COMPANY_ADMIN:
        return HttpResponseForbidden("Not allowed")
    
    company=request.user.company
    branches=Branch.objects.filter(company=company)

    if request.method == "POST":
        username=request.POST.get("username")
        password=request.POST.get("possword")
        role=request.POST.get("role")
        branch_id=request.POST.get("branch")

        #validate role
        if role not in [
            CustomUser.Roles.MANAGER,
            CustomUser.Roles.STAFF,
            CustomUser.Roles.CASHIER,
        ]:
            return render(request,"create_staff.html",{
                "error":"invalid role selected",
                "branches":branches
            })
        try:
            branch=Branch.objects.get(id=branch_id,company=company)
        except Branch.DoesNotExist:
            return render(request,"create_staff.html",{
                "error":"invalid branch",
                "branches":branches
            })    
        
        CustomUser.objects.create_user(
            username=username,
            password=password,
            role=role,
            company=company,
            branch=branch
        )
        return redirect("company_dashboard")
    
    return render(request,"create_staff.html",{
        "branches":branches
    })
        



