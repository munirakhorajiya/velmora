from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import(
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    AddressViewSet,
    ServiceProviderProfileView
)

router=DefaultRouter()
router.register(r'addresses',AddressViewSet,basename='address')

urlpatterns=[
    path('register/',RegisterView.as_view(),name='account-register'),
    path('login/',LoginView.as_view(),name='account-login'),
    path('logout/',LogoutView.as_view(),name='account-logout'),
    path('profile/',ProfileView.as_view(),name='account-profile'),
    path('provider/profile/',ServiceProviderProfileView.as_view(),name='provider-profile'),
    path('',include(router.urls)),
]