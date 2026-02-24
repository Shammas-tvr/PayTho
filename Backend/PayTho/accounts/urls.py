from django.urls import path 
from . import views

urlpatterns = [
    path("",views.company_login,name="login"),
    path("superadmin/login/",views.superadmin_login,name="superadmin_login"),
    path("company/users/login",views.company_users_login,name="company_users_login"),    
]