"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  Shield,
  Globe,
  TrendingUp,
  Package,
  Ship,
  Plane,
  IndianRupee,
  Download,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/layout/header";

export default function IECPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    pan: "",
    businessType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-500/5 via-background to-green-500/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
                <span className="text-blue-500 font-semibold text-sm">Import Export License</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Import Export Code (IEC)
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Get your IEC number and start importing or exporting goods and services. A mandatory 10-digit code issued by DGFT for international trade businesses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="group" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Apply for IEC
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Lifetime Validity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Quick Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Expert Support</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <Globe className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-semibold text-foreground">Global Trade</p>
                        <p className="text-sm text-muted-foreground">Import/Export Worldwide</p>
                      </div>
                    </div>
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <Ship className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-semibold text-foreground">Customs Clearance</p>
                        <p className="text-sm text-muted-foreground">Seamless Processing</p>
                      </div>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <Plane className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-semibold text-foreground">Business Expansion</p>
                        <p className="text-sm text-muted-foreground">International Markets</p>
                      </div>
                    </div>
                    <CheckCircle className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple & <span className="text-primary">Transparent Pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              All-inclusive IEC registration package
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-green-600 border-2 border-blue-500 rounded-2xl p-10 hover:shadow-2xl transition-all">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2 text-white">IEC Registration</h3>
                <p className="text-white/80">Complete registration package</p>
              </div>
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 text-white">
                  <IndianRupee className="h-8 w-8" />
                  <span className="text-6xl font-bold">2,499</span>
                </div>
                <p className="text-white/80 mt-2">One-time payment • Lifetime validity</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">IEC Number Generation</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Digital Signature (if required)</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Complete Documentation Support</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">DGFT Portal Filing</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">IEC Certificate Download</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Expert Consultation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Benefits of <span className="text-primary">IEC Code</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Why you need an Import Export Code for your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "International Trade",
                desc: "Legally import and export goods and services across borders",
                color: "blue"
              },
              {
                icon: Ship,
                title: "Customs Clearance",
                desc: "Mandatory for customs clearance at ports and airports",
                color: "green"
              },
              {
                icon: TrendingUp,
                title: "Business Growth",
                desc: "Expand your business to international markets",
                color: "purple"
              },
              {
                icon: Shield,
                title: "Legal Compliance",
                desc: "Comply with DGFT regulations and avoid penalties",
                color: "red"
              },
              {
                icon: Package,
                title: "Export Benefits",
                desc: "Avail government export promotion schemes",
                color: "orange"
              },
              {
                icon: FileText,
                title: "Bank Transactions",
                desc: "Required for foreign currency transactions",
                color: "cyan"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${benefit.color}-500/10 mb-4`}>
                  <benefit.icon className={`h-6 w-6 text-${benefit.color}-500`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Required <span className="text-primary">Documents</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Documents needed for IEC registration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                For Proprietorship
              </h3>
              <ul className="space-y-3">
                {[
                  "PAN Card of Proprietor",
                  "Aadhaar Card",
                  "Bank Account Details",
                  "Business Address Proof",
                  "Passport Size Photo",
                  "Email ID & Mobile Number"
                ].map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                For Company/LLP
              </h3>
              <ul className="space-y-3">
                {[
                  "PAN Card of Company/LLP",
                  "Certificate of Incorporation",
                  "MOA & AOA / LLP Agreement",
                  "Board Resolution",
                  "Bank Account Certificate",
                  "Director/Partner Details"
                ].map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Important Information</h3>
                  <p className="text-sm text-muted-foreground">
                    IEC code has lifetime validity and doesn't need renewal. PAN-based IEC is a 10-digit code same as your PAN. Digital Signature is required only if you opt for physical certificate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Registration <span className="text-primary">Process</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Get your IEC in just 5-7 working days
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Document Submission",
                desc: "Submit required documents and business details",
                time: "Day 1"
              },
              {
                step: "02",
                title: "Application Preparation",
                desc: "We prepare and verify your IEC application",
                time: "Day 1-2"
              },
              {
                step: "03",
                title: "DGFT Portal Filing",
                desc: "Application filed on DGFT portal with digital signature",
                time: "Day 2-3"
              },
              {
                step: "04",
                title: "Processing & Verification",
                desc: "DGFT processes and verifies the application",
                time: "Day 3-5"
              },
              {
                step: "05",
                title: "IEC Certificate",
                desc: "Download IEC certificate from DGFT portal",
                time: "Day 5-7"
              }
            ].map((process, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{process.step}</span>
                </div>
                <div className="flex-1 bg-card border border-border/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{process.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {process.time}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{process.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Apply for <span className="text-primary">IEC Registration</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Fill out the form below and our expert will contact you within 24 hours
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name *</label>
                  <Input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your business name"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">PAN Number</label>
                  <Input
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="proprietorship">Sole Proprietorship</option>
                    <option value="partnership">Partnership Firm</option>
                    <option value="llp">Limited Liability Partnership (LLP)</option>
                    <option value="private">Private Limited Company</option>
                    <option value="public">Public Limited Company</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Plan Selection *</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background" required>
                  <option value="">Choose your plan</option>
                  <option value="iec">IEC Registration - ₹2,499 (One-time)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tell us about your business</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What products/services do you plan to import/export? Any specific requirements..."
                  rows={3}
                />
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1" />
                <label className="text-sm text-muted-foreground">
                  I agree to the Terms & Conditions and authorize Turn2Law to contact me via phone/email *
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Submit Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is IEC and who needs it?",
                a: "Import Export Code (IEC) is a 10-digit code issued by DGFT. Any person/entity wanting to import or export goods/services needs IEC. It's mandatory for customs clearance."
              },
              {
                q: "Is IEC valid for lifetime?",
                a: "Yes, IEC has lifetime validity. Once issued, it doesn't need renewal. However, you must update it if there are changes in business details."
              },
              {
                q: "Can I use IEC for all types of imports/exports?",
                a: "Yes, single IEC can be used for all types of import-export activities across all ports and customs locations in India."
              },
              {
                q: "How long does IEC registration take?",
                a: "Typically 5-7 working days from document submission. If documents are complete and accurate, it can be faster."
              },
              {
                q: "Do I need GST registration for IEC?",
                a: "GST registration is not mandatory for IEC, but most businesses involved in import-export activities also register for GST."
              },
              {
                q: "What happens if I don't have IEC?",
                a: "Without IEC, you cannot clear goods through customs, cannot receive foreign currency payments, and cannot avail export benefits."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-card border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
