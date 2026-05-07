import { ComparisonRecord, Property, PropertyQueryOptions } from "@/types/property";
import {
  Interaction,
  InteractionQueryOptions,
  Lead,
  LeadQueryOptions,
  Viewing,
  ViewingQueryOptions
} from "@/types/crm";
import { UserProfile } from "@/types/user";

const userIds = {
  admin: "usr_aarav_sharma",
  agent: "usr_naina_mehta",
  manager: "usr_kabir_rao",
  investor: "usr_rhea_kapoor",
  buyer: "usr_dev_malhotra"
} as const;

const propertyIds = {
  marina: "marina-crest-residences-worli",
  summit: "summit-one-business-suites-indiranagar",
  verde: "verde-courtyard-villas-kokapet",
  harbor: "harbor-quarter-lofts-adyar",
  aurelia: "aurelia-park-homes-kharadi",
  citrine: "citrine-heights-penthouse-golf-course-road",
  orion: "orion-smart-enclave-noida",
  glass: "the-glass-house-alibaug",
  echo: "urban-echo-lofts-kochi",
  haveli: "heritage-haveli-jaipur",
  lake: "emerald-lake-retreat-nainital",
  serene: "serene-palms-estate-goa",
  sapphire: "sapphire-sky-residences-kolkata",
  titanium: "titanium-business-park-ahmedabad",
  willow: "willow-creek-villas-chandigarh",
  apex: "apex-prime-suites-navi-mumbai",
  golden: "golden-sands-retreat-jaisalmer",
  zen: "the-zen-gardens-bhopal"
} as const;

const leadIds = {
  ishita: "lead_ishita_arora",
  rahul: "lead_rahul_menon",
  sana: "lead_sana_qureshi",
  pranav: "lead_pranav_sethi"
} as const;

const demoPropertyImages = {
  skyline:
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
  terrace:
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80",
  lounge:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
  tower:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
  penthouse:
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80",
  villa:
    "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1400&q=80",
  workspace:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  amenity:
    "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1400&q=80",
  modern:
    "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1400&q=80",
  minimal:
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
  cabin:
    "https://images.unsplash.com/photo-1449156001437-3a1621dfbe2b?auto=format&fit=crop&w=1400&q=80",
  suburban:
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
  interior:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
  pool:
    "https://images.unsplash.com/photo-1512915922686-57c11ed9d6f3?auto=format&fit=crop&w=1400&q=80",
  glass:
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80",
  loft:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
  cottage:
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=80",
  highrise:
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1400&q=80",
  oasis:
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=1400&q=80",
  smarthome:
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=1400&q=80",
  luxury:
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80",
  modern_apt:
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80"
};

export const demoProperties: Property[] = [
  {
    id: propertyIds.marina,
    title: "Marina Crest Residences",
    description:
      "Skyline-facing 3 BHK apartment with hospitality-grade amenities, strong rental demand, and immediate move-in readiness.",
    type: "Luxury Apartment",
    price: 28500000,
    areaSqFt: 2350,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      city: "Mumbai",
      locality: "Worli",
      address: "17 Sea Link Avenue"
    },
    amenities: ["Infinity pool", "Concierge", "Sky deck", "Gym", "EV charging"],
    neighborhoodInfo:
      "Minutes from BKC and Lower Parel with strong executive leasing demand, premium retail, and fast arterial access.",
    imageUrls: [
      demoPropertyImages.skyline,
      demoPropertyImages.terrace,
      demoPropertyImages.lounge
    ],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-24T09:30:00.000Z",
    updatedAt: "2026-03-29T14:10:00.000Z",
    locationRating: 9.4,
    roiPotential: 14.8,
    monthlyRentEstimate: 145000
  },
  {
    id: propertyIds.summit,
    title: "Summit One Business Suites",
    description:
      "Flexible mixed-use asset positioned for founder offices, premium stays, or high-yield furnished rentals.",
    type: "Mixed Use",
    price: 19800000,
    areaSqFt: 1810,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      city: "Bengaluru",
      locality: "Indiranagar",
      address: "42 Double Road"
    },
    amenities: ["Valet parking", "Meeting lounge", "Rooftop cafe", "Power backup"],
    neighborhoodInfo:
      "Strong startup corridor with premium tenant demand, walkable dining, and resilient resale liquidity.",
    imageUrls: [
      demoPropertyImages.workspace,
      demoPropertyImages.tower,
      demoPropertyImages.amenity
    ],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-22T11:00:00.000Z",
    updatedAt: "2026-03-28T08:20:00.000Z",
    locationRating: 8.9,
    roiPotential: 15.6,
    monthlyRentEstimate: 118000
  },
  {
    id: propertyIds.verde,
    title: "Verde Courtyard Villas",
    description:
      "Low-density villa community designed for end users who value privacy, landscaped greens, and family-oriented amenities.",
    type: "Villa",
    price: 36500000,
    areaSqFt: 3200,
    bedrooms: 4,
    bathrooms: 4,
    location: {
      city: "Hyderabad",
      locality: "Kokapet",
      address: "9 Ridge Park"
    },
    amenities: ["Clubhouse", "Private lawn", "Children's play zone", "Jogging track"],
    neighborhoodInfo:
      "Fast-rising west Hyderabad corridor with premium schools nearby and strong mid-term appreciation momentum.",
    imageUrls: [
      demoPropertyImages.villa,
      demoPropertyImages.terrace,
      demoPropertyImages.amenity
    ],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-21T07:45:00.000Z",
    updatedAt: "2026-03-27T10:15:00.000Z",
    locationRating: 8.7,
    roiPotential: 13.1,
    monthlyRentEstimate: 172000
  },
  {
    id: propertyIds.harbor,
    title: "Harbor Quarter Lofts",
    description:
      "Design-forward waterfront loft inventory with investor-friendly ticket size and high amenity density.",
    type: "Loft",
    price: 15600000,
    areaSqFt: 1420,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      city: "Chennai",
      locality: "Adyar",
      address: "6 Riverfront Street"
    },
    amenities: ["Residents lounge", "Co-working floor", "Pool", "Smart access"],
    neighborhoodInfo:
      "Balanced for young professionals with strong social infrastructure, steady rent demand, and coastal prestige.",
    imageUrls: [
      demoPropertyImages.lounge,
      demoPropertyImages.skyline,
      demoPropertyImages.workspace
    ],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-18T13:00:00.000Z",
    updatedAt: "2026-03-26T16:45:00.000Z",
    locationRating: 8.4,
    roiPotential: 12.7,
    monthlyRentEstimate: 76000
  },
  {
    id: propertyIds.aurelia,
    title: "Aurelia Park Homes",
    description:
      "Family-focused gated tower inventory with balanced pricing, clean floorplates, and strong owner-occupier appeal.",
    type: "Apartment",
    price: 14200000,
    areaSqFt: 1680,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      city: "Pune",
      locality: "Kharadi",
      address: "21 Eon Promenade"
    },
    amenities: ["Podium garden", "Fitness studio", "Cricket net", "Multi-purpose hall"],
    neighborhoodInfo:
      "Well-positioned near employment hubs with broad buyer demand and dependable upgrade-family conversions.",
    imageUrls: [
      demoPropertyImages.tower,
      demoPropertyImages.amenity,
      demoPropertyImages.lounge
    ],
    createdBy: userIds.manager,
    status: "draft",
    createdAt: "2026-03-17T12:15:00.000Z",
    updatedAt: "2026-03-25T09:00:00.000Z",
    locationRating: 8.1,
    roiPotential: 11.6,
    monthlyRentEstimate: 62000
  },
  {
    id: propertyIds.citrine,
    title: "Citrine Heights Penthouse",
    description:
      "Signature penthouse inventory curated for founder and NRI buyers seeking statement product in a high-growth micro-market.",
    type: "Penthouse",
    price: 42800000,
    areaSqFt: 3580,
    bedrooms: 4,
    bathrooms: 5,
    location: {
      city: "Gurugram",
      locality: "Golf Course Road",
      address: "3 Horizon Crest"
    },
    amenities: ["Private deck", "Home automation", "Sky lounge", "Spa", "Chef kitchen"],
    neighborhoodInfo:
      "Ultra-premium catchment with excellent connectivity, executive leasing upside, and strong trophy-asset visibility.",
    imageUrls: [
      demoPropertyImages.penthouse,
      demoPropertyImages.skyline,
      demoPropertyImages.terrace
    ],
    createdBy: userIds.manager,
    status: "sold",
    createdAt: "2026-03-12T10:40:00.000Z",
    updatedAt: "2026-03-24T17:30:00.000Z",
    locationRating: 9.6,
    roiPotential: 16.2,
    monthlyRentEstimate: 210000
  },
  {
    id: propertyIds.orion,
    title: "Orion Smart Enclave",
    description: "Fully automated smart homes with gesture controls, AI-driven climate management, and biophilic design in the heart of Noida.",
    type: "Apartment",
    price: 18500000,
    areaSqFt: 1950,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      city: "Noida",
      locality: "Sector 150",
      address: "88 Expressway View"
    },
    amenities: ["Smart locks", "Air purification", "Voice assistant", "Automated lighting"],
    neighborhoodInfo: "Next-gen tech corridor with upcoming airport connectivity and vast green expanses.",
    imageUrls: [demoPropertyImages.smarthome, demoPropertyImages.minimal, demoPropertyImages.workspace],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-02T12:00:00.000Z",
    locationRating: 8.5,
    roiPotential: 14.2,
    monthlyRentEstimate: 85000
  },
  {
    id: propertyIds.glass,
    title: "The Glass House",
    description: "Architectural masterpiece featuring floor-to-ceiling glass walls, private beach access, and a minimalist aesthetic for luxury living.",
    type: "Villa",
    price: 55000000,
    areaSqFt: 4500,
    bedrooms: 5,
    bathrooms: 6,
    location: {
      city: "Alibaug",
      locality: "Kihim",
      address: "1 Coastal Lane"
    },
    amenities: ["Private beach", "Glass infinity pool", "Wine cellar", "Home theater"],
    neighborhoodInfo: "Exclusive coastal retreat popular with HNI buyers and celebrities for weekend escapes.",
    imageUrls: [demoPropertyImages.glass, demoPropertyImages.pool, demoPropertyImages.interior],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-30T14:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z",
    locationRating: 9.8,
    roiPotential: 18.5,
    monthlyRentEstimate: 350000
  },
  {
    id: propertyIds.echo,
    title: "Urban Echo Lofts",
    description: "Industrial-style lofts with exposed brick, high ceilings, and a vibrant community of creative professionals in Kochi.",
    type: "Loft",
    price: 11500000,
    areaSqFt: 1550,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      city: "Kochi",
      locality: "Kadavanthra",
      address: "24 Metro Hub"
    },
    amenities: ["Art studio", "Rooftop deck", "Cafe", "High-speed internet"],
    neighborhoodInfo: "Vibrant urban center with excellent metro access and cultural hotspots.",
    imageUrls: [demoPropertyImages.loft, demoPropertyImages.interior, demoPropertyImages.modern],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-28T11:00:00.000Z",
    updatedAt: "2026-03-31T08:00:00.000Z",
    locationRating: 8.2,
    roiPotential: 11.8,
    monthlyRentEstimate: 45000
  },
  {
    id: propertyIds.haveli,
    title: "Heritage Haveli",
    description: "Restored 19th-century haveli blending Rajasthani grandeur with modern luxury, featuring hand-painted frescoes and a courtyard pool.",
    type: "Boutique Hotel",
    price: 85000000,
    areaSqFt: 8000,
    bedrooms: 12,
    bathrooms: 12,
    location: {
      city: "Jaipur",
      locality: "Pink City",
      address: "Heritage Road"
    },
    amenities: ["Courtyard pool", "Spa", "Rooftop dining", "Library"],
    neighborhoodInfo: "Historical district with high tourist footfall and cultural significance.",
    imageUrls: [demoPropertyImages.interior, demoPropertyImages.pool, demoPropertyImages.cottage],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-25T09:00:00.000Z",
    updatedAt: "2026-03-29T15:00:00.000Z",
    locationRating: 9.5,
    roiPotential: 19.2,
    monthlyRentEstimate: 1200000
  },
  {
    id: propertyIds.lake,
    title: "Emerald Lake Retreat",
    description: "Breathtaking lakeside cottage with panoramic views of the Himalayas, perfect for vacation rental or a serene second home.",
    type: "Cottage",
    price: 22000000,
    areaSqFt: 2800,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      city: "Nainital",
      locality: "Bhimtal",
      address: "15 Lakeside View"
    },
    amenities: ["Fireplace", "Outdoor grill", "Balcony", "Garden"],
    neighborhoodInfo: "Quiet hill station micro-market with steady seasonal rental demand.",
    imageUrls: [demoPropertyImages.cabin, demoPropertyImages.cottage, demoPropertyImages.modern],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-20T13:00:00.000Z",
    updatedAt: "2026-03-27T10:00:00.000Z",
    locationRating: 8.8,
    roiPotential: 12.5,
    monthlyRentEstimate: 95000
  },
  {
    id: propertyIds.serene,
    title: "Serene Palms Estate",
    description: "Tropical estate nestled among palm trees, featuring a Mediterranean-style villa and direct access to a quiet beach in South Goa.",
    type: "Estate",
    price: 48000000,
    areaSqFt: 6000,
    bedrooms: 5,
    bathrooms: 5,
    location: {
      city: "Goa",
      locality: "Benaulim",
      address: "42 Beach Haven"
    },
    amenities: ["Private pool", "Barbecue area", "Staff quarters", "Security system"],
    neighborhoodInfo: "Relaxed coastal area with premium luxury villa clusters.",
    imageUrls: [demoPropertyImages.pool, demoPropertyImages.villa, demoPropertyImages.terrace],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-15T12:00:00.000Z",
    updatedAt: "2026-03-22T09:00:00.000Z",
    locationRating: 9.2,
    roiPotential: 15.1,
    monthlyRentEstimate: 280000
  },
  {
    id: propertyIds.sapphire,
    title: "Sapphire Sky Residences",
    description: "Ultra-luxury apartments with panoramic views of the Victoria Memorial, featuring gold-plated fixtures and world-class concierge.",
    type: "Apartment",
    price: 32000000,
    areaSqFt: 3100,
    bedrooms: 4,
    bathrooms: 4,
    location: {
      city: "Kolkata",
      locality: "Alipore",
      address: "7 Royal Park"
    },
    amenities: ["Concierge", "Valet parking", "Private elevator", "Guest suites"],
    neighborhoodInfo: "Kolkata's most prestigious neighborhood with historic charm and elite social circles.",
    imageUrls: [demoPropertyImages.highrise, demoPropertyImages.skyline, demoPropertyImages.lounge],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-10T11:00:00.000Z",
    updatedAt: "2026-03-18T14:00:00.000Z",
    locationRating: 9.4,
    roiPotential: 13.8,
    monthlyRentEstimate: 180000
  },
  {
    id: propertyIds.titanium,
    title: "Titanium Business Park",
    description: "Modern commercial spaces with flexible floorplans, designed for corporate headquarters and high-end retail in Ahmedabad.",
    type: "Commercial",
    price: 25000000,
    areaSqFt: 5000,
    bedrooms: 0,
    bathrooms: 4,
    location: {
      city: "Ahmedabad",
      locality: "Prahlad Nagar",
      address: "101 Business Hub"
    },
    amenities: ["Server room", "Conference hall", "Cafeteria", "24/7 Security"],
    neighborhoodInfo: "Established business district with excellent highway connectivity.",
    imageUrls: [demoPropertyImages.tower, demoPropertyImages.workspace, demoPropertyImages.amenity],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-03-05T08:00:00.000Z",
    updatedAt: "2026-03-15T11:00:00.000Z",
    locationRating: 8.6,
    roiPotential: 16.5,
    monthlyRentEstimate: 220000
  },
  {
    id: propertyIds.willow,
    title: "Willow Creek Villas",
    description: "Luxury villas in a secure gated community, featuring modern architecture and lush private gardens in the Garden City of Chandigarh.",
    type: "Villa",
    price: 38000000,
    areaSqFt: 4000,
    bedrooms: 4,
    bathrooms: 5,
    location: {
      city: "Chandigarh",
      locality: "Sector 10",
      address: "5 Willow Drive"
    },
    amenities: ["Solar panels", "Rainwater harvesting", "Gym", "Tennis court"],
    neighborhoodInfo: "Premium residential sector with wide roads and high quality of life.",
    imageUrls: [demoPropertyImages.suburban, demoPropertyImages.modern, demoPropertyImages.amenity],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-02-28T09:00:00.000Z",
    updatedAt: "2026-03-10T12:00:00.000Z",
    locationRating: 9.1,
    roiPotential: 12.2,
    monthlyRentEstimate: 155000
  },
  {
    id: propertyIds.apex,
    title: "Apex Prime Suites",
    description: "Compact yet luxury studio apartments designed for young professionals working in the nearby corporate hubs of Navi Mumbai.",
    type: "Studio",
    price: 8500000,
    areaSqFt: 750,
    bedrooms: 1,
    bathrooms: 1,
    location: {
      city: "Navi Mumbai",
      locality: "Vashi",
      address: "99 Station Road"
    },
    amenities: ["Laundry service", "Co-working space", "Mini gym", "Cafe"],
    neighborhoodInfo: "Strategic location near railway station and IT parks.",
    imageUrls: [demoPropertyImages.minimal, demoPropertyImages.modern, demoPropertyImages.loft],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-02-20T10:00:00.000Z",
    updatedAt: "2026-03-05T14:00:00.000Z",
    locationRating: 8.0,
    roiPotential: 11.5,
    monthlyRentEstimate: 38000
  },
  {
    id: propertyIds.golden,
    title: "Golden Sands Retreat",
    description: "Luxury tented camp and desert estate offering a unique glamping experience under the stars in the Thar Desert.",
    type: "Resort",
    price: 28000000,
    areaSqFt: 10000,
    bedrooms: 8,
    bathrooms: 8,
    location: {
      city: "Jaisalmer",
      locality: "Sam Sand Dunes",
      address: "Desert Oasis Road"
    },
    amenities: ["Star gazing deck", "Camel safari", "Traditional dining", "Bonfire area"],
    neighborhoodInfo: "Major tourist destination with high demand for experiential stays.",
    imageUrls: [demoPropertyImages.oasis, demoPropertyImages.cottage, demoPropertyImages.interior],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-02-10T11:00:00.000Z",
    updatedAt: "2026-02-25T16:00:00.000Z",
    locationRating: 9.0,
    roiPotential: 17.8,
    monthlyRentEstimate: 450000
  },
  {
    id: propertyIds.zen,
    title: "The Zen Gardens",
    description: "Vastu-compliant homes designed for holistic living, featuring meditation centers and organic gardens in the city of Lakes.",
    type: "Apartment",
    price: 15500000,
    areaSqFt: 1800,
    bedrooms: 3,
    bathrooms: 3,
    location: {
      city: "Bhopal",
      locality: "Arera Colony",
      address: "12 Peace Lane"
    },
    amenities: ["Meditation hall", "Organic farm", "Yoga deck", "Library"],
    neighborhoodInfo: "Quiet and green residential area with strong community vibes.",
    imageUrls: [demoPropertyImages.interior, demoPropertyImages.minimal, demoPropertyImages.modern],
    createdBy: userIds.manager,
    status: "active",
    createdAt: "2026-02-01T09:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z",
    locationRating: 8.4,
    roiPotential: 10.8,
    monthlyRentEstimate: 55000
  }
];

export const demoUsers: UserProfile[] = [
  {
    uid: userIds.admin,
    fullName: "Aarav Sharma",
    email: "aarav.sharma@propwise.in",
    role: "admin",
    phone: "+91 98765 11001",
    status: "active",
    createdAt: "2026-03-01T06:00:00.000Z",
    updatedAt: "2026-03-28T06:00:00.000Z"
  },
  {
    uid: userIds.agent,
    fullName: "Naina Mehta",
    email: "naina.mehta@propwise.in",
    role: "agent",
    phone: "+91 98765 11002",
    status: "active",
    createdAt: "2026-03-03T06:00:00.000Z",
    updatedAt: "2026-03-29T06:00:00.000Z"
  },
  {
    uid: userIds.manager,
    fullName: "Kabir Rao",
    email: "kabir.rao@propwise.in",
    role: "property_manager",
    phone: "+91 98765 11003",
    status: "active",
    createdAt: "2026-03-04T06:00:00.000Z",
    updatedAt: "2026-03-26T06:00:00.000Z"
  },
  {
    uid: userIds.investor,
    fullName: "Rhea Kapoor",
    email: "rhea.kapoor@propwise.in",
    role: "investor",
    phone: "+91 98765 11004",
    status: "active",
    createdAt: "2026-03-05T06:00:00.000Z",
    updatedAt: "2026-03-24T06:00:00.000Z"
  },
  {
    uid: userIds.buyer,
    fullName: "Dev Malhotra",
    email: "dev.malhotra@propwise.in",
    role: "buyer",
    phone: "+91 98765 11005",
    status: "active",
    createdAt: "2026-03-06T06:00:00.000Z",
    updatedAt: "2026-03-27T06:00:00.000Z"
  }
];

export const demoLeads: Lead[] = [
  {
    id: leadIds.ishita,
    name: "Ishita Arora",
    email: "ishita.arora@example.com",
    phone: "+91 98100 55221",
    source: "Website inquiry",
    priority: "high",
    budgetMin: 18000000,
    budgetMax: 26000000,
    preferences: {
      city: "Mumbai",
      type: "Luxury Apartment",
      bedrooms: 3,
      notes: "Looking for a ready-to-move-in home near sea-facing micro-markets."
    },
    assignedAgentId: userIds.agent,
    requestedByUserId: userIds.buyer,
    status: "qualified",
    notes: "Strong urgency, finance in principle approved, wants two shortlist options this week.",
    linkedPropertyIds: [propertyIds.marina, propertyIds.harbor],
    nextFollowUpAt: "2026-03-31T06:30:00.000Z",
    createdAt: "2026-03-29T11:10:00.000Z",
    updatedAt: "2026-03-30T07:15:00.000Z"
  },
  {
    id: leadIds.rahul,
    name: "Rahul Menon",
    email: "rahul.menon@example.com",
    phone: "+91 98210 22345",
    source: "Referral",
    priority: "medium",
    budgetMin: 13000000,
    budgetMax: 17000000,
    preferences: {
      city: "Pune",
      type: "Apartment",
      bedrooms: 3,
      notes: "Wants strong school catchments and modest maintenance costs."
    },
    assignedAgentId: userIds.agent,
    status: "contacted",
    notes: "Comparing Kharadi and Baner. Wife joining site visit on Friday.",
    linkedPropertyIds: [propertyIds.aurelia],
    nextFollowUpAt: "2026-03-30T12:30:00.000Z",
    createdAt: "2026-03-28T05:50:00.000Z",
    updatedAt: "2026-03-29T10:15:00.000Z"
  },
  {
    id: leadIds.sana,
    name: "Sana Qureshi",
    email: "sana.qureshi@example.com",
    phone: "+91 99587 77821",
    source: "Campaign landing page",
    priority: "high",
    budgetMin: 30000000,
    budgetMax: 42000000,
    preferences: {
      city: "Hyderabad",
      type: "Villa",
      bedrooms: 4,
      notes: "Prefers gated inventory with generous outdoor area."
    },
    assignedAgentId: userIds.agent,
    status: "new",
    notes: "Requested weekend-only viewings. Reviewing financing options with banker.",
    linkedPropertyIds: [propertyIds.verde],
    nextFollowUpAt: "2026-04-01T08:00:00.000Z",
    createdAt: "2026-03-30T04:45:00.000Z",
    updatedAt: "2026-03-30T04:45:00.000Z"
  },
  {
    id: leadIds.pranav,
    name: "Pranav Sethi",
    email: "pranav.sethi@example.com",
    phone: "+91 98991 56431",
    source: "Property detail request",
    priority: "medium",
    budgetMin: 18000000,
    budgetMax: 24000000,
    preferences: {
      city: "Bengaluru",
      type: "Mixed Use",
      notes: "Interested in dual-use asset for office plus short-stay income."
    },
    assignedAgentId: userIds.agent,
    requestedByUserId: userIds.investor,
    status: "closed",
    notes: "Token paid after second negotiation. Awaiting registration paperwork.",
    linkedPropertyIds: [propertyIds.summit],
    nextFollowUpAt: "2026-03-30T09:15:00.000Z",
    createdAt: "2026-03-20T09:20:00.000Z",
    updatedAt: "2026-03-29T14:00:00.000Z"
  }
];

export const demoInteractions: Interaction[] = [
  {
    id: "int_20260330_01",
    leadId: leadIds.ishita,
    propertyId: propertyIds.marina,
    agentId: userIds.agent,
    type: "call",
    notes: "Walked through tower specifications, handover timeline, and neighboring inventory pricing.",
    interactionAt: "2026-03-30T06:45:00.000Z",
    outcome: "Requested a Saturday viewing slot."
  },
  {
    id: "int_20260329_02",
    leadId: leadIds.rahul,
    propertyId: propertyIds.aurelia,
    agentId: userIds.agent,
    type: "email",
    notes: "Shared family-focused shortlist with school distance map and EMI estimate.",
    interactionAt: "2026-03-29T09:20:00.000Z",
    outcome: "Buyer shortlisted two layouts."
  },
  {
    id: "int_20260328_03",
    leadId: leadIds.sana,
    propertyId: propertyIds.verde,
    agentId: userIds.agent,
    type: "meeting",
    notes: "Discussed villa inventory phases, upgrade options, and expected appreciation over 36 months.",
    interactionAt: "2026-03-28T12:10:00.000Z",
    outcome: "Requested financing partner introduction."
  },
  {
    id: "int_20260327_04",
    leadId: leadIds.pranav,
    propertyId: propertyIds.summit,
    agentId: userIds.agent,
    type: "viewing",
    notes: "Completed second site visit with spouse and tax advisor in attendance.",
    interactionAt: "2026-03-27T11:00:00.000Z",
    outcome: "Negotiation moved to token stage."
  }
];

export const demoViewings: Viewing[] = [
  {
    id: "viewing_20260331_01",
    propertyId: propertyIds.marina,
    leadId: leadIds.ishita,
    agentId: userIds.agent,
    scheduledAt: "2026-03-31T05:30:00.000Z",
    status: "scheduled",
    notes: "Sunset slot with clubhouse walkthrough and parking allocation review.",
    createdAt: "2026-03-30T06:00:00.000Z",
    updatedAt: "2026-03-30T06:00:00.000Z"
  },
  {
    id: "viewing_20260330_02",
    propertyId: propertyIds.aurelia,
    leadId: leadIds.rahul,
    agentId: userIds.agent,
    scheduledAt: "2026-03-30T11:30:00.000Z",
    status: "scheduled",
    notes: "Family-oriented walkthrough with school bus route briefing.",
    createdAt: "2026-03-29T07:45:00.000Z",
    updatedAt: "2026-03-29T07:45:00.000Z"
  },
  {
    id: "viewing_20260328_03",
    propertyId: propertyIds.verde,
    leadId: leadIds.sana,
    agentId: userIds.agent,
    scheduledAt: "2026-03-28T10:00:00.000Z",
    status: "completed",
    notes: "Visited show villa and reviewed plot orientation options.",
    createdAt: "2026-03-26T09:10:00.000Z",
    updatedAt: "2026-03-28T13:25:00.000Z"
  },
  {
    id: "viewing_20260325_04",
    propertyId: propertyIds.summit,
    leadId: leadIds.pranav,
    agentId: userIds.agent,
    scheduledAt: "2026-03-25T06:30:00.000Z",
    status: "cancelled",
    notes: "Investor asked to reschedule after legal review delay.",
    createdAt: "2026-03-24T08:15:00.000Z",
    updatedAt: "2026-03-25T05:40:00.000Z"
  }
];

const baseComparisonRecords: ComparisonRecord[] = [
  {
    id: "cmp_executive_capital_deployment",
    userId: userIds.investor,
    propertyIds: [propertyIds.marina, propertyIds.summit, propertyIds.verde],
    criteriaWeights: {
      price: 3,
      area: 4,
      amenities: 3,
      location: 5
    },
    title: "Executive capital deployment",
    createdAt: "2026-03-29T07:30:00.000Z",
    updatedAt: "2026-03-29T07:30:00.000Z"
  },
  {
    id: "cmp_upgrade_family_shortlist",
    userId: userIds.buyer,
    propertyIds: [propertyIds.aurelia, propertyIds.harbor, propertyIds.marina],
    criteriaWeights: {
      price: 4,
      area: 3,
      amenities: 4,
      location: 4
    },
    title: "Upgrade-family shortlist",
    createdAt: "2026-03-27T12:15:00.000Z",
    updatedAt: "2026-03-27T12:15:00.000Z"
  },
  {
    id: "cmp_premium_flagship_inventory",
    userId: userIds.admin,
    propertyIds: [propertyIds.citrine, propertyIds.marina, propertyIds.verde],
    criteriaWeights: {
      price: 2,
      area: 4,
      amenities: 5,
      location: 5
    },
    title: "Premium flagship inventory",
    createdAt: "2026-03-24T10:30:00.000Z",
    updatedAt: "2026-03-24T10:30:00.000Z"
  }
];

export const demoComparisons = baseComparisonRecords;

const fallbackRecordIds = new Set<string>([
  ...demoProperties.map((property) => property.id),
  ...demoUsers.map((user) => user.uid),
  ...demoLeads.map((lead) => lead.id),
  ...demoInteractions.map((interaction) => interaction.id),
  ...demoViewings.map((viewing) => viewing.id),
  ...baseComparisonRecords.map((comparison) => comparison.id)
]);

export function isDemoRecord(id?: string) {
  return Boolean(id && (fallbackRecordIds.has(id) || id.startsWith("cmp_local_")));
}

export function getDemoProperties(options?: PropertyQueryOptions) {
  const filtered = demoProperties.filter((property) => {
    if (options?.status && options.status !== "all" && property.status !== options.status) {
      return false;
    }

    if (options?.ids?.length && !options.ids.includes(property.id)) {
      return false;
    }

    if (options?.createdBy && property.createdBy !== options.createdBy) {
      return false;
    }

    return true;
  });

  if (filtered.length > 0) {
    return filtered;
  }

  // Fallback to all demo properties if status-based filtering results in nothing
  return demoProperties;
}

export function getDemoPropertyById(id: string) {
  return demoProperties.find((property) => property.id === id) ?? null;
}

export function getDemoLeads(options?: LeadQueryOptions) {
  const filtered = demoLeads.filter((lead) => {
    if (options?.assignedAgentId && lead.assignedAgentId !== options.assignedAgentId) {
      return false;
    }

    if (options?.requestedByUserId && lead.requestedByUserId !== options.requestedByUserId) {
      return false;
    }

    return true;
  });

  return filtered.length > 0 ? filtered : demoLeads;
}

export function getDemoInteractions(options?: InteractionQueryOptions) {
  const filtered = demoInteractions.filter((interaction) => {
    if (options?.agentId && interaction.agentId !== options.agentId) {
      return false;
    }

    if (options?.leadId && interaction.leadId !== options.leadId) {
      return false;
    }

    return true;
  });

  return filtered.length > 0 ? filtered : demoInteractions;
}

export function getDemoViewings(options?: ViewingQueryOptions) {
  const filtered = demoViewings.filter((viewing) => {
    if (options?.agentId && viewing.agentId !== options.agentId) {
      return false;
    }

    if (options?.leadId && viewing.leadId !== options.leadId) {
      return false;
    }

    return true;
  });

  return filtered.length > 0 ? filtered : demoViewings;
}

export function getDemoUsers() {
  return demoUsers;
}

export function getDemoComparisons(userId?: string) {
  if (!userId) {
    return baseComparisonRecords;
  }

  return baseComparisonRecords.map((comparison, index) => ({
    ...comparison,
    id: `cmp_seeded_${index + 1}`,
    userId
  }));
}

export function getDemoComparisonCount() {
  return baseComparisonRecords.length;
}
