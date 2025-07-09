import React, { memo, useState } from "react";
import Layout from "../Layout/Layout";

const features = [
  {
    img: "/images/feature‑ai.webp",
    title: "Phân tích AI",
    desc: "Chẩn đoán sớm và chính xác hơn với công nghệ AI hỗ trợ."
  },
  {
    img: "/images/feature‑dicom.webp",
    title: "Quản lý DICOM",
    desc: "Hệ thống quản lý hình ảnh y tế chuẩn DICOM đa nền tảng."
  },
  {
    img: "/images/feature‑security.webp",
    title: "Bảo mật cao",
    desc: "Bảo vệ dữ liệu bệnh nhân theo chuẩn HIPAA & ISO 27001."
  },
  {
    img: "/images/feature‑speed.webp",
    title: "Xử lý nhanh",
    desc: "Truy xuất hình ảnh tức thời, phục vụ kịp thời nhu cầu lâm sàng."
  },
  // {
  //   img: "/images/hospital.png",
  //   title: "cơ sở vật chất",
  //   desc: "Cơ sở vật chất hiện đại, đầy đủ các trang thiết bị hiện đại."
  // }
];

// function FeatureCarousel() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? features.length - 1 : prevIndex - 1
//     );
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) =>
//       (prevIndex + 1) % features.length
//     );
//   };

//   const feature = features[currentIndex];

//   return (
//     <section id="features" className="features-carousel container">
//       <h2 className="carousel-title">Tính năng nổi bật</h2>
//       <div className="feature-slide-box">
//         <button className="nav-btn left" onClick={handlePrev}>‹</button>
//         <div className="feature-slide">
//           <img src={feature.img} alt={feature.title} className="feature-img" />
//           <div className="feature-overlay">
//             <h3>{feature.title}</h3>
//             <p>{feature.desc}</p>
//           </div>
//         </div>
//         <button className="nav-btn right" onClick={handleNext}>›</button>
//       </div>
//     </section>
//   );
// }

function FeatureCarousel() {
  return (
    <section id="features" className="features-grid-section container">
      <h2 className="carousel-title">Tính năng nổi bật</h2>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <img src={feature.img} alt={feature.title} className="feature-img" />
            <div className="feature-overlay">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-media">
          <video
            src="/videos/xray-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
          />
          <div className="overlay"></div>
        </div>
        <div className="hero-content container">
          <h1>AI‑Powered DICOM Management</h1>
          <p>
            AIDIMS – Giải pháp tối ưu trong lưu trữ, phân tích và truyền tải hình ảnh y tế
            với công nghệ AI tiên tiến.
          </p>
          <div className="button-group">
            <a className="btn-primary" href="#features">Khám phá tính năng</a>
            <a className="btn-secondary" href="/LoginRegister">Bắt đầu ngay</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureCarousel />

      {/* Dashboard Preview */}
      <section className="dashboard-preview">
        <div className="container">
          <h2 className="carousel-title">TRỤ SỞ AIDIMS HOSPITAL</h2>
          <img src="/images/hospital.png" alt="AIDIMS HOSPITAL" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Bắt đầu với AIDIMS ngay hôm nay</h2>
          <p>Miễn phí 30 ngày • Hỗ trợ 24/7 • Hoàn tiền nếu không hài lòng</p>
          <a className="btn-cta" href="/LoginRegister">Đăng ký dùng thử</a>
        </div>
      </section>
    </Layout>
  );
};

export default memo(HomePage);
