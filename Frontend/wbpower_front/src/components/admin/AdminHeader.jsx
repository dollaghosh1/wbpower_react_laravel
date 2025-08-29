
import UserProfile from './userprofile/UserProfile';

const AdminHeader = () => {
  return (
    <header className='h-area'>
     <h6 className='h-text'> Admin</h6>
      <UserProfile />
    </header>
  );
};

export default AdminHeader;