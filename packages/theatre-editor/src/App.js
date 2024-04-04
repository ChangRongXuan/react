import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Playground from './page/playground';
import DemoScroll from './page/demo-scroll';
import DemoVideo from './page/demo-video';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Playground />} />
        <Route path='demo-scroll' element={<DemoScroll />} />
        <Route path='demo-video' element={<DemoVideo />} />
      </Routes>
    </BrowserRouter>
  );
}
