import type { SeoPageDefinition } from "@/config/types";

const lastReviewed = "2026-11-06";
const wiki = "https://robloxgamewiki.wiki/games/build-a-striker";
const patchHistory = { label: "Roblox Wiki patch history", url: `${wiki}/updates/` };
const walkthrough = { label: "Roblox Wiki beginner walkthrough", url: `${wiki}/guides/beginner-guide/` };

export const updateGuides: SeoPageDefinition[] = [
  {
    enabled: true,
    slug: "chemistry",
    pageType: "article",
    navLabel: "Chemistry",
    navVisible: false,
    lastReviewed,
    title: "Build A Striker All Chemistry – Links, Bonuses & Guide",
    description: "Find documented Build A Striker Chemistry links, all four bonus tiers, and how to check player requirements in Collection and the Chemistry Board.",
    hero: {
      heading: "All Chemistry in Build A Striker",
      lead: "Build A Striker Chemistry boosts the stats tied to a link when you pick the right players in one build. Start with the 12 publicly named links below, then search Collection for the exact players and use the Chemistry Board to see which stats get the boost.",
    },
    showToc: true,
    sources: [{ label: "Roblox Wiki Chemistry reference", url: `${wiki}/wiki/chemistry/` }],
    sections: [
      {
        id: "chemistry-links",
        heading: "All Chemistry Links Currently Documented",
        intro: "This index covers names in the October 24 and October 31, 2026 patch summaries, reviewed November 6. The launch summary reported 80 discoverable links at the time, and the England patch named ten additions. The public notes leave most player requirements and link-specific tiers unspecified. Search the exact name in Collection for the current recipe, then check the Board in your build for the affected stats.",
        table: {
          caption: "12 publicly named Chemistry links, grouped by patch",
          columns: ["Link to search", "Patch group", "Players and bonus"],
          rows: [
            ...["Army of Knights", "England U-20", "Idiot to Infinity", "One to Infinity", "Zero to One"].map(
              (name) => [name, "Oct. 31 · England links", "Check Collection and Board"],
            ),
            ...["Joker Formation", "Monster’s Steal", "The First Cut", "The Summit", "The Supreme Clown"].map(
              (name) => [name, "Oct. 31 · Other additions", "Check Collection and Board"],
            ),
            ...["Genius and Devil", "World 5"].map(
              (name) => [name, "Oct. 24 · Launch examples", "Check Collection and Board"],
            ),
          ],
        },
        paragraphs: [
          "To discover a link, select the required players in the same build. Collection tracks discoveries and shows available rewards and milestones. For a hidden entry, the public guide describes a paid hint that reveals one player. Check what Collection already shows before spending Yen or Robux on a hint.",
        ],
      },
      {
        id: "bonus-tiers",
        heading: "Chemistry Bonus Tiers",
        table: {
          caption: "Reported increases to linked stats",
          columns: ["Tier", "Stat increase", "How to compare it"],
          rows: [
            ["Spark", "+8", "A useful small boost when it fits your existing picks."],
            ["Reaction", "+13", "Check whether it covers the stat you’re building around."],
            ["Chain Reaction", "+18", "Compare the resulting stat with your strongest immediate pick."],
            ["Flow", "+30", "The largest reported tier. Check the affected stats and the cost of chasing it."],
          ],
        },
        paragraphs: [
          "These values describe the boost to linked stats. Use Collection for the required lineup and the Board for which stats qualify. Two links at the same tier can be worth different amounts to your build if one affects a stat you plan to use more.",
        ],
      },
      {
        id: "chemistry-board",
        heading: "How to Use the Chemistry Board",
        steps: [
          { heading: "Look up a target", description: "In Collection, search by player or by link name. For the Daily Chemistry Bounty, start with the link named in the bounty." },
          { heading: "Inspect the live build", description: "Open the Chemistry Board from the build screen and compare your selected players with the target link. Check which stats the Board connects before committing your next pick." },
          { heading: "Review the result", description: "Open the Board from results or My Strikers and check the completed build. For discovery rewards, return to Collection and look for the claim or milestone." },
        ],
      },
      {
        id: "chemistry-strategy",
        heading: "Best Chemistry Strategy",
        paragraphs: [
          "Start from players you’ve already picked. Choose one reachable link that supports a stat you care about, then decide how many rerolls you’re willing to spend. With few rounds left and several missing pieces, take the strong stat already on offer and keep the link as a target for another build.",
          "A bounty run gives you a different objective. Pick the named link before the first roll and judge your progress by the missing players. In a queued duel, check the pre-match settings vote before committing to a Chemistry plan. The October 24 summary describes a vote that can turn Chemistry off.",
        ],
      },
      {
        id: "chemistry-vs-stats",
        heading: "Chemistry vs Individual Stats",
        intro: "The rolled player gives you a base attribute to select. Chemistry adds a conditional bonus to the stats that the Board links. For a finisher, compare a Shooting pick on its own with a completed link that actually affects Shooting. A larger boost to another stat may be better suited to a different role.",
        links: [
          { label: "Compare all ten attributes", slug: "attributes" },
          { label: "Choose a build for your playstyle", slug: "best-builds" },
        ],
      },
    ],
    faq: [
      { question: "Why is my Chemistry bonus missing?", answer: "Look up the exact link in Collection, then compare its requirements against your selected players on the Board. In a queued duel, also check whether Chemistry was enabled for that match." },
      { question: "Which Chemistry link should I prioritize?", answer: "For a normal build, start with a link close to completion that boosts the stat you’re targeting. For a bounty, use the exact link named in the bounty." },
      { question: "Where can I check Chemistry on a saved striker?", answer: "Open My Strikers, select the build you want to review and look for the Chemistry Board. Check the linked stats there before comparing that build with another." },
    ],
    relatedSlugs: ["england-u20"],
  },
  {
    enabled: true,
    slug: "england-u20",
    pageType: "updates",
    navLabel: "England U-20",
    navVisible: false,
    lastReviewed,
    title: "Build A Striker England U-20 Update – Players & Features",
    description: "Explore the Build A Striker England U-20 team, Coach Fox, new Chemistry links, BIDS, the lobby wheel, and the expanded NEL season format.",
    hero: {
      heading: "Build A Striker England U-20 Update Guide",
      lead: "Start with an England U-20 roll if you want the new team, or visit the queue room if you want to try BIDS. The October 31, 2026 update also introduced Coach Fox, ten Chemistry links, three Awakened forms, and new lobby activities, according to the published patch recap.",
    },
    sources: [patchHistory, walkthrough],
    sections: [
      {
        id: "whats-new",
        heading: "What’s New in the England U-20 Update?",
        intro: "The official Roblox listing carries the England U-20 label. The patch recap describes new content in the builder, a separate auction mode, and more reasons to check the lobby between runs.",
        table: {
          caption: "Where to try the reported October 31 additions",
          columns: ["What you want to try", "Where to start", "What changed"],
          rows: [
            ["Roll the new team", "Normal builder", "England U-20 joined the team pool."],
            ["Pursue a new Awakened form", "Player Wing", "Reo, Chigiri and Barou gained new quest paths."],
            ["Find a new link", "Chemistry Collection", "Ten links were named, five in the England group."],
            ["Try an auction build", "BIDS pad in the queue room", "Compete for players with a separate bid budget."],
            ["Collect repeatable rewards", "Lobby wheel and Quests → Tasks", "The patch added a wheel and daily and weekly objectives."],
          ],
        },
      },
      {
        id: "england-team",
        heading: "England U-20 Players and Team",
        paragraphs: [
          "The update confirms England U-20 as a rollable team. The available patch coverage gives no complete player roster or individual ratings, so use the team label and rolled card in your session to identify the player and compare attributes.",
          "Reo, Chigiri and Barou appear in the same patch as Awakened additions. Their names belong to the awakening feature summary. If that’s what brought you back, go to the Player Wing and read the character quest rather than spending team rerolls to chase those names as England players.",
        ],
        links: [{ label: "Check the Awakened unlock paths", slug: "awakened" }],
      },
      {
        id: "england-chemistry",
        heading: "How England U-20 Chemistry Works",
        intro: "The update grouped five new links under England and five under other players. Search Collection for the exact link you want, including the entry named England U-20, then check the Board as you select players. The recap also identifies Coach Fox as the coach that boosts England Chemistry links. Check the link you can actually complete before you build a run around that coach.",
        links: [{ label: "Find the named Chemistry links and bonus tiers", slug: "chemistry" }],
      },
      {
        id: "modes-and-progression",
        heading: "BIDS, NEL and Lobby Progression",
        subsections: [
          {
            heading: "BIDS rewards a planned auction budget",
            paragraphs: [
              "Enter from the BIDS pad in the queue room. The public walkthrough describes global matchmaking and a Play vs AI option. Each side has 10,000 Bid Yen for an auction featuring 20 players. Winning a player gives you a stat pick, and the final reveal compares overall ratings.",
              "Choose a few attributes you want to fill early and set a bid ceiling before the first auction. Keep some budget for gaps that emerge after the opening bids. This gives you a reason to pass on a high-rated card if its strongest stat is one you already covered.",
            ],
          },
          {
            heading: "NEL and lobby tasks offer different goals",
            paragraphs: [
              "The recap says one striker can play up to five NEL seasons. If you already have a build you enjoy, that gives you a reason to revisit it before rolling another. For a shorter lobby visit, check the free daily wheel spin and open Quests → Tasks to see the daily and weekly objectives and any set rewards.",
            ],
          },
        ],
      },
      {
        id: "england-update-codes",
        heading: "England U-20 Update Codes",
        intro: "The patch recap mentions a batch of codes. For reported rewards and redemption instructions, use the separate codes guide and check the result in Roblox.",
        links: [{ label: "See reported Build A Striker codes", slug: "codes" }],
      },
      {
        id: "first-steps",
        heading: "What to Do First After the Update",
        intro: "Pick one goal for your first session back. To try the team, use a normal build and check the England links in Collection before you spend rerolls. To try BIDS, enter the queue room and learn when to pass on a bid. If you’re continuing an existing striker, check NEL and read the current Tasks first so you can work toward a reward while you play.",
      },
    ],
    faq: [
      { question: "Does every new Chemistry link belong to England U-20?", answer: "The patch summary splits the ten additions into five England links and five for other players. Use Collection to check the specific entry and the Board to see its effects." },
      { question: "Can I try BIDS while waiting for a match?", answer: "The published walkthrough describes a Play vs AI option alongside global matchmaking. Look for it when you enter BIDS from the queue room." },
      { question: "Where are the daily and weekly tasks?", answer: "Open Quests, then Tasks. Check the individual objectives and the set reward before choosing what to do in your session." },
    ],
    relatedSlugs: ["beginner-guide"],
  },
  {
    enabled: true,
    slug: "awakened",
    pageType: "guide",
    navLabel: "Awakened",
    navVisible: false,
    lastReviewed,
    title: "Build A Striker Awakened Guide – Players & Quests",
    description: "Find the Build A Striker Awakened unlock paths for Reo, Chigiri, Barou, and Rin, plus the reported rules for pity credit and rerolls.",
    hero: {
      heading: "How to Unlock Awakened Players in Build A Striker",
      lead: "For Reo, Chigiri or Barou, start in the Player Wing. Talk to the character you want and read the five quests listed there. If you’re chasing Rin, check Isagi’s awakening first. The earlier Chemistry patch recap lists that as a prerequisite for Rin’s quests.",
    },
    sources: [patchHistory, { label: "Roblox Wiki Awakened forms reference", url: `${wiki}/wiki/awakened-and-shiny/` }],
    sections: [
      {
        id: "awakened-players",
        heading: "List of Awakened Players and Prerequisites",
        intro: "The Player Wing handles character-specific quest paths. Use the version history below to tell which characters were added together and which unlock depends on a previous awakening.",
        table: {
          caption: "Quest paths described in public patch coverage",
          columns: ["Character", "First check", "Patch context"],
          rows: [
            ["Reo (The Chameleon)", "Read Reo’s five quests in the Player Wing.", "October 31 · England U-20 update"],
            ["Chigiri (Red Panther)", "Read Chigiri’s five quests in the Player Wing.", "October 31 · England U-20 update"],
            ["Barou (The King)", "Read Barou’s five quests in the Player Wing.", "October 31 · England U-20 update"],
            ["Rin (Destroyed)", "Awaken Isagi first, then check Rin’s five quests.", "October 24 · Chemistry update"],
            ["Isagi", "Check your Isagi awakening status before pursuing Rin.", "Referenced as Rin’s prerequisite"],
          ],
        },
        paragraphs: [
          "The public summaries establish these paths and the reported quest counts, with individual requirements left to the in-game NPC. Use the exact objective shown in your session when deciding which mode to play or which run to keep.",
        ],
      },
      {
        id: "unlock-steps",
        heading: "How to Unlock Awakened Characters",
        steps: [
          { heading: "Choose a character in the Player Wing", description: "Speak to the relevant NPC and read the current objectives. If Rin is your goal, check that Isagi’s prerequisite is complete before planning the rest of the unlock." },
          { heading: "Plan around the quest wording", description: "Before starting a run, look for a required mode, player or action in the objective. If two tasks can be advanced in the same session, handle them together and save a separate run for the one with a stricter condition." },
          { heading: "Check progress after one attempt", description: "Return to the objective after the first qualifying action. Compare its progress before repeating the same run or spending rerolls." },
        ],
      },
      {
        id: "awakened-pity",
        heading: "Awakened Pity, Rerolls and Updates",
        paragraphs: [
          "According to the October 26 patch recap, pity credit comes from normal builds after selecting a stat. A duel roll or restarting before choosing an attribute is outside that rule. If the counter didn’t move, first check the mode and whether you actually completed the stat selection.",
          "The October 30 recap describes a separate persistence fix for pity resets after Duels, Penalties or leaving mid-build. Keeping your existing progress and earning new progress are different checks. To diagnose a repeat issue, compare your counter before and after selecting a stat in a normal build.",
          "That same recap says pulled Awakened players are classified under the AWAKENED team, so a player reroll stays in that pool. If you’ve rolled the specific form you wanted, take a useful stat before rerolling. Pool membership gives no assurance you’ll draw the same character again.",
        ],
      },
      {
        id: "awakening-priority",
        heading: "Which Awakening Should You Work On First?",
        paragraphs: [
          "If your goal is Rin, start with the Isagi requirement and measure progress against that unlock. If you’re choosing among Reo, Chigiri and Barou, compare their current objectives with the modes you already play and prioritize one path you can advance consistently.",
          "For a build-focused run, decide which attribute would make the character worth taking in your current setup. If the card you have covers a weak stat and the remaining rounds are limited, keeping the pick can be more valuable than chasing a second form.",
        ],
        links: [{ label: "Find a build that fits your picks", slug: "best-builds" }],
      },
    ],
    faq: [
      { question: "Why is my Awakened pity not counting?", answer: "Check that you are in a normal build and have selected a stat. The October 26 recap says duel rolls and resets before a stat pick do not grant credit." },
      { question: "Can I reroll an Awakened player?", answer: "The October 30 recap says player rerolls after an Awakened pull stay in the AWAKENED team pool. Keep the current card if its exact form is the one you were targeting." },
      { question: "Do I need Isagi for every awakening?", answer: "The published prerequisite applies to Rin. The October 31 recap points to the individual NPC quests for Reo, Chigiri and Barou." },
    ],
    relatedSlugs: ["england-u20", "beginner-guide"],
  },
  {
    enabled: true,
    slug: "shiny-crystal",
    pageType: "guide",
    navLabel: "Shiny Crystal",
    navVisible: false,
    lastReviewed,
    title: "Build A Striker Shiny Crystal – How to Get & Use It",
    description: "See what a Shiny Crystal does in Build A Striker, how to spend it during stat selection, and when to save it for a stronger roll.",
    hero: {
      heading: "Shiny Crystal Guide for Build A Striker",
      lead: "A Shiny Crystal upgrades the card you just rolled. The October 25 patch recap reports +5 to each stat on that card, applied during stat selection. You get one use per normal build, and spending it is irreversible. Wait until you know which attribute you’re taking.",
    },
    sources: [patchHistory, { label: "Pro Game Guides crystal and code reference", url: "https://progameguides.com/roblox/roblox-build-a-striker-codes/" }],
    sections: [
      {
        id: "get-crystals",
        heading: "How to Get Shiny Crystals",
        paragraphs: [
          "The CRYSTAL code is a publicly reported source of one Shiny Crystal. Its listing tells you what the reward was advertised to be. For current reports and the redemption steps, check the codes guide, then use the in-game result to confirm whether you received it.",
          "If you already redeemed the code or Roblox rejects it, check the latest reward announcements from the community server linked by the game. A new update can announce several reward types, so look for a crystal specifically before assuming a spin or code includes one.",
        ],
        links: [{ label: "Check reported codes and redemption steps", slug: "codes" }],
      },
      {
        id: "crystal-effect",
        heading: "What Does a Shiny Crystal Do?",
        paragraphs: [
          "The reported effect applies to the rolled card during the stat-selection step. The normal build still lets you take one attribute from that card. For example, if the card shows Shooting 85 and Speed 81, the reported boost would make those choices 90 and 86. Taking Shooting adds the boosted Shooting pick for that round.",
          "Treat the upgrade as part of the current decision. Pro Game Guides reports that a team or player reroll after spending the crystal loses the boosted roll. Use the crystal when you’ve finished rerolling for that pick and the attribute already serves your plan.",
        ],
      },
      {
        id: "use-a-crystal",
        heading: "How to Use a Shiny Crystal",
        steps: [
          { heading: "Reach stat selection in a normal build", description: "Roll a team and a player, then examine the attributes on the card. Decide which one you’d take before using the crystal." },
          { heading: "Tap the crystal on the rolled card", description: "Use it during stat selection, as described in the October 25 update coverage. Check the displayed values for the stat you want before making your selection." },
          { heading: "Take the boosted stat", description: "Select the attribute you planned to keep. Avoid rerolling the team or player after you spend the crystal." },
        ],
      },
      {
        id: "when-to-spend",
        heading: "When Should You Spend a Crystal?",
        intro: "Make the decision based on the attribute you’ll carry forward from this round. A useful test is whether you’d keep the same card without the crystal. If the answer is yes and the attribute serves your build, the boost improves a pick you already trust.",
        table: {
          caption: "Decision guide for your one use in a normal build",
          columns: ["Situation", "Suggested choice", "Reason"],
          rows: [
            ["Strong Shooting roll for a finisher", "Spend if you’re ready to lock it in.", "The bonus goes into a stat central to the build."],
            ["Interesting card, but you still plan to reroll", "Wait until you settle on a card.", "The boost is tied to the current roll."],
            ["Balanced build with one obvious weak attribute", "Save it for a card that fills that gap.", "The value depends on the stat you actually select."],
          ],
        },
        links: [
          { label: "See what each attribute does", slug: "attributes" },
          { label: "Compare example build priorities", slug: "best-builds" },
        ],
      },
      {
        id: "refunds",
        heading: "Troubleshooting and the October 26 Refund",
        paragraphs: [
          "If you don’t see the option, check whether you are in stat selection in a normal build and whether you already spent that run’s use. If the reward never appeared after entering a code, record the redemption message before assuming the upgrade failed.",
          "The October 26 patch recap reports an automatic return on the next join for crystals lost to the earlier leave-and-rejoin or Ball Tag bug. That was a fix for those cases. For a new loss, keep the approximate time, mode and action that preceded it so you can describe what happened when checking with the game’s support channel.",
        ],
      },
    ],
    faq: [
      { question: "Does the +5 apply to my finished striker’s entire stat sheet?", answer: "The published effect applies to each option on the rolled card. You take one of those boosted attributes when you make your normal stat selection." },
      { question: "Can I undo a crystal or use a second one in the same build?", answer: "The October 25 recap describes an irreversible upgrade with a limit of one use per normal build. Choose the stat you want before spending it." },
      { question: "Should I spend a crystal before rerolling?", answer: "Save it until you’re ready to pick an attribute from the current card. Public coverage reports losing the spent crystal if you reroll the player or team." },
    ],
    relatedSlugs: ["beginner-guide", "chemistry"],
  },
];
