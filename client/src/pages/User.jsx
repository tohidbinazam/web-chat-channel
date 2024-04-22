import DefaultModal from '../components/modal/DefaultModal';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'datatables.net-dt';
import {
  addUser,
  deleteUser,
  getAllUser,
  updateUser,
} from '../features/user/userApiSlice';
import { clearMsg, selectUser } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import timeCal from '../utils/timeCal';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import vtexInput from 'vtex-input';
import { selectChannel } from '../features/channel/channelSlice';
import calculateEndDate, {
  isoToDatePicker,
} from '../utils/subscription/calculateEndDate';

const User = () => {
  const dispatch = useDispatch();
  const { users, message, error } = useSelector(selectUser);
  const { channels } = useSelector(selectChannel);

  const [input, inputProps, form, setValue] = vtexInput({
    id: '',
    name: '',
    email: '',
    password: '',
    subscription: [],
  });

  const handelSubscription = (e) => {
    const { name, value } = e.target;

    const isSubscribed = input.subscription.some(
      (item) => item.channel === name
    );

    const endDate = value ? calculateEndDate(value) : null;

    const model = value
      ? {
          channel: name,
          plan: value,
          endDate: endDate,
          status: true, // Add status key for new subscription
        }
      : null;

    let updatedSubscription;

    if (isSubscribed) {
      updatedSubscription = model
        ? input.subscription.map((item) =>
            item.channel === name ? { ...item, ...model } : item
          )
        : input.subscription.filter((item) => item.channel !== name);
    } else {
      updatedSubscription = model
        ? [...input.subscription, model]
        : input.subscription;
    }

    // Update the state with the new subscription
    setValue({ subscription: updatedSubscription });
  };

  const handelTemporary = (e) => {
    const { name, value, dataset } = e.target;
    const { channel } = dataset; // Channel unique _id from dataset

    const isSubscribed = input.subscription.some(
      (item) => item.channel === channel
    );

    const date = value ? calculateEndDate(name, value) : null;

    const model = value
      ? {
          channel: channel,
          plan: name,
          endDate: date,
          status: true, // Add status key for new subscription
        }
      : null;

    let updatedSubscription;

    if (isSubscribed) {
      updatedSubscription = input.subscription.map((item) =>
        item.channel === channel ? { ...item, ...model } : item
      );
    } else {
      updatedSubscription = model
        ? [...input.subscription, model]
        : input.subscription;
    }

    setValue({ subscription: updatedSubscription });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.name || !input.email || !input.password) {
      return toast.error('Please fill all the fields');
    }
    delete input.id;
    dispatch(addUser(input));
    form.clear();
  };

  const handleDelete = (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this user!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('Poof! Your user has been deleted!', {
          icon: 'success',
        });
        dispatch(deleteUser(id));
      }
    });
  };

  const handleEditModal = (item) => {
    setValue({
      id: item._id,
      name: item.name,
      email: item.email,
      subscription: item.subscription,
    });
  };
  const handleEdit = (e) => {
    e.preventDefault();
    if (!input.password) {
      delete input.password;
    }
    dispatch(updateUser({ id: input.id, data: input }));
    form.clear();
  };

  const handleStatus = (item) => {
    dispatch(updateUser({ id: item._id, data: { status: !item.status } }));
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
    dispatch(getAllUser());
    new DataTable('#userTable');
  }, [dispatch, error, message]);

  const handleSubscriptionStatus = (item) => {
    const existingSubscriptionIndex = input.subscription.findIndex(
      (data) => data.channel === item._id
    );

    if (existingSubscriptionIndex !== -1) {
      const updatedSubscription = [...input.subscription];
      updatedSubscription[existingSubscriptionIndex] = {
        ...updatedSubscription[existingSubscriptionIndex],
        status: !updatedSubscription[existingSubscriptionIndex].status, // Toggle the status
      };

      setValue({ subscription: updatedSubscription });
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='content container-fluid'>
        <div className='page-header'>
          <div className='row'>
            <div className='col-sm-7 col-auto'>
              <h3 className='page-title'>User</h3>
              <ul className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link to='/'>Dashboard</Link>
                </li>
                <li className='breadcrumb-item active'>User</li>
              </ul>
            </div>
            <div className='col-sm-5 col'>
              <a
                data-bs-target='#addUser'
                data-bs-toggle='modal'
                className='btn btn-primary float-end mt-2'
              >
                Add
              </a>
            </div>
          </div>
        </div>

        <DefaultModal
          title={`${input.id ? 'Edit' : 'Add'} User`}
          id='addUser'
          clearFrom={form.clear}
        >
          <form onSubmit={input.id ? handleEdit : handleSubmit}>
            <div className='row form-row'>
              <div className='col-12 col-sm-12'>
                <div className='form-group'>
                  <label>Name</label>
                  <input
                    {...inputProps('name', 'text')}
                    placeholder='User Full name'
                    className='form-control'
                  />
                </div>
                <div className='form-group'>
                  <label>Email</label>
                  <input
                    {...inputProps('email', 'email')}
                    placeholder='User email'
                    className='form-control'
                  />
                </div>
                <div className='form-group'>
                  <label>Password</label>
                  <input
                    {...inputProps('password', 'password')}
                    placeholder='User password'
                    className='form-control'
                  />
                </div>
                <div className='form-group'>
                  <label>Subscription</label>
                  {channels.map((item, index) => (
                    <div
                      key={index}
                      className='row g-3 align-items-center my-1'
                    >
                      <div className='col-md-6'>
                        <h6>{item.name}</h6>
                      </div>
                      <div className='col-md-6'>
                        {input.subscription.some(
                          (data) => data.channel === item._id
                        ) && (
                          <div className='status-toggle'>
                            <input
                              type='checkbox'
                              id={`subscription-status-${index}`}
                              className='check'
                              checked={
                                input.subscription.find(
                                  (data) => data.channel === item._id
                                ).status
                              }
                              onChange={() => handleSubscriptionStatus(item)}
                            />
                            <label
                              htmlFor={`subscription-status-${index}`}
                              className='checktoggle'
                            >
                              checkbox
                            </label>
                          </div>
                        )}
                      </div>

                      <div className='col-md-6 mt-0'>
                        <label htmlFor={`temporary-${index}`}>
                          {input.subscription.some(
                            (data) => data.channel === item._id
                          )
                            ? 'End Date'
                            : 'Temporary'}
                        </label>
                        <input
                          id={`temporary-${index}`}
                          className='form-control'
                          name='temporary'
                          data-channel={item._id}
                          value={isoToDatePicker(
                            input.subscription.find(
                              (sub) => sub.channel === item._id
                            )?.endDate || ''
                          )}
                          onChange={handelTemporary}
                          type='date'
                        />
                      </div>
                      <div className='col-md-6 mt-0'>
                        <label htmlFor={`duration-${index}`}>Duration</label>
                        <select
                          id={`duration-${index}`}
                          name={item._id}
                          onChange={handelSubscription}
                          className='form-select'
                          value={
                            input.subscription.find(
                              (sub) => sub.channel === item._id
                            )?.plan || ''
                          }
                        >
                          {!input.subscription.find(
                            (sub) => sub.channel === item._id
                          )?._id ||
                          input.subscription.find(
                            (sub) => sub.channel === item._id
                          )?.plan === 'temporary' ? (
                            <option value=''>Select Subscription</option>
                          ) : null}
                          <option value='6 months'>6 Months</option>
                          <option value='1 year'>1 Year</option>
                        </select>
                      </div>
                    </div>
                  ))}
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

        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-header'>
                <h4 className='card-title'>User List</h4>
              </div>
              <div className='card-body'>
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
                        {/* <th>Role</th> */}
                        <th>UpdatedAt</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          {/* <td>{item.role.name}</td> */}
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
                              <label htmlFor={item._id} className='checktoggle'>
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className='actions'>
                              <button
                                className='btn btn-sm bg-success-light me-2'
                                data-bs-target='#addUser'
                                data-bs-toggle='modal'
                                onClick={() => handleEditModal(item)}
                              >
                                <i className='fe fe-pencil'></i> Edit
                              </button>
                              <button
                                data-bs-toggle='modal'
                                className='btn btn-sm bg-danger-light'
                                onClick={() => handleDelete(item._id)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
