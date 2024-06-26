<template>
  <div class="demo-page">
    <canvas class="light-circle-canvas" width="500" height="500" ref="lightCircleCanvas"></canvas>
    <div class="cesium-container" ref="cesiumContainer"></div>
  </div>
</template>

<script setup lang="ts">
import {
  Ion,
  Viewer,
  Cartesian3,
  Cartographic,
  Math,
  ImageryLayer,
  BingMapsImageryProvider,
  BingMapsStyle,
  Cesium3DTileset,
  UrlTemplateImageryProvider,
  viewerCesium3DTilesInspectorMixin,
  ClippingPolygonCollection,
  ClippingPolygon,
  BoundingSphere,
  Transforms,
  Matrix3,
  Matrix4,
  HeadingPitchRange,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cesium3DTileFeature,
  defined,
  HeightReference,
  Entity,
  Color,
  ImageMaterialProperty,
  CallbackProperty,
  JulianDate,
  IonResource,
  ColorBlendMode,
  ConstantPositionProperty,
  ParticleSystem,
  Cartesian2,
  CircleEmitter,
  HeadingPitchRoll,
  TranslationRotationScale,
  Quaternion,
  Ellipsoid
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

window.CESIUM_BASE_URL = '/libs/Cesium-1.117/Build/Cesium/';
Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNzYyMTVmOS0yNjlmLTQ0Y2UtOGFjOS00MmMwZGJjNGUxZGYiLCJpZCI6MjEwNTgxLCJpYXQiOjE3MTM4NTI1ODV9.adopnWJEcR84Txv9e4TpjHWEXXc3LMYAj1Mhvr6dMTQ';

const lightCircleCanvas = ref();
const cesiumContainer = ref();

let viewer: Viewer | null = null;

// 初始化场景
const initScene = async () => {
  viewer = new Viewer(cesiumContainer.value, {
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    // baseLayer: new ImageryLayer(
    //   new UrlTemplateImageryProvider({
    //     url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
    //   })
    // )
    baseLayer: ImageryLayer.fromProviderAsync(
      BingMapsImageryProvider.fromUrl('https://dev.virtualearth.net', {
        key: 'Aov6kSBhE7QBWycvG-7Q3Rbsj6-sJIg2P3XmoS0fpdG_FeItycfwlp2bNpHXLOvi',
        mapStyle: BingMapsStyle.CANVAS_DARK
      }),
      {}
    ),
    shouldAnimate: true
  });

  // viewer.extend(viewerCesium3DTilesInspectorMixin);

  // 相机视野控制
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000;

  // 加载建筑物
  const buildingsTileset = await Cesium3DTileset.fromIonAssetId(2601161);
  viewer.scene.primitives.add(buildingsTileset);
  await viewer.zoomTo(buildingsTileset, new HeadingPitchRange(0, Math.toRadians(-30), 8000));

  /**
   * 根据距离、方位角推算偏移点位置
   */
  const getPositionByDistance = (position: Cartesian3, angle: number = 0, distance: number) => {
    const matrix = Transforms.eastNorthUpToFixedFrame(position);
    const rzMatrix = Matrix3.fromRotationZ(Math.toRadians(-angle));
    const rotationZ = Matrix4.fromRotationTranslation(rzMatrix);
    Matrix4.multiply(matrix, rotationZ, matrix);
    const result = Matrix4.multiplyByPoint(
      matrix,
      new Cartesian3(0, distance, 0),
      new Cartesian3()
    );
    return result;
  };

  /**
   * 根据建筑物整体占位裁剪地球
   */
  const clipGlobe = (buildingsBoundingSphere: BoundingSphere) => {
    const tlPoint = getPositionByDistance(
      buildingsBoundingSphere.center,
      -45,
      window.Math.sqrt(2) * buildingsBoundingSphere.radius
    );
    const trPoint = getPositionByDistance(
      buildingsBoundingSphere.center,
      45,
      window.Math.sqrt(2) * buildingsBoundingSphere.radius
    );
    const blPoint = getPositionByDistance(
      buildingsBoundingSphere.center,
      -135,
      window.Math.sqrt(2) * buildingsBoundingSphere.radius
    );
    const brPoint = getPositionByDistance(
      buildingsBoundingSphere.center,
      135,
      window.Math.sqrt(2) * buildingsBoundingSphere.radius
    );
    viewer!.scene.globe.clippingPolygons = new ClippingPolygonCollection({
      polygons: [
        new ClippingPolygon({
          positions: [tlPoint, trPoint, brPoint, blPoint]
        })
      ],
      inverse: true
    });
  };

  clipGlobe(buildingsTileset.boundingSphere);

  // const destinationCartographic = Cartographic.fromCartesian(
  //   buildingsTileset.boundingSphere.center
  // );

  // viewer.camera.setView({
  //   destination: Cartesian3.fromRadians(
  //     destinationCartographic.longitude,
  //     destinationCartographic.latitude,
  //     destinationCartographic.height + 10000
  //   ),
  //   orientation: {
  //     pitch: Math.toRadians(-20)
  //   }
  // });
};

// 实体集合
const entitySet: Recordable = {
  camera: [],
  areaName: [],
  eventIndicator: [],
  wall: []
};

// 绘制区域名
const drawAreaName = () => {
  const areas: Recordable[] = [
    {
      name: 'A区',
      position: Cartesian3.fromDegrees(106.5228749184, 29.6032892971, 300),
      color: Color.ROYALBLUE
    },
    {
      name: 'B区',
      position: Cartesian3.fromDegrees(106.5412690401, 29.5803517809, 300),
      color: Color.ROYALBLUE
    },
    {
      name: 'C区',
      position: Cartesian3.fromDegrees(106.5546037113, 29.598341974, 300),
      color: Color.ROYALBLUE
    },
    {
      name: 'D区',
      position: Cartesian3.fromDegrees(106.5422356228, 29.6064299713, 100),
      color: Color.ROYALBLUE
    },
    {
      name: '火情',
      position: Cartesian3.fromDegrees(106.5183455988, 29.5899340745, 300),
      color: Color.RED
    }
  ];
  areas.forEach((item) => {
    const label = viewer!.entities.add({
      name: 'areaName',
      position: item.position,
      label: {
        text: item.name,
        font: '18px monospace',
        fillColor: Color.WHITE,
        showBackground: true,
        backgroundColor: item.color
      }
    });
    entitySet.areaName.push(label);
  });
};

// 绘制摄像头图标
const drawCamera = () => {
  const cameraPositions: Cartesian3[] = [
    Cartesian3.fromDegrees(106.5092575976, 29.5906347404, 150),
    Cartesian3.fromDegrees(106.5142533009, 29.5751663195),
    Cartesian3.fromDegrees(106.5200296353, 29.5813570239),
    Cartesian3.fromDegrees(106.5411885131, 29.5860310138),
    Cartesian3.fromDegrees(106.5582506174, 29.5903124027),
    Cartesian3.fromDegrees(106.5686440998, 29.5789227831),
    Cartesian3.fromDegrees(106.5541806999, 29.6051850152),
    Cartesian3.fromDegrees(106.5401722804, 29.597458779),
    Cartesian3.fromDegrees(106.516904898, 29.6042494649),
    Cartesian3.fromDegrees(106.5317053129, 29.6108654861),
    Cartesian3.fromDegrees(106.5551685602, 29.5758611336),
    Cartesian3.fromDegrees(106.5635579219, 29.6112247402)
  ];
  cameraPositions.forEach((item) => {
    const billboard = viewer!.entities.add({
      name: 'camera',
      position: item,
      billboard: {
        image: '/images/camera.png',
        width: 20,
        height: 20,
        heightReference: HeightReference.CLAMP_TO_3D_TILE
      }
    });
    entitySet.camera.push(billboard);
  });
};

// 绘制事件提示器
const drawEventIndicator = async () => {
  const animationStartTimestamp = Date.now();
  const animationDuration = 2000;
  const maxRadius = 200;
  let semiMinorAxis = 0;
  const ellipse = viewer!.entities.add({
    name: 'eventIndicator',
    position: Cartesian3.fromDegrees(106.5383012986, 29.5895430138),
    ellipse: {
      semiMajorAxis: new CallbackProperty(() => {
        const timestamp = Date.now();
        const diff = timestamp - animationStartTimestamp;
        const progress = diff % animationDuration;
        const rst = (progress / animationDuration) * maxRadius;
        semiMinorAxis = rst;
        return rst;
      }, false),
      semiMinorAxis: new CallbackProperty(() => {
        return semiMinorAxis;
      }, false),
      material: new ImageMaterialProperty({
        image: lightCircleCanvas.value
      }),
      height: -15
    }
  });
  entitySet.eventIndicator.push(ellipse);

  const markResource = await IonResource.fromAssetId(2622189);
  const mark = viewer!.entities.add({
    position: Cartesian3.fromDegrees(106.5383012986, 29.5895430138, 20),
    model: {
      uri: markResource,
      scale: 8,
      color: Color.CRIMSON,
      colorBlendMode: ColorBlendMode.REPLACE
    }
  });
  entitySet.eventIndicator.push(mark);
  // 添加跳动动画
  const animationStartTimestamp2 = Date.now();
  const animationDuration2 = 1000;
  const minHeight = 20;
  const maxHeight = 60;
  const heightDiff = maxHeight - minHeight;
  viewer!.scene.preUpdate.addEventListener(() => {
    const timestamp = Date.now();
    const diff = timestamp - animationStartTimestamp2;
    const progress = diff % animationDuration2;
    const halfDuration = animationDuration2 / 2;
    const height =
      progress < halfDuration
        ? (progress / halfDuration) * heightDiff + minHeight
        : maxHeight - ((progress - halfDuration) / halfDuration) * heightDiff;
    mark.position = new ConstantPositionProperty(
      Cartesian3.fromDegrees(106.5383012986, 29.5895430138, height)
    );
  });
};

// 绘制光墙
const drawWall = () => {
  const positions: Cartesian3[] = [
    Cartesian3.fromDegrees(106.5339864312, 29.5984674974, 100),
    Cartesian3.fromDegrees(106.54406056, 29.6088000459, 100),
    Cartesian3.fromDegrees(106.5500410579, 29.6094552732, 100),
    Cartesian3.fromDegrees(106.5505475836, 29.6082497701, 100),
    Cartesian3.fromDegrees(106.5360794939, 29.5972933842, 100),
    Cartesian3.fromDegrees(106.5339864312, 29.5984674974, 100)
  ];
  const wall = viewer!.entities.add({
    wall: {
      positions,
      minimumHeights: [-15, -15, -15, -15, -15, -15],
      material: Color.ROYALBLUE.withAlpha(0.5)
    }
  });
  entitySet.wall.push(wall);
};

// 绘制火焰
const drawFire = () => {
  const position = Cartesian3.fromDegrees(106.5183455988, 29.5899340745, 20);
  const modelMatrix = Matrix4.fromTranslation(position, new Matrix4());
  const particle = viewer!.scene.primitives.add(
    new ParticleSystem({
      image: '/images/smoke.png',
      imageSize: new Cartesian2(30, 30),
      emitter: new CircleEmitter(100),
      modelMatrix,
      startColor: Color.RED,
      endColor: Color.GRAY.withAlpha(0.1),
      emissionRate: 10,
      speed: 20
    })
  );
};

// 初始化事件
const initEvent = () => {
  if (!viewer) {
    return;
  }
  const eventType = ScreenSpaceEventType.LEFT_CLICK;
  // 注册事件
  viewer.screenSpaceEventHandler.setInputAction((event: any) => {
    const picked = viewer!.scene.pick(event.position);
    console.log('picked', picked);
    if (defined(picked)) {
      if (picked.id && picked.id instanceof Entity) {
        const entity = picked.id;
        if (entity.name === 'camera') {
          pickCamera(entity);
        } else if (entity.name === 'eventIndicator') {
          pickEventIndicator(entity);
        }
      }
    }
  }, eventType);
};

const pickCamera = (entity: Entity) => {
  viewer!.flyTo(entity, {
    duration: 1,
    offset: new HeadingPitchRange(0, Math.toRadians(-30), 1000)
  });
};

const pickEventIndicator = (entity: Entity) => {
  viewer!.flyTo(entity, {
    duration: 1,
    offset: new HeadingPitchRange(0, Math.toRadians(-30), 1000)
  });
};

// 初始化光圈Canvas
const initLightCircle = () => {
  const ctx = lightCircleCanvas.value.getContext('2d');
  const radialgradient = ctx.createRadialGradient(250, 250, 0, 250, 250, 250);
  radialgradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  radialgradient.addColorStop(1, '#4169E1');
  ctx.beginPath();
  ctx.arc(250, 250, 250, 0, 2 * Math.PI);
  ctx.fillStyle = radialgradient;
  ctx.fill();
};

onMounted(() => {
  initLightCircle();
  initScene();
  initEvent();
  drawAreaName();
  drawCamera();
  drawEventIndicator();
  drawWall();
  drawFire();
});
</script>

<style lang="less">
.demo-page {
  width: 100%;
  height: 100%;
  .cesium-container {
    width: 100%;
    height: 100%;
    .cesium-widget-credits {
      display: none;
    }
  }
  .light-circle-canvas {
    position: fixed;
    top: 0px;
    left: 0px;
    border: 1px solid black;
  }
}
</style>
