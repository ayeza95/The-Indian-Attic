const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ayeza123:ayeza123@cluster0.kvwjhsb.mongodb.net/the-indian-attic?retryWrites=true&w=majority&appName=Cluster0';

// Extended State Data with proper Unsplash Images
const statesData = [
    {
        name: "Andhra Pradesh",
        image: "/uploads/1766930173036-Andhra-Pradesh.jpg",
        description: "Known for its rich cultural heritage, ancient temples, and the famous Kuchipudi dance form.",
        culturalSignificance: "Home to the sacred Tirumala Venkateswara Temple and a major hub for classical arts.",
        history: "Once part of the Maurya Empire, Andhra Pradesh has a history dating back to the Vedic period. It was a major Buddhist center and later ruled by the Satavahanas, Ikshvakus, and Pallavas. The region is famous for the Koh-i-Noor diamond mined from Kollur Mine.",
        famousFor: ["Kuchipudi Dance", "Tirupati Laddu", "Kalamkari Painting", "Etikoppaka Toys"],
        arts: ["Kalamkari", "Etikoppaka Toys", "Budithi Bell & Brass Craft", "Leather Puppetry"],

    },
    {
        name: "Arunachal Pradesh",
        image: "/uploads/1766930184944-arunachal-pradesh.jpg",
        description: "The Land of Dawn-Lit Mountains, home to pristine valleys and ancient monasteries.",
        culturalSignificance: "A biodiversity hotspot with diverse tribal cultures and the magnificent Tawang Monastery.",
        history: "Arunachal Pradesh finds mention in the Kalika Purana and Mahabharata. It is known as the Prabhu Mountains in ancient texts. The region has a strong Buddhist influence in the west and Naga tribal influence in the east.",
        famousFor: ["Tawang Monastery", "Ziro Festival", "Orchids", "Tribal Crafts"],
        arts: ["Thangka Painting", "Wood Carving", "Carpet Making", "Bamboo Crafts"],

    },
    {
        name: "Assam",
        image: "/uploads/1766930195124-assam.jpg",
        description: "Gateway to the Northeast, famous for its tea gardens, silk, and one-horned rhinoceros.",
        culturalSignificance: "The land of the Red River and Blue Hills, celebrated for Bihu festival and Kamakhya Temple.",
        history: "Anciently known as Pragjyotisha and Kamarupa, Assam was ruled by the Ahom dynasty for 600 years, successfully resisting Mughal attacks. It played a crucial role in the freedom struggle and is a tea production giant.",
        famousFor: ["Assam Tea", "Kaziranga National Park", "Muga Silk", "Kamakhya Temple"],
        arts: ["Bamboo & Cane", "Muga Silk Weaving", "Terracotta", "Mask Making"],

    },
    {
        name: "Bihar",
        image: "/uploads/1766930203449-bihar.jpg",
        description: "A land of enlightenment, ancient universities, and rich artistic traditions.",
        culturalSignificance: "Birthplace of Buddhism and Jainism, home to Nalanda and Bodh Gaya.",
        history: "Bihar was the center of power, learning, and culture in ancient India. The Maurya and Gupta empires, which unified large parts of India, originated here. It is the land of Ashoka, Chanakya, and Aryabhata.",
        famousFor: ["Madhubani Painting", "Bodh Gaya", "Nalanda University", "Litti Chokha"],
        arts: ["Madhubani Painting", "Sujini Embroidery", "Sikki Grass Craft", "Bhagalpuri Silk"],

    },
    {
        name: "Chhattisgarh",
        image: "/uploads/1766930228204-chhattisgarh.jpg",
        description: "A state of dense forests, ancient temples, and unique tribal arts.",
        culturalSignificance: "Known for its rich tribal heritage, distinct dance forms like Raut Nacha, and Bastar Dussehra.",
        history: "Anciently known as Dakshina Kosala, this region finds mention in the Ramayana. It has a rich history of Kalachuri and Maratha rule. The state is renowned for its unique bell metal crafts known as Dhokra.",
        famousFor: ["Chitrakoot Falls", "Bastar Art", "Kosa Silk", "Tribal Tourism"],
        arts: ["Dhokra Metal Art", "Kosa Silk", "Wood Carving", "Terracotta"],

    },
    {
        name: "Goa",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        description: "Popular for its beaches, Portuguese heritage, and vibrant nightlife.",
        culturalSignificance: "A blend of Indian and Portuguese cultures, famous for its churches and distinct cuisine.",
        history: "Goa has a long history as a major trade port. It was ruled by the Kadambas, Vijayanagara Empire, Bahmani Sultanate, and Bijapur Sultanate before the Portuguese conquest in 1510. It remained a Portuguese colony for 450 years.",
        famousFor: ["Beaches", "Basilica of Bom Jesus", "Carnival", "Feni"],
        arts: ["Shell Craft", "Bamboo Craft", "Coconut Mask Carving", "Azulejos (Tiles)"],

    },
    {
        name: "Gujarat",
        image: "/uploads/1767002426915-gujarat.jpg",
        description: "Land of legends and lions, known for its textiles, white desert, and business acumen.",
        culturalSignificance: "Home to the Rann Utsav, Gir Lions, and the vibrant Navratri festival.",
        history: "Home to major Indus Valley Civilization sites like Lothal and Dholavira. It was a major center for trade with ancient grease and Rome. The Solanki dynasty saw a golden era of architecture.",
        famousFor: ["Rann of Kutch", "Gir National Park", "Somnath Temple", "Bandhani"],
        arts: ["Bandhani", "Patola Weaving", "Kutch Embroidery", "Rogan Art"],

    },
    {
        name: "Haryana",
        image: "/uploads/1766931428005-haryana.jpg",
        description: "A state where tradition fits perfectly with modernity, known for sports and agriculture.",
        culturalSignificance: "The site of the epic battle of Mahabharata at Kurukshetra.",
        history: "Haryana is the site of the Battle of Mahabharata at Kurukshetra. It was part of the Kuru Kingdom. It has been the gateway to North India and witnessed three pivotal battles at Panipat.",
        famousFor: ["Kurukshetra", "Sultanpur Bird Sanctuary", "Phulkari", "Sports"],
        arts: ["Phulkari", "Pottery", "Wood Carving", "Zari Work"],

    },
    {
        name: "Himachal Pradesh",
        image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
        description: "The abode of snow, famous for its picturesque landscapes and hill stations.",
        culturalSignificance: "Land of Gods (Dev Bhumi), known for its distinct Pahari paintings and temples.",
        history: "Inhabited since prehistoric times, the region was divided into several small tribal republics known as Janaapadas. It came under the Gupta Empire and later Harshavardhana. It remained largely independent until British rule.",
        famousFor: ["Shimla", "Manali", "Dharamshala", "Apples"],
        arts: ["Pahari Painting", "Kullu Shawls", "Chamba Rumal", "Wood Carving"],

    },
    {
        name: "Jharkhand",
        image: "/uploads/1766931462195-jharkhand.jpg",
        description: "The land of forests, rich in mineral resources and tribal culture.",
        culturalSignificance: "Home to the Santhal and Munda tribes, famous for Chhau dance.",
        history: "Part of the ancient Magadha Empire. The area has a history of tribal resistance against British rule, notably the Santhal Rebellion and Birsa Munda movement.",
        famousFor: ["Ranchi Waterfalls", "Betla National Park", "Chhau Dance", "Mining"],
        arts: ["Sohrai Painting", "Dhokra Art", "Bamboo Craft", "Tribal Jewelry"],

    },
    {
        name: "Karnataka",
        image: "https://images.unsplash.com/photo-1600664356348-10686526af4f?w=800&q=80",
        description: "A hub of technology and heritage, from Silicon Valley to the ruins of Hampi.",
        culturalSignificance: "Showcases the grandeur of the Vijayanagara Empire and classical Carnatic music.",
        history: "Home to powerful dynasties like the Chalukyas, Hoysalas, and the Vijayanagara Empire, which left behind magnificent architectural wonders like Hampi and Belur-Halebidu.",
        famousFor: ["Hampi", "Mysore Palace", "Coorg Coffee", "Silk"],
        arts: ["Mysore Silk", "Bidriware", "Bronze Casting", "Wood Carving"],

    },
    {
        name: "Kerala",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        description: "God's Own Country, known for backwaters, Ayurveda, and distinct traditions.",
        culturalSignificance: "Famous for Kathakali, Onam festival, and high literacy rate.",
        history: "A major spice trade center since 3000 BCE, trading with Sumerians and Babylonians. It is mentioned in the edicts of Ashoka. The Chera dynasty was the first major kingdom.",
        famousFor: ["Backwaters", "Kathakali", "Ayurveda", "Spices"],
        arts: ["Kathakali Masks", "Mural Painting", "Coir Craft", "Nettipattam"],

    },
    {
        name: "Madhya Pradesh",
        image: "/uploads/1766931473814-madhya-pradesh.jpg",
        description: "The Heart of India, home to wildlife sanctuaries and historic monuments.",
        culturalSignificance: "Known for the erotic sculptures of Khajuraho and Sanchi Stupa.",
        history: "The heart of India, ruling ground for the Mauryas, Guptas, and Paramaras. The Chandela kings built the famous Khajuraho temples. It was also a stronghold of the Maratha Empire.",
        famousFor: ["Khajuraho", "Sanchi Stupa", "Kanha Tiger Reserve", "Chanderi Silk"],
        arts: ["Gond Painting", "Chanderi Silk", "Bagh Print", "Zardosi"],

    },
    {
        name: "Maharashtra",
        image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80",
        description: "A land of diverse landscapes, from busy Mumbai streets to ancient Ajanta caves.",
        culturalSignificance: "Home to Bollywood, Ganesh Chaturthi, and the Maratha prowess.",
        history: "The land of the Marathas, who established a vast empire under Chhatrapati Shivaji Maharaj. It has ancient Buddhist caves like Ajanta and Ellora, dating back to 2nd century BCE.",
        famousFor: ["Gateway of India", "Ajanta & Ellora Caves", "Bollywood", "Vada Pav"],
        arts: ["Warli Painting", "Paithani Sarees", "Kolhapuri Chappals", "Mashru Weaving"],

    },
    {
        name: "Manipur",
        image: "/uploads/1766931485629-manipur.jpg",
        description: "Jewel of India, famous for its classical dance and Loktak Lake.",
        culturalSignificance: "Known for Manipuri dance, martial arts (Thang-Ta), and rich weaving tradition.",
        history: "An ancient kingdom with a recorded history from 33 AD. It has a rich tradition of martial arts and dance. It was the site of important battles during World War II.",
        famousFor: ["Loktak Lake", "Manipuri Dance", "Ima Keithel", "Shirui Lily"],
        arts: ["Manipuri Weaving", "Cane & Bamboo", "Black Pottery", "Stone Carving"],

    },
    {
        name: "Meghalaya",
        image: "/uploads/1766931640379-meghalaya.jpg",
        description: "Abode of Clouds, known for its rainfall, living root bridges, and caves.",
        culturalSignificance: "Home to matrilineal tribes like Khasis and Garos.",
        history: "Historically inhabited by Khasi, Garo, and Jaintia tribes. It was carved out of Assam in 1972. The region is famous for its unique bio-engineering marvels - the living root bridges.",
        famousFor: ["Living Root Bridges", "Cherrapunji", "Shillong", "Caving"],
        arts: ["Cane & Bamboo", "Weaving", "Wood Carving", "Instrument Making"],

    },
    {
        name: "Mizoram",
        image: "/uploads/1766931651296-mizoram.jpg",
        description: "Land of the Hill People, known for its dramatic landscape and pleasant climate.",
        culturalSignificance: "Famous for the bamboo dance (Cheraw) and high literacy.",
        history: "Before the British period, the various Mizo clans lived in autonomous villages. It became a Union Territory in 1972 and a state in 1987. The Mizo Peace Accord is a notable event in its history.",
        famousFor: ["Blue Mountain", "Cheraw Dance", "Anthurium", "Bamboo"],
        arts: ["Bamboo Crafts", "Textile Weaving", "Cane Work", "Basketry"],

    },
    {
        name: "Nagaland",
        image: "/uploads/1766931673545-nagaland.jpg",
        description: "Land of Festivals, known for its distinct tribal culture and Hornbill Festival.",
        culturalSignificance: "Home to 16 major tribes, each with unique customs and dress.",
        history: "Nagaland has a history of brave warrior tribes. It saw significant fighting during WWII at the Battle of Kohima. It became the changing point where the Japanese advance into India was halted.",
        famousFor: ["Hornbill Festival", "Dzukou Valley", "Naga Chillies", "War Cemetery"],
        arts: ["Naga Shawls", "Wood Carving", "Bamboo Work", "Bead Jewelry"],

    },
    {
        name: "Odisha",
        image: "/uploads/1766931685481-odisha.jpg",
        description: "Soul of Incredible India, famous for temples, beaches, and classical dance.",
        culturalSignificance: "Land of Lord Jagannath, Odissi dance, and the Konark Sun Temple.",
        history: "Ancient Kalinga, the site of the war that transformed Emperor Ashoka. It was a major maritime power trading with Southeast Asia. It is famous for its temple architecture.",
        famousFor: ["Konark Sun Temple", "Jagannath Temple", "Chilika Lake", "Odissi Dance"],
        arts: ["Pattachitra", "Silver Filigree", "Applique Work", "Stone Carving"],

    },
    {
        name: "Punjab",
        image: "/uploads/1766931709914-punjab.jpg",
        description: "Land of Five Rivers, known for its agriculture, cuisine, and Sikh heritage.",
        culturalSignificance: "Home to the Golden Temple and the vibrant Bhangra dance.",
        history: "The cradle of the Indus Valley Civilization. It was the entryway for many invasions into India. It is the birthplace of Sikhism and saw the rise of the powerful Sikh Empire under Ranjit Singh.",
        famousFor: ["Golden Temple", "Wagah Border", "Punjabi Cuisine", "Phulkari"],
        arts: ["Phulkari", "Punjabi Jutti", "Wood Work", "Mud Art"],

    },
    {
        name: "Rajasthan",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
        description: "Land of Kings, known for its palaces, forts, and vast desert.",
        culturalSignificance: "Famous for its royal history, vibrant colors, and folk music.",
        history: "A land of chivalry and sacrifice, ruled by Rajput clans. The region is dotted with majestic forts and palaces that tell tales of heroism. It was formed by the merger of several princely states.",
        famousFor: ["Jaipur", "Udaipur", "Thar Desert", "Forts"],
        arts: ["Blue Pottery", "Block Printing", "Puppetry", "Miniature Painting"],

    },
    {
        name: "Sikkim",
        image: "/uploads/1766931722659-sikkim.jpg",
        description: "Valley of Rice, a small state with big mountains and organic farming.",
        culturalSignificance: "Home to Kangchenjunga and magnificent Buddhist monasteries.",
        history: "A Buddhist kingdom ruled by the Chogyal dynasty until 1975 when it merged with India. It was a stop on the ancient Silk Road. It is known for its ecological richness.",
        famousFor: ["Nathu La Pass", "Rumtek Monastery", "Organic Farming", "Red Panda"],
        arts: ["Thangka Painting", "Carpet Weaving", "Wood Carving", "Mask Making"],

    },
    {
        name: "Tamil Nadu",
        image: "/uploads/1766931732952-tamil-nadu.jpg",
        description: "Land of Temples, known for its Dravidian architecture and classical arts.",
        culturalSignificance: "Birthplace of Bharatnatyam and Carnatic music.",
        history: "Home to the Chola, Chera, and Pandya dynasties who were great patrons of art and literature. They built magnificent temples like Brihadeeswarar and spread Indian culture to Southeast Asia.",
        famousFor: ["Meenakshi Temple", "Mahabalipuram", "Kanyakumari", "Kanchipuram Silk"],
        arts: ["Tanjore Painting", "Bronze Casting", "Kanchipuram Silk", "Stone Carving"],

    },
    {
        name: "Telangana",
        image: "/uploads/1766931747375-telangana.jpg",
        description: "India's youngest state, a blend of Nizami culture and modern technology.",
        culturalSignificance: "Known for the Charminar, Bathukamma festival, and rich literary history.",
        history: "Ruled by the Kakatiyas and later the Qutb Shahis and Nizams. It has a rich heritage of irrigation systems and distinct culture. It became a separate state in 2014.",
        famousFor: ["Charminar", "Golconda Fort", "Ramoji Film City", "Hyderabadi Biryani"],
        arts: ["Pochampally Ikat", "Bidriware", "Dokra Metal Crafts", "Nirmal Toys"],

    },
    {
        name: "Tripura",
        image: "/uploads/1766931768171-tripura.jpg",
        description: "Land of myths and legends, known for its palaces and bamboo forests.",
        culturalSignificance: "Home to 19 tribes and the royal Ujjayanta Palace.",
        history: "Ruled by the Manikya dynasty for centuries. It finds mention in the Mahabharata. It has a unique mix of Bengali and tribal cultures.",
        famousFor: ["Ujjayanta Palace", "Neermahal", "Unakoti", "Bamboo"],
        arts: ["Cane & Bamboo", "Handloom", "Wood Carving", "Basketry"],

    },
    {
        name: "Uttar Pradesh",
        image: "/uploads/1766931778880-uttarakhand.jpg",
        description: "Heartland of India, home to the Taj Mahal and Varanasi.",
        culturalSignificance: "Birthplace of Lord Rama and Krishna, and the spiritual capital Varanasi.",
        history: "The site of two great epics, Ramayana and Mahabharata. It saw the rise and fall of empires like the Mughals and Nawabs of Awadh. It played a key role in the 1857 independence movement.",
        famousFor: ["Taj Mahal", "Varanasi", "Lucknow", "Kumbh Mela"],
        arts: ["Chikankari", "Banarasi Silk", "Brassware", "Carpet Weaving"],

    },
    {
        name: "Uttarakhand",
        image: "https://images.unsplash.com/photo-1626621341120-d636b281f621?w=800&q=80",
        description: "Devbhumi, land of Himalayas, Yoga, and the holy Ganges.",
        culturalSignificance: "Home to the Char Dham Yatra and the Yoga capital Rishikesh.",
        history: "Historically known as Kedarkhand and Manaskhand. It was the meditation ground for ancient sages. It houses some of the holiest Hindu shrines.",
        famousFor: ["Rishikesh", "Nainital", "Jim Corbett Park", "Valley of Flowers"],
        arts: ["Aipan Art", "Wood Carving", "Woolen Weaving", "Ringal Craft"],

    },
    {
        name: "West Bengal",
        image: "/uploads/1766931804012-west-bengal.jpg",
        description: "Cultural capital of India, known for literature, art, and sweets.",
        culturalSignificance: "Home to Durga Puja, Rabindranath Tagore, and rich literary heritage.",
        history: "A major center of the British Raj. It was the forefront of the Indian Renaissance and freedom struggle. It has a rich legacy of literature, cinema, and art.",
        famousFor: ["Victoria Memorial", "Darjeeling", "Sundarbans", "Durga Puja"],
        arts: ["Kantha Stitch", "Terracotta", "Sholapith", "Dokra"],

    },
    {
        name: 'Andaman and Nicobar Islands',
        image: 'https://images.unsplash.com/photo-1589392109670-34907ec76202?w=800&q=80',
        description: 'Tropical paradise with pristine beaches and marine life.',
        culturalSignificance: 'Home to indigenous tribes and the historic Cellular Jail.',
        history: 'Used as a naval base by the Marathas in the 17th century. The British established a penal colony here (Kalapani). It was occupied by the Japanese during WWII.',
        famousFor: ['Radhanagar Beach', 'Cellular Jail', 'Scuba Diving', 'Coral Reefs'],
        arts: ['Shell Craft', 'Wood Craft', 'Cane Work', 'Coconut Crafts'],

    },
    {
        name: 'Chandigarh',
        image: "/uploads/1766930214896-chandigarh.jpg",
        description: 'The City Beautiful, known for its modern architecture and urban planning.',
        culturalSignificance: 'A masterpiece of Le Corbusier\'s architecture.',
        history: 'The first planned city of independent India, designed by Le Corbusier. It serves as the capital for both Punjab and Haryana.',
        famousFor: ['Rock Garden', 'Sukhna Lake', 'Rose Garden', 'Architecture'],
        arts: ['Phulkari', 'Wood Carving', 'Pottery', 'Furniture Design'],

    },
    {
        name: 'Delhi',
        image: "/uploads/1766930847407-delhi.jpg",
        description: 'The Capital City, a melting pot of history and modernity.',
        culturalSignificance: 'Seat of power for centuries, home to monuments like Red Fort and Qutub Minar.',
        history: 'A city that has been built and destroyed seven times. From the Pandavas\' Indraprastha to the Mughals\' Shahjahanabad and Lutyens\' New Delhi, it is a living museum.',
        famousFor: ['Red Fort', 'India Gate', 'Qutub Minar', 'Chandni Chowk'],
        arts: ['Zardozi', 'Meenakari', 'Blue Pottery', 'Ivory Carving'],

    },
    {
        name: 'Jammu and Kashmir',
        image: "/uploads/1766931451917-jammu-and-kashmir.jpg",
        description: 'Paradise on Earth, known for high mountains, lakes, and saffron.',
        culturalSignificance: 'Famous for Sufi tradition, Pashmina, and warm hospitality.',
        history: 'A center of Sanskrit learning and Buddhism in ancient times. It was ruled by the Dogra dynasty before joining India. It is famous for its breathtaking valleys.',
        famousFor: ['Dal Lake', 'Gulmarg', 'Pahalgam', 'Pashmina'],
        arts: ['Pashmina Shawls', 'Papier Mache', 'Walnut Wood Carving', 'Carpet Weaving'],

    },
    {
        name: 'Ladakh',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80',
        description: 'Land of High Passes, a cold desert with stunning landscapes.',
        culturalSignificance: 'Strong Tibetan Buddhist influence, famous for Hemis festival.',
        history: 'A major trade route between India and Central Asia. It was part of the Namgyal dynasty. It became a Union Territory in 2019.',
        famousFor: ['Pangong Lake', 'Nubra Valley', 'Monasteries', 'Road Trips'],
        arts: ['Thangka Painting', 'Wood Carving', 'Metal Craft', 'Woolen Weaving'],

    },
    {
        name: 'Puducherry',
        image: "/uploads/1766931698546-puducherry.jpg",
        description: 'The French Riviera of the East, known for its colonial architecture.',
        culturalSignificance: 'A blend of French and Tamil culture, home to Auroville.',
        history: 'A French colony until 1954, leaving a lasting legacy on its architecture, grid-pattern streets, and cuisine. It was the residence of Sri Aurobindo.',
        famousFor: ['Auroville', 'Promenade Beach', 'French Quarter', 'Cafes'],
        arts: ['Paper Making', 'Leather Craft', 'Pottery', 'Aromatherapy'],

    }
];

const StateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    image: { type: String },
    description: { type: String },
    culturalSignificance: { type: String },
    history: { type: String },
    famousFor: [{ type: String }],
    arts: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const State = mongoose.models.State || mongoose.model('State', StateSchema);

async function seedStates() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // Optional: Clear existing states/districts if you want a fresh start
        // Be careful with this in production!
        // console.log('Clearing existing data...');
        // await State.deleteMany({});
        // await District.deleteMany({});

        for (const stateData of statesData) {
            console.log(`Processing ${stateData.name}...`);

            // Generate slug
            const slug = stateData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            // Update or Insert State
            const state = await State.findOneAndUpdate(
                { name: stateData.name },
                {
                    ...stateData,
                    slug: slug, // Ensure slug is updated
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

seedStates();
