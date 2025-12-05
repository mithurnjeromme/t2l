"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/header";
import {
  CheckCircle,
  FileText,
  Shield,
  TrendingUp,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Ship,
  IndianRupee,
  Package,
} from "lucide-react";

export default function IECPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    pan: "",
    selectedPlan: "",
    message: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please agree to the terms and conditions");
      return;
    }
    setIsSubmitting(true);
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
    setTimeout(() => {
      alert("Application submitted successfully! We'll contact you shortly.");
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        businessType: "",
        pan: "",
        selectedPlan: "",
        message: "",
        consent: false,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Globe className="w-4 h-4" />
                Registrations & Licenses
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Import Export Code (IEC)
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Start your import/export business with an IEC registration. Mandatory for international trade, valid for a lifetime. Quick processing and expert support.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Lifetime Validity</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>No Renewal Required</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Expert Guidance</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Ship className="w-32 h-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple & Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One-time fee with lifetime validity. No hidden charges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Basic IEC</h3>
                <p className="text-muted-foreground">Essential IEC registration for startups</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="w-6 h-6 text-muted-foreground" />
                  <span className="text-4xl font-bold text-foreground">2,999</span>
                  <span className="text-muted-foreground">(one-time)</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">IEC Number Registration</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">Document Preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">Application Filing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">Certificate Delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">Email Support</span>
                </li>
              </ul>
            </div>

            {/* Premium Plan */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4">
                <span className="bg-primary-foreground text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium IEC</h3>
                <p className="text-primary-foreground/80">Complete IEC package with compliance</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="w-6 h-6" />
                  <span className="text-4xl font-bold">4,999</span>
                  <span className="text-primary-foreground/80">(one-time)</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>All Basic Plan features</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Priority Processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>PAN-IEC Linking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Compliance Checklist</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Dedicated Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Post-Registration Guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Documents Required
            </h2>
            <p className="text-lg text-muted-foreground">
              Keep these documents ready for a smooth registration process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">PAN Card</h3>
              <p className="text-muted-foreground">PAN card of the applicant (proprietor/directors)</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">ID & Address Proof</h3>
              <p className="text-muted-foreground">Aadhaar card/passport and current address proof</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Bank Certificate</h3>
              <p className="text-muted-foreground">Cancelled cheque or bank account certificate</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Business PAN</h3>
              <p className="text-muted-foreground">PAN card of your business entity (if applicable)</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Passport Photo</h3>
              <p className="text-muted-foreground">Recent passport-sized photograph</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Digital Signature</h3>
              <p className="text-muted-foreground">DSC (Digital Signature Certificate) of applicant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Registration Process
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple 4-step process to get your IEC certificate
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="inline-block md:block">
                    <h3 className="text-xl font-bold text-foreground mb-2">1. Submit Application</h3>
                    <p className="text-muted-foreground">Fill out the form and provide required documents</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                    1
                  </div>
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Step 2 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:block" />
                <div className="relative flex items-center justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10 md:absolute md:right-1/2 md:translate-x-1/2">
                    2
                  </div>
                </div>
                <div className="md:order-first">
                  <h3 className="text-xl font-bold text-foreground mb-2">2. Document Verification</h3>
                  <p className="text-muted-foreground">We verify all documents and prepare your application</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="inline-block md:block">
                    <h3 className="text-xl font-bold text-foreground mb-2">3. Application Filing</h3>
                    <p className="text-muted-foreground">We file your IEC application with DGFT portal</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                    3
                  </div>
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Step 4 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:block" />
                <div className="relative flex items-center justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10 md:absolute md:right-1/2 md:translate-x-1/2">
                    4
                  </div>
                </div>
                <div className="md:order-first">
                  <h3 className="text-xl font-bold text-foreground mb-2">4. Receive IEC Certificate</h3>
                  <p className="text-muted-foreground">Get your IEC certificate in 7-10 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Get an IEC?
            </h2>
            <p className="text-lg text-muted-foreground">
              Essential benefits for your import/export business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Mandatory for Trade</h3>
              <p className="text-muted-foreground">
                IEC is mandatory for importing/exporting goods or services from India
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Lifetime Validity</h3>
              <p className="text-muted-foreground">
                Once issued, IEC is valid for a lifetime with no renewal requirements
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Business Expansion</h3>
              <p className="text-muted-foreground">
                Open doors to global markets and expand your business internationally
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Custom Clearance</h3>
              <p className="text-muted-foreground">
                Required for customs clearance of imported and exported goods
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No Compliance Burden</h3>
              <p className="text-muted-foreground">
                No annual returns or periodic filings required after registration
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quick Processing</h3>
              <p className="text-muted-foreground">
                Fast online application process with minimal paperwork
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-card border border-border rounded-lg p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-foreground">
                What is an Import Export Code (IEC)?
                <span className="ml-4 shrink-0">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                IEC is a 10-digit unique code issued by the Directorate General of Foreign Trade (DGFT) to Indian companies for importing or exporting goods and services. It is mandatory for international trade.
              </p>
            </details>

            <details className="group bg-card border border-border rounded-lg p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-foreground">
                Who needs an IEC registration?
                <span className="ml-4 shrink-0">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Any individual, proprietorship, partnership, company, or LLP that wants to import or export goods or services from India needs an IEC. It is mandatory for customs clearance.
              </p>
            </details>

            <details className="group bg-card border border-border rounded-lg p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-foreground">
                How long does it take to get an IEC?
                <span className="ml-4 shrink-0">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Once all documents are submitted and verified, the IEC is typically issued within 7-10 business days. With our premium plan, we expedite the process.
              </p>
            </details>

            <details className="group bg-card border border-border rounded-lg p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-foreground">
                Is IEC valid for a lifetime?
                <span className="ml-4 shrink-0">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Yes, IEC has lifetime validity and does not require any renewal. However, you need to update your IEC if there are changes in your business details (like address, bank account, etc.).
              </p>
            </details>

            <details className="group bg-card border border-border rounded-lg p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-foreground">
                Can I use one IEC for multiple businesses?
                <span className="ml-4 shrink-0">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                One IEC is issued per PAN. If you have multiple businesses with the same PAN, you can use the same IEC. However, if different entities have different PANs, each needs a separate IEC.
              </p>
            </details>

            <details className="group bg-card border border-border rounded-lg p-6 cursor-pointer">
              <summary className="flex justify-between items-center font-semibold text-foreground">
                Are there any annual compliance requirements for IEC?
                <span className="ml-4 shrink-0">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                No, there are no annual returns or periodic filings required for IEC. You only need to update it if your business details change.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Apply for IEC Registration
            </h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and our team will reach out to you shortly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="rounded-lg"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-foreground mb-2">
                  Business Name *
                </label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-foreground mb-2">
                  Business Type *
                </label>
                <select
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">Select business type</option>
                  <option value="proprietorship">Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="llp">LLP</option>
                  <option value="private-limited">Private Limited</option>
                  <option value="public-limited">Public Limited</option>
                </select>
              </div>

              <div>
                <label htmlFor="pan" className="block text-sm font-medium text-foreground mb-2">
                  PAN Number *
                </label>
                <Input
                  id="pan"
                  type="text"
                  placeholder="ABCDE1234F"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  required
                  className="rounded-lg"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label htmlFor="selectedPlan" className="block text-sm font-medium text-foreground mb-2">
                Select Plan *
              </label>
              <select
                id="selectedPlan"
                value={formData.selectedPlan}
                onChange={(e) => setFormData({ ...formData, selectedPlan: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="">Choose a plan</option>
                <option value="basic">Basic IEC - ₹2,999</option>
                <option value="premium">Premium IEC - ₹4,999</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Additional Information (Optional)
              </label>
              <Textarea
                id="message"
                placeholder="Any specific requirements or questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="rounded-lg"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                required
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground">
                I agree to the Terms & Conditions and authorize Turn2Law to contact me via phone/email *
              </label>
            </div>
            
            <Button type="submit" size="lg" className="w-full rounded-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your International Trade Journey?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">Get your IEC registration today and unlock global opportunities</p>
          <Button size="lg" variant="secondary" className="rounded-full" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
            Get Started
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto max-w-7xl text-center text-muted-foreground">
          <p>© 2025 Turn2Law. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
