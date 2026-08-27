/* Tiny Genius — content banks for Water, Bedtime, Mindful.
 * Each topic has a POOL_SIZE (5000) virtual pool with deterministic
 * generation from an id, plus curated seed content mixed in.
 * Seen ids are tracked in localStorage per user + topic so kids never
 * see the same tip twice until the whole pool has been explored.
 */
(function () {
  const POOL_SIZE = 5000;
  const TOPICS = ["water", "bedtime", "mindful"];

  function tip(emoji, title, body) { return { e: emoji, t: title, b: body }; }

  // ---------------------------------------------------------------
  // WATER
  // ---------------------------------------------------------------
  const waterCurated = [
    tip("💧", "Sip Time!", "Grab a glass of water. Your brain works better when you stay hydrated."),
    tip("🧠", "Water = Brain Power", "Your brain is about 75% water — sipping helps you focus."),
    tip("💪", "Strong Muscles", "Water helps your muscles work. Drink before running or playing!"),
    tip("😊", "Happy Skin", "Water keeps your skin soft and glowing. Sip through the day."),
    tip("🌡️", "Cool Down", "On hot days, water cools your body from the inside."),
    tip("🍎", "Water in Food", "Apples, cucumbers and watermelon are also full of water!"),
    tip("🦷", "Sparkly Teeth", "A sip of water after meals helps rinse your teeth."),
    tip("🥤", "Take a Bottle", "Carry a water bottle so you can sip anytime, anywhere."),
    tip("🚰", "Tap or Filter", "Clean tap or filtered water is perfect. No sugary drinks needed."),
    tip("🍋", "Fun Twist", "Add a slice of lemon or a berry to your water for a fruity flavor."),
    tip("⏰", "Every Hour", "Try sipping a small glass every hour you're awake."),
    tip("🏃", "Before Play", "Drink a glass before you go outside to play."),
    tip("🌞", "Morning Sip", "Start your day with a big glass of water — it wakes you up!"),
    tip("🌙", "Evening Sip", "Sip a little water an hour before bedtime (not too much!)."),
    tip("🎨", "Rainbow Cup", "Use a colorful cup — water tastes even better in your favorite one."),
    tip("🐳", "Whale of a Sip", "A blue whale drinks LOTS of water — you only need 6–8 cups!"),
    tip("🥒", "Cucumber Water", "Add cucumber slices for a spa-style drink."),
    tip("🍓", "Berry Water", "Squish a few strawberries in your water for a sweet twist."),
    tip("🧊", "Ice Ice, Baby", "A couple of ice cubes make water extra refreshing."),
    tip("🌿", "Mint Splash", "A leaf or two of fresh mint makes water taste amazing."),
    tip("💦", "Splash & Sip", "Wash your hands, then sip — clean and refreshed!"),
    tip("🏫", "School Sip", "Take a sip between classes to keep your brain sharp."),
    tip("🎒", "Backpack Buddy", "Pack a water bottle in your bag every morning."),
    tip("🐟", "Fish Fact", "Fish live IN water. You just need to drink it — easy!"),
    tip("🍇", "Grapes = Water", "Grapes are about 80% water — snack + hydrate!"),
    tip("🥕", "Crunchy Water", "Carrots are crunchy AND full of water."),
    tip("🌊", "Ocean Reminder", "Water is everywhere — even inside YOU."),
    tip("🚴", "Ride Ready", "Drink a glass before you ride your bike or scooter."),
    tip("🎉", "Party Sip", "Ask for water first at parties, then enjoy the treats."),
    tip("🥛", "Not Just Milk", "Milk and juice count a little, but plain water is the best hydrator."),
    tip("🍉", "Watermelon Wow", "Watermelon is 92% water — a juicy snack!"),
    tip("🦸", "Superhero Sip", "Superheroes drink water. Sip like a champion."),
    tip("🐘", "Elephant Fact", "Elephants drink 200 liters a day. You just need 6–8 cups!"),
    tip("🧗", "Climb Ready", "Sip water before climbing or doing PE."),
    tip("🎵", "Sip to the Beat", "Take one sip for every song you love today."),
    tip("🐒", "Monkey Move", "Water helps your body swing, run and jump like a monkey."),
    tip("🌈", "Rainbow of Fruits", "Water + fruit = tasty AND healthy hydration."),
    tip("📚", "Reading Time", "Keep a small cup near your book for reading sips."),
    tip("🎮", "Game Break", "Between game levels, take a water break."),
    tip("🍽️", "With Meals", "Have a small glass of water with breakfast, lunch and dinner.")
  ];
  const waterActivities = [
    "reading a book", "playing outside", "riding your bike", "doing homework",
    "brushing your teeth", "getting out of bed", "eating breakfast", "getting home from school",
    "washing your hands", "finishing a chore", "watching TV", "practising sports",
    "singing a song", "drawing a picture", "helping in the kitchen", "playing with pets",
    "dancing", "yoga", "building blocks", "solving a puzzle"
  ];
  const waterBenefits = [
    "helps your brain think clearly", "keeps your skin soft", "helps your body cool down",
    "gives you more energy", "helps your muscles move", "keeps your tummy happy",
    "helps you sleep better tonight", "makes you feel awake", "helps food digest",
    "keeps your teeth clean", "makes your eyes bright", "helps you grow strong"
  ];
  function genWater(id) {
    const kind = id % 4;
    const s = Math.floor(id / 4);
    if (kind === 0) return waterCurated[s % waterCurated.length];
    if (kind === 1) {
      const act = waterActivities[s % waterActivities.length];
      return tip("💧", "Sip Time!", `Take a sip of water before ${act} — it ${waterBenefits[s % waterBenefits.length]}.`);
    }
    if (kind === 2) {
      const cups = 4 + (s % 5);
      return tip("🥤", `Aim for ${cups}–${cups + 2} cups today`,
        `Try to drink ${cups}–${cups + 2} cups of water today. Small sips all day count!`);
    }
    const b = waterBenefits[s % waterBenefits.length];
    return tip("✨", "Water Power", `Water ${b}. Grab a glass and cheers to you!`);
  }

  // ---------------------------------------------------------------
  // BEDTIME
  // ---------------------------------------------------------------
  const bedtimeCurated = [
    tip("🌙", "Sweet Dreams", "Turn off screens 30 minutes before bed — your brain likes to wind down."),
    tip("📖", "Story Time", "A short story or a chapter of a book is the perfect end to your day."),
    tip("🛌", "Cozy Corner", "Fluff your pillow and snuggle in. Your bed is your safe cave."),
    tip("🧸", "Cuddle Buddy", "Give your favorite stuffed friend a big hug and a whispered secret."),
    tip("🌟", "Star Gazing", "Look up at the stars for 2 minutes — they've been shining for you all night."),
    tip("🎶", "Quiet Song", "Hum a slow tune. Your body relaxes when you slow the melody."),
    tip("🕯️", "Warm Light", "Dim, warm lights help your brain know it's time to rest."),
    tip("🫁", "Belly Breaths", "Put your hand on your belly and take 5 slow, deep breaths."),
    tip("🌸", "Nice Smells", "A little lavender or a flower by your bed can help you drift off."),
    tip("🐑", "Counting Sheep", "Picture fluffy sheep hopping over a fence. 1... 2... 3..."),
    tip("💭", "Happy Memory", "Think of one happy thing that happened today and smile."),
    tip("🙏", "Say Thanks", "Whisper 3 things you were thankful for today."),
    tip("💤", "Slow Blinks", "Blink slowly 5 times — your eyes get sleepier each blink."),
    tip("🌜", "Moon Watch", "Peek at the moon out your window — she says goodnight too."),
    tip("🐢", "Turtle Pace", "Do everything slowly at bedtime — walk, talk, brush like a turtle."),
    tip("🧦", "Warm Toes", "Warm toes = fast sleep. Cozy socks can help!"),
    tip("🧘", "Body Scan", "Wiggle your toes, then relax them. Do that all the way up to your head."),
    tip("🎨", "Dream Design", "Pick something happy to dream about — a beach, a puppy, flying!"),
    tip("🌊", "Ocean Waves", "Imagine soft ocean waves rolling in and out with your breath."),
    tip("🐻", "Bear Hibernate", "Bears rest all winter. Rest helps YOU grow just like them."),
    tip("🚂", "Choo-Choo", "Imagine a train slowly rolling away — that's your busy thoughts leaving."),
    tip("🌌", "Galaxy Ride", "Picture floating through space, planet by planet, until you drift off."),
    tip("💌", "Kind Note", "Write or think one kind thing about yourself before bed."),
    tip("🍵", "Warm Sip", "A tiny cup of warm milk or herbal tea can help you feel cozy."),
    tip("🎈", "Balloon Release", "Imagine putting a worry in a balloon and letting it float away."),
    tip("🌳", "Big Tree", "Picture standing under a huge tree — safe, quiet, calm."),
    tip("🐨", "Koala Snuggle", "Koalas sleep 18–22 hours a day. They know rest matters!"),
    tip("🦉", "Wise Owl", "The wise owl says: a good sleep = a great tomorrow."),
    tip("🎠", "Slow Carousel", "Imagine a slow carousel going round and round... round and round..."),
    tip("🕊️", "Peaceful Wings", "Picture a soft white bird gliding across the sky. Follow it with your eyes closed."),
    tip("🫧", "Bubble Wrap", "Imagine you're inside a warm, glowing bubble — safe and sound."),
    tip("🍯", "Golden Honey", "Picture warm honey slowly filling you from toes to head."),
    tip("🐕", "Puppy Nap", "Puppies curl up tight to sleep. Try curling up like one!"),
    tip("🎵", "Lullaby", "Hum a lullaby you loved as a little one."),
    tip("🌵", "Desert Night", "Picture a quiet desert night — cool wind, silver moon, silence."),
    tip("🐳", "Whale Song", "Whales sing gentle songs across the ocean. Imagine one now."),
    tip("🍇", "No Sugar", "Try to avoid sweets right before bed — they wake your brain up."),
    tip("🚿", "Warm Bath", "A warm shower or bath before bed helps you feel sleepy."),
    tip("🎁", "Tomorrow Gift", "Think about one small thing to look forward to tomorrow."),
    tip("🐟", "Fish Float", "Imagine floating in warm calm water like a tiny fish."),
    tip("🌾", "Wheat Field", "Picture golden wheat swaying softly in a gentle breeze."),
    tip("🎪", "End of Show", "The day is done. Time for the curtain to close on today.")
  ];
  const bedtimeVisualizations = [
    "a soft cloud carrying you across the sky",
    "a slow river running through a quiet forest",
    "a gentle horse walking through a meadow",
    "a tiny boat rocking on calm water",
    "a warm campfire crackling under stars",
    "a peaceful garden with fireflies",
    "a cozy cabin in the snowy mountains",
    "a hammock swinging between two palm trees",
    "a rainbow bridge to a dream castle",
    "a train chugging slowly through the countryside",
    "a hot air balloon drifting over rolling hills",
    "a soft snowfall on a quiet street",
    "a moonlit beach with tiny waves",
    "a magical tree house up in the leaves",
    "a paper lantern floating up into a dark sky",
    "a lazy sailboat under a crescent moon",
    "a sleeping village lit by lamp posts",
    "a starlit lake reflecting the sky",
    "a fluffy owl sitting quietly on a branch",
    "a warm blanket fort with a friend"
  ];
  const bedtimeActions = [
    "close your eyes", "take a slow breath", "wiggle your toes and let them go",
    "roll your shoulders down", "unclench your jaw", "smile a tiny bit",
    "picture your happiest place", "count your slow breaths", "listen to your own breathing",
    "let your arms feel heavy", "let your legs feel heavy", "let your face feel soft"
  ];
  function genBedtime(id) {
    const kind = id % 4;
    const s = Math.floor(id / 4);
    if (kind === 0) return bedtimeCurated[s % bedtimeCurated.length];
    if (kind === 1) {
      const v = bedtimeVisualizations[s % bedtimeVisualizations.length];
      return tip("🌙", "Sleepy Picture", `Close your eyes and imagine ${v}. Watch it slowly, slowly move...`);
    }
    if (kind === 2) {
      const a = bedtimeActions[s % bedtimeActions.length];
      return tip("🛌", "Gentle Step", `Ready for sleep? Try this: ${a}. Then take one more slow breath.`);
    }
    const hours = 8 + (s % 4);
    return tip("💤", "Kids Need Sleep", `Kids your age need about ${hours} hours of sleep. Your brain grows while you rest!`);
  }

  // ---------------------------------------------------------------
  // MINDFUL
  // ---------------------------------------------------------------
  const mindfulCurated = [
    tip("🧘", "Breathe In... Out", "Close your eyes. Breathe in for 4, hold for 4, out for 4. Doing amazing!"),
    tip("🌬️", "Balloon Breath", "Breathe in — belly fills like a balloon. Breathe out — balloon slowly deflates."),
    tip("🐝", "Bee Breath", "Take a deep breath in, then hum like a bee as you breathe out."),
    tip("👐", "Star Hands", "Spread your fingers wide like stars. Breathe in on one finger, out on the next."),
    tip("🌸", "Smell the Flower", "Pretend to smell a flower... then blow out a candle. Slow and calm."),
    tip("🦁", "Lion Breath", "Big breath in! Then stick your tongue out and roar softly. So silly!"),
    tip("🌊", "Wave Breath", "Breathe like a wave rolling in... and rolling out. Slow and steady."),
    tip("👂", "Sound Hunt", "Sit quietly. Can you hear 3 different sounds around you? Listen close."),
    tip("👀", "Color Hunt", "Look around and find 5 things that are your favorite color."),
    tip("🖐️", "5 Senses Check", "Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste."),
    tip("🌈", "Rainbow Breath", "Breathe in — arms rise up like a rainbow. Breathe out — arms drop gently."),
    tip("🐢", "Turtle Time", "Move like a slow turtle for 30 seconds. Everything slow. Ahhh."),
    tip("🌟", "Star Stretch", "Stand tall, arms out like a star. Breathe deep 3 times. You shine!"),
    tip("🐒", "Shake It Out", "Wiggle your fingers, arms, then whole body. Now stand still. Feel calm."),
    tip("💗", "Kind Heart", "Put a hand on your heart. Say: 'I am kind. I am safe. I am loved.'"),
    tip("🫧", "Thought Bubble", "See a worry? Put it in a bubble and watch it float away."),
    tip("🧊", "Ice Cube", "Hold something cold for 10 seconds. Notice how it feels. That's mindfulness!"),
    tip("🌱", "Grow Tall", "Sit like a seed. Slowly grow into a tall tree — arms up as leaves."),
    tip("😌", "Soft Face", "Let your forehead, eyes and jaw go soft. Ahhh, that's better."),
    tip("🎨", "Color a Feeling", "What color is your mood right now? Picture it — that's YOU today."),
    tip("🐘", "Elephant Ears", "Wiggle your ears (or pretend!). Elephants are calm, wise and strong."),
    tip("🌤️", "Cloud Watching", "Look up. Watch a cloud for a full minute. Slow. Quiet. Beautiful."),
    tip("🕰️", "One Minute", "Set a timer for one minute. Just sit and breathe. That's your calm minute."),
    tip("🐌", "Slow Walk", "Walk 5 steps as slowly as you can. Feel each foot press the ground."),
    tip("🎈", "Balloon Away", "Blow up a pretend balloon with all your worries — then let it fly away."),
    tip("🌵", "Cactus Stand", "Stand tall like a cactus. Steady. Strong. Rooted."),
    tip("🎵", "Humming Time", "Hum your favorite song for 30 seconds. Feel the buzz inside."),
    tip("🍋", "Lemon Squeeze", "Squeeze your fists like lemons for 5 seconds. Then let go. Aaah, relaxed."),
    tip("🌙", "Moon Breath", "Breathe in through your nose. Long slow breath out through your mouth."),
    tip("🌻", "Sunny Thought", "Think of one thing that makes you smile. Hold it for 10 seconds."),
    tip("🦋", "Butterfly Hug", "Cross your arms over your chest. Tap left, right, left, right — like flapping wings."),
    tip("💫", "Sparkle Breath", "Breathe in stars. Breathe out any yuck. Repeat 3 times."),
    tip("🌳", "Root Down", "Feet flat on the floor. Imagine roots growing from your feet into the ground."),
    tip("🐟", "Fish Breath", "Purse your lips like a fish. Slowly blow out bubbles — one, two, three."),
    tip("🎁", "Gratitude Gift", "Give yourself a gift: name 3 tiny things that were good today."),
    tip("🌵", "Prickle to Pillow", "Tense your body tight like a cactus... then flop like a soft pillow."),
    tip("🦉", "Wise Pause", "Before answering, take one breath. That's a wise owl move."),
    tip("🌊", "Belly Sea", "Lie down. Rest a book on your belly. Watch it rise and fall with your breath."),
    tip("🐿️", "Squirrel Focus", "Pick one small object. Look at it for 20 seconds. Notice its details."),
    tip("🎋", "Bamboo Bend", "Sway side to side like bamboo in the wind. Loose, easy, calm.")
  ];
  const mBreaths = [
    { name: "Box Breath", i: 4, h: 4, o: 4, hold: 4 },
    { name: "Calm Breath", i: 4, h: 2, o: 6, hold: 0 },
    { name: "Sleepy Breath", i: 4, h: 7, o: 8, hold: 0 },
    { name: "Focus Breath", i: 5, h: 0, o: 5, hold: 0 },
    { name: "Balloon Breath", i: 4, h: 0, o: 6, hold: 0 },
    { name: "Ocean Breath", i: 5, h: 2, o: 5, hold: 0 },
    { name: "Star Breath", i: 3, h: 3, o: 3, hold: 3 }
  ];
  const mAffirmations = [
    "I am kind.", "I am brave.", "I am learning.", "I am safe.",
    "I can try new things.", "My mistakes help me grow.", "I am loved.",
    "I am strong.", "I can do hard things.", "I am proud of me.",
    "My feelings are okay.", "I choose calm.", "I am a good friend.",
    "I am curious.", "I am creative.", "I matter.", "Today is a fresh start.",
    "I can be still.", "I am enough.", "I can breathe through anything."
  ];
  function genMindful(id) {
    const kind = id % 4;
    const s = Math.floor(id / 4);
    if (kind === 0) return mindfulCurated[s % mindfulCurated.length];
    if (kind === 1) {
      const b = mBreaths[s % mBreaths.length];
      const hold = b.hold ? `, hold ${b.hold}` : '';
      const holdMid = b.h ? `, hold ${b.h}` : '';
      return tip("🌬️", b.name,
        `Try the ${b.name}: breathe in for ${b.i}${holdMid}, out for ${b.o}${hold}. Repeat 3 times.`);
    }
    if (kind === 2) {
      const a = mAffirmations[s % mAffirmations.length];
      return tip("💗", "Kind Words", `Say it inside: "${a}" — softly, 3 times.`);
    }
    return mindfulCurated[(s + 5) % mindfulCurated.length];
  }

  // ---------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------
  const GEN = {
    water:   genWater,
    bedtime: genBedtime,
    mindful: genMindful
  };

  function currentUserId() {
    try {
      const u = window.LEW && window.LEW.getCurrentUser && window.LEW.getCurrentUser();
      return (u && u.id) || "anon";
    } catch { return "anon"; }
  }
  function seenKey(topic) { return `lew_seen_${currentUserId()}_tiny_${topic}`; }
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
    for (let i = 0; i < 200; i++) {
      const c = Math.floor(Math.random() * POOL_SIZE);
      if (!seen.has(c)) { id = c; break; }
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
    const item = gen(id) || { e: "✨", t: "Little Tip", b: "Something wonderful is out there — try again!" };
    return { id, ...item };
  }
  function totalSeen(topic) { return loadSeen(topic).size; }
  function resetSeen(topic) { saveSeen(topic, new Set()); }

  window.LEW = window.LEW || {};
  window.LEW.TinyBank = {
    POOL_SIZE, TOPICS,
    pick, totalSeen, resetSeen
  };
})();
