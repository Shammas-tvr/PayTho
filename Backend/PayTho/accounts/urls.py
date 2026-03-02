from django.urls import path 
from . import api_views

urlpatterns = [
    path("api/company/login/",api_views.company_login_api,name="login"),
    path("superadmin/login/",api_views.superadmin_login,name="superadmin_login"),
    path("company/users/login",api_views.company_users_login,name="company_users_login"),    
]