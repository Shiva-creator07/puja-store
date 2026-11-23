import { SITE } from "@/lib/site";

export type InfoSection = { heading: string; body: string[] };
export type InfoPageData = {
  title: string;
  intro: string;
  sections: InfoSection[];
};

export const INFO_PAGES: Record<string, InfoPageData> = {
  about: {
    title: "About Us",
    intro: `${SITE.name} is an online shop for puja samagri, festival kits and daily puja items.`,
    sections: [
      {
        heading: "Who we are",
        body: [
          `We started ${SITE.name} to make it easy to find everything you need for your puja in one place, with clear prices and simple ordering.`,
        ],
      },
      {
        heading: "What we sell",
        body: [
          "Puja kits for festivals and ceremonies, everyday puja essentials, wicks and oil, diyas, thalis and other accessories, and temple decor.",
          "Every product page shows the price, the MRP where it applies and the stock available, so you know exactly what you are ordering.",
        ],
      },
      {
        heading: "Our promise",
        body: [
          `We pack every order with care and aim to dispatch it within ${SITE.dispatchTime}. If anything is wrong with your order, write to us and we will help you resolve it.`,
        ],
      },
    ],
  },

  contact: {
    title: "Contact Us",
    intro:
      "We are happy to help with your order or any question about our products.",
    sections: [
      {
        heading: "Talk to us",
        body: [
          `Phone: ${SITE.phone}`,
          `Email: ${SITE.email}`,
          `Hours: ${SITE.hours}`,
        ],
      },
      { heading: "Our address", body: [SITE.address] },
      {
        heading: "Order questions",
        body: [
          "When you write to us about an order, please include your order number (it looks like TPS-00001) and the mobile number used for the order, so we can help you faster.",
        ],
      },
    ],
  },

  "shipping-policy": {
    title: "Shipping and Delivery Policy",
    intro: "This page explains how and when we deliver your order.",
    sections: [
      {
        heading: "Dispatch",
        body: [
          `Orders are usually dispatched within ${SITE.dispatchTime} of being confirmed.`,
          "Orders placed on Sundays and public holidays are processed on the next working day.",
        ],
      },
      {
        heading: "Delivery time",
        body: [
          `Delivery usually takes ${SITE.deliveryTime}, depending on your location and the courier service.`,
          "Delivery times are estimates and can be affected by weather, festivals and courier delays.",
        ],
      },
      {
        heading: "Delivery charges",
        body: ["Delivery charges, if any, are confirmed before dispatch."],
      },
      {
        heading: "Delivery address",
        body: [
          "Please enter a complete address with the correct pincode and a mobile number that can be reached. Delays caused by incorrect or incomplete details may not be avoidable.",
        ],
      },
      {
        heading: "Track your order",
        body: [
          `Write to us at ${SITE.email} with your order number and we will share the latest status.`,
        ],
      },
    ],
  },

  "return-policy": {
    title: "Return and Refund Policy",
    intro: "This page explains what to do if there is a problem with your order.",
    sections: [
      {
        heading: "Damaged or wrong items",
        body: [
          `If your order arrives damaged, defective or different from what you ordered, please contact us within ${SITE.returnDays} days of delivery with your order number and clear photos of the item and its packaging.`,
          "After we review your request, we will arrange a replacement or a refund.",
        ],
      },
      {
        heading: "Items we cannot take back",
        body: [
          "Because puja items are used in worship, we are unable to accept returns of items that have been opened, used or damaged after delivery, unless they were faulty on arrival.",
          "Consumable items such as camphor, incense, rice and wicks cannot be returned once opened.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Approved refunds are made to the original payment method. The time it takes to reach your account depends on your bank or payment provider.",
        ],
      },
      {
        heading: "Cancellations",
        body: [
          "You can cancel an order before it is dispatched by contacting us with your order number.",
        ],
      },
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    intro: `This policy explains what information ${SITE.name} collects and how we use it.`,
    sections: [
      {
        heading: "Information we collect",
        body: [
          "When you place an order we collect your name, email address, mobile number and delivery address.",
          "We also keep a record of the items you ordered and the order total.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "We use your information to process and deliver your order, to contact you about it, and to answer your questions.",
          "We do not sell your personal information.",
        ],
      },
      {
        heading: "Your cart",
        body: [
          "Your shopping cart is saved in your own browser, on your own device, so it is still there when you come back. It is not sent to us until you place an order.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "When online payment is offered, payments are processed by a payment partner. We do not store your card or UPI details on our servers.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We share your name, address and phone number with the courier service only as far as needed to deliver your order.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          `You can ask us to correct or delete your information by writing to ${SITE.email}. We may need to keep some order records as required by law.`,
        ],
      },
    ],
  },

  terms: {
    title: "Terms and Conditions",
    intro: "Please read these terms before using this website or placing an order.",
    sections: [
      {
        heading: "Using this site",
        body: [
          "By using this website and placing an order you agree to these terms.",
          "Please read them together with our shipping, return and privacy policies.",
        ],
      },
      {
        heading: "Prices and availability",
        body: [
          "Prices are in Indian rupees and are shown on each product page. We try to keep prices and stock accurate, but mistakes can happen. If a product is wrongly priced or out of stock, we may cancel the order and refund any amount paid.",
        ],
      },
      {
        heading: "Orders",
        body: [
          "An order is confirmed only after we accept it. We may decline or cancel an order, for example if an item is unavailable or the details are incomplete.",
        ],
      },
      {
        heading: "Product information",
        body: [
          "Product descriptions and images are for guidance. Small differences in colour, size or finish can occur.",
        ],
      },
      {
        heading: "Governing law",
        body: ["These terms are governed by the laws of India."],
      },
      {
        heading: "Contact",
        body: [`Questions about these terms can be sent to ${SITE.email}.`],
      },
    ],
  },
};