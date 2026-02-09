"use client";
const Banner = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background">
      <div className="w-full bg-[#DF9C49] dark:bg-[#008882] py-3 sm:py-4 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <div className="inline-flex items-center gap-8 sm:gap-12 md:gap-16 text-white dark:text-white">
            {[
              "SELECT FROM EXPERT LAWYERS",
              "TRUSTED BY 100+ USERS",
              "MADE FOR INDIANS",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white rounded-full"></div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold font-body tracking-wide">
                  {text}
                </span>
              </div>
            ))}

            {/* Duplicate for seamless scroll */}
            {[
              "SELECT FROM EXPERT LAWYERS",
              "TRUSTED BY 100+ USERS",
              "MADE FOR INDIANS",
            ].map((text, i) => (
              <div
                key={`dup-${i}`}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white rounded-full"></div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold font-body tracking-wide">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation style */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          display: inline-block;
          animation: scroll 20s linear infinite;
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation-duration: 30s; /* slower on mobile */
          }
        }
      `}</style>
    </section>
  );
};

export default Banner;
