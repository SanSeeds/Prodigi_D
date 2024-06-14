function SalesScriptService(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl space-y-4">
        <div>
          <label htmlFor="company-details" className="block text-sm font-medium text-gray-700">Company Details</label>
          <textarea
            id="company-details"
            name="company-details"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={2} // Corrected to use rows as a number
          ></textarea>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="number-of-words" className="block text-sm font-medium text-gray-700">Number of words</label>
            <input
              type="text"
              id="number-of-words"
              name="number-of-words"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="product-descriptions" className="block text-sm font-medium text-gray-700">Names and descriptions of the products or services being sold</label>
            <textarea
              id="product-descriptions"
              name="product-descriptions"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2} // Corrected to use rows as a number
            ></textarea>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="features-benefits" className="block text-sm font-medium text-gray-700">Key features and benefits of each product or service</label>
            <textarea
              id="features-benefits"
              name="features-benefits"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2} // Corrected to use rows as a number
            ></textarea>
          </div>
          <div>
            <label htmlFor="pricing-information" className="block text-sm font-medium text-gray-700">Pricing information, if relevant</label>
            <textarea
              id="pricing-information"
              name="pricing-information"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2} // Corrected to use rows as a number
            ></textarea>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="promotions" className="block text-sm font-medium text-gray-700">Any current promotions, discounts, or special offers</label>
            <textarea
              id="promotions"
              name="promotions"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2} // Corrected to use rows as a number
            ></textarea>
          </div>
          <div>
            <label htmlFor="target-audience" className="block text-sm font-medium text-gray-700">Target Audience</label>
            <textarea
              id="target-audience"
              name="target-audience"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2} // Corrected to use rows as a number
            ></textarea>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sales-objectives" className="block text-sm font-medium text-gray-700">Sales Objectives</label>
            <textarea
              id="sales-objectives"
              name="sales-objectives"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2} // Corrected to use rows as a number
            ></textarea>
          </div>
          <div>
            <label htmlFor="tone-style" className="block text-sm font-medium text-gray-700">Desired tone and style of the script</label>
            <textarea
              id="tone-style"
              name="tone-style"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2} // Corrected to use rows as a number
            ></textarea>
          </div>
        </div>
        <div>
          <label htmlFor="competitive-advantage" className="block text-sm font-medium text-gray-700">Competitive Advantage</label>
          <textarea
            id="competitive-advantage"
            name="competitive-advantage"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={2} // Corrected to use rows as a number
          ></textarea>
        </div>
        <div>
          <label htmlFor="testimonials" className="block text-sm font-medium text-gray-700">Testimonials or success stories to include for credibility</label>
          <textarea
            id="testimonials"
            name="testimonials"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={2} // Corrected to use rows as a number
          ></textarea>
        </div>
        <div>
          <label htmlFor="compliance" className="block text-sm font-medium text-gray-700">Compliance and Legal Considerations</label>
          <textarea
            id="compliance"
            name="compliance"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={2} // Corrected to use rows as a number
          ></textarea>
        </div>
        <div>
          <label htmlFor="tech-integration" className="block text-sm font-medium text-gray-700">Technological Integration</label>
          <textarea
            id="tech-integration"
            name="tech-integration"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={2} // Corrected to use rows as a number
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalesScriptService;