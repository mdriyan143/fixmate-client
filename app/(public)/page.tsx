import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChoose from "@/components/home/WhyChoose";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedServices />
      <HowItWorks />
      <WhyChoose />
      <Testimonials />
    </>
  );
}