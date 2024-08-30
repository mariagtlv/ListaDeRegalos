import { Carousel } from 'antd';


let IndexComponent = () => {
    const contentStyle1 = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
      };
      const contentStyle2 = {
        height: '160px',
        color: "#fff",
        lineHeight: '160px',
        textAlign: 'center',
        background: '#8a9299',
      };
    
    return (
        <Carousel autoplay autoplaySpeed={2500} style={{marginTop: "160px", marginLeft: "100px", marginRight: "100px"}}>
            <div>
                <h3 style={contentStyle1}>Wanna learn how to use this Website?</h3>
            </div>
            <div>
                <h3 style={contentStyle2}>First Step: login or register</h3>
            </div>
            <div>
                <h3 style={contentStyle2}>Second Step: add some presents you would like to receive</h3>
            </div>
            <div>
                <h3 style={contentStyle2}>Third Step: add some friends that also use this web</h3>
            </div>
            <div>
                <h3 style={contentStyle2}>Forth Step: gift somethign to your friends!</h3>
            </div>
            <div>
                <h3 style={contentStyle1}>Have fun!</h3>
            </div>
        </Carousel>
    )
}

export default IndexComponent;