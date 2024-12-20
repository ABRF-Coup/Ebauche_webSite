from django.urls import path
from .views import CustomUserCreate,BlacklistTokenUpdateView,UserProfileView


app_name='users'

urlpatterns = [
    path('register/',CustomUserCreate.as_view(),name='register'),
    path('logout/blacklist/',BlacklistTokenUpdateView.as_view(),name='blacklist'),
    path('profile/',UserProfileView.as_view(),name='profile')
]


