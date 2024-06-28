import { Link } from "react-router-dom";

const Subscription = () => {
  const plans = [
    { name: "Basic plan", price: 500, features: ["1 Device"], unavailable: ["API Access", "Complete documentation", "24×7 phone & email support"] },
    { name: "Standard plan", price: 1000, features: ["2 Devices", "API Access"], unavailable: ["Complete documentation", "24×7 phone & email support"] },
    { name: "Premium plan", price: 2000, features: ["2 Devices", "API Access", "Complete documentation", "24×7 phone & email support"] }
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
            <ul role="list" className="space-y-5 my-7">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <svg className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 ms-3">{feature}</span>
                </li>
              ))}
              {(plan.unavailable ?? []).map((feature, i) => (
                <li key={i} className="flex line-through decoration-gray-500">
                  <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 ms-3">{feature}</span>
                </li>
              ))}
            </ul>
            <Link to={`/payment?price=${plan.price}`}>
              <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Choose plan</button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Subscription;
