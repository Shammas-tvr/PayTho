from django.contrib import admin
from .models import Company,Branch

# Register your models here.
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display=("name","company_code","is_active","created_at")
    search_fields=("name","company_code")
    list_filter=("is_active",)


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display=("name","company","is_active","created_at")
    list_filter=("company","is_active")
    search_fields=("name",)

