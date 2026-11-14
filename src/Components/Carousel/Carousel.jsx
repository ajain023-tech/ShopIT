import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { heroSlides } from '../../Helpers/HomePageBanner'
import './Carousel.css'

const SLIDE_TIME = 5000

// full width banner slider for the home page
const Carousel = () => {
    const [current, setCurrent] = useState(0)
    const total = heroSlides.length

    // move to the next slide every few seconds
    useEffect(() => {
        const timer = setTimeout(() => setCurrent((current + 1) % total), SLIDE_TIME)
        return () => clearTimeout(timer)
    }, [current, total])

    const goTo = (index) => setCurrent((index + total) % total)

    return (
        <div className='hero-carousel'>
            <div className='hero-carousel__frame'>
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.title}
                        className={`hero-slide ${index === current ? 'hero-slide--active' : ''}`}
                        style={{ backgroundImage: `url(${slide.img})` }}
                        aria-hidden={index !== current}
                    >
                        <div className='hero-slide__overlay' />
                        <div className='hero-slide__content'>
                            <span className='hero-slide__tag'>{slide.tag}</span>
                            <h2 className='hero-slide__title'>{slide.title}</h2>
                            <p className='hero-slide__text'>{slide.text}</p>
                            <Link to={slide.to} className='hero-slide__button' tabIndex={index === current ? 0 : -1}>Shop Now →</Link>
                        </div>
                    </div>
                ))}

                <button className='hero-carousel__arrow hero-carousel__arrow--left' onClick={() => goTo(current - 1)} aria-label='Previous slide'>
                    <MdChevronLeft />
                </button>
                <button className='hero-carousel__arrow hero-carousel__arrow--right' onClick={() => goTo(current + 1)} aria-label='Next slide'>
                    <MdChevronRight />
                </button>
            </div>

            <div className='hero-carousel__dots'>
                {heroSlides.map((slide, index) => (
                    <button
                        key={slide.title}
                        className={`hero-carousel__dot ${index === current ? 'hero-carousel__dot--active' : ''}`}
                        onClick={() => goTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Carousel
