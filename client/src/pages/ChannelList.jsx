import DefaultModal from '../components/modal/DefaultModal';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'datatables.net-dt';
import {
  addChannel,
  deleteChannel,
  getAllChannel,
  updateChannel,
} from '../features/channel/channelApiSlice';
import { clearMsg, selectChannel } from '../features/channel/channelSlice';
import useInput from '../hooks/useInput';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import timeCal from '../utils/timeCal';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, message, error, loading } = useSelector(selectChannel);

  const [input, setInput, inputChange, clearFrom] = useInput({
    name: '',
  });
  new DataTable('#channelTable');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.name) {
      return toast.error('Please fill all the fields');
    }
    dispatch(addChannel(input));
    clearFrom();
  };

  const handleDelete = (id, name) => {
    swal({
      title: 'Are you sure?',
      text: `Once deleted, you will not be able to recover ${name} channel and it's messages!`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Poof! ${name} channel has been deleted!`, {
          icon: 'success',
        });
        dispatch(deleteChannel(id));
      }
    });
  };

  const handleEditModal = (item) => {
    setInput({ id: item._id, name: item.name });
  };
  const handleEdit = (e) => {
    e.preventDefault();
    dispatch(updateChannel({ id: input.id, data: { name: input.name } }));
    clearFrom();
  };
  const handleStatus = (item) => {
    dispatch(updateChannel({ id: item._id, data: { status: !item.status } }));
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
    dispatch(getAllChannel());
  }, [dispatch]);
  return (
    <div className='page-wrapper'>
      <div className='content container-fluid'>
        <div className='page-header'>
          <div className='row'>
            <div className='col-sm-7 col-auto'>
              <h3 className='page-title'>Channel</h3>
              <ul className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link to='/'>Dashboard</Link>
                </li>
                <li className='breadcrumb-item active'>Channel</li>
              </ul>
            </div>
            <div className='col-sm-5 col'>
              <a
                data-bs-target='#addChannel'
                data-bs-toggle='modal'
                className='btn btn-primary float-end mt-2'
              >
                Create
              </a>
            </div>
          </div>
        </div>

        <DefaultModal
          title={`${input.id ? 'Edit' : 'Create'} Channel`}
          id='addChannel'
          clearFrom={clearFrom}
        >
          <form onSubmit={input.id ? handleEdit : handleSubmit}>
            <div className='row form-row'>
              <div className='col-12 col-sm-12'>
                <div className='form-group'>
                  <label>
                    Name<b className='text-danger'>*</b>
                  </label>
                  <input
                    type='text'
                    name='name'
                    onChange={inputChange}
                    value={input.name}
                    placeholder='Channel name'
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
              {input.id ? 'Save Changes' : 'Create Channel'}
            </button>
          </form>
        </DefaultModal>

        <div className='row'>
          <div className='col-md-12'>
            <div className='card'>
              <div className='card-header'>
                <h4 className='card-title'>Channel List</h4>
              </div>
              <div className='card-body'>
                {!loading && (
                  <div className='table-responsive'>
                    <table
                      className='datatable table table-hover table-center mb-0'
                      id='channelTable'
                    >
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Slug</th>
                          <th>UpdatedAt</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channels?.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.slug}</td>
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
                                  data-bs-target='#addChannel'
                                  data-bs-toggle='modal'
                                  onClick={() => handleEditModal(item)}
                                >
                                  <i className='fe fe-pencil'></i> Edit
                                </button>
                                <button
                                  className='btn btn-sm bg-danger-light'
                                  onClick={() =>
                                    handleDelete(item._id, item.name)
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

export default ChannelList;
