import React, { useState } from 'react';

import API from '../api';
import LockIcon from '../assets/Login/lock-icon.svg?react';
import UserIcon from '../assets/Login/user-icon.svg?react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [payload, setPayload] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
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
      setError('회원가입 중 오류가 발생했습니다.');
      console.error('회원가입 에러:', err);
    }
  };

  return (
    <div className="text-white w-[360px] border-2 border-white border-opacity-20 shadow-xl shadow-black/70 rounded-xl p-10 bg-white/20 backdrop-blur-md">
      <h1 className="font-bold text-3xl text-center mb-8">회원가입</h1>
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
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-80"
              type='text'
              name='username'
              placeholder='Username'
              value={payload.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <LockIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-80"
              type="password"
              name="password"
              placeholder="Password"
              value={payload.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <div className="flex items-center border-2 border-white border-opacity-20 rounded-md">
            <LockIcon className="w-6 h-6 mx-3 invert" />
            <input
              className="w-full h-12 outline-none bg-transparent text-white placeholder-white placeholder-opacity-80"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={payload.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            className="w-full p-2 rounded-lg text-black bg-white"
            type="submit"
          >회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default Signup; 
