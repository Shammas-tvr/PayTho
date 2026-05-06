from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.

class CustomUser(AbstractUser):
    class Roles(models.TextChoices):    
        #---------------- Super Admin -------------
        SUPERADMIN = "SUPERADMIN", "Super Admin"

        #------------ Company Level -------------------
        COMPANY_ADMIN = "COMPANY_ADMIN", "Company Admin"
        HR_MANAGER = "HR_MANAGER", "HR Manager"
        FINANCE_MANAGER = "FINANCE_MANAGER", "Finance Manager"
        AUDITOR = "AUDITOR", "Auditor"

        #-------------Branch Level ---------------
        MANAGER = "MANAGER", "Branch Manager"
        STAFF = "STAFF", "Staff"
        CASHIER = "CASHIER", "Cashier"
        SALESMAN = "SALESMAN", "Salesman"

    role=models.CharField(max_length=20,choices=Roles.choices,default=Roles.STAFF)

    company=models.ForeignKey("companies.Company",on_delete=models.CASCADE,null=True,blank=True,related_name="users")

    branch=models.ForeignKey("companies.Branch",on_delete=models.SET_NULL,null=True,blank=True,related_name="users")  


    def is_superadmin(self):
        # developers and enginears
        return self.role==self.Roles.SUPERADMIN

    def is_company_level(self):
        # company level users
        company_roles = {
                    self.Roles.COMPANY_ADMIN,
                    self.Roles.HR_MANAGER,
                    self.Roles.FINANCE_MANAGER,
                    self.Roles.AUDITOR,
                }
        return self.role in company_roles
    

    def is_branch_level(self):
        # branch level users
        branch_role={
            self.Roles.MANAGER,
            self.Roles.STAFF,
            self.Roles.CASHIER,
            self.Roles.SALESMAN
        }
        return self.role in branch_role
    

    def can_manage_branch_users(self):
        # only company level users can manage the branches
        return self.is_company_level()
    
    def clean(self):
        if self.is_superadmin():
            if self.company is not None or self.branch is not None:
                raise ValidationError({'company':'Superadmin should nhot be linked to any company or branch'})
            
        elif self.is_company_level():
            if self.branch is not None:
                raise ValidationError({'branch':'Company level usrs cannot have a branch'})
            

            if self.company is None:
                raise ValidationError({'company':'Company level users must have a company'})  

        elif self.is_branch_level():
            if not self.company or not self.branch:
                raise ValidationError({'branch':'Branch users must have both company branch'})      



    def save(self,*args,**kwargs):
        self.full_clean()
        super().save(*args,**kwargs)



    def __str__(self):
        return f"{self.username}-{self.role}"