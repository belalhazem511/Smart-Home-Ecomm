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
import AccountProfilePage from '../pages/AccountProfilePage.jsx';
import AccountAddressesPage from '../pages/AccountAddressesPage.jsx';
import SellerChooserPage from '../pages/SellerChooserPage.jsx';
import SellerDashboardPage from '../pages/SellerDashboardPage.jsx';
import SellerOffersPage from '../pages/SellerOffersPage.jsx';
import SellerOfferEditorPage from '../pages/SellerOfferEditorPage.jsx';
import AdminPreviewPage from '../pages/AdminPreviewPage.jsx';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';

function currentPath() { return window.location.pathname; }

function safeDecode(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}

function NotFoundPage() {
  return <div className="min-h-screen">
    <StoreHeader/>
    <main className="market-shell py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">That page is not part of the SmartAtlas demo storefront. Head back to the homepage to keep exploring.</p>
      <a href="/" className="button-primary mt-6">Back to home</a>
    </main>
    <StoreFooter/>
  </div>;
}

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
      dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', updatePath);
    document.addEventListener('click', navigateFromLink);
    return () => {
      window.removeEventListener('popstate', updatePath);
      document.removeEventListener('click', navigateFromLink);
    };
  }, []);

  if (pathname === '/') return <HomePage/>;
  if (pathname === '/shop' || pathname.startsWith('/categories/') || pathname === '/search') return <CatalogPage key={pathname} pathname={pathname}/>;
  if (pathname.startsWith('/products/')) return <ProductPage key={pathname} pathname={pathname}/>;
  if (pathname === '/cart') return <CartPage/>;
  if (pathname === '/checkout') return <CheckoutPage/>;
  if (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password') return <AuthPage key={pathname} pathname={pathname}/>;
  if (pathname === '/account') return <AccountPage/>;
  if (pathname === '/account/orders') return <OrderHistoryPage/>;
  if (pathname === '/account/profile') return <AccountProfilePage/>;
  if (pathname === '/account/addresses') return <AccountAddressesPage/>;
  if (pathname.startsWith('/account/orders/')) return <OrderDetailPage orderId={safeDecode(pathname.slice('/account/orders/'.length))}/>;
  if (pathname === '/seller') return <SellerChooserPage/>;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <AdminPreviewPage key={pathname} pathname={pathname}/>;
  const sellerOfferCreate = pathname.match(/^\/seller\/([^/]+)\/offers\/new$/);
  if (sellerOfferCreate) {
    let merchantId = sellerOfferCreate[1];
    try { merchantId = decodeURIComponent(merchantId); } catch { /* Keep malformed IDs unavailable. */ }
    return <SellerOfferEditorPage key={pathname} merchantId={merchantId}/>;
  }
  const sellerOfferEdit = pathname.match(/^\/seller\/([^/]+)\/offers\/([^/]+)\/edit$/);
  if (sellerOfferEdit) {
    let merchantId = sellerOfferEdit[1];
    let offerId = sellerOfferEdit[2];
    try { merchantId = decodeURIComponent(merchantId); offerId = decodeURIComponent(offerId); } catch { /* Keep malformed IDs unavailable. */ }
    return <SellerOfferEditorPage key={pathname} merchantId={merchantId} offerId={offerId}/>;
  }
  const sellerOffers = pathname.match(/^\/seller\/([^/]+)\/offers$/);
  if (sellerOffers) {
    let merchantId = sellerOffers[1];
    try { merchantId = decodeURIComponent(merchantId); } catch { /* Keep malformed IDs unavailable. */ }
    return <SellerOffersPage key={merchantId} merchantId={merchantId}/>;
  }
  const sellerRoute = pathname.match(/^\/seller\/([^/]+)$/);
  if (sellerRoute) {
    let merchantId = sellerRoute[1];
    try { merchantId = decodeURIComponent(merchantId); } catch { /* Keep malformed IDs unavailable. */ }
    return <SellerDashboardPage key={merchantId} merchantId={merchantId}/>;
  }
  return <NotFoundPage/>;
}
