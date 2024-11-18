AUTH_USER_MODEL = "accounts.User"

# Password validation
PASSWORD_VALIDATOR_NAMES = [
    "UserAttributeSimilarityValidator",
    "MinimumLengthValidator",
    "CommonPasswordValidator",
    "NumericPasswordValidator",
]
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": f"django.contrib.auth.password_validation.{name}"}
    for name in PASSWORD_VALIDATOR_NAMES
]
