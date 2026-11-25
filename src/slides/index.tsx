import type { ReactNode } from 'react';
import type { SlideMeta } from '../types/presentation';
import { Slide01Cover } from './Slide01Cover';
import { Slide02Paradigms } from './Slide02Paradigms';
import { Slide03Taxonomy } from './Slide03Taxonomy';
import { Slide04GenotypePhenotype } from './Slide04GenotypePhenotype';
import { Slide05ExplorationExploitation } from './Slide05ExplorationExploitation';
import { Slide06FiveFamilies } from './Slide06FiveFamilies';
import { Slide07MetaphorVsMath } from './Slide07MetaphorVsMath';
import { Slide08Selection } from './Slide08Selection';
import { Slide09Crossover } from './Slide09Crossover';
import { Slide10Mutation } from './Slide10Mutation';
import { Slide11ElitismStopping } from './Slide11ElitismStopping';
import { Slide12Pseudocode } from './Slide12Pseudocode';
import { Slide13RastriginSimulator } from './Slide13RastriginSimulator';
import { Slide14RaceExactVsGA } from './Slide14RaceExactVsGA';
import { Slide15Complexity } from './Slide15Complexity';
import { Slide16NeedleHaystack } from './Slide16NeedleHaystack';
import { Slide17HammingGray } from './Slide17HammingGray';
import { Slide18RealWorldCases } from './Slide18RealWorldCases';
import { Slide19Closing } from './Slide19Closing';

export function renderSlide(
  slide: SlideMeta,
  _index: number,
  totalSlides: number,
): ReactNode {
  switch (slide.id) {
    case 1:
      return <Slide01Cover meta={slide} totalSlides={totalSlides} />;
    case 2:
      return <Slide02Paradigms meta={slide} totalSlides={totalSlides} />;
    case 3:
      return <Slide03Taxonomy meta={slide} totalSlides={totalSlides} />;
    case 4:
      return <Slide04GenotypePhenotype meta={slide} totalSlides={totalSlides} />;
    case 5:
      return <Slide05ExplorationExploitation meta={slide} totalSlides={totalSlides} />;
    case 6:
      return <Slide06FiveFamilies meta={slide} totalSlides={totalSlides} />;
    case 7:
      return <Slide07MetaphorVsMath meta={slide} totalSlides={totalSlides} />;
    case 8:
      return <Slide08Selection meta={slide} totalSlides={totalSlides} />;
    case 9:
      return <Slide09Crossover meta={slide} totalSlides={totalSlides} />;
    case 10:
      return <Slide10Mutation meta={slide} totalSlides={totalSlides} />;
    case 11:
      return <Slide11ElitismStopping meta={slide} totalSlides={totalSlides} />;
    case 12:
      return <Slide12Pseudocode meta={slide} totalSlides={totalSlides} />;
    case 13:
      return <Slide13RastriginSimulator meta={slide} totalSlides={totalSlides} />;
    case 14:
      return <Slide14RaceExactVsGA meta={slide} totalSlides={totalSlides} />;
    case 15:
      return <Slide15Complexity meta={slide} totalSlides={totalSlides} />;
    case 16:
      return <Slide16NeedleHaystack meta={slide} totalSlides={totalSlides} />;
    case 17:
      return <Slide17HammingGray meta={slide} totalSlides={totalSlides} />;
    case 18:
      return <Slide18RealWorldCases meta={slide} totalSlides={totalSlides} />;
    case 19:
      return <Slide19Closing meta={slide} totalSlides={totalSlides} />;
    default:
      return <Slide01Cover meta={slide} totalSlides={totalSlides} />;
  }
}
