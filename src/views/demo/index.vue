<template>
  <div class="demo-page">
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
  Matrix4
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

window.CESIUM_BASE_URL = '/Cesium-1.117/Build/Cesium/';
Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNzYyMTVmOS0yNjlmLTQ0Y2UtOGFjOS00MmMwZGJjNGUxZGYiLCJpZCI6MjEwNTgxLCJpYXQiOjE3MTM4NTI1ODV9.adopnWJEcR84Txv9e4TpjHWEXXc3LMYAj1Mhvr6dMTQ';

const cesiumContainer = ref();

let viewer: Viewer | null = null;

const initViewer = async () => {
  viewer = new Viewer(cesiumContainer.value, {
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
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
    )
  });

  // viewer.extend(viewerCesium3DTilesInspectorMixin);

  const buildingsTileset = await Cesium3DTileset.fromIonAssetId(2601161);
  console.log(buildingsTileset.boundingSphere);
  viewer.scene.primitives.add(buildingsTileset);
  // await viewer.zoomTo(buildingsTileset);

  function getPositionByDistance(position: Cartesian3, angle: number = 0, distance: number) {
    const matrix = Transforms.eastNorthUpToFixedFrame(position);
    const rMatrix = Matrix3.fromRotationZ(Math.toRadians(angle));
    const rotationZ = Matrix4.fromRotationTranslation(rMatrix);
    Matrix4.multiply(matrix, rotationZ, matrix);
    const result = Matrix4.multiplyByPoint(
      matrix,
      new Cartesian3(0, distance, 0),
      new Cartesian3()
    );
    return result;
  }

  const clipGlobe = (buildingsBoundingSphere: BoundingSphere) => {
    const sideLength = buildingsBoundingSphere.radius * 2;
    const tlPoint = new Cartesian3(
      buildingsBoundingSphere.center.x - buildingsBoundingSphere.radius,
      buildingsBoundingSphere.center.y + buildingsBoundingSphere.radius,
      buildingsBoundingSphere.center.z
    );
    viewer!.scene.globe.clippingPolygons = new ClippingPolygonCollection({
      polygons: [
        new ClippingPolygon({
          positions: [
            tlPoint,
            new Cartesian3(tlPoint.x + sideLength, tlPoint.y, tlPoint.z),
            new Cartesian3(tlPoint.x + sideLength, tlPoint.y - sideLength, tlPoint.z),
            new Cartesian3(tlPoint.x, tlPoint.y - sideLength, tlPoint.z)
          ]
        })
      ],
      inverse: true
    });
  };

  clipGlobe(buildingsTileset.boundingSphere);

  const destinationCartographic = Cartographic.fromCartesian(
    buildingsTileset.boundingSphere.center
  );

  viewer.camera.setView({
    // destination: Cartesian3.fromDegrees(106.543225, 29.541998, 800),
    destination: Cartesian3.fromRadians(
      destinationCartographic.longitude,
      destinationCartographic.latitude,
      destinationCartographic.height + 10000
    ),
    orientation: {
      pitch: Math.toRadians(-90)
    }
  });
};

onMounted(() => {
  initViewer();
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
}
</style>
