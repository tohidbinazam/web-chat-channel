import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectChannel } from '../../features/channel/channelSlice';
import { selectAuth } from '../../features/auth/authSlice';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const Navbar = ({ handleExpand }) => {
  let location = useLocation();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    location.pathname === '/' ? 'dashboard' : location.pathname.split('/')[1]
  );

  const { channels } = useSelector(selectChannel);
  const { admin, permissions } = useSelector(selectAuth);

  const handleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleActive = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <div
      onMouseEnter={handleExpand}
      onMouseLeave={handleExpand}
      className='sidebar'
      id='sidebar'
    >
      <div className='sidebar-inner slimscroll'>
        <div id='sidebar-menu' className='sidebar-menu'>
          <ul>
            <li className='menu-title'>
              <span>Main</span>
            </li>
            {/* {(admin?.role.slug === 'super-admin' ||
              permissions?.some((p) => p.slug === 'dashboard')) && ( */}
            <li
              onClick={() => handleActive('dashboard')}
              className={activeItem === 'dashboard' ? 'active' : ''}
            >
              <Link to='/'>
                <i className='fe fe-home'></i> <span>Dashboard</span>
              </Link>
            </li>
            {/* )} */}
            {(admin?.role.slug === 'super-admin' ||
              permissions?.some((p) => p.slug === 'user')) && (
              <li
                onClick={() => handleActive('user')}
                className={activeItem === 'user' ? 'active' : ''}
              >
                <Link to='/user'>
                  <i className='fe fe-users'></i> <span>User</span>
                </Link>
              </li>
            )}
            {admin?.role.slug === 'super-admin' && (
              <li
                onClick={() => handleActive('admin')}
                className={activeItem === 'admin' ? 'active' : ''}
              >
                <Link to='/admin'>
                  <i className='fa fa-black-tie'></i>
                  <span>Admin</span>
                </Link>
              </li>
            )}
            {admin?.role.slug === 'super-admin' && (
              <li
                onClick={() => handleActive('permission')}
                className={activeItem === 'permission' ? 'active' : ''}
              >
                <Link to='/permission'>
                  <i className='fa fa-check-square-o'></i>{' '}
                  <span>Permission</span>
                </Link>
              </li>
            )}
            {admin?.role.slug === 'super-admin' && (
              <li
                onClick={() => handleActive('role')}
                className={activeItem === 'role' ? 'active' : ''}
              >
                <Link to='/role'>
                  <i className='fa fa-key'></i> <span>Role</span>
                </Link>
              </li>
            )}
            {(admin?.role.slug === 'super-admin' ||
              permissions?.some((p) => p.slug === 'channels')) && (
              <li className='submenu'>
                <Link
                  onClick={() => {
                    handleSubMenu();
                    handleActive('channel');
                  }}
                  className={`${activeItem === 'channel' ? 'active' : ''} ${
                    isSubMenuOpen && 'subdrop'
                  }`}
                  to='/channels'
                >
                  <i className='fe fe-layout'></i> <span> Channels </span>
                  <span className='menu-arrow'></span>
                </Link>
                <ul style={{ display: isSubMenuOpen ? 'block' : 'none' }}>
                  {channels.map((channel, index) => (
                    <li key={index}>
                      <Link to={`/channel/${channel.slug}`}>
                        {channel.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
