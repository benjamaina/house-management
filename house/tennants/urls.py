from django.urls import path
from .views import mpesa_payment, mpesa_payment_notification,TenantListView,HouseDetailView

urlpatterns = [
    path('mpesa/payment/', mpesa_payment, name='mpesa_payment'),
    path('mpesa/notification/', mpesa_payment_notification, name='mpesa_payment_notification'),
    path('tennants/', TenantListView.as_view(), name = 'tennant-list'),
    path('houses/<int:pk>/', HouseDetailView.as_view(), name = 'house-detail'),
    path('tennants/<int:pk>/', TenantListView.as_view, name ='tennants-list')
    
]
