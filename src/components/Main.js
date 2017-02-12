require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';
import ReactDOM from 'react-dom';
//获取图片的相关信息

let imageDatas = require('json!../data/imageData.json');
//let imageDatas = require('../data/imageData.json');
//利用自执行函数将图片信息转化的图片路径信息
imageDatas = ((imageDatasArr)=>{
		for (var i=0,j=imageDatasArr.length;i<j;i++) {
			var singleImageData = imageDatasArr[i];
			singleImageData.imageURL =  require('../images/'+singleImageData.fileName);
			
			imageDatasArr[i] = singleImageData;
		}
		return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
var get30DegRandom = () => {
	let deg = '';
  	deg = (Math.random() > 0.5) ? '+' : '-';
  	return deg + Math.ceil(Math.random() * 30);
}
//let ImgFigure = React.createClass({
//	render(){
//		return (
//			<figure>
//		        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
//		        <figcaption>
//		          <h2 className="img-title">{this.props.data.title}</h2>
//		          <div className="img-back">
//		            <p>
//		              {this.props.data.title}
//		            </p>
//		          </div>
//		        </figcaption>
//	      </figure>
//		);
//	}
//});
class ImgFigure extends React.Component{
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	/*
	 * imgFigure 的点击处理函数
	 */
	handleClick(e){
		//this.props.
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
	}
	render(){
		var styleObj={};
		//如果在props上指定了这张图片的属性，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		if(this.props.arrange.rotate){
			(['Moz', 'Ms', 'Webkit', '']).forEach((value)=>{
				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
//				styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			});
		}
		let imgFigureClassName = 'img-figure';
			imgFigureClassName+=this.props.arrange.isInverse?' is-Inverse':'';
//		 style={styleObj}
		return (
			<figure className={ imgFigureClassName } style={styleObj} onClick={this.handleClick}>
		        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
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
class AppComponent extends React.Component {
 constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向的取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //    rotate:0, //旋转角度
        //isInverse:false //正反面
        //isCenter:false 图片是否居中
        //}
      ]
    };
  }
 /*
  * 反转图片
  * @param index 输入当前被执行inverse操作对象
  * return {function} 闭包函数
  */
  inverse(index){
  	return () => {
      let imgsArrangArr = this.state.imgsArrangeArr;
      	  imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangArr
      })
    }
  }
  //重新布局所有图片
  rearrange(centerIndex){
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
	  imgsArrangTopArr = [],
	  topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
	  topImgSpiceIndex = 0,
	  imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
	  //首先居中centerIndex图片 ,centerIndex图片不需要旋转
	imgsArrangeCenterArr[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      }
    //取出要布局上测的图片的状态信息
    topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
    //布局位于上侧的图片
    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
      	rotate: get30DegRandom(),
        isCenter: false
      };
    });
    
    //布局左两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右边部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
      	rotate: get30DegRandom(),
        isCenter: false
      };
    }
    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
  	this.setState({
  		imgsArrangeArr:imgsArrangeArr
  	});
  }
  /*
   利用rearrange函数，居中被点击的图片
   * */
  center(index){
  	return () => {
  		this.rearrange(index);
  	}
  }
  //组件加载以后为每张图片计算其位置
 componentDidMount(){
 	//计算舞台的大小
 	let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
 		stageWidth = stageDOM.scrollWidth,
 		stageHeight  = stageDOM.scrollHeight;
 		
 	let	halfStageW = Math.ceil(stageWidth/2),
 		halfStageH = Math.ceil(stageHeight/2);
 	//拿到每一个ImageFigure的大小
 	let imgDOM = ReactDOM.findDOMNode(this.refs.imagefigure0),
 		imgW = imgDOM.scrollWidth,
 		imgH = imgDOM.scrollHeight,
 		HImgH = Math.ceil(imgH/2),
 		HImgW = Math.ceil(imgW/2);
 	//计算中心图片的位置点
 	this.Constant.centerPos = {
 		left:halfStageW-HImgW,
 		top:halfStageH-HImgH
 	}
 	//计算左侧//右侧图片排布取值范围
 	this.Constant.hPosRange.leftSecX[0] = -HImgW;
 	this.Constant.hPosRange.leftSecX[1] = halfStageW-HImgW*3;
 	
 	this.Constant.hPosRange.rightSecX[0] = halfStageW+HImgW;
 	this.Constant.hPosRange.rightSecX[1] = stageWidth-HImgW;
 	this.Constant.hPosRange.y[0] = -HImgH;
 	this.Constant.hPosRange.y[1] = stageHeight-HImgH;
 	
 	//计算上测区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -HImgH;
    this.Constant.vPosRange.topY[1] = halfStageH-HImgH*3;

    this.Constant.vPosRange.x[0] = halfStageW-imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    let num = Math.floor(Math.random() * 10);
    this.rearrange(num);
 	
 }
  render() {
  	var controllUn = [],
  		imgFigures = [];
  	imageDatas.forEach((value, index) => {
		if (!this.state.imgsArrangeArr[index]) {
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
      imgFigures.push(<ImgFigure data = {value} key = {index} ref = {'imagefigure'+index} arrange = {this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center = {this.center(index)}
      							 />);

    });
  	
    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">
      		{imgFigures}
      	</section>
      	<nav className = "controller-nav">
      		{controllUn}
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
