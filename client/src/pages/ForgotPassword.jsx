import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMsg } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { forgotPassword } from '../features/auth/authApiSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { message, error } = useSelector((state) => state.auth);
  const [input, setInput] = useState({
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.email) {
      return toast.error('Email is required');
    }
    dispatch(forgotPassword(input));
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMsg());
      setInput({ email: '' });
      navigate('/login');
    }

    if (error) {
      toast.error(error);
      dispatch(clearMsg());
    }
  }, [dispatch, error, message, navigate]);
  return (
    <div className='main-wrapper login-body'>
      <div className='login-wrapper'>
        <div className='container'>
          <div className='loginbox'>
            <div className='login-left'>
              <img className='img-fluid' src={logo} alt='Logo' />
            </div>
            <div className='login-right'>
              <div className='login-right-wrap'>
                <h1>Forgot Password</h1>
                <p className='account-subtitle'>
                  Enter your email to get a new password
                </p>

                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                    <input
                      className='form-control'
                      name='email'
                      type='email'
                      value={input.email}
                      onChange={(e) => setInput({ email: e.target.value })}
                      placeholder='Email'
                    />
                  </div>
                  <div className='form-group'>
                    <button className='btn btn-primary w-100' type='submit'>
                      Send Mail
                    </button>
                  </div>
                </form>

                <div className='login-or'>
                  <span className='or-line'></span>
                  <span className='span-or'>or</span>
                </div>

                <div className='text-center dont-have'>
                  Remember your password? <Link to='/login'>Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
