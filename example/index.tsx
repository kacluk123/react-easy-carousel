import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Carousel } from '../src/EasyCarousel';

const App = () => {
  const [ index, setIndex ] = React.useState(0)

  return (
    <div style={{width: "800px", border: "1px solid red"}}>
      <Carousel
        currentIndex={index}
        changeCurrentIndex={(index) => { setIndex(index) }}
      >
        <div style={{width: '400px', height: "200px", background: 'pink'}}>
          dasdas
        </div>
        <div style={{width: '276px',  height: "200px", background: 'green'}}>
          dasdas
        </div >
        <div style={{width: '200px', height: "200px", background: 'blue'}}>
          dasdas
        </div>
        <div style={{width: '500px',  height: "200px", background: 'red'}}>
          dasdas
        </div>
      </Carousel>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
