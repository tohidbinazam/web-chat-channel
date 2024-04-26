import logo from '../../assets/img/logo-dark.jpg';
import smallLogo from '../../assets/img/logo-small.jpg';
import photo from '../../assets/img/profiles/avatar-01.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../features/auth/authApiSlice';
import { Link } from 'react-router-dom';
// import { disconnectSocket } from '../../services/socketService';

// eslint-disable-next-line react/prop-types
const Header = ({ handleNav }) => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(userLogout());
    // disconnectSocket();
  };

  return (
    <div className='header'>
      <div className='header-left'>
        <Link to='/' className='logo'>
          <img src={logo} alt='Logo' />
        </Link>
        <Link to='/' className='logo logo-small'>
          <img src={smallLogo} alt='Logo' width='30' height='30' />
        </Link>
      </div>

      <a href='#' onClick={handleNav} id='toggle_btn'>
        <i className='fe fe-text-align-left'></i>
      </a>

      <ul className='nav user-menu'>
        <li className='nav-item dropdown has-arrow'>
          <a
            href='#'
            className='dropdown-toggle nav-link'
            type='button'
            data-bs-toggle='dropdown'
          >
            <span className='user-img'>
              <img
                className='rounded-circle'
                src={photo}
                width='31'
                alt='Ryan Taylor'
              />
            </span>
          </a>
          <div className='dropdown-menu'>
            <div className='user-header dropdown-item'>
              <div className='avatar avatar-sm'>
                <img
                  src={photo}
                  alt='Admin Image'
                  className='avatar-img rounded-circle'
                />
              </div>
              <div className='user-text'>
                <h6>
                  {admin?.first_nm} {admin?.last_nm}
                </h6>
                <p className='text-muted mb-0'>{admin?.role.name}</p>
              </div>
            </div>
            <Link className='dropdown-item' to='/profile'>
              My Profile
            </Link>
            <Link className='dropdown-item' onClick={handleLogout} to='/login'>
              Logout
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Header;
