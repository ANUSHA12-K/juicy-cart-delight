import { Leaf, Truck, Heart, Award } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Organic & Fresh',
    description: 'All our fruits are certified organic and picked fresh daily from local farms'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day delivery available within the city, ensuring maximum freshness'
  },
  {
    icon: Heart,
    title: 'Health First',
    description: 'Nutritious and wholesome fruits to support your healthy lifestyle'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Hand-selected premium fruits that meet our strict quality standards'
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">FreshFruits</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're passionate about bringing you the freshest, highest quality fruits 
            directly from farm to your table. Our commitment to excellence ensures 
            every bite is packed with flavor and nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-fresh rounded-3xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Farm to Table Excellence
          </h3>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            We work directly with local farmers who share our commitment to sustainable, 
            organic farming practices. Every fruit is carefully inspected to ensure it 
            meets our premium standards before reaching your doorstep.
          </p>
          <button className="btn-fruit bg-white text-primary hover:bg-white/90">
            Meet Our Farmers
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;