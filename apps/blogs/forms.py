from ckeditor.widgets import CKEditorWidget
from django import forms

from apps.blogs.widgets import TextInput
from apps.blogs.models import Post


# class PostForm(forms.ModelForm):
class PostForm(forms.Form):
    title = forms.CharField(widget=TextInput())
    content = forms.CharField(widget=CKEditorWidget())
    # class Meta:
    #     model = Post
    #     fields = ["title", "content"]
