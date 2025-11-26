"use client";
import toast from "react-hot-toast";

export default function ContactPage() {

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("📨 Message sent successfully!");
    // চাইলে backend API এও পাঠাতে পারো
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 bg-gradient-to-r from-purple-100 via-white to-green-100">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Contact <span className="text-green-600">Us</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions, feedback or need help? We’d love to hear from you!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 px-6">

          {/* Contact Info */}
          <div className="space-y-8">
            {[
              { title: "Email Us", value: "support@producthub.com", icon: "📧" },
              { title: "Call Us", value: "+1 212-456-7890", icon: "📞" },
              { title: "Visit Us", value: "794 Francisco, California, USA", icon: "📍" },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl shadow-sm border flex items-start gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-sm border">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input className="w-full border p-3 rounded-lg" placeholder="Your Name" required />
              <input className="w-full border p-3 rounded-lg" placeholder="Email Address" required />
              <textarea rows="4" className="w-full border p-3 rounded-lg" placeholder="Your Message" required></textarea>
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
