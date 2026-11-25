import { DeckShell } from './components/engine/DeckShell';
import { SLIDES_METADATA } from './data/slidesMetadata';
import { renderSlide } from './slides';

export function App() {
  return <DeckShell slides={SLIDES_METADATA} renderSlide={renderSlide} />;
}

export default App;
