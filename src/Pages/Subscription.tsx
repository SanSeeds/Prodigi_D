import { Link } from "react-router-dom";

const Subscription = () => {
  const plans = [
      { name: "1 Month plan", price: 299 },
      { name: "6 Months plan", price: 1499 },
      { name: "12 Months plan", price: 2699 }
  ];

  return (
      <>
          <div className="flex justify-center items-center mt-10 mb-5 flex-col">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-black">Choose Your Plan</h1>
          </div>
          <div className="flex justify-center items-center mt-12">
              {plans.map((plan, index) => (
                  <div key={index} className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mx-4">
                      <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{plan.name}</h5>
                      <div className="flex items-baseline text-gray-900 dark:text-black">
                          <span className="text-3xl font-semibold">₹</span>
                          <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                          <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                      <Link to={`/payment?plan=${plan.name}`}>
                          <button type="button" className="mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Choose plan</button>
                      </Link>
                  </div>
              ))}
          </div>
      </>
  );
};

export default Subscription;
