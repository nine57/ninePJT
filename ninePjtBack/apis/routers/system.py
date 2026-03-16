from ninja import Router

router = Router(tags=["System"])


@router.get("/health")
def health_check(request):
    """헬스 체크"""
    return {"status": "ok"}
