from django.urls import path
from .views import TennantList, TennantDetail, HouseList

urlpatterns = [
    path('tennants/', TennantList.as_view(), name='tennant-list'),
    path('tennants/<int:pk>/', TennantDetail.as_view(), name='tennant-detail'),
    path('houses/', HouseList.as_view(), name='house-list'),
]