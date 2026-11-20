import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import Categories from "@/components/home/Categories";
import WhyChoose from "@/components/home/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <HowItWorks />
      <Categories />
      <WhyChoose />
    </>
  );
}
