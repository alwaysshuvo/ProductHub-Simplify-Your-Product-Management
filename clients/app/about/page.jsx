export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-100 via-white to-purple-100">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold text-gray-900">
            About <span className="text-green-600">ProductHub</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
            Welcome to ProductHub, your one-stop destination for top-quality tech gadgets.
            From smart accessories to innovative devices, we bring the best products with unbeatable prices.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          {[
            {
              title: "Top Quality Products",
              desc: "We handpick products from trusted manufacturers to ensure quality and performance.",
              icon: "📦"
            },
            {
              title: "Best Price Guarantee",
              desc: "Enjoy premium gadgets at fair pricing with exclusive member discounts.",
              icon: "💰"
            },
            {
              title: "Customer Satisfaction",
              desc: "We value our customers and provide 24/7 support to enhance shopping experience.",
              icon: "⚡"
            },
          ].map((item, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl shadow-sm border hover:shadow-lg transition">
              <div className="text-5xl">{item.icon}</div>
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            ProductHub aims to revolutionize online gadget shopping by offering top-grade products,
            secure payments, fast delivery, and smart inventory for vendors.
          </p>
        </div>
      </section>
    </div>
  );
}
