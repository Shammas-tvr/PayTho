// src/components/common/Loader.jsx
const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D6EBF2]">
      <div className="text-center">
        <img
          src="/paytho-stamp-140x175-white.png"
          alt="Paytho ERP"
          className="w-20 mx-auto mb-6 opacity-90"
        />

        <div className="loader-bar mx-auto mb-4 w-40">
          <div className="loader-bar-fill"></div>
        </div>

        {message && (
          <p className="text-sm text-[#5A8898] font-medium tracking-wide">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;