from django.http import HttpResponse
from django.shortcuts import render


def homepage(request):
    print(request.GET)
    return render(request, 'homepage.html')

