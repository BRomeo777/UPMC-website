import { Stethoscope, Wind, Microscope, Baby, ArrowRight, Heart } from "lucide-react";

const services = [
  {
    title: "General Consultations",
    description: "Expert medical advice and thorough checkups for all your general health needs.",
    image: "/services/consultations.png",
    icon: Stethoscope,
  },
  {
    title: "Spirometry",
    description: "Comprehensive lung function testing to assess and monitor your respiratory health.",
    image: "/services/spirometry.jpeg",
    icon: Wind,
  },
  {
    title: "Laboratory Tests",
    description: "State-of-the-art diagnostic testing with quick and accurate results.",
    image: "/services/lab1.jpeg",
    icon: Microscope,
  },
  {
    title: "Pediatrics Service",
    description: "Specialized medical care and checkups dedicated to infants, children, and adolescents.",
    image: "/services/pediatrics.png",
    icon: Baby,
  },
];

export function ServicesBlock() {
  return (
    <section className="services-section">
      <style>{`
        .services-section { padding: 60px 0; background-color: #ffffff; position: relative; z-index: 20; }
        .services-container { max-width: 1280px; margin: 0 auto; padding: 0 16px; }
        
        .services-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 48px; text-align: center; }
        .services-badge { display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 9999px; background-color: #f0fdfa; color: #0d9488; font-weight: bold; font-size: 12px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #ccfbf1; }
        .services-title { font-size: 32px; font-weight: 800; color: #0a1930; margin-bottom: 16px; line-height: 1.2; }
        .services-subtitle { color: #4b5563; font-size: 16px; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 0 16px; }
        .services-separator { display: flex; align-items: center; gap: 16px; margin: 24px 0; }
        .services-separator-line { width: 24px; height: 2px; background-color: #0d9488; }
        
        .services-grid { display: grid; gap: 24px; grid-template-columns: 1fr; }
        
        .service-card { background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #f3f4f6; display: flex; flex-direction: column; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .service-card:hover { transform: translateY(-5px); box-shadow: 0 15px 50px rgba(0,0,0,0.1); }
        .service-image-container { position: relative; height: 220px; background-color: #f8fafc; }
        .service-image { width: 100%; height: 100%; object-fit: cover; }
        .service-icon-box { position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%); background-color: #0d9488; color: #ffffff; width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(13,148,136,0.3); }
        
        .service-content { padding: 56px 24px 32px; display: flex; flex-direction: column; align-items: center; flex: 1; }
        .service-card-title { font-size: 18px; font-weight: 800; color: #0a1930; margin: 0 0 16px 0; text-align: center; }
        .service-card-line { width: 40px; height: 3px; background-color: #0d9488; margin-bottom: 16px; }
        .service-card-desc { color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; margin: 0 0 24px 0; flex: 1; }
        .service-link { display: inline-flex; align-items: center; gap: 8px; color: #0d9488; font-weight: 700; font-size: 14px; text-decoration: none; transition: gap 0.2s; }
        .service-link:hover { gap: 12px; }
        
        .services-footer { margin-top: 48px; display: flex; justify-content: center; position: relative; }
        .services-button { background-color: #0d9488; color: #ffffff; padding: 16px 32px; border-radius: 9999px; font-weight: bold; font-size: 15px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 8px 24px rgba(13,148,136,0.3); z-index: 2; transition: transform 0.2s, background-color 0.2s; }
        .services-button:hover { background-color: #0f766e; transform: scale(1.05); }
        .services-dots { display: none; gap: 12px; opacity: 0.2; position: absolute; top: 50%; transform: translateY(-50%); }
        .services-dot { width: 6px; height: 6px; border-radius: 50%; background-color: #0d9488; }
        .services-dots.left { left: 10%; }
        .services-dots.right { right: 10%; }
        
        /* Tablet Desktop rules */
        @media (min-width: 768px) {
          .services-section { padding: 100px 0; }
          .services-header { margin-bottom: 64px; }
          .services-title { font-size: 48px; }
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .services-dots { display: flex; }
          .services-footer { margin-top: 64px; }
        }
        @media (min-width: 1024px) {
          .services-grid { grid-template-columns: repeat(4, 1fr); }
          .services-dots.left { left: 20%; }
          .services-dots.right { right: 20%; }
        }
      `}</style>
      
      <div className="services-container">
        
        {/* Top Header Section */}
        <div className="services-header">
          <div className="services-badge">
            <Stethoscope size={16} />
            OUR SERVICES
          </div>
          
          <h2 className="services-title">
            Our Services
          </h2>
          
          <p className="services-subtitle">
            Providing comprehensive and compassionate healthcare services tailored to your needs.
          </p>

          <div className="services-separator">
            <div className="services-separator-line"></div>
            <Heart size={16} color="#0d9488" fill="#0d9488" />
            <div className="services-separator-line"></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              {/* Image Section */}
              <div className="service-image-container">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="service-image"
                />
                
                {/* Floating Icon Box */}
                <div className="service-icon-box">
                  <service.icon size={28} />
                </div>
              </div>

              {/* Text Content */}
              <div className="service-content">
                <h3 className="service-card-title">
                  {service.title}
                </h3>
                
                <div className="service-card-line"></div>
                
                <p className="service-card-desc">
                  {service.description}
                </p>
                
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("navigate", { detail: "services" }));
                  }}
                  className="service-link"
                >
                  Learn More <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button Area */}
        <div className="services-footer">
          
          {/* Left Decorative Dots */}
          <div className="services-dots left">
            <div className="services-dot"></div>
            <div className="services-dot"></div>
            <div className="services-dot"></div>
            <div className="services-dot"></div>
            <div className="services-dot"></div>
          </div>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "services" }))}
            className="services-button"
          >
            View All Services
            <ArrowRight size={18} />
          </button>

          {/* Right Decorative Dots */}
          <div className="services-dots right">
            <div className="services-dot"></div>
            <div className="services-dot"></div>
            <div className="services-dot"></div>
            <div className="services-dot"></div>
            <div className="services-dot"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
