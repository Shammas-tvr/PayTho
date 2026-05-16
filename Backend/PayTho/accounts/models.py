from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


class CustomUser(AbstractUser):

    class Roles(models.TextChoices):

        # ---------------- Super Admin ----------------
        SUPERADMIN = "SUPERADMIN", "Super Admin"

        # ---------------- Company Level ----------------
        COMPANY_ADMIN = "COMPANY_ADMIN", "Company Admin"
        HR_MANAGER = "HR_MANAGER", "HR Manager"
        FINANCE_MANAGER = "FINANCE_MANAGER", "Finance Manager"
        AUDITOR = "AUDITOR", "Auditor"

        # ---------------- Branch Level ----------------
        MANAGER = "MANAGER", "Branch Manager"
        STAFF = "STAFF", "Staff"
        CASHIER = "CASHIER", "Cashier"
        SALESMAN = "SALESMAN", "Salesman"

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.STAFF)

    company = models.ForeignKey("companies.Company", on_delete=models.CASCADE, null=True, blank=True, related_name="users")

    branch = models.ForeignKey("companies.Branch", on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    # ================= SUPER ADMIN =================

    def is_superadmin(self):
        return self.is_superuser

    # ================= COMPANY LEVEL =================

    def is_company_level(self):

        company_roles = {
            self.Roles.COMPANY_ADMIN,
            self.Roles.HR_MANAGER,
            self.Roles.FINANCE_MANAGER,
            self.Roles.AUDITOR,
        }

        return self.role in company_roles

    # ================= BRANCH LEVEL =================

    def is_branch_level(self):

        branch_roles = {
            self.Roles.MANAGER,
            self.Roles.STAFF,
            self.Roles.CASHIER,
            self.Roles.SALESMAN,
        }

        return self.role in branch_roles

    # ================= PERMISSIONS =================

    def can_manage_branch_users(self):
        return self.is_company_level()

    # ================= VALIDATION =================

    def clean(self):

        # SUPERADMIN RULES
        if self.is_superuser:

            self.role = self.Roles.SUPERADMIN

            if self.company is not None or self.branch is not None:
                raise ValidationError({'company': 'Superadmin should not be linked to any company or branch'})

        # COMPANY LEVEL RULES
        elif self.is_company_level():

            if self.branch is not None:
                raise ValidationError({'branch': 'Company level users cannot have a branch'})

            if self.company is None:
                raise ValidationError({'company': 'Company level users must have a company'})

        # BRANCH LEVEL RULES
        elif self.is_branch_level():

            if not self.company or not self.branch:
                raise ValidationError({'branch': 'Branch users must have both company and branch'})

    # ================= SAVE =================

    def save(self, *args, **kwargs):

        if self.is_superuser:
            self.role = self.Roles.SUPERADMIN

        super().save(*args, **kwargs)

    # ================= STRING =================

    def __str__(self):
        return f"{self.username} - {self.role}"