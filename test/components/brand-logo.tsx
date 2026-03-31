import Image from "next/image";

export function BrandLogo() {
  return (
    <div className="inline-flex items-center sm:p-2.5">
      <div className="relative  overflow-hidden rounded-[1rem] sm:h-16 sm:w-16 md:h-[4.75rem] md:w-[4.75rem]">
        <Image
          src="/image/vaybe.png"
          alt="Logo Vaybe"
          fill
          priority
          sizes="(max-width: 660px) 66px, (max-width: 768px) 70px, 86px"
          className="object-contain object-center "
        />
      </div>
    </div>
  );
}
