from django.urls import path
from . import views

urlpatterns = [
    path("api/company/branch/create/", views.create_branch_api, name="create_branch_api"),
]