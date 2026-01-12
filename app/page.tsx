"use client";

import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { 
  Video, 
  MessageSquare, 
  Shield, 
  Lock, 
  Play,
  ArrowRight,
  CheckCircle,
  Heart,
  Stethoscope,
  Activity
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Animated counter component
const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  suffix = "" 
}: { 
  end: number; 
  duration?: number; 
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Stats data
const STATS = [
  { value: 50000, suffix: "+", label: "Videos Delivered" },
  { value: 10000, suffix: "+", label: "Patients Served" },
  { value: 500, suffix: "+", label: "Healthcare Providers" },
];

export default function LandingPage() {
  return (
    <div className="landing-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="gradient-mesh" />
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-end px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/discover"
            className="hidden sm:block text-white/70 hover:text-white transition-colors font-medium"
          >
            Discover
          </Link>
          <Link
            href="/auth"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-8 pb-20 md:pt-12 md:pb-28 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Big branded logo */}
            <div className="animate-reveal reveal-delay-1">
              <Logo variant="full" className="h-16 sm:h-20 lg:h-24 w-auto mx-auto lg:mx-0" />
            </div>
            
            <h1 className="animate-reveal reveal-delay-2 mt-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-white max-w-xl mx-auto lg:mx-0">
              Healthcare Communication, <span className="text-gradient">Reimagined</span>
            </h1>

            {/* Feature bullets */}
            <ul className="animate-reveal reveal-delay-3 mt-8 space-y-4 text-left max-w-xl mx-auto lg:mx-0">
              <li className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">Trusted and delivered by doctors themselves</span>
              </li>
              <li className="flex items-start gap-3">
                <Video className="w-5 h-5 text-[#00BFA6] mt-0.5 flex-shrink-0" />
                <span className="text-white/80">Trusted video information from your doctors and other specialists</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-[#3ac1e1] mt-0.5 flex-shrink-0" />
                <span className="text-white/80">Real-time check-ins to keep you on track</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">Simple and effective reminders for your care</span>
              </li>
            </ul>

            {/* CTAs */}
            <div className="animate-reveal reveal-delay-4 mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/auth?role=patient"
                className="group relative px-8 py-4 bg-brand-gradient text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 glow-brand flex items-center justify-center gap-3"
              >
                <Heart className="w-5 h-5" />
                I'm a Patient
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/auth?role=doctor"
                className="px-8 py-4 text-white font-semibold text-lg rounded-2xl gradient-border-2 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Stethoscope className="w-5 h-5" />
                I'm a Provider
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="animate-reveal reveal-delay-5 mt-10 flex items-center justify-center lg:justify-start gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="animate-reveal reveal-delay-4 relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-r from-[#00BFA6]/20 to-[#3ac1e1]/20 rounded-[3rem] blur-3xl" />
              
              {/* Phone frame */}
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl animate-float border border-white/10">
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
                  
                  {/* Screen content - Doctor video preview */}
                  <div className="w-full h-full relative">
                    {/* Doctor image as video background */}
                    <Image
                      src="/images/doctors/doctor-lisa.jpg"
                      alt="Dr. Lisa Chen delivering health information"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                    
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors cursor-pointer">
                        <Play className="w-7 h-7 text-white ml-1" fill="white" />
                      </div>
                    </div>
                    
                    {/* Doctor info overlay */}
                    <div className="absolute bottom-16 left-4 right-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30">
                          <Image
                            src="/images/doctors/doctor-lisa.jpg"
                            alt="Dr. Lisa Chen"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm drop-shadow-lg">Dr. Lisa Chen</p>
                          <p className="text-white/80 text-xs drop-shadow-lg">Primary Care</p>
                        </div>
                      </div>
                      <p className="mt-3 text-white text-sm drop-shadow-lg">Understanding your lab results...</p>
                    </div>
                    
                    {/* Bottom nav indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Patient / For Provider Section */}
      <section className="relative z-10 px-6 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For the Patient */}
            <div className="animate-reveal reveal-delay-2">
              <div className="h-full p-8 rounded-2xl glass gradient-border-hover hover-lift">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For the Patient</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00BFA6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Video className="w-4 h-4 text-[#00BFA6]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Personalized Videos</p>
                      <p className="text-white/60 text-sm mt-1">Receive custom health content tailored to your care plan</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#3ac1e1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-[#3ac1e1]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Controlled and Secure Messaging</p>
                      <p className="text-white/60 text-sm mt-1">Stay connected with your care team safely</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Health Tracking</p>
                      <p className="text-white/60 text-sm mt-1">Monitor your progress and stay on top of your wellness</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* For the Provider */}
            <div className="animate-reveal reveal-delay-3">
              <div className="h-full p-8 rounded-2xl glass gradient-border-hover hover-lift">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0ba999] to-[#3ac1e1] flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For the Provider</h3>
                </div>
                <p className="text-white/80 leading-relaxed mb-6">
                  A controlled and simple way to stay in touch with your patients by delivering accurate health information and simple check-ins and important reminders.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/70">Save time with templated content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/70">Drive better patient outcomes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/70">Counter health misinformation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/70">Automated check-ins and reminders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Glass Band */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                {STATS.map((stat, index) => (
                  <div key={index} className="animate-reveal" style={{ animationDelay: `${index * 100}ms` }}>
                    <p className="text-3xl md:text-4xl font-bold text-white font-mono">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-white/50 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Trust badges and logos */}
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-6">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium text-sm">HIPAA Compliant</span>
                </div>
                
                <div className="flex items-center gap-4 opacity-60">
                  <Image
                    src="/images/kaiser-logo.png"
                    alt="Kaiser Permanente"
                    width={100}
                    height={30}
                    className="h-6 w-auto brightness-0 invert"
                  />
                  <Image
                    src="/images/united-healthcare-logo-white.svg"
                    alt="United Healthcare"
                    width={100}
                    height={30}
                    className="h-6 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Editorial */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-reveal">
            {/* Pull quote */}
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white leading-relaxed">
              "This changed how I connect with my patients. They watch the videos I send, and come to follow-ups more engaged and informed than ever."
            </blockquote>
            
            {/* Attribution */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20">
                <Image
                  src="/images/doctors/doctor-jack.jpg"
                  alt="Dr. Jack Ellis"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Dr. Jack Ellis</p>
                <p className="text-white/50 text-sm">Cardiology, 1Another Health</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-brand-gradient rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 geo-pattern opacity-20" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to transform your practice?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
                Join thousands of healthcare providers delivering personalized care at scale.
              </p>
              
              <Link
                href="/auth"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="mt-6 text-white/60 text-sm">
                No credit card required • Set up in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo variant="full" className="h-8 w-auto opacity-70" />
            
            <div className="flex items-center gap-8 text-white/50 text-sm">
              <Link href="/discover" className="hover:text-white transition-colors">
                Discover
              </Link>
              <Link href="/auth" className="hover:text-white transition-colors">
                Sign In
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
            
            <p className="text-white/30 text-sm font-mono">
              © 2026 1Another Health
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
