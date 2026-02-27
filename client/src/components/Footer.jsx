const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-icons text-white text-lg">restaurant</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">GourmetExpress</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Elevating your dining experience through curated restaurant selections and lightning-fast delivery.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                <span className="material-icons text-lg">facebook</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                <span className="material-icons text-lg">camera_alt</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                <span className="material-icons text-lg">alternate_email</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Restaurant Partners</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Corporate Accounts</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Gift Cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Refund Policy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Administrator</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-primary transition-colors" href="#">Restaurant Dashboard</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Courier Login</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Merchant Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2024 GourmetExpress Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;