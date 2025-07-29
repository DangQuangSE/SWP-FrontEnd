"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "./Hero.css";
import Hero1 from "../../../assets/images/hero1.jpg";
import Hero2 from "../../../assets/images/hero2.jpg";
import Hero3 from "../../../assets/images/hero3.jpg";
const Hero = () => {
  const slides = [
    {
      image: Hero1,
    },
    {
      image: Hero2,
    },
    {
      image: Hero3,
    },
  ];

  return (
    <section className="hero">
      <div className="hero-fadeout"></div>
      <Splide
        options={{
          type: "loop",
          perPage: 1,
          autoplay: true,
          interval: 3000,
          pauseOnHover: true,
          arrows: true,
          pagination: true,
        }}
        className="hero-slider"
        style={{ height: "60vh" }}
      >
        {slides.map((slide, index) => (
          <SplideSlide key={index}>
            <div
              className="hero-slide"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
};

export default Hero;
