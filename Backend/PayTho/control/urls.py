from django.urls import path 
from . import views

urlpatterns = [
    path("superadmin/dashboard/",views.superadmin_dashboard,name="superadmin_dashboard"),
    path("companies/create",views.create_company,name="create_company"),
    path("company/dahsboard",views.company_dashboard,name="company_dashboard"),
    path("company/branch/create",views.create_branch,name="create_branch"),
    path("company/staff/create",views.create_staff,name="create_staff"),
    
]