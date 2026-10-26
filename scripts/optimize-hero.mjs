import sharp from 'sharp';

const variants = [
  {
    input: 'assets/img/hero/library-interior-mobile.webp',
    output: 'assets/img/hero/library-interior-mobile-480.webp',
    width: 480,
    quality: 20,
  },
  {
    input: 'assets/img/hero/library-interior-mobile.webp',
    output: 'assets/img/hero/library-interior-mobile-800.webp',
    width: 800,
    quality: 50,
  },
  {
    input: 'assets/img/hero/library-interior-optimized.webp',
    output: 'assets/img/hero/library-interior-800.webp',
    width: 800,
    quality: 70,
  },
];

await Promise.all(
  variants.map(({ input, output, width, quality }) =>
    sharp(input).resize({ width }).webp({ quality, effort: 6 }).toFile(output),
  ),
);

console.log(`Generated ${variants.length} hero variants.`);
