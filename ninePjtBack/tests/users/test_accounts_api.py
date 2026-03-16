from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class AccountsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = reverse("signup")
        self.login_url = reverse("login")
        self.logout_url = reverse("logout")
        self.me_url = reverse("me")
        
        self.username = "tester"
        self.password = "pass1234!"
        self.email = "tester@example.com"
        self.nickname = "테스터"

    def test_signup_success(self):
        payload = {
            "username": self.username,
            "password": self.password,
            "email": self.email,
            "nickname": self.nickname,
        }
        res = self.client.post(self.signup_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["username"], self.username)
        self.assertEqual(res.data["email"], self.email)
        self.assertEqual(res.data["nickname"], self.nickname)

    def test_signup_duplicate_username(self):
        User = get_user_model()
        User.objects.create_user(username=self.username, password=self.password)
        payload = {"username": self.username, "password": self.password}
        res = self.client.post(self.signup_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", res.data)

    def test_login_success_and_me(self):
        User = get_user_model()
        User.objects.create_user(
            username=self.username,
            password=self.password,
            email=self.email,
        )
        payload = {"username": self.username, "password": self.password}
        res = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data.get("authenticated", False))
        
        # 같은 세션으로 /me 확인
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data["username"], self.username)
        self.assertEqual(me_res.data["email"], self.email)

    def test_login_invalid_credentials(self):
        payload = {"username": "nouser", "password": "wrong"}
        res = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", res.data)

    def test_logout(self):
        User = get_user_model()
        User.objects.create_user(username=self.username, password=self.password)
        self.client.post(
            self.login_url,
            {"username": self.username, "password": self.password},
            format="json",
        )
        out_res = self.client.post(self.logout_url)
        self.assertEqual(out_res.status_code, status.HTTP_200_OK)
        
        # 로그아웃 후 /me 접근 불가
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_401_UNAUTHORIZED)
