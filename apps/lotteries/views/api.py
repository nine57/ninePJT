import json

import requests
from django.http import JsonResponse
from django.views import View

# from apps.lotteries.models import DrawnNumber

# from .data import draw_number, bonus_number


class CollectDrawnNumberView(View):
    pass
    # def get(self, request, start_number):

    #     LOTTO_URL = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo='

    #     for i in range(start_number, start_number+100):
    #         response = requests.post(LOTTO_URL + str(i))
    #         data = response.json()
    #         is_success = data['returnValue']

    #         if is_success == 'success':
    #             draw_no = int(data['drwNo'])
    #             draw_date = data['drwNoDate']
    #             total_money = int(data['totSellamnt'])
    #             first_money = int(data['firstWinamnt'])
    #             first_winner = int(data['firstPrzwnerCo'])
    #             draw_no1 = int(data['drwtNo1'])
    #             draw_no2 = int(data['drwtNo2'])
    #             draw_no3 = int(data['drwtNo3'])
    #             draw_no4 = int(data['drwtNo4'])
    #             draw_no5 = int(data['drwtNo5'])
    #             draw_no6 = int(data['drwtNo6'])
    #             draw_bonus = int(data['bnusNo'])

    #             if not DrawnNumber.objects.filter(id=draw_no).exists():
    #                 DrawnNumber.objects.create(
    #                     id=draw_no,
    #                     draw_no=draw_no,
    #                     draw_date=draw_date,
    #                     total_money=total_money,
    #                     first_money=first_money,
    #                     first_winner=first_winner,
    #                     draw_no1=draw_no1,
    #                     draw_no2=draw_no2,
    #                     draw_no3=draw_no3,
    #                     draw_no4=draw_no4,
    #                     draw_no5=draw_no5,
    #                     draw_no6=draw_no6,
    #                     draw_bonus=draw_bonus,
    #                 )
    # #     return JsonResponse({"result" : 'ok'}, status=200)

    # # def get(self, request, start_number):
    #     numbers = DrawnNumber.objects.all()
    #     last_draw = numbers.last().draw_no
    #     checked_draw = draw_number['draw_no']

    #     if checked_draw < last_draw:
    #         numbers_to_be_updated = numbers.filter(draw_no__gte=checked_draw)

    #     draw_number_list = []
    #     draw_bonus_list = []

    #     for number in numbers_to_be_updated:
    #         draw_number_list.append(number.draw_no1)
    #         draw_number_list.append(number.draw_no2)
    #         draw_number_list.append(number.draw_no3)
    #         draw_number_list.append(number.draw_no4)
    #         draw_number_list.append(number.draw_no5)
    #         draw_number_list.append(number.draw_no6)
    #         draw_bonus_list.append(number.draw_bonus)

    #     for i in draw_number:
    #         if i in draw_number:
    #             draw_number[i] += 1
    #         else:
    #             draw_number[i] = 1

    #     for i in bonus_number:
    #         if i in bonus_number:
    #             bonus_number[i] += 1
    #         else:
    #             bonus_number[i] = 1

    #     print("draw_number : ", draw_number)
    #     print("bonus_number : ", bonus_number)

    #     return JsonResponse({"result": 'ok'}, status=200)
