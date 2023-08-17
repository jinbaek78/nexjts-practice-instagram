'use client';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const responsive = {
  desktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 6,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    slidesToSlide: 2, // optional, default to 1.
  },
};

type Props = {
  children: React.ReactNode;
};
export default function UsersCarousel({ children }: Props) {
  console.log('children: ', children);
  return (
    <Carousel
      containerClass={`w-[900px]`}
      responsive={responsive}
      showDots={false}
      infinite={true}
      itemClass=""
    >
      {children}
    </Carousel>
  );
}
