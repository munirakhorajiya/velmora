from rest_framework.permissions import BasePermission
from .models import User

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role==User.Role.CUSTOMER)


class IsServiceProvider(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.User.role==User.Role.SERVICE_PROVIDER or request.user.is_staff))


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_user)
    