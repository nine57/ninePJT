import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import API from '../api'

const Login = () => {
  const [payload, setPayload] = useState({ username: '', password: '' });
  const [capsLockOn, setCapsLockOn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    API.pokerFace.login(payload).then(
      (response) => {
        const {token} = response.data;
        localStorage.setItem('token', token);
        navigate('/poker-face/');
      }
    ).catch((error) => console.log(error))
  };

  return (
    <div className="text-white w-[360px] border-2 border-white border-opacity-20 shadow-xl shadow-black/70 rounded-xl p-10 bg-white/20 backdrop-blur-md">
      <h1 className="font-bold text-3xl text-center mb-8">
        로그인
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between mb-4">
          <div className="mb-4">
            <input
              className="w-full h-12 px-4 border-2 border-white border-opacity-40 rounded-md outline-none bg-transparent text-white placeholder-white placeholder-opacity-80"
              type='text'
              name='username'
              placeholder='Username'
              value={payload.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-1">
            <input
              className="w-full h-12 px-4 border-2 border-white border-opacity-40 rounded-md outline-none bg-transparent text-white placeholder-white placeholder-opacity-80"
              type="password"
              name="password"
              placeholder="Password"
              value={payload.password}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              required
            />
            <div className="mt-1 min-h-4">
              {capsLockOn &&
                <div className="text-red-500 text-xs text-center">
                    CapsLock이 켜져 있습니다.
                </div>
              }
            </div>
          </div>
        </div>
      </form>
      <div className="flex flex-col items-center justify-center">
        <button
          className="w-full p-2 border-2 rounded-lg text-black bg-white"
          type="submit"
        >Login</button>
      </div>
    </div>
  );
};

export default Login;
