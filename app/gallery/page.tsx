import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function walkGallery(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkGallery(fullPath);
    }

    const dotIndex = entry.name.lastIndexOf(".");
    if (dotIndex === -1) return [];
    if (!IMAGE_EXTENSIONS.has(entry.name.slice(dotIndex).toLowerCase())) return [];

    return [fullPath];
  });
}

function galleryImages() {
  const galleryDir = join(process.cwd(), "public", "gallery");

  return walkGallery(galleryDir)
    .sort((a, b) => a.localeCompare(b))
    .map((filePath) => {
      const relativePath = relative(galleryDir, filePath);
      const webPath = relativePath.split(sep).map(encodeURIComponent).join("/");

      return {
        key: relativePath,
        src: `/gallery/${webPath}`,
      };
    });
}

export default function GalleryPage() {
  const images = galleryImages();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-transparent">
      <MainHeader active="gallery" />
      <main className="flex-1 bg-transparent">
        <section className="mx-auto w-full max-w-[1920px] px-0">
          <div className="columns-1 gap-0 sm:columns-2 lg:columns-3 2xl:columns-4">
            {images.map((image) => (
              <div key={image.key} className="mb-0 break-inside-avoid overflow-hidden">
                <img
                  src={image.src}
                  alt=""
                  className="block h-auto w-full align-bottom"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}
