// YouTube titles and channels checked through public oEmbed on 2026-10-31.
// Embed/link originals only; no downloaded video, thumbnail, transcript, or affiliation claim.
export type LessonVideo = {id:string;title:string;channel:string};

export const lessonVideos = {
  "arithmetic": {
    "id": "T_6Mq6PWoGc",
    "title": "Basic Math Review",
    "channel": "The Organic Chemistry Tutor"
  },
  "pemdas": {
    "id": "saTBf8AO4Ok",
    "title": "Order of Operations - Made Easy!",
    "channel": "The Organic Chemistry Tutor"
  },
  "exponents": {
    "id": "ZtTO8uUGy2Y",
    "title": "Introduction to Exponents",
    "channel": "The Organic Chemistry Tutor"
  },
  "fractions": {
    "id": "GvLIEiqxS6s",
    "title": "Fractions Basic Introduction - Adding, Subtracting, Multiplying & Dividing Fractions",
    "channel": "The Organic Chemistry Tutor"
  },
  "conversion": {
    "id": "B9bGGPmECTM",
    "title": "Math - How To Convert Fractions To Decimals",
    "channel": "The Organic Chemistry Tutor"
  },
  "decimals": {
    "id": "hy8CF6Y24xw",
    "title": "Math - Decimal Arithmetic",
    "channel": "The Organic Chemistry Tutor"
  },
  "percent": {
    "id": "WYWPuG-8U5Q",
    "title": "Percentages Made Easy!",
    "channel": "The Organic Chemistry Tutor"
  },
  "metric": {
    "id": "eK8gXP3pImU",
    "title": "Converting Units With Conversion Factors - Metric System Review & Dimensional Analysis",
    "channel": "The Organic Chemistry Tutor"
  },
  "rates": {
    "id": "s0RBRkehzwo",
    "title": "Unit Rates, Ratios & Proportions - Word Problems",
    "channel": "The Organic Chemistry Tutor"
  },
  "ohms": {
    "id": "HsLLq6Rm5tU",
    "title": "Ohms Law Explained - The basics circuit theory",
    "channel": "The Engineering Mindset"
  },
  "series": {
    "id": "VV6tZ3Aqfuc",
    "title": "DC Series circuits explained - The basics working principle",
    "channel": "The Engineering Mindset"
  },
  "parallel": {
    "id": "5uyJezQNSHw",
    "title": "DC parallel circuits explained  - The basics how parallel circuits work working principle",
    "channel": "The Engineering Mindset"
  },
  "abstract": {
    "id": "C-51Tp6HChU",
    "title": "IQ, APTITUDE AND DIAGRAMMATIC REASONING TESTS",
    "channel": "CareerVidz"
  },
  "matrices": {
    "id": "HkZsLIHKVr0",
    "title": "Inductive Reasoning Tutorial - Question Walkthrough (Part 1)",
    "channel": "AssessmentDay"
  },
  "transformations": {
    "id": "K7QTjFdUIyk",
    "title": "Examples recognizing transformations",
    "channel": "Khan Academy"
  },
  "numbers": {
    "id": "ymHY8y6GZf0",
    "title": "NUMBER SERIES TEST Questions and Answers! (How to PASS a Numerical Reasoning Test)",
    "channel": "CareerVidz"
  },
  "deduction": {
    "id": "r2rMNhYxCls",
    "title": "Deductive Reasoning Test Tutorial - Part 1 of 2",
    "channel": "AssessmentDay"
  },
  "spelling": {
    "id": "2IerM7dTQN4",
    "title": "English Sounds and Spelling - English Pronunciation Lesson",
    "channel": "Oxford Online English"
  },
  "vocabulary": {
    "id": "InuyRItYD4g",
    "title": "Factory & Industry English Vocabulary | Workplace English",
    "channel": "Overall English"
  },
  "prepositions": {
    "id": "92XBCRYZ1S8",
    "title": "IN / ON / AT - Prepositions of PLACE AND TIME | English Grammar Lesson (+ Free PDF & Quiz)",
    "channel": "English with Lucy"
  },
  "conditional": {
    "id": "tfSi3foze3Q",
    "title": "Using Conditional Sentences in English - 5 Levels of Difficulty",
    "channel": "Oxford Online English"
  },
  "reading": {
    "id": "J1tdSLAycpc",
    "title": "How to Improve Your English Reading Skills - 4 Steps to Improve Now!",
    "channel": "Oxford Online English"
  },
  "visual": {
    "id": "I_GbUHfCHu0",
    "title": "Practice Test   Attention to Detail",
    "channel": "Industrial Psychology Consultants"
  },
  "fiveS": {
    "id": "dLtMbS3ln5U",
    "title": "5S in 2.5 minutes | Sort, Set, Shine, Standardize & Sustain Explained | Best 5S Introduction",
    "channel": "Shakehand with Life"
  },
  "dexterity": {
    "id": "cvQbo0CzScI",
    "title": "Purdue Pegboard Test",
    "channel": "Lafayette Instrument"
  }
} as const satisfies Record<string,LessonVideo>;

export const lessonVideoSections:Record<string,{video:keyof typeof lessonVideos;focus:string}[]> = {
  "arithmetic-counting": [
    {
      "video": "arithmetic",
      "focus": "Review number size and basic calculations. Estimate an answer first, then compare your exact result with that estimate."
    }
  ],
  "arithmetic-add-subtract": [
    {
      "video": "arithmetic",
      "focus": "Focus on addition and subtraction. Translate stock received into additions and stock issued into subtractions before calculating."
    }
  ],
  "arithmetic-groups": [
    {
      "video": "arithmetic",
      "focus": "Focus on multiplication and division. Explain the difference between finding a total from equal groups and finding the number of groups."
    }
  ],
  "pemdas-parentheses": [
    {
      "video": "pemdas",
      "focus": "Follow how grouped expressions are evaluated first. Pause before each worked answer and mark which operation you would perform next."
    }
  ],
  "pemdas-exponents": [
    {
      "video": "exponents",
      "focus": "Practise identifying the base and exponent, then write a power as repeated multiplication before evaluating it."
    }
  ],
  "pemdas-multiplication": [
    {
      "video": "pemdas",
      "focus": "Track multiplication and division at the same priority. Work left to right rather than treating the letters in PEMDAS as separate priority levels."
    }
  ],
  "pemdas-division": [
    {
      "video": "pemdas",
      "focus": "Focus on division within mixed expressions. Check each left-to-right step before moving on to addition or subtraction."
    }
  ],
  "pemdas-addition": [
    {
      "video": "pemdas",
      "focus": "Notice when addition becomes the next allowed operation. Compare the worked steps with your own marked-up expression."
    }
  ],
  "pemdas-subtraction": [
    {
      "video": "pemdas",
      "focus": "Use the complete worked expressions to practise subtraction at the same priority as addition. Check brackets, powers, and signs at every step."
    }
  ],
  "fractions-parts": [
    {
      "video": "fractions",
      "focus": "Start with the numerator and denominator. Explain what one equal part represents before trying the calculation examples."
    }
  ],
  "fractions-equivalent": [
    {
      "video": "fractions",
      "focus": "Focus on equivalent fractions and simplification. Check that multiplying or dividing both parts by the same nonzero number preserves the value."
    }
  ],
  "fractions-combining": [
    {
      "video": "fractions",
      "focus": "Pause at addition and subtraction examples. Find a common denominator and explain why only the numerators are combined afterward."
    }
  ],
  "decimals-place-value": [
    {
      "video": "decimals",
      "focus": "Review how decimal positions affect calculations. Compare tenths and hundredths before working through the arithmetic examples."
    }
  ],
  "decimals-conversion": [
    {
      "video": "conversion",
      "focus": "Use numerator divided by denominator to convert a fraction. Check a measurement such as one half or one quarter against its decimal equivalent."
    }
  ],
  "decimals-calculations": [
    {
      "video": "decimals",
      "focus": "Practise lining up decimal places for addition and subtraction, then check the placement of the decimal point in multiplication and division."
    }
  ],
  "percent-part": [
    {
      "video": "percent",
      "focus": "Practise finding a percentage of a quantity without a calculator. Compare the shortcut with the fraction-over-100 method taught in this section."
    }
  ],
  "percent-yield": [
    {
      "video": "percent",
      "focus": "Apply the percentage method to accepted and rejected quantities. State the original total clearly so you do not use the wrong denominator."
    }
  ],
  "units-metric": [
    {
      "video": "metric",
      "focus": "Follow the conversion-factor method and cancel units explicitly. Keep quantities in compatible units before adding or comparing them."
    }
  ],
  "rates-ratios": [
    {
      "video": "rates",
      "focus": "Focus on unit rates: write what each number measures, divide to find a per-unit quantity, then scale to the requested production amount."
    }
  ],
  "ohm-quantities": [
    {
      "video": "ohms",
      "focus": "Use the circuit explanation to distinguish voltage, current, and resistance. State the unit for each quantity before using a formula."
    }
  ],
  "ohm-units": [
    {
      "video": "metric",
      "focus": "Review metric prefixes and conversion factors, then apply the same method to milliamps, amps, ohms, and kilohms in this section."
    }
  ],
  "ohm-current": [
    {
      "video": "ohms",
      "focus": "Identify voltage and resistance, then rearrange the relationship to I = V / R. Check your units and calculate the current on paper."
    }
  ],
  "ohm-voltage": [
    {
      "video": "ohms",
      "focus": "Focus on the relationship between the three quantities. Use the section examples to practise V = I × R with compatible units."
    }
  ],
  "ohm-resistance": [
    {
      "video": "ohms",
      "focus": "Rearrange the relationship to R = V / I and explain which values you need. Compare your result with the direction of change you expect."
    }
  ],
  "ohm-relationships": [
    {
      "video": "ohms",
      "focus": "Explain how changing voltage or resistance affects current while the other quantity stays fixed. Use that prediction to check your calculations."
    }
  ],
  "ohm-circuits": [
    {
      "video": "series",
      "focus": "Study the single current path in a series circuit. Compare how total resistance and voltage drops relate to each resistor."
    },
    {
      "video": "parallel",
      "focus": "Compare the branch paths with the series example. Identify which quantity is shared across branches before calculating current or total resistance."
    }
  ],
  "ohm-power": [
    {
      "video": "parallel",
      "focus": "This companion covers circuit power calculations as well as current and resistance. Compare with this section’s P = VI examples and its explanation of model limits."
    }
  ],
  "abstract-sequences": [
    {
      "video": "abstract",
      "focus": "Track one visual attribute at a time, such as shape count, shading, or position. Test a proposed rule against every frame before choosing an answer."
    }
  ],
  "abstract-transformations": [
    {
      "video": "transformations",
      "focus": "Distinguish rotations from reflections. Follow a marked corner or feature to decide whether a shape was turned or flipped."
    }
  ],
  "abstract-classification": [
    {
      "video": "abstract",
      "focus": "Use the visual-rule examples to practise describing a rule precisely. Apply that habit to each odd-one-out option rather than choosing by appearance alone."
    }
  ],
  "abstract-matrices": [
    {
      "video": "matrices",
      "focus": "Study the visual rule in the walkthrough. For this section’s matrices, check both the row and column evidence before accepting a missing cell."
    }
  ],
  "patterns-sequences": [
    {
      "video": "numbers",
      "focus": "Write the differences between adjacent terms, then test addition, multiplication, and changing-gap rules against the whole sequence."
    }
  ],
  "patterns-ordering": [
    {
      "video": "deduction",
      "focus": "Practise turning stated conditions into a small table or ordered list. Keep what must be true separate from what merely could be true."
    }
  ],
  "patterns-deduction": [
    {
      "video": "deduction",
      "focus": "Work only from the given premises. Pause before the conclusion and identify the exact condition that supports or rules out each option."
    }
  ],
  "patterns-spatial": [
    {
      "video": "transformations",
      "focus": "Compare translations, turns, and flips. Use a distinctive feature to track orientation instead of relying on the shape’s general outline."
    }
  ],
  "english-alphabet": [
    {
      "video": "spelling",
      "focus": "Review the relationship between written letters and spoken sounds. Return to the section’s code-reading examples to practise exact letter case and character order."
    }
  ],
  "english-vocabulary": [
    {
      "video": "vocabulary",
      "focus": "Listen for workplace terms, then explain the words in your own sentences. Relate the vocabulary to the instruction and safety examples in this section."
    }
  ],
  "english-sentences": [
    {
      "video": "prepositions",
      "focus": "Focus on location words such as in, on, and at. Draw a simple workstation and describe exactly where a tool or part should be placed."
    }
  ],
  "english-sequence": [
    {
      "video": "conditional",
      "focus": "Start with the simpler conditional examples. Identify the condition and the required action, then practise the before/after instructions from this section separately."
    }
  ],
  "english-comprehension": [
    {
      "video": "reading",
      "focus": "Use the reading strategies to check meaning and unfamiliar words. For exam questions, point to the sentence that supports your answer rather than adding assumptions."
    }
  ],
  "visual-codes": [
    {
      "video": "visual",
      "focus": "Try the checking examples using a consistent left-to-right scan. Match every character, including separators, instead of recognizing only the overall shape."
    }
  ],
  "visual-records": [
    {
      "video": "visual",
      "focus": "Apply a fixed checking order to the examples. Then return to this section to practise quantities, units, and record fields individually."
    }
  ],
  "visual-speed": [
    {
      "video": "visual",
      "focus": "Try an accuracy-first pass before adding time pressure. Identify where your checking order breaks down, then repeat the section’s original practice questions."
    }
  ],
  "five-s-sort": [
    {
      "video": "fiveS",
      "focus": "Focus on Sort: separate necessary items from items needing authorized review. Explain why relocating clutter is different from deciding whether it is needed."
    }
  ],
  "five-s-order": [
    {
      "video": "fiveS",
      "focus": "Focus on Set in order: give needed items a clear location. Compare this step with Sort so you can distinguish necessity from placement."
    }
  ],
  "five-s-shine": [
    {
      "video": "fiveS",
      "focus": "Focus on Shine: connect cleaning with noticing abnormal conditions. Use only the cleaning and reporting methods authorized for the workplace."
    }
  ],
  "five-s-standardize": [
    {
      "video": "fiveS",
      "focus": "Focus on Standardize: identify the shared routine or checklist that makes the first three steps repeatable across shifts."
    }
  ],
  "five-s-sustain": [
    {
      "video": "fiveS",
      "focus": "Focus on Sustain: distinguish maintaining an agreed routine over time from writing the initial standard."
    }
  ],
  "dexterity-technique": [
    {
      "video": "dexterity",
      "focus": "Watch the manufacturer demonstrate controlled peg placement and coordinated hand use. This is one example of a dexterity task; your employer may use a different activity."
    }
  ],
  "dexterity-instructions": [
    {
      "video": "dexterity",
      "focus": "Notice how the task order and instructions affect what the participant does. Confirm the actual assessment rules instead of copying this demonstration’s procedure automatically."
    }
  ],
  "dexterity-physical": [
    {
      "video": "dexterity",
      "focus": "Use the demonstration to understand the type of controlled practical task being discussed. It does not establish your physical eligibility or an employer’s required test; confirm those requirements directly."
    }
  ]
};

export function sectionVideos(sectionId:string){
  return (lessonVideoSections[sectionId]??[]).map(item=>({video:lessonVideos[item.video],focus:item.focus}));
}
