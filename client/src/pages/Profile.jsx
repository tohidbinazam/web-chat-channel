import { Link } from 'react-router-dom';
import photo from '../assets/img/profiles/avatar-01.jpg';
import vtexInput from 'vtex-input';
import DefaultModal from '../components/modal/DefaultModal';
import { clearMsg, selectAuth } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePass,
  checkPass,
  updateProfile,
} from '../features/auth/authApiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { admin, new_Pass, message, error } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [input, inputProps, form, setValue] = vtexInput({
    first_nm: '',
    last_nm: '',
    email: '',
    birth: '',
    mobile: '',
    address: '',
    password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleEditModal = () => {
    setValue({
      first_nm: admin.first_nm,
      last_nm: admin.last_nm,
      email: admin.email,
      birth: admin.birth,
      mobile: admin.mobile,
      address: admin.address,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-unused-vars
    const { password, new_password, confirm_password, ...profileData } = input;

    if (!profileData.first_nm || !profileData.last_nm || !profileData.email) {
      return toast.error('Name and Email are required');
    }
    dispatch(updateProfile(profileData));
    form.clear();
  };

  const handleCurrentPass = (e) => {
    e.preventDefault();
    if (!input.password) {
      return toast.error('Please enter your password');
    }
    dispatch(checkPass({ password: input.password }));
  };

  const handleNewPass = (e) => {
    e.preventDefault();
    if (input.new_password !== input.confirm_password) {
      return toast.error('Password does not match');
    }
    dispatch(changePass({ password: input.new_password }));
    form.clear();
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMsg());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMsg());
    }
  }, [dispatch, error, message]);

  return (
    <div className='page-wrapper'>
      <div className='content container-fluid'>
        <div className='page-header'>
          <div className='row'>
            <div className='col'>
              <h3 className='page-title'>Profile</h3>
              <ul className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link to='/'>Dashboard</Link>
                </li>
                <li className='breadcrumb-item active'>Profile</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='profile-header'>
              <div className='row align-items-center'>
                <div className='col-auto profile-image'>
                  <a href='#'>
                    <img
                      className='rounded-circle'
                      alt='Admin Image'
                      src={photo}
                    />
                  </a>
                </div>
                <div className='col ml-md-n2 profile-user-info'>
                  <h4 className='user-name mb-0'>
                    {admin.first_nm} {admin.last_nm}
                  </h4>
                  <h5>{admin.role.name}</h5>
                  <div className='user-Location'>
                    <i className='fa fa-map-marker'></i> {admin.address}
                  </div>
                  <div className='about-text'>
                    <i className='fa fa-envelope'></i> {admin.email}
                  </div>
                </div>
                <div className='col-auto profile-btn'>
                  <a
                    className='btn btn-primary'
                    data-bs-target='#edit_personal_details'
                    data-bs-toggle='modal'
                    onClick={handleEditModal}
                  >
                    Edit
                  </a>
                </div>
              </div>
            </div>
            <div className='profile-menu'>
              <ul className='nav nav-tabs nav-tabs-solid'>
                <li className='nav-item'>
                  <a
                    className='nav-link active'
                    data-bs-toggle='tab'
                    href='#per_details_tab'
                  >
                    About
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className='nav-link'
                    data-bs-toggle='tab'
                    href='#password_tab'
                  >
                    Password
                  </a>
                </li>
              </ul>
            </div>
            <div className='tab-content profile-tab-cont'>
              <div className='tab-pane fade show active' id='per_details_tab'>
                <div className='row'>
                  <div className='col-lg-12'>
                    <div className='card'>
                      <div className='card-body'>
                        <h5 className='card-title d-flex justify-content-between'>
                          <span>Personal Details</span>
                          <a
                            className='edit-link cursor-pointer'
                            data-bs-target='#edit_personal_details'
                            data-bs-toggle='modal'
                            onClick={handleEditModal}
                          >
                            <i className='fa fa-edit me-1'></i>Edit
                          </a>
                        </h5>
                        <div className='row'>
                          <p className='col-sm-2 text-muted text-sm-end mb-0 mb-sm-3'>
                            Name
                          </p>
                          <p className='col-sm-10'>
                            {admin.first_nm} {admin.last_nm}
                          </p>
                        </div>
                        <div className='row'>
                          <p className='col-sm-2 text-muted text-sm-end mb-0 mb-sm-3'>
                            Date of Birth
                          </p>
                          <p className='col-sm-10'>{admin.birth}</p>
                        </div>
                        <div className='row'>
                          <p className='col-sm-2 text-muted text-sm-end mb-0 mb-sm-3'>
                            Email ID
                          </p>
                          <p className='col-sm-10'>{admin.email}</p>
                        </div>
                        <div className='row'>
                          <p className='col-sm-2 text-muted text-sm-end mb-0 mb-sm-3'>
                            Mobile
                          </p>
                          <p className='col-sm-10'>{admin.mobile}</p>
                        </div>
                        <div className='row'>
                          <p className='col-sm-2 text-muted text-sm-end mb-0'>
                            Address
                          </p>
                          <p className='col-sm-10 mb-0'>{admin.address}</p>
                        </div>
                      </div>
                    </div>

                    <DefaultModal
                      title='Personal Details'
                      id='edit_personal_details'
                      clearFrom={form.clear}
                    >
                      <form onSubmit={handleUpdate}>
                        <div className='row form-row'>
                          <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                              <label>First Name</label>
                              <input
                                {...inputProps('first_nm', 'text')}
                                placeholder='First Name'
                                className='form-control'
                              />
                            </div>
                          </div>
                          <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                              <label>Last Name</label>
                              <input
                                {...inputProps('last_nm', 'text')}
                                placeholder='Last Name'
                                className='form-control'
                              />
                            </div>
                          </div>
                          <div className='col-12 '>
                            <div className='form-group'>
                              <label>Email ID</label>
                              <input
                                {...inputProps('email', 'email')}
                                placeholder='Email Address'
                                className='form-control'
                              />
                            </div>
                          </div>
                          <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                              <label>Date of Birth</label>
                              <div>
                                <input
                                  {...inputProps('birth', 'date')}
                                  className='form-control'
                                />
                              </div>
                            </div>
                          </div>
                          <div className='col-12 col-sm-6'>
                            <div className='form-group'>
                              <label>Mobile</label>
                              <input
                                {...inputProps('mobile', 'tel')}
                                placeholder='Mobile Number'
                                className='form-control'
                              />
                            </div>
                          </div>
                          <div className='col-12'>
                            <h5 className='form-title'>
                              <span>Address</span>
                            </h5>
                          </div>
                          <div className='col-12'>
                            <div className='form-group'>
                              <label>Address</label>
                              <input
                                {...inputProps('address', 'text')}
                                placeholder='Full Address'
                                className='form-control'
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type='submit'
                          data-bs-dismiss='modal'
                          className='btn btn-primary w-100'
                        >
                          Save Changes
                        </button>
                      </form>
                    </DefaultModal>
                    {/* <div
                      className='modal fade'
                      id='edit_personal_details'
                      aria-hidden='true'
                      role='dialog'
                    >
                      <div
                        className='modal-dialog modal-dialog-centered'
                        role='document'
                      >
                        <div className='modal-content'>
                          <div className='modal-header'>
                            <h5 className='modal-title'>Personal Details</h5>
                            <button
                              type='button'
                              className='btn-close'
                              data-bs-dismiss='modal'
                              aria-label='Close'
                            ></button>
                          </div>
                          <div className='modal-body'></div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <div id='password_tab' className='tab-pane fade'>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>Change Password</h5>
                    <div className='row mt-3'>
                      <div className='col-md-10 col-lg-6'>
                        {!new_Pass ? (
                          <form onSubmit={handleCurrentPass}>
                            <div className='form-group'>
                              <label>Current Password</label>
                              <input
                                {...inputProps('password', 'password')}
                                placeholder='Current Password'
                                className='form-control'
                              />
                            </div>
                            <button className='btn btn-primary' type='submit'>
                              Next
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleNewPass}>
                            <div className='form-group'>
                              <label>New Password</label>
                              <input
                                {...inputProps('new_password', 'password')}
                                placeholder='New Password'
                                className='form-control'
                              />
                            </div>
                            <div className='form-group'>
                              <label>Confirm Password</label>
                              <input
                                {...inputProps('confirm_password', 'password')}
                                placeholder='New Password'
                                className='form-control'
                              />
                            </div>
                            <button className='btn btn-primary' type='submit'>
                              Save Changes
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
