from django.contrib import admin
from .models import Company, Branch


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "company_code", "status", "branch_count", "created_at")
    search_fields = ("name", "company_code", "email")
    list_filter = ("status", "created_at")


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "branch_code", "status", "created_at")
    list_filter = ("company", "status")
    search_fields = ("name", "branch_code")