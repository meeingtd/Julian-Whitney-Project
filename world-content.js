/* All the words on world.html live here. Edit this file only; no 3D code needed.
   Facts come from projects.src.html (the current public page). Mark anything unconfirmed with draft:true. */
window.WORLD = {
  name: "Julian Whitney",
  note: "The glowing line is a career timeline drawn like a chart. It is decoration, not market or performance data.",
  stops: [
    {
      id: "plaza", nav: "Plaza", when: "Start here",
      title: "Julian Whitney",
      lede: "Wake Forest economics graduate (2026), working in finance with a growing interest in where finance meets AI. Four summers at a private equity placement firm, now in FP&A at an aerospace and defense manufacturer.",
      draft: true,
      hint: "Scroll to walk the line"
    },
    {
      id: "davis", nav: "Davis Square", when: "Summers 2023 to 2026",
      title: "Davis Square Capital",
      lede: "Four summers in private equity placement. Reviewed CIMs and built competitive analyses that went straight into client fundraising materials."
    },
    {
      id: "atlas", nav: "Atlas", when: "Summer 2025 to now",
      title: "Atlas Stamping and Manufacturing",
      figure: "$500,000",
      lede: "Prepared the company's application for a State of Connecticut grant, which was awarded, to fund equipment for its highest gross margin parts.",
      terms: [["Now", "FP&A, with a revenue forecast up to three years out across about 350 specialty parts"]]
    },
    {
      id: "lab", nav: "Model Lab", when: "Summer 2026",
      title: "Model Lab",
      lede: "Wharton Online and Wall Street Prep Private Equity Certificate: eight weeks on the deal lifecycle, from LBO modeling to investment committee presentations.",
      soon: "A working LBO goes here next: move the sliders, and IRR and MOIC update."
    },
    {
      id: "desk", nav: "Research Desk", when: "October 2026",
      title: "Research Desk",
      lede: "Hexcel (NYSE: HXL): an industry deep dive, an integrated model and a 20-page initiation, all making one call.",
      terms: [
        ["Rating", "SELL, $75 price target (about 19% below $92.20)"],
        ["Model", "3-statement, FY2021A to 2031E, Base/Bull/Bear, WACC 9.4%"],
        ["Cross-checks", "Trading comps across 9 A&D peers; precedent take-privates at 15 to 18x LTM EBITDA"]
      ],
      fine: "Values from the model at the October 20, 2026 pricing date. Educational, not investment advice.",
      demos: [{ label: "Watch the DCF demo", src: "media/hexcel.mp4", cap: "39 seconds. Moving beta, terminal growth and the exit multiple." }]
    },
    {
      id: "ai", nav: "AI Lab", when: "Fall 2026",
      title: "AI Lab",
      lede: "Tools I build with Claude Code to do the work faster and to show my thinking.",
      terms: [
        ["Recruiting Scoreboard", "A personal operating system for a job search, kept current by six scheduled AI agents"],
        ["Home Base", "3rd place, AI Collective hackathon (October 21, 2026). A 90-day relocation program and app, co-built with a partner"],
        ["Usage Tracker", "A local dashboard of Claude Code token use by project and day"]
      ],
      demos: [
        { label: "Scoreboard demo", src: "media/scoreboard.mp4", cap: "51 seconds, with a sample firm. Claude's suggestions are replayed for the recording." },
        { label: "Home Base demo", src: "media/homebase.mp4", cap: "60 seconds. Demo sign-in and sample data." },
        { label: "Usage Tracker demo", src: "media/usage.mp4", cap: "29 seconds. Month view, projects, insights and the activity heatmap." }
      ]
    },
    {
      id: "contact", nav: "Contact", when: "Today",
      title: "Let's talk",
      lede: "The fastest way to reach me is email.",
      email: "julianwhitney@alumni.wfu.edu",
      linkedin: ""
    }
  ]
};
