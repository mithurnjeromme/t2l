import { Clock, Handshake, Banknote, Video } from "lucide-react";
import Image from "next/image";

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
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0">
            <h2 className="text-4xl font-body font-semibold mb-6">
              What's <span className="text-primary">Turn2Law</span> ?
            </h2>
            <p className="text-foreground/80 leading-relaxed font-body text-base mb-8">
              Turn2Law is a next-generation legal platform designed to simplify
              access to legal services for everyone. Whether you're facing an
              emergency, drafting critical documents, or seeking legal advice,
              Turn2Law connects you to trusted professionals and resources
              instantly. With features like on-demand lawyer matching, and a
              comprehensive resource library, Turn2Law bridges the gap between
              legal expertise and accessibility. Our mission is to make justice
              accessible, affordable, and efficient for individuals and
              businesses alike.
            </p>
          </div>
          <div className="relative h-64 bg-muted rounded-2xl overflow-hidden border border-border/30 flex-shrink-0">
            <Image
              src="/images/what's turn2law.png"
              alt="Turn2Law Legal Services Illustration"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectPosition: 'center 35%' }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between h-full" style={{ minHeight: 'fit-content' }}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl mt-1 flex-shrink-0">
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-body font-semibold text-foreground dark:text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground dark:text-white/90 font-body text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
