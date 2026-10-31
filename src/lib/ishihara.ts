// Unchanged source photographs. Provenance and hashes: public/images/ishihara/provenance.json.
// The 24 plates corresponding to the owner's sheet, then four further distinct source plates.
// Observation choices follow the supplied sheet. Red / purple allows for the
// sheet's color wording and the original source manual without grading perception.
export const OTHER_PATH = 'Another pattern (describe it)';
const pathPatterns:Record<number,string[]> = {
  26:['Only the purple line','Both purple and red lines','Only the red line'],
  28:['A continuous winding line','Only separate, broken line segments'],
  30:['An orange winding line','A green / blue-green winding line','A red / purple winding line'],
  32:['A green / blue-green winding line','A red / purple winding line','An orange winding line'],
  34:['Blue-green joined to red / purple','Blue-green joined to yellow-green','Only a blue-green segment','Only a yellow-green segment'],
  36:['Red / purple joined to blue-green','Only an orange segment','Red / purple joined to orange'],
  38:['A continuous winding line between the edge marks','Only separate, broken line segments'],
};

export const ishiharaPlates = [
  [1,'number','12'],[2,'number','8'],[4,'number','29'],[6,'number','5'],[7,'number','3'],[8,'number','15'],
  [9,'number','74'],[11,'number','6'],[13,'number','45'],[14,'number','5'],[15,'number','7'],[16,'number','16'],
  [17,'number','73'],[18,'number','No numeral in the reference reading; an alternate reading is 5'],
  [20,'number','No numeral in the reference reading; an alternate reading is 45'],[22,'number','26'],[23,'number','42'],
  [26,'path','Two paths: purple and red'],[28,'path','No continuous path in the reference reading; a path may be visible to some viewers'],
  [30,'path','A blue-green path'],[32,'path','An orange path'],[34,'path','A path through blue-green and yellow-green dots'],
  [36,'path','A path through purple and orange dots'],[38,'path','A winding path'],
  [3,'number','6'],[5,'number','57'],[10,'number','2'],[12,'number','97'],
].map(([plate,kind,reference])=>({plate:Number(plate),kind:String(kind),reference:String(reference),src:`/images/ishihara/plate-${plate}.png`,
  choices:kind==='path'?[...pathPatterns[Number(plate)],'No continuous line visible','I can’t tell',OTHER_PATH]:undefined,
}));
