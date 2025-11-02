import Link from 'next/link';
import Script from 'next/script';
import SubscribeForm from './SubscribeForm'; // Import the client component
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      {/* 3. The hidden SEO text has been REMOVED. */}
      
      <div className="col-footer">
        <h2>THÔNG TIN CHUNG</h2>
        <p className="logo-footer">
          <span>BMT</span> là hệ thống cửa hàng cầu lông...
        </p>
      </div>
      <div className="col-footer">
        <h2>THÔNG TIN LIÊN HỆ</h2>
        {/* ... contact info ... */}
      </div>
      <div className="policy col-footer">
        <h2>CHÍNH SÁCH</h2>
        <Link href="/policy/returns"><p>Chính sách đổi trả</p></Link>
        <Link href="/policy/warranty"><p>Chính sách bảo hành</p></Link>
        {/* ... policy links ... */}
      </div>
      <div className="col-footer">
        <h2>ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI</h2>
        {/* The interactive form is now its own clean component */}
        <SubscribeForm />
      </div>

      {/* Tawk.to script is fine here */}
      <Script
        strategy="lazyOnload"
        src="https://embed.tawk.to/..."
      />
    </footer>
  );
};

export default Footer;
