"use client";

import { useState, useEffect } from "react";
import "./Hero.css";
import Hero1 from "../../../assets/images/hero1.jpg"; // Adjust the path as necessary
import Hero2 from "../../../assets/images/hero2.jpg";
import Hero3 from "../../../assets/images/hero3.jpg";
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000); // Change slide every 2 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-inner">
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button className="btn btn-hero">Get Started</button>
              </div>
            </div>
          </div>
        ))}

        <button
          className="slider-nav prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          ❮
        </button>
        <button
          className="slider-nav next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ❯
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
