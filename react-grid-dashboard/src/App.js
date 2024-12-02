import './App.css';
import ResponsiveLocalStorageLayout from './components/basicgrid';
import MyResponsiveGrid from './components/basicgrid';
import BasicGrid from './components/basicgrid';
import { Dashboard2 } from './components/Dashboard2';
import MinMaxLayout from './components/Dashboard3';
import NestedGrid from './components/NestedGrid';
import SampleGrid from './components/sampleGrid';
import MyLayout from './components/temp';
import { LayoutComp } from './layoutcomp';

function App() {
  return (
    <div className="App">
      {/* <h1>Dashboard</h1> */}
      {/* <Dashboard2 /> */}
      {/* <MyLayout/> */}
      {/* <MinMaxLayout/> */}
      {/* <NestedGrid/> */}
      {/* <ExampleNestedGrid/> */}
      {/* <BasicGrid/> */}
      {/* <ResponsiveLocalStorageLayout/> */}

      <SampleGrid/>

      {/* <LayoutComp/> */}

    </div>
  );
}

export default App;
