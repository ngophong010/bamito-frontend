"use client";
import React from 'react';
import Slider, { CustomArrowProps } from "react-slick"; // Import the arrow props type
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import { bannerSlides } from './banner.config'; // Import the slide data
import "./Banner.scss";

// --- Custom Arrow Components (Now Typed) ---
const NextArrow = ({ className, style, onClick }: CustomArrowProps) => (
  <div className={className} style={style} onClick={onClick}>
    <FontAwesomeIcon icon={faAngleRight} />
  </div>
);

const PrevArrow = ({ className, style, onClick }: CustomArrowProps) => (
  <div className={className} style={style} onClick={onClick}>
    <FontAwesomeIcon icon={faAngleLeft} />
  </div>
);

const Banner = () => {
  const settings = {
    dots: true, // Dots are generally good for UX
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500, // A faster transition is often smoother
    autoplaySpeed: 4000,
    fade: true, // Fade effect is often more elegant than slide
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  
  return (
    <div className="banner-container">
      <Slider {...settings}>
        {bannerSlides.map((slide, index) => {
          const content = (
            <div className="banner-item" key={slide.id}>
              <Image
                src={slide.imageUrl}
                alt={slide.altText}
                fill // Use fill for responsive, container-bound images
                sizes="100vw"
                priority={index === 0} // Mark the first image as high priority for LCP
                className="banner-item-img"
              />
            </div>
          );

          // If the slide has a link, wrap it in a Link component
          return slide.link ? <Link href={slide.link}>{content}</Link> : content;
        })}
      </Slider>
    </div>
  );
};

export default Banner;
