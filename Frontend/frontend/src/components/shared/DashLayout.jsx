// src/components/shared/Layout.jsx
import Sidebar from './DashSidebar';
import Header  from './DashHeader';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;