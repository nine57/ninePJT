from django.contrib.postgres.fields import ArrayField
from django.db import models


class DrawnNumber(models.Model):
    draw_no = models.PositiveIntegerField()
    draw_date = models.DateTimeField()
    total_prize = models.PositiveBigIntegerField()
    first_prize = models.PositiveBigIntegerField()
    first_winner_count = models.IntegerField()
    draw_numbers = ArrayField(base_field=models.PositiveIntegerField())
    bonus_number = models.PositiveIntegerField()

    class Meta:
        db_table = "lottery_drawn_number"
        app_label = "lotteries"


# {
#     "returnValue":"success", # 요청결과
#     "drwNoDate":"2004-10-30", # 날짜
#     "totSellamnt":56561977000, # 총상금액
#     "firstWinamnt":3315315525, # 1등 상금액
#     "firstPrzwnerCo":4, # 1등 당첨인원
#     "firstAccumamnt":0,
#     "drwtNo1":1, # 로또번호 1
#     "drwtNo2":7, # 로또번호 2
#     "drwtNo3":11, # 로또번호 3
#     "drwtNo4":23, # 로또번호 4
#     "drwtNo5":37, # 로또번호 5
#     "drwtNo6":42, # 로또번호 6
#     "bnusNo":6, # 로또 보너스 번호
#     "drwNo":100 # 로또회차
# }
