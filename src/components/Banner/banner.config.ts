interface BannerSlide {
    id: number;
    imageUrl: string;
    altText: string;
    link?: string; // Optional link for the slide
}

export const bannerSlides: BannerSlide[] = [
    {
        id: 1,
        imageUrl: "/images/sl4.jpg",
        altText: "High-quality badminton rackets on sale",
    },
    {
        id: 2,
        imageUrl: "/images/sl6.jpg",
        altText: "Professional badminton shoes for all court types",
    },
    {
        id: 3,
        imageUrl: "/images/sl8.jpg",
        altText: "Stylish and comfortable badminton apparel",
    },
];
