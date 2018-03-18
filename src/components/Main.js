require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 图片定位和图片旋转的大致步骤：
// 1、获取图片信息后通过json-loader处理传入的json图片信息，然后定义一个genImageURL函数处理获取的图片(通过对应json文件下的信息利用函数找到真实文件夹下的图片地址)。
// 2、利用componentDidMount(){}在加载页面数据后立刻执行函数中去对imageDatas进行遍历，并通过定义的ImgFigure组件去生成页面的海报元素。
// 3、在constructor中设置海报初始化的所有属性，并在componentDidMount(){}中对所有属性区间进行范围设置(rearrage函数是用来处理this.state.imgsArrangeArr中各个属性的值)

// 获取图片的相关数据
let imageDatas = require('../data/imageDatas.json');

// 利用闭包函数，将图片名信息转换成URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for(let i = 0; i < imageDatasArr.length; i++){
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

// 给定区间内随机取值函数
function getRangeRandom(low , high){
  return Math.ceil(Math.random() * (high - low) + low);
}

// 获取0~30°之间的一个任意正负值
function get30DegRandom(){
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

// var ImgFigure = React.createClass 这种方式亦可
// props 使我们在使用react.component为其添加的所有的属性的集合(并且是自动生成的)
// ImgFigure在AppComponent中被imageDatas
// .forEach调用，所以此时每个imageDatas的值就是ImgFigure中props的属性(imageDatas值:{desc:**}{fileName:**}{imageURL:**}{title:**})
class ImgFigure extends React.Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  // imgFigure的点击处理函数
  handleClick(e){
    e.stopPropagation();
    e.preventDefault();

    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
  }

  render() {
    let styleObj = {};

    // 如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值且不为0，则添加旋转角度(其实要获取rotate值，直接在this.props.arrange里就有，但是这里是要直接将styleObj放入元素的style中，所以就用这样的写法)
    if(this.props.arrange.rotate){
      //styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      (['MozTransform' , 'msTransform' , 'WebkitTransform' , 'transform' , '']).forEach(function(value){
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this))
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      // <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}.bind(this)>
      // 利用上面的方法去将this指向ImgFigure组件，会导致每次调用都要去定义this指向，如果是在很大的结构中这样使用就会导致浏览器负担过大。所以还是在constructor中定义整个handleClick函数的指向最好。
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

// 额外添加的时间。。。
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      comment: 'Hey man!'
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
      comment: 'Welcome~'
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.comment}</h1>
        <h2>Now is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

// 控制组件
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();

    // 如果点击的是当前居中的图片按钮，则翻转图片，否则将对应图片居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
  }

  render(){
    let controllerUnitClassName = "controller-unit";

    // 如果是居中图片，则设置该图片的按钮状态
    if(this.props.arrange.isCenter){
      controllerUnitClassName += " is-center";

      // 如果同时还是对应的翻转状态，则按钮显示翻转状态
      if(this.props.arrange.isInverse){
        controllerUnitClassName += " is-inverse"
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}

class AppComponent extends React.Component {
  constructor(){
    super();
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向取值范围
        leftSecX: [0 , 0],
        rightSecX: [0 , 0],
        y: [0 , 0]
      },
      vPosRange: { //垂直方向取值范围
        x: [0 , 0],
        topY: [0 , 0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        // pos: {
        //   left: '0',
        //   top: '0'
        // },
        // rotate: 0,
        // isInverse: false,
        // isCenter: false
      ]
    };
  }

  // 图片翻转
  // @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值。
  // @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数。
  inverse(index){
    return function(){
      let imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      // 每当需要将数据重新渲染时就调用this.setState
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }

  // 利用rearrange函数，居中对应index的图片
  // @param index, 需要被居中的图片对应的信息数组的index值
  // return {function}
  center(index){
    return function(){
      this.rearrage(index);
    }.bind(this);
  }

  // 重新布局所有图片(随机排布)
  // @param centerIndex 指定居中排布的图片 ：imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex , 1)
  rearrage(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex , 1);

    // 先居中centerIndex的图片(该图片不用旋转)
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    // 取出要布局上侧的图片状态信息(包括上面的topImgNum到下面两句都是为了从剩下的imgsArrangeArr中随机取出0-2张图片)
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex , topImgNum);

    // 布局位于上侧的图片(如果数组中没有值，就不会进入forEach函数中进行下一步处理)
    imgsArrangeTopArr.forEach(function(value , index){
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0] , vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0] , vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });

    // 布局左右两侧的图片信息(此时imgsArrangeArr中剩下的图片就是要放在左右两侧的)
    for (let i = 0; i < imgsArrangeArr.length; i++){
      let hPosRangeLORX = null,
          k = imgsArrangeArr.length / 2;

      // 规定前半部分布局左边，后半部分布局右边
      if(i < k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0] , hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0] , hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    // 将上面那些拿出去处理位置的图片重新插入回原来imgsArrangeArr数组中的位置
    // 判断是否有取出将放置上侧的图片的信息
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex , 0 , imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex , 0 , imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  // 组件加载后，为每张图片计算其位置范围
  componentDidMount(){
    // 获取舞台大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    // 计算各个Constant(允许随机生成区域的值)的值
    // 计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    // 计算左侧图片取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    // 计算右侧图片取值范围
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上测区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrage(0);
  }

  render() {
    let controllerUnits = [],
        ImgFigures = [];

    //为了消除warning提示需要为element添加一个key值，这里就用数组的index作为每个element的key
    imageDatas.forEach(function(value , index){
      // 初始化每个图片的各个属性值(若此时不对forEach函数进行.bind(this)处理this指向的话，那这里的this就是遍历到的img数据本身，而不是AppComponent组件本身，这样就无法获取到其中的state等默认值了)
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      ImgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} 
        arrange={this.state.imgsArrangeArr[index]} 
        inverse={this.inverse(index)} 
        center={this.center(index)} />);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} 
        inverse={this.inverse(index)} 
        center={this.center(index)} />);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

// AppComponent.defaultProps = {
// };

// export default AppComponent;
exports.Clock = Clock;
module.exports.AppComponent = AppComponent;