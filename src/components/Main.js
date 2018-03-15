require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片的相关数据
let imageDatas = require('../data/imageDatas.json');

// 利用闭包函数，将图片名信息转换成URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for(var i = 0; i < imageDatasArr.length; i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

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
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
