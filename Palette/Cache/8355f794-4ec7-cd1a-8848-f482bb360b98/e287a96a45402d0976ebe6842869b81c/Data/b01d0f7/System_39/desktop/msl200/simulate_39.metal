#pragma clang diagnostic ignored "-Wmissing-prototypes"
#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
#define SC_ENABLE_INSTANCED_RENDERING
namespace SNAP_VS {
int sc_GetStereoViewIndex()
{
return 0;
}
}
#ifndef sc_TextureRenderingLayout_Regular
#define sc_TextureRenderingLayout_Regular 0
#define sc_TextureRenderingLayout_StereoInstancedClipped 1
#define sc_TextureRenderingLayout_StereoMultiview 2
#endif
//SG_REFLECTION_BEGIN(200)
//attribute vec4 position 0
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec3 normal 1
//attribute vec4 tangent 2
//output vec4 sc_FragData0 0
//output vec4 sc_FragData1 1
//output vec4 sc_FragData2 2
//output vec4 sc_FragData3 3
//sampler sampler colorMapSmpSC 0:25
//sampler sampler renderTarget0SmpSC 0:27
//sampler sampler renderTarget1SmpSC 0:28
//sampler sampler renderTarget2SmpSC 0:29
//sampler sampler renderTarget3SmpSC 0:30
//sampler sampler xMapSmpSC 0:40
//sampler sampler yMapSmpSC 0:41
//sampler sampler zMapSmpSC 0:42
//texture texture2D colorMap 0:0:0:25
//texture texture2D renderTarget0 0:2:0:27
//texture texture2D renderTarget1 0:3:0:28
//texture texture2D renderTarget2 0:4:0:29
//texture texture2D renderTarget3 0:5:0:30
//texture texture2D xMap 0:22:0:40
//texture texture2D yMap 0:23:0:41
//texture texture2D zMap 0:24:0:42
//ubo int UserUniforms 0:43:7920 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4 sc_StereoClipPlanes 3664:[2]:16
//float overrideTimeElapsed 4112:[32]:4
//float overrideTimeDelta 4240
//bool vfxBatchEnable 4248:[32]:4
//float4x4 vfxModelMatrix 4512:[32]:64
//int vfxOffsetInstancesRead 7348
//int vfxOffsetInstancesWrite 7352
//float2 vfxTargetSizeRead 7360
//float2 vfxTargetSizeWrite 7368
//int vfxTargetWidth 7376
//float3x3 xMapTransform 7440
//float4 xMapUvMinMax 7488
//float4 xMapBorderColor 7504
//float3x3 yMapTransform 7568
//float4 yMapUvMinMax 7616
//float4 yMapBorderColor 7632
//float3x3 zMapTransform 7696
//float4 zMapUvMinMax 7744
//float4 zMapBorderColor 7760
//float3x3 colorMapTransform 7824
//float4 colorMapUvMinMax 7872
//float4 colorMapBorderColor 7888
//float Port_Value_N009 7904
//float Port_Value_N004 7908
//float Port_Value_N006 7912
//}
//spec_const bool SC_USE_CLAMP_TO_BORDER_colorMap 0 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_xMap 1 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_yMap 2 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_zMap 3 0
//spec_const bool SC_USE_UV_MIN_MAX_colorMap 4 0
//spec_const bool SC_USE_UV_MIN_MAX_xMap 5 0
//spec_const bool SC_USE_UV_MIN_MAX_yMap 6 0
//spec_const bool SC_USE_UV_MIN_MAX_zMap 7 0
//spec_const bool SC_USE_UV_TRANSFORM_colorMap 8 0
//spec_const bool SC_USE_UV_TRANSFORM_xMap 9 0
//spec_const bool SC_USE_UV_TRANSFORM_yMap 10 0
//spec_const bool SC_USE_UV_TRANSFORM_zMap 11 0
//spec_const bool colorMapHasSwappedViews 12 0
//spec_const bool renderTarget0HasSwappedViews 13 0
//spec_const bool renderTarget1HasSwappedViews 14 0
//spec_const bool renderTarget2HasSwappedViews 15 0
//spec_const bool renderTarget3HasSwappedViews 16 0
//spec_const bool xMapHasSwappedViews 17 0
//spec_const bool yMapHasSwappedViews 18 0
//spec_const bool zMapHasSwappedViews 19 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_colorMap 20 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_xMap 21 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_yMap 22 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_zMap 23 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_colorMap 24 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_xMap 25 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_yMap 26 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_zMap 27 -1
//spec_const int colorMapLayout 28 0
//spec_const int renderTarget0Layout 29 0
//spec_const int renderTarget1Layout 30 0
//spec_const int renderTarget2Layout 31 0
//spec_const int renderTarget3Layout 32 0
//spec_const int sc_ShaderCacheConstant 33 0
//spec_const int sc_StereoRenderingMode 34 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 35 0
//spec_const int xMapLayout 36 0
//spec_const int yMapLayout 37 0
//spec_const int zMapLayout 38 0
//SG_REFLECTION_END
constant bool SC_USE_CLAMP_TO_BORDER_colorMap [[function_constant(0)]];
constant bool SC_USE_CLAMP_TO_BORDER_colorMap_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_colorMap) ? SC_USE_CLAMP_TO_BORDER_colorMap : false;
constant bool SC_USE_CLAMP_TO_BORDER_xMap [[function_constant(1)]];
constant bool SC_USE_CLAMP_TO_BORDER_xMap_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_xMap) ? SC_USE_CLAMP_TO_BORDER_xMap : false;
constant bool SC_USE_CLAMP_TO_BORDER_yMap [[function_constant(2)]];
constant bool SC_USE_CLAMP_TO_BORDER_yMap_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_yMap) ? SC_USE_CLAMP_TO_BORDER_yMap : false;
constant bool SC_USE_CLAMP_TO_BORDER_zMap [[function_constant(3)]];
constant bool SC_USE_CLAMP_TO_BORDER_zMap_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_zMap) ? SC_USE_CLAMP_TO_BORDER_zMap : false;
constant bool SC_USE_UV_MIN_MAX_colorMap [[function_constant(4)]];
constant bool SC_USE_UV_MIN_MAX_colorMap_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_colorMap) ? SC_USE_UV_MIN_MAX_colorMap : false;
constant bool SC_USE_UV_MIN_MAX_xMap [[function_constant(5)]];
constant bool SC_USE_UV_MIN_MAX_xMap_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_xMap) ? SC_USE_UV_MIN_MAX_xMap : false;
constant bool SC_USE_UV_MIN_MAX_yMap [[function_constant(6)]];
constant bool SC_USE_UV_MIN_MAX_yMap_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_yMap) ? SC_USE_UV_MIN_MAX_yMap : false;
constant bool SC_USE_UV_MIN_MAX_zMap [[function_constant(7)]];
constant bool SC_USE_UV_MIN_MAX_zMap_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_zMap) ? SC_USE_UV_MIN_MAX_zMap : false;
constant bool SC_USE_UV_TRANSFORM_colorMap [[function_constant(8)]];
constant bool SC_USE_UV_TRANSFORM_colorMap_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_colorMap) ? SC_USE_UV_TRANSFORM_colorMap : false;
constant bool SC_USE_UV_TRANSFORM_xMap [[function_constant(9)]];
constant bool SC_USE_UV_TRANSFORM_xMap_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_xMap) ? SC_USE_UV_TRANSFORM_xMap : false;
constant bool SC_USE_UV_TRANSFORM_yMap [[function_constant(10)]];
constant bool SC_USE_UV_TRANSFORM_yMap_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_yMap) ? SC_USE_UV_TRANSFORM_yMap : false;
constant bool SC_USE_UV_TRANSFORM_zMap [[function_constant(11)]];
constant bool SC_USE_UV_TRANSFORM_zMap_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_zMap) ? SC_USE_UV_TRANSFORM_zMap : false;
constant bool colorMapHasSwappedViews [[function_constant(12)]];
constant bool colorMapHasSwappedViews_tmp = is_function_constant_defined(colorMapHasSwappedViews) ? colorMapHasSwappedViews : false;
constant bool renderTarget0HasSwappedViews [[function_constant(13)]];
constant bool renderTarget0HasSwappedViews_tmp = is_function_constant_defined(renderTarget0HasSwappedViews) ? renderTarget0HasSwappedViews : false;
constant bool renderTarget1HasSwappedViews [[function_constant(14)]];
constant bool renderTarget1HasSwappedViews_tmp = is_function_constant_defined(renderTarget1HasSwappedViews) ? renderTarget1HasSwappedViews : false;
constant bool renderTarget2HasSwappedViews [[function_constant(15)]];
constant bool renderTarget2HasSwappedViews_tmp = is_function_constant_defined(renderTarget2HasSwappedViews) ? renderTarget2HasSwappedViews : false;
constant bool renderTarget3HasSwappedViews [[function_constant(16)]];
constant bool renderTarget3HasSwappedViews_tmp = is_function_constant_defined(renderTarget3HasSwappedViews) ? renderTarget3HasSwappedViews : false;
constant bool xMapHasSwappedViews [[function_constant(17)]];
constant bool xMapHasSwappedViews_tmp = is_function_constant_defined(xMapHasSwappedViews) ? xMapHasSwappedViews : false;
constant bool yMapHasSwappedViews [[function_constant(18)]];
constant bool yMapHasSwappedViews_tmp = is_function_constant_defined(yMapHasSwappedViews) ? yMapHasSwappedViews : false;
constant bool zMapHasSwappedViews [[function_constant(19)]];
constant bool zMapHasSwappedViews_tmp = is_function_constant_defined(zMapHasSwappedViews) ? zMapHasSwappedViews : false;
constant int SC_SOFTWARE_WRAP_MODE_U_colorMap [[function_constant(20)]];
constant int SC_SOFTWARE_WRAP_MODE_U_colorMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_colorMap) ? SC_SOFTWARE_WRAP_MODE_U_colorMap : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_xMap [[function_constant(21)]];
constant int SC_SOFTWARE_WRAP_MODE_U_xMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_xMap) ? SC_SOFTWARE_WRAP_MODE_U_xMap : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_yMap [[function_constant(22)]];
constant int SC_SOFTWARE_WRAP_MODE_U_yMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_yMap) ? SC_SOFTWARE_WRAP_MODE_U_yMap : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_zMap [[function_constant(23)]];
constant int SC_SOFTWARE_WRAP_MODE_U_zMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_zMap) ? SC_SOFTWARE_WRAP_MODE_U_zMap : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_colorMap [[function_constant(24)]];
constant int SC_SOFTWARE_WRAP_MODE_V_colorMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_colorMap) ? SC_SOFTWARE_WRAP_MODE_V_colorMap : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_xMap [[function_constant(25)]];
constant int SC_SOFTWARE_WRAP_MODE_V_xMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_xMap) ? SC_SOFTWARE_WRAP_MODE_V_xMap : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_yMap [[function_constant(26)]];
constant int SC_SOFTWARE_WRAP_MODE_V_yMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_yMap) ? SC_SOFTWARE_WRAP_MODE_V_yMap : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_zMap [[function_constant(27)]];
constant int SC_SOFTWARE_WRAP_MODE_V_zMap_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_zMap) ? SC_SOFTWARE_WRAP_MODE_V_zMap : -1;
constant int colorMapLayout [[function_constant(28)]];
constant int colorMapLayout_tmp = is_function_constant_defined(colorMapLayout) ? colorMapLayout : 0;
constant int renderTarget0Layout [[function_constant(29)]];
constant int renderTarget0Layout_tmp = is_function_constant_defined(renderTarget0Layout) ? renderTarget0Layout : 0;
constant int renderTarget1Layout [[function_constant(30)]];
constant int renderTarget1Layout_tmp = is_function_constant_defined(renderTarget1Layout) ? renderTarget1Layout : 0;
constant int renderTarget2Layout [[function_constant(31)]];
constant int renderTarget2Layout_tmp = is_function_constant_defined(renderTarget2Layout) ? renderTarget2Layout : 0;
constant int renderTarget3Layout [[function_constant(32)]];
constant int renderTarget3Layout_tmp = is_function_constant_defined(renderTarget3Layout) ? renderTarget3Layout : 0;
constant int sc_ShaderCacheConstant [[function_constant(33)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_StereoRenderingMode [[function_constant(34)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(35)]];
constant int sc_StereoRendering_IsClipDistanceEnabled_tmp = is_function_constant_defined(sc_StereoRendering_IsClipDistanceEnabled) ? sc_StereoRendering_IsClipDistanceEnabled : 0;
constant int xMapLayout [[function_constant(36)]];
constant int xMapLayout_tmp = is_function_constant_defined(xMapLayout) ? xMapLayout : 0;
constant int yMapLayout [[function_constant(37)]];
constant int yMapLayout_tmp = is_function_constant_defined(yMapLayout) ? yMapLayout : 0;
constant int zMapLayout [[function_constant(38)]];
constant int zMapLayout_tmp = is_function_constant_defined(zMapLayout) ? zMapLayout : 0;

namespace SNAP_VS {
struct sc_Vertex_t
{
float4 position;
float3 normal;
float3 tangent;
float2 texture0;
float2 texture1;
};
struct ssParticle
{
float3 Position;
float3 Velocity;
float4 Color;
float Size;
float Age;
float Life;
float Mass;
float3x3 Matrix;
bool Dead;
float4 Quaternion;
float SpawnIndex;
float SpawnIndexRemainder;
float NextBurstTime;
float SpawnOffset;
float Seed;
float2 Seed2000;
float TimeShift;
int Index1D;
int Index1DPerCopy;
float Index1DPerCopyF;
int StateID;
float Coord1D;
float Ratio1D;
float Ratio1DPerCopy;
int2 Index2D;
float2 Coord2D;
float2 Ratio2D;
float3 Force;
bool Spawned;
float CopyId;
float SpawnAmount;
float BurstAmount;
float BurstPeriod;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float gComponentTime;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int vfxNumCopies;
int vfxBatchEnable[32];
int vfxEmitParticle[32];
float4x4 vfxModelMatrix[32];
float4 renderTarget0Size;
float4 renderTarget0Dims;
float4 renderTarget0View;
float4 renderTarget1Size;
float4 renderTarget1Dims;
float4 renderTarget1View;
float4 renderTarget2Size;
float4 renderTarget2Dims;
float4 renderTarget2View;
float4 renderTarget3Size;
float4 renderTarget3Dims;
float4 renderTarget3View;
float4 sortRenderTarget0Size;
float4 sortRenderTarget0Dims;
float4 sortRenderTarget0View;
float4 sortRenderTarget1Size;
float4 sortRenderTarget1Dims;
float4 sortRenderTarget1View;
float3 vfxLocalAabbMin;
float3 vfxLocalAabbMax;
float vfxCameraAspect;
float vfxCameraNear;
float vfxCameraFar;
float4x4 vfxProjectionMatrix;
float4x4 vfxProjectionMatrixInverse;
float4x4 vfxViewMatrix;
float4x4 vfxViewMatrixInverse;
float4x4 vfxViewProjectionMatrix;
float4x4 vfxViewProjectionMatrixInverse;
float3 vfxCameraPosition;
float3 vfxCameraUp;
float3 vfxCameraForward;
float3 vfxCameraRight;
int vfxFrame;
int vfxOffsetInstancesRead;
int vfxOffsetInstancesWrite;
float2 vfxTargetSizeRead;
float2 vfxTargetSizeWrite;
int vfxTargetWidth;
float2 ssSORT_RENDER_TARGET_SIZE;
float4 xMapSize;
float4 xMapDims;
float4 xMapView;
float3x3 xMapTransform;
float4 xMapUvMinMax;
float4 xMapBorderColor;
float4 yMapSize;
float4 yMapDims;
float4 yMapView;
float3x3 yMapTransform;
float4 yMapUvMinMax;
float4 yMapBorderColor;
float4 zMapSize;
float4 zMapDims;
float4 zMapView;
float3x3 zMapTransform;
float4 zMapUvMinMax;
float4 zMapBorderColor;
float4 colorMapSize;
float4 colorMapDims;
float4 colorMapView;
float3x3 colorMapTransform;
float4 colorMapUvMinMax;
float4 colorMapBorderColor;
float Port_Value_N009;
float Port_Value_N004;
float Port_Value_N006;
};
struct sc_Set0
{
texture2d<float> colorMap [[id(0)]];
texture2d<float> renderTarget0 [[id(2)]];
texture2d<float> renderTarget1 [[id(3)]];
texture2d<float> renderTarget2 [[id(4)]];
texture2d<float> renderTarget3 [[id(5)]];
texture2d<float> xMap [[id(22)]];
texture2d<float> yMap [[id(23)]];
texture2d<float> zMap [[id(24)]];
sampler colorMapSmpSC [[id(25)]];
sampler renderTarget0SmpSC [[id(27)]];
sampler renderTarget1SmpSC [[id(28)]];
sampler renderTarget2SmpSC [[id(29)]];
sampler renderTarget3SmpSC [[id(30)]];
sampler xMapSmpSC [[id(40)]];
sampler yMapSmpSC [[id(41)]];
sampler zMapSmpSC [[id(42)]];
constant userUniformsObj* UserUniforms [[id(43)]];
};
struct main_vert_out
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float2 varShadowTex [[user(locn6)]];
int varStereoViewID [[user(locn7)]];
float varClipDistance [[user(locn8)]];
float4 varColor [[user(locn9)]];
int Interp_Particle_Index [[user(locn10)]];
float3 Interp_Particle_Force [[user(locn11)]];
float2 Interp_Particle_Coord [[user(locn12)]];
float Interp_Particle_SpawnIndex [[user(locn13)]];
float Interp_Particle_NextBurstTime [[user(locn14)]];
float3 Interp_Particle_Position [[user(locn15)]];
float3 Interp_Particle_Velocity [[user(locn16)]];
float Interp_Particle_Life [[user(locn17)]];
float Interp_Particle_Age [[user(locn18)]];
float Interp_Particle_Size [[user(locn19)]];
float4 Interp_Particle_Color [[user(locn20)]];
float4 Interp_Particle_Quaternion [[user(locn21)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
bool ssDecodeParticle(thread const int& InstanceID,thread uint& gl_InstanceIndex,constant userUniformsObj& UserUniforms,thread texture2d<float> renderTarget0,thread sampler renderTarget0SmpSC,thread texture2d<float> renderTarget1,thread sampler renderTarget1SmpSC,thread texture2d<float> renderTarget2,thread sampler renderTarget2SmpSC,thread texture2d<float> renderTarget3,thread sampler renderTarget3SmpSC,thread ssParticle& gParticle)
{
ssParticle param=gParticle;
int param_1=InstanceID;
param.Position=float3(0.0);
param.Velocity=float3(0.0);
param.Color=float4(0.0);
param.Size=0.0;
param.Age=0.0;
param.Life=0.0;
param.Mass=1.0;
param.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
param.Quaternion=float4(0.0,0.0,0.0,1.0);
param.CopyId=float(param_1/64);
param.SpawnIndex=-1.0;
param.SpawnIndexRemainder=-1.0;
param.SpawnAmount=0.0;
param.BurstAmount=0.0;
param.BurstPeriod=0.0;
param.NextBurstTime=0.0;
gParticle=param;
int param_2=InstanceID;
ssParticle param_3=gParticle;
param_3.Spawned=false;
param_3.Dead=false;
param_3.Force=float3(0.0);
param_3.Index1D=param_2;
param_3.Index1DPerCopy=param_2%64;
param_3.Index1DPerCopyF=float(param_3.Index1DPerCopy);
param_3.StateID=(64*((param_2/64)+1))-1;
int l9_0=param_3.Index1D;
int2 l9_1=int2(l9_0%64,l9_0/64);
param_3.Index2D=l9_1;
int l9_2=param_3.Index1D;
float l9_3=(float(l9_2)+0.5)/64.0;
param_3.Coord1D=l9_3;
int2 l9_4=param_3.Index2D;
float2 l9_5=(float2(l9_4)+float2(0.5))/float2(64.0,1.0);
param_3.Coord2D=l9_5;
int l9_6=param_3.Index1D;
float l9_7=float(l9_6)/63.0;
param_3.Ratio1D=l9_7;
int l9_8=param_3.Index1DPerCopy;
float l9_9=float(l9_8)/63.0;
param_3.Ratio1DPerCopy=l9_9;
int2 l9_10=param_3.Index2D;
float2 l9_11=float2(l9_10)/float2(63.0,1.0);
param_3.Ratio2D=l9_11;
param_3.Seed=0.0;
int l9_12=param_3.Index1D;
int l9_13=l9_12;
int l9_14=((l9_13*((l9_13*1471343)+101146501))+1559861749)&2147483647;
int l9_15=l9_14;
float l9_16=float(l9_15)*4.6566129e-10;
float l9_17=l9_16;
param_3.TimeShift=l9_17;
param_3.TimeShift=0.0;
param_3.SpawnOffset=0.0;
ssParticle l9_18=param_3;
l9_18.Seed=(l9_18.Ratio1D*0.97637898)+0.151235;
int2 l9_19=int2(l9_18.Index1D%400,l9_18.Index1D/400);
l9_18.Seed2000=(float2(l9_19)+float2(1.0))/float2(399.0);
param_3=l9_18;
gParticle=param_3;
int offsetPixelId=(UserUniforms.vfxOffsetInstancesRead+InstanceID)*4;
int param_4=offsetPixelId;
int param_5=UserUniforms.vfxTargetWidth;
int l9_20=param_4-((param_4/param_5)*param_5);
int2 Index2D=int2(l9_20,offsetPixelId/UserUniforms.vfxTargetWidth);
float2 Coord=(float2(Index2D)+float2(0.5))/float2(2048.0,UserUniforms.vfxTargetSizeRead.y);
float2 Offset=float2(0.00048828125,0.0);
float2 uv=float2(0.0);
float Scalar0=0.0;
float Scalar1=0.0;
float Scalar2=0.0;
float Scalar3=0.0;
float Scalar4=0.0;
float Scalar5=0.0;
float Scalar6=0.0;
float Scalar7=0.0;
float Scalar8=0.0;
float Scalar9=0.0;
float Scalar10=0.0;
float Scalar11=0.0;
float Scalar12=0.0;
float Scalar13=0.0;
float Scalar14=0.0;
float Scalar15=0.0;
uv=Coord+(Offset*0.0);
float2 param_6=uv;
float2 l9_21=param_6;
int l9_22;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_23=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_23=0;
}
else
{
l9_23=gl_InstanceIndex%2;
}
int l9_24=l9_23;
l9_22=1-l9_24;
}
else
{
int l9_25=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_25=0;
}
else
{
l9_25=gl_InstanceIndex%2;
}
int l9_26=l9_25;
l9_22=l9_26;
}
int l9_27=l9_22;
float2 l9_28=l9_21;
int l9_29=renderTarget0Layout_tmp;
int l9_30=l9_27;
float2 l9_31=l9_28;
int l9_32=l9_29;
int l9_33=l9_30;
float3 l9_34=float3(0.0);
if (l9_32==0)
{
l9_34=float3(l9_31,0.0);
}
else
{
if (l9_32==1)
{
l9_34=float3(l9_31.x,(l9_31.y*0.5)+(0.5-(float(l9_33)*0.5)),0.0);
}
else
{
l9_34=float3(l9_31,float(l9_33));
}
}
float3 l9_35=l9_34;
float3 l9_36=l9_35;
float4 l9_37=renderTarget0.sample(renderTarget0SmpSC,l9_36.xy,level(0.0));
float4 l9_38=l9_37;
float4 l9_39=l9_38;
float4 renderTarget0Sample=l9_39;
float4 l9_40=renderTarget0Sample;
bool l9_41=dot(abs(l9_40),float4(1.0))<9.9999997e-06;
bool l9_42;
if (!l9_41)
{
int l9_43=gl_InstanceIndex;
l9_42=!(UserUniforms.vfxBatchEnable[l9_43/64]!=0);
}
else
{
l9_42=l9_41;
}
if (l9_42)
{
return false;
}
Scalar0=renderTarget0Sample.x;
Scalar1=renderTarget0Sample.y;
Scalar2=renderTarget0Sample.z;
Scalar3=renderTarget0Sample.w;
float2 param_7=uv;
float2 l9_44=param_7;
int l9_45;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_46=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_46=0;
}
else
{
l9_46=gl_InstanceIndex%2;
}
int l9_47=l9_46;
l9_45=1-l9_47;
}
else
{
int l9_48=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_48=0;
}
else
{
l9_48=gl_InstanceIndex%2;
}
int l9_49=l9_48;
l9_45=l9_49;
}
int l9_50=l9_45;
float2 l9_51=l9_44;
int l9_52=renderTarget1Layout_tmp;
int l9_53=l9_50;
float2 l9_54=l9_51;
int l9_55=l9_52;
int l9_56=l9_53;
float3 l9_57=float3(0.0);
if (l9_55==0)
{
l9_57=float3(l9_54,0.0);
}
else
{
if (l9_55==1)
{
l9_57=float3(l9_54.x,(l9_54.y*0.5)+(0.5-(float(l9_56)*0.5)),0.0);
}
else
{
l9_57=float3(l9_54,float(l9_56));
}
}
float3 l9_58=l9_57;
float3 l9_59=l9_58;
float4 l9_60=renderTarget1.sample(renderTarget1SmpSC,l9_59.xy,level(0.0));
float4 l9_61=l9_60;
float4 l9_62=l9_61;
float4 renderTarget1Sample=l9_62;
Scalar4=renderTarget1Sample.x;
Scalar5=renderTarget1Sample.y;
Scalar6=renderTarget1Sample.z;
Scalar7=renderTarget1Sample.w;
float2 param_8=uv;
float2 l9_63=param_8;
int l9_64;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_65=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_65=0;
}
else
{
l9_65=gl_InstanceIndex%2;
}
int l9_66=l9_65;
l9_64=1-l9_66;
}
else
{
int l9_67=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_67=0;
}
else
{
l9_67=gl_InstanceIndex%2;
}
int l9_68=l9_67;
l9_64=l9_68;
}
int l9_69=l9_64;
float2 l9_70=l9_63;
int l9_71=renderTarget2Layout_tmp;
int l9_72=l9_69;
float2 l9_73=l9_70;
int l9_74=l9_71;
int l9_75=l9_72;
float3 l9_76=float3(0.0);
if (l9_74==0)
{
l9_76=float3(l9_73,0.0);
}
else
{
if (l9_74==1)
{
l9_76=float3(l9_73.x,(l9_73.y*0.5)+(0.5-(float(l9_75)*0.5)),0.0);
}
else
{
l9_76=float3(l9_73,float(l9_75));
}
}
float3 l9_77=l9_76;
float3 l9_78=l9_77;
float4 l9_79=renderTarget2.sample(renderTarget2SmpSC,l9_78.xy,level(0.0));
float4 l9_80=l9_79;
float4 l9_81=l9_80;
float4 renderTarget2Sample=l9_81;
Scalar8=renderTarget2Sample.x;
Scalar9=renderTarget2Sample.y;
Scalar10=renderTarget2Sample.z;
Scalar11=renderTarget2Sample.w;
float2 param_9=uv;
float2 l9_82=param_9;
int l9_83;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_84=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_84=0;
}
else
{
l9_84=gl_InstanceIndex%2;
}
int l9_85=l9_84;
l9_83=1-l9_85;
}
else
{
int l9_86=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_86=0;
}
else
{
l9_86=gl_InstanceIndex%2;
}
int l9_87=l9_86;
l9_83=l9_87;
}
int l9_88=l9_83;
float2 l9_89=l9_82;
int l9_90=renderTarget3Layout_tmp;
int l9_91=l9_88;
float2 l9_92=l9_89;
int l9_93=l9_90;
int l9_94=l9_91;
float3 l9_95=float3(0.0);
if (l9_93==0)
{
l9_95=float3(l9_92,0.0);
}
else
{
if (l9_93==1)
{
l9_95=float3(l9_92.x,(l9_92.y*0.5)+(0.5-(float(l9_94)*0.5)),0.0);
}
else
{
l9_95=float3(l9_92,float(l9_94));
}
}
float3 l9_96=l9_95;
float3 l9_97=l9_96;
float4 l9_98=renderTarget3.sample(renderTarget3SmpSC,l9_97.xy,level(0.0));
float4 l9_99=l9_98;
float4 l9_100=l9_99;
float4 renderTarget3Sample=l9_100;
Scalar12=renderTarget3Sample.x;
Scalar13=renderTarget3Sample.y;
Scalar14=renderTarget3Sample.z;
Scalar15=renderTarget3Sample.w;
float4 param_10=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_11=-1000.0;
float param_12=1000.0;
float4 l9_101=param_10;
float l9_102=param_11;
float l9_103=param_12;
float l9_104=0.99998999;
float4 l9_105=l9_101;
#if (1)
{
l9_105=floor((l9_105*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_106=dot(l9_105,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_107=l9_106;
float l9_108=0.0;
float l9_109=l9_104;
float l9_110=l9_102;
float l9_111=l9_103;
float l9_112=l9_110+(((l9_107-l9_108)*(l9_111-l9_110))/(l9_109-l9_108));
float l9_113=l9_112;
float l9_114=l9_113;
gParticle.Position.x=l9_114;
float4 param_13=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_14=-1000.0;
float param_15=1000.0;
float4 l9_115=param_13;
float l9_116=param_14;
float l9_117=param_15;
float l9_118=0.99998999;
float4 l9_119=l9_115;
#if (1)
{
l9_119=floor((l9_119*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_120=dot(l9_119,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_121=l9_120;
float l9_122=0.0;
float l9_123=l9_118;
float l9_124=l9_116;
float l9_125=l9_117;
float l9_126=l9_124+(((l9_121-l9_122)*(l9_125-l9_124))/(l9_123-l9_122));
float l9_127=l9_126;
float l9_128=l9_127;
gParticle.Position.y=l9_128;
float4 param_16=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_17=-1000.0;
float param_18=1000.0;
float4 l9_129=param_16;
float l9_130=param_17;
float l9_131=param_18;
float l9_132=0.99998999;
float4 l9_133=l9_129;
#if (1)
{
l9_133=floor((l9_133*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_134=dot(l9_133,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_135=l9_134;
float l9_136=0.0;
float l9_137=l9_132;
float l9_138=l9_130;
float l9_139=l9_131;
float l9_140=l9_138+(((l9_135-l9_136)*(l9_139-l9_138))/(l9_137-l9_136));
float l9_141=l9_140;
float l9_142=l9_141;
gParticle.Position.z=l9_142;
float4 param_19=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_20=-1000.0;
float param_21=1000.0;
float4 l9_143=param_19;
float l9_144=param_20;
float l9_145=param_21;
float l9_146=0.99998999;
float4 l9_147=l9_143;
#if (1)
{
l9_147=floor((l9_147*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_148=dot(l9_147,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_149=l9_148;
float l9_150=0.0;
float l9_151=l9_146;
float l9_152=l9_144;
float l9_153=l9_145;
float l9_154=l9_152+(((l9_149-l9_150)*(l9_153-l9_152))/(l9_151-l9_150));
float l9_155=l9_154;
float l9_156=l9_155;
gParticle.Velocity.x=l9_156;
uv=Coord+(Offset*1.0);
float2 param_22=uv;
float2 l9_157=param_22;
int l9_158;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_159=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_159=0;
}
else
{
l9_159=gl_InstanceIndex%2;
}
int l9_160=l9_159;
l9_158=1-l9_160;
}
else
{
int l9_161=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_161=0;
}
else
{
l9_161=gl_InstanceIndex%2;
}
int l9_162=l9_161;
l9_158=l9_162;
}
int l9_163=l9_158;
float2 l9_164=l9_157;
int l9_165=renderTarget0Layout_tmp;
int l9_166=l9_163;
float2 l9_167=l9_164;
int l9_168=l9_165;
int l9_169=l9_166;
float3 l9_170=float3(0.0);
if (l9_168==0)
{
l9_170=float3(l9_167,0.0);
}
else
{
if (l9_168==1)
{
l9_170=float3(l9_167.x,(l9_167.y*0.5)+(0.5-(float(l9_169)*0.5)),0.0);
}
else
{
l9_170=float3(l9_167,float(l9_169));
}
}
float3 l9_171=l9_170;
float3 l9_172=l9_171;
float4 l9_173=renderTarget0.sample(renderTarget0SmpSC,l9_172.xy,level(0.0));
float4 l9_174=l9_173;
float4 l9_175=l9_174;
float4 renderTarget0Sample_1=l9_175;
Scalar0=renderTarget0Sample_1.x;
Scalar1=renderTarget0Sample_1.y;
Scalar2=renderTarget0Sample_1.z;
Scalar3=renderTarget0Sample_1.w;
float2 param_23=uv;
float2 l9_176=param_23;
int l9_177;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_178=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_178=0;
}
else
{
l9_178=gl_InstanceIndex%2;
}
int l9_179=l9_178;
l9_177=1-l9_179;
}
else
{
int l9_180=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_180=0;
}
else
{
l9_180=gl_InstanceIndex%2;
}
int l9_181=l9_180;
l9_177=l9_181;
}
int l9_182=l9_177;
float2 l9_183=l9_176;
int l9_184=renderTarget1Layout_tmp;
int l9_185=l9_182;
float2 l9_186=l9_183;
int l9_187=l9_184;
int l9_188=l9_185;
float3 l9_189=float3(0.0);
if (l9_187==0)
{
l9_189=float3(l9_186,0.0);
}
else
{
if (l9_187==1)
{
l9_189=float3(l9_186.x,(l9_186.y*0.5)+(0.5-(float(l9_188)*0.5)),0.0);
}
else
{
l9_189=float3(l9_186,float(l9_188));
}
}
float3 l9_190=l9_189;
float3 l9_191=l9_190;
float4 l9_192=renderTarget1.sample(renderTarget1SmpSC,l9_191.xy,level(0.0));
float4 l9_193=l9_192;
float4 l9_194=l9_193;
float4 renderTarget1Sample_1=l9_194;
Scalar4=renderTarget1Sample_1.x;
Scalar5=renderTarget1Sample_1.y;
Scalar6=renderTarget1Sample_1.z;
Scalar7=renderTarget1Sample_1.w;
float2 param_24=uv;
float2 l9_195=param_24;
int l9_196;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_197=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_197=0;
}
else
{
l9_197=gl_InstanceIndex%2;
}
int l9_198=l9_197;
l9_196=1-l9_198;
}
else
{
int l9_199=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_199=0;
}
else
{
l9_199=gl_InstanceIndex%2;
}
int l9_200=l9_199;
l9_196=l9_200;
}
int l9_201=l9_196;
float2 l9_202=l9_195;
int l9_203=renderTarget2Layout_tmp;
int l9_204=l9_201;
float2 l9_205=l9_202;
int l9_206=l9_203;
int l9_207=l9_204;
float3 l9_208=float3(0.0);
if (l9_206==0)
{
l9_208=float3(l9_205,0.0);
}
else
{
if (l9_206==1)
{
l9_208=float3(l9_205.x,(l9_205.y*0.5)+(0.5-(float(l9_207)*0.5)),0.0);
}
else
{
l9_208=float3(l9_205,float(l9_207));
}
}
float3 l9_209=l9_208;
float3 l9_210=l9_209;
float4 l9_211=renderTarget2.sample(renderTarget2SmpSC,l9_210.xy,level(0.0));
float4 l9_212=l9_211;
float4 l9_213=l9_212;
float4 renderTarget2Sample_1=l9_213;
Scalar8=renderTarget2Sample_1.x;
Scalar9=renderTarget2Sample_1.y;
Scalar10=renderTarget2Sample_1.z;
Scalar11=renderTarget2Sample_1.w;
float2 param_25=uv;
float2 l9_214=param_25;
int l9_215;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_216=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_216=0;
}
else
{
l9_216=gl_InstanceIndex%2;
}
int l9_217=l9_216;
l9_215=1-l9_217;
}
else
{
int l9_218=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_218=0;
}
else
{
l9_218=gl_InstanceIndex%2;
}
int l9_219=l9_218;
l9_215=l9_219;
}
int l9_220=l9_215;
float2 l9_221=l9_214;
int l9_222=renderTarget3Layout_tmp;
int l9_223=l9_220;
float2 l9_224=l9_221;
int l9_225=l9_222;
int l9_226=l9_223;
float3 l9_227=float3(0.0);
if (l9_225==0)
{
l9_227=float3(l9_224,0.0);
}
else
{
if (l9_225==1)
{
l9_227=float3(l9_224.x,(l9_224.y*0.5)+(0.5-(float(l9_226)*0.5)),0.0);
}
else
{
l9_227=float3(l9_224,float(l9_226));
}
}
float3 l9_228=l9_227;
float3 l9_229=l9_228;
float4 l9_230=renderTarget3.sample(renderTarget3SmpSC,l9_229.xy,level(0.0));
float4 l9_231=l9_230;
float4 l9_232=l9_231;
float4 renderTarget3Sample_1=l9_232;
Scalar12=renderTarget3Sample_1.x;
Scalar13=renderTarget3Sample_1.y;
Scalar14=renderTarget3Sample_1.z;
Scalar15=renderTarget3Sample_1.w;
float4 param_26=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_27=-1000.0;
float param_28=1000.0;
float4 l9_233=param_26;
float l9_234=param_27;
float l9_235=param_28;
float l9_236=0.99998999;
float4 l9_237=l9_233;
#if (1)
{
l9_237=floor((l9_237*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_238=dot(l9_237,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_239=l9_238;
float l9_240=0.0;
float l9_241=l9_236;
float l9_242=l9_234;
float l9_243=l9_235;
float l9_244=l9_242+(((l9_239-l9_240)*(l9_243-l9_242))/(l9_241-l9_240));
float l9_245=l9_244;
float l9_246=l9_245;
gParticle.Velocity.y=l9_246;
float4 param_29=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_30=-1000.0;
float param_31=1000.0;
float4 l9_247=param_29;
float l9_248=param_30;
float l9_249=param_31;
float l9_250=0.99998999;
float4 l9_251=l9_247;
#if (1)
{
l9_251=floor((l9_251*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_252=dot(l9_251,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_253=l9_252;
float l9_254=0.0;
float l9_255=l9_250;
float l9_256=l9_248;
float l9_257=l9_249;
float l9_258=l9_256+(((l9_253-l9_254)*(l9_257-l9_256))/(l9_255-l9_254));
float l9_259=l9_258;
float l9_260=l9_259;
gParticle.Velocity.z=l9_260;
float4 param_32=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_33=0.0;
float param_34=0.5;
float4 l9_261=param_32;
float l9_262=param_33;
float l9_263=param_34;
float l9_264=0.99998999;
float4 l9_265=l9_261;
#if (1)
{
l9_265=floor((l9_265*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_266=dot(l9_265,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_267=l9_266;
float l9_268=0.0;
float l9_269=l9_264;
float l9_270=l9_262;
float l9_271=l9_263;
float l9_272=l9_270+(((l9_267-l9_268)*(l9_271-l9_270))/(l9_269-l9_268));
float l9_273=l9_272;
float l9_274=l9_273;
gParticle.Life=l9_274;
float4 param_35=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_36=0.0;
float param_37=0.5;
float4 l9_275=param_35;
float l9_276=param_36;
float l9_277=param_37;
float l9_278=0.99998999;
float4 l9_279=l9_275;
#if (1)
{
l9_279=floor((l9_279*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_280=dot(l9_279,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_281=l9_280;
float l9_282=0.0;
float l9_283=l9_278;
float l9_284=l9_276;
float l9_285=l9_277;
float l9_286=l9_284+(((l9_281-l9_282)*(l9_285-l9_284))/(l9_283-l9_282));
float l9_287=l9_286;
float l9_288=l9_287;
gParticle.Age=l9_288;
uv=Coord+(Offset*2.0);
float2 param_38=uv;
float2 l9_289=param_38;
int l9_290;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_291=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_291=0;
}
else
{
l9_291=gl_InstanceIndex%2;
}
int l9_292=l9_291;
l9_290=1-l9_292;
}
else
{
int l9_293=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_293=0;
}
else
{
l9_293=gl_InstanceIndex%2;
}
int l9_294=l9_293;
l9_290=l9_294;
}
int l9_295=l9_290;
float2 l9_296=l9_289;
int l9_297=renderTarget0Layout_tmp;
int l9_298=l9_295;
float2 l9_299=l9_296;
int l9_300=l9_297;
int l9_301=l9_298;
float3 l9_302=float3(0.0);
if (l9_300==0)
{
l9_302=float3(l9_299,0.0);
}
else
{
if (l9_300==1)
{
l9_302=float3(l9_299.x,(l9_299.y*0.5)+(0.5-(float(l9_301)*0.5)),0.0);
}
else
{
l9_302=float3(l9_299,float(l9_301));
}
}
float3 l9_303=l9_302;
float3 l9_304=l9_303;
float4 l9_305=renderTarget0.sample(renderTarget0SmpSC,l9_304.xy,level(0.0));
float4 l9_306=l9_305;
float4 l9_307=l9_306;
float4 renderTarget0Sample_2=l9_307;
Scalar0=renderTarget0Sample_2.x;
Scalar1=renderTarget0Sample_2.y;
Scalar2=renderTarget0Sample_2.z;
Scalar3=renderTarget0Sample_2.w;
float2 param_39=uv;
float2 l9_308=param_39;
int l9_309;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_310=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_310=0;
}
else
{
l9_310=gl_InstanceIndex%2;
}
int l9_311=l9_310;
l9_309=1-l9_311;
}
else
{
int l9_312=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_312=0;
}
else
{
l9_312=gl_InstanceIndex%2;
}
int l9_313=l9_312;
l9_309=l9_313;
}
int l9_314=l9_309;
float2 l9_315=l9_308;
int l9_316=renderTarget1Layout_tmp;
int l9_317=l9_314;
float2 l9_318=l9_315;
int l9_319=l9_316;
int l9_320=l9_317;
float3 l9_321=float3(0.0);
if (l9_319==0)
{
l9_321=float3(l9_318,0.0);
}
else
{
if (l9_319==1)
{
l9_321=float3(l9_318.x,(l9_318.y*0.5)+(0.5-(float(l9_320)*0.5)),0.0);
}
else
{
l9_321=float3(l9_318,float(l9_320));
}
}
float3 l9_322=l9_321;
float3 l9_323=l9_322;
float4 l9_324=renderTarget1.sample(renderTarget1SmpSC,l9_323.xy,level(0.0));
float4 l9_325=l9_324;
float4 l9_326=l9_325;
float4 renderTarget1Sample_2=l9_326;
Scalar4=renderTarget1Sample_2.x;
Scalar5=renderTarget1Sample_2.y;
Scalar6=renderTarget1Sample_2.z;
Scalar7=renderTarget1Sample_2.w;
float2 param_40=uv;
float2 l9_327=param_40;
int l9_328;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_329=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_329=0;
}
else
{
l9_329=gl_InstanceIndex%2;
}
int l9_330=l9_329;
l9_328=1-l9_330;
}
else
{
int l9_331=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_331=0;
}
else
{
l9_331=gl_InstanceIndex%2;
}
int l9_332=l9_331;
l9_328=l9_332;
}
int l9_333=l9_328;
float2 l9_334=l9_327;
int l9_335=renderTarget2Layout_tmp;
int l9_336=l9_333;
float2 l9_337=l9_334;
int l9_338=l9_335;
int l9_339=l9_336;
float3 l9_340=float3(0.0);
if (l9_338==0)
{
l9_340=float3(l9_337,0.0);
}
else
{
if (l9_338==1)
{
l9_340=float3(l9_337.x,(l9_337.y*0.5)+(0.5-(float(l9_339)*0.5)),0.0);
}
else
{
l9_340=float3(l9_337,float(l9_339));
}
}
float3 l9_341=l9_340;
float3 l9_342=l9_341;
float4 l9_343=renderTarget2.sample(renderTarget2SmpSC,l9_342.xy,level(0.0));
float4 l9_344=l9_343;
float4 l9_345=l9_344;
float4 renderTarget2Sample_2=l9_345;
Scalar8=renderTarget2Sample_2.x;
Scalar9=renderTarget2Sample_2.y;
Scalar10=renderTarget2Sample_2.z;
Scalar11=renderTarget2Sample_2.w;
float2 param_41=uv;
float2 l9_346=param_41;
int l9_347;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_348=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_348=0;
}
else
{
l9_348=gl_InstanceIndex%2;
}
int l9_349=l9_348;
l9_347=1-l9_349;
}
else
{
int l9_350=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_350=0;
}
else
{
l9_350=gl_InstanceIndex%2;
}
int l9_351=l9_350;
l9_347=l9_351;
}
int l9_352=l9_347;
float2 l9_353=l9_346;
int l9_354=renderTarget3Layout_tmp;
int l9_355=l9_352;
float2 l9_356=l9_353;
int l9_357=l9_354;
int l9_358=l9_355;
float3 l9_359=float3(0.0);
if (l9_357==0)
{
l9_359=float3(l9_356,0.0);
}
else
{
if (l9_357==1)
{
l9_359=float3(l9_356.x,(l9_356.y*0.5)+(0.5-(float(l9_358)*0.5)),0.0);
}
else
{
l9_359=float3(l9_356,float(l9_358));
}
}
float3 l9_360=l9_359;
float3 l9_361=l9_360;
float4 l9_362=renderTarget3.sample(renderTarget3SmpSC,l9_361.xy,level(0.0));
float4 l9_363=l9_362;
float4 l9_364=l9_363;
float4 renderTarget3Sample_2=l9_364;
Scalar12=renderTarget3Sample_2.x;
Scalar13=renderTarget3Sample_2.y;
Scalar14=renderTarget3Sample_2.z;
Scalar15=renderTarget3Sample_2.w;
float4 param_42=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_43=0.0;
float param_44=100.0;
float4 l9_365=param_42;
float l9_366=param_43;
float l9_367=param_44;
float l9_368=0.99998999;
float4 l9_369=l9_365;
#if (1)
{
l9_369=floor((l9_369*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_370=dot(l9_369,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_371=l9_370;
float l9_372=0.0;
float l9_373=l9_368;
float l9_374=l9_366;
float l9_375=l9_367;
float l9_376=l9_374+(((l9_371-l9_372)*(l9_375-l9_374))/(l9_373-l9_372));
float l9_377=l9_376;
float l9_378=l9_377;
gParticle.Size=l9_378;
float4 param_45=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_46=0.0;
float param_47=1.00001;
float4 l9_379=param_45;
float l9_380=param_46;
float l9_381=param_47;
float l9_382=0.99998999;
float4 l9_383=l9_379;
#if (1)
{
l9_383=floor((l9_383*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_384=dot(l9_383,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_385=l9_384;
float l9_386=0.0;
float l9_387=l9_382;
float l9_388=l9_380;
float l9_389=l9_381;
float l9_390=l9_388+(((l9_385-l9_386)*(l9_389-l9_388))/(l9_387-l9_386));
float l9_391=l9_390;
float l9_392=l9_391;
gParticle.Color.x=l9_392;
float4 param_48=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_49=0.0;
float param_50=1.00001;
float4 l9_393=param_48;
float l9_394=param_49;
float l9_395=param_50;
float l9_396=0.99998999;
float4 l9_397=l9_393;
#if (1)
{
l9_397=floor((l9_397*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_398=dot(l9_397,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_399=l9_398;
float l9_400=0.0;
float l9_401=l9_396;
float l9_402=l9_394;
float l9_403=l9_395;
float l9_404=l9_402+(((l9_399-l9_400)*(l9_403-l9_402))/(l9_401-l9_400));
float l9_405=l9_404;
float l9_406=l9_405;
gParticle.Color.y=l9_406;
float4 param_51=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_52=0.0;
float param_53=1.00001;
float4 l9_407=param_51;
float l9_408=param_52;
float l9_409=param_53;
float l9_410=0.99998999;
float4 l9_411=l9_407;
#if (1)
{
l9_411=floor((l9_411*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_412=dot(l9_411,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_413=l9_412;
float l9_414=0.0;
float l9_415=l9_410;
float l9_416=l9_408;
float l9_417=l9_409;
float l9_418=l9_416+(((l9_413-l9_414)*(l9_417-l9_416))/(l9_415-l9_414));
float l9_419=l9_418;
float l9_420=l9_419;
gParticle.Color.z=l9_420;
uv=Coord+(Offset*3.0);
float2 param_54=uv;
float2 l9_421=param_54;
int l9_422;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_423=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_423=0;
}
else
{
l9_423=gl_InstanceIndex%2;
}
int l9_424=l9_423;
l9_422=1-l9_424;
}
else
{
int l9_425=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_425=0;
}
else
{
l9_425=gl_InstanceIndex%2;
}
int l9_426=l9_425;
l9_422=l9_426;
}
int l9_427=l9_422;
float2 l9_428=l9_421;
int l9_429=renderTarget0Layout_tmp;
int l9_430=l9_427;
float2 l9_431=l9_428;
int l9_432=l9_429;
int l9_433=l9_430;
float3 l9_434=float3(0.0);
if (l9_432==0)
{
l9_434=float3(l9_431,0.0);
}
else
{
if (l9_432==1)
{
l9_434=float3(l9_431.x,(l9_431.y*0.5)+(0.5-(float(l9_433)*0.5)),0.0);
}
else
{
l9_434=float3(l9_431,float(l9_433));
}
}
float3 l9_435=l9_434;
float3 l9_436=l9_435;
float4 l9_437=renderTarget0.sample(renderTarget0SmpSC,l9_436.xy,level(0.0));
float4 l9_438=l9_437;
float4 l9_439=l9_438;
float4 renderTarget0Sample_3=l9_439;
Scalar0=renderTarget0Sample_3.x;
Scalar1=renderTarget0Sample_3.y;
Scalar2=renderTarget0Sample_3.z;
Scalar3=renderTarget0Sample_3.w;
float2 param_55=uv;
float2 l9_440=param_55;
int l9_441;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_442=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_442=0;
}
else
{
l9_442=gl_InstanceIndex%2;
}
int l9_443=l9_442;
l9_441=1-l9_443;
}
else
{
int l9_444=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_444=0;
}
else
{
l9_444=gl_InstanceIndex%2;
}
int l9_445=l9_444;
l9_441=l9_445;
}
int l9_446=l9_441;
float2 l9_447=l9_440;
int l9_448=renderTarget1Layout_tmp;
int l9_449=l9_446;
float2 l9_450=l9_447;
int l9_451=l9_448;
int l9_452=l9_449;
float3 l9_453=float3(0.0);
if (l9_451==0)
{
l9_453=float3(l9_450,0.0);
}
else
{
if (l9_451==1)
{
l9_453=float3(l9_450.x,(l9_450.y*0.5)+(0.5-(float(l9_452)*0.5)),0.0);
}
else
{
l9_453=float3(l9_450,float(l9_452));
}
}
float3 l9_454=l9_453;
float3 l9_455=l9_454;
float4 l9_456=renderTarget1.sample(renderTarget1SmpSC,l9_455.xy,level(0.0));
float4 l9_457=l9_456;
float4 l9_458=l9_457;
float4 renderTarget1Sample_3=l9_458;
Scalar4=renderTarget1Sample_3.x;
Scalar5=renderTarget1Sample_3.y;
Scalar6=renderTarget1Sample_3.z;
Scalar7=renderTarget1Sample_3.w;
float2 param_56=uv;
float2 l9_459=param_56;
int l9_460;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_461=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_461=0;
}
else
{
l9_461=gl_InstanceIndex%2;
}
int l9_462=l9_461;
l9_460=1-l9_462;
}
else
{
int l9_463=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_463=0;
}
else
{
l9_463=gl_InstanceIndex%2;
}
int l9_464=l9_463;
l9_460=l9_464;
}
int l9_465=l9_460;
float2 l9_466=l9_459;
int l9_467=renderTarget2Layout_tmp;
int l9_468=l9_465;
float2 l9_469=l9_466;
int l9_470=l9_467;
int l9_471=l9_468;
float3 l9_472=float3(0.0);
if (l9_470==0)
{
l9_472=float3(l9_469,0.0);
}
else
{
if (l9_470==1)
{
l9_472=float3(l9_469.x,(l9_469.y*0.5)+(0.5-(float(l9_471)*0.5)),0.0);
}
else
{
l9_472=float3(l9_469,float(l9_471));
}
}
float3 l9_473=l9_472;
float3 l9_474=l9_473;
float4 l9_475=renderTarget2.sample(renderTarget2SmpSC,l9_474.xy,level(0.0));
float4 l9_476=l9_475;
float4 l9_477=l9_476;
float4 renderTarget2Sample_3=l9_477;
Scalar8=renderTarget2Sample_3.x;
Scalar9=renderTarget2Sample_3.y;
Scalar10=renderTarget2Sample_3.z;
Scalar11=renderTarget2Sample_3.w;
float2 param_57=uv;
float2 l9_478=param_57;
int l9_479;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_480=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_480=0;
}
else
{
l9_480=gl_InstanceIndex%2;
}
int l9_481=l9_480;
l9_479=1-l9_481;
}
else
{
int l9_482=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_482=0;
}
else
{
l9_482=gl_InstanceIndex%2;
}
int l9_483=l9_482;
l9_479=l9_483;
}
int l9_484=l9_479;
float2 l9_485=l9_478;
int l9_486=renderTarget3Layout_tmp;
int l9_487=l9_484;
float2 l9_488=l9_485;
int l9_489=l9_486;
int l9_490=l9_487;
float3 l9_491=float3(0.0);
if (l9_489==0)
{
l9_491=float3(l9_488,0.0);
}
else
{
if (l9_489==1)
{
l9_491=float3(l9_488.x,(l9_488.y*0.5)+(0.5-(float(l9_490)*0.5)),0.0);
}
else
{
l9_491=float3(l9_488,float(l9_490));
}
}
float3 l9_492=l9_491;
float3 l9_493=l9_492;
float4 l9_494=renderTarget3.sample(renderTarget3SmpSC,l9_493.xy,level(0.0));
float4 l9_495=l9_494;
float4 l9_496=l9_495;
float4 renderTarget3Sample_3=l9_496;
Scalar12=renderTarget3Sample_3.x;
Scalar13=renderTarget3Sample_3.y;
Scalar14=renderTarget3Sample_3.z;
Scalar15=renderTarget3Sample_3.w;
float4 param_58=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_59=0.0;
float param_60=1.00001;
float4 l9_497=param_58;
float l9_498=param_59;
float l9_499=param_60;
float l9_500=0.99998999;
float4 l9_501=l9_497;
#if (1)
{
l9_501=floor((l9_501*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_502=dot(l9_501,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_503=l9_502;
float l9_504=0.0;
float l9_505=l9_500;
float l9_506=l9_498;
float l9_507=l9_499;
float l9_508=l9_506+(((l9_503-l9_504)*(l9_507-l9_506))/(l9_505-l9_504));
float l9_509=l9_508;
float l9_510=l9_509;
gParticle.Color.w=l9_510;
float2 param_61=float2(Scalar4,Scalar5);
float param_62=-1.0;
float param_63=1.0;
float2 l9_511=param_61;
float l9_512=param_62;
float l9_513=param_63;
float l9_514=0.99998999;
float2 l9_515=l9_511;
#if (1)
{
l9_515=floor((l9_515*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_516=dot(l9_515,float2(1.0,0.0039215689));
float l9_517=l9_516;
float l9_518=0.0;
float l9_519=l9_514;
float l9_520=l9_512;
float l9_521=l9_513;
float l9_522=l9_520+(((l9_517-l9_518)*(l9_521-l9_520))/(l9_519-l9_518));
float l9_523=l9_522;
float l9_524=l9_523;
gParticle.Quaternion.x=l9_524;
float2 param_64=float2(Scalar6,Scalar7);
float param_65=-1.0;
float param_66=1.0;
float2 l9_525=param_64;
float l9_526=param_65;
float l9_527=param_66;
float l9_528=0.99998999;
float2 l9_529=l9_525;
#if (1)
{
l9_529=floor((l9_529*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_530=dot(l9_529,float2(1.0,0.0039215689));
float l9_531=l9_530;
float l9_532=0.0;
float l9_533=l9_528;
float l9_534=l9_526;
float l9_535=l9_527;
float l9_536=l9_534+(((l9_531-l9_532)*(l9_535-l9_534))/(l9_533-l9_532));
float l9_537=l9_536;
float l9_538=l9_537;
gParticle.Quaternion.y=l9_538;
float2 param_67=float2(Scalar8,Scalar9);
float param_68=-1.0;
float param_69=1.0;
float2 l9_539=param_67;
float l9_540=param_68;
float l9_541=param_69;
float l9_542=0.99998999;
float2 l9_543=l9_539;
#if (1)
{
l9_543=floor((l9_543*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_544=dot(l9_543,float2(1.0,0.0039215689));
float l9_545=l9_544;
float l9_546=0.0;
float l9_547=l9_542;
float l9_548=l9_540;
float l9_549=l9_541;
float l9_550=l9_548+(((l9_545-l9_546)*(l9_549-l9_548))/(l9_547-l9_546));
float l9_551=l9_550;
float l9_552=l9_551;
gParticle.Quaternion.z=l9_552;
float2 param_70=float2(Scalar10,Scalar11);
float param_71=-1.0;
float param_72=1.0;
float2 l9_553=param_70;
float l9_554=param_71;
float l9_555=param_72;
float l9_556=0.99998999;
float2 l9_557=l9_553;
#if (1)
{
l9_557=floor((l9_557*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_558=dot(l9_557,float2(1.0,0.0039215689));
float l9_559=l9_558;
float l9_560=0.0;
float l9_561=l9_556;
float l9_562=l9_554;
float l9_563=l9_555;
float l9_564=l9_562+(((l9_559-l9_560)*(l9_563-l9_562))/(l9_561-l9_560));
float l9_565=l9_564;
float l9_566=l9_565;
gParticle.Quaternion.w=l9_566;
float4 param_73=gParticle.Quaternion;
param_73=normalize(param_73.yzwx);
float l9_567=param_73.x*param_73.x;
float l9_568=param_73.y*param_73.y;
float l9_569=param_73.z*param_73.z;
float l9_570=param_73.x*param_73.z;
float l9_571=param_73.x*param_73.y;
float l9_572=param_73.y*param_73.z;
float l9_573=param_73.w*param_73.x;
float l9_574=param_73.w*param_73.y;
float l9_575=param_73.w*param_73.z;
float3x3 l9_576=float3x3(float3(1.0-(2.0*(l9_568+l9_569)),2.0*(l9_571+l9_575),2.0*(l9_570-l9_574)),float3(2.0*(l9_571-l9_575),1.0-(2.0*(l9_567+l9_569)),2.0*(l9_572+l9_573)),float3(2.0*(l9_570+l9_574),2.0*(l9_572-l9_573),1.0-(2.0*(l9_567+l9_568))));
gParticle.Matrix=l9_576;
gParticle.Velocity=floor((gParticle.Velocity*2000.0)+float3(0.5))*0.00050000002;
gParticle.Position=floor((gParticle.Position*2000.0)+float3(0.5))*0.00050000002;
gParticle.Color=floor((gParticle.Color*2000.0)+float4(0.5))*0.00050000002;
gParticle.Size=floor((gParticle.Size*2000.0)+0.5)*0.00050000002;
gParticle.Mass=floor((gParticle.Mass*2000.0)+0.5)*0.00050000002;
gParticle.Life=floor((gParticle.Life*2000.0)+0.5)*0.00050000002;
return true;
}
float4 matrixToQuaternion(thread const float3x3& m)
{
float fourXSquaredMinus1=(m[0].x-m[1].y)-m[2].z;
float fourYSquaredMinus1=(m[1].y-m[0].x)-m[2].z;
float fourZSquaredMinus1=(m[2].z-m[0].x)-m[1].y;
float fourWSquaredMinus1=(m[0].x+m[1].y)+m[2].z;
int biggestIndex=0;
float fourBiggestSquaredMinus1=fourWSquaredMinus1;
if (fourXSquaredMinus1>fourBiggestSquaredMinus1)
{
fourBiggestSquaredMinus1=fourXSquaredMinus1;
biggestIndex=1;
}
if (fourYSquaredMinus1>fourBiggestSquaredMinus1)
{
fourBiggestSquaredMinus1=fourYSquaredMinus1;
biggestIndex=2;
}
if (fourZSquaredMinus1>fourBiggestSquaredMinus1)
{
fourBiggestSquaredMinus1=fourZSquaredMinus1;
biggestIndex=3;
}
float biggestVal=sqrt(fourBiggestSquaredMinus1+1.0)*0.5;
float mult=0.25/biggestVal;
if (biggestIndex==0)
{
return float4(biggestVal,(m[1].z-m[2].y)*mult,(m[2].x-m[0].z)*mult,(m[0].y-m[1].x)*mult);
}
else
{
if (biggestIndex==1)
{
return float4((m[1].z-m[2].y)*mult,biggestVal,(m[0].y+m[1].x)*mult,(m[2].x+m[0].z)*mult);
}
else
{
if (biggestIndex==2)
{
return float4((m[2].x-m[0].z)*mult,(m[0].y+m[1].x)*mult,biggestVal,(m[1].z+m[2].y)*mult);
}
else
{
if (biggestIndex==3)
{
return float4((m[0].y-m[1].x)*mult,(m[2].x+m[0].z)*mult,(m[1].z+m[2].y)*mult,biggestVal);
}
else
{
return float4(1.0,0.0,0.0,0.0);
}
}
}
}
}
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
int ssInstanceID=0;
float N10_texSize=0.0;
float N10_scale=0.0;
float3 N10_worldPosition=float3(0.0);
float3 N10_worldRotation=float3(0.0);
float3 N10_worldScale=float3(0.0);
float3 N10_particlePosition=float3(0.0);
float4 N10_particleColor=float4(0.0);
float N10_KillParticle=0.0;
sc_Vertex_t l9_0;
l9_0.position=in.position;
l9_0.texture0=in.texture0;
l9_0.texture1=in.texture1;
sc_Vertex_t l9_1=l9_0;
sc_Vertex_t v=l9_1;
int l9_2=gl_InstanceIndex;
ssInstanceID=l9_2;
int param=ssInstanceID;
ssParticle gParticle;
bool l9_3=ssDecodeParticle(param,gl_InstanceIndex,(*sc_set0.UserUniforms),sc_set0.renderTarget0,sc_set0.renderTarget0SmpSC,sc_set0.renderTarget1,sc_set0.renderTarget1SmpSC,sc_set0.renderTarget2,sc_set0.renderTarget2SmpSC,sc_set0.renderTarget3,sc_set0.renderTarget3SmpSC,gParticle);
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
int l9_4=gl_InstanceIndex;
Globals.gComponentTime=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_4/64];
Globals.gTimeDelta=fast::min((*sc_set0.UserUniforms).overrideTimeDelta,0.5);
Globals.gTimeElapsedShifted=(Globals.gTimeElapsed-(gParticle.TimeShift*Globals.gTimeDelta))-0.0;
gParticle.Age=Globals.gTimeElapsedShifted;
if (gParticle.Life<0.1)
{
ssParticle l9_5=gParticle;
l9_5.Seed=(l9_5.Ratio1D*0.97637898)+0.151235;
int2 l9_6=int2(l9_5.Index1D%400,l9_5.Index1D/400);
l9_5.Seed2000=(float2(l9_6)+float2(1.0))/float2(399.0);
gParticle=l9_5;
float l9_7=8.0;
gParticle.Position=(float3(((floor(mod(gParticle.Index1DPerCopyF,floor(l9_7)))/l9_7)*2.0)-1.0,((floor(gParticle.Index1DPerCopyF/floor(l9_7))/l9_7)*2.0)-1.0,0.0)*20.0)+float3(1.0,1.0,0.0);
gParticle.Velocity=float3(0.0);
gParticle.Color=float4(1.0);
gParticle.Age=0.0;
gParticle.Life=0.5;
gParticle.Size=1.0;
gParticle.Mass=1.0;
gParticle.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
gParticle.Quaternion=float4(0.0,0.0,0.0,1.0);
gParticle.Size=(*sc_set0.UserUniforms).Port_Value_N009;
gParticle.Velocity+=((gParticle.Force/float3(gParticle.Mass))*0.033330001);
gParticle.Force=float3(0.0);
gParticle.Spawned=true;
gParticle.Age=Globals.gTimeElapsedShifted;
}
gParticle.Life=1.0;
if (gParticle.Dead)
{
float4 param_1=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_1.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_8=param_1;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_9=dot(l9_8,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_10=l9_9;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_10;
}
}
float4 l9_11=float4(param_1.x,-param_1.y,(param_1.z*0.5)+(param_1.w*0.5),param_1.w);
out.gl_Position=l9_11;
return out;
}
float Output_N4=0.0;
float param_2=(*sc_set0.UserUniforms).Port_Value_N004;
float param_3=param_2+0.001;
param_3-=0.001;
Output_N4=param_3;
float Output_N6=0.0;
float param_4=(*sc_set0.UserUniforms).Port_Value_N006;
float param_5=param_4+0.001;
param_5-=0.001;
Output_N6=param_5;
float3 Position_N8=float3(0.0);
float3 Rotation_N8=float3(0.0);
float3 Scale_N8=float3(0.0);
int l9_13=gl_InstanceIndex;
float4x4 l9_14=(*sc_set0.UserUniforms).vfxModelMatrix[l9_13/64];
float3 param_6=l9_14[3].xyz;
float3 param_8=float3(length(l9_14[0].xyz),length(l9_14[1].xyz),length(l9_14[2].xyz));
float3x3 l9_15=float3x3(float3(l9_14[0].xyz/float3(param_8.x)),float3(l9_14[1].xyz/float3(param_8.y)),float3(l9_14[2].xyz/float3(param_8.z)));
float l9_16=sqrt((l9_15[0].x*l9_15[0].x)+(l9_15[1].x*l9_15[1].x));
float3 param_7;
param_7.x=-atan2(l9_15[2].y,l9_15[2].z);
param_7.y=-atan2(-l9_15[2].x,l9_16);
param_7.z=-atan2(l9_15[1].x,l9_15[0].x);
param_7*=57.29578;
Position_N8=param_6;
Rotation_N8=param_7;
Scale_N8=param_8;
float3 particlePosition_N10=float3(0.0);
float4 particleColor_N10=float4(0.0);
float KillParticle_N10=0.0;
float param_9=Output_N4;
float param_10=Output_N6;
float3 param_11=Position_N8;
float3 param_12=Rotation_N8;
float3 param_13=Scale_N8;
float3 param_14=float3(0.0);
float4 param_15=float4(0.0);
float param_16=0.0;
N10_texSize=param_9;
N10_scale=param_10;
N10_worldPosition=param_11;
N10_worldRotation=param_12;
N10_worldScale=param_13;
float l9_17=gParticle.Ratio1DPerCopy;
float l9_18=l9_17;
float l9_19=N10_texSize*N10_texSize;
float l9_20=l9_18*l9_19;
float l9_21=floor(l9_20/N10_texSize);
float l9_22=l9_20-(l9_21*N10_texSize);
float l9_23=(l9_22+0.5)/N10_texSize;
float l9_24=(l9_21+0.5)/N10_texSize;
float2 l9_25=float2(l9_23,l9_24);
float2 l9_26=l9_25;
float4 l9_27=float4(0.0);
int l9_28;
if ((int(xMapHasSwappedViews_tmp)!=0))
{
int l9_29=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_29=0;
}
else
{
l9_29=gl_InstanceIndex%2;
}
int l9_30=l9_29;
l9_28=1-l9_30;
}
else
{
int l9_31=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_31=0;
}
else
{
l9_31=gl_InstanceIndex%2;
}
int l9_32=l9_31;
l9_28=l9_32;
}
int l9_33=l9_28;
int l9_34=xMapLayout_tmp;
int l9_35=l9_33;
float2 l9_36=l9_26;
bool l9_37=(int(SC_USE_UV_TRANSFORM_xMap_tmp)!=0);
float3x3 l9_38=(*sc_set0.UserUniforms).xMapTransform;
int2 l9_39=int2(SC_SOFTWARE_WRAP_MODE_U_xMap_tmp,SC_SOFTWARE_WRAP_MODE_V_xMap_tmp);
bool l9_40=(int(SC_USE_UV_MIN_MAX_xMap_tmp)!=0);
float4 l9_41=(*sc_set0.UserUniforms).xMapUvMinMax;
bool l9_42=(int(SC_USE_CLAMP_TO_BORDER_xMap_tmp)!=0);
float4 l9_43=(*sc_set0.UserUniforms).xMapBorderColor;
float l9_44=0.0;
bool l9_45=l9_42&&(!l9_40);
float l9_46=1.0;
float l9_47=l9_36.x;
int l9_48=l9_39.x;
if (l9_48==1)
{
l9_47=fract(l9_47);
}
else
{
if (l9_48==2)
{
float l9_49=fract(l9_47);
float l9_50=l9_47-l9_49;
float l9_51=step(0.25,fract(l9_50*0.5));
l9_47=mix(l9_49,1.0-l9_49,fast::clamp(l9_51,0.0,1.0));
}
}
l9_36.x=l9_47;
float l9_52=l9_36.y;
int l9_53=l9_39.y;
if (l9_53==1)
{
l9_52=fract(l9_52);
}
else
{
if (l9_53==2)
{
float l9_54=fract(l9_52);
float l9_55=l9_52-l9_54;
float l9_56=step(0.25,fract(l9_55*0.5));
l9_52=mix(l9_54,1.0-l9_54,fast::clamp(l9_56,0.0,1.0));
}
}
l9_36.y=l9_52;
if (l9_40)
{
bool l9_57=l9_42;
bool l9_58;
if (l9_57)
{
l9_58=l9_39.x==3;
}
else
{
l9_58=l9_57;
}
float l9_59=l9_36.x;
float l9_60=l9_41.x;
float l9_61=l9_41.z;
bool l9_62=l9_58;
float l9_63=l9_46;
float l9_64=fast::clamp(l9_59,l9_60,l9_61);
float l9_65=step(abs(l9_59-l9_64),9.9999997e-06);
l9_63*=(l9_65+((1.0-float(l9_62))*(1.0-l9_65)));
l9_59=l9_64;
l9_36.x=l9_59;
l9_46=l9_63;
bool l9_66=l9_42;
bool l9_67;
if (l9_66)
{
l9_67=l9_39.y==3;
}
else
{
l9_67=l9_66;
}
float l9_68=l9_36.y;
float l9_69=l9_41.y;
float l9_70=l9_41.w;
bool l9_71=l9_67;
float l9_72=l9_46;
float l9_73=fast::clamp(l9_68,l9_69,l9_70);
float l9_74=step(abs(l9_68-l9_73),9.9999997e-06);
l9_72*=(l9_74+((1.0-float(l9_71))*(1.0-l9_74)));
l9_68=l9_73;
l9_36.y=l9_68;
l9_46=l9_72;
}
float2 l9_75=l9_36;
bool l9_76=l9_37;
float3x3 l9_77=l9_38;
if (l9_76)
{
l9_75=float2((l9_77*float3(l9_75,1.0)).xy);
}
float2 l9_78=l9_75;
l9_36=l9_78;
float l9_79=l9_36.x;
int l9_80=l9_39.x;
bool l9_81=l9_45;
float l9_82=l9_46;
if ((l9_80==0)||(l9_80==3))
{
float l9_83=l9_79;
float l9_84=0.0;
float l9_85=1.0;
bool l9_86=l9_81;
float l9_87=l9_82;
float l9_88=fast::clamp(l9_83,l9_84,l9_85);
float l9_89=step(abs(l9_83-l9_88),9.9999997e-06);
l9_87*=(l9_89+((1.0-float(l9_86))*(1.0-l9_89)));
l9_83=l9_88;
l9_79=l9_83;
l9_82=l9_87;
}
l9_36.x=l9_79;
l9_46=l9_82;
float l9_90=l9_36.y;
int l9_91=l9_39.y;
bool l9_92=l9_45;
float l9_93=l9_46;
if ((l9_91==0)||(l9_91==3))
{
float l9_94=l9_90;
float l9_95=0.0;
float l9_96=1.0;
bool l9_97=l9_92;
float l9_98=l9_93;
float l9_99=fast::clamp(l9_94,l9_95,l9_96);
float l9_100=step(abs(l9_94-l9_99),9.9999997e-06);
l9_98*=(l9_100+((1.0-float(l9_97))*(1.0-l9_100)));
l9_94=l9_99;
l9_90=l9_94;
l9_93=l9_98;
}
l9_36.y=l9_90;
l9_46=l9_93;
float2 l9_101=l9_36;
int l9_102=l9_34;
int l9_103=l9_35;
float l9_104=l9_44;
float2 l9_105=l9_101;
int l9_106=l9_102;
int l9_107=l9_103;
float3 l9_108=float3(0.0);
if (l9_106==0)
{
l9_108=float3(l9_105,0.0);
}
else
{
if (l9_106==1)
{
l9_108=float3(l9_105.x,(l9_105.y*0.5)+(0.5-(float(l9_107)*0.5)),0.0);
}
else
{
l9_108=float3(l9_105,float(l9_107));
}
}
float3 l9_109=l9_108;
float3 l9_110=l9_109;
float4 l9_111=sc_set0.xMap.sample(sc_set0.xMapSmpSC,l9_110.xy,level(l9_104));
float4 l9_112=l9_111;
if (l9_42)
{
l9_112=mix(l9_43,l9_112,float4(l9_46));
}
float4 l9_113=l9_112;
l9_27=l9_113;
float4 l9_114=l9_27;
float4 l9_115=l9_114;
float2 l9_116=l9_25;
float4 l9_117=float4(0.0);
int l9_118;
if ((int(yMapHasSwappedViews_tmp)!=0))
{
int l9_119=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_119=0;
}
else
{
l9_119=gl_InstanceIndex%2;
}
int l9_120=l9_119;
l9_118=1-l9_120;
}
else
{
int l9_121=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_121=0;
}
else
{
l9_121=gl_InstanceIndex%2;
}
int l9_122=l9_121;
l9_118=l9_122;
}
int l9_123=l9_118;
int l9_124=yMapLayout_tmp;
int l9_125=l9_123;
float2 l9_126=l9_116;
bool l9_127=(int(SC_USE_UV_TRANSFORM_yMap_tmp)!=0);
float3x3 l9_128=(*sc_set0.UserUniforms).yMapTransform;
int2 l9_129=int2(SC_SOFTWARE_WRAP_MODE_U_yMap_tmp,SC_SOFTWARE_WRAP_MODE_V_yMap_tmp);
bool l9_130=(int(SC_USE_UV_MIN_MAX_yMap_tmp)!=0);
float4 l9_131=(*sc_set0.UserUniforms).yMapUvMinMax;
bool l9_132=(int(SC_USE_CLAMP_TO_BORDER_yMap_tmp)!=0);
float4 l9_133=(*sc_set0.UserUniforms).yMapBorderColor;
float l9_134=0.0;
bool l9_135=l9_132&&(!l9_130);
float l9_136=1.0;
float l9_137=l9_126.x;
int l9_138=l9_129.x;
if (l9_138==1)
{
l9_137=fract(l9_137);
}
else
{
if (l9_138==2)
{
float l9_139=fract(l9_137);
float l9_140=l9_137-l9_139;
float l9_141=step(0.25,fract(l9_140*0.5));
l9_137=mix(l9_139,1.0-l9_139,fast::clamp(l9_141,0.0,1.0));
}
}
l9_126.x=l9_137;
float l9_142=l9_126.y;
int l9_143=l9_129.y;
if (l9_143==1)
{
l9_142=fract(l9_142);
}
else
{
if (l9_143==2)
{
float l9_144=fract(l9_142);
float l9_145=l9_142-l9_144;
float l9_146=step(0.25,fract(l9_145*0.5));
l9_142=mix(l9_144,1.0-l9_144,fast::clamp(l9_146,0.0,1.0));
}
}
l9_126.y=l9_142;
if (l9_130)
{
bool l9_147=l9_132;
bool l9_148;
if (l9_147)
{
l9_148=l9_129.x==3;
}
else
{
l9_148=l9_147;
}
float l9_149=l9_126.x;
float l9_150=l9_131.x;
float l9_151=l9_131.z;
bool l9_152=l9_148;
float l9_153=l9_136;
float l9_154=fast::clamp(l9_149,l9_150,l9_151);
float l9_155=step(abs(l9_149-l9_154),9.9999997e-06);
l9_153*=(l9_155+((1.0-float(l9_152))*(1.0-l9_155)));
l9_149=l9_154;
l9_126.x=l9_149;
l9_136=l9_153;
bool l9_156=l9_132;
bool l9_157;
if (l9_156)
{
l9_157=l9_129.y==3;
}
else
{
l9_157=l9_156;
}
float l9_158=l9_126.y;
float l9_159=l9_131.y;
float l9_160=l9_131.w;
bool l9_161=l9_157;
float l9_162=l9_136;
float l9_163=fast::clamp(l9_158,l9_159,l9_160);
float l9_164=step(abs(l9_158-l9_163),9.9999997e-06);
l9_162*=(l9_164+((1.0-float(l9_161))*(1.0-l9_164)));
l9_158=l9_163;
l9_126.y=l9_158;
l9_136=l9_162;
}
float2 l9_165=l9_126;
bool l9_166=l9_127;
float3x3 l9_167=l9_128;
if (l9_166)
{
l9_165=float2((l9_167*float3(l9_165,1.0)).xy);
}
float2 l9_168=l9_165;
l9_126=l9_168;
float l9_169=l9_126.x;
int l9_170=l9_129.x;
bool l9_171=l9_135;
float l9_172=l9_136;
if ((l9_170==0)||(l9_170==3))
{
float l9_173=l9_169;
float l9_174=0.0;
float l9_175=1.0;
bool l9_176=l9_171;
float l9_177=l9_172;
float l9_178=fast::clamp(l9_173,l9_174,l9_175);
float l9_179=step(abs(l9_173-l9_178),9.9999997e-06);
l9_177*=(l9_179+((1.0-float(l9_176))*(1.0-l9_179)));
l9_173=l9_178;
l9_169=l9_173;
l9_172=l9_177;
}
l9_126.x=l9_169;
l9_136=l9_172;
float l9_180=l9_126.y;
int l9_181=l9_129.y;
bool l9_182=l9_135;
float l9_183=l9_136;
if ((l9_181==0)||(l9_181==3))
{
float l9_184=l9_180;
float l9_185=0.0;
float l9_186=1.0;
bool l9_187=l9_182;
float l9_188=l9_183;
float l9_189=fast::clamp(l9_184,l9_185,l9_186);
float l9_190=step(abs(l9_184-l9_189),9.9999997e-06);
l9_188*=(l9_190+((1.0-float(l9_187))*(1.0-l9_190)));
l9_184=l9_189;
l9_180=l9_184;
l9_183=l9_188;
}
l9_126.y=l9_180;
l9_136=l9_183;
float2 l9_191=l9_126;
int l9_192=l9_124;
int l9_193=l9_125;
float l9_194=l9_134;
float2 l9_195=l9_191;
int l9_196=l9_192;
int l9_197=l9_193;
float3 l9_198=float3(0.0);
if (l9_196==0)
{
l9_198=float3(l9_195,0.0);
}
else
{
if (l9_196==1)
{
l9_198=float3(l9_195.x,(l9_195.y*0.5)+(0.5-(float(l9_197)*0.5)),0.0);
}
else
{
l9_198=float3(l9_195,float(l9_197));
}
}
float3 l9_199=l9_198;
float3 l9_200=l9_199;
float4 l9_201=sc_set0.yMap.sample(sc_set0.yMapSmpSC,l9_200.xy,level(l9_194));
float4 l9_202=l9_201;
if (l9_132)
{
l9_202=mix(l9_133,l9_202,float4(l9_136));
}
float4 l9_203=l9_202;
l9_117=l9_203;
float4 l9_204=l9_117;
float4 l9_205=l9_204;
float2 l9_206=l9_25;
float4 l9_207=float4(0.0);
int l9_208;
if ((int(zMapHasSwappedViews_tmp)!=0))
{
int l9_209=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_209=0;
}
else
{
l9_209=gl_InstanceIndex%2;
}
int l9_210=l9_209;
l9_208=1-l9_210;
}
else
{
int l9_211=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_211=0;
}
else
{
l9_211=gl_InstanceIndex%2;
}
int l9_212=l9_211;
l9_208=l9_212;
}
int l9_213=l9_208;
int l9_214=zMapLayout_tmp;
int l9_215=l9_213;
float2 l9_216=l9_206;
bool l9_217=(int(SC_USE_UV_TRANSFORM_zMap_tmp)!=0);
float3x3 l9_218=(*sc_set0.UserUniforms).zMapTransform;
int2 l9_219=int2(SC_SOFTWARE_WRAP_MODE_U_zMap_tmp,SC_SOFTWARE_WRAP_MODE_V_zMap_tmp);
bool l9_220=(int(SC_USE_UV_MIN_MAX_zMap_tmp)!=0);
float4 l9_221=(*sc_set0.UserUniforms).zMapUvMinMax;
bool l9_222=(int(SC_USE_CLAMP_TO_BORDER_zMap_tmp)!=0);
float4 l9_223=(*sc_set0.UserUniforms).zMapBorderColor;
float l9_224=0.0;
bool l9_225=l9_222&&(!l9_220);
float l9_226=1.0;
float l9_227=l9_216.x;
int l9_228=l9_219.x;
if (l9_228==1)
{
l9_227=fract(l9_227);
}
else
{
if (l9_228==2)
{
float l9_229=fract(l9_227);
float l9_230=l9_227-l9_229;
float l9_231=step(0.25,fract(l9_230*0.5));
l9_227=mix(l9_229,1.0-l9_229,fast::clamp(l9_231,0.0,1.0));
}
}
l9_216.x=l9_227;
float l9_232=l9_216.y;
int l9_233=l9_219.y;
if (l9_233==1)
{
l9_232=fract(l9_232);
}
else
{
if (l9_233==2)
{
float l9_234=fract(l9_232);
float l9_235=l9_232-l9_234;
float l9_236=step(0.25,fract(l9_235*0.5));
l9_232=mix(l9_234,1.0-l9_234,fast::clamp(l9_236,0.0,1.0));
}
}
l9_216.y=l9_232;
if (l9_220)
{
bool l9_237=l9_222;
bool l9_238;
if (l9_237)
{
l9_238=l9_219.x==3;
}
else
{
l9_238=l9_237;
}
float l9_239=l9_216.x;
float l9_240=l9_221.x;
float l9_241=l9_221.z;
bool l9_242=l9_238;
float l9_243=l9_226;
float l9_244=fast::clamp(l9_239,l9_240,l9_241);
float l9_245=step(abs(l9_239-l9_244),9.9999997e-06);
l9_243*=(l9_245+((1.0-float(l9_242))*(1.0-l9_245)));
l9_239=l9_244;
l9_216.x=l9_239;
l9_226=l9_243;
bool l9_246=l9_222;
bool l9_247;
if (l9_246)
{
l9_247=l9_219.y==3;
}
else
{
l9_247=l9_246;
}
float l9_248=l9_216.y;
float l9_249=l9_221.y;
float l9_250=l9_221.w;
bool l9_251=l9_247;
float l9_252=l9_226;
float l9_253=fast::clamp(l9_248,l9_249,l9_250);
float l9_254=step(abs(l9_248-l9_253),9.9999997e-06);
l9_252*=(l9_254+((1.0-float(l9_251))*(1.0-l9_254)));
l9_248=l9_253;
l9_216.y=l9_248;
l9_226=l9_252;
}
float2 l9_255=l9_216;
bool l9_256=l9_217;
float3x3 l9_257=l9_218;
if (l9_256)
{
l9_255=float2((l9_257*float3(l9_255,1.0)).xy);
}
float2 l9_258=l9_255;
l9_216=l9_258;
float l9_259=l9_216.x;
int l9_260=l9_219.x;
bool l9_261=l9_225;
float l9_262=l9_226;
if ((l9_260==0)||(l9_260==3))
{
float l9_263=l9_259;
float l9_264=0.0;
float l9_265=1.0;
bool l9_266=l9_261;
float l9_267=l9_262;
float l9_268=fast::clamp(l9_263,l9_264,l9_265);
float l9_269=step(abs(l9_263-l9_268),9.9999997e-06);
l9_267*=(l9_269+((1.0-float(l9_266))*(1.0-l9_269)));
l9_263=l9_268;
l9_259=l9_263;
l9_262=l9_267;
}
l9_216.x=l9_259;
l9_226=l9_262;
float l9_270=l9_216.y;
int l9_271=l9_219.y;
bool l9_272=l9_225;
float l9_273=l9_226;
if ((l9_271==0)||(l9_271==3))
{
float l9_274=l9_270;
float l9_275=0.0;
float l9_276=1.0;
bool l9_277=l9_272;
float l9_278=l9_273;
float l9_279=fast::clamp(l9_274,l9_275,l9_276);
float l9_280=step(abs(l9_274-l9_279),9.9999997e-06);
l9_278*=(l9_280+((1.0-float(l9_277))*(1.0-l9_280)));
l9_274=l9_279;
l9_270=l9_274;
l9_273=l9_278;
}
l9_216.y=l9_270;
l9_226=l9_273;
float2 l9_281=l9_216;
int l9_282=l9_214;
int l9_283=l9_215;
float l9_284=l9_224;
float2 l9_285=l9_281;
int l9_286=l9_282;
int l9_287=l9_283;
float3 l9_288=float3(0.0);
if (l9_286==0)
{
l9_288=float3(l9_285,0.0);
}
else
{
if (l9_286==1)
{
l9_288=float3(l9_285.x,(l9_285.y*0.5)+(0.5-(float(l9_287)*0.5)),0.0);
}
else
{
l9_288=float3(l9_285,float(l9_287));
}
}
float3 l9_289=l9_288;
float3 l9_290=l9_289;
float4 l9_291=sc_set0.zMap.sample(sc_set0.zMapSmpSC,l9_290.xy,level(l9_284));
float4 l9_292=l9_291;
if (l9_222)
{
l9_292=mix(l9_223,l9_292,float4(l9_226));
}
float4 l9_293=l9_292;
l9_207=l9_293;
float4 l9_294=l9_207;
float4 l9_295=l9_294;
float2 l9_296=l9_25;
float4 l9_297=float4(0.0);
int l9_298;
if ((int(colorMapHasSwappedViews_tmp)!=0))
{
int l9_299=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_299=0;
}
else
{
l9_299=gl_InstanceIndex%2;
}
int l9_300=l9_299;
l9_298=1-l9_300;
}
else
{
int l9_301=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_301=0;
}
else
{
l9_301=gl_InstanceIndex%2;
}
int l9_302=l9_301;
l9_298=l9_302;
}
int l9_303=l9_298;
int l9_304=colorMapLayout_tmp;
int l9_305=l9_303;
float2 l9_306=l9_296;
bool l9_307=(int(SC_USE_UV_TRANSFORM_colorMap_tmp)!=0);
float3x3 l9_308=(*sc_set0.UserUniforms).colorMapTransform;
int2 l9_309=int2(SC_SOFTWARE_WRAP_MODE_U_colorMap_tmp,SC_SOFTWARE_WRAP_MODE_V_colorMap_tmp);
bool l9_310=(int(SC_USE_UV_MIN_MAX_colorMap_tmp)!=0);
float4 l9_311=(*sc_set0.UserUniforms).colorMapUvMinMax;
bool l9_312=(int(SC_USE_CLAMP_TO_BORDER_colorMap_tmp)!=0);
float4 l9_313=(*sc_set0.UserUniforms).colorMapBorderColor;
float l9_314=0.0;
bool l9_315=l9_312&&(!l9_310);
float l9_316=1.0;
float l9_317=l9_306.x;
int l9_318=l9_309.x;
if (l9_318==1)
{
l9_317=fract(l9_317);
}
else
{
if (l9_318==2)
{
float l9_319=fract(l9_317);
float l9_320=l9_317-l9_319;
float l9_321=step(0.25,fract(l9_320*0.5));
l9_317=mix(l9_319,1.0-l9_319,fast::clamp(l9_321,0.0,1.0));
}
}
l9_306.x=l9_317;
float l9_322=l9_306.y;
int l9_323=l9_309.y;
if (l9_323==1)
{
l9_322=fract(l9_322);
}
else
{
if (l9_323==2)
{
float l9_324=fract(l9_322);
float l9_325=l9_322-l9_324;
float l9_326=step(0.25,fract(l9_325*0.5));
l9_322=mix(l9_324,1.0-l9_324,fast::clamp(l9_326,0.0,1.0));
}
}
l9_306.y=l9_322;
if (l9_310)
{
bool l9_327=l9_312;
bool l9_328;
if (l9_327)
{
l9_328=l9_309.x==3;
}
else
{
l9_328=l9_327;
}
float l9_329=l9_306.x;
float l9_330=l9_311.x;
float l9_331=l9_311.z;
bool l9_332=l9_328;
float l9_333=l9_316;
float l9_334=fast::clamp(l9_329,l9_330,l9_331);
float l9_335=step(abs(l9_329-l9_334),9.9999997e-06);
l9_333*=(l9_335+((1.0-float(l9_332))*(1.0-l9_335)));
l9_329=l9_334;
l9_306.x=l9_329;
l9_316=l9_333;
bool l9_336=l9_312;
bool l9_337;
if (l9_336)
{
l9_337=l9_309.y==3;
}
else
{
l9_337=l9_336;
}
float l9_338=l9_306.y;
float l9_339=l9_311.y;
float l9_340=l9_311.w;
bool l9_341=l9_337;
float l9_342=l9_316;
float l9_343=fast::clamp(l9_338,l9_339,l9_340);
float l9_344=step(abs(l9_338-l9_343),9.9999997e-06);
l9_342*=(l9_344+((1.0-float(l9_341))*(1.0-l9_344)));
l9_338=l9_343;
l9_306.y=l9_338;
l9_316=l9_342;
}
float2 l9_345=l9_306;
bool l9_346=l9_307;
float3x3 l9_347=l9_308;
if (l9_346)
{
l9_345=float2((l9_347*float3(l9_345,1.0)).xy);
}
float2 l9_348=l9_345;
l9_306=l9_348;
float l9_349=l9_306.x;
int l9_350=l9_309.x;
bool l9_351=l9_315;
float l9_352=l9_316;
if ((l9_350==0)||(l9_350==3))
{
float l9_353=l9_349;
float l9_354=0.0;
float l9_355=1.0;
bool l9_356=l9_351;
float l9_357=l9_352;
float l9_358=fast::clamp(l9_353,l9_354,l9_355);
float l9_359=step(abs(l9_353-l9_358),9.9999997e-06);
l9_357*=(l9_359+((1.0-float(l9_356))*(1.0-l9_359)));
l9_353=l9_358;
l9_349=l9_353;
l9_352=l9_357;
}
l9_306.x=l9_349;
l9_316=l9_352;
float l9_360=l9_306.y;
int l9_361=l9_309.y;
bool l9_362=l9_315;
float l9_363=l9_316;
if ((l9_361==0)||(l9_361==3))
{
float l9_364=l9_360;
float l9_365=0.0;
float l9_366=1.0;
bool l9_367=l9_362;
float l9_368=l9_363;
float l9_369=fast::clamp(l9_364,l9_365,l9_366);
float l9_370=step(abs(l9_364-l9_369),9.9999997e-06);
l9_368*=(l9_370+((1.0-float(l9_367))*(1.0-l9_370)));
l9_364=l9_369;
l9_360=l9_364;
l9_363=l9_368;
}
l9_306.y=l9_360;
l9_316=l9_363;
float2 l9_371=l9_306;
int l9_372=l9_304;
int l9_373=l9_305;
float l9_374=l9_314;
float2 l9_375=l9_371;
int l9_376=l9_372;
int l9_377=l9_373;
float3 l9_378=float3(0.0);
if (l9_376==0)
{
l9_378=float3(l9_375,0.0);
}
else
{
if (l9_376==1)
{
l9_378=float3(l9_375.x,(l9_375.y*0.5)+(0.5-(float(l9_377)*0.5)),0.0);
}
else
{
l9_378=float3(l9_375,float(l9_377));
}
}
float3 l9_379=l9_378;
float3 l9_380=l9_379;
float4 l9_381=sc_set0.colorMap.sample(sc_set0.colorMapSmpSC,l9_380.xy,level(l9_374));
float4 l9_382=l9_381;
if (l9_312)
{
l9_382=mix(l9_313,l9_382,float4(l9_316));
}
float4 l9_383=l9_382;
l9_297=l9_383;
float4 l9_384=l9_297;
float4 l9_385=l9_384;
float2 l9_386=l9_115.xy;
float l9_387=-1.0;
float l9_388=1.0;
float l9_389=0.0;
float2 l9_390=l9_386;
float l9_391=l9_387;
float l9_392=l9_388;
float l9_393=0.99998999;
float2 l9_394=l9_390;
#if (1)
{
l9_394=floor((l9_394*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_395=dot(l9_394,float2(1.0,0.0039215689));
float l9_396=l9_395;
float l9_397=0.0;
float l9_398=l9_393;
float l9_399=l9_391;
float l9_400=l9_392;
float l9_401=l9_399+(((l9_396-l9_397)*(l9_400-l9_399))/(l9_398-l9_397));
float l9_402=l9_401;
l9_389=l9_402;
float l9_403=l9_389;
float l9_404=l9_403;
float2 l9_405=l9_205.xy;
float l9_406=-1.0;
float l9_407=1.0;
float l9_408=0.0;
float2 l9_409=l9_405;
float l9_410=l9_406;
float l9_411=l9_407;
float l9_412=0.99998999;
float2 l9_413=l9_409;
#if (1)
{
l9_413=floor((l9_413*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_414=dot(l9_413,float2(1.0,0.0039215689));
float l9_415=l9_414;
float l9_416=0.0;
float l9_417=l9_412;
float l9_418=l9_410;
float l9_419=l9_411;
float l9_420=l9_418+(((l9_415-l9_416)*(l9_419-l9_418))/(l9_417-l9_416));
float l9_421=l9_420;
l9_408=l9_421;
float l9_422=l9_408;
float l9_423=l9_422;
float2 l9_424=l9_295.xy;
float l9_425=-1.0;
float l9_426=1.0;
float l9_427=0.0;
float2 l9_428=l9_424;
float l9_429=l9_425;
float l9_430=l9_426;
float l9_431=0.99998999;
float2 l9_432=l9_428;
#if (1)
{
l9_432=floor((l9_432*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_433=dot(l9_432,float2(1.0,0.0039215689));
float l9_434=l9_433;
float l9_435=0.0;
float l9_436=l9_431;
float l9_437=l9_429;
float l9_438=l9_430;
float l9_439=l9_437+(((l9_434-l9_435)*(l9_438-l9_437))/(l9_436-l9_435));
float l9_440=l9_439;
l9_427=l9_440;
float l9_441=l9_427;
float l9_442=l9_441;
float3 l9_443=float3(l9_404,l9_423,l9_442)*N10_scale;
float3 l9_444=l9_443*N10_worldScale;
float l9_445=cos(N10_worldRotation.x);
float l9_446=sin(N10_worldRotation.x);
float l9_447=cos(N10_worldRotation.y);
float l9_448=sin(N10_worldRotation.y);
float l9_449=cos(N10_worldRotation.z);
float l9_450=sin(N10_worldRotation.z);
float3 l9_451=float3(l9_444.x,(l9_444.y*l9_445)-(l9_444.z*l9_446),(l9_444.y*l9_446)+(l9_444.z*l9_445));
float3 l9_452=float3((l9_451.x*l9_447)+(l9_451.z*l9_448),l9_451.y,((-l9_451.x)*l9_448)+(l9_451.z*l9_447));
float3 l9_453=float3((l9_452.x*l9_449)-(l9_452.y*l9_450),(l9_452.x*l9_450)+(l9_452.y*l9_449),l9_452.z);
N10_particlePosition=l9_453+N10_worldPosition;
N10_particleColor=l9_385;
N10_KillParticle=0.0;
if (l9_115.z<0.5)
{
N10_KillParticle=1.0;
}
param_14=N10_particlePosition;
param_15=N10_particleColor;
param_16=N10_KillParticle;
particlePosition_N10=param_14;
particleColor_N10=param_15;
KillParticle_N10=param_16;
gParticle.Color=particleColor_N10;
gParticle.Position=particlePosition_N10;
float param_17=KillParticle_N10;
if ((param_17*1.0)!=0.0)
{
gParticle.Dead=true;
}
float3x3 param_18=gParticle.Matrix;
gParticle.Quaternion=matrixToQuaternion(param_18);
float2 QuadSize=float2(4.0,1.0)/float2(2048.0,(*sc_set0.UserUniforms).vfxTargetSizeWrite.y);
float2 Offset=float2(0.0);
int offsetID=(*sc_set0.UserUniforms).vfxOffsetInstancesWrite+ssInstanceID;
int particleRow=512;
Offset.x=float(offsetID%particleRow);
Offset.y=float(offsetID/particleRow);
Offset*=QuadSize;
float2 Vertex=float2(0.0);
float l9_454;
if (v.texture0.x<0.5)
{
l9_454=0.0;
}
else
{
l9_454=QuadSize.x;
}
Vertex.x=l9_454;
float l9_455;
if (v.texture0.y<0.5)
{
l9_455=0.0;
}
else
{
l9_455=QuadSize.y;
}
Vertex.y=l9_455;
Vertex+=Offset;
float4 param_19=float4((Vertex*2.0)-float2(1.0),1.0,1.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_19.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_456=param_19;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_457=dot(l9_456,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_458=l9_457;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_458;
}
}
float4 l9_459=float4(param_19.x,-param_19.y,(param_19.z*0.5)+(param_19.w*0.5),param_19.w);
out.gl_Position=l9_459;
out.Interp_Particle_Index=ssInstanceID;
out.Interp_Particle_Coord=v.texture0;
out.Interp_Particle_Force=gParticle.Force;
out.Interp_Particle_SpawnIndex=gParticle.SpawnIndex;
out.Interp_Particle_NextBurstTime=gParticle.NextBurstTime;
out.Interp_Particle_Position=gParticle.Position;
out.Interp_Particle_Velocity=gParticle.Velocity;
out.Interp_Particle_Life=gParticle.Life;
out.Interp_Particle_Age=gParticle.Age;
out.Interp_Particle_Size=gParticle.Size;
out.Interp_Particle_Color=gParticle.Color;
out.Interp_Particle_Quaternion=gParticle.Quaternion;
if (gParticle.Dead)
{
float4 param_20=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_20.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_460=param_20;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_461=dot(l9_460,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_462=l9_461;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_462;
}
}
float4 l9_463=float4(param_20.x,-param_20.y,(param_20.z*0.5)+(param_20.w*0.5),param_20.w);
out.gl_Position=l9_463;
return out;
}
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int vfxNumCopies;
int vfxBatchEnable[32];
int vfxEmitParticle[32];
float4x4 vfxModelMatrix[32];
float4 renderTarget0Size;
float4 renderTarget0Dims;
float4 renderTarget0View;
float4 renderTarget1Size;
float4 renderTarget1Dims;
float4 renderTarget1View;
float4 renderTarget2Size;
float4 renderTarget2Dims;
float4 renderTarget2View;
float4 renderTarget3Size;
float4 renderTarget3Dims;
float4 renderTarget3View;
float4 sortRenderTarget0Size;
float4 sortRenderTarget0Dims;
float4 sortRenderTarget0View;
float4 sortRenderTarget1Size;
float4 sortRenderTarget1Dims;
float4 sortRenderTarget1View;
float3 vfxLocalAabbMin;
float3 vfxLocalAabbMax;
float vfxCameraAspect;
float vfxCameraNear;
float vfxCameraFar;
float4x4 vfxProjectionMatrix;
float4x4 vfxProjectionMatrixInverse;
float4x4 vfxViewMatrix;
float4x4 vfxViewMatrixInverse;
float4x4 vfxViewProjectionMatrix;
float4x4 vfxViewProjectionMatrixInverse;
float3 vfxCameraPosition;
float3 vfxCameraUp;
float3 vfxCameraForward;
float3 vfxCameraRight;
int vfxFrame;
int vfxOffsetInstancesRead;
int vfxOffsetInstancesWrite;
float2 vfxTargetSizeRead;
float2 vfxTargetSizeWrite;
int vfxTargetWidth;
float2 ssSORT_RENDER_TARGET_SIZE;
float4 xMapSize;
float4 xMapDims;
float4 xMapView;
float3x3 xMapTransform;
float4 xMapUvMinMax;
float4 xMapBorderColor;
float4 yMapSize;
float4 yMapDims;
float4 yMapView;
float3x3 yMapTransform;
float4 yMapUvMinMax;
float4 yMapBorderColor;
float4 zMapSize;
float4 zMapDims;
float4 zMapView;
float3x3 zMapTransform;
float4 zMapUvMinMax;
float4 zMapBorderColor;
float4 colorMapSize;
float4 colorMapDims;
float4 colorMapView;
float3x3 colorMapTransform;
float4 colorMapUvMinMax;
float4 colorMapBorderColor;
float Port_Value_N009;
float Port_Value_N004;
float Port_Value_N006;
};
struct ssParticle
{
float3 Position;
float3 Velocity;
float4 Color;
float Size;
float Age;
float Life;
float Mass;
float3x3 Matrix;
bool Dead;
float4 Quaternion;
float SpawnIndex;
float SpawnIndexRemainder;
float NextBurstTime;
float SpawnOffset;
float Seed;
float2 Seed2000;
float TimeShift;
int Index1D;
int Index1DPerCopy;
float Index1DPerCopyF;
int StateID;
float Coord1D;
float Ratio1D;
float Ratio1DPerCopy;
int2 Index2D;
float2 Coord2D;
float2 Ratio2D;
float3 Force;
bool Spawned;
float CopyId;
float SpawnAmount;
float BurstAmount;
float BurstPeriod;
};
struct sc_Set0
{
texture2d<float> colorMap [[id(0)]];
texture2d<float> renderTarget0 [[id(2)]];
texture2d<float> renderTarget1 [[id(3)]];
texture2d<float> renderTarget2 [[id(4)]];
texture2d<float> renderTarget3 [[id(5)]];
texture2d<float> xMap [[id(22)]];
texture2d<float> yMap [[id(23)]];
texture2d<float> zMap [[id(24)]];
sampler colorMapSmpSC [[id(25)]];
sampler renderTarget0SmpSC [[id(27)]];
sampler renderTarget1SmpSC [[id(28)]];
sampler renderTarget2SmpSC [[id(29)]];
sampler renderTarget3SmpSC [[id(30)]];
sampler xMapSmpSC [[id(40)]];
sampler yMapSmpSC [[id(41)]];
sampler zMapSmpSC [[id(42)]];
constant userUniformsObj* UserUniforms [[id(43)]];
};
struct main_frag_out
{
float4 sc_FragData0 [[color(0)]];
float4 sc_FragData1 [[color(1)]];
float4 sc_FragData2 [[color(2)]];
float4 sc_FragData3 [[color(3)]];
};
struct main_frag_in
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float2 varShadowTex [[user(locn6)]];
int varStereoViewID [[user(locn7)]];
float varClipDistance [[user(locn8)]];
float4 varColor [[user(locn9)]];
int Interp_Particle_Index [[user(locn10)]];
float3 Interp_Particle_Force [[user(locn11)]];
float2 Interp_Particle_Coord [[user(locn12)]];
float Interp_Particle_SpawnIndex [[user(locn13)]];
float Interp_Particle_NextBurstTime [[user(locn14)]];
float3 Interp_Particle_Position [[user(locn15)]];
float3 Interp_Particle_Velocity [[user(locn16)]];
float Interp_Particle_Life [[user(locn17)]];
float Interp_Particle_Age [[user(locn18)]];
float Interp_Particle_Size [[user(locn19)]];
float4 Interp_Particle_Color [[user(locn20)]];
float4 Interp_Particle_Quaternion [[user(locn21)]];
};
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]])
{
main_frag_out out={};
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
float4 Data0=float4(0.0);
float4 Data1=float4(0.0);
float4 Data2=float4(0.0);
float4 Data3=float4(0.0);
ssParticle gParticle;
gParticle.Position=in.Interp_Particle_Position;
gParticle.Velocity=in.Interp_Particle_Velocity;
gParticle.Life=in.Interp_Particle_Life;
gParticle.Age=in.Interp_Particle_Age;
gParticle.Size=in.Interp_Particle_Size;
gParticle.Color=in.Interp_Particle_Color;
gParticle.Quaternion=in.Interp_Particle_Quaternion;
gParticle.SpawnIndex=in.Interp_Particle_SpawnIndex;
gParticle.NextBurstTime=in.Interp_Particle_NextBurstTime;
float2 param=in.Interp_Particle_Coord;
int l9_0=int(floor(param.x*4.0));
float4 l9_1=float4(0.0);
float l9_2=0.0;
float l9_3=0.0;
float l9_4=0.0;
float l9_5=0.0;
float l9_6=0.0;
float l9_7=0.0;
float l9_8=0.0;
float l9_9=0.0;
float l9_10=0.0;
float l9_11=0.0;
float l9_12=0.0;
float l9_13=0.0;
float l9_14=0.0;
float l9_15=0.0;
float l9_16=0.0;
float l9_17=0.0;
if (l9_0==0)
{
float l9_18=gParticle.Position.x;
float l9_19=-1000.0;
float l9_20=1000.0;
float l9_21=l9_18;
float l9_22=l9_19;
float l9_23=l9_20;
float l9_24=0.99998999;
float l9_25=fast::clamp(l9_21,l9_22,l9_23);
float l9_26=l9_22;
float l9_27=l9_23;
float l9_28=0.0;
float l9_29=l9_24;
float l9_30=l9_28+(((l9_25-l9_26)*(l9_29-l9_28))/(l9_27-l9_26));
float l9_31=l9_30;
float4 l9_32=float4(1.0,255.0,65025.0,16581375.0)*l9_31;
l9_32=fract(l9_32);
l9_32-=(l9_32.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_33=l9_32;
float4 l9_34=l9_33;
float4 l9_35=l9_34;
l9_1=l9_35;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_36=gParticle.Position.y;
float l9_37=-1000.0;
float l9_38=1000.0;
float l9_39=l9_36;
float l9_40=l9_37;
float l9_41=l9_38;
float l9_42=0.99998999;
float l9_43=fast::clamp(l9_39,l9_40,l9_41);
float l9_44=l9_40;
float l9_45=l9_41;
float l9_46=0.0;
float l9_47=l9_42;
float l9_48=l9_46+(((l9_43-l9_44)*(l9_47-l9_46))/(l9_45-l9_44));
float l9_49=l9_48;
float4 l9_50=float4(1.0,255.0,65025.0,16581375.0)*l9_49;
l9_50=fract(l9_50);
l9_50-=(l9_50.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_51=l9_50;
float4 l9_52=l9_51;
float4 l9_53=l9_52;
l9_1=l9_53;
l9_6=l9_1.x;
l9_7=l9_1.y;
l9_8=l9_1.z;
l9_9=l9_1.w;
float l9_54=gParticle.Position.z;
float l9_55=-1000.0;
float l9_56=1000.0;
float l9_57=l9_54;
float l9_58=l9_55;
float l9_59=l9_56;
float l9_60=0.99998999;
float l9_61=fast::clamp(l9_57,l9_58,l9_59);
float l9_62=l9_58;
float l9_63=l9_59;
float l9_64=0.0;
float l9_65=l9_60;
float l9_66=l9_64+(((l9_61-l9_62)*(l9_65-l9_64))/(l9_63-l9_62));
float l9_67=l9_66;
float4 l9_68=float4(1.0,255.0,65025.0,16581375.0)*l9_67;
l9_68=fract(l9_68);
l9_68-=(l9_68.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_69=l9_68;
float4 l9_70=l9_69;
float4 l9_71=l9_70;
l9_1=l9_71;
l9_10=l9_1.x;
l9_11=l9_1.y;
l9_12=l9_1.z;
l9_13=l9_1.w;
float l9_72=gParticle.Velocity.x;
float l9_73=-1000.0;
float l9_74=1000.0;
float l9_75=l9_72;
float l9_76=l9_73;
float l9_77=l9_74;
float l9_78=0.99998999;
float l9_79=fast::clamp(l9_75,l9_76,l9_77);
float l9_80=l9_76;
float l9_81=l9_77;
float l9_82=0.0;
float l9_83=l9_78;
float l9_84=l9_82+(((l9_79-l9_80)*(l9_83-l9_82))/(l9_81-l9_80));
float l9_85=l9_84;
float4 l9_86=float4(1.0,255.0,65025.0,16581375.0)*l9_85;
l9_86=fract(l9_86);
l9_86-=(l9_86.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_87=l9_86;
float4 l9_88=l9_87;
float4 l9_89=l9_88;
l9_1=l9_89;
l9_14=l9_1.x;
l9_15=l9_1.y;
l9_16=l9_1.z;
l9_17=l9_1.w;
}
else
{
if (l9_0==1)
{
float l9_90=gParticle.Velocity.y;
float l9_91=-1000.0;
float l9_92=1000.0;
float l9_93=l9_90;
float l9_94=l9_91;
float l9_95=l9_92;
float l9_96=0.99998999;
float l9_97=fast::clamp(l9_93,l9_94,l9_95);
float l9_98=l9_94;
float l9_99=l9_95;
float l9_100=0.0;
float l9_101=l9_96;
float l9_102=l9_100+(((l9_97-l9_98)*(l9_101-l9_100))/(l9_99-l9_98));
float l9_103=l9_102;
float4 l9_104=float4(1.0,255.0,65025.0,16581375.0)*l9_103;
l9_104=fract(l9_104);
l9_104-=(l9_104.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_105=l9_104;
float4 l9_106=l9_105;
float4 l9_107=l9_106;
l9_1=l9_107;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_108=gParticle.Velocity.z;
float l9_109=-1000.0;
float l9_110=1000.0;
float l9_111=l9_108;
float l9_112=l9_109;
float l9_113=l9_110;
float l9_114=0.99998999;
float l9_115=fast::clamp(l9_111,l9_112,l9_113);
float l9_116=l9_112;
float l9_117=l9_113;
float l9_118=0.0;
float l9_119=l9_114;
float l9_120=l9_118+(((l9_115-l9_116)*(l9_119-l9_118))/(l9_117-l9_116));
float l9_121=l9_120;
float4 l9_122=float4(1.0,255.0,65025.0,16581375.0)*l9_121;
l9_122=fract(l9_122);
l9_122-=(l9_122.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_123=l9_122;
float4 l9_124=l9_123;
float4 l9_125=l9_124;
l9_1=l9_125;
l9_6=l9_1.x;
l9_7=l9_1.y;
l9_8=l9_1.z;
l9_9=l9_1.w;
float l9_126=gParticle.Life;
float l9_127=0.0;
float l9_128=0.5;
float l9_129=l9_126;
float l9_130=l9_127;
float l9_131=l9_128;
float l9_132=0.99998999;
float l9_133=fast::clamp(l9_129,l9_130,l9_131);
float l9_134=l9_130;
float l9_135=l9_131;
float l9_136=0.0;
float l9_137=l9_132;
float l9_138=l9_136+(((l9_133-l9_134)*(l9_137-l9_136))/(l9_135-l9_134));
float l9_139=l9_138;
float4 l9_140=float4(1.0,255.0,65025.0,16581375.0)*l9_139;
l9_140=fract(l9_140);
l9_140-=(l9_140.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_141=l9_140;
float4 l9_142=l9_141;
float4 l9_143=l9_142;
l9_1=l9_143;
l9_10=l9_1.x;
l9_11=l9_1.y;
l9_12=l9_1.z;
l9_13=l9_1.w;
float l9_144=gParticle.Age;
float l9_145=0.0;
float l9_146=0.5;
float l9_147=l9_144;
float l9_148=l9_145;
float l9_149=l9_146;
float l9_150=0.99998999;
float l9_151=fast::clamp(l9_147,l9_148,l9_149);
float l9_152=l9_148;
float l9_153=l9_149;
float l9_154=0.0;
float l9_155=l9_150;
float l9_156=l9_154+(((l9_151-l9_152)*(l9_155-l9_154))/(l9_153-l9_152));
float l9_157=l9_156;
float4 l9_158=float4(1.0,255.0,65025.0,16581375.0)*l9_157;
l9_158=fract(l9_158);
l9_158-=(l9_158.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_159=l9_158;
float4 l9_160=l9_159;
float4 l9_161=l9_160;
l9_1=l9_161;
l9_14=l9_1.x;
l9_15=l9_1.y;
l9_16=l9_1.z;
l9_17=l9_1.w;
}
else
{
if (l9_0==2)
{
float l9_162=gParticle.Size;
float l9_163=0.0;
float l9_164=100.0;
float l9_165=l9_162;
float l9_166=l9_163;
float l9_167=l9_164;
float l9_168=0.99998999;
float l9_169=fast::clamp(l9_165,l9_166,l9_167);
float l9_170=l9_166;
float l9_171=l9_167;
float l9_172=0.0;
float l9_173=l9_168;
float l9_174=l9_172+(((l9_169-l9_170)*(l9_173-l9_172))/(l9_171-l9_170));
float l9_175=l9_174;
float4 l9_176=float4(1.0,255.0,65025.0,16581375.0)*l9_175;
l9_176=fract(l9_176);
l9_176-=(l9_176.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_177=l9_176;
float4 l9_178=l9_177;
float4 l9_179=l9_178;
l9_1=l9_179;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_180=gParticle.Color.x;
float l9_181=0.0;
float l9_182=1.00001;
float l9_183=l9_180;
float l9_184=l9_181;
float l9_185=l9_182;
float l9_186=0.99998999;
float l9_187=fast::clamp(l9_183,l9_184,l9_185);
float l9_188=l9_184;
float l9_189=l9_185;
float l9_190=0.0;
float l9_191=l9_186;
float l9_192=l9_190+(((l9_187-l9_188)*(l9_191-l9_190))/(l9_189-l9_188));
float l9_193=l9_192;
float4 l9_194=float4(1.0,255.0,65025.0,16581375.0)*l9_193;
l9_194=fract(l9_194);
l9_194-=(l9_194.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_195=l9_194;
float4 l9_196=l9_195;
float4 l9_197=l9_196;
l9_1=l9_197;
l9_6=l9_1.x;
l9_7=l9_1.y;
l9_8=l9_1.z;
l9_9=l9_1.w;
float l9_198=gParticle.Color.y;
float l9_199=0.0;
float l9_200=1.00001;
float l9_201=l9_198;
float l9_202=l9_199;
float l9_203=l9_200;
float l9_204=0.99998999;
float l9_205=fast::clamp(l9_201,l9_202,l9_203);
float l9_206=l9_202;
float l9_207=l9_203;
float l9_208=0.0;
float l9_209=l9_204;
float l9_210=l9_208+(((l9_205-l9_206)*(l9_209-l9_208))/(l9_207-l9_206));
float l9_211=l9_210;
float4 l9_212=float4(1.0,255.0,65025.0,16581375.0)*l9_211;
l9_212=fract(l9_212);
l9_212-=(l9_212.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_213=l9_212;
float4 l9_214=l9_213;
float4 l9_215=l9_214;
l9_1=l9_215;
l9_10=l9_1.x;
l9_11=l9_1.y;
l9_12=l9_1.z;
l9_13=l9_1.w;
float l9_216=gParticle.Color.z;
float l9_217=0.0;
float l9_218=1.00001;
float l9_219=l9_216;
float l9_220=l9_217;
float l9_221=l9_218;
float l9_222=0.99998999;
float l9_223=fast::clamp(l9_219,l9_220,l9_221);
float l9_224=l9_220;
float l9_225=l9_221;
float l9_226=0.0;
float l9_227=l9_222;
float l9_228=l9_226+(((l9_223-l9_224)*(l9_227-l9_226))/(l9_225-l9_224));
float l9_229=l9_228;
float4 l9_230=float4(1.0,255.0,65025.0,16581375.0)*l9_229;
l9_230=fract(l9_230);
l9_230-=(l9_230.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_231=l9_230;
float4 l9_232=l9_231;
float4 l9_233=l9_232;
l9_1=l9_233;
l9_14=l9_1.x;
l9_15=l9_1.y;
l9_16=l9_1.z;
l9_17=l9_1.w;
}
else
{
if (l9_0==3)
{
float l9_234=gParticle.Color.w;
float l9_235=0.0;
float l9_236=1.00001;
float l9_237=l9_234;
float l9_238=l9_235;
float l9_239=l9_236;
float l9_240=0.99998999;
float l9_241=fast::clamp(l9_237,l9_238,l9_239);
float l9_242=l9_238;
float l9_243=l9_239;
float l9_244=0.0;
float l9_245=l9_240;
float l9_246=l9_244+(((l9_241-l9_242)*(l9_245-l9_244))/(l9_243-l9_242));
float l9_247=l9_246;
float4 l9_248=float4(1.0,255.0,65025.0,16581375.0)*l9_247;
l9_248=fract(l9_248);
l9_248-=(l9_248.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float4 l9_249=l9_248;
float4 l9_250=l9_249;
float4 l9_251=l9_250;
l9_1=l9_251;
l9_2=l9_1.x;
l9_3=l9_1.y;
l9_4=l9_1.z;
l9_5=l9_1.w;
float l9_252=gParticle.Quaternion.x;
float l9_253=-1.0;
float l9_254=1.0;
float l9_255=l9_252;
float l9_256=l9_253;
float l9_257=l9_254;
float l9_258=0.99998999;
float l9_259=fast::clamp(l9_255,l9_256,l9_257);
float l9_260=l9_256;
float l9_261=l9_257;
float l9_262=0.0;
float l9_263=l9_258;
float l9_264=l9_262+(((l9_259-l9_260)*(l9_263-l9_262))/(l9_261-l9_260));
float l9_265=l9_264;
float4 l9_266=float4(1.0,255.0,65025.0,16581375.0)*l9_265;
l9_266=fract(l9_266);
l9_266-=(l9_266.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_267=l9_266.xy;
float2 l9_268=l9_267;
float2 l9_269=l9_268;
l9_1=float4(l9_269.x,l9_269.y,l9_1.z,l9_1.w);
l9_6=l9_1.x;
l9_7=l9_1.y;
float l9_270=gParticle.Quaternion.y;
float l9_271=-1.0;
float l9_272=1.0;
float l9_273=l9_270;
float l9_274=l9_271;
float l9_275=l9_272;
float l9_276=0.99998999;
float l9_277=fast::clamp(l9_273,l9_274,l9_275);
float l9_278=l9_274;
float l9_279=l9_275;
float l9_280=0.0;
float l9_281=l9_276;
float l9_282=l9_280+(((l9_277-l9_278)*(l9_281-l9_280))/(l9_279-l9_278));
float l9_283=l9_282;
float4 l9_284=float4(1.0,255.0,65025.0,16581375.0)*l9_283;
l9_284=fract(l9_284);
l9_284-=(l9_284.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_285=l9_284.xy;
float2 l9_286=l9_285;
float2 l9_287=l9_286;
l9_1=float4(l9_287.x,l9_287.y,l9_1.z,l9_1.w);
l9_8=l9_1.x;
l9_9=l9_1.y;
float l9_288=gParticle.Quaternion.z;
float l9_289=-1.0;
float l9_290=1.0;
float l9_291=l9_288;
float l9_292=l9_289;
float l9_293=l9_290;
float l9_294=0.99998999;
float l9_295=fast::clamp(l9_291,l9_292,l9_293);
float l9_296=l9_292;
float l9_297=l9_293;
float l9_298=0.0;
float l9_299=l9_294;
float l9_300=l9_298+(((l9_295-l9_296)*(l9_299-l9_298))/(l9_297-l9_296));
float l9_301=l9_300;
float4 l9_302=float4(1.0,255.0,65025.0,16581375.0)*l9_301;
l9_302=fract(l9_302);
l9_302-=(l9_302.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_303=l9_302.xy;
float2 l9_304=l9_303;
float2 l9_305=l9_304;
l9_1=float4(l9_305.x,l9_305.y,l9_1.z,l9_1.w);
l9_10=l9_1.x;
l9_11=l9_1.y;
float l9_306=gParticle.Quaternion.w;
float l9_307=-1.0;
float l9_308=1.0;
float l9_309=l9_306;
float l9_310=l9_307;
float l9_311=l9_308;
float l9_312=0.99998999;
float l9_313=fast::clamp(l9_309,l9_310,l9_311);
float l9_314=l9_310;
float l9_315=l9_311;
float l9_316=0.0;
float l9_317=l9_312;
float l9_318=l9_316+(((l9_313-l9_314)*(l9_317-l9_316))/(l9_315-l9_314));
float l9_319=l9_318;
float4 l9_320=float4(1.0,255.0,65025.0,16581375.0)*l9_319;
l9_320=fract(l9_320);
l9_320-=(l9_320.yzww*float4(0.0039215689,0.0039215689,0.0039215689,0.0));
float2 l9_321=l9_320.xy;
float2 l9_322=l9_321;
float2 l9_323=l9_322;
l9_1=float4(l9_323.x,l9_323.y,l9_1.z,l9_1.w);
l9_12=l9_1.x;
l9_13=l9_1.y;
}
}
}
}
float4 param_1=float4(l9_2,l9_3,l9_4,l9_5);
float4 param_2=float4(l9_6,l9_7,l9_8,l9_9);
float4 param_3=float4(l9_10,l9_11,l9_12,l9_13);
float4 param_4=float4(l9_14,l9_15,l9_16,l9_17);
Data0=param_1;
Data1=param_2;
Data2=param_3;
Data3=param_4;
if (dot(((Data0+Data1)+Data2)+Data3,float4(0.23454))==0.34231836)
{
Data0+=float4(1e-06);
}
float4 param_5=Data0;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_5.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_5;
float4 param_6=Data1;
out.sc_FragData1=param_6;
float4 param_7=Data2;
out.sc_FragData2=param_7;
float4 param_8=Data3;
out.sc_FragData3=param_8;
return out;
}
} // FRAGMENT SHADER
