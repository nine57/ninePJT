import os

USE_AWS_S3_AS_STORAGE = os.environ.get("REMOTE_STORAGE_SERVICE", None) == "AWS_S3"
if USE_AWS_S3_AS_STORAGE:
    # a custom storage file, so we can easily put static and media in one bucket
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", None)
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", None)
    AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", None)
    AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", None)

    MEDIA_FILES_STORAGE = "utilities.storages.S3MediaFilesStorage"
    STATICFILES_STORAGE = "utilities.storages.S3StaticFilesStorage"
    DEFAULT_FILE_STORAGE = MEDIA_FILES_STORAGE
    # MEDIA_FILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    # STATICFILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    COLLECTFAST_STRATEGY = "collectfast.strategies.boto3.Boto3Strategy"
    COLLECTFAST_THREADS = 20

    # either None or from the list of canned ACLs.
    # if set to None then all files will inherit the bucket’s ACL.
    AWS_DEFAULT_ACL = None

    # The maximum amount of memory a file can take up before being rolled over into a temporary file on disk.
    AWS_S3_MAX_MEMORY_SIZE = 0

    # Setting AWS_QUERYSTRING_AUTH to False to remove query parameter authentication from generated URLs.
    # This can be useful if your S3 buckets are public.
    AWS_QUERYSTRING_AUTH = False

    # The number of seconds that a generated URL is valid for.
    AWS_QUERYSTRING_EXPIRE = 3600

    # Enable server-side file encryption while at rest.
    AWS_S3_ENCRYPTION = False

    # if False it will create unique file names for every image_uploaded file
    AWS_S3_FILE_OVERWRITE = True

    # # As of boto3 version 1.4.4 the default signature version is s3v4.
    AWS_S3_SIGNATURE_VERSION = "s3v4"
    S3_USE_SIGV4 = True
