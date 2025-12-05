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
  FileCheck,
  Receipt,
  IndianRupee,
} from "lucide-react";

export default function GSTRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    turnover: "",
    message: "",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <FileCheck className="w-4 h-4" />
                Registrations & Licenses
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                GST Registration
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Get your GST registration done hassle-free! Mandatory for businesses with turnover above ₹40 lakhs (₹20 lakhs for services). Claim input tax credit and expand your business legally.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-primary">₹2,999</div>
                  <div className="text-sm text-muted-foreground">Starting From</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Online Process</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="space-y-4">
                {[
                  { icon: Receipt, title: "Legal Compliance", desc: "Comply with GST laws and avoid penalties" },
                  { icon: TrendingUp, title: "Input Tax Credit", desc: "Claim ITC and reduce tax liability" },
                  { icon: IndianRupee, title: "Business Growth", desc: "Work with registered businesses easily" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "BASIC",
                price: "₹2,999",
                features: ["GST Registration", "GSTIN Certificate", "Filing Assistance", "Expert Guidance", "Email Support"]
              },
              {
                name: "STANDARD",
                price: "₹4,999",
                popular: true,
                features: ["Everything in Basic", "Return Filing (3 Months)", "Invoice Generation Tool", "Priority Support", "Compliance Calendar"]
              },
              {
                name: "PREMIUM",
                price: "₹9,999",
                features: ["Everything in Standard", "Annual Return Filing", "Tax Planning", "Dedicated CA", "Audit Support"]
              }
            ].map((plan, idx) => (
              <div key={idx} className={`rounded-2xl p-8 ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'} hover:shadow-xl transition-shadow relative`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary px-4 py-1 rounded-full text-sm font-semibold">POPULAR</div>}
                <div className="text-sm font-semibold mb-2">{plan.name}</div>
                <div className="text-4xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-3">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Registration Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Submit Documents", desc: "Provide required documents and business details" },
              { step: "02", title: "Application Filing", desc: "We file your GST application on the portal" },
              { step: "03", title: "Verification", desc: "Tax department verifies your documents" },
              { step: "04", title: "GSTIN Issued", desc: "Receive your 15-digit GST number" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl font-bold text-primary/20 mb-2">{item.step}</div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Documents Required</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "PAN Card", desc: "Of business/proprietor" },
              { title: "Aadhaar Card", desc: "Of proprietor/partners" },
              { title: "Business Proof", desc: "Registration certificate" },
              { title: "Address Proof", desc: "Rent agreement/ownership" },
              { title: "Bank Details", desc: "Cancelled cheque/statement" },
              { title: "Photographs", desc: "Passport size" },
              { title: "Email & Mobile", desc: "Valid contact details" },
              { title: "Digital Signature", desc: "For companies/LLP" },
            ].map((doc, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <FileText className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{doc.title}</h3>
                <p className="text-sm text-muted-foreground">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Key Benefits of GST Registration</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Legal Recognition", desc: "Gain legal recognition and credibility for your business in the market" },
              { icon: TrendingUp, title: "Input Tax Credit", desc: "Claim ITC on purchases and reduce your overall tax liability significantly" },
              { icon: Receipt, title: "Interstate Sales", desc: "Legally sell goods and services across all Indian states" },
              { icon: CheckCircle, title: "Government Tenders", desc: "Participate in government tenders and expand business opportunities" },
              { icon: IndianRupee, title: "Higher Threshold", desc: "Enjoy composition scheme benefits and simplified tax compliance" },
              { icon: FileCheck, title: "Easy Compliance", desc: "Simple online filing and management of tax returns" },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <benefit.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Who needs GST registration?", a: "Businesses with annual turnover exceeding ₹40 lakhs (₹20 lakhs for services) must register for GST. Interstate suppliers and e-commerce sellers must register regardless of turnover." },
              { q: "How long does GST registration take?", a: "Typically 5-7 working days from the date of application submission with complete and accurate documents." },
              { q: "What is GSTIN?", a: "GSTIN (Goods and Services Tax Identification Number) is a unique 15-digit number assigned to every GST registered business." },
              { q: "Can I get GST registration for a home-based business?", a: "Yes, you can register a home-based business for GST using your residential address as the principal place of business." },
              { q: "Is GST registration free?", a: "Yes, GST registration is free on the government portal. You only pay for professional assistance and documentation services." },
            ].map((faq, idx) => (
              <details key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group">
                <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ArrowRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-sm text-muted-foreground mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Apply for GST Registration</h2>
            <p className="text-muted-foreground">Fill out the form and our GST experts will contact you within 24 hours</p>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()} className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Business Type *</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                  <option value="">Select Type</option>
                  <option value="proprietorship">Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="pvt-ltd">Private Limited</option>
                  <option value="llp">LLP</option>
                  <option value="opc">OPC</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Business Name *</label>
                <Input required value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} placeholder="ABC Enterprises" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Annual Turnover *</label>
                <Input required value={formData.turnover} onChange={(e) => setFormData({ ...formData, turnover: e.target.value })} placeholder="₹50,00,000" />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Business Address *</label>
              <Textarea required placeholder="Complete business address with pincode" rows={2} />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Select Plan *</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                <option value="">Choose a plan</option>
                <option value="basic">Basic - ₹2,999</option>
                <option value="standard">Standard - ₹4,999 (Most Popular)</option>
                <option value="premium">Premium - ₹9,999</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Additional Information</label>
              <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Any specific requirements or questions..." rows={3} />
            </div>
            
            <div className="flex items-start gap-2 mb-6">
              <input type="checkbox" required className="mt-1" />
              <label className="text-sm text-muted-foreground">
                I agree to the Terms & Conditions and authorize Turn2Law to contact me via phone/email *
              </label>
            </div>
            
            <Button type="submit" size="lg" className="w-full rounded-full">
              Submit Application
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>

      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get GST Registered?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">Start your GST registration process today with expert guidance</p>
          <Button size="lg" variant="secondary" className="rounded-full" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
            Apply Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto max-w-7xl text-center text-muted-foreground">
          <p>© 2025 Turn2Law. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
