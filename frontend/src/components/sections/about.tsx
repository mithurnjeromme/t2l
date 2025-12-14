import { Clock, Handshake, Banknote, Video } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Instant legal services",
    description:
      "Get agreements, contracts, NDAs, and other legal documents quickly with transparent, fixed pricing.",
    iconColor: "text-[#DF9C49]", // Golden color for icon
  },
  {
    icon: Handshake,
    title: "Lawyer Matching System",
    description:
      "Connect with expert lawyers tailored to your specific legal needs for seamless support.",
    iconColor: "text-[#DF9C49]", // Golden color for icon
  },
  {
    icon: Banknote,
    title: "Affordable subscriptions.",
    description:
      "Choose cost-effective plans for lawyers and clients with exclusive benefits and no hidden fees.",
    iconColor: "text-[#DF9C49]", // Golden color for icon
  },
  {
    icon: Video,
    title: "Virtual consulting.",
    description:
      "Access expert legal advice and consultations anytime, anywhere, from the comfort of your home.",
    iconColor: "text-[#DF9C49]", // Golden color for icon
  },
];

const About = () => {
  return (
    <section id="about" className="pt-16 md:pt-20 pb-12 md:pb-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left side - Heading and Description with decorative elements */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-4xl md:text-5xl font-body font-bold leading-tight">
                What's <span className="text-primary">Turn2Law</span>?
              </h2>
              <p className="text-foreground/80 leading-relaxed font-body text-base md:text-lg">
                A next-generation legal platform connecting you to trusted professionals and resources instantly, making justice accessible and affordable for all.
              </p>
            </div>

            {/* Decorative stats or highlight cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm md:text-base text-foreground/70 font-medium">Legal Support</div>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm md:text-base text-foreground/70 font-medium">Expert Lawyers</div>
              </div>
            </div>

            {/* Additional decorative element */}
            <div className="hidden md:block relative">
              <div className="absolute -left-4 top-0 w-1 h-24 bg-gradient-to-b from-primary to-primary/0 rounded-full"></div>
              <div className="pl-8 space-y-2">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">Our Mission</p>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Bridging the gap between legal expertise and accessibility through innovative technology.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Features (unchanged) */}
          <div className="flex flex-col justify-between h-full" style={{ minHeight: 'fit-content' }}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl mt-1 flex-shrink-0">
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-body font-semibold text-foreground mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
