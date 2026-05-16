from django.urls import path
from . import views



urlpatterns = [
    # SUPERADMIN
    path("superadmin/", views.superadmin_dashboard_api, name="superadmin_dashboard_api"),

    # COMPANY
    path("company/", views.company_dashboard_api, name="company_dashboard_api"),
]