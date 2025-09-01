
import UserProfile from './userprofile/UserProfile';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../redux/authSlice';

const AdminHeader = () => {
  const user = useSelector(selectAuthUser);
  return (
    <header className='h-area'>
     <h6 className='h-text'> 
      Admin
      {user && (
          <span style={{ marginLeft: '10px', fontWeight: 'normal' }}>
            | {user.name }
          </span>
        )}
      </h6>
      <UserProfile />
    </header>
  );
};

export default AdminHeader;