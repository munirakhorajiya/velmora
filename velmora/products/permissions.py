from rest_framework.permissions import BasePermission,SAFE_METHODS

class IsStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or getattr(request.user, 'role', '') in ['ADMIN', 'SERVICE_PROVIDER'] or request.user.is_superuser)
        )
    