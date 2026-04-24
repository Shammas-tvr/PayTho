from django.urls import path 
from . import views

urlpatterns = [
    path("api/company/staff/create/", views.create_staff_api, name="create_staff_api"),
]