import mediCube from "@/assets/ugc/medi_cube.mp4.asset.json";
import wagmiClothes from "@/assets/ugc/wagmi_clothes.mp4.asset.json";
import wagmi from "@/assets/ugc/wagmi.mp4.asset.json";
import arabiyat from "@/assets/ugc/arabiyat.mp4.asset.json";
import balde from "@/assets/ugc/balde.mp4.asset.json";
import ball from "@/assets/ugc/ball.mp4.asset.json";
import retro from "@/assets/ugc/retro.mp4.asset.json";
import { assetUrl } from "@/lib/asset-url";

export type UgcItem = {
  id: string;
  title: string;
  brand: string;
  category: "UGC" | "AI Commercial" | "Product Video";
  orientation: "portrait" | "landscape";
  src: string;
};

export const ugcItems: UgcItem[] = [
  { id: "medi_cube",     title: "Glow Routine",        brand: "Medicube",      category: "UGC",           orientation: "portrait",  src: assetUrl(mediCube.url) },
  { id: "wagmi_clothes", title: "Streetwear Drop",     brand: "WAGMI",         category: "UGC",           orientation: "portrait",  src: assetUrl(wagmiClothes.url) },
  { id: "wagmi",         title: "Brand Story",         brand: "WAGMI",         category: "AI Commercial", orientation: "landscape", src: assetUrl(wagmi.url) },
  { id: "arabiyat",      title: "Signature Fragrance", brand: "Arabiyat",      category: "AI Commercial", orientation: "landscape", src: assetUrl(arabiyat.url) },
  { id: "balde",         title: "Everyday Carry",      brand: "Balde",         category: "Product Video", orientation: "landscape", src: assetUrl(balde.url) },
  { id: "ball",          title: "In Motion",           brand: "Studio",        category: "Product Video", orientation: "landscape", src: assetUrl(ball.url) },
  { id: "retro",         title: "Retro Campaign",      brand: "Retro Co.",     category: "AI Commercial", orientation: "landscape", src: assetUrl(retro.url) },
];
