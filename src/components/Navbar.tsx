import Link from "next/link";

export default function Navbar() {
  const links = [
    { href: '/', label: "📋 Home" },
    { href: "/dashboard", label: "📊 Dashboard" },
    { href: "/updateProduct", label: "📦 Products" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-2 md:p-6 md:max-w-md md:mx-auto md:space-y-6">
      <div className="flex justify-around md:grid md:grid-cols-3 md:gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            // `group` क्लास को पैरेंट `Link` पर जोड़ा गया है
            className="group block rounded-xl p-2 text-center font-semibold text-blue-600 hover:bg-blue-50 relative"
          >
            {/* यह `<span>` मोबाइल पर हमेशा दिखता है */}
            <span className="md:hidden">{link.label.split(' ')[0]}</span>

            {/* यह `<span>` मोबाइल पर `hover` करने पर दिखता है */}
            <span className="md:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1 px-2 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {link.label.split(' ')[1]}
            </span>

            {/* यह `<span>` डेस्कटॉप पर हमेशा दिखता है */}
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}