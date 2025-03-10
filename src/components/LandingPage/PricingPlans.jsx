import { Link } from "react-router-dom";
import ShapeFive from "./Shapes/ShapeFive.jsx";
import ShapeSix from "./Shapes/ShapeSix.jsx";

const plans = [
  {
    name: "Personal",
    price: "$59",
    description: "Perfect for using in a personal website or a client project.",
    features: [
      "1 User",
      "All UI components",
      "Lifetime access",
      "Free updates",
      "Use on 1 (one) project",
      "3 Months support",
    ],
    button: {
      text: "Choose Personal",
    },
  },
  {
    popular: true,
    name: "Business",
    price: "$199",
    description: "Perfect for using in a Business website or a client project.",
    features: [
      "5 Users",
      "All UI components",
      "Lifetime access",
      "Free updates",
      "Use on 3 (Three) project",
      "4 Months support",
    ],
    button: {
      text: "Choose Business",
    },
  },
  {
    name: "Professional",
    price: "$256",
    description:
      "Perfect for using in a Professional website or a client project.",
    features: [
      "Unlimited Users",
      "All UI components",
      "Lifetime access",
      "Free updates",
      "Use on Unlimited project",
      "12 Months support",
    ],
    button: {
      text: "Choose Professional",
    },
  },
];

const PricingPlans = () => {
  return (
    <>
      <section className="overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                <span className="mb-2 block text-lg font-semibold text-primary">
                  Pricing Table
                </span>
                <h2 className="mb-3 text-3xl font-bold leading-[1.208] text-dark dark:text-white sm:text-4xl md:text-[40px]">
                  Our Pricing Plan
                </h2>
                <p className="text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <div className="-mx-4 flex flex-wrap justify-center">
            {plans.map((item, index) => (
              <div key={index} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-2 border-stroke bg-white px-8 py-10 shadow-pricing dark:border-dark-3 dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
                  <span className="mb-3 block text-lg font-semibold text-primary">
                    {item.name}
                  </span>
                  <h2 className="mb-5 text-[42px] font-bold text-dark dark:text-white">
                    <span>{item.price}</span>
                    <span className="text-base font-medium text-body-color dark:text-dark-6">
                      / year
                    </span>
                  </h2>
                  <p className="mb-8 border-b border-stroke pb-8 text-base text-body-color dark:border-dark-3 dark:text-dark-6">
                    {item.description}
                  </p>
                  <div className="mb-9 flex flex-col gap-[14px]">
                    {item.features.map((feature, featureIndex) => (
                      <p
                        key={featureIndex}
                        className="text-base text-body-color dark:text-dark-6"
                      >
                        {feature}
                      </p>
                    ))}
                  </div>
                  <Link
                    to={item.button.link}
                    className={`${item.popular ? "border-primary bg-primary text-white hover:bg-opacity-90" : "border-stroke bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3"} block w-full rounded-md border p-3 text-center text-base font-medium text-primary transition`}
                  >
                    {item.button.text}
                  </Link>

                  <div>
                    <span className="absolute right-0 top-7 z-[-1]">
                      <ShapeFive />
                    </span>
                    <span className="absolute right-4 top-4 z-[-1]">
                      <ShapeSix />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPlans;
