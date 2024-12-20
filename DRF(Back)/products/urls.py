from django.urls import path
from .views import ProductList,ProductDetail,ProductFilter,ProductFilterUser,AdminProductDetail,CreateProduct,EditProduct,DeleteProduct,CategoryListView


app_name='products'



urlpatterns = [
    path('',ProductList.as_view(),name='productlist'),
    path('product/<str:slug>/',ProductDetail.as_view(),name='productdetail'),
    path('search/', ProductFilter.as_view(), name='productsearch'),
    path('user/',ProductFilterUser.as_view(),name='productsearchuser'),
    path('admin/create/',CreateProduct.as_view(),name='createproduct'),
    path('admin/edit/productdetail/<int:pk>/',AdminProductDetail.as_view(),name='admindetailproduct'),
    path('admin/edit/<int:pk>/',EditProduct.as_view(),name='editproduct'),
    path('admin/delete/<int:pk>/',DeleteProduct.as_view(),name='deleteproduct'),
    path('categories/',CategoryListView.as_view(),name='categorylist')
]
