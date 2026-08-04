import { HomeHero } from "@/components/home/home-hero";
import { CategoryRail } from "@/components/home/category-rail";
import { FeaturedGallery } from "@/components/home/featured-gallery";
import { EditorialCollections } from "@/components/home/editorial-collections";

export default function HomePage() {
  return <><HomeHero /><CategoryRail /><FeaturedGallery /><EditorialCollections /></>;
}
