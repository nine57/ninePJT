from storages.backends.s3boto3 import S3Boto3Storage


class S3MediaFilesStorage(S3Boto3Storage):
    location = "media"


class S3StaticFilesStorage(S3Boto3Storage):
    location = "static"
