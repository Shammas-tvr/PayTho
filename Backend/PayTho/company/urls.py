from django.urls import path 
from . import views

urlpatterns = [
    path("company/dahsboard",views.company_dashboard,name="company_dashbaord"),
    path("company/users/login",views.company_users_login,name="company_users_login"),
    
]