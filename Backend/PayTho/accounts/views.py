from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username,password=password)

    if not user:
        return Response(
            {'error':'invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['company_id'] = user.company_id
    refresh['branch_id'] = user.branch_id

    return Response({
        'access' : str(refresh.access_token),
        'refresh' : str(refresh),
        'role' : user.role,
        'username' : user.username,
        'company_id' : user.company_id,
        'branch_id' : user.branch_id,
    })
