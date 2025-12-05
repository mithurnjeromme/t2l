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
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  IndianRupee,
  Download,
  CheckSquare,
} from "lucide-react";
import Header from "@/components/layout/header";

export default function GSTReturnFilingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    gstin: "",
    returnType: "",
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
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">Tax Compliance Made Easy</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Annual GST Return Filing
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Stay compliant with timely GST return filing. Expert assistance for GSTR-1, GSTR-3B, and annual returns. Avoid penalties with our professional services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="group" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  File Your Returns
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">100% Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Expert Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">On-Time Filing</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-semibold text-foreground">Monthly Returns</p>
                        <p className="text-sm text-muted-foreground">GSTR-1 & GSTR-3B</p>
                      </div>
                    </div>
                    <CheckSquare className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-semibold text-foreground">Quarterly Returns</p>
                        <p className="text-sm text-muted-foreground">QRMP Scheme</p>
                      </div>
                    </div>
                    <CheckSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Annual Returns</p>
                        <p className="text-sm text-muted-foreground">GSTR-9 & GSTR-9C</p>
                      </div>
                    </div>
                    <CheckSquare className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent <span className="text-primary">Pricing Plans</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Monthly Filing Plan */}
            <div className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Monthly Filing</h3>
                <p className="text-muted-foreground">For regular businesses</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="h-6 w-6 text-muted-foreground" />
                  <span className="text-5xl font-bold">999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">GSTR-1 Filing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">GSTR-3B Filing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">ITC Reconciliation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Expert Consultation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Email Support</span>
                </li>
              </ul>
            </div>

            {/* Quarterly Filing Plan */}
            <div className="bg-gradient-to-br from-primary to-secondary border-2 border-primary rounded-2xl p-8 hover:shadow-2xl transition-all hover:-translate-y-1 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                RECOMMENDED
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">Quarterly Filing</h3>
                <p className="text-primary-foreground/80">QRMP Scheme</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 text-white">
                  <IndianRupee className="h-6 w-6" />
                  <span className="text-5xl font-bold">2,499</span>
                  <span className="text-primary-foreground/80">/quarter</span>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">Quarterly GSTR-1</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">Monthly GSTR-3B</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">ITC Reconciliation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">Priority Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">Notice Handling</span>
                </li>
              </ul>
            </div>

            {/* Annual Return Plan */}
            <div className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Annual Return</h3>
                <p className="text-muted-foreground">GSTR-9 & GSTR-9C</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="h-6 w-6 text-muted-foreground" />
                  <span className="text-5xl font-bold">4,999</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">GSTR-9 Filing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">GSTR-9C Reconciliation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">CA Certification</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Audit Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Dedicated CA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GST Return Types */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Types of <span className="text-primary">GST Returns</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Understanding different GST return forms and their due dates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                form: "GSTR-1",
                title: "Outward Supplies",
                desc: "Details of outward supplies of goods and services",
                frequency: "Monthly/Quarterly",
                dueDate: "11th of next month",
                icon: FileText,
                color: "blue"
              },
              {
                form: "GSTR-3B",
                title: "Summary Return",
                desc: "Summary of outward supplies, ITC claimed & tax payment",
                frequency: "Monthly",
                dueDate: "20th of next month",
                icon: TrendingUp,
                color: "green"
              },
              {
                form: "GSTR-9",
                title: "Annual Return",
                desc: "Consolidation of all monthly/quarterly returns",
                frequency: "Annual",
                dueDate: "31st December",
                icon: Calendar,
                color: "primary"
              },
              {
                form: "GSTR-9C",
                title: "Reconciliation Statement",
                desc: "For taxpayers with turnover > ₹5 Crore",
                frequency: "Annual",
                dueDate: "31st December",
                icon: CheckSquare,
                color: "purple"
              },
              {
                form: "GSTR-2A",
                title: "Purchase Register",
                desc: "Auto-populated inward supplies details",
                frequency: "Monthly",
                dueDate: "Auto-generated",
                icon: Download,
                color: "orange"
              },
              {
                form: "GSTR-2B",
                title: "ITC Statement",
                desc: "Static statement of ITC available",
                frequency: "Monthly",
                dueDate: "14th of next month",
                icon: Shield,
                color: "red"
              }
            ].map((returnType, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${returnType.color}-500/10 mb-4`}>
                  <returnType.icon className={`h-6 w-6 text-${returnType.color}-500`} />
                </div>
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    {returnType.form}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{returnType.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{returnType.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-semibold">{returnType.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-semibold">{returnType.dueDate}</span>
                  </div>
                </div>
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
              Documents you need to keep ready for GST return filing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Sales Invoices",
              "Purchase Invoices",
              "Credit/Debit Notes",
              "Bank Statements",
              "GSTR-2A/2B",
              "Previous Return Copies",
              "Payment Challans",
              "TDS/TCS Certificates"
            ].map((doc, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground">{doc}</h3>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Important Note</h3>
                <p className="text-sm text-muted-foreground">
                  Late filing of GST returns attracts penalties and interest. GSTR-3B delay: ₹50/day (₹20/day if tax liability is nil). Ensure timely filing to avoid penalties.
                </p>
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
              Our <span className="text-primary">Filing Process</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple and hassle-free GST return filing in 4 easy steps
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Document Collection",
                desc: "Share your sales, purchase invoices, and other required documents",
                time: "Day 1"
              },
              {
                step: "02",
                title: "Data Entry & Reconciliation",
                desc: "Our experts will prepare and reconcile your returns with GSTR-2A/2B",
                time: "Day 2-3"
              },
              {
                step: "03",
                title: "Review & Approval",
                desc: "Review the prepared returns and provide your approval",
                time: "Day 4"
              },
              {
                step: "04",
                title: "Filing & Confirmation",
                desc: "Returns filed on portal with acknowledgment shared to you",
                time: "Day 5"
              }
            ].map((process, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{process.step}</span>
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
              Get Started with <span className="text-primary">GST Return Filing</span>
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
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <Input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your business name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">GSTIN (if available)</label>
                  <Input
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Return Type *</label>
                  <select
                    name="returnType"
                    value={formData.returnType}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select return type</option>
                    <option value="monthly">Monthly Filing</option>
                    <option value="quarterly">Quarterly Filing (QRMP)</option>
                    <option value="annual">Annual Return (GSTR-9)</option>
                    <option value="gstr9c">GSTR-9C (Reconciliation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Plan *</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Choose a plan</option>
                  <option value="monthly">Monthly - ₹999/month</option>
                  <option value="quarterly">Quarterly - ₹2,499/quarter (Recommended)</option>
                  <option value="annual">Annual Return - ₹4,999/year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Information</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your business turnover, any specific requirements..."
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
                q: "What is the due date for GST return filing?",
                a: "GSTR-1 is due by 11th, GSTR-3B by 20th of next month. Quarterly filers have different due dates. Annual returns (GSTR-9) are due by 31st December."
              },
              {
                q: "What is the penalty for late filing?",
                a: "Late filing of GSTR-3B attracts ₹50 per day (₹20 per day if no tax liability). Maximum penalty is ₹5,000. Interest is also charged @18% p.a. on outstanding tax."
              },
              {
                q: "Can I file nil returns?",
                a: "Yes, nil returns must be filed even if there are no transactions during the period. Failure to file attracts penalty."
              },
              {
                q: "What is QRMP scheme?",
                a: "Quarterly Return Monthly Payment scheme allows eligible taxpayers to file GSTR-1 quarterly while paying tax monthly through PMT-06."
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
