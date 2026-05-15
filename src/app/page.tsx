"use client";
import Link from 'next/link';
import { 
  Play, Clock, Plus, Star, CheckCircle2, 
  Shirt, Wind, Droplets, Truck, ShieldCheck, 
  Leaf, Quote, ArrowRight
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full bg-[#F3F6FA] dark:bg-slate-950 overflow-x-hidden transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-0 md:pb-16 flex flex-col items-center min-h-[90vh]">
        <div className="text-center z-10 max-w-4xl px-4 flex flex-col items-center">
          <h1 className="text-6xl md:text-7xl font-bold text-[#14234b] dark:text-white leading-[1.1] mb-6 tracking-tight">
            Your <span className="text-[#6C89EC] dark:text-[#8ba4f9]">Laundry</span>, Our <br /> Spin Perfection
          </h1>
          <p className="text-[#59667a] dark:text-slate-400 max-w-3xl mx-auto mb-10 text-sm md:text-[15px] leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          </p>
          
          <div className="flex items-center justify-center gap-5">
            <Link href="/services" className="bg-[#14234b] dark:bg-white text-white dark:text-[#14234b] px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-slate-900 dark:hover:bg-slate-200 transition-colors shadow-lg">
              Book Laundry Now!
            </Link>
            <button className="w-12 h-12 bg-[#FFB600] rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-500/20">
              <Play fill="currentColor" size={20} className="ml-1" />
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-6xl mt-16 md:mt-24 flex-1 flex justify-center items-end h-[450px]">
          {/* Central Machine Placeholder */}
          <div className="relative z-10 w-[300px] h-[380px] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl dark:shadow-none border-x border-t border-gray-100 dark:border-slate-800 flex flex-col items-center pt-8">
            <div className="w-full px-8 flex justify-between items-center mb-6">
               <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-slate-700"></div>
                  <div className="w-8 h-2.5 rounded-full bg-gray-300 dark:bg-slate-700"></div>
               </div>
               <div className="w-12 h-4 bg-gray-200 dark:bg-slate-800 rounded-sm"></div>
               <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-800 dark:bg-slate-600"></div>
                  {/* Blinking indicator light */}
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
               </div>
            </div>
            {/* Machine Door */}
            <div className="w-48 h-48 bg-[#F3F6FA] dark:bg-slate-950 rounded-full border-[16px] border-white dark:border-slate-800 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center relative">
               {/* Inner Drum */}
               <div className="w-32 h-32 bg-[#1a2b4c] dark:bg-slate-900 rounded-full overflow-hidden relative shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
                  
                  {/* Spinning Clothes and Water */}
                  <div className="absolute inset-0 animate-[spin_2s_linear_infinite] flex items-center justify-center">
                    {/* Water base */}
                    <div className="absolute inset-1 rounded-full border-4 border-blue-400/20 border-t-blue-400/60 border-l-blue-400/40"></div>
                    {/* Clothes representations */}
                    <div className="absolute w-14 h-10 bg-teal-500/90 rounded-full blur-[2px] top-3 -left-1 transform -rotate-12"></div>
                    <div className="absolute w-12 h-12 bg-orange-400/90 rounded-full blur-[2px] bottom-3 right-2 transform rotate-45"></div>
                    <div className="absolute w-10 h-14 bg-indigo-400/90 rounded-full blur-[2px] top-6 right-1 transform rotate-12"></div>
                    {/* Bubbles */}
                    <div className="absolute w-3 h-3 bg-white/60 rounded-full top-8 left-8"></div>
                    <div className="absolute w-2 h-2 bg-white/50 rounded-full bottom-8 right-10"></div>
                    <div className="absolute w-4 h-4 bg-white/40 rounded-full bottom-4 left-10"></div>
                  </div>

                  {/* Glass Reflection overlay (static, doesn't spin) */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
                  <div className="absolute top-2 right-4 w-12 h-6 bg-white/30 rounded-full transform rotate-45 blur-[2px] pointer-events-none"></div>
               </div>
            </div>
            <div className="w-full border-t border-gray-100 dark:border-slate-800 absolute bottom-12 h-full"></div>
          </div>

          <div className="absolute bottom-0 left-[20%] z-0 text-green-900/10 dark:text-green-500/5 hidden md:block">
             <div className="w-40 h-80 bg-current rounded-full blur-3xl rounded-tr-[100px] transform -rotate-12"></div>
          </div>

          {/* Floating Cards */}
          <div className="hidden md:block absolute top-0 left-[10%] bg-[#6C89EC] dark:bg-blue-600 p-6 rounded-[1.5rem] shadow-2xl dark:shadow-none text-white transform z-20 w-64 border dark:border-slate-700">
             <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-[#6C89EC] dark:text-blue-400">
                <Clock fill="currentColor" size={24} />
             </div>
             <h3 className="font-extrabold text-2xl mb-1">Only One Hours</h3>
             <p className="text-white dark:text-blue-100 text-sm">Express Laundry Service</p>
          </div>

          <div className="hidden md:block absolute bottom-16 left-[13%] bg-white dark:bg-slate-900 p-5 py-6 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 z-20 w-64">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                   <Truck size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-800 dark:text-slate-100 text-lg leading-tight">Free Pickup</span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mt-1">& Delivery</span>
                </div>
             </div>
          </div>

          <div className="hidden md:block absolute top-10 right-[15%] bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl dark:shadow-none border dark:border-slate-800 z-20 w-[220px]">
             <div className="w-full h-[120px] rounded-xl bg-gray-200 dark:bg-slate-800 overflow-hidden mb-3 relative">
                <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Laundry process" opacity="0.9" />
             </div>
             <div className="flex items-center justify-center gap-1.5 pb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#FFB600" className="text-[#FFB600]" />
                ))}
                <span className="text-xs font-bold text-gray-800 dark:text-slate-200 ml-1">(4.6/5)</span>
             </div>
          </div>

          <div className="hidden md:block absolute bottom-24 right-[12%] bg-[#6C89EC] dark:bg-blue-600 p-6 rounded-3xl shadow-2xl dark:shadow-none text-white w-60 z-20 border dark:border-slate-700">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                 <Leaf size={28} className="text-white" />
             </div>
             <h3 className="font-extrabold text-2xl mb-1">Eco-Friendly</h3>
             <p className="text-white/90 text-sm font-medium">We use safe & sustainable plant-based detergents</p>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-[#6C89EC] dark:text-blue-400 font-bold tracking-wider uppercase mb-3 text-sm">Our Process</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#14234b] dark:text-white mb-4">How It Works</h2>
            <p className="text-[#59667a] dark:text-slate-400">We've made getting your laundry done as simple as possible. Just a few clicks and we'll handle the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-gray-100 dark:bg-slate-800 border-t-2 border-dashed border-gray-200 dark:border-slate-700 z-0"></div>

            <ProcessStep 
              num="01" 
              icon={<Plus size={32} className="text-[#6C89EC] dark:text-blue-400" />} 
              title="Book Collection" 
              desc="Schedule a pickup online or through our app. Choose a time that suits you." 
            />
            <ProcessStep 
              num="02" 
              icon={<Wind size={32} className="text-[#6C89EC] dark:text-blue-400" />} 
              title="We Wash & Dry" 
              desc="Our experts clean your clothes using premium detergents and high-tech machines." 
            />
            <ProcessStep 
              num="03" 
              icon={<Truck size={32} className="text-[#6C89EC] dark:text-blue-400" />} 
              title="Fast Delivery" 
              desc="Your clothes are delivered back to your door, fresh, folded, and ready to wear." 
            />
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES */}
      <section className="py-24 bg-[#F3F6FA] dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h4 className="text-[#6C89EC] dark:text-blue-400 font-bold tracking-wider uppercase mb-3 text-sm">Services</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-[#14234b] dark:text-white mb-4">What We Offer</h2>
              <p className="text-[#59667a] dark:text-slate-400">Comprehensive laundry and dry cleaning solutions tailored to your specific needs.</p>
            </div>
            <Link href="/services" className="flex items-center gap-2 text-[#14234b] dark:text-white font-bold hover:text-[#6C89EC] dark:hover:text-blue-400 transition-colors pb-2 border-b-2 border-transparent hover:border-[#6C89EC] dark:hover:border-blue-400">
               View All Services <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Shirt size={36} />}
              title="Wash & Fold"
              desc="Everyday laundry washed with premium detergents, neatly folded and ready to store."
            />
            <ServiceCard 
              icon={<Wind size={36} />}
              title="Dry Cleaning"
              desc="Expert care for your delicate fabrics, suits, and special garments using gentle solvents."
              active
            />
            <ServiceCard 
              icon={<Droplets size={36} />}
              title="Ironing Services"
              desc="Crisp, crease-free professional pressing for your shirts, trousers, and linens."
            />
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-[#6C89EC] dark:text-blue-400 font-bold tracking-wider uppercase mb-3 text-sm">Features</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#14234b] dark:text-white mb-4">Why Choose Us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureItem icon={<Leaf />} title="Eco-friendly" desc="Safe, sustainable cleaning agents that protect the planet and your skin." />
            <FeatureItem icon={<Clock />} title="Express Delivery" desc="24-hour turnaround available for when you're in a rush." />
            <FeatureItem icon={<ShieldCheck />} title="Damage Protection" desc="Your garments are fully insured against any accidental damage." />
            <FeatureItem icon={<Star />} title="Top Quality" desc="Trained professionals and the latest machinery for spotless results." />
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-[#F3F6FA] dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-4xl md:text-5xl font-bold text-[#14234b] dark:text-white mb-16">Happy Customers</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                name="Sarah Johnson"
                text="The best laundry service I've ever used. They managed to get out a stain I thought was permanent. Completely life-saving!"
                imgId={23}
              />
              <TestimonialCard 
                name="Michael Chen"
                text="Super fast and incredibly reliable. I travel constantly for work and they always make sure my suits look pristine."
                imgId={11}
              />
              <TestimonialCard 
                name="Emma Williams"
                text="I love how eco-friendly their process is. The clothes smell naturally fresh, not overpowered with chemical perfumes."
                imgId={44}
              />
           </div>
        </div>
      </section>

      {/* 6. CTA / BOTTOM */}
      <section className="py-20 bg-[#14234b] dark:bg-blue-950 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6C89EC] dark:bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB600] rounded-full blur-[150px] opacity-10 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready for absolute spin perfection?</h2>
          <p className="text-slate-300 mb-10 text-lg">Schedule your first pickup today and get 20% off with code WELCOME20.</p>
          <Link href="/services" className="inline-block bg-[#FFB600] text-[#14234b] px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-[0_0_30px_rgba(255,182,0,0.3)] hover:shadow-[0_0_40px_rgba(255,182,0,0.5)] transform hover:-translate-y-1">
            Schedule a Pickup Now
          </Link>
        </div>
      </section>

    </div>
  );
}

// -- Reusable Components for the page --

function ProcessStep({ num, icon, title, desc }: { num: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center relative z-10">
      <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none flex items-center justify-center mb-6 border border-gray-50 dark:border-slate-800 relative transition-colors duration-300">
        <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#14234b] dark:bg-blue-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-900 transition-all">{num}</span>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#14234b] dark:text-white mb-3">{title}</h3>
      <p className="text-[#59667a] dark:text-slate-400 leading-relaxed max-w-xs">{desc}</p>
    </div>
  );
}

function ServiceCard({ icon, title, desc, active = false }: { icon: React.ReactNode, title: string, desc: string, active?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl transition-all duration-300 border hover:-translate-y-2 cursor-pointer ${
      active 
        ? 'bg-[#14234b] dark:bg-blue-900 text-white shadow-xl shadow-blue-900/10 dark:shadow-none border-transparent' 
        : 'bg-white dark:bg-slate-900 text-[#14234b] dark:text-white border-gray-100 dark:border-slate-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none'
    }`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
        active ? 'bg-white/10 text-white' : 'bg-[#F3F6FA] dark:bg-slate-800 text-[#6C89EC] dark:text-blue-400'
      }`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className={`leading-relaxed mb-6 ${active ? 'text-slate-300 dark:text-blue-100' : 'text-[#59667a] dark:text-slate-400'}`}>{desc}</p>
      <div className={`font-semibold flex items-center gap-2 ${active ? 'text-[#6C89EC] dark:text-blue-300' : 'text-[#14234b] dark:text-white'}`}>
        Learn More <ArrowRight size={18} />
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#F3F6FA] dark:bg-slate-800 p-8 rounded-[2rem] text-center hover:bg-[#6C89EC] dark:hover:bg-blue-600 hover:text-white transition-colors duration-300 group">
      <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 text-[#14234b] dark:text-white shadow-sm group-hover:scale-110 group-hover:text-[#14234b] dark:group-hover:text-blue-400 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-white text-[#14234b] dark:text-white">{title}</h3>
      <p className="text-[#59667a] dark:text-slate-400 group-hover:text-white/80 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, text, imgId }: { name: string, text: string, imgId: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 relative mt-6 transition-colors duration-300">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <img src={`https://i.pravatar.cc/100?img=${imgId}`} alt={name} className="w-14 h-14 rounded-full border-4 border-white dark:border-slate-900 shadow-md z-10 relative transition-colors duration-300" />
      </div>
      <Quote size={40} className="text-gray-100 dark:text-slate-800 mx-auto mt-4 mb-4 transform -rotate-12 transition-colors duration-300" />
      <p className="text-[#59667a] dark:text-slate-400 italic mb-6 leading-relaxed">"{text}"</p>
      <div className="flex justify-center gap-1 mb-3 text-[#FFB600]">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
      </div>
      <h4 className="font-bold text-[#14234b] dark:text-white">{name}</h4>
    </div>
  );
}


