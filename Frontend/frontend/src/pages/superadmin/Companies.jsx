import Layout from "../../components/shared/DashLayout";

const Companies = () => {
  return (
    <Layout>
      <h1>Companies Management</h1>
      <p>Here you can manage all companies.</p>
      
      {/* Add your table, buttons, etc. later */}
      <div style={{ marginTop: '20px' }}>
        <button>Add New Company</button>
      </div>
    </Layout>
  );
};

export default Companies;