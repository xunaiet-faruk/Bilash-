import Image from "next/image";
import Hero from "./component/Home/Hero";
import FeaturedCategories from "./component/Home/FeaturedCategories";
import TopSellingProducts from "./component/Home/TopSellingProducts";
import ChinaDirectSection from "./component/Home/ChinaDirectSection";
import Topbrands from "./component/Home/Topbrands";
import FlashSaleSection from "./component/Home/FlashSaleSection";

export default function Home() {
  return (
   <>
   <div className="">
  <Hero />
    <FeaturedCategories/>
    <TopSellingProducts/>
      <FlashSaleSection/>
    <ChinaDirectSection/>
    <Topbrands/>
  
   </div>
  


    
    
   </>
  );
}


// export default function Home() {
//   return (
//     <>
//       <Navbar />
//       <main>
//         <Hero />
//         <FeaturedCategories />
//         <FlashSaleCountdown />
//         <TopSellingProducts />
//         <ChinaDirectSection />
//         <ResellerCTA />
//         <TrustBadges />
//         <TopBrands />
//       </main>
//       <Footer />
//     </>
//   );
// }