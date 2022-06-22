import html2canvas from "html2canvas";

// 鼠标 点击获取经纬度
export const mouse = () => {
  var handler = new Cesium.ScreenSpaceEventHandler($viewer.scene.canvas);
  handler.setInputAction(function (movement) {
    let modelPosition = null
    // 当前点击的实体
    var pick = $viewer.scene.pick(movement.position);
    //选中某模型   pick选中的对象
    if (pick && pick.id) {
      modelPosition = $viewer.scene.pickPosition(movement.position);
      if (document.getElementById(pick.id._id)) {
        document.getElementById(pick.id._id).style.display = 'block'
      }
    } else {
      // 返回一个函数
      var ellipsoid = $viewer.scene.globe.ellipsoid;
      // 可以获取点击处地球表面的世界坐标
      var cartesian = $viewer.scene.globe.pick($viewer.camera.getPickRay(movement.position), $viewer.scene);
      // 笛卡尔空间直角坐标系-世界坐标（Cartesian3）
      var cartesian3 = new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z);
      var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      var lng = Cesium.Math.toDegrees(cartographic.longitude);
      var alt = cartographic.height;
    }
    // 将提供的笛卡尔转换为经纬度
    console.log(modelPosition, lat, lng, alt, 'modelPositionmodelPositionmodelPosition');
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 添加模型
export const modleFn = (options, type) => {
  switch (type) {
    case "3dtitles":
      return
      // $viewer.scene.primitives.add(tilesetModel);
      var palaceTileset = new Cesium.Cesium3DTileset({
        // url: "http://124.71.153.0:31080/mmodel/model/Scene/3DTiles.json",
        url: "http://data.marsgis.cn/3dtiles/max-ytlhz/tileset.json"
      })
      $viewer.scene.primitives.add(palaceTileset);
      $viewer.flyTo(palaceTileset);
      break;
    case "glb":
      var position = Cesium.Cartesian3.fromDegrees(
        122.15271775601036,
        40.994056026004635
        // 100
      );
      //弧度的航向分量。
      var heading = Cesium.Math.toRadians(135);
      //弧度的螺距分量。
      var pitch = 0;
      //滚动分量（以弧度为单位）
      var roll = 0;
      //HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      var entity = $viewer.entities.add({
        name: "url",
        position: position,
        orientation: orientation,
        model: {
          clampToGround:true,
          uri: "/image/0e09e290842b376b7a7e4a7e6a6bc850_0_8.glb",
          // uri: "/assets/0e09e290842b376b7a7e4a7e6a6bc850_0_8.glb",
          scale: 10,
          //不管缩放如何，模型的最小最小像素大小。
          // minimumPixelSize: 1000,
          //模型的最大比例尺大小。 minimumPixelSize的上限。
          // maximumScale: 1000,
        },
      });



      // $viewer.trackedEntity = entity;
      break;
    default:
      break;
  }

}


// 将节点变为 canvas
export const creaImage = (nodeId) => {
  let _node = document.getElementById(nodeId)
  // 将当前的放大比例设置为 设备像素比
  const scale = window.devicePixelRatio;
  let option = {
    width: _node.offsetWidth,
    height: _node.offsetHeight,
  };
  // 默认配置项
  let ops = {
    scale,
    // 表示允许跨域资源共享，注意不能与 allowTaint 同时配置为 true
    useCORS: true,
    // 图片跨域
    allowTaint: false,
    ...option
  }
  setTimeout(() => {
    document.getElementsByClassName("map-box")[0].removeChild(_node)
  }, 1000);
  return html2canvas(_node, ops)
}

// 添加一个材质
export const abbrImg = (canvas) => {
  console.log(Cesium.Cartesian3.fromDegreesArray([
    // 117.17982580160357, 31.854984654647588 ,117.17936821954767,31.854943654088075
    121.9246509166283,
    40.89811002101494, 121.92449633889946, 40.898342608824045,

    // 117.154815, 31.853495, 117.181255, 31.854257,
  ]), 'xxxxxxxxxx');
  // let max = [1200, 1200];
  // 材质的最高高程
  let max = [555, 555];
  // 材质的最低高程
  let min = [29, 29];
  // 返回一个实例
  let returnData = new Cesium.CustomDataSource();
  // 实例身上的方法 添加一个实体
  returnData.entities.add({
    name: "立体墙",
    wall: {
      // 实体的两个点位 控制它的 宽度
      
      positions: [
        {
          x: -2612545.6538523417,
          y: 4084652.1100127967,
          z: 4128038.402313321
        },
        {
          x: -2613269.449634446,
          y: 4085343.3597988253,
          z: 4126927.483647976
        }
      ],
      // Cesium.Cartesian3.fromDegreesArray([
      //   // 117.17982580160357, 31.854984654647588 ,117.17936821954767,31.854943654088075
      //   121.9246509166283,
      //   40.89811002101494, 121.92449633889946, 40.898342608824045,

      //   // 117.154815, 31.853495, 117.181255, 31.854257,
      // ]),
      maximumHeights: max,
      minimumHeights: min,
      // 用img来填充当前的材质
      material: new Cesium.ImageMaterialProperty({
        image: canvas,
        transparent: true,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      }),
    },
  });
  // 添加到viewer中
  $viewer.dataSources.add(returnData);
  // 定位到当前实体位置
  // $viewer.zoomTo(returnData);

}

// 存储所有的气泡式图表的实体信息
let entityGather = []
// 添加一个点位
export const bubbleFn = (position) => {
  let _id = position.id;
  let iconEntitie = $viewer.entities.add({
    id: _id,
    position: position.posi,
    billboard: {
      //图标
      image: require('../assets/Msg.png'),
      width: 20,
      height: 20,
      scale: 1,
      pixelOffset: new Cesium.Cartesian2(0, -12),
    },

  });
  entityGather.push(iconEntitie)
  iconEntitie.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
  bubbleMoveFn()
}

// 监听气泡式图表 实时改变位置
const bubbleMoveFn = () => {
  $viewer.scene.postRender.addEventListener(BindToFollow)
}

// html 绑定 实体
const BindToFollow = () => {
  if (entityGather.length != 0) {
    try {
      entityGather.forEach(item => {
        if (item._id) {
          // 世界坐标转 屏幕坐标
          var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates($viewer.scene, item._position._value);
          document.getElementById(item._id).style.transform = `translate3d(${(position.x - 100)}px, ${(position.y - 180)}px, 0)`
        }
      })
    } catch (error) { }
  } else {
    return false;
  }
}
