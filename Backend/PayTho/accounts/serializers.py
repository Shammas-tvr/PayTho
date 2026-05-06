from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    login_type = serializers.ChoiceField(choices=['superadmin','admin','staff','branch'],required=True)

    password = serializers.CharField(write_only=True,required=True)

    # admin fields
    email = serializers.EmailField(required=False)

    # company fields
    username = serializers.CharField(required=False)
    company_code = serializers.CharField(required=False)

    # branch fields
    branch_code = serializers.CharField(required=False)

    def validate(self, data):
        lt = data.get('login_type')

        if lt in ['suepradmin','admin']:
            if not data.get('email'):
                raise serializers.ValidationError({"email":"Email is required for admin login"})
            elif lt == 'staff':
                if not data.get('company_code') or not data.get('username'):
                    raise serializers.ValidationError({"error":"Company code and Username is required"})
                
            elif lt == 'branch':    
                if not all([data.get('company_code'),data.get('branch_code'),data.get('username')]):
                    raise serializers.ValidationError({"error":"Company code, branch code and username are required."})
                

        return data    
