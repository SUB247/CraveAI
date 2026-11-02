import fs from "fs";
import path from "path";

const DESSERT_RECIPES = [
  // 1. Gulab Jamun
  {
    id: "royal-gulab-jamun-kesar",
    title: "Shahi Khoya Gulab Jamun in Saffron Rose Syrup",
    tagline: "Golden, melt-in-the-mouth mawa dumplings soaked in green cardamom and Kashmiri saffron nectar",
    description: "The undisputed monarch of Indian celebrations. Fresh reduced whole-milk khoya and chenna are gently kneaded with aromatic mace and cardamom, rolled into seamless spheres, slowly deep-fried in fragrant desi ghee at low heat until a deep mahogany blush, then bathed in warm rose-infused saffron syrup.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "North Indian",
    prepTime: "25 mins",
    prepTimeMinutes: 25,
    cookTime: "30 mins",
    cookTimeMinutes: 30,
    totalTime: "55 mins",
    servings: 6,
    difficulty: "Medium",
    rating: 4.98,
    reviewCount: 420,
    calories: 340,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "Festive", "Warm"],
    equipment: ["Heavy-bottomed kadai / wok", "Slotted frying ladle", "Saucepan for sugar syrup"],
    nutrition: {
      servingSize: "2 gulab jamuns with syrup (~120g)",
      calories: 340,
      energyKj: 1423,
      protein: 7,
      carbohydrates: 54,
      sugar: 44,
      fiber: 0.5,
      totalFat: 12,
      saturatedFat: 7,
      sodium: 75
    },
    ingredients: [
      { name: "Fresh mawa / khoya (crumbled)", amount: 250, unit: "g", notes: "Soft whole-milk solid", category: "Dairy" },
      { name: "Fresh paneer or chenna", amount: 60, unit: "g", notes: "Finely grated and mashed smooth", category: "Dairy" },
      { name: "All-purpose flour (maida)", amount: 3, unit: "tbsp", notes: "For gentle binding", category: "Pantry" },
      { name: "Baking soda", amount: 0.25, unit: "tsp", notes: "For pillow-soft lift", category: "Baking" },
      { name: "Granulated sugar", amount: 400, unit: "g", notes: "For light one-string syrup", category: "Pantry" },
      { name: "Water", amount: 350, unit: "ml", notes: "Syrup base", category: "Pantry" },
      { name: "Green cardamom pods", amount: 5, unit: "pods", notes: "Lightly crushed", category: "Spices" },
      { name: "Kashmiri saffron threads", amount: 15, unit: "strands", notes: "For golden hue and royal aroma", category: "Spices" },
      { name: "Rose water", amount: 1, unit: "tsp", notes: "Edible culinary essence", category: "Flavoring" },
      { name: "Pure desi ghee", amount: 500, unit: "ml", notes: "For gentle deep frying", category: "Dairy" }
    ],
    steps: [
      {
        step: 1,
        title: "Brew Saffron Rose Syrup",
        instruction: "Combine granulated sugar, water, and crushed cardamom in a wide saucepan over medium heat. Bring to an active boil until the sugar fully dissolves. Simmer for 6-7 minutes until the syrup achieves a sticky, half-thread consistency. Stir in saffron strands and rose water, then turn heat to warm.",
        time: "8 mins",
        temp: "Medium heat",
        visualCue: "Syrup coats the back of a spoon with a glossy, light syrupy film"
      },
      {
        step: 2,
        title: "Knead Khoya & Chenna Dough",
        instruction: "On a clean marble surface, grate the khoya and fresh paneer. Use the heel of your palm to smooth and knead for 5 minutes until completely lump-free and silky. Sift in flour and baking soda. Lightly bring together into a soft, pliable dough without overworking.",
        time: "6 mins",
        temp: "Room temperature",
        visualCue: "Dough feels like soft silk with zero grainy granules"
      },
      {
        step: 3,
        title: "Shape Seamless Spheres",
        instruction: "Divide the dough into 18-20 miniature balls (about 15g each). Roll between your palms with gentle pressure until completely smooth without any microscopic surface cracks.",
        time: "5 mins",
        temp: "Room temperature",
        visualCue: "Perfect glass-smooth spheres that will not split during frying"
      },
      {
        step: 4,
        title: "Gentle Ghee Frying",
        instruction: "Heat desi ghee in a heavy kadai to low-medium heat (approx 140°C / 285°F). Slide in dumplings. Swirl the ghee gently around them with a slotted spoon without directly piercing the dumplings. Fry slowly, gently basting as they expand and turn into an even, rich golden mahogany.",
        time: "10 mins",
        temp: "Low heat (140°C)",
        visualCue: "Deep glossy mahogany skin and evenly puffed spherical shapes"
      },
      {
        step: 5,
        title: "Warm Syrup Bath",
        instruction: "Remove with a slotted spoon and immediately immerse the fried dumplings into the warm saffron syrup. Allow them to rest and absorb the fragrant nectar for at least 2 hours before serving warm.",
        time: "2 hours resting",
        temp: "Warm syrup",
        visualCue: "Jamuns double in plumpness and tenderly yield to the touch of a silver spoon"
      }
    ],
    chefTips: [
      "Never fry in hot oil; low and slow temperature is the secret to thorough cooking through the center.",
      "The syrup must be lukewarm when adding hot dumplings so they drink up the nectar without collapsing."
    ],
    substitutions: [
      { original: "Mawa / Khoya", substitute: "Milk powder kneaded with warm milk and ghee", notes: "Acceptable pantry backup for quick gulab jamun" }
    ],
    commonMistakes: [
      { mistake: "Frying on high heat", consequence: "The outer crust turns dark brown instantly while the inside remains a dense, uncooked raw dough core." }
    ],
    allergens: ["Dairy", "Gluten"],
    safety: "Take care when transferring hot fried dumplings into liquid syrup.",
    storage: "Refrigerate in an airtight glass container in syrup for up to 10 days. Warm gently before eating."
  },

  // 2. Rasmalai
  {
    id: "bengali-rasmalai-kesar-pista",
    title: "Royal Bengali Kesar Pista Rasmalai",
    tagline: "Featherweight poached chenna discs swimming in chilled saffron, pistachio & cardamom rabdi",
    description: "The pinnacle of Bengali confectionary artistry. Delicate disks of fresh hand-kneaded cow-milk chenna are poached in light bubbling syrup until cloud-spongy, then steeped in thickened saffron-infused cream crowned with slivered pistachios and fragrant dried rose petals.",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "Bengali",
    prepTime: "30 mins",
    prepTimeMinutes: 30,
    cookTime: "35 mins",
    cookTimeMinutes: 35,
    totalTime: "1 hr 5 mins",
    servings: 6,
    difficulty: "Hard",
    rating: 4.97,
    reviewCount: 380,
    calories: 290,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "Chilled", "Gluten-Free"],
    equipment: ["Wide deep stockpot with tight lid", "Saucepan for rabdi", "Muslin cheesecloth"],
    nutrition: {
      servingSize: "2 pieces with chilled milk rabdi (~150ml)",
      calories: 290,
      energyKj: 1213,
      protein: 11,
      carbohydrates: 38,
      sugar: 32,
      fiber: 1,
      totalFat: 10,
      saturatedFat: 6,
      sodium: 90
    },
    ingredients: [
      { name: "Full cream cow milk (for chenna)", amount: 1.5, unit: "liters", notes: "Yields light, porous chenna", category: "Dairy" },
      { name: "Lemon juice or distilled vinegar", amount: 2, unit: "tbsp", notes: "Diluted with 2 tbsp warm water", category: "Pantry" },
      { name: "Full cream buffalo/cow milk (for rabdi)", amount: 1, unit: "liter", notes: "Thickened to 50% volume", category: "Dairy" },
      { name: "Granulated sugar (for rabdi)", amount: 75, unit: "g", notes: "Delicate sweetness", category: "Pantry" },
      { name: "Granulated sugar (for poaching)", amount: 250, unit: "g", notes: "Syrup bath", category: "Pantry" },
      { name: "Water (for poaching syrup)", amount: 1, unit: "liter", notes: "Poaching medium", category: "Pantry" },
      { name: "Kashmiri saffron strands", amount: 25, unit: "threads", notes: "Steeped in 2 tbsp warm milk", category: "Spices" },
      { name: "Green cardamom powder", amount: 0.5, unit: "tsp", notes: "Freshly ground", category: "Spices" },
      { name: "Pistachios & almonds (slivered)", amount: 3, unit: "tbsp", notes: "For garnish", category: "Nuts" }
    ],
    steps: [
      {
        step: 1,
        title: "Curdle Fresh Chenna",
        instruction: "Bring 1.5 liters of cow milk to a boil. Turn off heat and rest for 3 minutes. Slowly trickle in diluted lemon juice while gently stirring in one direction until greenish translucent whey separates. Drain through a muslin cloth, rinse thoroughly under cold water to eliminate sourness, and hang for 30 minutes to drain excess moisture.",
        time: "10 mins",
        temp: "Off the heat",
        visualCue: "Clear greenish whey and clean, curdy white chenna solids"
      },
      {
        step: 2,
        title: "Knead & Shape Chenna Discs",
        instruction: "Transfer chenna to a flat plate. Knead with the heel of your palm for 8-10 minutes until the texture turns completely velvety without greasiness. Divide into 12 equal portions and gently roll and flatten into miniature puck-like discs.",
        time: "10 mins",
        temp: "Room temperature",
        visualCue: "Smooth discs with crack-free edges"
      },
      {
        step: 3,
        title: "Poach in Sugar Bath",
        instruction: "In a wide, deep pot, combine 250g sugar and 1 liter of water. Bring to a rolling, vigorous boil. Slide in the chenna discs, cover immediately with a tight lid, and boil undisturbed over high heat for 12 minutes. Turn off heat and let rest covered for 10 minutes.",
        time: "15 mins",
        temp: "High rolling boil",
        visualCue: "Discs swell to twice their initial volume and spring back instantly upon light touch"
      },
      {
        step: 4,
        title: "Simmer Aromatic Rabdi",
        instruction: "In a heavy pan, simmer 1 liter of milk over medium-low heat, stirring constantly and scraping down clotted cream from the sides until reduced to half. Stir in saffron-infused milk, sugar, cardamom, and sliced pistachios. Chill completely.",
        time: "20 mins",
        temp: "Medium-low heat",
        visualCue: "Creamy golden-yellow rabdi with silky body"
      },
      {
        step: 5,
        title: "Assemble & Steep",
        instruction: "Gently press each poached disc between your flat palms to squeeze out excess sugar syrup. Transfer into the chilled saffron rabdi. Refrigerate for at least 4 hours so the chenna sponge drinks in the rich saffron cream.",
        time: "4 hours chilling",
        temp: "Refrigerator (4°C)",
        visualCue: "Discs turn saffron-yellow and burst with sweet cream on every bite"
      }
    ],
    chefTips: [
      "Cow milk is mandatory for chenna; buffalo milk has too much fat and creates rubbery, dense discs.",
      "Rinse the chenna in ice water immediately after curdling to stop cooking and keep it ultra-soft."
    ],
    substitutions: [
      { original: "Cow Milk", substitute: "Toned 3% fat milk", notes: "Works if whole cow milk is unavailable" }
    ],
    commonMistakes: [
      { mistake: "Over-kneading chenna until oil separates", consequence: "The discs release butterfat, disintegrating into pieces during boiling." }
    ],
    allergens: ["Dairy", "Tree Nuts"],
    safety: "Ensure wide pot headspace; poaching chenna creates heavy foam that can boil over.",
    storage: "Keep refrigerated in saffron milk for up to 4 days."
  },

  // 3. Zafrani Kheer
  {
    id: "zafrani-shahi-kheer-almonds",
    title: "Zafrani Shahi Rice Kheer with Charoli & Almonds",
    tagline: "Slow-simmered basmati rice pudding infused with saffron, green cardamom, and toasted nuts",
    description: "The ancient ceremonial dessert of the royal courts. Fragrant aged Gobindobhog or Basmati rice is slow-cooked in rich whole milk until thick and velvety, gently sweetened, and layered with saffron, crushed cardamom pods, toasted charoli seeds, and blanched almonds.",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "North Indian",
    prepTime: "15 mins",
    prepTimeMinutes: 15,
    cookTime: "40 mins",
    cookTimeMinutes: 40,
    totalTime: "55 mins",
    servings: 6,
    difficulty: "Easy",
    rating: 4.95,
    reviewCount: 310,
    calories: 275,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "Gluten-Free", "Warm", "Chilled"],
    equipment: ["Heavy bottom milk pot or brass handi", "Wooden spatula"],
    nutrition: {
      servingSize: "1 cup (~180g)",
      calories: 275,
      energyKj: 1151,
      protein: 8,
      carbohydrates: 42,
      sugar: 28,
      fiber: 0.8,
      totalFat: 9,
      saturatedFat: 5,
      sodium: 85
    },
    ingredients: [
      { name: "Aged basmati rice or Gobindobhog rice", amount: 60, unit: "g", notes: "Rinsed and soaked for 20 mins", category: "Grains" },
      { name: "Full cream whole milk", amount: 1.2, unit: "liters", notes: "Rich dairy base", category: "Dairy" },
      { name: "Pure desi ghee", amount: 1, unit: "tsp", notes: "For roasting soaked rice", category: "Dairy" },
      { name: "Granulated sugar or raw jaggery", amount: 90, unit: "g", notes: "To taste", category: "Pantry" },
      { name: "Kashmiri saffron threads", amount: 20, unit: "threads", notes: "Crushed in warm milk", category: "Spices" },
      { name: "Green cardamom powder", amount: 0.5, unit: "tsp", notes: "Freshly ground", category: "Spices" },
      { name: "Charoli / chironji seeds", amount: 1, unit: "tbsp", notes: "Traditional Indian dessert seeds", category: "Nuts" },
      { name: "Blanched slivered almonds & pistachios", amount: 3, unit: "tbsp", notes: "For rich garnish", category: "Nuts" }
    ],
    steps: [
      {
        step: 1,
        title: "Crush & Ghee-Toast Rice",
        instruction: "Drain the soaked basmati rice and coarsely crush it between your fingers so grains break into 2-3 fragments. In a heavy pot, warm 1 tsp ghee, add the crushed rice, and toast for 1 minute until nutty and fragrant.",
        time: "3 mins",
        temp: "Low heat",
        visualCue: "Translucent grains with a gentle toasted basmati perfume"
      },
      {
        step: 2,
        title: "Simmer in Whole Milk",
        instruction: "Pour in cold full-cream milk. Bring to a boil over medium heat, stirring continuously so rice does not stick to the base. Once boiling, lower heat to low and simmer for 30 minutes, stirring every 3-4 minutes to incorporate the thick milk skin forming on top.",
        time: "30 mins",
        temp: "Low simmer",
        visualCue: "Rice grains break completely down and the milk thickens into a rich, creamy consistency"
      },
      {
        step: 3,
        title: "Infuse Saffron & Sweeten",
        instruction: "Stir in granulated sugar, saffron-infused milk, cardamom powder, and charoli seeds. Simmer for an additional 5-7 minutes until the sugar dissolves and the kheer turns into a pale royal golden color.",
        time: "7 mins",
        temp: "Low heat",
        visualCue: "Rich golden hue and ribbon-like coating on the spatula"
      },
      {
        step: 4,
        title: "Garnish & Rest",
        instruction: "Garnish generously with slivered almonds and pistachios. Serve warm in clay bowls (matkas) or chill in the refrigerator for 2 hours for a thicker, custard-like texture.",
        time: "5 mins",
        temp: "Warm or chilled",
        visualCue: "Silky, creamy pudding with visible flecks of saffron and green pistachios"
      }
    ],
    chefTips: [
      "Never add sugar until the rice is fully tender; sugar prevents rice starches from breaking down properly.",
      "Coarsely breaking the rice grains releases starches faster and produces an ultra-creamy pudding without needing condensed milk."
    ],
    substitutions: [
      { original: "Sugar", substitute: "Jaggery (gur)", notes: "Add jaggery only after the kheer has cooled slightly to avoid curdling the milk." }
    ],
    commonMistakes: [
      { mistake: "Leaving pot unattended on high heat", consequence: "Milk scorches on the bottom, imparting an indelible burnt flavor throughout." }
    ],
    allergens: ["Dairy", "Tree Nuts"],
    safety: "Use a heavy-bottomed pan to prevent scorching.",
    storage: "Refrigerate in a covered container for up to 4 days."
  },

  // 4. Amritsari Gajar Ka Halwa
  {
    id: "amritsari-gajar-ka-halwa",
    title: "Amritsari Desi Ghee Gajar Ka Halwa",
    tagline: "Slow-roasted sweet red Delhi carrots braised in full-cream milk, mawa & aromatic desi ghee",
    description: "The beloved winter indulgence of Northern India. Juicy, naturally sweet winter red Delhi carrots are grated, braised in bubbling whole milk until completely tender, caramelized in golden desi ghee with aromatic green cardamom, and folded with rich crumbled khoya and roasted cashews.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "North Indian / Punjabi",
    prepTime: "25 mins",
    prepTimeMinutes: 25,
    cookTime: "45 mins",
    cookTimeMinutes: 45,
    totalTime: "1 hr 10 mins",
    servings: 6,
    difficulty: "Medium",
    rating: 4.96,
    reviewCount: 395,
    calories: 360,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "Gluten-Free", "Warm", "Winter Special"],
    equipment: ["Wide heavy-bottomed iron kadai", "Box grater or food processor"],
    nutrition: {
      servingSize: "1 generous bowl (~160g)",
      calories: 360,
      energyKj: 1506,
      protein: 8,
      carbohydrates: 46,
      sugar: 36,
      fiber: 4,
      totalFat: 17,
      saturatedFat: 10,
      sodium: 95
    },
    ingredients: [
      { name: "Sweet red Delhi winter carrots", amount: 1, unit: "kg", notes: "Peeled and freshly grated", category: "Produce" },
      { name: "Full cream whole milk", amount: 1, unit: "liter", notes: "Braising liquid", category: "Dairy" },
      { name: "Pure desi ghee", amount: 4, unit: "tbsp", notes: "For deep caramelization", category: "Dairy" },
      { name: "Granulated sugar", amount: 150, unit: "g", notes: "Adjust to carrot sweetness", category: "Pantry" },
      { name: "Fresh mawa / khoya", amount: 120, unit: "g", notes: "Crumbled for rich texture", category: "Dairy" },
      { name: "Green cardamom powder", amount: 0.75, unit: "tsp", notes: "Freshly ground", category: "Spices" },
      { name: "Cashews and almonds", amount: 3, unit: "tbsp", notes: "Lightly fried in 1 tsp ghee", category: "Nuts" },
      { name: "Golden raisins", amount: 1, unit: "tbsp", notes: "Plumped in ghee", category: "Pantry" }
    ],
    steps: [
      {
        step: 1,
        title: "Braise Carrots in Milk",
        instruction: "Add freshly grated red carrots and 1 liter of whole milk to a wide heavy kadai over medium-high heat. Bring to a boil, then reduce heat to medium and simmer, stirring every few minutes, until the milk is completely reduced and absorbed by the carrots.",
        time: "30 mins",
        temp: "Medium heat",
        visualCue: "Carrots turn tender and all liquid evaporates completely leaving moist red pulp"
      },
      {
        step: 2,
        title: "Bhunai (Ghee Caramelization)",
        instruction: "Add 4 tablespoons of pure desi ghee. Saute and roast the carrots actively on medium heat for 10-12 minutes. The carrots will darken into a lustrous ruby red and release a glorious nutty aroma.",
        time: "10 mins",
        temp: "Medium heat",
        visualCue: "Ghee starts glistening at the edges and color intensifies to deep ruby"
      },
      {
        step: 3,
        title: "Add Sugar & Khoya",
        instruction: "Stir in granulated sugar. The halwa will release liquid and liquefy slightly. Cook for 6-8 minutes until the liquid reduces once more. Crumble in the fresh mawa and cardamom powder, stirring vigorously until melted into the halwa.",
        time: "8 mins",
        temp: "Medium heat",
        visualCue: "Halwa pulls cleanly away from the sides of the pan"
      },
      {
        step: 4,
        title: "Fold Toasted Nuts & Serve",
        instruction: "Fold in the ghee-roasted cashews, almonds, and golden raisins. Serve piping hot, garnished with extra crushed pistachios and edible silver vark if desired.",
        time: "2 mins",
        temp: "Hot",
        visualCue: "Glistening ruby red texture studded with golden cashews"
      }
    ],
    chefTips: [
      "Use sweet red Delhi carrots during winter for the sweetest, most vibrant natural ruby color without food dye.",
      "The 'bhunai' in ghee after milk evaporation is what separates exceptional halwa from ordinary carrot mash."
    ],
    substitutions: [
      { original: "Khoya", substitute: "1/2 cup milk powder + 2 tbsp heavy cream", notes: "Simmered into halwa until thick" }
    ],
    commonMistakes: [
      { mistake: "Adding sugar too early", consequence: "Sugar crystallizes and prevents carrots from becoming tender and absorbing the milk." }
    ],
    allergens: ["Dairy", "Tree Nuts"],
    safety: "Hot halwa can splatter while reducing sugar liquid; stir carefully.",
    storage: "Refrigerate in a sealed container for up to 8 days. Reheat in a pan with 1 tsp ghee."
  },

  // 5. Kesar Jalebi
  {
    id: "crispy-kesar-jalebi-rabdi",
    title: "Crisp Golden Kesar Jalebi with Creamy Rabdi",
    tagline: "Intricately coiled, fermented spiral crisps dripping with fragrant saffron syrup",
    description: "The street confection that defines festival mornings. A light fermented flour batter is piped in concentric spirals directly into simmering ghee, deep fried to a brittle golden crunch, plunged instantly into warm saffron-cardamom syrup to fill the hollow tubular swirls, and paired with chilled rabdi.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "North Indian",
    prepTime: "20 mins",
    prepTimeMinutes: 20,
    cookTime: "25 mins",
    cookTimeMinutes: 25,
    totalTime: "45 mins",
    servings: 4,
    difficulty: "Hard",
    rating: 4.94,
    reviewCount: 290,
    calories: 380,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "Street Food", "Crispy"],
    equipment: ["Flat-bottomed shallow frying pan", "Squeeze bottle or jalebi cloth with brass nozzle"],
    nutrition: {
      servingSize: "4 jalebis (~130g)",
      calories: 380,
      energyKj: 1590,
      protein: 4,
      carbohydrates: 68,
      sugar: 52,
      fiber: 0.5,
      totalFat: 11,
      saturatedFat: 6,
      sodium: 40
    },
    ingredients: [
      { name: "All-purpose flour (maida)", amount: 150, unit: "g", notes: "Batter base", category: "Pantry" },
      { name: "Cornstarch or rice flour", amount: 2, unit: "tbsp", notes: "For lasting shatter-crispiness", category: "Pantry" },
      { name: "Fresh thick yogurt", amount: 2, unit: "tbsp", notes: "Slightly sour for fermentation", category: "Dairy" },
      { name: "Baking powder", amount: 0.5, unit: "tsp", notes: "For instant aeration", category: "Baking" },
      { name: "Water", amount: 120, unit: "ml", notes: "For pouring consistency", category: "Pantry" },
      { name: "Granulated sugar (for syrup)", amount: 300, unit: "g", notes: "One-string consistency", category: "Pantry" },
      { name: "Water (for syrup)", amount: 200, unit: "ml", notes: "Syrup base", category: "Pantry" },
      { name: "Kashmiri saffron threads", amount: 20, unit: "threads", notes: "For natural neon amber glow", category: "Spices" },
      { name: "Lemon juice", amount: 1, unit: "tsp", notes: "Prevents sugar crystallization", category: "Pantry" },
      { name: "Ghee or refined oil", amount: 400, unit: "ml", notes: "For shallow frying", category: "Pantry" }
    ],
    steps: [
      {
        step: 1,
        title: "Whisk Aerated Batter",
        instruction: "In a mixing bowl, whisk together flour, cornstarch, sour yogurt, baking powder, and water until smooth, lump-free, and of thick pouring consistency (like pancake batter). Rest for 15 minutes.",
        time: "15 mins",
        temp: "Room temperature",
        visualCue: "Smooth ribbons form when batter drips from the whisk"
      },
      {
        step: 2,
        title: "Prepare Saffron Sugar Syrup",
        instruction: "Boil sugar and water together with saffron strands and crushed cardamom for 6 minutes until a half-to-one string syrup forms. Stir in 1 tsp lemon juice to stop crystallization and keep warm on the lowest flame.",
        time: "6 mins",
        temp: "Medium heat",
        visualCue: "Syrup feels sticky between thumb and index finger with a brief single thread"
      },
      {
        step: 3,
        title: "Pipe Concentric Spirals",
        instruction: "Pour batter into a squeeze bottle with a narrow 2mm nozzle. Heat ghee in a flat shallow pan over medium heat (165°C / 330°F). Starting from the center, pipe 2.5 concentric spirals outward, locking the spiral by drawing a line across the center.",
        time: "2 mins per batch",
        temp: "Medium heat (165°C)",
        visualCue: "Jalebis rise instantly to the surface and hold their intricate spiral shapes"
      },
      {
        step: 4,
        title: "Fry to Crisp Perfection",
        instruction: "Fry for 2 minutes on each side using kitchen tongs until pale golden, rigid, and audibly crisp.",
        time: "4 mins",
        temp: "Medium heat",
        visualCue: "Crisp, rigid texture that holds its form without bending"
      },
      {
        step: 5,
        title: "Warm Syrup Soak",
        instruction: "Immediately plunge hot jalebis directly into the warm saffron syrup for precisely 40-50 seconds, turning once so the hollow spiral channels fill with nectar. Lift with tongs and serve hot with chilled rabdi.",
        time: "1 min",
        temp: "Warm syrup",
        visualCue: "Jalebi turns translucent and heavy with glistening amber syrup"
      }
    ],
    chefTips: [
      "Use a flat-bottomed shallow pan with no more than 1.5 inches of ghee so jalebis stay flat rather than folding.",
      "The syrup must be warm, not boiling; boiling syrup makes jalebis soggy, cold syrup won't penetrate the spirals."
    ],
    substitutions: [
      { original: "Ghee frying", substitute: "Refined neutral peanut oil with 2 tbsp ghee added", notes: "Crisp and cost-effective" }
    ],
    commonMistakes: [
      { mistake: "Leaving jalebi in syrup too long", consequence: "The brittle exterior absorbs too much liquid and becomes soft and limp." }
    ],
    allergens: ["Gluten", "Dairy"],
    safety: "Be careful when piping directly over hot bubbling oil.",
    storage: "Best consumed immediately hot. Do not refrigerate or they lose crispness."
  },

  // 6. Shahi Kulfi
  {
    id: "shahi-malai-kulfi-falooda",
    title: "Old Delhi Malai Kulfi with Saffron Falooda",
    tagline: "Dense, slow-caramelized rabdi ice cream studded with pistachios, served on silky falooda vermicelli",
    description: "The timeless frozen dessert of Delhi's Chandni Chowk. Whole milk is simmered down to one-third its volume in a wide iron kadai until caramelized and granular with clotted cream, perfumed with cardamom and saffron, frozen in traditional conical molds, and served with cornstarch vermicelli and rose syrup.",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "North Indian",
    prepTime: "15 mins",
    prepTimeMinutes: 15,
    cookTime: "45 mins",
    cookTimeMinutes: 45,
    totalTime: "1 hr + freezing",
    servings: 6,
    difficulty: "Medium",
    rating: 4.96,
    reviewCount: 340,
    calories: 310,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "Frozen", "Gluten-Free"],
    equipment: ["Traditional aluminum kulfi cones or popsicle molds", "Heavy bottom kadai"],
    nutrition: {
      servingSize: "1 kulfi cone (~120g)",
      calories: 310,
      energyKj: 1297,
      protein: 9,
      carbohydrates: 34,
      sugar: 28,
      fiber: 0.5,
      totalFat: 16,
      saturatedFat: 10,
      sodium: 95
    },
    ingredients: [
      { name: "Full cream whole milk", amount: 1.5, unit: "liters", notes: "High fat content is essential", category: "Dairy" },
      { name: "Heavy cream", amount: 150, unit: "ml", notes: "For velvety richness", category: "Dairy" },
      { name: "Granulated sugar", amount: 100, unit: "g", notes: "To taste", category: "Pantry" },
      { name: "Pistachios and cashews", amount: 4, unit: "tbsp", notes: "Finely chopped", category: "Nuts" },
      { name: "Green cardamom powder", amount: 0.75, unit: "tsp", notes: "Freshly ground", category: "Spices" },
      { name: "Kashmiri saffron threads", amount: 20, unit: "threads", notes: "Steeped in 2 tbsp warm milk", category: "Spices" },
      { name: "Kewra water", amount: 0.5, unit: "tsp", notes: "Traditional screwpine essence", category: "Flavoring" }
    ],
    steps: [
      {
        step: 1,
        title: "Slow Milk Reduction",
        instruction: "Bring milk and heavy cream to a boil in a wide kadai. Reduce heat to medium-low and simmer for 40 minutes, regularly scraping the malai (clotted cream) from the sides of the pan back into the center until reduced to one-third of its original volume.",
        time: "40 mins",
        temp: "Medium-low heat",
        visualCue: "Milk turns creamy, thick, and lightly caramel-toned with visible soft malai flecks"
      },
      {
        step: 2,
        title: "Flavor & Cool",
        instruction: "Stir in sugar, saffron milk, cardamom powder, kewra water, and chopped pistachios and cashews. Simmer for 3 minutes until sugar completely dissolves. Remove from heat and cool to room temperature.",
        time: "5 mins",
        temp: "Off the heat",
        visualCue: "Thick custard-like base with golden saffron specks"
      },
      {
        step: 3,
        title: "Mold & Freeze",
        instruction: "Pour the cooled kulfi mixture into traditional aluminum conical molds. Cover with foil or tight lids. Freeze in the coldest section of your freezer for at least 8 hours until completely set.",
        time: "8 hours freezing",
        temp: "-18°C / 0°F",
        visualCue: "Solid frozen consistency without icy crystallization"
      },
      {
        step: 4,
        title: "Unmold & Serve",
        instruction: "Rub the mold briefly between your warm palms or dip in warm water for 5 seconds. Insert a wooden skewer and slide out. Slice into thick rounds and serve with falooda noodles and rose syrup.",
        time: "2 mins",
        temp: "Chilled",
        visualCue: "Creamy, dense, slow-melting texture that never feels airy like commercial ice cream"
      }
    ],
    chefTips: [
      "Kulfi is intentionally dense and unchurned; do not blend in a mixer or it will aerate and ruin the dense texture.",
      "Traditional aluminum molds freeze faster and create smaller ice crystals than silicone or plastic molds."
    ],
    substitutions: [
      { original: "Kewra water", substitute: "Pure rose water or 1/2 tsp vanilla", notes: "Adds lovely floral aroma" }
    ],
    commonMistakes: [
      { mistake: "Freezing warm mixture", consequence: "Large ice crystals form, making the kulfi icy and gritty instead of smooth." }
    ],
    allergens: ["Dairy", "Tree Nuts"],
    safety: "Ensure molds are well sealed to prevent freezer odor absorption.",
    storage: "Keep frozen in sealed molds for up to 2 months."
  },

  // 7. Shrikhand
  {
    id: "kesar-elaichi-shrikhand",
    title: "Gujarati Kesar Elaichi Shrikhand",
    tagline: "Velvety hung curd cream whipped with saffron, green cardamom & roasted slivered almonds",
    description: "The beloved dessert of Gujarat and Maharashtra. Whole milk yogurt is strained through fine muslin for 12 hours until all whey is extracted into thick hung curd (chakka), then hand-whipped with fine powdered sugar, saffron milk, freshly crushed cardamom, and pistachio slivers into a luxurious, cloud-like mousse.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "Gujarati",
    prepTime: "15 mins",
    prepTimeMinutes: 15,
    cookTime: "0 mins (no-cook)",
    cookTimeMinutes: 0,
    totalTime: "15 mins + draining",
    servings: 4,
    difficulty: "Easy",
    rating: 4.93,
    reviewCount: 260,
    calories: 240,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "No-Bake", "Gluten-Free", "Chilled", "Quick"],
    equipment: ["Fine muslin cloth or cheesecloth", "Balloon whisk"],
    nutrition: {
      servingSize: "1/2 cup (~120g)",
      calories: 240,
      energyKj: 1004,
      protein: 9,
      carbohydrates: 32,
      sugar: 28,
      fiber: 0.5,
      totalFat: 8,
      saturatedFat: 5,
      sodium: 45
    },
    ingredients: [
      { name: "Fresh whole-milk yogurt (dahi)", amount: 1, unit: "kg", notes: "Yields ~400g chakka/hung curd", category: "Dairy" },
      { name: "Powdered sugar (caster sugar)", amount: 120, unit: "g", notes: "Sifted to prevent lumps", category: "Pantry" },
      { name: "Kashmiri saffron threads", amount: 20, unit: "threads", notes: "Steeped in 1 tbsp warm milk", category: "Spices" },
      { name: "Green cardamom powder", amount: 0.75, unit: "tsp", notes: "Freshly ground", category: "Spices" },
      { name: "Charoli seeds", amount: 1, unit: "tsp", notes: "Traditional garnish", category: "Nuts" },
      { name: "Pistachios and almonds", amount: 2, unit: "tbsp", notes: "Thinly sliced", category: "Nuts" }
    ],
    steps: [
      {
        step: 1,
        title: "Strain Yogurt into Chakka",
        instruction: "Line a colander with double-layered muslin cloth over a deep bowl. Pour in the fresh yogurt, tie the cloth edges tightly, and hang in the refrigerator for 8-12 hours with a light weight placed on top to express all liquid whey.",
        time: "8-12 hours",
        temp: "Refrigerator",
        visualCue: "Yogurt transforms into a solid, cream-cheese-thick curd with zero dripping whey"
      },
      {
        step: 2,
        title: "Infuse Saffron & Whip",
        instruction: "Transfer the thick chakka to a glass bowl. Sift in powdered sugar and cardamom powder. Add the warm saffron milk. Using a balloon whisk or wooden ladle, whip energetically in one direction for 4-5 minutes until the sugar dissolves and the texture becomes light and glossy.",
        time: "5 mins",
        temp: "Room temperature",
        visualCue: "Satin-smooth, golden saffron cream with soft peaks"
      },
      {
        step: 3,
        title: "Garnish & Chill",
        instruction: "Fold in half the sliced pistachios, almonds, and charoli seeds. Spoon into individual glass dessert bowls, garnish with remaining nuts and a pinch of saffron, and chill for at least 1 hour before serving with warm puris.",
        time: "1 hour chilling",
        temp: "Chilled (4°C)",
        visualCue: "Firm, rich dessert cream that holds its shape on a spoon"
      }
    ],
    chefTips: [
      "Always strain yogurt inside the refrigerator; room temperature straining makes the yogurt turn sour.",
      "Use freshly ground green cardamom pods instead of pre-ground store powder for pure floral vibrancy."
    ],
    substitutions: [
      { original: "Powdered sugar", substitute: "Honey or powdered jaggery", notes: "Offers an earthy sweetness" }
    ],
    commonMistakes: [
      { mistake: "Blending in high-speed electric mixer", consequence: "The blade breaks the fat emulsion, making the shrikhand runny and watery." }
    ],
    allergens: ["Dairy", "Tree Nuts"],
    safety: "Keep refrigerated to maintain freshness.",
    storage: "Refrigerate in a covered glass container for up to 5 days."
  },

  // 8. Kaju Katli
  {
    id: "kaju-katli-silver-vark",
    title: "Halwai-Style Diamond Kaju Katli (Cashew Fudge)",
    tagline: "Silky, melt-in-the-mouth cashew diamond slices adorned with edible silver leaf",
    description: "The royal jewel of Diwali gifting. Premium raw cashew nuts are ground to a delicate velvet powder, folded into a gentle simmering sugar syrup, kneaded on a warm greased surface with desi ghee into a pliable dough, rolled wafer-thin, crowned with edible silver leaf, and sliced into iconic diamond lozenges.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "North Indian",
    prepTime: "15 mins",
    prepTimeMinutes: 15,
    cookTime: "15 mins",
    cookTimeMinutes: 15,
    totalTime: "30 mins",
    servings: 8,
    difficulty: "Medium",
    rating: 4.97,
    reviewCount: 360,
    calories: 195,
    tags: ["Desserts", "Indian Sweets", "Vegetarian", "Eggless", "Gluten-Free", "Festive", "Vegan-Friendly"],
    equipment: ["High-speed grinder / spice mill", "Non-stick pan or heavy kadai", "Rolling pin & parchment paper"],
    nutrition: {
      servingSize: "2 diamond pieces (~40g)",
      calories: 195,
      energyKj: 816,
      protein: 5,
      carbohydrates: 20,
      sugar: 15,
      fiber: 1,
      totalFat: 11,
      saturatedFat: 2.2,
      sodium: 5
    },
    ingredients: [
      { name: "Raw whole cashew nuts (kaju)", amount: 250, unit: "g", notes: "Dry and room temperature", category: "Nuts" },
      { name: "Granulated sugar", amount: 150, unit: "g", notes: "Syrup base", category: "Pantry" },
      { name: "Water", amount: 75, unit: "ml", notes: "Exactly half of sugar weight", category: "Pantry" },
      { name: "Pure desi ghee (or coconut oil)", amount: 1, unit: "tsp", notes: "For greasing parchment", category: "Dairy" },
      { name: "Rose water or cardamom powder", amount: 0.25, unit: "tsp", notes: "Subtle aroma", category: "Flavoring" },
      { name: "Edible silver leaf (chandi ka vark)", amount: 2, unit: "sheets", notes: "Traditional artisanal finish", category: "Garnish" }
    ],
    steps: [
      {
        step: 1,
        title: "Pulse Cashews into Fine Powder",
        instruction: "Ensure cashews are completely dry. Place in a dry blender or spice mill and pulse in short 2-3 second bursts. Sift through a medium sieve into a bowl, re-pulsing remaining coarse granules. Do not over-blend or cashews will release oil and turn into butter.",
        time: "5 mins",
        temp: "Room temperature",
        visualCue: "Fine, fluffy, dry cashew flour"
      },
      {
        step: 2,
        title: "Form Half-String Syrup",
        instruction: "In a non-stick pan over medium heat, combine sugar and water. Stir until sugar dissolves and bring to a simmer for 3-4 minutes until it forms a half-string consistency.",
        time: "4 mins",
        temp: "Medium heat",
        visualCue: "Syrup feels sticky with a faint, brief single thread"
      },
      {
        step: 3,
        title: "Cook Cashew Paste",
        instruction: "Turn heat to low. Add the powdered cashew flour in batches, stirring vigorously with a silicone spatula to prevent any lumps. Cook on low heat, stirring continuously for 6-8 minutes until the paste thickens and leaves the sides of the pan.",
        time: "8 mins",
        temp: "Low heat",
        visualCue: "A small pinched ball of paste rolls non-sticky between your fingers"
      },
      {
        step: 4,
        title: "Knead & Roll Wafer-Thin",
        instruction: "Transfer the warm paste onto a sheet of parchment paper lightly greased with ghee. As it cools slightly, knead for 2 minutes using the parchment edges until smooth. Top with a second parchment sheet and roll with a rolling pin to a uniform 5mm thickness.",
        time: "4 mins",
        temp: "Warm",
        visualCue: "Silky, smooth, crack-free sheet of cashew fudge"
      },
      {
        step: 5,
        title: "Silver Leaf & Diamond Cut",
        instruction: "Gently apply edible silver leaf if using. Allow to cool for 20 minutes, then cut diagonally with a sharp knife or pizza wheel into signature diamond shapes.",
        time: "20 mins cooling",
        temp: "Room temperature",
        visualCue: "Crisp, clean diamond edges with tender, melt-in-mouth bite"
      }
    ],
    chefTips: [
      "Pulse cashews in quick bursts only; continuous grinding releases oils and turns the flour into greasy paste.",
      "To test if paste is done, pinch a pea-sized amount onto a cold plate; if you can roll it into a soft non-sticky ball, turn off the heat immediately."
    ],
    substitutions: [
      { original: "Desi Ghee", substitute: "Refined coconut oil", notes: "Produces a 100% dairy-free vegan kaju katli" }
    ],
    commonMistakes: [
      { mistake: "Overcooking the paste in the pan", consequence: "The fudge dries out and becomes chewy and hard rather than smooth and melt-in-the-mouth." }
    ],
    allergens: ["Tree Nuts"],
    safety: "Handle warm cashew dough carefully while rolling.",
    storage: "Store in an airtight container at room temperature for up to 15 days, or refrigerate for 1 month."
  },

  // 9. New York Cheesecake
  {
    id: "new-york-baked-cheesecake",
    title: "Classic New York Baked Vanilla Bean Cheesecake with Berry Coulis",
    tagline: "Dense, ultra-creamy baked Philadelphia cheesecake with a buttery graham crust and tart berry coulis",
    description: "The gold standard of American baking. A crisp graham cracker and brown butter crust cradles a dense, velvety filling made with real Philadelphia cream cheese, cultured sour cream, Madagascar vanilla bean paste, and farm-fresh eggs, slow-baked in a water bath to silky perfection.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "American",
    prepTime: "25 mins",
    prepTimeMinutes: 25,
    cookTime: "1 hr 15 mins",
    cookTimeMinutes: 75,
    totalTime: "1 hr 40 mins + chilling",
    servings: 10,
    difficulty: "Medium",
    rating: 4.98,
    reviewCount: 450,
    calories: 420,
    tags: ["Desserts", "International Sweets", "Baked", "Vegetarian", "Chilled"],
    equipment: ["9-inch springform pan", "Roasting pan for water bath (bain-marie)", "Heavy-duty aluminum foil", "Stand mixer with paddle"],
    nutrition: {
      servingSize: "1 slice (~150g)",
      calories: 420,
      energyKj: 1757,
      protein: 8,
      carbohydrates: 36,
      sugar: 26,
      fiber: 1.2,
      totalFat: 28,
      saturatedFat: 16,
      sodium: 320
    },
    ingredients: [
      { name: "Graham cracker crumbs or digestive biscuits", amount: 180, unit: "g", notes: "Finely ground", category: "Pantry" },
      { name: "Unsalted butter (melted)", amount: 75, unit: "g", notes: "For binding crust", category: "Dairy" },
      { name: "Light brown sugar", amount: 2, unit: "tbsp", notes: "For crust caramel notes", category: "Pantry" },
      { name: "Philadelphia full-fat cream cheese (blocks)", amount: 900, unit: "g", notes: "Room temperature", category: "Dairy" },
      { name: "Granulated sugar", amount: 200, unit: "g", notes: "For silky sweetness", category: "Pantry" },
      { name: "Cultured sour cream", amount: 200, unit: "g", notes: "Provides characteristic NY tang", category: "Dairy" },
      { name: "Heavy whipping cream", amount: 60, unit: "ml", notes: "Softens texture", category: "Dairy" },
      { name: "Large eggs + 1 yolk", amount: 4, unit: "whole + yolk", notes: "Room temperature", category: "Dairy" },
      { name: "Madagascar vanilla bean paste", amount: 1.5, unit: "tbsp", notes: "Visible black vanilla specks", category: "Baking" },
      { name: "Fresh lemon juice & zest", amount: 1, unit: "tsp", notes: "Brightens the dairy richness", category: "Produce" },
      { name: "All-purpose flour", amount: 2, unit: "tbsp", notes: "Stabilizes against cracks", category: "Baking" }
    ],
    steps: [
      {
        step: 1,
        title: "Bake Graham Cracker Crust",
        instruction: "Preheat oven to 160°C (325°F). Mix graham crumbs, melted butter, and brown sugar. Press firmly into the base and 1 inch up the sides of a 9-inch springform pan. Bake for 10 minutes until fragrant and golden, then cool completely.",
        time: "10 mins",
        temp: "160°C (325°F)",
        visualCue: "Firm, lightly browned crust that does not crumble"
      },
      {
        step: 2,
        title: "Cream Cheese & Sugar",
        instruction: "In a stand mixer fitted with paddle on low speed, beat room-temperature cream cheese and sugar for 3 minutes until smooth and lump-free. Scrape bowl thoroughly. Add flour, vanilla bean paste, lemon juice, sour cream, and heavy cream, mixing on low just until combined.",
        time: "5 mins",
        temp: "Room temperature",
        visualCue: "Lustrous, velvety cream without incorporated air pockets"
      },
      {
        step: 3,
        title: "Gently Incorporate Eggs",
        instruction: "Add eggs one at a time on the lowest speed, mixing only until the yolk disappears before adding the next. Pour batter over the cooled crust and tap the pan firmly on the counter to release air bubbles.",
        time: "3 mins",
        temp: "Low speed",
        visualCue: "Glossy, uniform pale ivory batter"
      },
      {
        step: 4,
        title: "Water Bath Bake",
        instruction: "Wrap the springform pan tightly in 3 layers of heavy-duty foil. Place inside a large roasting pan and pour boiling water until it reaches halfway up the springform. Bake at 150°C (300°F) for 65-75 minutes until edges are set but center has a slight gentle wobble.",
        time: "75 mins",
        temp: "150°C (300°F)",
        visualCue: "Edges are matte and firm; center 2 inches has a gentle gelatin-like wobble"
      },
      {
        step: 5,
        title: "Slow Oven Cool & Chill",
        instruction: "Turn off oven, prop door ajar with a wooden spoon, and cool cheesecake inside for 1 hour. Remove, discard foil, run a thin knife around the perimeter, and chill in refrigerator for at least 8 hours (preferably overnight) before slicing with a hot knife.",
        time: "8 hours chilling",
        temp: "Refrigerated (4°C)",
        visualCue: "Clean, silky, crack-free ivory surface that cuts like cold butter"
      }
    ],
    chefTips: [
      "Every single dairy ingredient MUST be at room temperature before beating to prevent lumps.",
      "The slow oven cool-down is crucial; sudden temperature drops cause thermal shock and split the top surface."
    ],
    substitutions: [
      { original: "Graham Crackers", substitute: "Digestive biscuits or Lotus Biscoff cookies", notes: "Lotus gives a caramelized spiced flavor" }
    ],
    commonMistakes: [
      { mistake: "Whipping batter at high speed", consequence: "Beating incorporates excessive air into the batter, causing the cake to puff dramatically in the oven and collapse with deep cracks." }
    ],
    allergens: ["Dairy", "Eggs", "Gluten"],
    safety: "Use caution when pouring boiling water into the roasting pan in the oven.",
    storage: "Refrigerate covered for up to 7 days. Can be frozen in individual wrapped slices for 2 months."
  },

  // 10. Creme Brulee
  {
    id: "classic-creme-brulee-vanilla",
    title: "Parisian Vanilla Bean Crème Brûlée with Glass-Crisp Caramel",
    tagline: "Rich, velvety baked egg yolk custard crowned with a brittle, torch-caramelized sugar crust",
    description: "The timeless French bistro classic. Pure heavy cream is steeped with split Madagascar vanilla bean pods, whisked with rich egg yolks and fine sugar, baked gently in shallow ramekins in a water bath until barely set, chilled thoroughly, and finished with a thin layer of turbinado sugar torched to a shatterable amber glass crust.",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "French",
    prepTime: "15 mins",
    prepTimeMinutes: 15,
    cookTime: "35 mins",
    cookTimeMinutes: 35,
    totalTime: "50 mins + chilling",
    servings: 4,
    difficulty: "Medium",
    rating: 4.96,
    reviewCount: 375,
    calories: 380,
    tags: ["Desserts", "International Sweets", "Baked", "French Haute Patisserie", "Gluten-Free", "Chilled"],
    equipment: ["Shallow ceramic ramekins", "Kitchen blowtorch", "Fine mesh sieve", "Bain-marie roasting pan"],
    nutrition: {
      servingSize: "1 ramekin (~140g)",
      calories: 380,
      energyKj: 1590,
      protein: 5,
      carbohydrates: 25,
      sugar: 24,
      fiber: 0,
      totalFat: 30,
      saturatedFat: 18,
      sodium: 70
    },
    ingredients: [
      { name: "Heavy whipping cream (36% fat)", amount: 500, unit: "ml", notes: "Rich dairy base", category: "Dairy" },
      { name: "Madagascar vanilla bean pod", amount: 1, unit: "whole", notes: "Split lengthwise and seeds scraped", category: "Baking" },
      { name: "Large egg yolks", amount: 5, unit: "yolks", notes: "Room temperature", category: "Dairy" },
      { name: "Granulated white sugar", amount: 75, unit: "g", notes: "For custard base", category: "Pantry" },
      { name: "Turbinado or demerara sugar", amount: 4, unit: "tsp", notes: "For torching glass crust", category: "Pantry" },
      { name: "Fine sea salt", amount: 1, unit: "pinch", notes: "Balances rich cream", category: "Spices" }
    ],
    steps: [
      {
        step: 1,
        title: "Infuse Cream with Vanilla",
        instruction: "In a saucepan, combine heavy cream, scraped vanilla bean seeds, and the empty pod. Heat over medium heat until tiny bubbles appear around the rim (just below boiling). Remove from heat and steep for 15 minutes.",
        time: "15 mins",
        temp: "Medium heat (80°C)",
        visualCue: "Cream is speckled with thousands of aromatic black vanilla seeds"
      },
      {
        step: 2,
        title: "Whisk Egg Yolks & Temper",
        instruction: "In a bowl, gently whisk egg yolks, granulated sugar, and salt just until combined without whipping in foam. Slowly stream the warm vanilla cream into the yolks while constantly whisking. Strain through a fine-mesh sieve into a pouring pitcher.",
        time: "4 mins",
        temp: "Warm",
        visualCue: "Silky, pale yellow, bubble-free custard liquid"
      },
      {
        step: 3,
        title: "Bake in Water Bath",
        instruction: "Preheat oven to 150°C (300°F). Place shallow ramekins in a baking dish. Divide custard among ramekins. Skim off any surface bubbles with a paper towel. Pour hot water into the pan until it reaches halfway up the ramekin sides. Bake for 30-35 minutes.",
        time: "35 mins",
        temp: "150°C (300°F)",
        visualCue: "Edges are set while the center retains a gentle, jelly-like jiggle"
      },
      {
        step: 4,
        title: "Chill Thoroughly",
        instruction: "Carefully remove ramekins from the water bath, cool on a wire rack for 30 minutes, then refrigerate uncovered for at least 4 hours (or up to 2 days).",
        time: "4 hours",
        temp: "Refrigerator (4°C)",
        visualCue: "Firm, cold, silky custard"
      },
      {
        step: 5,
        title: "Torching the Sugar Crust",
        instruction: "Sprinkle an even, thin layer of turbinado sugar over each custard. Holding a kitchen torch 3 inches away, sweep the flame in steady circles until the sugar bubbles, liquefies, and caramelizes into a deep golden amber. Rest for 2 minutes to harden before breaking with a spoon.",
        time: "2 mins",
        temp: "Torch flame",
        visualCue: "Glassy amber crust that makes an audible 'crack' when tapped with a teaspoon"
      }
    ],
    chefTips: [
      "Use wide, shallow ramekins rather than deep cups for the ideal ratio of crunchy caramelized crust to silky cream.",
      "Pop any microscopic surface bubbles with a quick pass of the blowtorch before baking for a satin-smooth finish."
    ],
    substitutions: [
      { original: "Vanilla bean pod", substitute: "1 tbsp pure vanilla bean paste", notes: "Contains real seeds" }
    ],
    commonMistakes: [
      { mistake: "Torching too long in one spot", consequence: "The sugar scorches black and turns bitter while melting the cold custard beneath." }
    ],
    allergens: ["Dairy", "Eggs"],
    safety: "Operate kitchen blowtorch carefully on heat-proof surfaces away from flammable items.",
    storage: "Custards can be refrigerated up to 3 days before torching. Torch sugar only immediately before serving."
  },

  // 11. Fudgy Dark Chocolate Brownies
  {
    id: "fudgy-dark-chocolate-brownies",
    title: "Fudgy Belgian Dark Chocolate Espresso Brownies",
    tagline: "Ultra-dense, chewy 70% dark chocolate brownies with a paper-thin crinkly meringue top",
    description: "The definitive chocolate lover's indulgence. Melted Valrhona 70% dark chocolate and European butter are whipped with whole eggs, brown sugar, and espresso powder until emulsified into a glossy ribbon, folded with Dutch-processed cocoa and chocolate chunks, baked to fudgy perfection with a paper-thin shiny crinkly crust.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "American",
    prepTime: "15 mins",
    prepTimeMinutes: 15,
    cookTime: "25 mins",
    cookTimeMinutes: 25,
    totalTime: "40 mins",
    servings: 12,
    difficulty: "Easy",
    rating: 4.97,
    reviewCount: 480,
    calories: 320,
    tags: ["Desserts", "International Sweets", "Chocolate", "Baked", "Vegetarian"],
    equipment: ["8x8-inch square metal baking pan", "Parchment paper", "Electric hand mixer"],
    nutrition: {
      servingSize: "1 brownie square (~75g)",
      calories: 320,
      energyKj: 1339,
      protein: 5,
      carbohydrates: 38,
      sugar: 28,
      fiber: 3.5,
      totalFat: 18,
      saturatedFat: 11,
      sodium: 120
    },
    ingredients: [
      { name: "70% Belgian dark chocolate (chopped)", amount: 200, unit: "g", notes: "Melted with butter", category: "Baking" },
      { name: "Unsalted European butter", amount: 115, unit: "g", notes: "Half cup", category: "Dairy" },
      { name: "Dutch-processed cocoa powder", amount: 30, unit: "g", notes: "Sifted", category: "Baking" },
      { name: "Granulated white sugar", amount: 150, unit: "g", notes: "For shiny top", category: "Pantry" },
      { name: "Light brown sugar", amount: 100, unit: "g", notes: "For fudgy chew", category: "Pantry" },
      { name: "Large eggs", amount: 3, unit: "whole", notes: "Room temperature", category: "Dairy" },
      { name: "Espresso powder", amount: 1, unit: "tsp", notes: "Deepens chocolate intensity", category: "Pantry" },
      { name: "Pure vanilla extract", amount: 1, unit: "tsp", notes: "Flavor enhancer", category: "Baking" },
      { name: "All-purpose flour", amount: 65, unit: "g", notes: "Minimal flour for fudgy texture", category: "Baking" },
      { name: "Flaky Maldon sea salt", amount: 1, unit: "pinch", notes: "For top sprinkle", category: "Spices" },
      { name: "Semi-sweet chocolate chips", amount: 75, unit: "g", notes: "Folded into batter", category: "Baking" }
    ],
    steps: [
      {
        step: 1,
        title: "Melt Chocolate & Butter",
        instruction: "Preheat oven to 175°C (350°F). Line an 8x8-inch metal baking pan with parchment paper, leaving an overhang for lifting. Melt chopped dark chocolate and butter together in a heatproof bowl set over simmering water (or in 30-second microwave bursts). Whisk in cocoa powder and espresso powder until glossy.",
        time: "5 mins",
        temp: "Gentle heat",
        visualCue: "Smooth, glossy, pitch-dark chocolate pool"
      },
      {
        step: 2,
        title: "Whip Eggs & Sugars for Shiny Top",
        instruction: "In a mixing bowl, beat eggs, white sugar, and brown sugar with an electric mixer on medium-high speed for full 4-5 minutes until pale, frothy, and doubled in volume. This step creates the iconic shiny crinkle top.",
        time: "5 mins",
        temp: "Room temperature",
        visualCue: "Thick, pale ribbon falls from the beaters and holds shape for 3 seconds"
      },
      {
        step: 3,
        title: "Fold Batter & Chocolate Chunks",
        instruction: "Pour the warm melted chocolate mixture into the whipped eggs and gently fold with a spatula until just combined. Sift in flour and salt. Fold gently until no dry streaks remain, then fold in chocolate chips.",
        time: "3 mins",
        temp: "Room temperature",
        visualCue: "Thick, fudgy, decadent batter"
      },
      {
        step: 4,
        title: "Bake to Fudgy Center",
        instruction: "Spread batter evenly in prepared pan. Bake for 22-25 minutes until the top is shiny, crinkly, and paper-thin, and a toothpick inserted in the center comes out with moist, fudgy crumbs (not wet batter and not completely clean).",
        time: "24 mins",
        temp: "175°C (350°F)",
        visualCue: "Cracked tissue-paper thin crust with slightly puffed edges"
      },
      {
        step: 5,
        title: "Cool & Slice",
        instruction: "Sprinkle with flaky sea salt. Cool completely in the pan for 1 hour, then chill in refrigerator for 30 minutes to set before lifting out and slicing into clean squares with a chef's knife.",
        time: "1 hour cooling",
        temp: "Cool",
        visualCue: "Dense, intensely fudgy dark chocolate cross-sections"
      }
    ],
    chefTips: [
      "Whipping the eggs with the sugar for a full 4-5 minutes is the only way to achieve the coveted paper-thin crinkly crust.",
      "Use a metal baking pan rather than glass; glass holds heat unevenly and overcooks the edges before the center bakes."
    ],
    substitutions: [
      { original: "Espresso powder", substitute: "1 tsp strong brewed espresso", notes: "Does not taste like coffee, only amplifies chocolate" }
    ],
    commonMistakes: [
      { mistake: "Overbaking until a toothpick comes out dry", consequence: "Brownies dry out into cake rather than remaining gooey and fudgy." }
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    safety: "Parchment handles make lifting hot brownies safe.",
    storage: "Store in an airtight container at room temperature for up to 5 days, or freeze for 3 months."
  },

  // 12. French Macarons
  {
    id: "parisian-pistachio-macarons",
    title: "Crisp French Pistachio Macarons with White Chocolate Ganache",
    tagline: "Delicate almond meringue shells with ruffled feet filled with whipped pistachio ganache",
    description: "The crown jewel of French haute patisserie. Finely ground California blanched almonds and confectioners' sugar are folded with glossy French meringue using the macaronage technique, piped into perfect rounds, rested until a skin forms, baked to develop ruffled pieds (feet), and sandwiched around silky pistachio white chocolate ganache.",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "French",
    prepTime: "35 mins",
    prepTimeMinutes: 35,
    cookTime: "15 mins",
    cookTimeMinutes: 15,
    totalTime: "50 mins + resting",
    servings: 8,
    difficulty: "Hard",
    rating: 4.95,
    reviewCount: 310,
    calories: 180,
    tags: ["Desserts", "International Sweets", "French Haute Patisserie", "Gluten-Free", "Baking", "Chilled"],
    equipment: ["Piping bag with 1/2-inch round tip", "Silicone macaron baking mat or parchment", "Kitchen digital scale", "Sifter"],
    nutrition: {
      servingSize: "2 macarons (~45g)",
      calories: 180,
      energyKj: 753,
      protein: 4,
      carbohydrates: 22,
      sugar: 20,
      fiber: 1.5,
      totalFat: 9,
      saturatedFat: 3.5,
      sodium: 25
    },
    ingredients: [
      { name: "Super-fine blanched almond flour", amount: 100, unit: "g", notes: "Sifted twice", category: "Nuts" },
      { name: "Powdered confectioners' sugar", amount: 100, unit: "g", notes: "Free of cornstarch clumps", category: "Pantry" },
      { name: "Aged egg whites", amount: 75, unit: "g", notes: "Approx 2 large eggs, room temp", category: "Dairy" },
      { name: "Granulated caster sugar", amount: 65, unit: "g", notes: "For stabilizing meringue", category: "Pantry" },
      { name: "Cream of tartar", amount: 0.25, unit: "tsp", notes: "Meringue stabilizer", category: "Baking" },
      { name: "Gel food coloring (pistachio green)", amount: 2, unit: "drops", notes: "Avoid liquid water coloring", category: "Baking" },
      { name: "Pure pistachio paste (100%)", amount: 2, unit: "tbsp", notes: "For intense nutty ganache", category: "Nuts" },
      { name: "White chocolate (melted)", amount: 120, unit: "g", notes: "High cacao butter", category: "Baking" },
      { name: "Heavy whipping cream", amount: 50, unit: "ml", notes: "For ganache", category: "Dairy" }
    ],
    steps: [
      {
        step: 1,
        title: "Sift Dry Ingredients",
        instruction: "Pulse almond flour and powdered sugar in a food processor for 15 seconds. Sift twice through a fine-mesh sieve onto parchment paper to remove all coarse granules. Discard any large nut flecks.",
        time: "5 mins",
        temp: "Room temperature",
        visualCue: "Airy, silk-fine almond sugar powder"
      },
      {
        step: 2,
        title: "Whip Stiff French Meringue",
        instruction: "In a spotless, grease-free glass bowl, whip aged egg whites with cream of tartar on medium speed until foamy. Gradually add granulated sugar one tablespoon at a time. Increase speed to high and whip for 4-5 minutes until ultra-stiff, glossy peaks form that do not bend when beaters are lifted. Fold in gel green color.",
        time: "6 mins",
        temp: "Room temperature",
        visualCue: "Meringue forms sharp, stiff bird-beak peaks and clumping inside the whisk"
      },
      {
        step: 3,
        title: "The Macaronage Technique",
        instruction: "Fold dry ingredients into meringue in three additions. Using a silicone spatula, cut down the center, sweep around the bowl, and press the batter against the sides to gently deflate excess air. Continue until batter flows off the spatula in continuous, glossy lava-like ribbons and can form an unbroken figure-8.",
        time: "4 mins",
        temp: "Room temperature",
        visualCue: "Ribbon settles back into the bowl within 20 seconds with smooth edges"
      },
      {
        step: 4,
        title: "Pipe & Dry to Form Skin",
        instruction: "Transfer batter to a piping bag with a 1/2-inch round tip. Pipe 1.5-inch rounds onto silicone baking mats. Slam baking sheets flat against the counter 4-5 times to release trapped air bubbles. Rest at room temperature for 30-45 minutes until shells form a dry, matte skin that does not stick to your finger when touched.",
        time: "40 mins drying",
        temp: "Room temperature",
        visualCue: "Tops are dull and completely dry to gentle fingertip touch"
      },
      {
        step: 5,
        title: "Bake Ruffled Feet & Fill",
        instruction: "Bake at 150°C (300°F) for 14-15 minutes until distinctive ruffled feet form and shells don't wobble on their bases. Cool completely before peeling off mat. Pipe pistachio white chocolate ganache onto half the shells and sandwich with remaining tops. Mature in the fridge for 24 hours.",
        time: "15 mins bake + 24 hrs mature",
        temp: "150°C (300°F)",
        visualCue: "Perfect puffed ruffled feet with shatter-crisp shell and chewy interior"
      }
    ],
    chefTips: [
      "Always weigh ingredients using a digital kitchen scale in grams; cup measurements are too imprecise for macarons.",
      "Maturating the filled macarons in the refrigerator for 24 hours allows moisture to equalize, creating the signature chewy texture."
    ],
    substitutions: [
      { original: "Pistachio Paste", substitute: "Hazelnut praline or pure almond paste", notes: "Produces delicious praline macarons" }
    ],
    commonMistakes: [
      { mistake: "Baking before the skin has formed", consequence: "Steam escapes through the top instead of pushing up the bottom, causing cracked tops without any ruffled feet." }
    ],
    allergens: ["Tree Nuts", "Eggs", "Dairy"],
    safety: "Ensure baking sheets are leveled in the oven for uniform rise.",
    storage: "Refrigerate in an airtight container for up to 6 days, or freeze for 2 months."
  },

  // 13. Vanilla Panna Cotta
  {
    id: "vanilla-panna-cotta-raspberry",
    title: "Silk-Smooth Vanilla Bean Panna Cotta with Wild Raspberry Coulis",
    tagline: "Piedmontese chilled sweet cream infused with vanilla bean and crowned with tart wild raspberry glaze",
    description: "The quintessential Northern Italian summer dessert. Heavy dairy cream and whole milk are gently simmered with scraped Madagascar vanilla pods and pure cane sugar, delicately set with just enough gelatin to yield a mesmerizing gentle wobble, and served chilled alongside a vibrant seedless wild raspberry coulis.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "Italian",
    prepTime: "15 mins",
    prepTimeMinutes: 15,
    cookTime: "10 mins",
    cookTimeMinutes: 10,
    totalTime: "25 mins + chilling",
    servings: 4,
    difficulty: "Easy",
    rating: 4.96,
    reviewCount: 320,
    calories: 290,
    tags: ["Desserts", "International Sweets", "No-Bake", "Gluten-Free", "Chilled", "Quick"],
    equipment: ["Dessert glasses or dariole molds", "Small saucepan", "Fine strainer"],
    nutrition: {
      servingSize: "1 cup with coulis (~150g)",
      calories: 290,
      energyKj: 1213,
      protein: 4,
      carbohydrates: 24,
      sugar: 22,
      fiber: 2.5,
      totalFat: 21,
      saturatedFat: 13,
      sodium: 45
    },
    ingredients: [
      { name: "Heavy whipping cream (36% fat)", amount: 350, unit: "ml", notes: "Full fat for velvety texture", category: "Dairy" },
      { name: "Whole milk", amount: 150, unit: "ml", notes: "Lightens the cream", category: "Dairy" },
      { name: "Granulated sugar", amount: 65, unit: "g", notes: "Subtle sweetness", category: "Pantry" },
      { name: "Madagascar vanilla bean pod", amount: 1, unit: "pod", notes: "Split and seeds scraped", category: "Baking" },
      { name: "Powdered unflavored gelatin", amount: 2, unit: "tsp", notes: "Bloomed in 3 tbsp cold water", category: "Pantry" },
      { name: "Fresh or frozen wild raspberries", amount: 200, unit: "g", notes: "For tart coulis", category: "Produce" },
      { name: "Powdered sugar (for coulis)", amount: 2, unit: "tbsp", notes: "Adjust to berry tartness", category: "Pantry" },
      { name: "Lemon juice", amount: 1, unit: "tsp", notes: "Brightens fruit acidity", category: "Produce" }
    ],
    steps: [
      {
        step: 1,
        title: "Bloom Gelatin",
        instruction: "Sprinkle gelatin powder evenly over 3 tablespoons of cold water in a small ramekin. Let sit undisturbed for 5 minutes until fully hydrated and spongy.",
        time: "5 mins",
        temp: "Cold",
        visualCue: "Gelatin absorbs water and swells into a thick translucent jelly"
      },
      {
        step: 2,
        title: "Infuse Cream & Vanilla",
        instruction: "In a saucepan, combine heavy cream, milk, sugar, and scraped vanilla bean seeds and pod. Heat over medium until hot to the touch and sugar dissolves (approx 75°C / 167°F), but do not let it boil. Remove pod.",
        time: "6 mins",
        temp: "Medium heat",
        visualCue: "Steam gently rises with thousands of floating vanilla specks"
      },
      {
        step: 3,
        title: "Dissolve Gelatin & Pour",
        instruction: "Remove cream from heat. Stir in the bloomed gelatin until completely dissolved. Strain through a fine-mesh sieve into 4 dessert glasses or lightly oiled molds.",
        time: "3 mins",
        temp: "Warm",
        visualCue: "Completely silky, smooth liquid"
      },
      {
        step: 4,
        title: "Chill to Soft Set",
        instruction: "Refrigerate uncovered for at least 4 hours (or overnight) until set with a signature gentle jiggle.",
        time: "4 hours chilling",
        temp: "Refrigerator (4°C)",
        visualCue: "Cream is fully set yet jiggles sensuously when gently shaken"
      },
      {
        step: 5,
        title: "Simmer Raspberry Coulis",
        instruction: "Simmer raspberries, powdered sugar, and lemon juice in a saucepan for 5 minutes until berries collapse. Pass through a fine strainer to remove seeds. Cool completely and spoon over chilled panna cotta.",
        time: "5 mins",
        temp: "Medium-low heat",
        visualCue: "Vibrant ruby-red glossy fruit sauce"
      }
    ],
    chefTips: [
      "Use the minimum gelatin possible; great panna cotta should barely hold its shape and melt on your tongue instantly.",
      "Cool the mixture to room temperature before pouring into glasses so vanilla bean seeds stay suspended rather than sinking to the bottom."
    ],
    substitutions: [
      { original: "Gelatin", substitute: "Agar-agar flakes (1 tsp boiled for 2 mins)", notes: "Plant-based vegetarian setting agent" }
    ],
    commonMistakes: [
      { mistake: "Boiling cream with gelatin", consequence: "High heat breaks down gelatin proteins, preventing the panna cotta from setting firmly." }
    ],
    allergens: ["Dairy"],
    safety: "Keep refrigerated until moments before serving.",
    storage: "Refrigerate covered for up to 5 days."
  },

  // 14. Classic Apple Pie
  {
    id: "classic-american-apple-pie",
    title: "Heritage Lattice-Crust Spiced Apple Pie",
    tagline: "Flaky, all-butter golden crust bursting with tender Honeycrisp & Granny Smith apples in cinnamon caramel",
    description: "The cornerstone of American baking traditions. A heritage flaky crust made with European butter and ice water encases a mountainous mound of sliced Granny Smith and Honeycrisp apples tossed in dark brown sugar, Saigon cinnamon, ground nutmeg, and real apple cider reduction, woven with a decorative lattice crust.",
    image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "American",
    prepTime: "30 mins",
    prepTimeMinutes: 30,
    cookTime: "55 mins",
    cookTimeMinutes: 55,
    totalTime: "1 hr 25 mins",
    servings: 8,
    difficulty: "Medium",
    rating: 4.97,
    reviewCount: 410,
    calories: 380,
    tags: ["Desserts", "International Sweets", "Baked", "Fruit-Based", "Vegetarian", "Warm"],
    equipment: ["9-inch deep-dish ceramic pie plate", "Pastry blender or food processor", "Pastry wheel cutter"],
    nutrition: {
      servingSize: "1 generous slice (~170g)",
      calories: 380,
      energyKj: 1590,
      protein: 4,
      carbohydrates: 56,
      sugar: 32,
      fiber: 4.5,
      totalFat: 17,
      saturatedFat: 10,
      sodium: 180
    },
    ingredients: [
      { name: "All-purpose unbleached flour", amount: 320, unit: "g", notes: "For flaky crust", category: "Baking" },
      { name: "Unsalted cold butter (diced into cubes)", amount: 225, unit: "g", notes: "Kept ice cold", category: "Dairy" },
      { name: "Ice water", amount: 6, unit: "tbsp", notes: "Added tablespoon by tablespoon", category: "Pantry" },
      { name: "Granny Smith apples (tart)", amount: 4, unit: "large", notes: "Peeled, cored, sliced 1/4-inch", category: "Produce" },
      { name: "Honeycrisp or Gala apples (sweet)", amount: 4, unit: "large", notes: "Peeled, cored, sliced 1/4-inch", category: "Produce" },
      { name: "Dark brown sugar", amount: 100, unit: "g", notes: "For deep caramel flavor", category: "Pantry" },
      { name: "Granulated white sugar", amount: 60, unit: "g", notes: "Balances acidity", category: "Pantry" },
      { name: "Saigon cinnamon powder", amount: 1.5, unit: "tsp", notes: "Warm spice", category: "Spices" },
      { name: "Freshly grated nutmeg & allspice", amount: 0.5, unit: "tsp", notes: "Aromatic warmth", category: "Spices" },
      { name: "Cornstarch or tapioca flour", amount: 3, unit: "tbsp", notes: "Thickens fruit juices", category: "Baking" },
      { name: "Egg wash (1 egg beaten with 1 tbsp cream)", amount: 1, unit: "egg", notes: "For glossy golden shine", category: "Dairy" },
      { name: "Coarse demerara or turbinado sugar", amount: 2, unit: "tbsp", notes: "For crunchy crust finish", category: "Pantry" }
    ],
    steps: [
      {
        step: 1,
        title: "Cut Flaky Butter Crust",
        instruction: "Whisk flour, 1 tsp sugar, and salt in a bowl. Cut in ice-cold cubed butter using a pastry blender until pea-sized butter chunks remain. Drizzle ice water, tossing gently with a fork until dough comes together. Divide into two discs, wrap in plastic, and chill for 1 hour.",
        time: "15 mins",
        temp: "Ice cold",
        visualCue: "Visible chunks of cold butter throughout the dough"
      },
      {
        step: 2,
        title: "Toss Spiced Apples",
        instruction: "In a large bowl, toss sliced apples with brown sugar, white sugar, cinnamon, nutmeg, cornstarch, and 1 tbsp lemon juice. Let macerate for 15 minutes to release natural juices.",
        time: "15 mins",
        temp: "Room temperature",
        visualCue: "Apples become glossy and release a fragrant spiced syrup"
      },
      {
        step: 3,
        title: "Roll & Fill Pie Shell",
        instruction: "Roll bottom dough disc on a floured surface to a 12-inch circle. Line a 9-inch deep dish pie plate. Mound the spiced apples tightly into the crust, drizzling 3 tablespoons of the accumulated juices over top. Dot with 1 tbsp butter.",
        time: "10 mins",
        temp: "Cool",
        visualCue: "High mounded dome of apples packed tightly into the shell"
      },
      {
        step: 4,
        title: "Weave Decorative Lattice",
        instruction: "Roll second disc into an 11-inch circle and cut into 1-inch strips with a pastry wheel. Weave strips in an alternating over-and-under lattice pattern. Trim, crimp the edges firmly, brush with egg wash, and sprinkle with coarse turbinado sugar.",
        time: "10 mins",
        temp: "Room temperature",
        visualCue: "Gorgeous woven lattice with sparkling sugar crystals"
      },
      {
        step: 5,
        title: "Bake to Bubbling Perfection",
        instruction: "Bake at 200°C (400°F) for 20 minutes, then lower temperature to 175°C (350°F) and bake for 35-40 minutes until crust is deep golden brown and pie juices bubble thickly through the lattice. Cool for at least 3 hours before slicing.",
        time: "55 mins",
        temp: "200°C down to 175°C",
        visualCue: "Deep amber crust with thick, syrupy apple juices bubbling vigorously"
      }
    ],
    chefTips: [
      "Using a 50/50 blend of tart Granny Smith and sweet Honeycrisp apples delivers the perfect balance of firmness and flavor.",
      "Cooling the pie completely for 3-4 hours is essential; slicing hot pie will cause the luscious juices to run out."
    ],
    substitutions: [
      { original: "Honeycrisp", substitute: "Braeburn, Pink Lady, or Jonagold", notes: "Firm baking apples that hold their shape" }
    ],
    commonMistakes: [
      { mistake: "Warm butter in the crust", consequence: "Butter melts into the flour, yielding a tough, greasy crust with zero flakiness." }
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    safety: "Place a foil-lined baking sheet beneath the pie plate to catch bubbling drips.",
    storage: "Keeps at room temperature covered for 2 days, or refrigerated for up to 5 days. Warm gently in oven."
  },

  // 15. Japanese Strawberry Mochi
  {
    id: "japanese-strawberry-daifuku-mochi",
    title: "Japanese Fresh Strawberry Daifuku Mochi (Ichigo Daifuku)",
    tagline: "Chewy, pillowy sweet rice dough wrapping a whole juicy strawberry and smooth sweet red bean paste",
    description: "The exquisite harmony of Japanese wagashi. A whole sweet, ruby-red fresh strawberry is enrobed in smooth sweetened azuki red bean paste (koshian), then wrapped in a pillowy, soft, translucent sweet glutinous rice mochi dough dusted in toasted potato starch.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    cuisine: "Japanese",
    prepTime: "25 mins",
    prepTimeMinutes: 25,
    cookTime: "5 mins",
    cookTimeMinutes: 5,
    totalTime: "30 mins",
    servings: 6,
    difficulty: "Medium",
    rating: 4.95,
    reviewCount: 310,
    calories: 145,
    tags: ["Desserts", "International Sweets", "No-Bake", "Vegan", "Gluten-Free", "Fruit-Based", "Japanese"],
    equipment: ["Microwave-safe glass bowl", "Silicone spatula", "Parchment paper"],
    nutrition: {
      servingSize: "1 whole strawberry mochi (~65g)",
      calories: 145,
      energyKj: 607,
      protein: 3,
      carbohydrates: 33,
      sugar: 18,
      fiber: 2,
      totalFat: 0.4,
      saturatedFat: 0.1,
      sodium: 10
    },
    ingredients: [
      { name: "Fresh ripe strawberries", amount: 6, unit: "whole", notes: "Washed, hulled, patted bone-dry", category: "Produce" },
      { name: "Smooth sweet red bean paste (koshian)", amount: 150, unit: "g", notes: "Fine azuki bean paste", category: "Pantry" },
      { name: "Shiratamako or Mochiko (glutinous rice flour)", amount: 100, unit: "g", notes: "Authentic Japanese sweet rice flour", category: "Pantry" },
      { name: "Granulated sugar", amount: 40, unit: "g", notes: "Keeps mochi soft longer", category: "Pantry" },
      { name: "Water", amount: 140, unit: "ml", notes: "Mochi hydration", category: "Pantry" },
      { name: "Katakuriko (potato starch) or cornstarch", amount: 50, unit: "g", notes: "For dusting surface", category: "Pantry" }
    ],
    steps: [
      {
        step: 1,
        title: "Wrap Strawberries in Red Bean Paste",
        instruction: "Ensure strawberries are completely dry. Divide red bean paste into 6 balls (25g each). Flatten each ball in your palm, place a strawberry point-up in the center, and wrap the paste upward, leaving the very tip of the strawberry peeking through. Chill in fridge while making dough.",
        time: "8 mins",
        temp: "Chilled",
        visualCue: "Smooth red bean spheres with conical strawberry shapes inside"
      },
      {
        step: 2,
        title: "Steam Mochi Dough in Microwave",
        instruction: "In a microwave-safe glass bowl, whisk shiratamako, sugar, and water until smooth with no lumps. Cover loosely with plastic wrap and microwave on high (800W) for 1 minute. Stir with a wet silicone spatula. Microwave for another 1 minute until dough turns translucent, glossy, and stretchy.",
        time: "3 mins",
        temp: "Microwave (800W)",
        visualCue: "Dough shifts from chalky white liquid to translucent, stretchy, chewy mass"
      },
      {
        step: 3,
        title: "Dust & Divide Mochi",
        instruction: "Generously dust a clean work surface with potato starch. Scrape hot mochi dough onto the starch. Dust the top with more starch and gently pat into a flat rectangle. Cut into 6 equal portions with a scraper.",
        time: "4 mins",
        temp: "Warm",
        visualCue: "Silky, pillowy dough that does not stick to floured fingers"
      },
      {
        step: 4,
        title: "Wrap & Seal Daifuku",
        instruction: "Dust your hands with starch. Take one piece of mochi and flatten into a 3.5-inch circle with edges slightly thinner than the center. Place a bean-wrapped strawberry tip-down in the center. Pull the edges of the mochi up and pinch together tightly at the bottom to seal.",
        time: "5 mins",
        temp: "Room temperature",
        visualCue: "Seamless, plump, cloud-soft mochi dumpling"
      },
      {
        step: 5,
        title: "Shape & Serve",
        instruction: "Dust off excess starch with a pastry brush. Turn right-side up so the strawberry tip points upward. Slice in half with a string or sharp knife to reveal the stunning red berry cross-section.",
        time: "2 mins",
        temp: "Room temperature",
        visualCue: "Gorgeous cross-section of red berry, dark bean paste, and white mochi cloak"
      }
    ],
    chefTips: [
      "Strawberries MUST be thoroughly dried with paper towels; moisture on the berry makes the bean paste slide off.",
      "Cut with an unflavored dental floss or sewing thread wrapped around the center and pulled tight for a clean cut."
    ],
    substitutions: [
      { original: "Red bean paste", substitute: "White bean paste (shiroan) or chocolate ganache", notes: "Delightful modern variations" }
    ],
    commonMistakes: [
      { mistake: "Handling mochi with dry un-starched hands", consequence: "Fresh hot mochi is intensely sticky and will glue itself to your fingers." }
    ],
    allergens: [],
    safety: "Chew mochi carefully due to its dense, chewy texture.",
    storage: "Best enjoyed fresh on the day made. Do not refrigerate or the rice dough hardens."
  }
];

// Write out to data/recipes/desserts.js
const outPath = path.join(process.cwd(), "data", "recipes", "desserts.js");
const content = `// CraveAI Expanded Dessert Catalog
export const DESSERT_RECIPES = ${JSON.stringify(DESSERT_RECIPES, null, 2)};
`;
fs.writeFileSync(outPath, content, "utf-8");
console.log(`Generated ${DESSERT_RECIPES.length} rich dessert recipes into ${outPath}`);
