import React from 'react';

const WhatsAppSupportButton: React.FC = () => {
  const WHATSAPP_NUMBER = '918260607991'; // Replace with actual number
  const MESSAGE = encodeURIComponent("Namaste! I'm interested in Taste Of Odisha products. Can you help me?");

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 group"
      aria-label="Contact support on WhatsApp"
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.559.925 3.397 1.414 5.27 1.415 5.513 0 10.003-4.489 10.005-10.003.001-2.671-1.041-5.182-2.934-7.076-1.892-1.893-4.403-2.934-7.075-2.935-5.512 0-10.002 4.49-10.005 10.003-.001 1.84.481 3.639 1.396 5.234l-.888 3.243 3.331-.873v.001zm11.367-7.234c-.312-.156-1.848-.911-2.134-1.015-.286-.104-.494-.156-.701.156-.207.312-.805 1.015-.986 1.221-.182.207-.363.234-.675.078-.312-.156-1.316-.484-2.507-1.547-.927-.827-1.552-1.849-1.734-2.161-.182-.312-.019-.481.136-.636.141-.139.312-.363.468-.545.156-.182.208-.312.312-.519.104-.208.052-.389-.026-.545-.078-.156-.701-1.689-.961-2.313-.254-.607-.512-.525-.701-.535-.181-.009-.389-.011-.597-.011s-.545.078-.831.389c-.286.312-1.091 1.066-1.091 2.599s1.117 3.013 1.272 3.221c.156.208 2.199 3.358 5.326 4.706.744.321 1.325.512 1.776.656.748.238 1.428.204 1.966.124.599-.089 1.848-.754 2.108-1.481.261-.727.261-1.351.182-1.481-.078-.131-.286-.208-.598-.364z" />
      </svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium">
        Support
      </span>
    </a>
  );
};

export default WhatsAppSupportButton;
