import { useEffect, useState } from "react";
import { Typography, Button, Tabs } from "antd";
import { HeartFilled } from "@ant-design/icons";
import GradientButton from "../../components/common/GradientButton";
import LoginModal from "../../components/authen-form/LoginForm";
import RegisterForm from "../../components/authen-form/RegisterForm"; // ✅ import đúng RegisterForm modal
import "./home.css";
import {
  CalendarOutlined, // ⬅ thêm dòng này nếu chưa có
  MessageOutlined,
  StarFilled,
  UsergroupAddOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { TabPane } = Tabs;

// ✅ Header truyền thêm onRegisterClick
const Header = ({ onLoginClick, onRegisterClick }) => {
  const navigation = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Health Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">
          <div
            className="logo"
            onClick={() => window.location.reload()}
            style={{ cursor: "pointer" }}
          >
            <HeartFilled style={{ fontSize: 20, color: "white" }} />
            <div className="home-logo">
              <img src="/logo-removebg.png" alt="Logo" />
            </div>
          </div>

          <nav className="nav-menu">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="nav-link">
                {item.name}
              </a>
            ))}
          </nav>

          <div className="header-buttons">
            <Button type="text" onClick={onLoginClick}>
              <a className="login-btn">Login</a>
            </Button>
            <GradientButton
              type="pink"
              onClick={onRegisterClick} // ✅ sửa tại đây
            >
              <a className="register-btn">Register</a>
            </GradientButton>
          </div>
        </div>
      </div>
    </header>
  );
};
const HeroSection = ({ onBookConsultation, onAskQuestion }) => (
  <section className="hero">
    <div className="container">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <HeartFilled style={{ fontSize: 16 }} /> Trusted by 10,000+ patients
          </div>
          <h1 className="hero-title">
            Comprehensive <span className="gradient-text">S-Healthcare</span>{" "}
            Services
          </h1>
          <p className="hero-description">
            Expert care for sexual health, reproductive wellness, and
            gender-affirming services.
          </p>
          <div className="hero-buttons">
            <GradientButton
              type="pink"
              size="large"
              icon={<CalendarOutlined />}
              onClick={onBookConsultation}
            >
              Book Consultation
            </GradientButton>
            <Button
              size="large"
              icon={<MessageOutlined />}
              onClick={onAskQuestion}
            >
              Ask Anonymous Question
            </Button>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <SafetyOutlined style={{ fontSize: 20 }} /> 100% Confidential
            </div>
            <div className="hero-feature">
              <StarFilled style={{ fontSize: 20 }} /> Licensed Professionals
            </div>
            <div className="hero-feature">
              <UsergroupAddOutlined style={{ fontSize: 20 }} /> 24/7 Support
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <section className="services">
    <div className="container">
      <h2 className="section-title gradient-text">DỊCH VỤ CỦA CHÚNG TÔI</h2>
      <p className="section-subtitle">
        Các dịch vụ được thiết kế chuyên biệt để đáp ứng nhu cầu chăm sóc sức
        khỏe giới tính một cách riêng tư, an toàn và chuyên nghiệp.
      </p>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-header">
            <div className="service-icon" style={{ background: "#FF5A7D" }}>
              <img src="call-svgrepo-com.svg" alt="docter-svg" />
            </div>
            <h3>Tư vấn trực tuyến</h3>
          </div>
          <p>
            Chúng tôi cung cấp dịch vụ tư vấn sức khỏe tổng quát với các bác sĩ
            chuyên khoa
          </p>
          <ul>
            <li>Đặt lịch nhanh chóng</li>
            <li>Gặp chuyên gia theo yêu cầu</li>
            <li>Phù hợp mọi độ tuổi & giới</li>
          </ul>
          <button className="service-button">Learn More</button>
        </div>

        <div className="service-card">
          <div className="service-header">
            <div className="service-icon" style={{ background: "#A855F7" }}>
              {" "}
              <img src="blood-test-svgrepo-com.svg" alt="" />
            </div>
            <h3>Xét nghiệm STIs</h3>
          </div>
          <p>
            Chúng tôi cung cấp dịch vụ tư vấn và điều trị các bệnh lây truyền
            qua đường tình dục
          </p>
          <ul>
            <li>Kết quả nhanh 24–48h</li>
            <li>Bảo mật tuyệt đối</li>
            <li>Lập kế hoạch điều trị</li>
          </ul>
          <button className="service-button">Learn More</button>
        </div>

        <div className="service-card">
          <div className="service-header">
            <div className="service-icon" style={{ background: "#3B82F6" }}>
              <img src="menstruation-cycle.svg" alt="" />
            </div>
            <h3>Theo dõi chu kì kinh nguyệt</h3>
          </div>
          <p>
            Chúng tôi cung cấp dịch vụ tham vấn tâm lý cho các vấn đề liên quan
            đến sức khỏe tâm thần
          </p>
          <ul>
            <li>Dự đoán rụng trứng</li>
            <li>Thông báo kỳ kinh</li>
            <li>Nhắc nhở & hỗ trợ chuyên sâu</li>
          </ul>
          <button className="service-button">Learn More</button>
        </div>
      </div>
    </div>
  </section>
);

const BlogSection = () => (
  <section className="blog">
    <div className="container">
      <h2 className="section-title gradient-text">BLOG SỨC KHỎE</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất cả bài viết" key="1">
          <div className="blog-list">
            <div className="blog-main">
              <img src="/placeholder.png" alt="main" />
              <h3>
                Điều gì xảy ra khi bạn quên hạ trinh sau khi sinh và tháng hậu
                sản chấp dứt
              </h3>
              <p>
                Nhiều phụ nữ lo lắng về việc quên hạ trinh sau khi sinh và những
                ảnh hưởng có thể xảy ra...
              </p>
              <span>Dr. Trần Thanh | 15/05/2023</span>
            </div>
            <div className="blog-side">
              {[
                {
                  title:
                    "Bệnh viêm nhiễm phụ khoa: nguyên nhân và cách phòng...",
                  author: "Dr. Nguyễn Minh",
                  date: "20/04/2023",
                },
                {
                  title: "Những điều cần biết về sức khỏe sinh sản nam giới",
                  author: "Dr. Lê Hùng",
                  date: "05/03/2023",
                },
                {
                  title: "Phương pháp mang thai an toàn và khỏe mạnh",
                  author: "Dr. Phạm Thảo",
                  date: "10/02/2023",
                },
                {
                  title: "Các biện pháp tránh thai hiện đại và hiệu quả",
                  author: "Dr. Hoàng Anh",
                  date: "25/01/2023",
                },
              ].map((post, i) => (
                <div key={i} className="blog-item">
                  <img src="/placeholder.png" alt="thumb" />
                  <div>
                    <p>{post.title}</p>
                    <span>
                      {post.author} | {post.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab="Bài viết nổi bật" key="2"></TabPane>
        <TabPane tab="Bài viết mới nhất" key="3"></TabPane>
      </Tabs>
    </div>
  </section>
);

const DoctorTeam = () => (
  <section className="doctors">
    <div className="container">
      <h2 className="section-title gradient-text">ĐỘI NGŨ BÁC SĨ</h2>
      <div className="services-grid">
        {[
          {
            name: "Ths BS. Trần Thị Oanh",
            hospital: "BV Hùng Việt",
            field: "Sản khoa",
            price: "150.000đ",
            rating: 4.3,
            visits: 38,
          },
          {
            name: "BS CKI. Lê Ngọc Hồng Hạnh",
            hospital: "BV...",
            field: "Nhi - Thần kinh",
            price: "200.000đ",
            rating: 4.2,
            visits: 118,
          },
          {
            name: "BS CKI. Nguyễn Phúc Thiện",
            hospital: "",
            field: "Nội tim mạch",
            price: "0đ - 300.000đ",
            rating: 4.9,
            visits: 143,
          },
        ].map((doc, i) => (
          <div key={i} className="service-card">
            <img src="/doctor1.png" alt="avatar" className="avatar" />
            <p>
              Đánh giá: {doc.rating} ★ | Lượt khám: {doc.visits} 👥
            </p>
            <h4>{doc.name}</h4>
            <p>{doc.hospital}</p>
            <p>🔬 {doc.field}</p>
            <p>
              <DollarOutlined /> {doc.price}
            </p>
            <p style={{ color: "#9333ea" }}>📄 Bác sĩ Chuyên Khoa</p>
            <GradientButton type="pink">Tư vấn ngay</GradientButton>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-column">
          <h3 className="footer-logo">
            <img className="img-logo" src="logo-removebg.png" alt="" />

            <span className="gradient-text"> S-Healthcare</span>
          </h3>
          <p>
            Professional healthcare services for sexual and reproductive health.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Services</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Services</h4>
          <ul>
            <li>Consultation</li>
            <li>Testing</li>
            <li>Treatment</li>
            <li>Education</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Contact Us</h4>
          <ul>
            <li>📍 123 Healthcare St., City</li>
            <li>📞 +84 123 456 789</li>
            <li>📧 info@genderhealthcare.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Gender Healthcare. All rights reserved.</p>
        {/* <div className="social-icons">
          <span>FB</span>
          <span>TW</span>
          <span>IG</span>
          <span>YT</span>
        </div> */}
      </div>
    </footer>
  </footer>
);

const HomePage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleBookConsultation = () => console.log("Book consultation");
  const handleAskQuestion = () => console.log("Ask question");

  return (
    <div className="homepage">
      {/* ✅ truyền hàm mở register modal vào Header */}
      <Header
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <HeroSection
        onBookConsultation={handleBookConsultation}
        onAskQuestion={handleAskQuestion}
      />
      <ServicesSection />
      <BlogSection />
      <DoctorTeam />
      <Footer />

      {/* Modal đăng nhập */}
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* ✅ Modal đăng ký */}
      <RegisterForm
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </div>
  );
};

export default HomePage;
