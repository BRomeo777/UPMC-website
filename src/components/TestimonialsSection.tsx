// import { Star, Quote } from "lucide-react";

// const testimonials = [
//   {
//     name: "Sarah Johnson",
//     condition: "Cardiac Surgery Patient",
//     rating: 5,
//     text: "The cardiac team at Luen Hospital saved my life. The compassionate care and expert medical treatment I received exceeded all my expectations. The staff made me feel comfortable during a very scary time.",
//     avatar: "SJ"
//   },
//   {
//     name: "Michael Chen",
//     condition: "Orthopedic Surgery Patient",
//     rating: 5,
//     text: "After my knee replacement surgery, I'm back to playing tennis! The orthopedic team's expertise and the rehabilitation program helped me recover faster than I ever imagined possible.",
//     avatar: "MC"
//   },
//   {
//     name: "Lisa Rodriguez",
//     condition: "Emergency Care Patient",
//     rating: 5,
//     text: "When I had a medical emergency, the ER team acted quickly and professionally. Their immediate response and quality care made all the difference. I'm grateful for their dedication.",
//     avatar: "LR"
//   }
// ];

// export function TestimonialsSection() {
//   return (
//     <section className="py-16 lg:py-24 bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
//             Patient Stories
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Hear from our patients about their experiences and how our dedicated medical team helped them on their journey to better health.
//           </p>
//         </div>

//         {/* Testimonials Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
//             >
//               {/* Quote Icon */}
//               <div className="absolute top-6 right-6 text-emerald-100">
//                 <Quote className="w-8 h-8" />
//               </div>

//               {/* Rating */}
//               <div className="flex items-center mb-4">
//                 {[...Array(testimonial.rating)].map((_, i) => (
//                   <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
//                 ))}
//               </div>

//               {/* Testimonial Text */}
//               <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
//                 "{testimonial.text}"
//               </p>

//               {/* Patient Info */}
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
//                   {testimonial.avatar}
//                 </div>
//                 <div>
//                   <div className="font-semibold text-gray-900">{testimonial.name}</div>
//                   <div className="text-sm text-gray-500">{testimonial.condition}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
//           <div className="text-center">
//             <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">98%</div>
//             <div className="text-gray-600">Patient Satisfaction</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">25+</div>
//             <div className="text-gray-600">Years of Excellence</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">50k+</div>
//             <div className="text-gray-600">Lives Saved</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">150+</div>
//             <div className="text-gray-600">Expert Doctors</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }