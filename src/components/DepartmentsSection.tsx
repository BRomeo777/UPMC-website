import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

const departments = [
  {
    title: "Pulmonology",
    description: "The center offers Pulmonology services including consultations and CHEST CT  readings. We have expertise to differentiate obstructive lung diseases. We offer spirometry services and FENO measures to assess effectiveness of Inhaled Corticosteroid in case of Asthma or COPD. We offer transfers for chest procedures within operating theater like bronchoscopy of lung cancer diagnostic test",
    image: "./spiro.avif",
    // features: ["Cardiac Surgery", "Interventional Cardiology", "Heart Rhythm Management"]
  },
 
  
  {
    title: "Pediatrics",
    description: "Specialized healthcare for infants, children, and adolescents with child-friendly environment.",
    image: "./dr.avif",
    features: ["Newborn Care", "Child Development", "Pediatric Surgery"]
  },
  {
    title: "internal Medicine",
    description: "24/7 emergency care with rapid response team and advanced life support capabilities.",
    image: "https://images.unsplash.com/photo-1758691461888-b74515208d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwbW9kZXJuJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU5MTY3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Trauma Care", "Critical Care", "Emergency Surgery"]
  },
  {
    title: "Women's Health",
    description: "Comprehensive women's healthcare including obstetrics, gynecology, and reproductive health.",
    image: "https://images.unsplash.com/photo-1758691462123-8a17ae95d203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwYXRpZW50JTIwY29uc3VsdGF0aW9uJTIwbWVkaWNhbCUyMGNhcmV8ZW58MXx8fHwxNzU5MTMxNjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    features: ["Maternity Care", "Gynecology", "Fertility Services"]
  }
];

export function DepartmentsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Specialized Departments
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive medical care across multiple specialties with world-class facilities and expert physicians dedicated to your health and wellbeing.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {departments.map((department, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={department.image}
                  alt={department.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                  {department.title}
                </h3>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {department.description}
                </p>
                
                {department.features && department.features.length > 0 ? (
                  <div className="space-y-2 mb-6">
                    {department.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                ) : null}
                
                <Button
                  variant="ghost"
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0 h-auto group"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
            View All Departments
          </Button>
        </div>
      </div>
    </section>
  );
}