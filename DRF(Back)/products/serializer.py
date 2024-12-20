from rest_framework import serializers
from users.models import UserCustom
from .models import Product,Category




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCustom
        fields = ['id', 'user_name', 'email'] 

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    author = AuthorSerializer()
    class Meta:
        model = Product
        fields = ['id','name','price','description','author','image','category','qte_stock','slug']

class ProductSerializerNormale(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name','price','description','author','image','category','qte_stock','slug']

