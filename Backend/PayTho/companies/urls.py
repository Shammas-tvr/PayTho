from django.urls import path 
from . import views

urlpatterns = [
    path("company/create/", views.create_company_api, name="create_company_api"),
    
]