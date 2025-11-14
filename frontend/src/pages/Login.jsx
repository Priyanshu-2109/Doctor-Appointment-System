import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, token, setToken, userData } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!backendUrl) {
      toast.error('Backend URL is not configured')
      return
    }

    // Basic client-side validation to avoid silent failures
    if (state === 'Sign Up') {
      if (!name?.trim()) return toast.error('Please enter your full name')
      const emailOk = /.+@.+\..+/.test(email)
      if (!emailOk) return toast.error('Please enter a valid email')
      if ((password || '').length < 8) return toast.error('Password must be at least 8 characters')
    } else {
      if (!email?.trim() || !password?.trim()) return toast.error('Please enter email and password')
    }

    try {
      setSubmitting(true)
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Something went wrong'
      console.error('Auth error:', msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (token && userData) {
      navigate('/')
    }
  }, [token, userData])

  // Optional: quick backend reachability check to expose issues immediately in console
  useEffect(() => {
    (async () => {
      if (!backendUrl) return;
      try {
        console.log('Auth page using backendUrl:', backendUrl)
        // hit a cheap endpoint (root) just to validate connectivity
        await axios.get(backendUrl + '/')
      } catch (e) {
        console.warn('Cannot reach backend at', backendUrl, e?.message)
      }
    })();
  }, [backendUrl])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up'
          ? <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
          : null
        }
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button type="submit" disabled={submitting} className={`bg-primary text-white w-full py-2 my-2 rounded-md text-base ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {submitting ? (state === 'Sign Up' ? 'Creating…' : 'Logging in…') : (state === 'Sign Up' ? 'Create account' : 'Login')}
        </button>
        {state === 'Sign Up'
          ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
          : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login