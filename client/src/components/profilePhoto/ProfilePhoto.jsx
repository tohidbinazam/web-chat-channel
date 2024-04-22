import avatar from '../../assets/img/profiles/avatar-01.jpg';

// eslint-disable-next-line react/prop-types
const ProfilePhoto = ({ photo, style }) => {
  return <img src={photo ? photo : avatar} className={style} alt='Image' />;
};

export default ProfilePhoto;
