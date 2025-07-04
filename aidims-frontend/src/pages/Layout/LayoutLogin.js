// components/Layout.js
import HeaderLogin from './HeaderLogin';
import Footer from './Footer';
import "../../css/layout.css";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLogin />
      <main className="flex-grow px-6 py-4 bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
