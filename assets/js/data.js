export const categoryMeta = [
    { key: "Kitchen", value: "Kitchen", label: "Oshxona" },
    { key: "Cleaning", value: "Cleaning", label: "Tozalash" },
    { key: "Climate", value: "Climate", label: "Iqlim" },
    { key: "TV", value: "TV & Audio", label: "TV & Audio" },
    { key: "Computers", value: "Computers", label: "Kompyuter" },
    { key: "Appliances", value: "Small Appliances", label: "Kichik qurilmalar" }
];

export const categoryLookup = categoryMeta.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
}, {});

export const products = [
    {
        id: 101,
        name: "Smart Blender Pro 900",
        category: "Kitchen",
        brand: "KitchenPro",
        price: 1499000,
        rating: 4.6,
        img: "assets/img/products/kitchen-appliances.svg",
        description: "900W quvvatli blender kundalik oshxona ishlari uchun.",
        specs: ["900W quvvat", "1.5L idish", "6 tezlik", "Pulse rejim"]
    },
    {
        id: 102,
        name: "Air Fryer XL 5L",
        category: "Kitchen",
        brand: "AeroCook",
        price: 2199000,
        rating: 4.5,
        img: "assets/img/products/kitchen-appliances.svg",
        description: "Kam yog bilan tez pishirish uchun 5L air fryer.",
        specs: ["5L hajm", "2000W", "8 dastur", "LED panel"]
    },
    {
        id: 103,
        name: "Induction Cooker Duo",
        category: "Kitchen",
        brand: "HeatWave",
        price: 1799000,
        rating: 4.3,
        img: "assets/img/products/kitchen-appliances.svg",
        description: "Ikki konfokal induktsion plita, ixcham dizayn.",
        specs: ["2 konfoka", "Sensor boshqaruv", "Timer", "Qizib ketishdan himoya"]
    },
    {
        id: 104,
        name: "Stand Mixer Classic",
        category: "Kitchen",
        brand: "Mixora",
        price: 2499000,
        rating: 4.7,
        img: "assets/img/products/kitchen-appliances.svg",
        description: "Xamir va krem aralashtirish uchun qulay mikser.",
        specs: ["1200W", "4.8L kosa", "Metall korpus", "3 aksessuar"]
    },
    {
        id: 105,
        name: "Robot Vacuum S7",
        category: "Cleaning",
        brand: "CleanBot",
        price: 4899000,
        rating: 4.8,
        img: "assets/img/products/cleaning.svg",
        description: "Xonalarni avtomatik tozalash uchun aqlli robot.",
        specs: ["Lidar navigatsiya", "2 soat batareya", "App boshqaruv", "Mop funksiyasi"]
    },
    {
        id: 106,
        name: "Vacuum Cleaner 2200W",
        category: "Cleaning",
        brand: "DustMaster",
        price: 1299000,
        rating: 4.1,
        img: "assets/img/products/cleaning.svg",
        description: "Kuchli so'rish quvvatiga ega klassik changyutgich.",
        specs: ["2200W", "3L konteyner", "HEPA filtr", "5m kabel"]
    },
    {
        id: 107,
        name: "Steam Mop Fresh",
        category: "Cleaning",
        brand: "Steamly",
        price: 999000,
        rating: 4.0,
        img: "assets/img/products/cleaning.svg",
        description: "Bugli pol yuvish uchun tez qiziydigan mop.",
        specs: ["30 soniya qizish", "Bug rejimlari", "Yengil vazn", "Mikrofiber mato"]
    },
    {
        id: 108,
        name: "Washing Machine 7kg",
        category: "Cleaning",
        brand: "AquaSpin",
        price: 3699000,
        rating: 4.4,
        img: "assets/img/products/cleaning.svg",
        description: "7kg sig'imli energiya tejamkor kir yuvish mashinasi.",
        specs: ["7kg", "A++", "15 dastur", "1200 rpm"]
    },
    {
        id: 109,
        name: "Air Conditioner 12k",
        category: "Climate",
        brand: "CoolBreeze",
        price: 5999000,
        rating: 4.6,
        img: "assets/img/products/climate.svg",
        description: "12 000 BTU konditsioner issiq va sovuq rejimda.",
        specs: ["Inverter", "Wi-Fi boshqaruv", "4 rejim", "Tez sovitish"]
    },
    {
        id: 110,
        name: "Air Purifier HEPA",
        category: "Climate",
        brand: "PureAir",
        price: 1899000,
        rating: 4.2,
        img: "assets/img/products/climate.svg",
        description: "HEPA filtri bilan havo tozalash qurilmasi.",
        specs: ["HEPA 13", "35 m2", "Tungi rejim", "Filtr indikator"]
    },
    {
        id: 111,
        name: "Electric Heater Eco",
        category: "Climate",
        brand: "Warmly",
        price: 899000,
        rating: 4.0,
        img: "assets/img/products/climate.svg",
        description: "Xona isitish uchun ixcham elektr isitgich.",
        specs: ["1500W", "Termostat", "2 rejim", "Himoya panjarasi"]
    },
    {
        id: 112,
        name: "Humidifier UltraMist",
        category: "Climate",
        brand: "Mistio",
        price: 699000,
        rating: 4.3,
        img: "assets/img/products/climate.svg",
        description: "Havo namligini nazorat qilish uchun namlagich.",
        specs: ["4L bak", "LED yoritish", "Tungi rejim", "Aroma" ]
    },
    {
        id: 113,
        name: "VisionX 55 4K Smart TV",
        category: "TV & Audio",
        brand: "VisionX",
        price: 6950000,
        rating: 4.7,
        img: "assets/img/products/tv-audio.svg",
        description: "55 dyuymli 4K Smart TV HDR bilan.",
        specs: ["55 dyuym", "4K UHD", "HDR10", "Smart OS"]
    },
    {
        id: 114,
        name: "Soundbar 2.1",
        category: "TV & Audio",
        brand: "SonicWave",
        price: 1599000,
        rating: 4.4,
        img: "assets/img/products/tv-audio.svg",
        description: "Uy kinoteatri uchun 2.1 kanal soundbar.",
        specs: ["200W", "Bluetooth", "Subwoofer", "Optik kirish"]
    },
    {
        id: 115,
        name: "Bluetooth Speaker Go",
        category: "TV & Audio",
        brand: "BeatBox",
        price: 499000,
        rating: 4.1,
        img: "assets/img/products/tv-audio.svg",
        description: "Kompakt va kuchli portativ kolonka.",
        specs: ["10 soat", "IPX5", "USB-C", "TWS"]
    },
    {
        id: 116,
        name: "Streaming Stick 4K",
        category: "TV & Audio",
        brand: "Streamly",
        price: 799000,
        rating: 4.2,
        img: "assets/img/products/tv-audio.svg",
        description: "4K kontentni TVga uzatish uchun stick.",
        specs: ["4K", "Wi-Fi", "Ovozli pult", "Kompakt"]
    },
    {
        id: 117,
        name: "Laptop 15 Pro",
        category: "Computers",
        brand: "NovaTech",
        price: 8499000,
        rating: 4.6,
        img: "assets/img/products/computer.svg",
        description: "Ish va oqish uchun 15 dyuymli noutbuk.",
        specs: ["Intel i5", "16GB RAM", "512GB SSD", "15.6 inch"]
    },
    {
        id: 118,
        name: "Gaming Monitor 27",
        category: "Computers",
        brand: "PixelForge",
        price: 2899000,
        rating: 4.5,
        img: "assets/img/products/computer.svg",
        description: "144Hz monitor o'yinlar uchun.",
        specs: ["27 dyuym", "144Hz", "1ms", "IPS"]
    },
    {
        id: 119,
        name: "Mechanical Keyboard",
        category: "Computers",
        brand: "KeyForge",
        price: 699000,
        rating: 4.3,
        img: "assets/img/products/keyboard.svg",
        description: "Mexanik tugmalar bilan keyboard.",
        specs: ["RGB", "Blue switch", "Anti-ghosting", "USB"]
    },
    {
        id: 120,
        name: "Wireless Mouse Pro",
        category: "Computers",
        brand: "ClickPro",
        price: 259000,
        rating: 4.4,
        img: "assets/img/products/mouse.svg",
        description: "Ergonomik simsiz mouse ofis va o'yin uchun.",
        specs: ["2.4GHz + BT", "1600 DPI", "Rechargeable", "Silent click"]
    },
    {
        id: 121,
        name: "Coffee Maker Drip",
        category: "Small Appliances",
        brand: "BrewMate",
        price: 799000,
        rating: 4.2,
        img: "assets/img/products/small-appliances.svg",
        description: "Filtr qahva tayyorlash uchun drip coffee maker.",
        specs: ["1.2L", "Avto ochish", "Issiq ushlash", "Anti-drip"]
    },
    {
        id: 122,
        name: "Electric Kettle 1.7L",
        category: "Small Appliances",
        brand: "QuickHeat",
        price: 329000,
        rating: 4.0,
        img: "assets/img/products/small-appliances.svg",
        description: "Tez qaynash uchun elektr choynak.",
        specs: ["1.7L", "2200W", "360 baza", "Avto ochish"]
    },
    {
        id: 123,
        name: "Hair Dryer Ionic",
        category: "Small Appliances",
        brand: "StyleAir",
        price: 459000,
        rating: 4.1,
        img: "assets/img/products/small-appliances.svg",
        description: "Ion texnologiyasi bilan fen.",
        specs: ["2000W", "3 harorat", "2 tezlik", "Sovuq havo"]
    },
    {
        id: 124,
        name: "Iron Steam Pro",
        category: "Small Appliances",
        brand: "Pressly",
        price: 389000,
        rating: 4.2,
        img: "assets/img/products/small-appliances.svg",
        description: "Bugli dazmol, tez va oson tekislash.",
        specs: ["Steam boost", "Keramik tag", "Anti-drip", "Auto off"]
    }
];

export const featuredIds = [101, 105, 109, 113, 117, 121, 114, 118];
