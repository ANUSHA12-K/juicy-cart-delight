import heroImage from '@/assets/hero-fruits.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Fresh colorful fruits" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Fresh Fruits Delivered to Your{' '}
            <span className="text-accent">Doorstep</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover the finest selection of organic, farm-fresh fruits delivered daily. 
            Taste the difference quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#shop" 
              className="btn-fruit btn-primary text-lg px-8 py-4"
            >
              Shop Now
            </a>
            <a 
              href="#about" 
              className="btn-fruit bg-white/20 text-white hover:bg-white/30 text-lg px-8 py-4 backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;