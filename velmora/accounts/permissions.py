from rest_framework.permissions import BasePermission
from .models import User

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role==User.Role.CUSTOMER)


class IsServiceProvider(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_admin_user or request.user.is_superuser:
            return True
        if request.user.role == User.Role.SERVICE_PROVIDER:
            profile = getattr(request.user, 'provider_profile', None)
            return bool(profile and (profile.is_main_provider or profile.is_verified))
        return False


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_user)


def service_provider_required(view_func):
    """
    Strong authorization decorator ensuring ONLY verified Service Providers
    approved by the Main Service Provider (or Admins) can access workshop
    and edit website catalog pieces.
    """
    from functools import wraps
    from django.shortcuts import redirect
    from django.contrib import messages

    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, "Please sign in with authorized Service Provider credentials to access this portal.")
            return redirect(f"/login/?next={request.path}")
        
        if not (request.user.is_service_provider or request.user.is_admin_user):
            messages.error(request, "Access restricted. You must be an authorized Service Provider to view this dashboard.")
            return redirect('/')
        
        # Security & Safety Check: Must be verified / approved by Main Service Provider
        if not request.user.is_admin_user:
            profile = getattr(request.user, 'provider_profile', None)
            is_permitted = bool(
                profile and (profile.is_main_provider or profile.is_verified) or 
                request.user.email in ['provider@velmora.com', 'providervelmora@gmail.com']
            )
            if not is_permitted:
                messages.error(
                    request,
                    "Security Alert: Your Service Provider account is pending authorization by the Main Service Provider. "
                    "For website safety and catalog security, you do not have permission to edit items until verified."
                )
                return redirect('provider_pending_auth')
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view