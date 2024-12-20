from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import RegisterUserSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserCustom


class CustomUserCreate(APIView):
    

    def post(self,request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            user = reg_serializer.save()
            if user:
                return Response( {"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response({"error": "There was a problem with the registration.", "details": reg_serializer.errors},reg_serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class BlacklistTokenUpdateView(APIView):
   
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        user_data = UserCustom.objects.get(id=user.id)
        serializer = RegisterUserSerializer(user_data)
        return Response(serializer.data)