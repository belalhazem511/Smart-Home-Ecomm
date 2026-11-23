import { useEffect, useState } from 'react';
import HomePage from '../pages/HomePage.jsx';
import CatalogPage from '../pages/CatalogPage.jsx';
import ProductPage from '../pages/ProductPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import AccountPage from '../pages/AccountPage.jsx';
import OrderHistoryPage from '../pages/OrderHistoryPage.jsx';
import OrderDetailPage from '../pages/OrderDetailPage.jsx';

function currentPath() { return window.location.pathname; }

export default function App() {
  const [pathname, setPathname] = useState(currentPath);
  useEffect(() => {
    const updatePath = () => setPathname(currentPath());
    const navigateFromLink = (event) => {
      const link = event.target.closest('a[href^="/"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = new URL(link.href);
      if (target.origin !== location.origin) return;
      event.preventDefault();
      history.pushState({}, '', `${target.pathname}${target.search}${target.hash}`);
      setPathname(target.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', updatePath);
    document.addEventListener('click', navigateFromLink);
    return () => {
      window.removeEventListener('popstate', updatePath);
      document.removeEventListener('click', navigateFromLink);
    };
  }, []);

  if (pathname === '/shop' || pathname.startsWith('/categories/') || pathname === '/search') return <CatalogPage key={pathname} pathname={pathname}/>;
  if (pathname.startsWith('/products/')) return <ProductPage key={pathname} pathname={pathname}/>;
  if (pathname === '/cart') return <CartPage/>;
  if (pathname === '/checkout') return <CheckoutPage/>;
  if (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password') return <AuthPage key={pathname} pathname={pathname}/>;
  if (pathname === '/account') return <AccountPage/>;
  if (pathname === '/account/orders') return <OrderHistoryPage/>;
  if (pathname.startsWith('/account/orders/')) return <OrderDetailPage orderId={decodeURIComponent(pathname.slice('/account/orders/'.length))}/>;
  return <HomePage/>;
}
