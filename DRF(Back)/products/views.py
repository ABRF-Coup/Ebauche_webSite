from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import filters
from rest_framework.views import APIView
from .models import Product,Category
from .serializer import ProductSerializer,CategorySerializer,ProductSerializerNormale
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response


# Create your views here.

class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_object(self,queryset=None,**kwargs):
         item = self.kwargs.get('slug')
         return get_object_or_404(Product, slug=item)
    

class ProductFilter(generics.ListAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['slug']

class ProductFilterUser(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user  # Récupère l'utilisateur connecté
        return Product.objects.filter(author=user)  # Filtrer par l'ID de l'auteur (l'utilisateur connecté)



class CreateProduct(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]


    def post(self, request, format=None):
        print(request.data)
        serializer = ProductSerializerNormale(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AdminProductDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]  # Assurez-vous que l'utilisateur est authentifié
    queryset = Product.objects.all()  # Utilisez un queryset général
    serializer_class = ProductSerializerNormale

    def get_object(self):
        # Nous utilisons 'pk' comme paramètre dans l'URL pour récupérer un seul post
        post_id = self.kwargs.get('pk')  # ou utilisez 'slug' si vous préférez
        return get_object_or_404(Product, pk=post_id)  # Récupère un seul post en fonction de l'id

class EditProduct(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializerNormale

class DeleteProduct(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializerNormale


class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)