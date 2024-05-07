import DefaultModal from '../components/modal/DefaultModal';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'datatables.net-dt';
import {
  addAdmin,
  deleteAdmin,
  getAllAdmin,
  updateAdmin,
} from '../features/admin/adminApiSlice';
import { clearMsg, selectAdmin } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import timeCal from '../utils/timeCal';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import vtexInput from 'vtex-input';
import { selectAuth } from '../features/auth/authSlice';
import isValidEmail from '../utils/validator/isValidEmail';

const Admin = () => {
  const dispatch = useDispatch();
  const { admins, role, message, error, loading } = useSelector(selectAdmin);
  const { admin } = useSelector(selectAuth);

  const [input, inputProps, form, setValue] = vtexInput({
    id: '',
    first_nm: '',
    last_nm: '',
    email: '',
    password: '',
    birth: '',
    mobile: '',
    address: '',
    role: '',
  });
  new DataTable('#userTable');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !input.first_nm ||
      !input.email ||
      !input.password ||
      !input.mobile ||
      !input.role
    ) {
      return toast.error('Please fill all required fields');
    }
    if (emailValidation() && dateOfBirthValidation()) {
      delete input.id;
      dispatch(addAdmin(input));
      form.clear();
    }
  };

  const handleDelete = (id, role) => {
    swal({
      title: 'Are you sure?',
      text: `Once deleted, you will not be able to recover this ${role}!`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Poof! Your ${role} has been deleted!`, {
          icon: 'success',
        });
        dispatch(deleteAdmin(id));
      }
    });
  };

  const handleEditModal = (item) => {
    setValue({
      id: item._id,
      first_nm: item.first_nm,
      last_nm: item.last_nm,
      email: item.email,
      birth: item.birth,
      mobile: item.mobile,
      address: item.address,
      role: item.role._id,
    });
  };
  const handleEdit = (e) => {
    e.preventDefault();
    if (!input.password) {
      delete input.password;
    }
    if (emailValidation() && dateOfBirthValidation()) {
      dispatch(updateAdmin({ id: input.id, data: input }));
      form.clear();
    }
  };
  const handleStatus = (item) => {
    dispatch(updateAdmin({ id: item._id, data: { status: !item.status } }));
  };

  const handelRandomPass = () => {
    const randomPass = Math.random().toString(36).slice(-8);
    setValue({ password: randomPass });
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }

    dispatch(clearMsg());
  }, [dispatch, error, message]);

  useEffect(() => {
    dispatch(getAllAdmin());
  }, [dispatch]);

  const emailValidation = () => {
    if (input.email && !isValidEmail(input.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  const dateOfBirthValidation = () => {
    if (
      input.birth &&
      new Date(input.birth) >
        new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000)
    ) {
      toast.error('Admin must be at least 15 years old');
      return false;
    }
    return true;
  };

  return (
    <div className='page-wrapper'>
      <div className='content container-fluid'>
        <div className='page-header'>
          <div className='row'>
            <div className='col-sm-7 col-auto'>
              <h3 className='page-title'>Admin</h3>
              <ul className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link to='/'>Dashboard</Link>
                </li>
                <li className='breadcrumb-item active'>Admin</li>
              </ul>
            </div>
            <div className='col-sm-5 col'>
              <a
                data-bs-target='#addAdmin'
                data-bs-toggle='modal'
                className='btn btn-primary float-end mt-2'
              >
                Add
              </a>
            </div>
          </div>
        </div>

        <DefaultModal
          title={`${input.id ? 'Edit' : 'Add'} Admin`}
          id='addAdmin'
          clearFrom={form.clear}
        >
          <form onSubmit={input.id ? handleEdit : handleSubmit}>
            <div className='row form-row'>
              <div className='col-12 col-sm-6'>
                <div className='form-group'>
                  <label>
                    First Name<b className='text-danger'>*</b>
                  </label>
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
              <div className='col-12'>
                <div className='form-group'>
                  <label>
                    Email ID<b className='text-danger'>*</b>
                  </label>
                  <input
                    {...inputProps('email', 'email')}
                    placeholder='Email Address'
                    className='form-control'
                    onBlur={emailValidation}
                  />
                </div>
              </div>
              <div className='col-12'>
                <div className='form-group'>
                  <label>
                    Password<b className='text-danger'>*</b>
                  </label>
                  <input
                    {...inputProps('password', 'password')}
                    placeholder='Strong Unique Password'
                    className='form-control'
                  />
                  <a href='#'>
                    <span
                      onClick={handelRandomPass}
                      className='badge text-bg-primary'
                    >
                      Random password
                    </span>
                  </a>
                </div>
              </div>
              <div className='col-12 col-sm-6'>
                <div className='form-group'>
                  <label>Date of Birth</label>
                  <div>
                    <input
                      {...inputProps('birth', 'date')}
                      className='form-control'
                      onBlur={dateOfBirthValidation}
                    />
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-6'>
                <div className='form-group'>
                  <label>
                    Mobile<b className='text-danger'>*</b>
                  </label>
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
              <div className='col-12'>
                <div className='form-group'>
                  <label className='text-danger fw-bold'>
                    Role<b className='text-danger'>*</b>
                  </label>
                  <select {...inputProps('role')} className='form-control'>
                    <option value=''>Select Role</option>
                    {role?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              type='submit'
              data-bs-dismiss='modal'
              className='btn btn-primary w-100'
              disabled={loading}
            >
              {input.id ? 'Save Changes' : 'Add Admin'}
            </button>
          </form>
        </DefaultModal>

        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-header'>
                <h4 className='card-title'>Admin List</h4>
              </div>
              <div className='card-body'>
                {!loading && (
                  <div className='table-responsive'>
                    <table
                      className='datatable table table-hover table-center mb-0'
                      id='userTable'
                    >
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>UpdatedAt</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins
                          ?.filter((item) => admin._id !== item._id)
                          .map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {item.first_nm} {item.last_nm}
                              </td>
                              <td>{item.email}</td>
                              <td>{item.role.name}</td>
                              <td>{timeCal(item.updatedAt)}</td>

                              <td>
                                <div className='status-toggle'>
                                  <input
                                    type='checkbox'
                                    id={item._id}
                                    className='check'
                                    checked={item.status}
                                    onChange={() => {
                                      handleStatus(item);
                                    }}
                                  />
                                  <label
                                    htmlFor={item._id}
                                    className='checktoggle'
                                  >
                                    checkbox
                                  </label>
                                </div>
                              </td>
                              <td>
                                <div className='actions'>
                                  <button
                                    className='btn btn-sm bg-success-light me-2'
                                    data-bs-target='#addAdmin'
                                    data-bs-toggle='modal'
                                    onClick={() => handleEditModal(item)}
                                  >
                                    <i className='fe fe-pencil'></i> Edit
                                  </button>
                                  <button
                                    className='btn btn-sm bg-danger-light'
                                    onClick={() =>
                                      handleDelete(item._id, item.role.name)
                                    }
                                  >
                                    <i className='fe fe-trash'></i> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
