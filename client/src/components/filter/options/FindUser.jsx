import vtexInput from 'vtex-input';
import { useDispatch } from 'react-redux';
import { findUser } from '../../../features/user/userApiSlice';
import { toast } from 'react-toastify';
import isValidEmail from '../../../utils/validator/isValidEmail';

const FindUser = () => {
  const dispatch = useDispatch();
  const [input, inputProps, form] = vtexInput({
    email: '',
    mobile: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.email && !input.mobile) {
      return toast.error('Please provide email or mobile');
    }

    if (emailValidation()) {
      dispatch(findUser(input));
    }
  };

  const handleReset = () => {
    form.clear();
  };
  const emailValidation = () => {
    if (input.email && !isValidEmail(input.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <form onSubmit={handleSubmit}>
          <div className='row form-row align-items-end'>
            <div className='col-4 col-sm-4'>
              <div className='form-group'>
                <div className='form-group'>
                  <label>Email</label>
                  <input
                    {...inputProps('email', 'email')}
                    placeholder='User email'
                    className='form-control'
                    onBlur={emailValidation}
                  />
                </div>
              </div>
            </div>
            <div className='col-4 col-sm-4'>
              <div className='form-group'>
                <label>Mobile</label>
                <input
                  {...inputProps('mobile', 'text')}
                  placeholder='Mobile number with country code'
                  className='form-control'
                />
              </div>
            </div>
            <div className='col-2 col-sm-2'>
              <div className='form-group'>
                <button type='submit' className='btn btn-primary w-100'>
                  Search
                </button>
              </div>
            </div>
            <div className='col-2 col-sm-2'>
              <div className='form-group'>
                <button
                  type='reset'
                  onClick={handleReset}
                  className='btn btn-secondary w-100'
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindUser;
