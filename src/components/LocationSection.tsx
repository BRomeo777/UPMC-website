import { MapPin, Phone, Clock, ShieldCheck, Users, HeartHandshake, HeartPulse } from "lucide-react";

export function LocationSection() {
  return (
    <section className="loc-section">
      <style>{`
        .loc-section { padding: 40px 0; background-color: #f8fafc; position: relative; z-index: 20; }
        .loc-container { max-width: 1280px; margin: 0 auto; padding: 0 16px; }
        
        .loc-top-cols { display: flex; flex-direction: column; gap: 32px; margin-bottom: 32px; }
        .loc-img-col { flex: 1; }
        .loc-img-wrapper { position: relative; height: 300px; border-radius: 2rem; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
        .loc-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        
        .loc-card-col { flex: 1; display: flex; }
        .loc-card { width: 100%; background-color: #fff; border-radius: 2rem; box-shadow: 0 8px 30px rgba(0,0,0,0.04); border: 1px solid #f3f4f6; padding: 32px 24px; display: flex; flex-direction: column; justify-content: center; }
        
        .loc-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 9999px; background-color: #f0fdf4; color: #16a34a; font-weight: bold; font-size: 12px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #bbf7d0; align-self: flex-start; }
        .loc-title { font-size: 28px; font-weight: 800; color: #0a1930; margin-bottom: 16px; line-height: 1.2; margin-top: 0; }
        .loc-desc { color: #4b5563; margin-bottom: 32px; font-size: 15px; line-height: 1.6; margin-top: 0; }
        
        .loc-info-list { display: flex; flex-direction: column; }
        .loc-info-item { display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; }
        .loc-info-icon { background-color: #f0fdf4; padding: 12px; border-radius: 9999px; color: #0f766e; flex-shrink: 0; }
        .loc-info-title { font-weight: 700; color: #0f766e; font-size: 16px; margin-bottom: 4px; margin-top: 0; }
        .loc-info-val1 { color: #0a1930; font-weight: 700; font-size: 15px; margin: 0 0 2px 0; }
        .loc-info-val2 { color: #6b7280; font-size: 14px; margin: 0; }
        .loc-divider { height: 1px; width: 100%; background-color: #f3f4f6; }
        
        .loc-callout { margin-top: 24px; background-color: #f0fdf4; border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid #dcfce7; }
        .loc-callout-icon { color: #0f766e; flex-shrink: 0; }
        .loc-callout-title { font-weight: 700; color: #0a1930; font-size: 15px; margin: 0 0 2px 0; }
        .loc-callout-desc { color: #4b5563; font-size: 14px; margin: 0; }
        
        .loc-features { background-color: #fff; border-radius: 2rem; box-shadow: 0 8px 30px rgba(0,0,0,0.04); border: 1px solid #f3f4f6; padding: 24px; }
        .loc-features-grid { display: flex; flex-direction: column; gap: 24px; }
        .loc-feature-item { display: flex; align-items: flex-start; gap: 16px; flex: 1; }
        .loc-feature-icon { color: #0f766e; flex-shrink: 0; }
        .loc-feature-title { font-weight: 700; color: #0a1930; font-size: 15px; margin: 0 0 4px 0; }
        .loc-feature-desc { color: #6b7280; font-size: 12px; margin: 0; line-height: 1.4; }
        .loc-feature-div { display: none; width: 1px; background-color: #f3f4f6; align-self: stretch; }
        
        /* Tablet & Desktop Layouts */
        @media (min-width: 768px) {
          .loc-section { padding: 60px 0; }
          .loc-container { padding: 0 24px; }
          .loc-img-wrapper { height: 400px; }
          .loc-card { padding: 40px; }
          .loc-title { font-size: 32px; }
          .loc-features { padding: 32px; }
          .loc-features-grid { flex-direction: row; flex-wrap: wrap; justify-content: space-between; gap: 24px; }
          .loc-feature-item { flex: 1 1 calc(50% - 24px); min-width: 200px; }
        }
        
        @media (min-width: 1024px) {
          .loc-section { padding: 80px 0; }
          .loc-top-cols { flex-direction: row; align-items: stretch; }
          .loc-img-col { flex: 1 1 50%; min-width: 0; }
          .loc-card-col { flex: 1 1 50%; min-width: 0; }
          .loc-img-wrapper { height: 100%; min-height: 450px; }
          .loc-card { padding: 48px; }
          .loc-title { font-size: 36px; }
          .loc-features-grid { flex-direction: row; flex-wrap: nowrap; gap: 16px; align-items: center; }
          .loc-feature-item { flex: 1; min-width: 0; }
          .loc-feature-div { display: block; }
        }
      `}</style>
      
      <div className="loc-container">
        
        {/* Top Two Columns */}
        <div className="loc-top-cols">
          
          {/* Left: Image */}
          <div className="loc-img-col">
            <div className="loc-img-wrapper">
              <img 
                src="/iiii.jpeg" 
                alt="Our Facility Location" 
                className="loc-img"
              />
            </div>
          </div>

          {/* Right: Location Details Card */}
          <div className="loc-card-col">
            <div className="loc-card">
              
              <div className="loc-badge">
                <MapPin size={14} />
                Visit Us
              </div>
              
              <h2 className="loc-title">
                Our <span style={{ color: "#0f766e" }}>Location</span>
              </h2>
              
              <p className="loc-desc">
                We are conveniently located in the heart of the city, providing easy access to our comprehensive healthcare services. Our facility is designed for your comfort and optimal care.
              </p>

              <div className="loc-info-list">
                {/* Address */}
                <div className="loc-info-item">
                  <div className="loc-info-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="loc-info-title">Address</h4>
                    <p className="loc-info-val1">UMURINZI PETROS MEDICAL CENTER</p>
                    <p className="loc-info-val2">Kigali, Rwanda</p>
                  </div>
                </div>

                <div className="loc-divider"></div>

                {/* Working Hours */}
                <div className="loc-info-item">
                  <div className="loc-info-icon">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="loc-info-title">Working Hours</h4>
                    <p className="loc-info-val1">Monday - Sunday: 24/24</p>
                    <p className="loc-info-val2">Emergency Services Available Anytime</p>
                  </div>
                </div>

                <div className="loc-divider"></div>

                {/* Contact */}
                <div className="loc-info-item">
                  <div className="loc-info-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="loc-info-title">Contact</h4>
                    <p className="loc-info-val1">+250 795 161 628</p>
                    <p className="loc-info-val2">umurinzipetros@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Bottom Callout Box */}
              <div className="loc-callout">
                <div className="loc-callout-icon">
                  <HeartHandshake size={32} />
                </div>
                <div>
                  <h4 className="loc-callout-title">We are here for you and your family.</h4>
                  <p className="loc-callout-desc">Quality care, close to home.</p>
                </div>
              </div>

            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
