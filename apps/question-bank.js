// ============================================================
// Little Explorer World — Question Bank
// ------------------------------------------------------------
// Provides a pool of ~5000 questions per subject with:
//   • deterministic generation from a seed id (0..POOL_SIZE-1)
//   • no-repeat tracking per (user, subject) via localStorage
//   • pick(subject, count) returns fresh unseen questions
// ============================================================

(function () {
  const POOL_SIZE = 5000;
  const SUBJECTS = ["maths", "science", "english", "mind"];

  // ---------- deterministic PRNG (LCG) ----------
  function makeRng(seed) {
    let s = ((seed | 0) * 2654435761 + 1) >>> 0;
    return function rand() {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0x100000000;
    };
  }
  function shuf(arr, r) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function mcq(q, correct, distractors, r) {
    const seen = new Set([String(correct)]);
    const clean = [];
    for (const d of distractors) {
      const s = String(d);
      if (!seen.has(s)) { seen.add(s); clean.push(d); }
      if (clean.length === 3) break;
    }
    let pad = 1;
    while (clean.length < 3) {
      const alt = typeof correct === "number" ? (correct + pad + 3) : `Option ${pad}`;
      if (!seen.has(String(alt))) { seen.add(String(alt)); clean.push(alt); }
      pad++;
      if (pad > 50) break;
    }
    const opts = shuf([correct, ...clean], r).map(String);
    return { q, opts, a: opts.indexOf(String(correct)) };
  }

  // ============================================================
  // MATHS — 5000 procedural questions
  // ============================================================
  const shapes = [
    ["triangle", 3], ["square", 4], ["rectangle", 4], ["pentagon", 5],
    ["hexagon", 6], ["heptagon", 7], ["octagon", 8], ["nonagon", 9],
    ["decagon", 10]
  ];
  const timeMoneyFacts = [
    ["How many minutes are in an hour?", 60, [30, 45, 100]],
    ["How many seconds are in a minute?", 60, [30, 45, 100]],
    ["How many hours are in a day?", 24, [12, 20, 48]],
    ["How many days are in a week?", 7, [5, 6, 8]],
    ["How many months are in a year?", 12, [10, 11, 24]],
    ["About how many weeks in a year?", 52, [24, 30, 100]],
    ["How many cents in a dollar?", 100, [50, 25, 200]],
    ["How many paise in a rupee?", 100, [50, 200, 500]],
    ["How many centimeters in a meter?", 100, [10, 50, 1000]],
    ["How many meters in a kilometer?", 1000, [100, 500, 5000]],
    ["How many grams in a kilogram?", 1000, [100, 500, 5000]],
    ["How many milliliters in a liter?", 1000, [100, 500, 5000]],
    ["Days in February (non-leap year)?", 28, [30, 27, 29]],
    ["Days in April?", 30, [28, 29, 31]],
    ["Days in December?", 31, [28, 29, 30]],
    ["How many quarters make a whole?", 4, [2, 3, 5]],
    ["How many halves make a whole?", 2, [1, 3, 4]],
    ["How many sides does a cube have?", 6, [4, 5, 8]],
    ["How many corners does a cube have?", 8, [4, 6, 10]],
    ["A dozen means how many?", 12, [10, 6, 20]]
  ];
  const fractionPairs = [
    ["1/2", "1/4", "1/2"], ["1/3", "2/3", "2/3"], ["3/4", "1/2", "3/4"],
    ["1/5", "1/10", "1/5"], ["2/5", "3/5", "3/5"], ["5/8", "3/8", "5/8"],
    ["1/6", "1/3", "1/3"], ["7/10", "3/10", "7/10"], ["4/5", "3/5", "4/5"],
    ["1/2", "3/4", "3/4"], ["1/8", "1/4", "1/4"], ["5/6", "2/3", "5/6"],
    ["3/7", "4/7", "4/7"], ["1/9", "1/3", "1/3"], ["9/10", "4/5", "9/10"],
    ["2/3", "3/4", "3/4"], ["5/12", "7/12", "7/12"], ["1/2", "2/4", "same"]
  ];

  function genMaths(id) {
    const r = makeRng(id + 1);
    const kind = id % 10;
    const s = Math.floor(id / 10);
    let a, b, ans, q;
    switch (kind) {
      case 0: // small addition
        a = 2 + (s % 48); b = 2 + ((s * 7 + 3) % 48); ans = a + b;
        return mcq(`What is ${a} + ${b}?`, ans,
          [ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10].filter(x => x > 0), r);
      case 1: // bigger addition
        a = 20 + (s % 180); b = 10 + ((s * 5 + 3) % 180); ans = a + b;
        return mcq(`Add: ${a} + ${b}`, ans,
          [ans + 10, ans - 10, ans + 1, ans - 1, ans + 11], r);
      case 2: // subtraction
        b = 1 + (s % 50); a = b + 1 + ((s * 3 + 5) % 90); ans = a - b;
        return mcq(`What is ${a} − ${b}?`, ans,
          [ans + 1, ans - 1, ans + 2, ans - 2, ans + 5].filter(x => x >= 0), r);
      case 3: // multiplication
        a = 2 + (s % 12); b = 2 + ((s * 5 + 3) % 12); ans = a * b;
        return mcq(`What is ${a} × ${b}?`, ans,
          [ans + a, ans - a, ans + b, ans - b, ans + 1, ans - 1].filter(x => x > 0), r);
      case 4: { // division
        const bb = 2 + (s % 11); const qq = 2 + ((s * 3 + 7) % 12); a = bb * qq;
        return mcq(`What is ${a} ÷ ${bb}?`, qq,
          [qq + 1, qq - 1, qq + 2, qq + bb, qq - 2].filter(x => x > 0), r);
      }
      case 5: { // fractions
        const p = fractionPairs[s % fractionPairs.length];
        const correct = p[2];
        const wrong = p[0] === correct ? p[1] : p[0];
        return mcq(`Which is bigger: ${p[0]} or ${p[1]}?`, correct,
          [wrong, "Same", "Neither"], r);
      }
      case 6: { // geometry
        const sh = shapes[s % shapes.length];
        return mcq(`How many sides does a ${sh[0]} have?`, sh[1],
          [sh[1] - 1, sh[1] + 1, sh[1] + 2, sh[1] - 2].filter(x => x > 0), r);
      }
      case 7: { // time/money/measure
        const f = timeMoneyFacts[s % timeMoneyFacts.length];
        return mcq(f[0], f[1], f[2], r);
      }
      case 8: { // word problems
        const type = s % 6;
        const n = 2 + ((s * 3) % 20);
        const m = 2 + ((s * 5 + 7) % 12);
        if (type === 0) return mcq(`Sara has ${n} apples. She gets ${m} more. Total?`, n + m,
          [n + m + 1, n + m - 1, Math.abs(n - m), n * m], r);
        if (type === 1) return mcq(`A shelf has ${n + m} books. ${m} are removed. How many left?`, n,
          [n + 1, n - 1, m, n + m], r);
        if (type === 2) {
          const flew = Math.min(m, n);
          return mcq(`${n} birds sit on a branch. ${flew} fly away. How many left?`,
            n - flew, [n + 1, n - flew + 1, m, 0], r);
        }
        if (type === 3) return mcq(`A pack has ${m} candies. There are ${n} packs. Total candies?`,
          n * m, [n + m, n * m + 1, n * m - 1, n * (m + 1)], r);
        if (type === 4) return mcq(`${n + m} cookies are shared equally among ${n + m} kids. Each gets?`,
          1, [2, 0, n, m], r);
        return mcq(`A train has ${n} coaches, each with ${m} seats. Total seats?`,
          n * m, [n + m, n * m + m, n * m - m, n * m + 1], r);
      }
      case 9: { // patterns, even/odd, rounding, multiples, biggest
        const t = s % 5;
        if (t === 0) {
          const start = 2 + (s % 50) * 2;
          return mcq(`What comes next: ${start}, ${start + 2}, ${start + 4}, ___?`,
            start + 6, [start + 5, start + 7, start + 8, start + 3], r);
        }
        if (t === 1) {
          const n = 2 + (s % 100);
          const even = n % 2 === 0;
          return mcq(`Is ${n} even or odd?`, even ? "Even" : "Odd",
            ["Both", "Neither", even ? "Odd" : "Even"], r);
        }
        if (t === 2) {
          const n = 10 + (s % 90);
          const rounded = Math.round(n / 10) * 10;
          return mcq(`Round ${n} to the nearest 10.`, rounded,
            [rounded + 10, rounded - 10, rounded + 5, rounded - 5].filter(x => x > 0), r);
        }
        if (t === 3) {
          const bb = 2 + (s % 10);
          const isMul = (s * 7) % 3 < 2;
          const base = 2 + ((s * 3) % 8);
          const n = isMul ? bb * base : bb * base + 1;
          return mcq(`Is ${n} a multiple of ${bb}?`, isMul ? "Yes" : "No",
            ["Sometimes", "Only if even", isMul ? "No" : "Yes"], r);
        }
        // biggest
        const nums = [
          10 + (s % 80),
          20 + ((s * 3) % 60),
          5 + ((s * 5) % 90),
          15 + ((s * 7) % 70)
        ];
        const uniq = [...new Set(nums)];
        while (uniq.length < 4) uniq.push(uniq[uniq.length - 1] + 1);
        const mx = Math.max(...uniq);
        return mcq(`Which is biggest: ${uniq.join(", ")}?`, mx, uniq.filter(x => x !== mx), r);
      }
    }
    return { q: `What is 1 + 1?`, opts: ["1", "2", "3", "4"], a: 1 };
  }

  // ============================================================
  // SCIENCE — curated bank + templates
  // ============================================================
  const scienceCurated = [
    ["Which planet is known as the Red Planet?", "Mars", ["Venus", "Jupiter", "Mercury"]],
    ["What do plants breathe in for photosynthesis?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Helium"]],
    ["How many bones are in the adult human body?", "206", ["106", "306", "406"]],
    ["Water freezes at ___ °C.", "0", ["10", "-10", "100"]],
    ["The Sun is a ___.", "Star", ["Planet", "Moon", "Comet"]],
    ["Which is the closest planet to the Sun?", "Mercury", ["Venus", "Earth", "Mars"]],
    ["Which is the biggest planet in our solar system?", "Jupiter", ["Saturn", "Earth", "Neptune"]],
    ["How many planets are in our solar system?", "8", ["7", "9", "10"]],
    ["Which planet has beautiful rings?", "Saturn", ["Earth", "Mars", "Venus"]],
    ["Which planet do we live on?", "Earth", ["Mars", "Venus", "Jupiter"]],
    ["What is Earth's only natural satellite?", "The Moon", ["The Sun", "Mars", "Venus"]],
    ["What gas do we breathe in to live?", "Oxygen", ["Carbon dioxide", "Nitrogen", "Helium"]],
    ["Which organ pumps blood in the body?", "Heart", ["Lungs", "Brain", "Liver"]],
    ["Which organ helps us breathe?", "Lungs", ["Heart", "Kidney", "Liver"]],
    ["Which organ helps us think?", "Brain", ["Heart", "Stomach", "Ear"]],
    ["Which organ digests food?", "Stomach", ["Lungs", "Brain", "Heart"]],
    ["How many senses do humans have?", "5", ["3", "4", "6"]],
    ["Which sense do we use to see?", "Sight", ["Hearing", "Smell", "Taste"]],
    ["Which sense do we use to hear?", "Hearing", ["Sight", "Smell", "Taste"]],
    ["Which sense do we use to smell?", "Smell", ["Sight", "Touch", "Taste"]],
    ["Which sense do we use to taste?", "Taste", ["Sight", "Smell", "Touch"]],
    ["Which sense do we use for hot and cold?", "Touch", ["Sight", "Smell", "Taste"]],
    ["Which animal is known as the King of the Jungle?", "Lion", ["Tiger", "Elephant", "Bear"]],
    ["Which bird cannot fly?", "Penguin", ["Sparrow", "Eagle", "Parrot"]],
    ["Which is the largest mammal?", "Blue whale", ["Elephant", "Giraffe", "Shark"]],
    ["Which is the tallest animal?", "Giraffe", ["Elephant", "Horse", "Rhino"]],
    ["Which is the fastest land animal?", "Cheetah", ["Lion", "Horse", "Tiger"]],
    ["A baby cat is called a ___.", "Kitten", ["Puppy", "Cub", "Calf"]],
    ["A baby dog is called a ___.", "Puppy", ["Kitten", "Cub", "Foal"]],
    ["A baby cow is called a ___.", "Calf", ["Kid", "Puppy", "Kitten"]],
    ["A baby goat is called a ___.", "Kid", ["Calf", "Puppy", "Foal"]],
    ["A baby lion is called a ___.", "Cub", ["Kitten", "Calf", "Foal"]],
    ["A baby horse is called a ___.", "Foal", ["Calf", "Kid", "Cub"]],
    ["A baby frog is called a ___.", "Tadpole", ["Larva", "Chick", "Nymph"]],
    ["A baby butterfly comes from a ___.", "Caterpillar", ["Tadpole", "Snake", "Bee"]],
    ["Bees make ___.", "Honey", ["Milk", "Wax only", "Silk"]],
    ["Silk comes from a ___.", "Silkworm", ["Sheep", "Bee", "Spider"]],
    ["Wool comes from a ___.", "Sheep", ["Cow", "Goat only", "Horse"]],
    ["Milk mainly comes from ___.", "Cow", ["Chicken", "Bee", "Sheep"]],
    ["Which animal lays eggs?", "Chicken", ["Cow", "Dog", "Cat"]],
    ["Fish breathe through ___.", "Gills", ["Lungs", "Nose", "Skin only"]],
    ["Which is a reptile?", "Snake", ["Sparrow", "Cow", "Fish"]],
    ["Which is a mammal?", "Whale", ["Shark", "Snake", "Crocodile"]],
    ["Which is an insect?", "Butterfly", ["Spider", "Bat", "Frog"]],
    ["How many legs does an insect have?", "6", ["4", "8", "10"]],
    ["How many legs does a spider have?", "8", ["6", "10", "4"]],
    ["Which season is coldest?", "Winter", ["Summer", "Spring", "Autumn"]],
    ["Which season is hottest?", "Summer", ["Winter", "Spring", "Autumn"]],
    ["What comes after rain in the sky sometimes?", "Rainbow", ["Snow", "Lightning only", "Fog"]],
    ["How many colors are in a rainbow?", "7", ["5", "6", "8"]],
    ["Which color is at the top of a rainbow?", "Red", ["Blue", "Green", "Violet"]],
    ["Which is a source of light?", "Sun", ["Moon", "Book", "Chair"]],
    ["The Moon shines because of ___.", "Sunlight", ["Its own fire", "Stars", "Earth's light"]],
    ["Which is a solid?", "Ice", ["Water", "Steam", "Milk"]],
    ["Which is a liquid?", "Water", ["Ice", "Steam", "Salt"]],
    ["Which is a gas?", "Steam", ["Water", "Ice", "Sand"]],
    ["Boiling water turns into ___.", "Steam", ["Ice", "Mud", "Snow"]],
    ["Ice turning to water is called ___.", "Melting", ["Freezing", "Boiling", "Cooling"]],
    ["Water turning to ice is called ___.", "Freezing", ["Melting", "Boiling", "Evaporation"]],
    ["Which of these floats on water?", "Wood", ["Iron nail", "Stone", "Coin"]],
    ["Which of these sinks in water?", "Iron nail", ["Wood", "Leaf", "Paper boat"]],
    ["Where do plants make their food?", "Leaves", ["Roots", "Stem", "Flowers"]],
    ["Roots hold the plant to the ___.", "Ground", ["Sky", "Water only", "Air"]],
    ["Which part of a plant is often eaten as a carrot?", "Root", ["Leaf", "Stem", "Flower"]],
    ["Which part of the plant becomes a fruit?", "Flower", ["Root", "Leaf", "Stem"]],
    ["What is the process by which plants make food called?", "Photosynthesis", ["Digestion", "Respiration", "Evaporation"]],
    ["Plants need ___ and water to grow.", "Sunlight", ["Darkness", "Ice", "Sound"]],
    ["Which is a fruit?", "Apple", ["Carrot", "Potato", "Onion"]],
    ["Which is a vegetable?", "Carrot", ["Apple", "Banana", "Mango"]],
    ["Which fruit is yellow and long?", "Banana", ["Apple", "Grape", "Cherry"]],
    ["Which fruit is called the king of fruits?", "Mango", ["Apple", "Banana", "Orange"]],
    ["Which drink is called liquid milk?", "Milk", ["Juice", "Water", "Tea"]],
    ["Which season do trees shed leaves?", "Autumn", ["Summer", "Winter", "Spring"]],
    ["A group of stars forming a pattern is called a ___.", "Constellation", ["Galaxy", "Nebula", "Comet"]],
    ["Our galaxy is called the ___.", "Milky Way", ["Andromeda", "Orion", "Cassiopeia"]],
    ["Which is the hottest planet?", "Venus", ["Mercury", "Mars", "Jupiter"]],
    ["Which planet is farthest from the Sun?", "Neptune", ["Uranus", "Saturn", "Pluto"]],
    ["Which is the smallest planet?", "Mercury", ["Mars", "Venus", "Earth"]],
    ["What causes day and night?", "Earth's rotation", ["Moon", "Sun moving", "Stars"]],
    ["What causes the seasons?", "Earth's tilt and orbit", ["Wind", "Ocean tides", "Volcanoes"]],
    ["How long does Earth take to go around the Sun?", "365 days", ["30 days", "100 days", "1000 days"]],
    ["How long does Earth take to spin once?", "24 hours", ["12 hours", "1 hour", "48 hours"]],
    ["Which is the largest ocean?", "Pacific", ["Atlantic", "Indian", "Arctic"]],
    ["What is a group of fish called?", "School", ["Herd", "Pack", "Flock"]],
    ["A group of lions is called a ___.", "Pride", ["Pack", "Flock", "Herd"]],
    ["A group of wolves is called a ___.", "Pack", ["Pride", "Herd", "Swarm"]],
    ["A group of bees is called a ___.", "Swarm", ["Pack", "Flock", "Herd"]],
    ["A group of birds is called a ___.", "Flock", ["Pack", "Pride", "Herd"]],
    ["A group of cattle is called a ___.", "Herd", ["Flock", "Pack", "Pride"]],
    ["A caterpillar becomes a ___.", "Butterfly", ["Bee", "Bird", "Snake"]],
    ["A tadpole becomes a ___.", "Frog", ["Fish", "Snake", "Lizard"]],
    ["The North Pole is very ___.", "Cold", ["Hot", "Green", "Wet"]],
    ["Deserts have very little ___.", "Water", ["Sand", "Sun", "Wind"]],
    ["A very tall snowy hill is called a ___.", "Mountain", ["Valley", "River", "Ocean"]],
    ["Salt water is found in the ___.", "Ocean", ["River", "Well", "Rain"]],
    ["Which vitamin do we get from sunlight?", "Vitamin D", ["Vitamin A", "Vitamin C", "Vitamin K"]],
    ["Which vitamin is in oranges?", "Vitamin C", ["Vitamin D", "Vitamin K", "Iron"]],
    ["What do we use a thermometer for?", "Measuring temperature", ["Measuring weight", "Measuring time", "Measuring length"]],
    ["What do we use a clock for?", "Measuring time", ["Measuring weight", "Measuring length", "Measuring heat"]],
    ["What do we use a ruler for?", "Measuring length", ["Measuring time", "Measuring weight", "Measuring heat"]],
    ["What do we use a weighing scale for?", "Measuring weight", ["Measuring time", "Measuring length", "Measuring speed"]],
    ["Sound travels in ___.", "Waves", ["Straight lines only", "Circles only", "Squares"]],
    ["Which travels faster: light or sound?", "Light", ["Sound", "Same", "Neither"]],
    ["Which is a good conductor of electricity?", "Copper", ["Wood", "Plastic", "Rubber"]],
    ["Which is a good insulator?", "Rubber", ["Copper", "Iron", "Silver"]],
    ["A magnet attracts ___.", "Iron", ["Wood", "Plastic", "Paper"]],
    ["Which force pulls us toward the Earth?", "Gravity", ["Magnetism", "Friction", "Push"]],
    ["What do we call frozen water falling from clouds?", "Snow", ["Rain", "Fog", "Dew"]],
    ["Tiny drops of water on grass in the morning are called ___.", "Dew", ["Snow", "Fog", "Rain"]],
    ["Cloud made close to the ground is called ___.", "Fog", ["Rain", "Snow", "Dew"]],
    ["Very fast air is called ___.", "Wind", ["Rain", "Fog", "Cloud"]],
    ["A big storm with strong winds and rain is a ___.", "Cyclone", ["Rainbow", "Breeze", "Cloud"]],
    ["A shaking of the ground is called an ___.", "Earthquake", ["Eclipse", "Rainstorm", "Volcano"]],
    ["A mountain that erupts is a ___.", "Volcano", ["Glacier", "Cyclone", "Cave"]],
    ["Which is the coldest continent?", "Antarctica", ["Africa", "Asia", "Europe"]],
    ["Which is the largest continent?", "Asia", ["Africa", "Europe", "Australia"]],
    ["Which of these is not a state of matter?", "Energy", ["Solid", "Liquid", "Gas"]],
    ["Air is a mix of many ___.", "Gases", ["Solids", "Liquids", "Powders"]],
    ["Ice, water, and steam are made of the same ___.", "Substance", ["Metal", "Wood", "Air"]],
    ["We hear with our ___.", "Ears", ["Eyes", "Nose", "Skin"]],
    ["We see with our ___.", "Eyes", ["Ears", "Nose", "Tongue"]],
    ["We taste with our ___.", "Tongue", ["Eyes", "Ears", "Skin"]],
    ["Which is a herbivore?", "Cow", ["Lion", "Tiger", "Shark"]],
    ["Which is a carnivore?", "Lion", ["Cow", "Goat", "Deer"]],
    ["An omnivore eats ___.", "Plants and animals", ["Only plants", "Only meat", "Only rocks"]],
    ["Which body part helps us walk?", "Legs", ["Ears", "Nose", "Elbow"]],
    ["Which body part helps us hold things?", "Hands", ["Feet", "Nose", "Ears"]],
    ["Teeth help us to ___.", "Chew", ["See", "Hear", "Smell"]],
    ["We brush teeth ___ a day.", "Twice", ["Once", "Never", "Ten times"]],
    ["Blood is red because of ___.", "Iron", ["Copper", "Salt", "Sugar"]],
    ["Nurses and doctors work at a ___.", "Hospital", ["Post office", "Farm", "Zoo"]],
    ["Where do animals like lion and zebra live in the wild?", "Grasslands", ["Ocean", "Desert only", "Icebergs"]],
    ["Which is a source of energy from the Sun called?", "Solar energy", ["Wind energy", "Hydro energy", "Coal"]],
    ["Which energy comes from moving water?", "Hydro energy", ["Solar energy", "Wind energy", "Coal"]],
    ["Which fuel is used in cars often?", "Petrol", ["Water", "Sand", "Milk"]],
    ["Recycling is good for the ___.", "Earth", ["Robot", "Screen", "Balloon"]],
    ["Which is a way to save water?", "Turn off tap when not used", ["Leave tap running", "Play with tap", "Ignore leaks"]],
    ["The three Rs are Reduce, Reuse and ___.", "Recycle", ["Restart", "Repeat", "Rename"]]
  ];
  const scienceGroups = [
    // [category, [members]]
    ["mammal", ["cow", "dog", "cat", "elephant", "whale", "monkey", "horse", "bat", "kangaroo", "dolphin", "lion", "tiger", "sheep", "goat", "bear"]],
    ["bird", ["sparrow", "eagle", "parrot", "penguin", "crow", "owl", "peacock", "duck", "hen", "pigeon", "swan", "flamingo"]],
    ["reptile", ["snake", "crocodile", "turtle", "lizard", "iguana", "chameleon", "tortoise", "gecko"]],
    ["fish", ["shark", "goldfish", "salmon", "tuna", "clownfish", "catfish", "eel", "sardine"]],
    ["insect", ["ant", "bee", "butterfly", "mosquito", "grasshopper", "beetle", "housefly", "ladybug", "dragonfly"]],
    ["fruit", ["apple", "banana", "mango", "grape", "orange", "papaya", "pineapple", "watermelon", "guava", "cherry", "peach", "pear"]],
    ["vegetable", ["carrot", "potato", "onion", "cabbage", "spinach", "brinjal", "beetroot", "cauliflower", "radish", "pumpkin"]],
    ["planet", ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]],
    ["metal", ["iron", "copper", "gold", "silver", "aluminium", "zinc"]],
    ["gas", ["oxygen", "hydrogen", "nitrogen", "carbon dioxide", "helium", "argon"]],
    ["liquid", ["water", "milk", "oil", "juice", "vinegar", "honey"]],
    ["solid", ["ice", "wood", "stone", "iron", "glass", "brick"]]
  ];
  const allScienceItems = scienceGroups.flatMap(([, arr]) => arr);
  function genScience(id) {
    const r = makeRng(id + 101);
    const kind = id % 6;
    const s = Math.floor(id / 6);
    if (kind === 0 || kind === 1) {
      const f = scienceCurated[s % scienceCurated.length];
      return mcq(f[0], f[1], f[2], r);
    }
    if (kind === 2) {
      // Which is a ___?
      const g = scienceGroups[s % scienceGroups.length];
      const members = g[1];
      const correct = members[s % members.length];
      const notInThisGroup = allScienceItems.filter(x => !members.includes(x));
      const wrong = [
        notInThisGroup[(s * 3) % notInThisGroup.length],
        notInThisGroup[(s * 5 + 1) % notInThisGroup.length],
        notInThisGroup[(s * 7 + 2) % notInThisGroup.length]
      ];
      return mcq(`Which of these is a ${g[0]}?`, correct, wrong, r);
    }
    if (kind === 3) {
      // Which is NOT a ___?
      const g = scienceGroups[s % scienceGroups.length];
      const notInGroup = allScienceItems.filter(x => !g[1].includes(x));
      const correct = notInGroup[s % notInGroup.length];
      const wrong = [
        g[1][(s * 3) % g[1].length],
        g[1][(s * 5 + 1) % g[1].length],
        g[1][(s * 7 + 2) % g[1].length]
      ];
      return mcq(`Which of these is NOT a ${g[0]}?`, correct, wrong, r);
    }
    if (kind === 4) {
      // planet order from Sun
      const order = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
      const nth = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
      const i = s % order.length;
      const wrong = order.filter(p => p !== order[i]);
      return mcq(`Which planet is the ${nth[i]} from the Sun?`, order[i],
        [wrong[(s * 3) % wrong.length], wrong[(s * 5 + 1) % wrong.length], wrong[(s * 7 + 2) % wrong.length]], r);
    }
    // kind === 5: fact variation from curated (different phrasing)
    const f = scienceCurated[(s + 7) % scienceCurated.length];
    return mcq("Fact check — " + f[0], f[1], f[2], r);
  }

  // ============================================================
  // ENGLISH — curated + templates
  // ============================================================
  const opposites = [
    ["hot", "cold"], ["big", "small"], ["fast", "slow"], ["happy", "sad"],
    ["day", "night"], ["up", "down"], ["in", "out"], ["light", "dark"],
    ["young", "old"], ["rich", "poor"], ["hard", "soft"], ["clean", "dirty"],
    ["full", "empty"], ["open", "closed"], ["strong", "weak"], ["kind", "cruel"],
    ["thick", "thin"], ["long", "short"], ["wide", "narrow"], ["heavy", "light"],
    ["wet", "dry"], ["easy", "difficult"], ["early", "late"], ["begin", "end"],
    ["give", "take"], ["laugh", "cry"], ["love", "hate"], ["push", "pull"],
    ["buy", "sell"], ["come", "go"], ["front", "back"], ["above", "below"],
    ["ask", "answer"], ["accept", "refuse"], ["safe", "dangerous"], ["true", "false"],
    ["always", "never"], ["remember", "forget"], ["win", "lose"], ["awake", "asleep"],
    ["build", "destroy"], ["cheap", "expensive"], ["clever", "silly"], ["cool", "warm"],
    ["deep", "shallow"], ["far", "near"], ["few", "many"], ["fresh", "stale"],
    ["healthy", "sick"], ["high", "low"], ["hollow", "solid"], ["polite", "rude"],
    ["public", "private"], ["real", "fake"], ["right", "wrong"], ["same", "different"],
    ["shine", "fade"], ["simple", "complex"], ["success", "failure"], ["sunrise", "sunset"],
    ["sweet", "sour"], ["together", "apart"], ["ugly", "beautiful"], ["visible", "invisible"],
    ["warm", "cool"], ["wild", "tame"], ["work", "play"], ["yes", "no"]
  ];
  const synonyms = [
    ["big", "large"], ["small", "tiny"], ["happy", "joyful"], ["sad", "unhappy"],
    ["fast", "quick"], ["angry", "mad"], ["begin", "start"], ["end", "finish"],
    ["easy", "simple"], ["strong", "powerful"], ["brave", "courageous"], ["smart", "clever"],
    ["quiet", "silent"], ["scared", "afraid"], ["tired", "sleepy"], ["hurry", "rush"],
    ["reply", "answer"], ["gift", "present"], ["home", "house"], ["kid", "child"],
    ["food", "meal"], ["street", "road"], ["ill", "sick"], ["big", "huge"],
    ["shout", "yell"], ["cry", "weep"], ["laugh", "giggle"], ["look", "see"],
    ["hurry", "rush"], ["little", "small"], ["under", "below"], ["over", "above"]
  ];
  const plurals = [
    ["child", "children"], ["man", "men"], ["woman", "women"], ["tooth", "teeth"],
    ["foot", "feet"], ["mouse", "mice"], ["goose", "geese"], ["ox", "oxen"],
    ["person", "people"], ["cactus", "cacti"], ["leaf", "leaves"], ["knife", "knives"],
    ["wife", "wives"], ["life", "lives"], ["potato", "potatoes"], ["tomato", "tomatoes"],
    ["hero", "heroes"], ["baby", "babies"], ["story", "stories"], ["family", "families"],
    ["party", "parties"], ["fox", "foxes"], ["box", "boxes"], ["bus", "buses"],
    ["glass", "glasses"], ["watch", "watches"], ["church", "churches"], ["dish", "dishes"],
    ["book", "books"], ["cat", "cats"], ["dog", "dogs"], ["bird", "birds"],
    ["boy", "boys"], ["girl", "girls"], ["car", "cars"], ["star", "stars"]
  ];
  const articles = [
    ["apple", "an"], ["orange", "an"], ["egg", "an"], ["umbrella", "an"],
    ["elephant", "an"], ["hour", "an"], ["honest boy", "an"], ["idea", "an"],
    ["igloo", "an"], ["ostrich", "an"], ["owl", "an"], ["ant", "an"],
    ["book", "a"], ["cat", "a"], ["dog", "a"], ["tree", "a"],
    ["house", "a"], ["horse", "a"], ["boy", "a"], ["girl", "a"],
    ["pen", "a"], ["car", "a"], ["train", "a"], ["fish", "a"],
    ["university", "a"], ["one-eyed man", "a"], ["European", "a"]
  ];
  const tenses = [
    ["run", "ran"], ["go", "went"], ["eat", "ate"], ["see", "saw"],
    ["come", "came"], ["do", "did"], ["make", "made"], ["take", "took"],
    ["write", "wrote"], ["read", "read"], ["give", "gave"], ["speak", "spoke"],
    ["swim", "swam"], ["sing", "sang"], ["draw", "drew"], ["fly", "flew"],
    ["catch", "caught"], ["teach", "taught"], ["think", "thought"], ["buy", "bought"],
    ["bring", "brought"], ["begin", "began"], ["break", "broke"], ["choose", "chose"],
    ["drink", "drank"], ["drive", "drove"], ["fall", "fell"], ["feel", "felt"],
    ["find", "found"], ["get", "got"], ["grow", "grew"], ["hide", "hid"]
  ];
  const englishCurated = [
    ["Which is a noun?", "Book", ["Run", "Happy", "Quickly"]],
    ["Which is a verb?", "Jump", ["Table", "Blue", "Under"]],
    ["Which is an adjective?", "Beautiful", ["Run", "Book", "Quickly"]],
    ["Which is an adverb?", "Quickly", ["Book", "Happy", "Run"]],
    ["Which is a pronoun?", "She", ["Book", "Run", "Happy"]],
    ["A ___ is used at the end of a question.", "?", [".", "!", ","]],
    ["A sentence should start with a ___ letter.", "Capital", ["Small", "Number", "Symbol"]],
    ["Which is spelled correctly?", "Beautiful", ["Beutiful", "Beautifull", "Beatiful"]],
    ["Which is spelled correctly?", "Necessary", ["Neccesary", "Necesary", "Nesessary"]],
    ["Which is spelled correctly?", "Environment", ["Enviroment", "Environmant", "Envirnment"]],
    ["Which is spelled correctly?", "Because", ["Becuase", "Becose", "Becaause"]],
    ["Which is spelled correctly?", "Friend", ["Freind", "Frend", "Frind"]],
    ["Which rhymes with 'cat'?", "hat", ["dog", "sun", "car"]],
    ["Which rhymes with 'star'?", "car", ["moon", "sun", "book"]],
    ["Which rhymes with 'moon'?", "spoon", ["cat", "dog", "book"]],
    ["Which is a common noun?", "girl", ["Priya", "Delhi", "Ganga"]],
    ["Which is a proper noun?", "India", ["country", "boy", "city"]],
    ["A group of words that gives complete sense is a ___.", "Sentence", ["Letter", "Word", "Symbol"]],
    ["The capital of India is ___.", "New Delhi", ["Mumbai", "Chennai", "Kolkata"]],
    ["Which is a vowel?", "a", ["b", "c", "d"]],
    ["How many vowels are in the English alphabet?", "5", ["3", "7", "10"]],
    ["Vowels are a, e, i, o, ___.", "u", ["y", "v", "w"]],
    ["Which is a consonant?", "b", ["a", "e", "i"]]
  ];

  function genEnglish(id) {
    const r = makeRng(id + 202);
    const kind = id % 8;
    const s = Math.floor(id / 8);
    if (kind === 0) {
      const p = opposites[s % opposites.length];
      const otherIdx = (s * 3 + 1) % opposites.length;
      const other2 = (s * 5 + 2) % opposites.length;
      return mcq(`What is the opposite of '${p[0]}'?`, p[1],
        [opposites[otherIdx][1], opposites[other2][1], p[0]], r);
    }
    if (kind === 1) {
      const p = opposites[s % opposites.length];
      const otherIdx = (s * 3 + 1) % opposites.length;
      const other2 = (s * 5 + 2) % opposites.length;
      return mcq(`What is the opposite of '${p[1]}'?`, p[0],
        [opposites[otherIdx][0], opposites[other2][0], p[1]], r);
    }
    if (kind === 2) {
      const p = synonyms[s % synonyms.length];
      const other = (s * 3 + 1) % synonyms.length;
      const other2 = (s * 5 + 2) % synonyms.length;
      return mcq(`Which means the same as '${p[0]}'?`, p[1],
        [synonyms[other][1], synonyms[other2][1], "None"], r);
    }
    if (kind === 3) {
      const p = plurals[s % plurals.length];
      const other = (s * 3 + 1) % plurals.length;
      const other2 = (s * 5 + 2) % plurals.length;
      return mcq(`What is the plural of '${p[0]}'?`, p[1],
        [plurals[other][1], plurals[other2][1], p[0] + "s"], r);
    }
    if (kind === 4) {
      const p = articles[s % articles.length];
      return mcq(`Which article goes before '${p[0]}'?`, p[1],
        [p[1] === "a" ? "an" : "a", "the", "no article"], r);
    }
    if (kind === 5) {
      const p = tenses[s % tenses.length];
      const other = (s * 3 + 1) % tenses.length;
      const other2 = (s * 5 + 2) % tenses.length;
      return mcq(`What is the past tense of '${p[0]}'?`, p[1],
        [tenses[other][1], tenses[other2][1], p[0] + "ed"], r);
    }
    if (kind === 6) {
      const f = englishCurated[s % englishCurated.length];
      return mcq(f[0], f[1], f[2], r);
    }
    // kind === 7 — alternate curated + variation
    const f = englishCurated[(s + 5) % englishCurated.length];
    return mcq(f[0], f[1], f[2], r);
  }

  // ============================================================
  // MIND & ME — feelings, habits, self-care
  // ============================================================
  const mindCurated = [
    ["What helps you feel calm when upset?", "Deep breaths", ["Yelling", "Skipping sleep", "Hitting things"]],
    ["How many hours of sleep do kids need?", "9-11", ["4-6", "6-8", "1-2"]],
    ["Being kind makes others feel ___.", "Happy", ["Sad", "Angry", "Tired"]],
    ["If you feel sad, you can ___.", "Talk to someone you trust", ["Hide it forever", "Skip meals", "Stay alone"]],
    ["Which is a healthy habit?", "Drinking water", ["Skipping breakfast", "Too much screen", "Late nights"]],
    ["Before eating, we should ___.", "Wash hands", ["Watch TV", "Skip it", "Yell"]],
    ["After playing outside, we should ___.", "Wash hands and feet", ["Sleep in dusty clothes", "Skip water", "Skip bath for weeks"]],
    ["We should brush our teeth ___ a day.", "Twice", ["Never", "Once a week", "Ten times"]],
    ["Which food is healthy?", "Fresh fruit", ["Candy every meal", "Only fried food", "Only soda"]],
    ["To stay strong we should eat ___.", "Balanced meals", ["Only sweets", "Only chips", "Only ice cream"]],
    ["How much water should kids drink daily (glasses)?", "6-8", ["1", "2", "20"]],
    ["What helps focus in class?", "Getting enough sleep", ["Staying up all night", "Skipping meals", "Loud music while studying"]],
    ["What should you do if a friend is sad?", "Listen and comfort them", ["Ignore them", "Laugh at them", "Tell everyone"]],
    ["What should you do if someone bullies you?", "Tell a trusted adult", ["Keep it a secret", "Hit them back", "Skip school forever"]],
    ["When someone helps you, you say ___.", "Thank you", ["Go away", "Not now", "Whatever"]],
    ["When you make a mistake, you can say ___.", "Sorry", ["Not my fault", "You're wrong", "Nothing"]],
    ["Sharing with friends makes you feel ___.", "Good", ["Angry", "Jealous", "Sad"]],
    ["A good friend ___.", "Listens and supports you", ["Only takes from you", "Ignores you always", "Laughs at your feelings"]],
    ["It is okay to feel ___ sometimes.", "Sad", ["Nothing ever", "Angry only", "Happy always"]],
    ["To be brave means to ___.", "Try even when afraid", ["Never be scared", "Never try", "Hide always"]],
    ["Screens should be ___ before bed.", "Turned off early", ["On all night", "Right on the pillow", "In your bed"]],
    ["Exercise helps your ___.", "Body and mind", ["Only muscles", "Only feet", "Only skin"]],
    ["Which is a good morning habit?", "Making the bed", ["Skipping breakfast", "Watching TV for hours", "Yelling"]],
    ["What helps when you feel angry?", "Count to 10 and breathe", ["Hit something", "Yell at everyone", "Break things"]],
    ["Which activity relaxes the mind?", "Reading a book", ["Fighting", "Yelling", "Skipping sleep"]],
    ["Kindness is like a ___.", "Superpower", ["Weakness", "Boring habit", "Trick"]],
    ["Helping at home shows you are ___.", "Responsible", ["Lazy", "Angry", "Selfish"]],
    ["When you don't understand, you should ___.", "Ask questions", ["Stay quiet forever", "Pretend to know", "Give up"]],
    ["Practice makes ___.", "Progress", ["Boring", "Failure", "Nothing"]],
    ["Which of these is self-care?", "Getting enough sleep", ["Skipping meals", "Ignoring feelings", "Bottling anger"]],
    ["Feeling nervous before a test is ___.", "Normal", ["Wrong", "Bad", "Weird"]],
    ["A growth mindset says ___.", "I can improve with effort", ["I'll never learn", "It's too hard", "I give up"]],
    ["A kind word can ___.", "Make someone's day", ["Hurt someone", "Make things worse", "Do nothing"]],
    ["It's okay to ask for help when ___.", "You need it", ["Never", "Only when alone", "Only if easy"]],
    ["A good listener ___.", "Pays attention", ["Interrupts always", "Looks away", "Talks over"]],
    ["Screen time in a day should be ___.", "Limited", ["Endless", "All night", "24 hours"]],
    ["The best way to learn is to ___.", "Keep practicing", ["Give up quickly", "Copy others", "Skip it"]],
    ["Which is not a feeling?", "Table", ["Happy", "Sad", "Angry"]],
    ["Which is a feeling?", "Excited", ["Chair", "Book", "Pen"]],
    ["When someone shares food, they are being ___.", "Generous", ["Rude", "Mean", "Selfish"]],
    ["When you finish a task, you feel ___.", "Proud", ["Angry", "Sad", "Hungry"]],
    ["Which shows respect?", "Listening when others speak", ["Interrupting", "Yelling", "Ignoring"]],
    ["Which shows honesty?", "Telling the truth", ["Lying", "Hiding things", "Cheating"]],
    ["Which shows courage?", "Standing up for what's right", ["Running away always", "Bullying", "Pretending"]],
    ["Setting a small goal each day helps you ___.", "Grow", ["Waste time", "Get bored", "Give up"]],
    ["Deep breathing is good when you feel ___.", "Anxious", ["Only sleepy", "Never", "Only hungry"]],
    ["If a friend hurts your feelings, you can ___.", "Tell them how you feel", ["Hit them", "Yell at them", "Ignore forever"]],
    ["Sitting up straight helps you ___.", "Focus better", ["Feel tired", "Ignore lessons", "Fall asleep"]],
    ["Eating slowly helps ___.", "Digestion", ["Nothing", "Choking", "Coughing"]],
    ["A good morning starts with ___.", "A stretch and water", ["Sugar and screens", "Yelling", "Skipping breakfast"]],
    ["Trying new food is a way to ___.", "Explore", ["Waste food", "Be picky", "Skip meals"]]
  ];
  const feelings = ["happy", "sad", "angry", "excited", "scared", "calm", "proud", "shy", "nervous", "grateful"];
  const helpfulActions = [
    ["feel calm", "take deep breaths"],
    ["feel less sad", "talk to someone you trust"],
    ["feel less angry", "count slowly to 10"],
    ["feel more focused", "get good sleep"],
    ["feel proud", "finish a small task"],
    ["feel less scared", "hold a loved one's hand"],
    ["stay healthy", "drink water and move"],
    ["build kindness", "help someone today"],
    ["improve at anything", "practice a little every day"],
    ["feel confident", "celebrate small wins"]
  ];
  function genMind(id) {
    const r = makeRng(id + 303);
    const kind = id % 4;
    const s = Math.floor(id / 4);
    if (kind === 0 || kind === 1) {
      const f = mindCurated[s % mindCurated.length];
      return mcq(f[0], f[1], f[2], r);
    }
    if (kind === 2) {
      const p = helpfulActions[s % helpfulActions.length];
      const others = helpfulActions.filter(x => x !== p);
      return mcq(`What is one good way to ${p[0]}?`, p[1],
        [others[(s * 3) % others.length][1],
         others[(s * 5 + 1) % others.length][1],
         "yell louder"], r);
    }
    // kind === 3: is X a feeling?
    const isFeel = s % 2 === 0;
    const feel = feelings[(s * 3) % feelings.length];
    const notFeel = ["table", "chair", "pencil", "book", "car", "shoe"][(s * 5) % 6];
    const term = isFeel ? feel : notFeel;
    return mcq(`Is '${term}' a feeling?`, isFeel ? "Yes" : "No",
      ["Sometimes", "Only in dreams", isFeel ? "No" : "Yes"], r);
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  const GEN = { maths: genMaths, science: genScience, english: genEnglish, mind: genMind };

  function currentUserId() {
    try {
      const u = window.LEW && window.LEW.getCurrentUser && window.LEW.getCurrentUser();
      return (u && u.id) || "anon";
    } catch { return "anon"; }
  }
  function seenKey(subject) { return `lew_seen_${currentUserId()}_${subject}`; }
  function loadSeen(subject) {
    try { return new Set(JSON.parse(localStorage.getItem(seenKey(subject)) || "[]")); }
    catch { return new Set(); }
  }
  function saveSeen(subject, set) {
    localStorage.setItem(seenKey(subject), JSON.stringify([...set]));
  }

  function pick(subject, count) {
    let gen = GEN[subject];
    if (!gen) {
      const fallbackKey = Object.keys(GEN)[0];
      gen = GEN[fallbackKey];
      if (!gen) return [];
      subject = fallbackKey;
    }
    let seen = loadSeen(subject);
    if (seen.size >= POOL_SIZE) {
      seen = new Set();
      saveSeen(subject, seen);
    }
    const picked = [];
    const rand = makeRng(Date.now() ^ (Math.random() * 0xffffffff));
    let attempts = 0;
    const maxAttempts = Math.max(500, count * 100);
    while (picked.length < count && attempts < maxAttempts) {
      const id = Math.floor(rand() * POOL_SIZE);
      if (!seen.has(id)) {
        seen.add(id);
        const q = gen(id);
        if (q) picked.push({ id, ...q });
      }
      attempts++;
    }
    if (picked.length < count) {
      for (let i = 0; i < POOL_SIZE && picked.length < count; i++) {
        if (!seen.has(i)) {
          seen.add(i);
          const q = gen(i);
          if (q) picked.push({ id: i, ...q });
        }
      }
    }
    saveSeen(subject, seen);
    return picked;
  }
  function remaining(subject) { return POOL_SIZE - loadSeen(subject).size; }
  function resetSeen(subject) { saveSeen(subject, new Set()); }
  function totalSeen(subject) { return loadSeen(subject).size; }

  window.LEW = window.LEW || {};
  window.LEW.QBank = {
    POOL_SIZE, SUBJECTS,
    pick, remaining, resetSeen, totalSeen
  };
})();
