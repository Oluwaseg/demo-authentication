const Footer = () => {
  return (
    <>
      <footer className=" text-white bg-black bg-opacity-20">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="footer-title text-[#f2f2f2]  ">Company</h2>
              <ul className="list-none">
                <li>
                  <a className="link link-hover" href="#about">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="link link-hover" href="#services">
                    Services
                  </a>
                </li>
                <li>
                  <a className="link link-hover" href="#contact">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer-title text-[#f2f2f2] ">Support</h2>
              <ul className="list-none">
                <li>
                  <a className="link link-hover" href="#faq">
                    FAQ
                  </a>
                </li>
                <li>
                  <a className="link link-hover" href="#help">
                    Help Center
                  </a>
                </li>
                <li>
                  <a className="link link-hover" href="#privacy">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer-title text-[#f2f2f2] ">Social</h2>
              <ul className="list-none">
                <li>
                  <a className="link link-hover" href="#facebook">
                    Facebook
                  </a>
                </li>
                <li>
                  <a className="link link-hover" href="#twitter">
                    Twitter
                  </a>
                </li>
                <li>
                  <a className="link link-hover" href="#instagram">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white pt-4 text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} Your Company. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
