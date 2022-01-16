# React Super Easy Carousel

Created for scratch React carousel library wich is still in beta stage.

# Usage

```
import { Carousel } from 'react-super-easy-carousel'

function App() {
  const [ index, setIndex ] = React.useState(0)

  return (
    <div className="App">
      <Carousel 
        currentIndex={index}
        changeCurrentIndex={(index) => { setIndex(index) }}
      >
        <Item style={{width: '400px'}}>1</Item>
        <Item style={{width: '231px'}}>2</Item>
        <Item style={{width: '222px'}}>3</Item>
        <Item style={{width: '431px'}}>4</Item>
      </Carousel>
    </div>
  );
}
```
**PROPS**
| Prop | Description |
| --- | --- |
| currentIndex | Current selected item |
| changeCurrentIndex | Change current selected item |
| children | Carousel elements |

**IMPORTANT**
In current package stage you need to define each carousel item width.
Package will take the biggest element and make it's width as a container width.
Component will auto center current selected slide.
