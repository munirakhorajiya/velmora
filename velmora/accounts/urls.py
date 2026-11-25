from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import(
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    AddressViewSet,
    ServiceProviderProfileView,
    ChangePasswordView,
    ExportUserDataView,
    DeleteAccountView
)

router=DefaultRouter()
router.register(r'addresses',AddressViewSet,basename='address')

urlpatterns=[
    path('register/',RegisterView.as_view(),name='account-register'),
    path('login/',LoginView.as_view(),name='account-login'),
    path('logout/',LogoutView.as_view(),name='account-logout'),
    path('profile/',ProfileView.as_view(),name='account-profile'),
    path('change-password/',ChangePasswordView.as_view(),name='account-change-password'),
    path('privacy/export/',ExportUserDataView.as_view(),name='account-export-data'),
    path('privacy/delete-account/',DeleteAccountView.as_view(),name='account-delete'),
    path('provider/profile/',ServiceProviderProfileView.as_view(),name='provider-profile'),
    path('',include(router.urls)),
]