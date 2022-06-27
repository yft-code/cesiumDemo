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
  mounted(){
    // 参考链接 https://zhuanlan.zhihu.com/p/108400648
     this.getModels()
//     const viewer= new Cesium.Viewer("cesiumContainer", {
//         timeline: false, //去除时间轴
//         animation: false,
//         baseLayerPicker: false,//加载其他地形设置将此属性设置为false，否则影响其他地图或者地球的加载
// //      imageryProvider:custom,//加载不同的地形
//       });
// this.test(viewer)
  },
  methods:{
     getModels(){
       let custom=new Cesium.ArcGisMapServerImageryProvider({
        url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
       })
       window.$viewer = new Cesium.Viewer("cesiumContainer", {
        timeline: false, //去除时间轴
        animation: false,
        baseLayerPicker: false,//加载其他地形设置将此属性设置为false，否则影响其他地图或者地球的加载
        imageryProvider:custom,//加载不同的地形
      });
      var x = 0;
      var y = 0;
      var z = 0;
      var translation=Cesium.Cartesian3.fromArray([x,y,z]);
     let  m=Cesium.Matrix4.fromTranslation(translation);
 let tileset = window.$viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'http://117.174.152.90:41080/Scene/3D.json',//最大的屏幕空间误差
     maximumScreenSpaceError: 1,
              offset: {
                z: 75
              },
              visible: !0,
    maximumNumberOfLoadedTiles: 1000,//最大加载瓦片个数
    modelMatrix: m //形状矩阵
}));
let boundingSphere=null
let _that=this
 tileset.readyPromise.then(()=>{
     boundingSphere=tileset.boundingSphere;
          window.$viewer.camera.viewBoundingSphere(boundingSphere,new Cesium.HeadingPitchRange(0,-2.0,0));
          window.$viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
          // tileset._root.customTransform.scale=1;
         _that.changeHeight(0,tileset);
 });
  },
  changeHeight(height,tileset) {
          height=Number(height);
          if(isNaN(height)){
              return;
          }
          var cartographic=Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
          var surface=Cesium.Cartesian3.fromRadians(cartographic.longitude,cartographic.latitude,cartographic.height);
          var offset=Cesium.Cartesian3.fromRadians(cartographic.longitude,cartographic.latitude,height);
          var translation=Cesium.Cartesian3.subtract(offset,surface,new Cesium.Cartesian3());
          tileset.modelMatrix=Cesium.Matrix4.fromTranslation(translation);
      }
  }
  // mounted() {

  //  this.initGlobel()
  //  let modelData={
  //    latitude: 85.06351424526214,
  //    longitude: 35.75471419498355,
  //          //model: "http://data.marsgis.cn/3dtiles/max-ytlhz/tileset.json",
  //          //model:"http://10.22.90.2:8081/ai-daemon-download/model/model-1650012311842/tileset.json"
  //            model:"http://data.marsgis.cn/3dtiles/max-ytlhz/tileset.json"
  //  }
  //  this.modleFn(modelData, "3dtitles");
  //  window.$viewer.camera.lookAt()
  // },
//   methods:{
//      update3dtilesMaxtrix(tileset) {

//     //旋转
//    let params = {
//             tx: 120.257, //模型中心X轴坐标（经度，单位：十进制度）
//             ty: 31.226, //模型中心Y轴坐标（纬度，单位：十进制度）
//             tz: 2800, //模型中心Z轴坐标（高程，单位：米）
//             rx: 0, //X轴（经度）方向旋转角度（单位：度）
//             ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
//             rz: -1 //Z轴（高程）方向旋转角度（单位：度）
//         }
//  var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));

// var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));

// var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));

//  var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);

//  var rotationY = Cesium.Matrix4.fromRotationTranslation(my);

//  var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
// //平移
//  var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
//  var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
//  //旋转、平移矩阵相乘
//     Cesium.Matrix4.multiply(m, rotationX, m);
//     Cesium.Matrix4.multiply(m, rotationY, m);
//     Cesium.Matrix4.multiply(m, rotationZ, m);
//   //赋值给tileset
//    tileset._root.transform = m;
//    //缩放
//   //  this.zoom3dtiles(tileset);
// },

// zoom3dtiles(tileset){
//    let params={
//          scale:3
//    }
//         var scale = (params.scale || 1) * 1;

//         tileset._root.customTransform = {

//             matrix: {

//                 origin: tileset._root.transform.clone(),

//                 rotation: Cesium.Matrix4.IDENTITY,

//                 translation: Cesium.Matrix4.IDENTITY,

//             }

//         };

//         var m1=Cesium.Matrix4.fromScale(new Cesium.Cartesian3(scale,scale,scale));

//         tileset._root.customTransform.matrix.scale=m1;

//         tileset._root.customTransform.scale=scale;

//         var m2 = new Cesium.Matrix4();

//         Cesium.Matrix4.multiply(tileset._root.customTransform.matrix.origin,tileset._root.customTransform.matrix.rotation,m2);

//         Cesium.Matrix4.multiply(m2,tileset._root.customTransform.matrix.scale,m2);

//         Cesium.Matrix4.multiply(m2,tileset._root.customTransform.matrix.translation,tileset._root.transform);

// },

//   test(viewer) {
//   viewer.scene.globe.depthTestAgainstTerrain = true;
//   var url = "http://117.174.152.90:41080/Scene/3D.json";
//   var tileset = new Cesium.Cesium3DTileset({
//   url: url,
//    maximumScreenSpaceError: 1,
//               offset: {
//                 z: 75
//               },
//               visible: !0,
//   })
//   var primitive = viewer.scene.primitives.add(tileset);
//   const _this=this
//   primitive.readyPromise.then(function (t) {

//         var originalSphere = t.boundingSphere;

//         var radius = originalSphere.radius;

//     viewer.zoomTo(t, new Cesium.HeadingPitchRange(0.5, -0.5, radius * 4.0));
//    //平移、贴地、旋转模型
//    _this.update3dtilesMaxtrix(tileset);

//     })

// }
//   }
//   methods: {
//     // 公共方法不同的数据模型，3dtiles模型,glb,gltf
//    modleFn(options, type, rate) {
//      const {position, model} = options
//     switch (type) {
//     case "3dtitles":
//      const tileset = new Cesium.Cesium3DTileset({
//        url:options.model
//       })
//      window.$viewer.scene.primitives.add(tileset)
//       tileset.readyPromise
//         .then(function(tileset) {
//           //调整高度
//           var translation = Cesium.Cartesian3.fromArray([0, 0, 200])
//           var m = Cesium.Matrix4.fromTranslation(translation) //fromTranslation()方法
//           tileset.modelMatrix = m
//             window.$viewer.flyTo(tileset);
//           })
//     //  tileset.readyPromise.then(this.zoomToTileset(tileset));
//     //  window.$viewer.flyTo(tileset);
//     break;
//     case "glb":
//     case "gltf":
//     const positionNew = Cesium.Cartesian3.fromDegrees(
//     position.latitude,
//     position.longitude,
//     position.height
//     );
// // 弧度的航向分量。
//         const heading = Cesium.Math.toRadians(135);
//         // 弧度的螺距分量。
//         const pitch = 0;
//         // 滚动分量（以弧度为单位）
//         const roll = 0;
//         // HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
//         const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
//         const orientation = Cesium.Transforms.headingPitchRollQuaternion(
//           positionNew,
//           hpr
//          );
//           const entity = $viewer.entities.add({
//           name: "url",
//           position: positionNew,
//           // 方向
//           // orientation: orientation,
//          model: {
//            clampToGround:true, //贴地
//            uri: model,
//            scale: rate || 1, //缩放比例
//            //不管缩放如何，模型的最小最小像素大小。
//            minimumPixelSize: 1,
//            //模型的最大比例尺大小。 minimumPixelSize的上限。
//             maximumScale: 100,
//           },
//        });
//       // $viewer.flyTo(entity); // 缓慢飞行到该位置
//       window.$viewer.trackedEntity = entity; //直接定位
//      break;
//      default:
//       break;
//   }
// },

//  zoomToTileset(tileset) {
//     boundingSphere = tileset.boundingSphere;
//     window.$viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
//     window.$viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
//     this.changeHeight(0,tileset);
// },

// changeHeight(height,tileset) {
//     height = Number(height);
//     if (isNaN(height)) {
//         return;
//     }
//     var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
//     var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
//     var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude,height);
//     var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
//     tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
// },
// // 初始化地球
//     initGlobel(){
//       // window.$viewer = new Cesium.Viewer("cesiumContainer", {
//       // terrainProvider: Cesium.createWorldTerrain(),
//       // });
//     //   // 加载3Dtiles文件
//     //  let tileSet = new Cesium.Cesium3DTileset({
//     //   // 这里的地址可以是本地地址或者是网络地址。如果是网络地址，可能会出现跨域问题，建议使用nginx服务做跨域处理
//     //     url: "http://117.174.152.90:41080/Scene/3D.json",
//     //     //maximumScreenSpaceError: 2, //最大的屏幕空间误差
//    	//    //maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
//     //   });
//     //    tileSet.readyPromise.then((tileset) => {
//     //    window.$viewer.scene.primitives.add(tileset);
//     //   let boundingSphereCenter = tileset.boundingSphere.center // 后续的变换需要这个变量
//            // 定位到该模型
//       //   window.$viewer.zoomTo(
//       //     tileset,
//       //     // cesium方位角，可以试着调节参数掌握api的使用
//       //     // new Cesium.HeadingPitchRange(
//       //     //   Cesium.Math.toRadians(0),
//       //     //   Cesium.Math.toRadians(-40),
//       //     //   2000
//       //     // )
//       //   );
//       //  })
//    // 获取中国地图地址
// //     let china=Cesium.Rectangle.fromDegrees(200,20,120,70)
// //     Cesium.Camera.DEDAULT_VIEW_RECTANGLE=china
//    let custom=new Cesium.ArcGisMapServerImageryProvider({
//         url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
//        })
//       window.$viewer = new Cesium.Viewer("cesiumContainer", {
//         timeline: false, //去除时间轴
//         animation: false,
//         baseLayerPicker: false,//加载其他地形设置将此属性设置为false，否则影响其他地图或者地球的加载
//         imageryProvider:custom,//加载不同的地形
//       });
//     window.$viewer.scene.globe.depthTestAgainstTerrain = false;
// //       // var cameraP=new Cesium.Cartesian3.fromDegrees(114,30.50,90)
// //       //   var heading=Cesium.Math.toRadians(0)
// //       //   var pitch=Cesium.Math.toRadians(-40)
// //       //   // range  距离水平面的距离
// //       //   var range=2000
// //       //   window.$viewer.camera.lookAt(cameraP,new Cesium.HeadingPitchRange(heading,pitch,range))
// //       //    let tileset=new Cesium.Cesium3DTilesset({
// //       //       url:'http://10.22.90.2:8081/ai-daemon-download/model/model-1650012311842/tileset.json',
// //       //       maximumScreenSpaceError:2,
// //       //       maximumNumberOfLoadedTiles:1000,
// //       //     })
// //       //   window.$viewer.scene.primitives.add(
// //       //   tileset
// //       //   )
// //       //  window.$viewer.flyTo(tileset);
//     },
//   },
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
