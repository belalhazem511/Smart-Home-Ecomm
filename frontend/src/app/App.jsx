import { useEffect, useState } from 'react';
import HomePage from '../pages/HomePage.jsx';
import CatalogPage from '../pages/CatalogPage.jsx';
import ProductPage from '../pages/ProductPage.jsx';
import CartPage from '../pages/CartPage.jsx';

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
  return <HomePage/>;
}
