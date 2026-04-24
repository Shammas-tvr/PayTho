from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    class Roles(models.TextChoices):    
        SUPERADMIN = "SUPERADMIN", "Super Admin"
        COMPANY_ADMIN = "COMPANY_ADMIN", "Company Admin"
        MANAGER = "MANAGER", "Manager"
        STAFF = "STAFF", "Staff"
        CASHIER = "CASHIER", "Cashier"

    role=models.CharField(max_length=20,choices=Roles.choices,default=Roles.STAFF)
    company=models.ForeignKey("companies.Company",on_delete=models.CASCADE,null=True,blank=True,related_name="users")
    branch=models.ForeignKey("companies.Branch",on_delete=models.SET_NULL,null=True,blank=True,related_name="users")  


    def is_superadmin(self):
        return self.role==self.Roles.SUPERADMIN

    def is_company_admin(self):
        return self.role == self.Roles.COMPANY_ADMIN 
    
    def __str__(self):
        return f"{self.username}-{self.role}"