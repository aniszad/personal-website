import Image from "next/image";

const PLATE_SIZES = {
  sm: "size-6", // 24px, used by Education
  md: "size-7", // 28px, used by Experience
} as const;

/**
 * An institution or company mark, set on a small paper plate.
 *
 * Every logo the site carries is drawn dark on white. Dropping one straight
 * onto the near-black surface would either bury it or punch a bright hole in
 * the page, so it sits on the paper token instead and reads as a printed
 * card laid on the surface. Purely decorative and static: no hover motion,
 * no link (institution/company links, where they exist, are their own text
 * elements elsewhere in the row).
 */
export function LogoPlate({
  src,
  name,
  size = "md",
}: {
  src: string;
  name: string;
  size?: keyof typeof PLATE_SIZES;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-sm bg-paper p-1 ${PLATE_SIZES[size]}`}
    >
      <Image
        src={src}
        alt=""
        width={56}
        height={56}
        className="h-full w-full object-contain"
      />
      <span className="sr-only">{name}</span>
    </span>
  );
}
