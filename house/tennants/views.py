
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics
from .models import Tennant, House, RentPayment
from .serializers import TennantSerializer, HouseSerializer
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
import logging
from rest_framework import serializers


# Create your views here.
logger = logging.getLogger(__name__)

class TennantList(generics.ListCreateAPIView):
    """
    TennantList is a view for listing and creating Tennant instances.
    Attributes:
        queryset (QuerySet): The queryset of Tennant objects.
        serializer_class (Serializer): The serializer class for Tennant objects.
        permission_classes (list): The list of permission classes.
        filter_backends (list): The list of filter backends.
        filterset_fields (list): The list of fields to filter by.
        ordering_fields (list): The list of fields to order by.
    Methods:
        perform_create(serializer):
            Validates and saves a new Tennant instance.
            Args:
                serializer (Serializer): The serializer instance containing validated data.
            Raises:
                serializers.ValidationError: If the house is full.
        get(request, *args, **kwargs):
            Handles GET requests.
            Args:
                request (Request): The request instance.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.
            Returns:
                Response: A response with a greeting message.
    """
    queryset = Tennant.objects.all()
    serializer_class = TennantSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_active', 'house', 'name']
    ordering_fields = ['name', 'created_at']
    

    def perform_create(self, serializer):
        house = serializer.validated_data['house']
        if house.tennants.count() >= house.flat_building.number_of_houses:
            logger.error('House is full')
            raise serializers.ValidationError('House is full')
        serializer.save()

    def get(self, request, *args, **kwargs):
        print(f"authenticated user: {request.user}")
        return Response('Hello World')
class TennantDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tennant.objects.all()
    serializer_class = TennantSerializer
    permission_classes = [IsAuthenticated]
    

class HouseList(generics.ListCreateAPIView):
    queryset = House.objects.all()
    serializer_class = HouseSerializer
    permission_classes = [IsAuthenticated]
    
