import React from 'react';

const SalesClaim = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white">
            {/* Animated Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white-900/30 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white-900/30 blur-[120px] animate-pulse delay-700" />

            <div className="relative z-10 text-center px-6">
                {/* Floating Main Rocket */}
                <div className="mb-8 inline-block animate-bounce duration-[2000ms]">
                    <span className="text-7xl lg:text-9xl drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                        
                    </span>
                </div>
                
                {/* Text Content */}
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white-400 via-gray-300 to-blue-400 mb-6 tracking-tighter">
                    Coming Soon
                </h1>
                
                <p className="text-lg md:text-xl lg:text-3xl text-slate-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                    We're currently <span className="text-white-400 font-medium italic">refining the engine</span>. 
                    Prepare for a sales experience that defies gravity.
                </p>
                
                {/* Modern Loading Dots */}
                <div className="flex justify-center items-center gap-3 mb-16">
                    <div className="w-3 h-3 lg:w-4 lg:h-4 bg-white-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-3 h-3 lg:w-4 lg:h-4 bg-white-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-3 h-3 lg:w-4 lg:h-4 bg-white-500 rounded-full animate-bounce" />
                </div>
                
                {/* Glassmorphism Floating Elements */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-10 left-10 text-4xl animate-[spin_10s_linear_infinite] opacity-40 lg:opacity-80"></div>
                    <div className="absolute bottom-20 right-20 text-4xl animate-pulse opacity-40 lg:opacity-80"></div>
                    <div className="absolute top-1/2 -left-20 text-5xl animate-bounce opacity-30"></div>
                    <div className="absolute bottom-10 left-1/4 text-3xl animate-ping opacity-20"></div>
                </div>

                {/* Optional Notify Me Button */}
                <button className="px-8 py-3 lg:px-12 lg:py-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 text-sm lg:text-lg font-semibold tracking-wide">
                    Get Early Access
                </button>
            </div>
            
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app')] opacity-20 pointer-events-none" />
        </div>
    );
};

export default SalesClaim;
