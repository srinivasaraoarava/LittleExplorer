/* Household activities bank for Tiny Genius.
 *
 *   POOL_SIZE  : 1000 unique simple, kid-friendly household tasks
 *   TASKS_PER_DAY : 5
 *
 * Every calendar day the same 5 tasks are shown (deterministic per user +
 * date), and completing all 5 awards ONE star. Completed lists are
 * remembered so tasks don't repeat until the whole pool cycles.
 */
(function () {
  const POOL_SIZE = 1000;
  const TASKS_PER_DAY = 5;

  function t(e, title, note) { return { e, t: title, b: note || "" }; }

  // ---------------- Curated core tasks -----------------------
  const curated = [
    // --- Bedroom / Room ---
    t("🛏️", "Make your bed", "Straighten the sheet and fluff the pillow."),
    t("🧸", "Put toys away", "Pop your toys back in their boxes or baskets."),
    t("📚", "Line up your books", "Put your books neatly on the shelf."),
    t("🪟", "Wipe your window", "Take a soft cloth and gently wipe your window."),
    t("🧺", "Pop laundry in the basket", "Toss any dirty clothes into the laundry basket."),
    t("👕", "Fold 3 shirts", "Neatly fold 3 of your t-shirts."),
    t("🧦", "Match all the socks", "Turn every sock right-side out and match up the pairs."),
    t("🧹", "Sweep your bedroom", "Grab a small broom and sweep the floor."),
    t("🧴", "Tidy your desk", "Put pencils in the cup and books in a pile."),
    t("🎨", "Sort your art supplies", "Put crayons, markers and pens in their spots."),
    t("🛋️", "Fluff the couch pillows", "Puff up the pillows on the sofa."),
    t("🧦", "Match all the socks", "Turn socks right side out and match pairs."),
    t("🧴", "Wipe the door handles", "Give the door handles a quick clean with a damp cloth."),
    t("🧼", "Wipe your desk", "Wipe the top of your desk with a soft cloth."),
    t("💡", "Turn off unused lights", "Walk through the house and switch off any lights nobody is using."),

    // --- Kitchen ---
    t("🍽️", "Set the table", "Place a plate, fork and spoon for each person."),
    t("🥄", "Clear your plate", "Take your plate to the sink after eating."),
    t("🧽", "Wipe the table", "Use a damp cloth to wipe crumbs off the table."),
    t("🥛", "Refill the water jug", "Fill up the water jug and put it in the fridge."),
    t("🍎", "Wash 3 apples", "Rinse 3 apples and put them in the fruit bowl."),
    t("🥕", "Wash the carrots", "Rinse veggies under cool water for a grown-up."),
    t("🍞", "Get the bread out", "Take the bread out of the bag for breakfast."),
    t("🥣", "Pour cereal for yourself", "Get a bowl, pour cereal and a splash of milk."),
    t("🍌", "Peel a banana snack", "Peel a banana and enjoy — bin goes in the compost!"),
    t("🥗", "Toss the salad", "Give the salad a gentle mix with the tongs."),
    t("🍽️", "Load 5 plates in the sink", "Rinse and stack plates so a grown-up can wash them."),
    t("🥤", "Fill up the water bottle", "Fill your water bottle and pop it in your bag."),
    t("🍇", "Put fruit in the bowl", "Arrange the fresh fruit in the bowl."),
    t("🧊", "Fill the ice tray", "Fill the ice cube tray and put it in the freezer."),
    t("🍪", "Bake cookies (with grown-up)", "Help mix cookie dough with a grown-up."),
    t("🍳", "Whisk eggs", "Crack and whisk eggs into a bowl."),

    // --- Cleaning ---
    t("🧹", "Sweep the kitchen floor", "Sweep up crumbs and bits from the kitchen."),
    t("🧻", "Refill the tissue box", "Put a fresh tissue box out for the family."),
    t("🗑️", "Empty the small bins", "Empty the little bins into the big trash bag."),
    t("🚽", "Wipe the bathroom sink", "Give the sink a quick swipe with a cloth."),
    t("🪥", "Rinse your toothbrush cup", "Rinse the toothbrush holder under water."),
    t("🧼", "Refill the soap dispenser", "Fill up the hand-soap dispenser."),
    t("🪞", "Wipe the mirror", "Spray a little cleaner and wipe the mirror."),
    t("🧽", "Wipe the light switches", "Give the switches a gentle wipe."),
    t("🧴", "Restock hand soap", "Make sure every sink has soap ready."),
    t("🧺", "Sort dirty clothes", "Separate lights and darks into two piles."),
    t("👖", "Match all the socks", "Turn socks right-side out and pair them up."),
    t("🧻", "Roll up loose toilet paper", "Neaten up the toilet paper in the bathroom."),

    // --- Garden / Outside ---
    t("🌱", "Water the plants", "Give indoor plants a small drink of water."),
    t("🌻", "Water the flowers", "Water your favorite flowers in the garden."),
    t("🍅", "Water the veggies", "Give the vegetable patch a gentle water."),
    t("🌿", "Pull 3 weeds", "Find and pull 3 tiny weeds from the garden."),
    t("🍂", "Rake some leaves", "Rake fallen leaves into a small pile."),
    t("🪴", "Move a plant to sunlight", "Help move a plant to a sunnier spot."),
    t("🐦", "Refill the bird feeder", "Add seeds to the bird feeder."),
    t("🌳", "Say hi to a tree", "Give a tree a hug and tell it thanks!"),
    t("🐛", "Bug hunt", "Find 3 different bugs outside and count their legs."),
    t("🚗", "Wipe the car windows", "Wipe car windows with a soft cloth."),
    t("🌸", "Pick 3 flowers for the vase", "Pick a small bunch for the kitchen vase."),
    t("🪣", "Wash the outdoor toys", "Rinse outdoor toys with the hose."),

    // --- Pets ---
    t("🐕", "Feed the dog", "Fill the dog's bowl with food."),
    t("🐈", "Feed the cat", "Fill the cat's bowl with food."),
    t("🐟", "Feed the fish", "Give the fish a small pinch of food."),
    t("🐇", "Give the bunny greens", "Give the bunny a leaf of lettuce."),
    t("🦎", "Check the lizard", "Say hi to the lizard and check its water."),
    t("🐦", "Refill the bird water", "Put fresh water in the bird's bowl."),
    t("🚶", "Walk the dog with a grown-up", "Take the dog for a short walk."),
    t("🐕", "Brush the dog", "Give your dog a gentle brush."),
    t("🐈", "Play with the cat", "Wiggle a toy for the cat for 5 minutes."),
    t("🧴", "Refill the pet water", "Top up your pet's water bowl."),

    // --- School / Homework ---
    t("✏️", "Finish today's homework", "Sit down and finish your homework."),
    t("📖", "Read for 15 minutes", "Pick a book and read for 15 quiet minutes."),
    t("🎒", "Pack your bag", "Pack your school bag for tomorrow."),
    t("📝", "Practice spelling words", "Say and write your spelling words twice."),
    t("🔢", "Practice math facts", "Practice your times tables or additions for 10 minutes."),
    t("🖍️", "Colour for 15 minutes", "Do some quiet colouring."),
    t("📓", "Write in your journal", "Write 3 sentences about your day."),
    t("🌐", "Learn a new word", "Learn one new big word and use it in a sentence."),
    t("🎯", "Set a small goal", "Pick one goal for tomorrow."),
    t("🎨", "Make a quick drawing", "Draw something that made you smile today."),

    // --- Self-care ---
    t("🦷", "Brush your teeth", "Brush your teeth for 2 whole minutes."),
    t("🚿", "Take a shower or bath", "Have a clean, cozy wash."),
    t("👐", "Wash your hands well", "Sing 'Happy Birthday' while washing hands."),
    t("💅", "Trim your nails (with help)", "Ask a grown-up to help trim your nails."),
    t("👖", "Choose tomorrow's clothes", "Pick and lay out your outfit for tomorrow."),
    t("🥤", "Drink a glass of water", "Have a full glass of water right now."),
    t("🍎", "Eat 1 piece of fruit", "Pick a fruit for a healthy snack."),
    t("🥦", "Try one bite of veggies", "Take a taste of vegetables at your next meal."),
    t("🧘", "Do 3 slow breaths", "Sit quietly and take 3 deep breaths."),
    t("😴", "Get to bed on time", "Tuck in when it's bedtime — no fuss!"),

    // --- Family / Kindness ---
    t("🤗", "Give a family hug", "Give someone in your family a big hug."),
    t("💌", "Write a thank-you note", "Write a small thank-you to someone."),
    t("💬", "Ask about their day", "Ask a family member how their day was."),
    t("🎁", "Do a secret good deed", "Do something helpful and don't tell anyone!"),
    t("🌈", "Pay a compliment", "Say something nice to two people today."),
    t("🧸", "Share a toy", "Let a sibling or friend play with a toy."),
    t("👴", "Call a grandparent", "Say hi to a grandparent — video or phone."),
    t("😄", "Tell a joke", "Make someone in your family laugh."),
    t("🎵", "Sing a song", "Sing your favourite song to the family."),
    t("🙏", "Say sorry if needed", "If you upset someone, kindly say sorry."),

    // --- Movement / Fun ---
    t("💃", "Dance for 5 minutes", "Put on a fun song and dance!"),
    t("🏃", "10 star jumps", "Try 10 star jumps in a row."),
    t("🚴", "Ride your bike", "Ride your bike (with a helmet!)."),
    t("⚽", "Kick a ball 20 times", "Practice kicking a ball 20 times."),
    t("🤸", "10 tummy sit-ups", "Try 10 sit-ups on a soft mat."),
    t("🏀", "Bounce a ball 30 times", "Bounce a ball 30 times without dropping it."),
    t("🪀", "Yo-yo 10 times", "Try 10 yo-yo pulls."),
    t("🎨", "Draw with chalk outside", "Draw with sidewalk chalk for 15 minutes."),
    t("🐒", "Do 20 monkey jumps", "Jump like a monkey 20 times."),
    t("🧗", "Stretch tall like a tree", "Reach as high as you can 10 times.")
  ];

  // ---------------- Template pieces --------------------------
  const rooms = [
    "bedroom", "living room", "kitchen", "bathroom", "playroom",
    "hallway", "study", "dining room", "garage", "porch"
  ];
  const roomEmoji = {
    "bedroom": "🛏️", "living room": "🛋️", "kitchen": "🍽️",
    "bathroom": "🚿", "playroom": "🧸", "hallway": "🚪",
    "study": "📚", "dining room": "🍴", "garage": "🚗", "porch": "🌿"
  };
  const smallItems = [
    ["toys", "🧸"], ["books", "📚"], ["shoes", "👟"], ["clothes", "👕"],
    ["pillows", "🛏️"], ["cushions", "🛋️"], ["blocks", "🧱"], ["puzzle pieces", "🧩"],
    ["stuffed animals", "🧸"], ["art supplies", "🎨"], ["colouring books", "🖍️"],
    ["board games", "🎲"], ["hair accessories", "🎀"], ["socks", "🧦"]
  ];
  const tinyCounts = [3, 5, 7, 10];
  const readingMins = [5, 10, 15, 20];
  const readingBooks = [
    "a story book", "a comic", "your favourite picture book",
    "a magazine", "a chapter book", "a poetry book"
  ];
  const kindnessTargets = [
    ["a sibling", "🧒"], ["mom", "👩"], ["dad", "👨"], ["grandma", "👵"],
    ["grandpa", "👴"], ["a friend", "👯"], ["your pet", "🐾"], ["your teacher", "🧑‍🏫"],
    ["a neighbour", "🏠"]
  ];
  const kindnessDeeds = [
    "give a big smile", "give a hug", "say something kind",
    "share a snack", "help carry something", "hold the door open",
    "draw them a picture", "say thank you"
  ];
  const drinks = [
    "a glass of water", "a mug of warm milk", "a cup of herbal tea",
    "a big sip of water", "a small juice", "a smoothie"
  ];
  const fruits = ["🍎 apple", "🍌 banana", "🍇 grapes", "🍓 strawberries",
                  "🍊 orange", "🥝 kiwi", "🍉 watermelon", "🍑 peach",
                  "🍍 pineapple", "🫐 blueberries"];
  const veggies = ["🥕 carrot", "🥦 broccoli", "🌽 corn", "🍅 tomato",
                   "🥒 cucumber", "🌶️ pepper", "🥬 lettuce", "🥔 potato"];
  const gardenPlants = ["🌻 sunflowers", "🌷 tulips", "🌹 roses", "🌵 cactus",
                        "🍅 tomato plants", "🌿 herbs", "🌱 tiny seedlings"];
  const pets = [["dog","🐕"],["cat","🐈"],["fish","🐟"],["bunny","🐇"],
                ["hamster","🐹"],["bird","🐦"],["guinea pig","🐹"]];
  const petActions = ["feed", "give water to", "brush", "play with", "clean up after"];
  const exerciseMoves = [
    ["jumping jacks", "🤸"], ["star jumps", "⭐"], ["skips", "🪢"],
    ["hop-on-one-foot", "🦩"], ["squats", "🏋️"], ["push-ups", "💪"],
    ["dance moves", "💃"], ["stretches", "🧘"], ["balance-on-one-leg seconds", "🧍"]
  ];
  const exerciseCounts = [10, 15, 20, 25, 30];
  const cleanupVerbs = ["Tidy up", "Neaten up", "Organize", "Put away", "Straighten"];

  // ---------------- Procedural generation --------------------
  function gen(id) {
    // Base: rotate through 8 template kinds
    const kind = id % 8;
    const s = Math.floor(id / 8);

    if (kind === 0) {
      // Curated
      return curated[s % curated.length];
    }
    if (kind === 1) {
      // Tidy N items in a room
      const item = smallItems[s % smallItems.length];
      const room = rooms[(s * 3) % rooms.length];
      const count = tinyCounts[(s * 7) % tinyCounts.length];
      const verb = cleanupVerbs[s % cleanupVerbs.length];
      return t(item[1], `${verb} ${count} ${item[0]}`,
        `Put ${count} ${item[0]} back where they belong in the ${room}.`);
    }
    if (kind === 2) {
      // Reading
      const mins = readingMins[s % readingMins.length];
      const book = readingBooks[(s * 3) % readingBooks.length];
      return t("📚", `Read for ${mins} minutes`, `Curl up with ${book} and read quietly for ${mins} minutes.`);
    }
    if (kind === 3) {
      // Kindness deed
      const who = kindnessTargets[s % kindnessTargets.length];
      const deed = kindnessDeeds[(s * 5) % kindnessDeeds.length];
      return t(who[1], `Kind moment`, `Today, ${deed} for ${who[0]}. Little kindnesses matter!`);
    }
    if (kind === 4) {
      // Healthy eating
      const which = s % 2;
      if (which === 0) {
        const f = fruits[s % fruits.length];
        return t("🍎", `Eat 1 piece of fruit`, `Have some ${f} today — nature's snack!`);
      } else {
        const v = veggies[s % veggies.length];
        return t("🥦", `Try some ${v.split(' ')[1] || 'veggies'}`, `Have a small taste of ${v} at your next meal.`);
      }
    }
    if (kind === 5) {
      // Garden / plants
      const plant = gardenPlants[s % gardenPlants.length];
      const verb = s % 2 === 0 ? "Water" : "Say hello to";
      return t("🌱", `${verb} the ${plant.split(' ').slice(1).join(' ')}`,
        `Head outside and ${verb.toLowerCase()} the ${plant}.`);
    }
    if (kind === 6) {
      // Pet care
      const p = pets[s % pets.length];
      const action = petActions[(s * 3) % petActions.length];
      return t(p[1], `${cap(action)} the ${p[0]}`, `Give the ${p[0]} some love — ${action} them today.`);
    }
    if (kind === 7) {
      // Movement
      const move = exerciseMoves[s % exerciseMoves.length];
      const count = exerciseCounts[(s * 5) % exerciseCounts.length];
      return t(move[1], `Do ${count} ${move[0]}`, `Get moving! Do ${count} ${move[0]} in a row.`);
    }
    // Fallback (shouldn't hit)
    return curated[s % curated.length];
  }

  function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

  // ---------------- Daily list logic ------------------------
  function currentUserId() {
    try {
      const u = window.LEW && window.LEW.getCurrentUser && window.LEW.getCurrentUser();
      return (u && u.id) || "anon";
    } catch { return "anon"; }
  }
  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function todayStorageKey() {
    return `lew_household_${currentUserId()}_today`;
  }
  function seenStorageKey() {
    return `lew_household_${currentUserId()}_seen`;
  }
  function starsStorageKey() {
    return `lew_household_${currentUserId()}_starDays`;
  }

  function loadSeen() {
    try { return new Set(JSON.parse(localStorage.getItem(seenStorageKey()) || "[]")); }
    catch { return new Set(); }
  }
  function saveSeen(set) {
    localStorage.setItem(seenStorageKey(), JSON.stringify([...set]));
  }

  // Small seeded PRNG so we can regenerate a stable daily list even
  // without persisting IDs — but we still persist the picked list for
  // quick, consistent load.
  function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function makeRng(seed) {
    let s = seed || 1;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickFreshIds(count) {
    let seen = loadSeen();
    if (seen.size >= POOL_SIZE) {
      seen = new Set();
    }
    const key = `${currentUserId()}|${todayKey()}`;
    const rng = makeRng(hashSeed(key));
    const picked = [];
    let attempts = 0;
    const maxAttempts = POOL_SIZE * 3;
    while (picked.length < count && attempts < maxAttempts) {
      const id = Math.floor(rng() * POOL_SIZE);
      if (!seen.has(id) && !picked.includes(id)) {
        picked.push(id);
        seen.add(id);
      }
      attempts++;
    }
    if (picked.length < count) {
      for (let i = 0; i < POOL_SIZE && picked.length < count; i++) {
        if (!seen.has(i) && !picked.includes(i)) {
          picked.push(i);
          seen.add(i);
        }
      }
    }
    saveSeen(seen);
    return picked;
  }

  function loadTodayRecord() {
    try {
      const raw = localStorage.getItem(todayStorageKey());
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }
  function saveTodayRecord(rec) {
    localStorage.setItem(todayStorageKey(), JSON.stringify(rec));
  }

  function getToday() {
    const dayKey = todayKey();
    let rec = loadTodayRecord();
    if (!rec || rec.date !== dayKey) {
      const ids = pickFreshIds(TASKS_PER_DAY);
      rec = {
        date: dayKey,
        ids,
        done: ids.map(() => false),
        awarded: false
      };
      saveTodayRecord(rec);
    }
    const items = rec.ids.map((id, idx) => ({
      id,
      index: idx,
      done: !!rec.done[idx],
      ...gen(id)
    }));
    return {
      date: rec.date,
      awarded: !!rec.awarded,
      items,
      completed: rec.done.filter(Boolean).length,
      total: rec.ids.length
    };
  }

  function toggleDone(index, done) {
    const rec = loadTodayRecord();
    if (!rec) return null;
    if (index < 0 || index >= rec.ids.length) return null;
    rec.done[index] = !!done;
    saveTodayRecord(rec);
    return getToday();
  }

  function markAwarded() {
    const rec = loadTodayRecord();
    if (!rec) return;
    rec.awarded = true;
    saveTodayRecord(rec);
  }

  function totalStarDays() {
    try {
      return parseInt(localStorage.getItem(starsStorageKey()) || "0", 10) || 0;
    } catch { return 0; }
  }
  function bumpStarDays() {
    const n = totalStarDays() + 1;
    localStorage.setItem(starsStorageKey(), String(n));
    return n;
  }

  function resetToday() {
    const rec = loadTodayRecord();
    if (!rec) return getToday();
    rec.done = rec.ids.map(() => false);
    rec.awarded = false;
    saveTodayRecord(rec);
    return getToday();
  }

  window.LEW = window.LEW || {};
  window.LEW.Household = {
    POOL_SIZE,
    TASKS_PER_DAY,
    getToday,
    toggleDone,
    markAwarded,
    totalStarDays,
    bumpStarDays,
    todayKey,
    resetToday
  };
})();
