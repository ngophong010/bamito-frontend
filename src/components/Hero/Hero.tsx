"use client";
import React from "react";
import { Box, Container, Button, Typography, Chip, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowRight as ArrowRightIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "600px",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("md")]: {
    height: "700px",
  },
}));

const HeroBackground = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  color: "white",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const HeroBadge = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderColor: "rgba(255, 255, 255, 0.3)",
  color: "white",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 700,
  padding: `${theme.spacing(0.75)} ${theme.spacing(2)}`,
  border: "1px solid rgba(255, 255, 255, 0.3)",
  display: "inline-block",
  width: "fit-content",
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  maxWidth: "100%",
  fontSize: "3rem",
  fontWeight: 900,
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  textTransform: "uppercase",
  [theme.breakpoints.up("sm")]: {
    fontSize: "3.75rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "4.5rem",
    maxWidth: "90%",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "5rem",
  },
  "& .highlight": {
    color: theme.palette.primary.main,
  },
}));

const HeroDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  maxWidth: "100%",
  fontSize: "1rem",
  lineHeight: 1.6,
  color: "#D1D5DB",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.125rem",
    maxWidth: "80%",
  },
  [theme.breakpoints.up("md")]: {
    maxWidth: "60%",
  },
}));

const HeroButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  alignItems: "center",
}));

const HeroPrimaryButton = styled(Button)(({ theme }) => ({
  height: "48px",
  borderRadius: "9999px",
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const HeroSecondaryButton = styled(Button)(({ theme }) => ({
  height: "48px",
  borderRadius: "9999px",
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  border: "2px solid white",
  color: "white",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

interface HeroProps {
  backgroundImage?: string;
  badgeText?: string;
  title?: React.ReactNode;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const Hero: React.FC<HeroProps> = ({
  backgroundImage = "/placeholder.svg?height=1080&width=1920",
  badgeText = "New Collection 2025",
  title = (
    <>
      ĐÁNH THỨC <br />
      <span className="highlight">BẢN LĨNH</span>
    </>
  ),
  description = "Trang bị đẳng cấp cho những cú đập cầu uy lực. Khám phá bộ sưu tập vợt và giày mới nhất tại Amito.",
  primaryButtonText = "Mua Ngay",
  primaryButtonLink = "/products",
  secondaryButtonText = "Xem Bộ Sưu Tập",
  secondaryButtonLink = "/sale",
}) => {
  const theme = useTheme();

  return (
    <HeroSection>
      {/* Background Image with Overlay */}
      <HeroBackground>
        <Image
          src={backgroundImage}
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </HeroBackground>

      {/* Hero Content */}
      <HeroContent maxWidth="lg">
        {/* Badge */}
        <HeroBadge label={badgeText} variant="outlined" />

        {/* Title */}
        <HeroTitle variant="h1">{title}</HeroTitle>

        {/* Description */}
        <HeroDescription variant="body1">{description}</HeroDescription>

        {/* Button Group */}
        <HeroButtonGroup>
          {/* Primary Button */}
          <Link href={primaryButtonLink} style={{ textDecoration: "none" }}>
            <HeroPrimaryButton>
              {primaryButtonText}
              <ArrowRightIcon sx={{ fontSize: "1.25rem" }} />
            </HeroPrimaryButton>
          </Link>

          {/* Secondary Button */}
          <Link href={secondaryButtonLink} style={{ textDecoration: "none" }}>
            <HeroSecondaryButton>
              {secondaryButtonText}
            </HeroSecondaryButton>
          </Link>
        </HeroButtonGroup>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
