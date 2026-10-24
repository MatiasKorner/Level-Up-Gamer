import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import PageStyles from '../common/PageStyles.jsx';

export default function Layout() {
  return (
    <>
      <PageStyles />

      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
