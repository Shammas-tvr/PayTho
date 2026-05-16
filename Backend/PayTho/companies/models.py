from django.db import models
from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
import uuid


class Company(models.Model):
    name = models.CharField(max_length=255)
    email= models.EmailField(unique=True)
    company_code = models.CharField(max_length=50, unique=True, editable=False)
    phone = models.CharField(max_length=20,blank=True)
    address = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, 
        choices=[('Active', 'Active'), ('Inactive', 'Inactive')],
        default='Active'
    )
    branch_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.company_code})"
    

def save(self, *args, **kwargs):

    if not self.branch_code:

        # Company prefix
        company_prefix = self.company.name[:3].upper()

        # Branch prefix
        branch_prefix = self.name[:3].upper()

        code = f"{company_prefix}-{branch_prefix}"

        count = 1
        original_code = code


        while Branch.objects.filter(branch_code=code).exists():

            code = f"{original_code}-{count}"

            count += 1

        self.branch_code = code

    super().save(*args, **kwargs)




class Branch(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="branches"
    )
    name = models.CharField(max_length=255)
    branch_code = models.CharField(max_length=20,unique=True,editable=False)
    location = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(
        max_length=20, 
        choices=[('Active', 'Active'), ('Inactive', 'Inactive')],
        default='Active'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.company.name}"  
    
    def save(self,*args,**kwargs):

        if not self.branch_code:

            company_prefix = self.company.company_code.split('-')[0]

            while True:

                random_part = str(uuid.uuid4()).replace('-','')[:3].upper()

                code = f"{company_prefix}-BR-{random_part}"

                if not Branch.objects.filter(branch_code=code).exists():

                    self.branch_code = code
                    break
        super().save(*args,**kwargs)


# signals its used for "When Branch is saved,run increase_branch_count"

@receiver(post_save,sender=Branch)
def increase_branch_count(sender,instance,created,**kwargs):

    if created:
        company = instance.company

        company.branch_count +=1

        company.save()

@receiver(post_delete, sender=Branch)
def decrease_branch_count(sender, instance, **kwargs):
     company = instance.company 

     if company.branch_count > 0:
         company.branch_count -=1

         company.save()       