"use client";
import { useState } from "react";
import "./Footer.scss";
import Script from "next/script";
import { toast } from "react-toastify";
import Loading from "@/components/Loading/Loading";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Vui lòng nhập một địa chỉ email hợp lệ.");
      return;
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Email này đã được đăng ký.");
      } else {
        toast.success("Đăng ký nhận tin thành công!");
        setEmail("");
      }
    } catch (error) {
      console.log("Fail to subscribe email:", error);
      toast.error(" Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Loading loading={isLoading}>
      <div className="footer">
        {/* SEO */}
        <div className="h-product" style={{ display: "none" }}>
          <h1 className="p-name">1</h1>
          <h2 className="p-name">2</h2>
          <h3 className="p-name">3</h3>
          <h4 className="p-name">4</h4>
          <h5 className="p-name">5</h5>
          <h6 className="p-name">6</h6>
        </div>
        <p style={{ display: "none" }}>
          Chào mừng đến với [Tên trang web] - Địa chỉ mua sắm cầu lông hàng đầu!
          Bạn là người yêu thích bộ môn cầu lông và đang tìm kiếm các sản phẩm
          chất lượng, giá cả phải chăng? [Tên trang web] là nơi lý tưởng để bạn
          khám phá và mua sắm các sản phẩm cầu lông từ vợt, quần áo, giày dép,
          đến phụ kiện và thiết bị luyện tập. Tại sao chọn [Tên trang web]? Đa
          dạng sản phẩm: Chúng tôi cung cấp một loạt các sản phẩm từ các thương
          hiệu nổi tiếng như Yonex, Li-Ning, Victor, và nhiều hãng khác, đảm bảo
          đáp ứng mọi nhu cầu từ người chơi mới bắt đầu đến chuyên nghiệp. Chất
          lượng đảm bảo: Mỗi sản phẩm đều được chúng tôi chọn lọc kỹ càng, đảm
          bảo chất lượng cao và độ bền bỉ, giúp bạn yên tâm tập luyện và thi
          đấu. Giá cả cạnh tranh: Chúng tôi cam kết cung cấp các sản phẩm với
          mức giá hợp lý, kèm theo nhiều chương trình khuyến mãi và ưu đãi đặc
          biệt dành cho khách hàng thân thiết. Tư vấn chuyên nghiệp: Đội ngũ tư
          vấn viên nhiệt tình và có kinh nghiệm sẽ giúp bạn lựa chọn sản phẩm
          phù hợp với nhu cầu và phong cách chơi của mình. Dịch vụ giao hàng
          nhanh chóng: Với dịch vụ giao hàng toàn quốc, bạn sẽ nhận được sản
          phẩm của mình một cách nhanh chóng và an toàn. Sứ mệnh của chúng tôi
          Chúng tôi luôn nỗ lực mang đến cho khách hàng những trải nghiệm mua
          sắm tuyệt vời và các sản phẩm chất lượng cao nhất. Tại [Tên trang
          web], niềm đam mê cầu lông của bạn sẽ được nuôi dưỡng và phát triển
          với sự hỗ trợ tốt nhất từ chúng tôi. Hãy khám phá ngay hôm nay! Đừng
          bỏ lỡ cơ hội sở hữu những sản phẩm cầu lông chất lượng với giá tốt
          nhất. Truy cập [URL trang web] để bắt đầu hành trình mua sắm của bạn!
        </p>
        <div className="col-footer">
          <h2>THÔNG TIN CHUNG</h2>
          <p className="logo-footer">
            <span>BMT</span> là hệ thống cửa hàng cầu lông với hơn 50 chi nhánh
            trên toàn quốc, cung cấp sỉ và lẻ các mặt hàng dụng cụ cầu lông từ
            phong trào tới chuyên nghiệp
          </p>
        </div>
        <div className="col-footer">
          <h2>THÔNG TIN LIÊN HỆ</h2>
          <p>
            Hệ thống cửa hàng: <span>58 cửa hàng trên toàn quốc</span>
          </p>
          <p>
            Hotline: <span>0989585858, 0969696969 </span>
          </p>
          <p>
            Hotline bán sỉ: <span>0989585858</span>
          </p>
          <p>
            Email: <span>info@shopbmt.com</span>
          </p>
        </div>
        <div className="policy col-footer">
          <h2>CHÍNH SÁCH</h2>

          <p>Chính sách đổi trả, hoàn tiền</p>
          <p>Chính sách xử lý, khiếu nại</p>
          <p>Chính sách bảo hành</p>
          <p>Chính sách vận chuyển</p>
        </div>

        <div className="col-footer">
          <h2>ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI</h2>
          <form method="post" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng kí'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Script
        strategy="lazyOnload"
        src="https://embed.tawk.to/6696b87132dca6db2cb0d2a9/1i2uc0ut4"
      />
    </Loading>
  );
};

export default Footer;
