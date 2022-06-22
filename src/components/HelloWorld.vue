<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>  
  </div>
</template>

<script>
// import  anhui from '../assets/provice/anhui.json'
// 引入封装的方法
import {
  modleFn,
  mouse,
  creaImage,
  abbrImg,
  bubbleFn,
} from "../uiltes/mouseKind";
export default {
  name: "",
  data() {
    return {
  
    }
  },
  mounted() {
   this.initGlobel()
   let modelData={
     latitude: 85.06351424526214,
     longitude: 35.75471419498355,
          model: "http://data.marsgis.cn/3dtiles/max-ytlhz/tileset.json",
          //model:"http://10.22.90.2:8081/ai-daemon-download/model/model-1650012311842/tileset.json"
          // model:"http://10.22.90.2:8081/ai-daemon-download/model/luzhou/Scene/tileset.json"
   }
   this.modleFn(modelData, "3dtitles");
  },
  methods: {
    // 公共方法不同的数据模型，3dtiles模型,glb,gltf
   modleFn(options, type, rate) {
    // console.log('123213');
     const {position, model} = options
    switch (type) {
    case "3dtitles":
     const tileset = new Cesium.Cesium3DTileset({
       url:options.model
      })
     window.$viewer.scene.primitives.add(tileset)
     window.$viewer.flyTo(tileset);
    break;
    case "glb":
    case "gltf":
    const positionNew = Cesium.Cartesian3.fromDegrees(
    position.latitude,
    position.longitude,
    position.height
    );
// 弧度的航向分量。
        const heading = Cesium.Math.toRadians(135);
        // 弧度的螺距分量。
        const pitch = 0;
        // 滚动分量（以弧度为单位）
        const roll = 0;
        // HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
          positionNew,
          hpr
        );
        const entity = $viewer.entities.add({
          name: "url",
          position: positionNew,
          // 方向
          // orientation: orientation,
          model: {
            clampToGround:true, //贴地
            uri: model,
            scale: rate || 1,  //缩放比例
            //不管缩放如何，模型的最小最小像素大小。
            minimumPixelSize: 1,
            //模型的最大比例尺大小。 minimumPixelSize的上限。
            maximumScale: 100,
          },
       });
      // $viewer.flyTo(entity); // 缓慢飞行到该位置
      window.$viewer.trackedEntity = entity;  //直接定位
     break;
     default:
      break;
  }
},
    // 初始化地球
    initGlobel(){
   // 获取中国地图地址
    let china=Cesium.Rectangle.fromDegrees(200,20,120,70)
    Cesium.Camera.DEDAULT_VIEW_RECTANGLE=china
   let custom=new Cesium.ArcGisMapServerImageryProvider({
        url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
       })
      window.$viewer = new Cesium.Viewer("cesiumContainer", {
        timeline: false, //去除时间轴
        animation: false,
        baseLayerPicker: false,//加载其他地形设置将此属性设置为false，否则影响其他地图或者地球的加载
        imageryProvider:custom,//加载不同的地形
      });
      // var cameraP=new Cesium.Cartesian3.fromDegrees(114,30.50,90)
      //   var heading=Cesium.Math.toRadians(0)
      //   var pitch=Cesium.Math.toRadians(-40)
      //   // range  距离水平面的距离
      //   var range=2000
      //   window.$viewer.camera.lookAt(cameraP,new Cesium.HeadingPitchRange(heading,pitch,range))
      //    let tileset=new Cesium.Cesium3DTilesset({
      //       url:'http://10.22.90.2:8081/ai-daemon-download/model/model-1650012311842/tileset.json',
      //       maximumScreenSpaceError:2,
      //       maximumNumberOfLoadedTiles:1000,
      //     })
      //   window.$viewer.scene.primitives.add(
      //   tileset
      //   )
      //  window.$viewer.flyTo(tileset);
    },
  },
};
</script> 
<style scoped>
.map-box {
  width: 100%;
  height: 100vh;
}
::v-deep .cesium-viewer-bottom {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    padding-right: 5px;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
.imgHtml {
  width: 300px;
  height: 200px;
  background-image: url("../../public/image/xx.png");
  background-size: 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  z-index: 9;
  color: #fff;
}
#bubbleTow,
#bubble {
  width: 200px;
  height: 150px;
  border: 1px solid red;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: #fff;
  display: none;
}
#bubbleTow {
  display: block;
}
#bubbleTow h3,
#bubble h3 {
  text-align: left;
  height: 30px;
  line-height: 30px;
}
#bubbleTow i,
#bubble i {
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid yellow;
  color: blue;
  float: right;
  cursor: pointer;
}
.btn {
  position: absolute;
  top: 40px;
  left: 50px;
  color: #fff;
  font-size: 18px;
  z-index: 8;
}
</style>
