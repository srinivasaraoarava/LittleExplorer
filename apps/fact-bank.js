// ============================================================
// Little Explorer World — Fact Bank (World Wonders)
// ------------------------------------------------------------
// Provides ~5000 facts per topic with:
//   • deterministic generation from a seed id (0..POOL_SIZE-1)
//   • no-repeat tracking per (user, topic) via localStorage
//   • pick(topic) returns a single fresh unseen fact
// ============================================================

(function () {
  const POOL_SIZE = 5000;
  const TOPICS = ["animals", "space", "cultures", "sports", "festivals", "history", "nature"];

  // ------- helpers -------
  function makeRng(seed) {
    let s = ((seed | 0) * 2654435761 + 1) >>> 0;
    return function rand() {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0x100000000;
    };
  }
  function pickFrom(arr, s) { return arr[s % arr.length]; }
  function fact(e, t, b) { return { e, t, b }; }

  // ============================================================
  // ANIMALS
  // ============================================================
  const animalsCurated = [
    fact("🐘", "Elephants Never Forget", "Elephants have amazing memories and can remember friends and enemies for many years."),
    fact("🐬", "Dolphins Use Names", "Every dolphin has a unique whistle — like a name — that others use to call it."),
    fact("🐝", "Bees Dance", "Bees do a 'waggle dance' to tell friends where the flowers are."),
    fact("🦒", "Giraffe Neck", "A giraffe's tongue can be up to 50 cm long — long enough to clean its own ears!"),
    fact("🐢", "Slow but Sure", "Some tortoises can live for more than 150 years — longer than any human."),
    fact("🐺", "Wolves Howl Together", "Wolves howl to call the pack and to say 'I'm here!' across long distances."),
    fact("🦉", "Silent Flight", "Owls have special feathers that let them fly almost silently to catch prey."),
    fact("🦋", "Butterfly Taste", "Butterflies taste with their feet before deciding to eat!"),
    fact("🐙", "Octopus Brains", "An octopus has NINE brains — one main brain and eight little ones, one in each arm."),
    fact("🦎", "Regrowing Tails", "Some lizards can lose their tail to escape a predator — and grow it back later."),
    fact("🐧", "Penguins Propose", "Male penguins give a smooth pebble to a female as a promise to be partners for life."),
    fact("🦈", "Shark Teeth", "A shark can lose and regrow thousands of teeth in its lifetime."),
    fact("🐨", "Sleepy Koala", "Koalas sleep up to 20 hours a day — they need it to digest tough eucalyptus leaves!"),
    fact("🦥", "Slow Sloth", "Sloths move so slowly that tiny plants sometimes grow on their fur!"),
    fact("🐝", "Bee Wings", "A honey bee flaps its wings about 200 times every second — that's the buzz you hear!"),
    fact("🐳", "Whale Songs", "Whales sing songs that travel across oceans and can be heard hundreds of kilometres away."),
    fact("🐿️", "Squirrel Memory", "Squirrels bury thousands of nuts each year and remember where most of them are!"),
    fact("🐳", "Biggest Heart", "A blue whale's heart is as big as a small car and can be heard from 3 km away."),
    fact("🐝", "Team Workers", "Honey bees make honey by fanning nectar with their wings until it thickens."),
    fact("🐬", "Sleep with One Eye", "Dolphins sleep with one eye open — half their brain rests while the other half watches!"),
    fact("🦩", "Pink Flamingos", "Flamingos are pink because of the shrimp and algae they eat — no snacks, no pink!"),
    fact("🐐", "Rectangular Pupils", "Goats have rectangular pupils that give them almost 340° of vision."),
    fact("🐕", "Dog Nose Print", "Every dog's nose print is unique — like our fingerprints!"),
    fact("🐈", "Cat Purr Healing", "A cat's purr vibrates at a frequency that may help heal bones and calm humans."),
    fact("🐘", "Elephant Greetings", "Elephants greet friends by wrapping their trunks together — an elephant hug!"),
    fact("🐍", "Snake Smell", "Snakes 'smell' with their tongues by picking up chemicals from the air."),
    fact("🦘", "Kangaroo Pockets", "Baby kangaroos, called joeys, live in their mother's pocket for months after birth."),
    fact("🐊", "Crocodile Tears", "Crocodiles really do 'cry' — their eyes leak to keep them wet while eating."),
    fact("🦜", "Talking Parrots", "Some parrots can learn hundreds of words and even use them in the right places!"),
    fact("🐢", "Turtle Shell Bones", "A turtle's shell is not a house — it's part of its skeleton, made of over 50 bones."),
    fact("🐴", "Horse Sleep Standing", "Horses can sleep standing up thanks to a special 'stay' system in their legs."),
    fact("🦔", "Hedgehog Spikes", "A hedgehog has around 5,000 spines that protect it from hungry animals."),
    fact("🐜", "Super-Strong Ants", "Ants can carry objects 50 times their own body weight — like a kid lifting a car!"),
    fact("🐟", "Fish that Climb", "Some fish, like the mudskipper, can climb trees and breathe air for hours!"),
    fact("🦉", "Owl Head Turn", "Owls can turn their heads up to 270° to see behind without moving their body."),
    fact("🐝", "Queen Bee Life", "A queen bee can live 4–5 years and lay up to 2,000 eggs every day."),
    fact("🐢", "Sea Turtle Journey", "Baby sea turtles remember the beach they were born on and return years later to lay eggs."),
    fact("🐝", "No Sting Twice", "A honey bee dies after stinging once — bees prefer to fly away from trouble."),
    fact("🦔", "Curl Up Ball", "When scared, a hedgehog curls into a spiky ball to keep itself safe."),
    fact("🐆", "Cheetah Speed", "Cheetahs can sprint up to 120 km/h — the fastest land animal on Earth!"),
    fact("🐁", "Mouse Whiskers", "Mice use their whiskers like sensors — they help them feel their way in the dark."),
    fact("🐳", "Deep Diver", "Sperm whales can dive over 2 km deep hunting giant squid!"),
    fact("🐒", "Monkey Grooming", "Monkeys groom each other to build friendships and stay clean."),
    fact("🦭", "Sea Lion Whiskers", "Sea lions use their whiskers to sense fish in the dark ocean water."),
    fact("🐇", "Rabbit Eyes", "Rabbits have almost 360° vision — they can spot danger from any direction."),
    fact("🐜", "Ant Colonies", "An ant colony can have millions of ants all working together like one big family."),
    fact("🐢", "Turtle Age", "A tortoise named Adwaita lived to about 255 years — one of the oldest animals ever!"),
    fact("🐘", "Elephant Herd", "Elephant herds are led by the oldest female, called the matriarch."),
    fact("🦁", "Lion's Roar", "A lion's roar can be heard up to 8 km away — that's louder than a chainsaw!"),
    fact("🐅", "Tiger Stripes", "Every tiger has a unique stripe pattern, just like human fingerprints."),
    fact("🐢", "Turtles Breathe", "Sea turtles can hold their breath for hours while resting under the sea."),
    fact("🐝", "Beehive Democracy", "When choosing a new home, bees 'vote' by dancing — the best dance wins!"),
    fact("🐟", "Clownfish Homes", "Clownfish live inside sea anemones without being stung by them."),
    fact("🐘", "Elephants Cry", "Elephants can shed tears — they mourn family members that have died."),
    fact("🐧", "Emperor Fathers", "Emperor penguin dads keep the egg warm on their feet for 2 months during Antarctic winter."),
    fact("🦌", "Deer Antlers", "Deer shed and regrow their antlers every year — nature's own recycling."),
    fact("🐢", "Turtles Are Old", "Turtles have been on Earth for over 200 million years — they lived with the dinosaurs!"),
    fact("🐳", "Whale Milk", "Baby whales gain up to 90 kg every day drinking their mother's very fatty milk."),
    fact("🦒", "Giraffe Sleep", "Giraffes sleep only about 30 minutes a day — often standing up!"),
    fact("🐝", "Honey Never Spoils", "Honey found in ancient Egyptian tombs was still edible after 3,000 years."),
    fact("🐨", "Koala Fingerprints", "Koalas have fingerprints so similar to humans that they can confuse crime scenes!")
  ];
  const animalDeeds = [
    ["cheetah",   "🐆", "run", "120 km/h", "the fastest land animal"],
    ["peregrine falcon","🦅","dive","390 km/h","the fastest bird on Earth"],
    ["sailfish",  "🐟", "swim","110 km/h","the fastest fish in the ocean"],
    ["giant tortoise","🐢","live","150 years","one of the longest-living animals"],
    ["arctic tern","🐦","migrate","70,000 km each year","the longest journey of any bird"],
    ["blue whale","🐳","weigh","up to 200 tons","the largest animal on Earth"],
    ["ostrich",   "🦤", "run","70 km/h","the fastest bird on land"],
    ["hummingbird","🐦","flap wings","80 times a second","one of the smallest birds"],
    ["kangaroo",  "🦘", "jump","3 m high","one of the best jumpers in the wild"],
    ["frog",      "🐸", "jump","20 times its body length","an amazing little athlete"],
    ["snail",     "🐌", "crawl","1 metre per hour","one of the slowest animals"],
    ["dolphin",   "🐬", "swim","60 km/h","one of the smartest sea animals"],
    ["polar bear","🐻‍❄️","swim","10 hours without stopping","a super strong swimmer"],
    ["camel",     "🐫", "go without water","15 days","a desert survivor"],
    ["giraffe",   "🦒", "stand","5.5 m tall","the tallest animal in the world"],
    ["bee",       "🐝", "flap wings","230 times a second","a busy little pollinator"],
    ["shark",     "🦈", "smell blood","from 5 km away","a top ocean hunter"],
    ["eagle",     "🦅", "see","up to 3 km away","known for its sharp eyesight"]
  ];
  const babyNames = [
    ["cat","kitten","🐱"], ["dog","puppy","🐶"], ["lion","cub","🦁"], ["horse","foal","🐴"],
    ["cow","calf","🐄"], ["goat","kid","🐐"], ["sheep","lamb","🐑"], ["bear","cub","🐻"],
    ["deer","fawn","🦌"], ["duck","duckling","🦆"], ["chicken","chick","🐤"], ["kangaroo","joey","🦘"],
    ["butterfly","caterpillar","🐛"], ["frog","tadpole","🐸"], ["elephant","calf","🐘"], ["swan","cygnet","🦢"],
    ["rabbit","kit","🐇"], ["fox","kit","🦊"], ["owl","owlet","🦉"], ["eagle","eaglet","🦅"],
    ["seal","pup","🦭"], ["whale","calf","🐳"], ["giraffe","calf","🦒"], ["hippopotamus","calf","🦛"],
    ["tiger","cub","🐅"], ["turkey","poult","🦃"], ["pigeon","squab","🐦"], ["pig","piglet","🐖"]
  ];
  const animalGroups = [
    ["lions","pride","🦁"], ["wolves","pack","🐺"], ["bees","swarm","🐝"], ["fish","school","🐟"],
    ["cows","herd","🐄"], ["birds","flock","🐦"], ["crows","murder","🐦"], ["owls","parliament","🦉"],
    ["dolphins","pod","🐬"], ["whales","pod","🐳"], ["kittens","kindle","🐱"], ["puppies","litter","🐶"],
    ["ants","colony","🐜"], ["butterflies","kaleidoscope","🦋"], ["frogs","army","🐸"], ["giraffes","tower","🦒"],
    ["elephants","herd","🐘"], ["monkeys","troop","🐒"], ["rhinos","crash","🦏"], ["tigers","streak","🐅"],
    ["sheep","flock","🐑"], ["ducks","raft","🦆"], ["hens","brood","🐓"]
  ];
  const animalHabitats = [
    ["polar bear","🐻‍❄️","the Arctic ice"],
    ["camel","🐫","the desert"],
    ["monkey","🐒","the rainforest"],
    ["kangaroo","🦘","the Australian bush"],
    ["penguin","🐧","the icy Antarctic coast"],
    ["shark","🦈","the deep ocean"],
    ["squirrel","🐿️","forests and city parks"],
    ["lion","🦁","African grasslands (savanna)"],
    ["tiger","🐅","the jungles of Asia"],
    ["giraffe","🦒","the African savanna"],
    ["panda","🐼","bamboo forests in China"],
    ["koala","🐨","eucalyptus trees in Australia"],
    ["polar owl","🦉","the snowy Arctic tundra"],
    ["dolphin","🐬","warm oceans around the world"],
    ["elephant","🐘","African savannas and Asian forests"]
  ];
  function genAnimals(id) {
    const kind = id % 5;
    const s = Math.floor(id / 5);
    if (kind === 0) return animalsCurated[s % animalsCurated.length];
    if (kind === 1) {
      const d = animalDeeds[s % animalDeeds.length];
      return fact(d[1], `Meet the ${d[0][0].toUpperCase() + d[0].slice(1)}`,
        `The ${d[0]} can ${d[2]} at ${d[3]} — ${d[4]}!`);
    }
    if (kind === 2) {
      const b = babyNames[s % babyNames.length];
      return fact(b[2], `Baby ${b[0][0].toUpperCase() + b[0].slice(1)}`,
        `A baby ${b[0]} is called a ${b[1]}. Cute, isn't it?`);
    }
    if (kind === 3) {
      const g = animalGroups[s % animalGroups.length];
      return fact(g[2], `A ${g[1][0].toUpperCase() + g[1].slice(1)} of ${g[0][0].toUpperCase() + g[0].slice(1)}`,
        `A group of ${g[0]} is called a ${g[1]}. Nature has a special name for every group!`);
    }
    const h = animalHabitats[s % animalHabitats.length];
    return fact(h[1], `Where the ${h[0][0].toUpperCase() + h[0].slice(1)} Lives`,
      `The ${h[0]} lives in ${h[2]} — a habitat perfectly suited to it.`);
  }

  // ============================================================
  // SPACE
  // ============================================================
  const spaceCurated = [
    fact("🪐","Saturn Floats!","Saturn is so light that if there were a giant bathtub big enough, it would float in water."),
    fact("🌕","Moon Footprints","Footprints left by astronauts on the Moon could last 100 million years — there's no wind up there."),
    fact("☀️","Star Neighbour","The Sun is a star — the closest one to Earth, about 150 million km away."),
    fact("🌌","Milky Way","Our galaxy, the Milky Way, contains more than 100 billion stars."),
    fact("🪐","Jupiter's Storm","Jupiter has a giant storm called the Great Red Spot that has been raging for over 350 years."),
    fact("🌠","Shooting Stars","'Shooting stars' are actually tiny pieces of dust burning up in Earth's atmosphere."),
    fact("🛰️","ISS Speed","The International Space Station orbits Earth every 90 minutes at 28,000 km/h."),
    fact("🌌","Andromeda","The Andromeda Galaxy is heading toward the Milky Way and will merge with it in 4 billion years."),
    fact("🌞","Sun Colours","The Sun emits all colours of light — they mix to look white."),
    fact("🌚","Same Face","We always see the same side of the Moon because it rotates as it orbits Earth."),
    fact("💫","Neutron Star","A teaspoon of neutron-star material would weigh about a billion tons on Earth."),
    fact("🌟","Nearest Star","After the Sun, the closest star to us is Proxima Centauri, 4.24 light-years away."),
    fact("🪐","Mercury Days","One day on Mercury lasts about 59 Earth days!"),
    fact("🪐","Venus Days","A day on Venus is longer than its year — 243 Earth days vs 225!"),
    fact("♂️","Red Planet","Mars looks red because its soil is full of iron oxide — like rust."),
    fact("🌍","Blue Marble","Earth is called the 'Blue Marble' because oceans cover more than 70% of its surface."),
    fact("🪐","Saturn Rings","Saturn's rings are made mostly of ice, dust and rocks — some pieces as small as sugar."),
    fact("🌗","Moon Away","The Moon moves about 3.8 cm farther from Earth every year."),
    fact("🌌","Black Holes","A black hole's gravity is so strong that not even light can escape from it."),
    fact("🚀","Voyager 1","Voyager 1 is the farthest spacecraft — more than 24 billion km from Earth and still going."),
    fact("🛰️","Hubble Eye","The Hubble Space Telescope has orbited Earth since 1990 and taken over a million images."),
    fact("🔭","JWST","The James Webb Space Telescope can see stars that formed just after the Big Bang."),
    fact("🌑","New Moon","A 'new moon' is when the Moon is between Earth and the Sun — we can't see it."),
    fact("🌒","Moon Phases","The Moon goes through 8 phases every month — from new to full and back."),
    fact("🌟","Star Deaths","When giant stars die, they explode as supernovae — briefly outshining whole galaxies."),
    fact("💫","Galaxies","There are more galaxies in the universe than grains of sand on all of Earth's beaches."),
    fact("🌍","Rotating Fast","Earth spins at about 1,670 km/h at the equator — we don't feel it because we spin with it."),
    fact("🌏","Time Zones","Earth has 24 time zones — one for each hour of Earth's daily spin."),
    fact("🛰️","Space Junk","There are more than 30,000 pieces of space debris being tracked around Earth."),
    fact("👨‍🚀","Yuri Gagarin","Yuri Gagarin became the first person in space on 12 April 1961."),
    fact("🧑‍🚀","Neil Armstrong","On 20 July 1969, Neil Armstrong became the first person to walk on the Moon."),
    fact("🇮🇳","Chandrayaan-3","In 2023, India's Chandrayaan-3 became the first mission to land near the Moon's south pole."),
    fact("🛸","Aditya-L1","India's Aditya-L1 mission (2023) studies the Sun from space."),
    fact("🌟","Sirius","Sirius is the brightest star in Earth's night sky — over 8 light-years away."),
    fact("🌠","Meteor Shower","During a big meteor shower you can see 50–100 shooting stars every hour!"),
    fact("🪐","Uranus Tilt","Uranus is tilted almost on its side — it rolls around the Sun like a ball!"),
    fact("🌊","Ocean on Europa","Jupiter's moon Europa may have a huge ocean under its icy surface."),
    fact("🔥","Hottest Planet","Venus is the hottest planet, with surface temperatures around 460°C — hot enough to melt lead."),
    fact("❄️","Coldest Planet","Neptune is the coldest planet, with average temperatures around −214°C."),
    fact("🌈","Auroras","The Northern and Southern Lights (auroras) are caused by solar wind hitting Earth's atmosphere.")
  ];
  const planetsData = [
    ["Mercury","🪐","1st","closest to the Sun","zero moons","88 days"],
    ["Venus","🪐","2nd","hottest planet","zero moons","225 days"],
    ["Earth","🌍","3rd","our home","one moon","365 days"],
    ["Mars","♂️","4th","the red planet","two moons","687 days"],
    ["Jupiter","🪐","5th","the largest planet","95 moons","12 Earth years"],
    ["Saturn","🪐","6th","famous for its rings","146 moons","29 Earth years"],
    ["Uranus","🪐","7th","tilted on its side","27 moons","84 Earth years"],
    ["Neptune","🪐","8th","farthest from the Sun","14 moons","165 Earth years"]
  ];
  const constellations = [
    ["Orion","🌟","the mighty hunter"],
    ["Ursa Major","🌌","the Great Bear, home of the Big Dipper"],
    ["Ursa Minor","🌌","the Little Bear, holding the North Star"],
    ["Cassiopeia","👑","the queen shaped like a 'W'"],
    ["Leo","🦁","the lion of the zodiac"],
    ["Taurus","🐂","the bull, with the bright star Aldebaran"],
    ["Gemini","👯","the twins Castor and Pollux"],
    ["Scorpius","🦂","the scorpion, home to the star Antares"],
    ["Sagittarius","🏹","the archer aiming at the centre of the galaxy"],
    ["Andromeda","👸","the princess, with a whole galaxy named after her"],
    ["Pegasus","🐎","the flying horse"],
    ["Cygnus","🦢","the swan, flying along the Milky Way"],
    ["Aquila","🦅","the eagle, home to the bright star Altair"],
    ["Lyra","🎵","the little harp, with the bright star Vega"],
    ["Draco","🐉","the dragon coiling around the North Pole"]
  ];
  const missions = [
    ["Apollo 11","🚀","landed the first humans on the Moon in 1969"],
    ["Sputnik 1","🛰️","was the first artificial satellite, launched in 1957"],
    ["Voyager 1","🚀","is the farthest human-made object from Earth"],
    ["Voyager 2","🚀","is the only spacecraft to visit Uranus and Neptune"],
    ["Hubble","🛰️","has orbited Earth since 1990, taking amazing photos"],
    ["Cassini","🛰️","spent 13 years studying Saturn and its moons"],
    ["Curiosity","🤖","is a NASA rover exploring Mars since 2012"],
    ["Perseverance","🤖","landed on Mars in 2021 with a tiny helicopter"],
    ["Chandrayaan-1","🇮🇳","was India's first mission to the Moon, in 2008"],
    ["Chandrayaan-2","🇮🇳","orbited the Moon and searched for water ice"],
    ["Chandrayaan-3","🇮🇳","landed near the Moon's south pole in 2023"],
    ["Mangalyaan","🇮🇳","made India the first country to reach Mars orbit on its first try"],
    ["JWST","🔭","is the biggest space telescope ever built"],
    ["ISS","🛰️","is a space station where astronauts live and work together"],
    ["New Horizons","🚀","flew past Pluto in 2015 and sent us the first close-up photos"]
  ];
  function genSpace(id) {
    const kind = id % 5;
    const s = Math.floor(id / 5);
    if (kind === 0) return spaceCurated[s % spaceCurated.length];
    if (kind === 1) {
      const p = planetsData[s % planetsData.length];
      return fact(p[1], `${p[0]} — Planet Facts`,
        `${p[0]} is the ${p[2]} planet from the Sun and is ${p[3]}. It has ${p[4]}, and takes ${p[5]} to orbit the Sun.`);
    }
    if (kind === 2) {
      const c = constellations[s % constellations.length];
      return fact(c[1], `Constellation: ${c[0]}`,
        `${c[0]} is ${c[2]}. Look up on a clear night and you might spot it!`);
    }
    if (kind === 3) {
      const m = missions[s % missions.length];
      return fact(m[1], m[0], `${m[0]} ${m[2]}. Every mission teaches us more about space.`);
    }
    return spaceCurated[(s + 7) % spaceCurated.length];
  }

  // ============================================================
  // CULTURES (from around the world)
  // ============================================================
  const culturesCurated = [
    // --- India ---
    fact("🕌","Taj Mahal — India","The Taj Mahal changes colour with the light — pink at dawn, white by day, gold under a full moon."),
    fact("🕉️","Yoga — India","Yoga was born in India thousands of years ago and is now practised worldwide."),
    fact("♟️","Chess — India","Chess was invented in India — it was originally called 'Chaturanga'."),
    fact("🔢","The Number Zero — India","The number zero and the decimal system were developed in ancient India."),
    fact("🎬","Bollywood — India","India makes more films than any other country — Bollywood alone produces hundreds a year."),
    fact("🎨","Rangoli — India","People in India draw colourful rangoli patterns on doorsteps to welcome guests."),
    fact("🕉️","Diwali — India","During Diwali, homes light up with diyas, candles, and firework displays."),
    fact("🎏","Holi — India","On Holi, friends and family throw coloured powders — everyone becomes a rainbow!"),
    fact("🍛","Biryani — India","Biryani, a fragrant rice dish, comes in many regional styles across India."),
    fact("🥁","Tabla — India","The tabla is a pair of hand drums central to Indian classical music."),
    fact("🎭","Kathakali — India","Kathakali is a classical dance from Kerala known for its colourful makeup and costumes."),
    fact("🎨","22 Languages — India","India has 22 officially recognised languages and hundreds of dialects."),

    // --- Japan ---
    fact("🌸","Cherry Blossoms — Japan","In Japan, families gather under blooming cherry trees for hanami — the flower-viewing tradition."),
    fact("🎋","Origami — Japan","Origami is the Japanese art of folding paper into shapes like cranes and flowers."),
    fact("🍣","Sushi — Japan","Sushi is a Japanese dish of vinegar rice topped or rolled with fish or vegetables."),
    fact("👘","Kimono — Japan","The kimono is a traditional Japanese garment tied with a wide belt called an obi."),
    fact("⛩️","Torii Gates — Japan","Torii gates mark the entrance to sacred Shinto shrines all over Japan."),
    fact("🎎","Hina Matsuri — Japan","Japan's Doll Festival celebrates girls by displaying beautiful traditional dolls."),
    fact("🍵","Tea Ceremony — Japan","The Japanese tea ceremony is a slow, mindful ritual of preparing and sharing matcha."),
    fact("🗻","Mount Fuji — Japan","Mount Fuji is Japan's tallest mountain and a symbol of the country's spirit."),

    // --- China ---
    fact("🐉","Dragons — China","In Chinese culture, dragons are symbols of power, strength, and good luck — not danger!"),
    fact("🥢","Chopsticks — East Asia","Chopsticks are used across China, Japan, Korea and Vietnam for eating meals."),
    fact("🎇","Chinese New Year — China","Chinese New Year is celebrated for 15 days with red decorations and lion dances."),
    fact("🥟","Dumplings — China","Dumplings are eaten in China for luck — their shape looks like ancient gold ingots!"),
    fact("🖌️","Calligraphy — China","Chinese calligraphy is a beautiful art of writing characters with an ink brush."),
    fact("🎋","Bamboo — China","Bamboo is a symbol of strength and flexibility in Chinese culture."),

    // --- Korea ---
    fact("🥋","Taekwondo — Korea","Taekwondo is a Korean martial art known for its powerful high kicks."),
    fact("🍚","Kimchi — Korea","Kimchi is a spicy fermented cabbage dish eaten with almost every Korean meal."),
    fact("👘","Hanbok — Korea","The hanbok is the traditional Korean dress, worn during holidays and celebrations."),
    fact("🎵","K-pop — South Korea","K-pop is Korean pop music that has become popular all over the world."),

    // --- Thailand ---
    fact("🐘","Thai Elephants — Thailand","Elephants are Thailand's national animal and appear on many temples and flags."),
    fact("🌶️","Pad Thai — Thailand","Pad Thai is Thailand's famous stir-fried noodle dish."),
    fact("🙏","Wai Greeting — Thailand","In Thailand, people greet each other with the 'wai' — hands together and a small bow."),

    // --- Vietnam ---
    fact("🍜","Pho — Vietnam","Pho is a Vietnamese noodle soup made with fragrant broth and fresh herbs."),
    fact("👘","Ao Dai — Vietnam","The ao dai is Vietnam's flowing silk dress worn over trousers."),

    // --- Egypt & Middle East ---
    fact("🐫","Camels — Egypt","Camels have crossed Egypt's deserts for thousands of years."),
    fact("🏺","Hieroglyphs — Ancient Egypt","Ancient Egyptians used picture symbols called hieroglyphs to write."),
    fact("👑","Pharaohs — Ancient Egypt","Ancient Egypt was ruled by kings and queens called pharaohs."),
    fact("🕌","Mosques — Middle East","Beautiful mosques with tall minarets are landmarks all across the Middle East."),
    fact("🫖","Mint Tea — Morocco","In Morocco, sweet mint tea is served to guests as a sign of hospitality."),
    fact("🧿","Nazar — Turkey","The blue Nazar eye is a Turkish charm believed to protect people from bad luck."),
    fact("🍬","Turkish Delight — Turkey","Turkish delight, a sweet chewy candy, has been enjoyed for over 500 years."),
    fact("🕌","Hagia Sophia — Turkey","Istanbul's Hagia Sophia has been a church, a mosque, and a museum in its long life."),
    fact("🌸","Nowruz — Iran","Nowruz, the Persian New Year, is celebrated on the spring equinox with a special table called haft-sin."),
    fact("🧵","Persian Carpets — Iran","Persian carpets have been woven in Iran for over 2,500 years."),

    // --- Greece ---
    fact("🏛️","Democracy — Greece","Ancient Greeks invented democracy — the idea that people should choose their leaders."),
    fact("🫒","Olive Trees — Greece","Some Greek olive trees are over 2,000 years old and still give fruit!"),
    fact("💃","Sirtaki — Greece","Sirtaki is a famous Greek folk dance performed in a line with linked hands."),
    fact("🥙","Souvlaki — Greece","Souvlaki, grilled meat on a skewer, is a beloved Greek street food."),

    // --- Italy ---
    fact("🍕","Pizza — Italy","Pizza was born in Naples, Italy, in the late 1800s."),
    fact("🍝","Pasta — Italy","Italy has over 350 different pasta shapes — each best for a different sauce!"),
    fact("🎨","Renaissance — Italy","The Renaissance began in Italy — a burst of art, science and discovery."),
    fact("🎭","Venice Masks — Italy","Venice is famous for its colourful masks worn during Carnival."),
    fact("🚤","Venice — Italy","Venice is a city built on 118 tiny islands, connected by more than 400 bridges."),

    // --- Spain ---
    fact("💃","Flamenco — Spain","Flamenco is a passionate Spanish dance with clapping, stomping and guitars."),
    fact("🥘","Paella — Spain","Paella is a Spanish rice dish cooked in a big pan with saffron and seafood."),
    fact("⛪","Sagrada Família — Spain","Barcelona's Sagrada Família has been under construction since 1882."),
    fact("🎨","Picasso — Spain","Pablo Picasso, one of the most famous painters ever, was Spanish."),

    // --- France ---
    fact("🥖","Baguette — France","Over 6 billion baguettes are eaten in France every year."),
    fact("🥐","Croissant — France","The buttery, flaky croissant is a classic French breakfast."),
    fact("🗼","Eiffel Tower — France","The Eiffel Tower in Paris was built in 1889 and sparkles for 5 minutes every hour after dark."),
    fact("🎨","Louvre — France","The Louvre in Paris is the world's largest art museum — home to the Mona Lisa."),
    fact("🧀","Cheese — France","France makes over 1,200 different types of cheese!"),

    // --- Germany ---
    fact("🥨","Pretzel — Germany","The twisty pretzel is a classic German snack, said to be invented by monks long ago."),
    fact("🏰","Neuschwanstein — Germany","Germany's Neuschwanstein Castle inspired Disney's Sleeping Beauty Castle."),
    fact("🎡","Oktoberfest — Germany","Munich's Oktoberfest is the world's largest folk festival, held every autumn."),

    // --- UK & Ireland ---
    fact("🫖","Afternoon Tea — UK","In the UK, afternoon tea with tiny sandwiches and cakes is a beloved tradition."),
    fact("🚌","Red Buses — UK","London's famous red double-decker buses have carried passengers since 1907."),
    fact("👑","Royal Family — UK","The British Royal Family has ruled for over 1,000 years."),
    fact("🕰️","Big Ben — UK","Big Ben is the nickname for the giant bell inside London's Elizabeth Tower."),
    fact("🍀","Shamrock — Ireland","The shamrock, a three-leaf clover, is Ireland's national symbol."),
    fact("💃","Irish Dance — Ireland","Irish dance is famous for its fast footwork while the upper body stays perfectly still."),

    // --- Russia & Eastern Europe ---
    fact("🪆","Matryoshka Dolls — Russia","Russian matryoshka dolls nest inside each other — often five or more layers deep."),
    fact("🩰","Ballet — Russia","Russia is home to some of the world's most famous ballet companies."),
    fact("🍲","Borscht — Ukraine/Russia","Borscht is a bright red beetroot soup loved in Ukraine and Russia."),
    fact("🏰","Kremlin — Russia","Moscow's Kremlin is a huge fortress with colourful onion-domed churches inside."),

    // --- USA & Canada ---
    fact("🗽","Statue of Liberty — USA","The Statue of Liberty was a gift from France to the USA in 1886."),
    fact("🍔","Hamburger — USA","The hamburger became famous in the USA in the early 1900s."),
    fact("🎷","Jazz — USA","Jazz music was born in New Orleans, Louisiana, around the early 1900s."),
    fact("🎬","Hollywood — USA","Hollywood in Los Angeles has been the centre of American filmmaking for over 100 years."),
    fact("🦃","Thanksgiving — USA","Every November, Americans share a big family meal to give thanks."),
    fact("🍁","Maple Syrup — Canada","Canada produces about 70% of the world's maple syrup."),
    fact("🏒","Ice Hockey — Canada","Ice hockey is Canada's national winter sport."),
    fact("🐻","Beaver — Canada","The beaver is Canada's national animal — an amazing dam builder."),

    // --- Mexico & Latin America ---
    fact("🌮","Tacos — Mexico","Tacos have been eaten in Mexico for thousands of years."),
    fact("💐","Day of the Dead — Mexico","Mexico's Día de los Muertos honours family with colourful altars and marigold flowers."),
    fact("🎸","Mariachi — Mexico","Mariachi bands play lively Mexican music with trumpets, violins and guitars."),
    fact("🎨","Frida Kahlo — Mexico","Frida Kahlo is one of Mexico's most famous painters."),

    // --- Brazil, Argentina, Peru ---
    fact("⚽","Football — Brazil","Brazil has won the FIFA World Cup 5 times — more than any other country."),
    fact("💃","Samba — Brazil","Samba is a lively Brazilian dance and music style, big at Rio's Carnival."),
    fact("🌳","Amazon — Brazil","Brazil is home to most of the Amazon — the largest rainforest on Earth."),
    fact("💃","Tango — Argentina","Tango, born in Argentina, is a passionate partner dance played with an accordion."),
    fact("🥩","Asado — Argentina","Asado is Argentine barbecue — grilled meats shared with family and friends."),
    fact("🏔️","Machu Picchu — Peru","Machu Picchu, high in the Andes, was built by the Inca people in the 1400s."),
    fact("🦙","Llamas — Peru","Llamas and alpacas are native to Peru and used for wool, transport and company."),

    // --- Africa ---
    fact("🦁","Safaris — Kenya","Kenya is famous for its wildlife safaris in parks like the Maasai Mara."),
    fact("🎨","Maasai — Kenya","The Maasai people of Kenya are known for colourful beaded jewellery and jumping dances."),
    fact("🌈","Rainbow Nation — South Africa","South Africa is called the 'Rainbow Nation' because so many cultures live together there."),
    fact("🥁","Djembe Drums — West Africa","The djembe drum from West Africa is played by tapping different parts of the drum-head."),
    fact("🎵","Afrobeats — Nigeria","Afrobeats, born in Nigeria, has become one of the most popular music styles in the world."),
    fact("🍚","Jollof Rice — West Africa","Jollof rice is a beloved West African dish — countries argue over who makes it best!"),
    fact("☕","Coffee — Ethiopia","Ethiopia is the birthplace of coffee — and drinking it is a special ceremony."),
    fact("🥞","Injera — Ethiopia","Injera is a spongy Ethiopian flatbread used to scoop up stews with your hands."),

    // --- Australia & New Zealand ---
    fact("🦘","Kangaroos — Australia","Kangaroos, native to Australia, can jump up to 3 metres high."),
    fact("🎨","Aboriginal Art — Australia","Aboriginal Australian art often uses dots and symbols to tell Dreamtime stories."),
    fact("🪃","Boomerang — Australia","The boomerang, invented by Aboriginal Australians, is a curved throwing tool."),
    fact("🏔️","Uluru — Australia","Uluru is a huge sacred red rock at the heart of Australia."),
    fact("🥝","Kiwi — New Zealand","The kiwi is a small flightless bird and the national symbol of New Zealand."),
    fact("👣","Haka — New Zealand","The Māori haka is a powerful ceremonial dance performed by New Zealand's rugby team."),

    // --- Netherlands, Nordics ---
    fact("🌷","Tulips — Netherlands","The Netherlands produces about 3 billion tulip bulbs every year."),
    fact("🚴","Bicycles — Netherlands","In the Netherlands, there are more bicycles than people!"),
    fact("💨","Windmills — Netherlands","Dutch windmills have been pumping water and grinding grain for centuries."),
    fact("☕","Fika — Sweden","Fika is Sweden's beloved coffee-and-cake break enjoyed twice a day."),
    fact("🎈","Midsummer — Sweden","Swedes celebrate Midsummer with flower crowns and dancing around a maypole."),
    fact("🎅","Julenisse — Norway","In Norway, a friendly gnome called Nisse brings gifts at Christmas."),
    fact("🧀","Cheese Markets — Netherlands","Dutch cheese markets sell giant wheels of Gouda and Edam."),

    // --- SE Asia & more ---
    fact("🌋","Bali — Indonesia","Indonesia has more than 17,000 islands — Bali is one of the most famous."),
    fact("🍚","Nasi Goreng — Indonesia","Nasi Goreng, Indonesia's national dish, is fried rice with spices and egg."),
    fact("🍜","Adobo — Philippines","Adobo is the Philippines' beloved dish of meat cooked in vinegar and soy sauce."),
    fact("🍚","Nasi Lemak — Malaysia","Nasi lemak is Malaysia's coconut-rice dish, often served on a banana leaf."),
    fact("🍔","Falafel — Middle East","Falafel — fried chickpea balls — is a favourite street food across the Middle East.")
  ];

  const cultureCountries = [
    // country, capital, icon, greeting, food
    ["Japan","Tokyo","🇯🇵","Konnichiwa (hello)","sushi and ramen"],
    ["China","Beijing","🇨🇳","Nǐ hǎo (hello)","dumplings and noodles"],
    ["India","New Delhi","🇮🇳","Namaste","biryani and dosa"],
    ["Thailand","Bangkok","🇹🇭","Sawadee","pad thai and mango sticky rice"],
    ["Vietnam","Hanoi","🇻🇳","Xin chào","pho and banh mi"],
    ["South Korea","Seoul","🇰🇷","Annyeonghaseyo","kimchi and bibimbap"],
    ["Italy","Rome","🇮🇹","Ciao","pizza and pasta"],
    ["France","Paris","🇫🇷","Bonjour","croissants and cheese"],
    ["Spain","Madrid","🇪🇸","Hola","paella and churros"],
    ["Germany","Berlin","🇩🇪","Hallo","pretzels and sausages"],
    ["United Kingdom","London","🇬🇧","Hello","fish and chips"],
    ["Ireland","Dublin","🇮🇪","Dia dhuit","Irish stew and soda bread"],
    ["Russia","Moscow","🇷🇺","Privet","borscht and pelmeni"],
    ["Turkey","Ankara","🇹🇷","Merhaba","kebabs and baklava"],
    ["Greece","Athens","🇬🇷","Yassou","souvlaki and moussaka"],
    ["Egypt","Cairo","🇪🇬","Marhaba","koshari and falafel"],
    ["Morocco","Rabat","🇲🇦","Salam","couscous and tagine"],
    ["Nigeria","Abuja","🇳🇬","Bawo","jollof rice and puff-puff"],
    ["Ethiopia","Addis Ababa","🇪🇹","Selam","injera and doro wat"],
    ["Kenya","Nairobi","🇰🇪","Jambo","ugali and nyama choma"],
    ["South Africa","Pretoria","🇿🇦","Sawubona","biltong and bunny chow"],
    ["USA","Washington DC","🇺🇸","Hi","burgers and apple pie"],
    ["Canada","Ottawa","🇨🇦","Hi / Bonjour","poutine and maple syrup"],
    ["Mexico","Mexico City","🇲🇽","Hola","tacos and enchiladas"],
    ["Brazil","Brasília","🇧🇷","Olá","feijoada and pão de queijo"],
    ["Argentina","Buenos Aires","🇦🇷","Hola","asado and empanadas"],
    ["Peru","Lima","🇵🇪","Hola","ceviche and lomo saltado"],
    ["Australia","Canberra","🇦🇺","G'day","meat pies and Vegemite"],
    ["New Zealand","Wellington","🇳🇿","Kia ora","pavlova and fish and chips"],
    ["Indonesia","Jakarta","🇮🇩","Halo","nasi goreng and satay"],
    ["Philippines","Manila","🇵🇭","Kumusta","adobo and lumpia"],
    ["Malaysia","Kuala Lumpur","🇲🇾","Selamat","nasi lemak and roti canai"],
    ["Netherlands","Amsterdam","🇳🇱","Hallo","stroopwafels and Gouda cheese"],
    ["Sweden","Stockholm","🇸🇪","Hej","meatballs and cinnamon buns"],
    ["Norway","Oslo","🇳🇴","Hei","salmon and brown cheese"],
    ["Denmark","Copenhagen","🇩🇰","Hej","smørrebrød and pastries"],
    ["Finland","Helsinki","🇫🇮","Terve","salmon soup and rye bread"],
    ["Portugal","Lisbon","🇵🇹","Olá","pastel de nata and bacalhau"],
    ["Iran","Tehran","🇮🇷","Salam","kebabs and Persian rice"],
    ["Israel","Jerusalem","🇮🇱","Shalom","hummus and shakshuka"],
    ["Saudi Arabia","Riyadh","🇸🇦","As-salamu alaykum","kabsa and dates"]
  ];

  const worldDances = [
    ["Flamenco","💃","Spain","a passionate dance with clapping and stomping"],
    ["Salsa","💃","Cuba","a lively Latin dance with quick footwork"],
    ["Tango","💃","Argentina","a dramatic partner dance"],
    ["Samba","💃","Brazil","a joyful carnival dance"],
    ["Ballet","🩰","France & Russia","a graceful classical dance on the tips of the toes"],
    ["Bharatanatyam","💃","India","one of the oldest classical dances, from Tamil Nadu"],
    ["Kathakali","🎭","India","a Kerala dance with elaborate makeup and costumes"],
    ["Hula","🌺","Hawaii","a flowing dance that tells stories with hand movements"],
    ["Haka","👣","New Zealand","a fierce Māori ceremonial dance"],
    ["Irish Step","💃","Ireland","famous for fast footwork with still upper body"],
    ["Belly Dance","💃","the Middle East","a graceful dance with hip movements"],
    ["Break Dance","🕺","USA","a street dance with spins and freezes"],
    ["Bhangra","💃","Punjab, India","an energetic harvest dance with dhol drums"],
    ["Sirtaki","💃","Greece","a joyful line dance with linked hands"],
    ["Waltz","💃","Austria","an elegant ballroom dance in 3/4 time"],
    ["Capoeira","🥋","Brazil","part martial-art, part dance"]
  ];

  const worldClothing = [
    ["kimono","👘","Japan"],
    ["hanbok","👘","South Korea"],
    ["sari","👗","India"],
    ["kilt","🩳","Scotland"],
    ["lederhosen","🩳","Bavaria (Germany)"],
    ["ao dai","👘","Vietnam"],
    ["dirndl","👗","Austria & Bavaria"],
    ["cheongsam / qipao","👗","China"],
    ["dashiki","👕","West Africa"],
    ["kaftan","👘","North Africa & the Middle East"],
    ["poncho","🧥","Peru & Mexico"],
    ["dhoti","👘","India"],
    ["sombrero","🤠","Mexico"],
    ["beret","👒","France"],
    ["turban","🧕","many South Asian & Middle Eastern cultures"]
  ];

  const worldGreetings = [
    ["Namaste","🙏","Hindi","India"],
    ["Konnichiwa","🎌","Japanese","Japan"],
    ["Bonjour","🇫🇷","French","France"],
    ["Hola","🇪🇸","Spanish","Spain and Latin America"],
    ["Ciao","🇮🇹","Italian","Italy"],
    ["Hallo","🇩🇪","German","Germany"],
    ["Ni hao","🇨🇳","Mandarin","China"],
    ["Annyeonghaseyo","🇰🇷","Korean","South Korea"],
    ["Sawadee","🇹🇭","Thai","Thailand"],
    ["Xin chào","🇻🇳","Vietnamese","Vietnam"],
    ["Salam","🌙","Arabic","many Arabic-speaking countries"],
    ["Shalom","🕎","Hebrew","Israel"],
    ["Jambo","🇰🇪","Swahili","Kenya and East Africa"],
    ["Olá","🇵🇹","Portuguese","Portugal and Brazil"],
    ["Merhaba","🇹🇷","Turkish","Turkey"],
    ["Privet","🇷🇺","Russian","Russia"],
    ["Kia ora","🇳🇿","Māori","New Zealand"],
    ["G'day","🇦🇺","Australian English","Australia"]
  ];

  function genCultures(id) {
    const kind = id % 5;
    const s = Math.floor(id / 5);
    if (kind === 0 || kind === 1) {
      return culturesCurated[s % culturesCurated.length];
    }
    if (kind === 2) {
      const c = cultureCountries[s % cultureCountries.length];
      return fact(c[2], `${c[0]}`,
        `The capital of ${c[0]} is ${c[1]}. People often say "${c[3]}" and enjoy ${c[4]}.`);
    }
    if (kind === 3) {
      const d = worldDances[s % worldDances.length];
      return fact(d[1], `${d[0]} — ${d[2]}`,
        `${d[0]} is ${d[3]}, a beloved dance in ${d[2]}.`);
    }
    if (kind === 4) {
      // alternate: greetings and traditional clothing
      if ((s % 2) === 0) {
        const g = worldGreetings[Math.floor(s / 2) % worldGreetings.length];
        return fact(g[1], `Say "${g[0]}"`,
          `"${g[0]}" means hello in ${g[2]}, spoken in ${g[3]}.`);
      } else {
        const w = worldClothing[Math.floor(s / 2) % worldClothing.length];
        return fact(w[1], `Traditional dress: ${w[0]}`,
          `The ${w[0]} is a traditional garment from ${w[2]}.`);
      }
    }
    return culturesCurated[(s + 3) % culturesCurated.length];
  }

  // ============================================================
  // SPORTS
  // ============================================================
  const sportsCurated = [
    fact("🏏","Cricket Craze","Cricket is the most-watched sport in India, and a Test match can last up to 5 days."),
    fact("🏸","Badminton Speed","A shuttlecock can travel over 400 km/h — faster than a race car!"),
    fact("⚽","World's Game","Football is played by more than 250 million people in over 200 countries."),
    fact("🏀","Basketball Basics","A basketball game has 4 quarters, and each team tries to score into the opponent's hoop."),
    fact("🎾","Tennis Grand Slams","The four Grand Slam tournaments are Australian Open, French Open, Wimbledon and US Open."),
    fact("🏓","Table Tennis","Table tennis was invented in England in the 1880s as an indoor version of lawn tennis."),
    fact("🏊","Swimming","Swimming is one of the healthiest full-body exercises — it works almost every muscle."),
    fact("🏃","Marathon Distance","A marathon is 42.195 km long — the distance from Marathon to Athens in ancient Greece."),
    fact("⛷️","Winter Games","The Winter Olympics have events like skiing, snowboarding and ice skating."),
    fact("🏅","Olympic Rings","The five Olympic rings represent the five inhabited continents."),
    fact("🥇","First Olympics","The ancient Olympic Games were first held in 776 BC in Olympia, Greece."),
    fact("🏋️","Weightlifting","Weightlifting has two main lifts: the snatch and the clean & jerk."),
    fact("🚴","Tour de France","The Tour de France is the most famous cycling race — over 3,500 km every summer."),
    fact("🥊","Boxing Rounds","Professional boxing matches are usually 12 rounds of 3 minutes each."),
    fact("🏹","Archery","Archery is one of the oldest sports, once used for hunting and defence."),
    fact("🏐","Volleyball","In volleyball, each team is allowed only 3 touches before the ball must go over the net."),
    fact("⛳","Golf","A golf hole in one is very rare — the odds are about 12,000 to 1 for amateurs."),
    fact("🥍","Lacrosse","Lacrosse was invented by Native Americans and is one of North America's oldest sports."),
    fact("🥋","Judo","Judo means 'the gentle way' — it uses balance and leverage, not brute strength."),
    fact("🥊","Muhammad Ali","Muhammad Ali, 'the Greatest', won the world heavyweight boxing title three times."),
    fact("🏏","Sachin Tendulkar","Sachin Tendulkar is the only cricketer to score 100 international centuries."),
    fact("🎾","Serena Williams","Serena Williams has won 23 Grand Slam singles titles."),
    fact("⚽","Pelé","Pelé won 3 FIFA World Cups with Brazil — no other player has ever done that."),
    fact("⚽","Messi & Ronaldo","Messi and Ronaldo have won the Ballon d'Or (best player) more than 10 times combined."),
    fact("🏀","Michael Jordan","Michael Jordan won 6 NBA Championships and never lost a Finals series."),
    fact("🏊","Michael Phelps","Michael Phelps has 23 Olympic gold medals — the most of any athlete ever."),
    fact("🏃","Usain Bolt","Usain Bolt is the fastest man ever recorded — 100m in 9.58 seconds."),
    fact("🏸","P. V. Sindhu","P. V. Sindhu was the first Indian woman to win an Olympic silver in badminton (2016)."),
    fact("🥊","Mary Kom","Mary Kom is a 6-time World Amateur Boxing Champion from India."),
    fact("🏹","Deepika Kumari","Deepika Kumari is one of India's most successful archers."),
    fact("🏑","Hockey Gold","India has won 8 Olympic gold medals in field hockey — the most by any country."),
    fact("🏏","India Cricket 1983","India first won the Cricket World Cup in 1983 under Kapil Dev."),
    fact("🏏","MS Dhoni","MS Dhoni led India to win the T20 World Cup in 2007 and the ODI World Cup in 2011."),
    fact("🚵","Mountain Biking","Mountain biking became an Olympic sport at the 1996 Atlanta Games."),
    fact("🏄","Surfing","Surfing was added to the Olympics for the first time in 2020 in Tokyo."),
    fact("🛹","Skateboarding","Skateboarding also debuted at the Tokyo 2020 Olympics."),
    fact("🏓","Ping-Pong Diplomacy","In 1971, US and Chinese table-tennis teams met and helped ease tensions between the two countries."),
    fact("⚾","Baseball","In baseball, hitting the ball out of the park counts as a 'home run'."),
    fact("🏈","American Football","The Super Bowl final is one of the most-watched TV events every year."),
    fact("🥅","Football Goals","A standard football goal is 7.32 m wide and 2.44 m tall.")
  ];
  const sportsCountries = [
    ["Cricket","🏏","England","most popular in India, Australia and Pakistan"],
    ["Football","⚽","England","the world's most popular sport"],
    ["Kabaddi","🤼","India","a contact team sport where a raider tries to tag opponents"],
    ["Baseball","⚾","USA","hugely popular in America and Japan"],
    ["Ice Hockey","🏒","Canada","the national winter sport of Canada"],
    ["Table Tennis","🏓","England","dominated by China in modern times"],
    ["Sumo","🤼","Japan","Japan's traditional wrestling sport"],
    ["Taekwondo","🥋","Korea","a Korean martial art now in the Olympics"],
    ["Karate","🥋","Japan","a Japanese martial art focused on strikes"],
    ["Rugby","🏉","England","played mostly in England, Australia, New Zealand and South Africa"],
    ["Basketball","🏀","USA","invented by Dr. James Naismith in 1891"],
    ["Handball","🤾","Denmark","a fast indoor team sport in Europe"],
    ["Chess","♟️","India","Chess was born in India as 'Chaturanga'"],
    ["Polo","🐎","Persia (Iran)","a horseback sport played with mallets"],
    ["Judo","🥋","Japan","means 'the gentle way'"],
    ["Cricket-2020","🏏","England","the T20 format was created in 2003 in England"]
  ];
  const sportsAthletes = [
    ["Sachin Tendulkar","🏏","cricket","India","scored 100 international centuries"],
    ["Virat Kohli","🏏","cricket","India","one of the most consistent batters ever"],
    ["MS Dhoni","🏏","cricket","India","captained India to World Cup wins"],
    ["Rohit Sharma","🏏","cricket","India","the only player with three ODI double centuries"],
    ["Sunil Chhetri","⚽","football","India","captain of India's football team, one of top international scorers"],
    ["P. V. Sindhu","🏸","badminton","India","two-time Olympic medallist"],
    ["Saina Nehwal","🏸","badminton","India","first Indian to win Olympic badminton bronze (2012)"],
    ["Mary Kom","🥊","boxing","India","6-time World Amateur Boxing Champion"],
    ["Vijender Singh","🥊","boxing","India","won India's first Olympic boxing medal (2008)"],
    ["Abhinav Bindra","🎯","shooting","India","won India's first individual Olympic gold in 2008"],
    ["Neeraj Chopra","🥇","javelin","India","won Olympic gold in javelin in Tokyo 2020"],
    ["Milkha Singh","🏃","athletics","India","known as the 'Flying Sikh'"],
    ["P. T. Usha","🏃","athletics","India","one of India's greatest track athletes"],
    ["Dhyan Chand","🏑","hockey","India","the 'Wizard of Hockey', 3-time Olympic gold medallist"],
    ["Kapil Dev","🏏","cricket","India","led India to its first Cricket World Cup in 1983"],
    ["Pelé","⚽","football","Brazil","only player to win 3 FIFA World Cups"],
    ["Diego Maradona","⚽","football","Argentina","led Argentina to the 1986 World Cup"],
    ["Lionel Messi","⚽","football","Argentina","won the FIFA World Cup in 2022"],
    ["Cristiano Ronaldo","⚽","football","Portugal","holds many international scoring records"],
    ["Michael Jordan","🏀","basketball","USA","won 6 NBA Championships"],
    ["LeBron James","🏀","basketball","USA","a 4-time NBA champion"],
    ["Serena Williams","🎾","tennis","USA","won 23 Grand Slam singles titles"],
    ["Roger Federer","🎾","tennis","Switzerland","held the men's Grand Slam record for many years"],
    ["Rafael Nadal","🎾","tennis","Spain","the 'King of Clay' — record French Open wins"],
    ["Novak Djokovic","🎾","tennis","Serbia","holds the record for most men's Grand Slams"],
    ["Michael Phelps","🏊","swimming","USA","23 Olympic gold medals"],
    ["Usain Bolt","🏃","sprinting","Jamaica","fastest man ever recorded"],
    ["Muhammad Ali","🥊","boxing","USA","3-time heavyweight world champion"]
  ];
  function genSports(id) {
    const kind = id % 4;
    const s = Math.floor(id / 4);
    if (kind === 0) return sportsCurated[s % sportsCurated.length];
    if (kind === 1) {
      const c = sportsCountries[s % sportsCountries.length];
      return fact(c[1], `${c[0]}`,
        `${c[0]} started in ${c[2]}. Today, it's ${c[3]}.`);
    }
    if (kind === 2) {
      const a = sportsAthletes[s % sportsAthletes.length];
      return fact(a[1], `${a[0]}`,
        `${a[0]} plays ${a[2]} for ${a[3]} — ${a[4]}.`);
    }
    return sportsCurated[(s + 3) % sportsCurated.length];
  }

  // ============================================================
  // FESTIVALS
  // ============================================================
  const festivalsCurated = [
    fact("🪔","Diwali","Diwali is India's festival of lights — homes glow with diyas and candles, and families share sweets."),
    fact("🎏","Holi","On Holi, people throw colourful powders on each other to welcome spring."),
    fact("🎄","Christmas","Christmas is celebrated on 25 December around the world with trees, gifts and songs."),
    fact("🌙","Eid al-Fitr","Eid al-Fitr marks the end of Ramadan — Muslims celebrate with feasts and prayers."),
    fact("🕎","Hanukkah","Hanukkah, the Jewish Festival of Lights, is celebrated over 8 nights with a menorah."),
    fact("🎃","Halloween","On Halloween (31 October), kids dress in costumes and go trick-or-treating for candy."),
    fact("🥮","Mid-Autumn Festival","China's Mid-Autumn Festival is celebrated with mooncakes under the full harvest moon."),
    fact("💃","Carnival","Rio's Carnival in Brazil is one of the biggest parties in the world, with samba dancing."),
    fact("🎋","Tanabata","Japan's Tanabata is the star festival — people write wishes on paper and tie them to bamboo."),
    fact("🌸","Hanami","In Japan, Hanami is the tradition of picnicking under blooming cherry blossoms."),
    fact("🌷","Songkran","Thailand's Songkran is the New Year festival — celebrated with a huge water fight!"),
    fact("🌊","Loi Krathong","Thailand's Loi Krathong sees people float candlelit baskets on rivers."),
    fact("🦁","Chinese New Year","Chinese New Year is celebrated with dragon dances, red decorations, and firecrackers."),
    fact("🌎","Day of the Dead","Mexico's Day of the Dead honours family and friends who have passed, with colourful altars."),
    fact("🎉","New Year's Eve","New Year's Eve on 31 December is celebrated worldwide with fireworks."),
    fact("🌺","Onam","Kerala's Onam harvest festival features flower carpets and grand boat races."),
    fact("🌾","Pongal","Tamil Nadu's Pongal thanks the Sun and farmers for the year's harvest."),
    fact("🌾","Baisakhi","Baisakhi, celebrated in Punjab, marks the harvest and Sikh New Year."),
    fact("🐘","Ganesh Chaturthi","Ganesh Chaturthi celebrates the elephant-headed god Ganesha, especially in Maharashtra."),
    fact("💃","Navratri","Navratri is nine nights of dance and worship, popular in Gujarat as Garba and Dandiya."),
    fact("🧵","Raksha Bandhan","On Raksha Bandhan, sisters tie a rakhi to brothers to celebrate their bond."),
    fact("🦚","Janmashtami","Janmashtami celebrates the birth of Lord Krishna with dance, music, and dahi handi."),
    fact("🌾","Bihu","Assam's Bihu celebrates the harvest and Assamese New Year."),
    fact("🔥","Lohri","Lohri is Punjab's bonfire festival celebrating the end of winter."),
    fact("🪁","Makar Sankranti","On Makar Sankranti, people fly colourful kites all over India."),
    fact("🎉","Vaisakhi","Vaisakhi is celebrated by Sikhs to mark the founding of the Khalsa in 1699."),
    fact("🕊️","Buddha Purnima","Buddha Purnima celebrates the birth of Gautama Buddha with prayers and lamps."),
    fact("🎉","Mahavir Jayanti","Mahavir Jayanti celebrates the birth of Lord Mahavir, founder of Jainism."),
    fact("🌟","Guru Nanak Jayanti","Guru Nanak Jayanti celebrates the birthday of Sikhism's founder."),
    fact("🎈","La Tomatina","La Tomatina in Spain is a giant tomato-throwing festival held every August."),
    fact("🐄","San Fermín","San Fermín in Spain is famous for the 'running of the bulls' in Pamplona."),
    fact("🎪","Oktoberfest","Munich's Oktoberfest is the world's largest beer and folk festival."),
    fact("🪘","Nowruz","Nowruz is the Persian New Year, welcoming spring in Iran and Central Asia."),
    fact("🌲","St. Patrick's Day","On St. Patrick's Day (17 March), people around the world dress in green."),
    fact("🍭","Easter","Easter is a Christian festival celebrated with eggs, bunnies and family meals."),
    fact("🐉","Duanwu (Dragon Boat)","China's Dragon Boat Festival features boat races and rice dumplings called zongzi."),
    fact("🎇","Bastille Day","France's Bastille Day (14 July) marks the start of the French Revolution."),
    fact("🎆","Independence Day USA","On 4 July, Americans celebrate their independence with fireworks and parades."),
    fact("🎇","Independence Day India","India celebrates Independence Day on 15 August with flag-hoisting ceremonies.")
  ];
  const countryFestivals = [
    ["Diwali","🪔","India","the festival of lights"],
    ["Holi","🎏","India","the festival of colours"],
    ["Eid","🌙","many Muslim countries","the celebration marking the end of Ramadan"],
    ["Christmas","🎄","many Christian countries","the celebration of the birth of Jesus"],
    ["Chinese New Year","🐉","China","a two-week new-year celebration"],
    ["Songkran","🌷","Thailand","a giant water-fight new-year festival"],
    ["Hanami","🌸","Japan","the cherry-blossom viewing tradition"],
    ["Tanabata","🎋","Japan","the star festival with paper wishes"],
    ["Carnival","💃","Brazil","a colourful parade festival in Rio"],
    ["La Tomatina","🍅","Spain","a massive tomato-throwing festival"],
    ["Oktoberfest","🎪","Germany","the world's biggest folk festival in Munich"],
    ["Day of the Dead","💀","Mexico","a festival honouring deceased loved ones"],
    ["Nowruz","🌸","Iran","the Persian New Year in spring"],
    ["Hanukkah","🕎","Israel","the Jewish Festival of Lights"],
    ["Halloween","🎃","USA & many countries","the costume-and-candy autumn festival"],
    ["St. Patrick's Day","🍀","Ireland","the festival of Ireland's patron saint"],
    ["Thanksgiving","🦃","USA","a family harvest festival in November"],
    ["Bastille Day","🎇","France","France's national day with fireworks"],
    ["Lantern Festival","🏮","China","the closing night of Chinese New Year"],
    ["Mid-Autumn Festival","🥮","China","the mooncake festival under the full moon"],
    ["Vesak","🕊️","many Buddhist countries","the celebration of Buddha's birth"],
    ["Bihu","🌾","India (Assam)","Assam's harvest and new-year festival"],
    ["Onam","🌺","India (Kerala)","Kerala's harvest festival"],
    ["Pongal","🌾","India (Tamil Nadu)","Tamil Nadu's harvest festival"],
    ["Yi Peng","🏮","Thailand","the sky-lantern festival in Chiang Mai"]
  ];
  function genFestivals(id) {
    const kind = id % 3;
    const s = Math.floor(id / 3);
    if (kind === 0) return festivalsCurated[s % festivalsCurated.length];
    if (kind === 1) {
      const c = countryFestivals[s % countryFestivals.length];
      return fact(c[1], `${c[0]}`,
        `${c[0]} is celebrated in ${c[2]}. It's ${c[3]}.`);
    }
    return festivalsCurated[(s + 4) % festivalsCurated.length];
  }

  // ============================================================
  // HISTORY
  // ============================================================
  const historyCurated = [
    fact("🏛️","Great Pyramid","The Great Pyramid of Giza is over 4,500 years old — one of the oldest wonders still standing."),
    fact("🏰","Great Wall","The Great Wall of China is over 21,000 km long — that's like going halfway around Earth!"),
    fact("📜","Ancient Writing","Long ago, people wrote on clay tablets and palm leaves before paper was invented."),
    fact("🐂","Indus Valley","The Indus Valley Civilisation, around 2500 BC, had planned cities with drains and baths."),
    fact("🏺","Egyptian Mummies","Ancient Egyptians preserved bodies as mummies so their spirits could live on."),
    fact("👑","Cleopatra","Cleopatra was the last active ruler of ancient Egypt around 30 BC."),
    fact("🏛️","Roman Empire","The Roman Empire lasted over 500 years and stretched across three continents."),
    fact("⚔️","Roman Roads","The Romans built more than 400,000 km of roads across their empire."),
    fact("🏺","Ancient Greece","Ancient Greeks invented democracy in Athens around 2,500 years ago."),
    fact("🏛️","Olympia","The ancient Olympic Games were first held in Olympia, Greece, in 776 BC."),
    fact("📜","Alexander","Alexander the Great built an empire from Greece to India by the age of 30."),
    fact("🕌","Ashoka","Emperor Ashoka of India spread Buddhism across Asia in the 3rd century BC."),
    fact("📚","Nalanda","Nalanda in India was one of the world's first universities, over 1,500 years ago."),
    fact("🇮🇳","Chandragupta Maurya","Chandragupta Maurya founded the Maurya Empire around 322 BC."),
    fact("🕌","Akbar","Akbar the Great was one of the most famous Mughal emperors, ruling India from 1556."),
    fact("🕌","Shah Jahan","Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal."),
    fact("🇮🇳","Sepoy Mutiny","The Revolt of 1857 was India's first major uprising against British rule."),
    fact("🕊️","Gandhi","Mahatma Gandhi led India to independence in 1947 using non-violent resistance."),
    fact("🇮🇳","Independence","India became independent on 15 August 1947."),
    fact("📜","Constitution","India's Constitution came into force on 26 January 1950, making India a Republic."),
    fact("🎩","Lincoln","Abraham Lincoln became the 16th US President and ended slavery in America."),
    fact("👑","Queen Victoria","Queen Victoria ruled Britain for over 63 years in the 1800s."),
    fact("⚔️","World War I","World War I lasted from 1914 to 1918 and involved more than 30 countries."),
    fact("⚔️","World War II","World War II ended in 1945 and led to the creation of the United Nations."),
    fact("🕊️","United Nations","The United Nations was founded in 1945 to keep peace between nations."),
    fact("🌍","Age of Exploration","In the 1400s and 1500s, European explorers sailed to distant lands."),
    fact("⛵","Columbus","Christopher Columbus reached the Americas in 1492."),
    fact("⛵","Vasco da Gama","Vasco da Gama was the first European to reach India by sea in 1498."),
    fact("🏛️","Machu Picchu","The Inca city of Machu Picchu in Peru was built in the 1400s high in the Andes."),
    fact("🗿","Easter Island","The huge stone statues on Easter Island were carved between 1250 and 1500 AD."),
    fact("🏰","Stonehenge","Stonehenge in England is over 4,000 years old — nobody is completely sure how it was built."),
    fact("🏛️","Colosseum","The Colosseum in Rome could hold over 50,000 spectators for gladiator games."),
    fact("🕌","Angkor Wat","Angkor Wat in Cambodia is the largest religious monument in the world."),
    fact("🏰","Great Wall Start","The Great Wall of China was started over 2,300 years ago and built over centuries."),
    fact("📜","Gutenberg","Gutenberg invented the printing press around 1440, changing books forever."),
    fact("🔬","Newton","Isaac Newton described the laws of motion and gravity in the 1600s."),
    fact("💡","Edison","Thomas Edison patented over 1,000 inventions, including the light bulb."),
    fact("📞","Bell","Alexander Graham Bell invented the telephone in 1876."),
    fact("✈️","Wright Brothers","The Wright brothers made the first powered flight in 1903."),
    fact("🚀","First Man in Space","Yuri Gagarin became the first human in space on 12 April 1961."),
    fact("🌕","Moon Landing","Neil Armstrong walked on the Moon on 20 July 1969."),
    fact("🇮🇳","Chandrayaan-3","In 2023, India landed near the Moon's south pole with Chandrayaan-3.")
  ];
  const ancientCivilizations = [
    ["Indus Valley","🏛️","around 2500 BC","in modern-day India and Pakistan","for its planned cities and drainage"],
    ["Ancient Egypt","🐫","from 3100 BC","along the Nile","for the pyramids and pharaohs"],
    ["Mesopotamia","📜","from 3500 BC","between the Tigris and Euphrates","for inventing writing"],
    ["Ancient China","🐉","from 2100 BC","along the Yellow River","for silk, paper and gunpowder"],
    ["Ancient Greece","🏛️","from 800 BC","around the Aegean Sea","for democracy and philosophy"],
    ["Roman Empire","🏛️","from 27 BC","around the Mediterranean","for roads, laws and the Colosseum"],
    ["Maya","🏛️","from 2000 BC","in Central America","for pyramids and the Mayan calendar"],
    ["Aztec","🏔️","from 1300 AD","in Mexico","for the city of Tenochtitlán"],
    ["Inca","🏔️","from 1400 AD","in South America","for Machu Picchu and terrace farming"],
    ["Persian Empire","👑","from 550 BC","in modern-day Iran","for one of the largest ancient empires"],
    ["Mauryan Empire","🇮🇳","from 322 BC","in ancient India","for Emperor Ashoka spreading Buddhism"],
    ["Gupta Empire","🇮🇳","from 320 AD","in ancient India","for advances in science and mathematics"],
    ["Chola Empire","🇮🇳","from 850 AD","in South India","for its powerful navy and temples"],
    ["Mughal Empire","🕌","from 1526 AD","in India","for the Taj Mahal and grand architecture"]
  ];
  const inventors = [
    ["Isaac Newton","🍎","gravity and the laws of motion","1600s"],
    ["Albert Einstein","⚛️","the theory of relativity","1900s"],
    ["Marie Curie","☢️","radioactivity","late 1800s"],
    ["Galileo Galilei","🔭","using telescopes to study space","1600s"],
    ["Thomas Edison","💡","the electric light bulb and phonograph","late 1800s"],
    ["Alexander Graham Bell","📞","the telephone","1876"],
    ["Nikola Tesla","⚡","alternating-current electricity","late 1800s"],
    ["Wright Brothers","✈️","the first powered airplane","1903"],
    ["Aryabhata","🧮","the concept of zero and pi","5th century"],
    ["Chandrasekhara Raman","🔬","the Raman Effect in physics","1928"],
    ["Homi Bhabha","⚛️","India's nuclear programme","20th century"],
    ["A. P. J. Abdul Kalam","🚀","India's missile and space programmes","20th century"],
    ["Vikram Sarabhai","🚀","the Indian space programme","20th century"],
    ["Srinivasa Ramanujan","🧮","astonishing work in number theory","early 1900s"],
    ["Tim Berners-Lee","🌐","the World Wide Web","1989"],
    ["Steve Jobs","🍏","Apple and modern smartphones","2000s"]
  ];
  function genHistory(id) {
    const kind = id % 4;
    const s = Math.floor(id / 4);
    if (kind === 0) return historyCurated[s % historyCurated.length];
    if (kind === 1) {
      const c = ancientCivilizations[s % ancientCivilizations.length];
      return fact(c[1], `${c[0]}`,
        `The ${c[0]} civilisation began ${c[2]} ${c[3]}. It is famous ${c[4]}.`);
    }
    if (kind === 2) {
      const inv = inventors[s % inventors.length];
      return fact(inv[1], `${inv[0]}`,
        `${inv[0]} is famous for ${inv[2]} in the ${inv[3]}. Their work changed the world.`);
    }
    return historyCurated[(s + 5) % historyCurated.length];
  }

  // ============================================================
  // NATURE (plants, animals, weather & the living world)
  // ============================================================
  const natureCurated = [
    fact("🌳", "Tree Cities", "A single big tree can be home to more than 500 different creatures!"),
    fact("🐝", "Busy Bees", "Bees have to visit about 2 million flowers to make one jar of honey."),
    fact("🌻", "Sunflower Trick", "Young sunflowers actually turn to follow the sun across the sky!"),
    fact("🦋", "Butterfly Magic", "Butterflies taste flowers with their feet, not their tongues."),
    fact("🐜", "Ant Power", "An ant can lift up to 50 times its own body weight."),
    fact("🌊", "Ocean Breath", "The ocean makes over half of the oxygen we breathe."),
    fact("🌱", "Slow Growth", "A bamboo plant can grow more than 90 cm (3 feet) in a single day."),
    fact("🐢", "Old Turtles", "Some sea turtles live for more than 100 years."),
    fact("🐙", "Octopus Brains", "An octopus has NINE brains — one main brain and one in each arm."),
    fact("🦉", "Owl Head", "Owls can turn their heads almost all the way around — about 270°."),
    fact("🌸", "Flower Language", "Some flowers open at day and close at night to protect their pollen."),
    fact("🌵", "Cactus Store", "A giant saguaro cactus can hold 750 liters of water inside!"),
    fact("🦈", "Shark Teeth", "Sharks can grow more than 30,000 teeth in their lifetime."),
    fact("🐧", "Penguin Warmth", "Penguins huddle together in circles to share body heat."),
    fact("🐬", "Dolphin Sleep", "Dolphins sleep with one half of their brain at a time — the other half stays awake!"),
    fact("🌲", "Oldest Tree", "The oldest living tree, a bristlecone pine, is over 4,800 years old."),
    fact("🐨", "Koala Naps", "Koalas sleep up to 22 hours a day — nature's champion nappers."),
    fact("🦥", "Sloth Slow", "Sloths move so slowly that algae can grow on their fur!"),
    fact("🐿️", "Squirrel Memory", "Squirrels can bury thousands of nuts and remember most hiding spots."),
    fact("🐦", "Bird Songs", "Birds mostly sing at dawn — the 'dawn chorus' — to claim their territory."),
    fact("🌾", "Wheat Fields", "Grasses like wheat feed more people than any other plant on Earth."),
    fact("🍯", "Honey Forever", "Honey never spoils — jars found in ancient tombs were still edible!"),
    fact("🍄", "Mushroom Web", "Under the forest floor, mushrooms link trees like an internet of roots."),
    fact("🌎", "Rainforests", "Rainforests cover 6% of Earth but hold half of all plant and animal species."),
    fact("🕷️", "Spider Silk", "Spider silk is 5 times stronger than steel of the same weight."),
    fact("🐌", "Snail Trail", "Snails carry their homes on their backs and can sleep for 3 years!"),
    fact("🌊", "Coral Reefs", "Coral reefs are made by tiny animals called polyps, working together for centuries."),
    fact("🐘", "Elephant Water", "An elephant can drink 200 liters of water in a single day."),
    fact("🌋", "Volcano Islands", "Islands like Hawaii were born from underwater volcanoes."),
    fact("❄️", "Snowflakes", "No two snowflakes are exactly alike — each is a tiny work of art."),
    fact("🌈", "Rainbow Recipe", "Rainbows need three things: sunlight, water drops, and someone to look."),
    fact("🌀", "Hurricane Eye", "The middle of a hurricane, called the 'eye', is calm and clear."),
    fact("🌋", "Hot Springs", "Some hot springs are warm enough to boil an egg — but way too hot for a bath!"),
    fact("🌊", "Deep Ocean", "The deepest part of the ocean is nearly 11 km down — deeper than Everest is tall."),
    fact("🐳", "Whale Heart", "A blue whale's heart is as big as a small car."),
    fact("🐛", "Caterpillar Change", "A caterpillar liquefies inside its cocoon before turning into a butterfly."),
    fact("🦁", "Lion Roar", "A lion's roar can be heard from up to 8 km away."),
    fact("🐝", "Bee Dance", "Bees dance in a figure-8 to tell friends where to find flowers."),
    fact("🌲", "Tree Talk", "Trees share warnings and nutrients through underground fungi."),
    fact("🐊", "Croc Tears", "Crocodiles really do cry while eating — it's how they clean their eyes.")
  ];
  const nAnimals = [
    ["cheetah","🐆","runs up to 120 km/h — the fastest land animal"],
    ["hummingbird","🐦","flaps its wings up to 80 times per second"],
    ["kangaroo","🦘","can jump 3 meters high and 9 meters far"],
    ["giraffe","🦒","is the tallest animal — up to 5.5 meters tall"],
    ["hippopotamus","🦛","weighs about the same as 3 small cars"],
    ["polar bear","🐻‍❄️","has black skin under its white fur"],
    ["chameleon","🦎","can move its eyes in two directions at once"],
    ["seahorse","🐟","is the only fish where dads carry the babies"],
    ["axolotl","🦎","can grow back parts of its body if hurt"],
    ["platypus","🦫","is a mammal that lays eggs — very rare!"],
    ["flamingo","🦩","is pink because of the shrimp and algae it eats"],
    ["arctic fox","🦊","turns white in winter to hide in the snow"],
    ["frog","🐸","can breathe through its skin"],
    ["tiger","🐅","has striped skin, not just striped fur"],
    ["panda","🐼","spends 12–16 hours a day eating bamboo"],
    ["camel","🐫","can go weeks without drinking water"],
    ["parrot","🦜","can copy words and even short songs"],
    ["orca","🐋","hunts in family groups called pods"],
    ["jellyfish","🪼","has no brain, heart or bones"],
    ["starfish","⭐","can grow back a lost arm"],
    ["monarch butterfly","🦋","flies over 4,000 km every year during migration"],
    ["horse","🐴","can sleep standing up"],
    ["sheep","🐑","can recognize the faces of 50 different sheep"],
    ["hedgehog","🦔","has around 5,000 spines to keep it safe"],
    ["mole","🐭","digs tunnels using its wide, shovel-like paws"],
    ["cow","🐄","has best friends and gets sad when apart"],
    ["dolphin","🐬","talks to friends using clicks and whistles"],
    ["owl","🦉","can silently swoop thanks to soft-edged feathers"],
    ["walrus","🦭","uses its long tusks to climb out of the water"],
    ["gorilla","🦍","shares about 98% of its DNA with humans"],
    ["kiwi","🥝","is a small, flightless bird from New Zealand"],
    ["skunk","🦨","sprays a smelly liquid to scare off enemies"],
    ["raccoon","🦝","washes its food in water before eating"],
    ["swan","🦢","stays with the same mate for its whole life"],
    ["snail","🐌","has thousands of tiny teeth on its tongue"],
    ["bat","🦇","'sees' in the dark using sound — called echolocation"],
    ["shrimp","🦐","has its heart in its head"]
  ];
  const nPlants = [
    ["oak tree","🌳","can live for over 1,000 years"],
    ["sunflower","🌻","turns its face to follow the sun"],
    ["mango tree","🥭","can produce fruit for over 100 years"],
    ["dandelion","🌼","spreads its seeds by parachute-like fluff"],
    ["rose","🌹","comes in every color except true blue"],
    ["fern","🌿","was around when dinosaurs walked the Earth"],
    ["baobab tree","🌳","stores water in its huge, chunky trunk"],
    ["orchid","🌸","has more than 25,000 different species"],
    ["banana plant","🍌","is actually a giant herb — not a tree!"],
    ["strawberry plant","🍓","carries its seeds on the outside of the fruit"],
    ["cactus","🌵","stores water in its stem to survive the desert"],
    ["bamboo","🎋","grows faster than any other plant on Earth"],
    ["tulip","🌷","was once so rare in Holland that bulbs cost more than gold"],
    ["pineapple plant","🍍","only makes one fruit every 2–3 years"],
    ["coconut palm","🥥","gives food, water and shelter — nothing goes to waste"],
    ["watermelon","🍉","is about 92% water"],
    ["mint","🌿","spreads its roots very fast — like a green army"],
    ["lavender","💜","smells calming and helps bees find food"],
    ["carrot","🥕","was originally purple, not orange"],
    ["potato","🥔","was the first vegetable grown in space"]
  ];
  function genNature(id) {
    const kind = id % 4;
    const s = Math.floor(id / 4);
    if (kind === 0 || kind === 1) return natureCurated[s % natureCurated.length];
    if (kind === 2) {
      const a = nAnimals[s % nAnimals.length];
      return fact(a[1], `About the ${a[0]}`, `The ${a[0]} ${a[2]}.`);
    }
    const p = nPlants[s % nPlants.length];
    return fact(p[1], `About the ${p[0]}`, `The ${p[0]} ${p[2]}.`);
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  const GEN = {
    animals:   genAnimals,
    space:     genSpace,
    cultures:  genCultures,
    sports:    genSports,
    festivals: genFestivals,
    history:   genHistory,
    nature:    genNature
  };

  function currentUserId() {
    try {
      const u = window.LEW && window.LEW.getCurrentUser && window.LEW.getCurrentUser();
      return (u && u.id) || "anon";
    } catch { return "anon"; }
  }
  function seenKey(topic) { return `lew_seen_${currentUserId()}_fact_${topic}`; }
  function loadSeen(topic) {
    try { return new Set(JSON.parse(localStorage.getItem(seenKey(topic)) || "[]")); }
    catch { return new Set(); }
  }
  function saveSeen(topic, set) {
    localStorage.setItem(seenKey(topic), JSON.stringify([...set]));
  }

  function pick(topic) {
    let gen = GEN[topic];
    if (!gen) {
      // Fallback: if a legacy or unknown topic was requested, use the first
      // available generator so the user is never stuck with "All done!".
      const fallbackKey = Object.keys(GEN)[0];
      gen = GEN[fallbackKey];
      if (!gen) return null;
      topic = fallbackKey;
    }
    let seen = loadSeen(topic);
    if (seen.size >= POOL_SIZE) {
      seen = new Set();
      saveSeen(topic, seen);
    }
    let id = -1;
    const maxAttempts = 200;
    for (let i = 0; i < maxAttempts; i++) {
      const candidate = Math.floor(Math.random() * POOL_SIZE);
      if (!seen.has(candidate)) { id = candidate; break; }
    }
    if (id === -1) {
      for (let i = 0; i < POOL_SIZE; i++) {
        if (!seen.has(i)) { id = i; break; }
      }
    }
    if (id === -1) {
      seen = new Set();
      id = Math.floor(Math.random() * POOL_SIZE);
    }
    seen.add(id);
    saveSeen(topic, seen);
    const f = gen(id) || { e: "✨", t: "Fun fact", b: "Something amazing is out there — keep exploring!" };
    return { id, ...f };
  }
  function totalSeen(topic) { return loadSeen(topic).size; }
  function totalSeenAll() {
    return TOPICS.reduce((sum, t) => sum + totalSeen(t), 0);
  }
  function resetSeen(topic) { saveSeen(topic, new Set()); }

  window.LEW = window.LEW || {};
  window.LEW.FactBank = {
    POOL_SIZE, TOPICS,
    pick, totalSeen, totalSeenAll, resetSeen
  };
})();
