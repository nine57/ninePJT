import React, { useState } from 'react';

import API from '../api';
import { AxiosError } from 'axios';
import CertiIcon from '../assets/Login/certi-icon.svg?react';
import EmailIcon from '../assets/Login/email-icon.svg?react';
import LockIcon from '../assets/Login/lock-icon.svg?react';
import PhoneIcon from '../assets/Login/phone-icon.svg?react';
import UserIcon from '../assets/Login/user-icon.svg?react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [payload, setPayload] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    email: '',
    userType: '',
  });
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payload.password !== payload.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await API.user.signup(payload);
      navigate('/login');
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data as { error?: string };
      setError(errorMessage.error || '회원가입 중 오류가 발생했습니다.');
      console.error('회원가입 에러:', error);
    }
  };

  return (
    <div className="text-white w-[360px] border-2 border-white border-opacity-20 shadow-xl shadow-black/70 rounded-xl p-10 bg-white/20 backdrop-blur-md relative">
      <h1 className="font-bold text-3xl text-center mb-8">가입하기</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <UserIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-40"
              type='text'
              name='username'
              placeholder='Username'
              value={payload.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <LockIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-40"
              type="password"
              name="password"
              placeholder="Password"
              value={payload.password}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              required
            />
          </div>
          {capsLockOn && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-red-500 text-xs text-center">
              CapsLock On
            </div>
          )}
        </div>
        <div className="mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <LockIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-40"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={payload.confirmPassword}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              required
            />
          </div>
          {capsLockOn && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-red-500 text-xs text-center">
              CapsLock On
            </div>
          )}
        </div>
        <div className="pb-4"></div>
        <div className="flex flex-col mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <UserIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-40"
              type="text"
              name="name"
              placeholder="Full Name"
              value={payload.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <PhoneIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-40"
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={payload.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <EmailIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-40"
              type="email"
              name="email"
              placeholder="Email"
              value={payload.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <CertiIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-40"
              type="text"
              name="userType"
              placeholder="가입 Code"
              value={payload.userType}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="pb-4"></div>
        <div className="flex flex-col items-center justify-center">
          <button
            className="w-full p-2 rounded-lg text-black bg-white"
            type="submit"
          >등록</button>
        </div>
      </form>
    </div>
  );
};

export default Signup; 
