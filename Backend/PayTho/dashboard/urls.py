from django.urls import path
from . import views



urlpatterns = [
    # SUPERADMIN
    path("api/superadmin/dashboard/", views.superadmin_dashboard_api, name="superadmin_dashboard_api"),

    # COMPANY
    path("api/company/dashboard/", views.company_dashboard_api, name="company_dashboard_api"),
]