import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    price: '',
  });

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const price = queryParams.get('price') ?? '';
    setFormData((prevData) => ({ ...prevData, price }));
  }, [location]);

  // const handleChange = (e: { target: { name: any; value: any; }; }) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log(formData);
  };

  const toggleAccordion = (targetId: string) => {
    const accordionItems = document.querySelectorAll('[data-accordion="collapse"] > div');
    accordionItems.forEach((item) => {
      const button = item.querySelector('button');
      const body = item.querySelector('div');
      if (body && body.id !== targetId) {
        body.classList.add('hidden');
        if (button) {
          button.setAttribute('aria-expanded', 'false');
        }
      } else if (body && body.id === targetId) {
        const expanded = body.classList.toggle('hidden');
        if (button) {
          button.setAttribute('aria-expanded', (!expanded).toString());
        }
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-black">Payment Details</h2>
        
        {/* Price Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-2">Price: ₹ <span style={{color: 'green', fontWeight: 'bold'}}> {formData.price} </span> </h3>
        </div>
        
        {/* Accordion for Payment Options */}
        <div id="accordion-collapse" data-accordion="collapse">
          <div>
            <h2 id="accordion-collapse-heading-1">
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-black border border-b-0 rounded-t-xl focus:ring-gray-200  gap-3"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-1"
                onClick={() => toggleAccordion('accordion-collapse-body-1')}
              >
                <span>QR</span>
                <svg
                  className="w-3 h-3 rotate-180 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                </svg>
              </button>
            </h2>
            <div id="accordion-collapse-body-1" className="hidden" aria-labelledby="accordion-collapse-heading-1">
              <div className="p-5 border border-b-0 border-gray-200">
                <p className="mb-2 text-gray-500 dark:text-gray-400">Information about paying via QR code.</p>
                <p className="text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque elit ac libero lacinia mollis.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 id="accordion-collapse-heading-2">
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-black border border-b-0 border-gray-200 focus:ring-gray-200 dark:focus:ring-gray-800 gap-3"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-2"
                onClick={() => toggleAccordion('accordion-collapse-body-2')}
              >
                <span>Debit Card</span>
                <svg
                  className="w-3 h-3 rotate-180 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                </svg>
              </button>
            </h2>
            <div id="accordion-collapse-body-2" className="hidden" aria-labelledby="accordion-collapse-heading-2">
              <div className="p-5 border border-b-0 border-gray-200">
                <p className="mb-2 text-gray-500 dark:text-gray-400">Information about paying via Debit Card.</p>
                <p className="text-gray-500 dark:text-gray-400">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 id="accordion-collapse-heading-3">
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-black border border-gray-200 focus:ring-gray-200 dark:focus:ring-gray-800 gap-3"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-3"
                onClick={() => toggleAccordion('accordion-collapse-body-3')}
              >
                <span>Credit Card</span>
                <svg
                  className="w-3 h-3 rotate-180 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                </svg>
              </button>
            </h2>
            <div id="accordion-collapse-body-3" className="hidden" aria-labelledby="accordion-collapse-heading-3">
              <div className="p-5 border border-gray-200 ">
                <p className="mb-2 text-gray-500 dark:text-gray-400">Information about paying via Credit Card.</p>
                <p className="text-gray-500 dark:text-gray-400">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          {/* Input fields for card details */}
        </form>
      </div>
    </div>
  );
};

export default Payment;
