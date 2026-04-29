from django.urls import path 
from . import views

urlpatterns = [
    path("api/company/login/",views.company_login_api,name="login"),
    path("superadmin-login/",views.superadmin_login_api,name="superadmin_login"),
    path("company-users-login/",views.company_users_login_api,name="company_users_login"),    
    #user login or logout 
    path("check-auth/", views.check_auth_api),
]