import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import Sightings from "./Sightings";
import Maps from "./Maps";

const { Header, Content } = Layout;

function LandingPage() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["sightings"]} items={[
            { key: "sightings", label: <Link to="/">Inregistrari</Link> },
            { key: "maps", label: <Link to="/maps">Harta</Link> },
          ]} />
        </Header>
        <Content style={{ padding: "12px" }}>
          <div className="site-layout-content">
            <Routes>
              <Route path="/" element={<Sightings />} />
              <Route path="/maps" element={<Maps />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default LandingPage;
