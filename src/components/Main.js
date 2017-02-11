require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');
//获取图片的相关信息
let imageDatas = require('../data/imageData.json');
//利用自执行函数将图片信息转化的图片路径信息
imageDatas = (function genImageURL(imageDatasArr){
		for (var i=0,j=imageDatasArr.length;i<j;i++) {
			var singleImageData = imageDatasArr[i];
			singleImageData.imageURL =  require('../images/'+singleImageData.fileName);
			imageDatasArr[i] = singleImageData;
		}
		return imageDatasArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav className = "controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
