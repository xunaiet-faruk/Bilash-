import Image from "next/image";
import Hero from "./component/Home/Hero";
import FeaturedCategories from "./component/Home/FeaturedCategories";

export default function Home() {
  return (
   <>
    <Hero />
    <FeaturedCategories/>
   </>
  );
}
