from django.forms import Widget


class TextInput(Widget):
    def render(self, name, value, attrs=None, renderer=None):
        return f'<input type="text" name="{name}" value="{value}">'
