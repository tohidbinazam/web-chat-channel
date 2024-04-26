import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMsg } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { resetPassword } from '../features/auth/authApiSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const token = useParams().token;
  const navigate = useNavigate();

  const { message, error } = useSelector((state) => state.auth);
  const [input, setInput] = useState({
    password: '',
    c_password: '',
  });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.password || !input.c_password) {
      return toast.error('All fields are required');
    }
    if (input.password !== input.c_password) {
      return toast.error('Passwords do not match');
    }
    dispatch(resetPassword({ token, password: input.password }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMsg());
      setInput({ password: '', c_password: '' });
    }

    if (error) {
      toast.error(error);
      navigate('/login');
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
                <h1>Reset Password</h1>
                <p className='account-subtitle'>
                  Enter your new password here to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                    <input
                      className='form-control'
                      name='password'
                      type='password'
                      value={input.password}
                      onChange={handleChange}
                      placeholder='New Password'
                    />
                  </div>
                  <div className='form-group'>
                    <input
                      className='form-control'
                      name='c_password'
                      type='password'
                      value={input.c_password}
                      onChange={handleChange}
                      placeholder='Confirm Password'
                    />
                  </div>
                  <div className='form-group'>
                    <button className='btn btn-primary w-100' type='submit'>
                      Reset Password
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

export default ResetPassword;
