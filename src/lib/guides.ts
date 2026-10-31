export const guides = [
  {
    slug: "math-basics", title: "Factory exam math basics", description: "Simple methods for arithmetic, fractions, percentages, and units.", minutes: 5, topic: "Math & numbers", practice: "math", color: "sage",
    intro: "You don’t need to rush into difficult problems. A reliable method for the basics gives you something to fall back on when a question looks unfamiliar.",
    sections: [
      { title: "Start with the order of operations", paragraphs: ["Work through parentheses first. Then calculate multiplication and division from left to right. Finally, calculate addition and subtraction from left to right. Multiplication does not always come before division; those two operations have equal priority.", "For 18 + 6 × 3, multiply 6 × 3 first to get 18. Then add 18 + 18 = 36. For (18 + 6) × 3, the parentheses change the order: 24 × 3 = 72."], example: "18 + 6 × 3 = 18 + 18 = 36" },
      { title: "Turn a percentage into something familiar", paragraphs: ["A percentage is a fraction out of 100. To find 15% of 200, multiply 200 by 0.15. You can also break the problem into 10% and 5%: 20 + 10 = 30.", "Be careful about what the question asks. A 20% discount on ₱250 is ₱50, but the price after the discount is ₱200."], example: "Discounted price = original price − discount" },
      { title: "Make the units match", paragraphs: ["Before adding or subtracting measurements, express them in the same unit. One metre is 100 centimetres. One kilogram is 1,000 grams. One litre is 1,000 millilitres.", "If a container holds 1.2 litres and you remove 350 millilitres, first change 1.2 litres to 1,200 millilitres. Then calculate 1,200 − 350 = 850 millilitres."], example: "1.2 L − 350 mL = 1,200 mL − 350 mL = 850 mL" },
      { title: "Do a quick reasonableness check", paragraphs: ["An answer should make sense in context. Six trays of 24 parts must contain more than 24 parts. A discounted price should be lower than the original price. Removing liquid cannot increase what remains.", "Estimate before or after you calculate. Six trays of roughly 25 parts is roughly 150 parts, so an exact answer of 144 is plausible. An answer of 1,440 should prompt another look."] },
    ], takeaway: "Write the calculation, keep the units consistent, then check whether the result makes sense.",
  },
  {
    slug: "study-routine", title: "Taiwan factory exam study routine", description: "A manageable routine that leaves room for work, life, and steady improvement.", minutes: 4, topic: "Study habits", practice: "mixed", color: "sand",
    intro: "A short session you can repeat is often more useful than a long plan you cannot fit into your day. Start small and let your results guide what you study next.",
    sections: [
      { title: "Give one session one purpose", paragraphs: ["Choose a small goal: practise percentages, read five instructions carefully, or revisit three mistakes. A clear goal makes it easier to start and easier to know when you’re done.", "Try the untimed guided questions in a lesson first. The aim is to understand the method, not to collect a perfect score."] },
      { title: "Spend time on the explanation", paragraphs: ["After checking an answer, say the reasoning back in your own words. If you cannot explain why it works, try the calculation or reasoning again before moving on.", "A correct guess is still a useful question to save. Bookmark anything you want to revisit, even if you answered it correctly."] },
      { title: "Return after a break", paragraphs: ["Revisit saved questions on another day. Try answering before opening the explanation. Mix familiar topics with the ones you find difficult.", "Use the progress page to see your completed sessions and latest mistakes. The numbers describe your practice here; they do not predict an employer’s selection decision."] },
      { title: "Add time pressure when you feel ready", paragraphs: ["When the question format feels familiar, try the mixed mock exam. Set aside 20 minutes and check your answers only after you finish.", "Our five-section, 100-question format is a learning exercise. Employers may use different questions, time limits, and selection processes. Follow the instructions provided by the actual assessment organizer."] },
    ], takeaway: "Practise, understand, revisit. A routine you can keep is a good place to start.",
  },
  {
    slug: "reading-instructions", title: "Workplace English: reading factory instructions", description: "Notice the words that change an instruction, and turn a sentence into clear steps.", minutes: 4, topic: "Practical English", practice: "english", color: "sand",
    intro: "You may know every word in an instruction and still miss a small detail. Slow down for the words that describe order, conditions, and limits.",
    sections: [
      { title: "Find the action", paragraphs: ["Look for the verb: check, count, record, compare, or select. Then identify what the action applies to.", "In ‘Record the quantity on the form’, the action is record, the information is the quantity, and the destination is the form."] },
      { title: "Notice order and conditions", paragraphs: ["Words such as before, after, first, and then tell you the sequence. ‘Inspect before sealing’ means the inspection happens first.", "If introduces a condition. ‘If the code is missing, set the package aside’ applies when the code is missing. Do not assume the instruction applies to every package."], example: "First count → then record → finally close" },
      { title: "Give small words their full meaning", paragraphs: ["AND means both conditions are needed. OR usually allows at least one of the listed conditions, unless the question explicitly says ‘one only’. NOT reverses what you should select.", "Inclusive means the endpoints count. A permitted range of 20 to 25 inclusive includes both 20 and 25."] },
      { title: "Ask rather than pretend", paragraphs: ["For real workplace instructions, ask the responsible person when something is unclear. ‘Could you please repeat the instruction?’ and ‘Do you mean this quantity?’ are direct, polite ways to confirm your understanding.", "These language exercises are not workplace safety training. Always follow your employer’s actual procedures and training."] },
    ], takeaway: "Find the action, check the order, and notice conditions before you respond.",
  },
  {
    slug: "check-your-work", title: "Factory exam visual checking and accuracy", description: "A simple approach to codes, quantities, and comparisons.", minutes: 3, topic: "Attention to detail", practice: "detail", color: "blue",
    intro: "Detail questions reward a consistent checking process. Give yourself a method so you don’t have to rely on a first impression.",
    sections: [
      { title: "Compare in small groups", paragraphs: ["Break a code such as TX-4827-B into three groups: TX, 4827, and B. Compare each group with the reference, from left to right.", "Look out for transpositions. 4827 and 4872 contain the same digits but put them in a different order. They are not an exact match."] },
      { title: "Keep labels attached to numbers", paragraphs: ["‘18 small boxes and 12 large boxes’ is not the same as ‘12 small boxes and 18 large boxes’, even though the total is identical. Check the label and its quantity together.", "Use the same approach for units, dates, and times. A correct number with the wrong unit is not a correct record."] },
      { title: "Separate checking from guessing", paragraphs: ["Read the reference first, compare each part, then make a decision. If you lose your place, restart the comparison instead of filling in the rest from memory.", "In timed practice, move on when necessary and return using the question navigator. Use untimed lesson practice to establish accuracy first."] },
    ], takeaway: "A consistent process is easier to trust than a quick glance.",
  },
] as const;
