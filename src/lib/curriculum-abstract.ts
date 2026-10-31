import {abstractGroups} from './abstract-content';
import {conceptSection,type Case} from './learning-builders';
import type {LearningLesson,LearningSection} from './learning-types';
type Group=keyof typeof abstractGroups;
function section(id:Group,title:string,objective:string,meaning:string[],method:string[],mistake:string):LearningSection{
  const cases=abstractGroups[id];
  const content=conceptSection({id:`abstract-${id}`,title,objective,
    teaching:[{title:'Read the visual evidence',paragraphs:meaning},{title:'Solve the pattern step by step',paragraphs:method}],
    examples:cases.slice(0,2).map(c=>({prompt:c.prompt,diagram:c.diagram,answer:c.answer,steps:[c.reasoning,'Check that the selected option keeps every unchanged attribute and performs only the required change.']})),misconception:mistake},
    cases.map(c=>[c.prompt,c.answer,c.wrong,c.reasoning] as Case));
  return {...content,questions:content.questions.map((q,i)=>({...q,diagram:cases[Math.floor(i/2)].diagram}))};
}
export const abstractLesson:LearningLesson={slug:'abstract-reasoning',title:'Abstract reasoning: shapes, patterns & matrices',subject:'Reasoning',practice:'abstract',description:'Read visual attributes, infer and verify a rule, distinguish rotation from reflection, and solve missing-cell matrices.',sections:[
section('sequences','Shape sequences & changing attributes','Track shape, count, fill, and orientation independently before predicting the next panel.',[
  'Abstract reasoning uses visual relationships rather than vocabulary or a memorized calculation. Start by describing each panel using a short attribute list: shape, number of symbols, outline or filled, and direction. Keeping those attributes separate prevents a change in count from being mistaken for a change in shape.',
  'A sequence can increase or decrease, alternate between two states, or repeat a longer block. Look for a rule that accounts for every shown transition. In these original exercises, the required relationship is stated clearly so there is one intended answer; a short finite sequence alone can sometimes support more than one mathematical rule.'
],[
  'Compare panel A with B and B with C. Write what changes and what stays fixed. If the count changes by the same amount each time, apply that amount once more. If a block repeats, identify the complete block before choosing the next member.',
  'Predict the missing panel before reading the choices. Then eliminate options that change a fixed attribute. For example, adding one outline circle must produce more outline circles; a filled square fails even if its symbol count is correct. Speed comes from using the same attribute checklist, rather than guessing from resemblance.'
],'Do not choose a visually similar option before checking every transition and fixed attribute.'),
section('transformations','Rotations, reflections & orientation','Apply a specified turn or mirror transformation without changing unrelated attributes.',[
  'Rotation turns a figure around a point; reflection flips it across a mirror line. A clockwise quarter-turn is 90 degrees. Starting at up, the clockwise direction cycle is up, right, down, left. Counterclockwise follows the reverse cycle. A half-turn is 180 degrees and points a directional arrow opposite its starting direction.',
  'A vertical mirror swaps left and right, while a horizontal mirror swaps up and down. The mirror line matters. Some symmetric figures look unchanged after reflection, so an unchanged appearance does not prove that no operation occurred. An upward arrow is symmetric across its own vertical centre line.'
],[
  'Identify the starting orientation before applying the operation. Trace one quarter-turn at a time for rotations; do not assume every arrow starts by pointing upward. Keep count, fill, and shape unchanged unless a second rule explicitly changes them.',
  'For reflection, imagine folding the page on the stated mirror line and matching points at equal distances on opposite sides. Check whether left/right or up/down must swap. Test your result against the direction named in the answer choices, then use the worked solution to explain why the competing turn or mirror interpretation fails.'
],'A clockwise turn and a mirror flip can look similar in one example but are different transformations.'),
section('classification','Odd-one-out classification & multiple rules','Find the single panel that violates the specified shared attribute.',[
  'Classification asks which item does not belong under a shared rule. Compare one attribute at a time: shape, fill, count, direction, and relative arrangement. Three panels may share one property while the fourth breaks it. Read the question carefully because a set can be grouped in different ways when no criterion is supplied.',
  'The original questions here name the property to compare. “Different fill” asks about outline versus filled, even if other features attract your attention. “Different in both shape and fill” requires two simultaneous differences. Meeting just one condition is insufficient, like checking only part of a factory label.'
],[
  'Make a small comparison table mentally. First identify the property common to the majority, then locate the panel that breaks it. Refer to the letter printed above the panel rather than describing its screen position, since labels are the actual answer choices.',
  'Verify the other three panels also satisfy your proposed rule. If two panels fail, you have either misread a symbol or chosen the wrong criterion. For a compound instruction, check every condition independently and combine them only at the end. A consistent scan reduces both rushed guesses and unnecessary rereading.'
],'The odd panel must violate the requested rule, not simply look most noticeable.'),
section('matrices','Missing-cell matrices & row/column rules','Apply a consistent relationship to a second row and verify all available evidence.',[
  'A matrix arranges related figures in rows and columns. The missing cell is found by applying a relationship that works elsewhere in the grid. A row might add symbol counts, repeat a shape order, alternate fill, or transform an arrow. Read the grid in its stated row order before treating it as one long sequence.',
  'Separate the relationship from the objects used to demonstrate it. If the top row changes an outline circle to a filled circle, the bottom row can apply that fill change to a square. Copying the top row’s final circle would preserve the wrong attribute. The transformation is the reusable part, while the row shape may change.'
],[
  'Solve a complete row first: state its inputs and output as a rule. Apply exactly that rule to the incomplete row, keeping its own starting shapes and quantities. If an instruction names a count operation, calculate it explicitly instead of choosing the option with a similar overall appearance.',
  'Check the result against any column evidence and the wording of the question. A valid rule must explain the complete example, not just the missing cell. Eliminate options that change a fixed shape, fill, or direction. Use untimed practice to explain the rule aloud before aiming for the ten-second target in assessed drills.'
],'Do not copy the completed cell above when the task asks you to copy the relationship between cells.'),
]};
