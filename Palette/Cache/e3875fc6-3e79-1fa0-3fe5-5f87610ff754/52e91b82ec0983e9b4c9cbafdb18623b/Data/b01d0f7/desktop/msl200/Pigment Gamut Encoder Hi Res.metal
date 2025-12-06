#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
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
// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// SCC_BACKEND_SHADER_FLAGS_END__
//SG_REFLECTION_BEGIN(200)
//attribute vec4 boneData 5
//attribute vec3 blendShape0Pos 6
//attribute vec3 blendShape0Normal 12
//attribute vec3 blendShape1Pos 7
//attribute vec3 blendShape1Normal 13
//attribute vec3 blendShape2Pos 8
//attribute vec3 blendShape2Normal 14
//attribute vec3 blendShape3Pos 9
//attribute vec3 blendShape4Pos 10
//attribute vec3 blendShape5Pos 11
//attribute vec4 position 0
//attribute vec3 normal 1
//attribute vec4 tangent 2
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec4 color 18
//attribute vec3 positionNext 15
//attribute vec3 positionPrevious 16
//attribute vec4 strandProperties 17
//output vec4 sc_FragData0 0
//output vec4 sc_FragData1 1
//output vec4 sc_FragData2 2
//output vec4 sc_FragData3 3
//sampler sampler intensityTextureSmpSC 0:22
//sampler sampler pigmentTexSmpSC 0:23
//sampler sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC 0:27
//sampler sampler sc_RayTracingRayDirectionSmpSC 0:28
//sampler sampler sc_ScreenTextureSmpSC 0:30
//texture texture2D intensityTexture 0:4:0:22
//texture texture2D pigmentTex 0:5:0:23
//texture utexture2D sc_RayTracingHitCasterIdAndBarycentric 0:16:0:27
//texture texture2D sc_RayTracingRayDirection 0:17:0:28
//texture texture2D sc_ScreenTexture 0:19:0:30
//ubo float sc_BonesUBO 0:3:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:33:4544 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4x4 sc_ViewProjectionMatrixArray 1680:[2]:64
//float4x4 sc_ModelViewMatrixArray 1936:[2]:64
//float4x4 sc_ProjectionMatrixArray 2384:[2]:64
//float4x4 sc_ProjectionMatrixInverseArray 2512:[2]:64
//float4x4 sc_ViewMatrixArray 2640:[2]:64
//float4x4 sc_PrevFrameViewProjectionMatrixArray 2896:[2]:64
//float4x4 sc_ModelMatrix 3024
//float4x4 sc_ModelMatrixInverse 3088
//float3x3 sc_NormalMatrix 3152
//float4x4 sc_PrevFrameModelMatrix 3248
//float4 sc_CurrentRenderTargetDims 3456
//sc_Camera_t sc_Camera 3472
//float3 sc_Camera.position 0
//float sc_Camera.aspect 16
//float2 sc_Camera.clipPlanes 24
//float sc_ShadowDensity 3504
//float4 sc_ShadowColor 3520
//float4x4 sc_ProjectorMatrix 3536
//float4 weights0 3616
//float4 weights1 3632
//float4 sc_StereoClipPlanes 3664:[2]:16
//float2 sc_TAAJitterOffset 3704
//uint4 sc_RayTracingCasterConfiguration 3824
//uint4 sc_RayTracingCasterOffsetPNTC 3840
//uint4 sc_RayTracingCasterOffsetTexture 3856
//uint4 sc_RayTracingCasterFormatPNTC 3872
//uint4 sc_RayTracingCasterFormatTexture 3888
//float4 voxelization_params_0 3952
//float4 voxelization_params_frustum_lrbt 3968
//float4 voxelization_params_frustum_nf 3984
//float3 voxelization_params_camera_pos 4000
//float4x4 sc_ModelMatrixVoxelization 4016
//float correctedIntensity 4080
//float3x3 intensityTextureTransform 4144
//float4 intensityTextureUvMinMax 4192
//float4 intensityTextureBorderColor 4208
//int PreviewEnabled 4372
//float alphaTestThreshold 4380
//float3x3 pigmentTexTransform 4432
//float4 pigmentTexUvMinMax 4480
//float4 pigmentTexBorderColor 4496
//float numPigments 4512
//float texWidth 4516
//float texSize 4520
//float mixSteps 4524
//float depthRef 4528
//}
//ssbo int sc_RayTracingCasterIndexBuffer 0:0:4 {
//uint sc_RayTracingCasterTriangles 0:[1]:4
//}
//ssbo float sc_RayTracingCasterNonAnimatedVertexBuffer 0:2:4 {
//float sc_RayTracingCasterNonAnimatedVertices 0:[1]:4
//}
//ssbo float sc_RayTracingCasterVertexBuffer 0:1:4 {
//float sc_RayTracingCasterVertices 0:[1]:4
//}
//spec_const bool BLEND_MODE_AVERAGE 0 0
//spec_const bool BLEND_MODE_BRIGHT 1 0
//spec_const bool BLEND_MODE_COLOR_BURN 2 0
//spec_const bool BLEND_MODE_COLOR_DODGE 3 0
//spec_const bool BLEND_MODE_COLOR 4 0
//spec_const bool BLEND_MODE_DARKEN 5 0
//spec_const bool BLEND_MODE_DIFFERENCE 6 0
//spec_const bool BLEND_MODE_DIVIDE 7 0
//spec_const bool BLEND_MODE_DIVISION 8 0
//spec_const bool BLEND_MODE_EXCLUSION 9 0
//spec_const bool BLEND_MODE_FORGRAY 10 0
//spec_const bool BLEND_MODE_HARD_GLOW 11 0
//spec_const bool BLEND_MODE_HARD_LIGHT 12 0
//spec_const bool BLEND_MODE_HARD_MIX 13 0
//spec_const bool BLEND_MODE_HARD_PHOENIX 14 0
//spec_const bool BLEND_MODE_HARD_REFLECT 15 0
//spec_const bool BLEND_MODE_HUE 16 0
//spec_const bool BLEND_MODE_INTENSE 17 0
//spec_const bool BLEND_MODE_LIGHTEN 18 0
//spec_const bool BLEND_MODE_LINEAR_LIGHT 19 0
//spec_const bool BLEND_MODE_LUMINOSITY 20 0
//spec_const bool BLEND_MODE_NEGATION 21 0
//spec_const bool BLEND_MODE_NOTBRIGHT 22 0
//spec_const bool BLEND_MODE_OVERLAY 23 0
//spec_const bool BLEND_MODE_PIN_LIGHT 24 0
//spec_const bool BLEND_MODE_REALISTIC 25 0
//spec_const bool BLEND_MODE_SATURATION 26 0
//spec_const bool BLEND_MODE_SOFT_LIGHT 27 0
//spec_const bool BLEND_MODE_SUBTRACT 28 0
//spec_const bool BLEND_MODE_VIVID_LIGHT 29 0
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 30 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_pigmentTex 32 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 33 0
//spec_const bool SC_USE_UV_MIN_MAX_pigmentTex 34 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 35 0
//spec_const bool SC_USE_UV_TRANSFORM_pigmentTex 36 0
//spec_const bool UseViewSpaceDepthVariant 37 1
//spec_const bool intensityTextureHasSwappedViews 38 0
//spec_const bool pigmentTexHasSwappedViews 39 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 40 0
//spec_const bool sc_BlendMode_Add 41 0
//spec_const bool sc_BlendMode_AlphaTest 42 0
//spec_const bool sc_BlendMode_AlphaToCoverage 43 0
//spec_const bool sc_BlendMode_ColoredGlass 44 0
//spec_const bool sc_BlendMode_Custom 45 0
//spec_const bool sc_BlendMode_Max 46 0
//spec_const bool sc_BlendMode_Min 47 0
//spec_const bool sc_BlendMode_MultiplyOriginal 48 0
//spec_const bool sc_BlendMode_Multiply 49 0
//spec_const bool sc_BlendMode_Normal 50 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 51 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 52 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 53 0
//spec_const bool sc_BlendMode_Screen 54 0
//spec_const bool sc_DepthOnly 55 0
//spec_const bool sc_FramebufferFetch 56 0
//spec_const bool sc_MotionVectorsPass 57 0
//spec_const bool sc_OITCompositingPass 58 0
//spec_const bool sc_OITDepthBoundsPass 59 0
//spec_const bool sc_OITDepthGatherPass 60 0
//spec_const bool sc_OutputBounds 61 0
//spec_const bool sc_ProjectiveShadowsCaster 62 0
//spec_const bool sc_ProjectiveShadowsReceiver 63 0
//spec_const bool sc_RayTracingCasterForceOpaque 64 0
//spec_const bool sc_RenderAlphaToColor 65 0
//spec_const bool sc_ScreenTextureHasSwappedViews 66 0
//spec_const bool sc_TAAEnabled 67 0
//spec_const bool sc_VertexBlendingUseNormals 68 0
//spec_const bool sc_VertexBlending 69 0
//spec_const bool sc_Voxelization 70 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 71 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_pigmentTex 72 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 73 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_pigmentTex 74 -1
//spec_const int intensityTextureLayout 75 0
//spec_const int pigmentTexLayout 76 0
//spec_const int sc_DepthBufferMode 77 0
//spec_const int sc_RenderingSpace 78 -1
//spec_const int sc_ScreenTextureLayout 79 0
//spec_const int sc_ShaderCacheConstant 80 0
//spec_const int sc_SkinBonesCount 81 0
//spec_const int sc_StereoRenderingMode 82 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 83 0
//SG_REFLECTION_END
constant bool BLEND_MODE_AVERAGE [[function_constant(0)]];
constant bool BLEND_MODE_AVERAGE_tmp = is_function_constant_defined(BLEND_MODE_AVERAGE) ? BLEND_MODE_AVERAGE : false;
constant bool BLEND_MODE_BRIGHT [[function_constant(1)]];
constant bool BLEND_MODE_BRIGHT_tmp = is_function_constant_defined(BLEND_MODE_BRIGHT) ? BLEND_MODE_BRIGHT : false;
constant bool BLEND_MODE_COLOR_BURN [[function_constant(2)]];
constant bool BLEND_MODE_COLOR_BURN_tmp = is_function_constant_defined(BLEND_MODE_COLOR_BURN) ? BLEND_MODE_COLOR_BURN : false;
constant bool BLEND_MODE_COLOR_DODGE [[function_constant(3)]];
constant bool BLEND_MODE_COLOR_DODGE_tmp = is_function_constant_defined(BLEND_MODE_COLOR_DODGE) ? BLEND_MODE_COLOR_DODGE : false;
constant bool BLEND_MODE_COLOR [[function_constant(4)]];
constant bool BLEND_MODE_COLOR_tmp = is_function_constant_defined(BLEND_MODE_COLOR) ? BLEND_MODE_COLOR : false;
constant bool BLEND_MODE_DARKEN [[function_constant(5)]];
constant bool BLEND_MODE_DARKEN_tmp = is_function_constant_defined(BLEND_MODE_DARKEN) ? BLEND_MODE_DARKEN : false;
constant bool BLEND_MODE_DIFFERENCE [[function_constant(6)]];
constant bool BLEND_MODE_DIFFERENCE_tmp = is_function_constant_defined(BLEND_MODE_DIFFERENCE) ? BLEND_MODE_DIFFERENCE : false;
constant bool BLEND_MODE_DIVIDE [[function_constant(7)]];
constant bool BLEND_MODE_DIVIDE_tmp = is_function_constant_defined(BLEND_MODE_DIVIDE) ? BLEND_MODE_DIVIDE : false;
constant bool BLEND_MODE_DIVISION [[function_constant(8)]];
constant bool BLEND_MODE_DIVISION_tmp = is_function_constant_defined(BLEND_MODE_DIVISION) ? BLEND_MODE_DIVISION : false;
constant bool BLEND_MODE_EXCLUSION [[function_constant(9)]];
constant bool BLEND_MODE_EXCLUSION_tmp = is_function_constant_defined(BLEND_MODE_EXCLUSION) ? BLEND_MODE_EXCLUSION : false;
constant bool BLEND_MODE_FORGRAY [[function_constant(10)]];
constant bool BLEND_MODE_FORGRAY_tmp = is_function_constant_defined(BLEND_MODE_FORGRAY) ? BLEND_MODE_FORGRAY : false;
constant bool BLEND_MODE_HARD_GLOW [[function_constant(11)]];
constant bool BLEND_MODE_HARD_GLOW_tmp = is_function_constant_defined(BLEND_MODE_HARD_GLOW) ? BLEND_MODE_HARD_GLOW : false;
constant bool BLEND_MODE_HARD_LIGHT [[function_constant(12)]];
constant bool BLEND_MODE_HARD_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_HARD_LIGHT) ? BLEND_MODE_HARD_LIGHT : false;
constant bool BLEND_MODE_HARD_MIX [[function_constant(13)]];
constant bool BLEND_MODE_HARD_MIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_MIX) ? BLEND_MODE_HARD_MIX : false;
constant bool BLEND_MODE_HARD_PHOENIX [[function_constant(14)]];
constant bool BLEND_MODE_HARD_PHOENIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_PHOENIX) ? BLEND_MODE_HARD_PHOENIX : false;
constant bool BLEND_MODE_HARD_REFLECT [[function_constant(15)]];
constant bool BLEND_MODE_HARD_REFLECT_tmp = is_function_constant_defined(BLEND_MODE_HARD_REFLECT) ? BLEND_MODE_HARD_REFLECT : false;
constant bool BLEND_MODE_HUE [[function_constant(16)]];
constant bool BLEND_MODE_HUE_tmp = is_function_constant_defined(BLEND_MODE_HUE) ? BLEND_MODE_HUE : false;
constant bool BLEND_MODE_INTENSE [[function_constant(17)]];
constant bool BLEND_MODE_INTENSE_tmp = is_function_constant_defined(BLEND_MODE_INTENSE) ? BLEND_MODE_INTENSE : false;
constant bool BLEND_MODE_LIGHTEN [[function_constant(18)]];
constant bool BLEND_MODE_LIGHTEN_tmp = is_function_constant_defined(BLEND_MODE_LIGHTEN) ? BLEND_MODE_LIGHTEN : false;
constant bool BLEND_MODE_LINEAR_LIGHT [[function_constant(19)]];
constant bool BLEND_MODE_LINEAR_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_LINEAR_LIGHT) ? BLEND_MODE_LINEAR_LIGHT : false;
constant bool BLEND_MODE_LUMINOSITY [[function_constant(20)]];
constant bool BLEND_MODE_LUMINOSITY_tmp = is_function_constant_defined(BLEND_MODE_LUMINOSITY) ? BLEND_MODE_LUMINOSITY : false;
constant bool BLEND_MODE_NEGATION [[function_constant(21)]];
constant bool BLEND_MODE_NEGATION_tmp = is_function_constant_defined(BLEND_MODE_NEGATION) ? BLEND_MODE_NEGATION : false;
constant bool BLEND_MODE_NOTBRIGHT [[function_constant(22)]];
constant bool BLEND_MODE_NOTBRIGHT_tmp = is_function_constant_defined(BLEND_MODE_NOTBRIGHT) ? BLEND_MODE_NOTBRIGHT : false;
constant bool BLEND_MODE_OVERLAY [[function_constant(23)]];
constant bool BLEND_MODE_OVERLAY_tmp = is_function_constant_defined(BLEND_MODE_OVERLAY) ? BLEND_MODE_OVERLAY : false;
constant bool BLEND_MODE_PIN_LIGHT [[function_constant(24)]];
constant bool BLEND_MODE_PIN_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_PIN_LIGHT) ? BLEND_MODE_PIN_LIGHT : false;
constant bool BLEND_MODE_REALISTIC [[function_constant(25)]];
constant bool BLEND_MODE_REALISTIC_tmp = is_function_constant_defined(BLEND_MODE_REALISTIC) ? BLEND_MODE_REALISTIC : false;
constant bool BLEND_MODE_SATURATION [[function_constant(26)]];
constant bool BLEND_MODE_SATURATION_tmp = is_function_constant_defined(BLEND_MODE_SATURATION) ? BLEND_MODE_SATURATION : false;
constant bool BLEND_MODE_SOFT_LIGHT [[function_constant(27)]];
constant bool BLEND_MODE_SOFT_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_SOFT_LIGHT) ? BLEND_MODE_SOFT_LIGHT : false;
constant bool BLEND_MODE_SUBTRACT [[function_constant(28)]];
constant bool BLEND_MODE_SUBTRACT_tmp = is_function_constant_defined(BLEND_MODE_SUBTRACT) ? BLEND_MODE_SUBTRACT : false;
constant bool BLEND_MODE_VIVID_LIGHT [[function_constant(29)]];
constant bool BLEND_MODE_VIVID_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_VIVID_LIGHT) ? BLEND_MODE_VIVID_LIGHT : false;
constant bool ENABLE_STIPPLE_PATTERN_TEST [[function_constant(30)]];
constant bool ENABLE_STIPPLE_PATTERN_TEST_tmp = is_function_constant_defined(ENABLE_STIPPLE_PATTERN_TEST) ? ENABLE_STIPPLE_PATTERN_TEST : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_pigmentTex [[function_constant(32)]];
constant bool SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_pigmentTex) ? SC_USE_CLAMP_TO_BORDER_pigmentTex : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(33)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_pigmentTex [[function_constant(34)]];
constant bool SC_USE_UV_MIN_MAX_pigmentTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_pigmentTex) ? SC_USE_UV_MIN_MAX_pigmentTex : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(35)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_pigmentTex [[function_constant(36)]];
constant bool SC_USE_UV_TRANSFORM_pigmentTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_pigmentTex) ? SC_USE_UV_TRANSFORM_pigmentTex : false;
constant bool UseViewSpaceDepthVariant [[function_constant(37)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool intensityTextureHasSwappedViews [[function_constant(38)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool pigmentTexHasSwappedViews [[function_constant(39)]];
constant bool pigmentTexHasSwappedViews_tmp = is_function_constant_defined(pigmentTexHasSwappedViews) ? pigmentTexHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(40)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(41)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(42)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(43)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(44)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(45)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(46)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(47)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(48)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(49)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(50)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(51)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(52)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(53)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(54)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(55)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_FramebufferFetch [[function_constant(56)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_MotionVectorsPass [[function_constant(57)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(58)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(59)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(60)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(61)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(62)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(63)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RayTracingCasterForceOpaque [[function_constant(64)]];
constant bool sc_RayTracingCasterForceOpaque_tmp = is_function_constant_defined(sc_RayTracingCasterForceOpaque) ? sc_RayTracingCasterForceOpaque : false;
constant bool sc_RenderAlphaToColor [[function_constant(65)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(66)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(67)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(68)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(69)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(70)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(71)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_pigmentTex [[function_constant(72)]];
constant int SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_pigmentTex) ? SC_SOFTWARE_WRAP_MODE_U_pigmentTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(73)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_pigmentTex [[function_constant(74)]];
constant int SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_pigmentTex) ? SC_SOFTWARE_WRAP_MODE_V_pigmentTex : -1;
constant int intensityTextureLayout [[function_constant(75)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int pigmentTexLayout [[function_constant(76)]];
constant int pigmentTexLayout_tmp = is_function_constant_defined(pigmentTexLayout) ? pigmentTexLayout : 0;
constant int sc_DepthBufferMode [[function_constant(77)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_RenderingSpace [[function_constant(78)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(79)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(80)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(81)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(82)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(83)]];
constant int sc_StereoRendering_IsClipDistanceEnabled_tmp = is_function_constant_defined(sc_StereoRendering_IsClipDistanceEnabled) ? sc_StereoRendering_IsClipDistanceEnabled : 0;

namespace SNAP_VS {
struct sc_Vertex_t
{
float4 position;
float3 normal;
float3 tangent;
float2 texture0;
float2 texture1;
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
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
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
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float4 pigmentTexSize;
float4 pigmentTexDims;
float4 pigmentTexView;
float3x3 pigmentTexTransform;
float4 pigmentTexUvMinMax;
float4 pigmentTexBorderColor;
float numPigments;
float texWidth;
float texSize;
float mixSteps;
float depthRef;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> intensityTexture [[id(4)]];
texture2d<float> pigmentTex [[id(5)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(16)]];
texture2d<float> sc_RayTracingRayDirection [[id(17)]];
texture2d<float> sc_ScreenTexture [[id(19)]];
sampler intensityTextureSmpSC [[id(22)]];
sampler pigmentTexSmpSC [[id(23)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(27)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(28)]];
sampler sc_ScreenTextureSmpSC [[id(30)]];
constant userUniformsObj* UserUniforms [[id(33)]];
};
struct main_vert_out
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
float4 boneData [[attribute(5)]];
float3 blendShape0Pos [[attribute(6)]];
float3 blendShape1Pos [[attribute(7)]];
float3 blendShape2Pos [[attribute(8)]];
float3 blendShape3Pos [[attribute(9)]];
float3 blendShape4Pos [[attribute(10)]];
float3 blendShape5Pos [[attribute(11)]];
float3 blendShape0Normal [[attribute(12)]];
float3 blendShape1Normal [[attribute(13)]];
float3 blendShape2Normal [[attribute(14)]];
float3 positionNext [[attribute(15)]];
float3 positionPrevious [[attribute(16)]];
float4 strandProperties [[attribute(17)]];
float4 color [[attribute(18)]];
};
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param=float4(in.position.xy,(*sc_set0.UserUniforms).depthRef+(1e-10*in.position.z),1.0+(1e-10*in.position.w));
if (sc_ShaderCacheConstant_tmp!=0)
{
param.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_0=param;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_1=dot(l9_0,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_2=l9_1;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_2;
}
}
float4 l9_3=float4(param.x,-param.y,(param.z*0.5)+(param.w*0.5),param.w);
out.gl_Position=l9_3;
return out;
}
out.PreviewVertexColor=float4(0.5);
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=float4(0.5);
PreviewInfo.Saved=false;
out.PreviewVertexSaved=0.0;
sc_Vertex_t l9_5;
l9_5.position=in.position;
l9_5.normal=in.normal;
l9_5.tangent=in.tangent.xyz;
l9_5.texture0=in.texture0;
l9_5.texture1=in.texture1;
sc_Vertex_t l9_6=l9_5;
sc_Vertex_t param_1=l9_6;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_7=param_1;
param_1=l9_7;
}
sc_Vertex_t l9_8=param_1;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_9=l9_8;
float3 l9_10=in.blendShape0Pos;
float3 l9_11=in.blendShape0Normal;
float l9_12=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_13=l9_9;
float3 l9_14=l9_10;
float l9_15=l9_12;
float3 l9_16=l9_13.position.xyz+(l9_14*l9_15);
l9_13.position=float4(l9_16.x,l9_16.y,l9_16.z,l9_13.position.w);
l9_9=l9_13;
l9_9.normal+=(l9_11*l9_12);
l9_8=l9_9;
sc_Vertex_t l9_17=l9_8;
float3 l9_18=in.blendShape1Pos;
float3 l9_19=in.blendShape1Normal;
float l9_20=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_21=l9_17;
float3 l9_22=l9_18;
float l9_23=l9_20;
float3 l9_24=l9_21.position.xyz+(l9_22*l9_23);
l9_21.position=float4(l9_24.x,l9_24.y,l9_24.z,l9_21.position.w);
l9_17=l9_21;
l9_17.normal+=(l9_19*l9_20);
l9_8=l9_17;
sc_Vertex_t l9_25=l9_8;
float3 l9_26=in.blendShape2Pos;
float3 l9_27=in.blendShape2Normal;
float l9_28=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_29=l9_25;
float3 l9_30=l9_26;
float l9_31=l9_28;
float3 l9_32=l9_29.position.xyz+(l9_30*l9_31);
l9_29.position=float4(l9_32.x,l9_32.y,l9_32.z,l9_29.position.w);
l9_25=l9_29;
l9_25.normal+=(l9_27*l9_28);
l9_8=l9_25;
}
else
{
sc_Vertex_t l9_33=l9_8;
float3 l9_34=in.blendShape0Pos;
float l9_35=(*sc_set0.UserUniforms).weights0.x;
float3 l9_36=l9_33.position.xyz+(l9_34*l9_35);
l9_33.position=float4(l9_36.x,l9_36.y,l9_36.z,l9_33.position.w);
l9_8=l9_33;
sc_Vertex_t l9_37=l9_8;
float3 l9_38=in.blendShape1Pos;
float l9_39=(*sc_set0.UserUniforms).weights0.y;
float3 l9_40=l9_37.position.xyz+(l9_38*l9_39);
l9_37.position=float4(l9_40.x,l9_40.y,l9_40.z,l9_37.position.w);
l9_8=l9_37;
sc_Vertex_t l9_41=l9_8;
float3 l9_42=in.blendShape2Pos;
float l9_43=(*sc_set0.UserUniforms).weights0.z;
float3 l9_44=l9_41.position.xyz+(l9_42*l9_43);
l9_41.position=float4(l9_44.x,l9_44.y,l9_44.z,l9_41.position.w);
l9_8=l9_41;
sc_Vertex_t l9_45=l9_8;
float3 l9_46=in.blendShape3Pos;
float l9_47=(*sc_set0.UserUniforms).weights0.w;
float3 l9_48=l9_45.position.xyz+(l9_46*l9_47);
l9_45.position=float4(l9_48.x,l9_48.y,l9_48.z,l9_45.position.w);
l9_8=l9_45;
sc_Vertex_t l9_49=l9_8;
float3 l9_50=in.blendShape4Pos;
float l9_51=(*sc_set0.UserUniforms).weights1.x;
float3 l9_52=l9_49.position.xyz+(l9_50*l9_51);
l9_49.position=float4(l9_52.x,l9_52.y,l9_52.z,l9_49.position.w);
l9_8=l9_49;
sc_Vertex_t l9_53=l9_8;
float3 l9_54=in.blendShape5Pos;
float l9_55=(*sc_set0.UserUniforms).weights1.y;
float3 l9_56=l9_53.position.xyz+(l9_54*l9_55);
l9_53.position=float4(l9_56.x,l9_56.y,l9_56.z,l9_53.position.w);
l9_8=l9_53;
}
}
param_1=l9_8;
sc_Vertex_t l9_57=param_1;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_58=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_58=float4(1.0,fract(in.boneData.yzw));
l9_58.x-=dot(l9_58.yzw,float3(1.0));
}
float4 l9_59=l9_58;
float4 l9_60=l9_59;
int l9_61=int(in.boneData.x);
int l9_62=int(in.boneData.y);
int l9_63=int(in.boneData.z);
int l9_64=int(in.boneData.w);
int l9_65=l9_61;
float4 l9_66=l9_57.position;
float3 l9_67=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_68=l9_65;
float4 l9_69=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[0];
float4 l9_70=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[1];
float4 l9_71=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[2];
float4 l9_72[3];
l9_72[0]=l9_69;
l9_72[1]=l9_70;
l9_72[2]=l9_71;
l9_67=float3(dot(l9_66,l9_72[0]),dot(l9_66,l9_72[1]),dot(l9_66,l9_72[2]));
}
else
{
l9_67=l9_66.xyz;
}
float3 l9_73=l9_67;
float3 l9_74=l9_73;
float l9_75=l9_60.x;
int l9_76=l9_62;
float4 l9_77=l9_57.position;
float3 l9_78=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_79=l9_76;
float4 l9_80=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[0];
float4 l9_81=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[1];
float4 l9_82=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[2];
float4 l9_83[3];
l9_83[0]=l9_80;
l9_83[1]=l9_81;
l9_83[2]=l9_82;
l9_78=float3(dot(l9_77,l9_83[0]),dot(l9_77,l9_83[1]),dot(l9_77,l9_83[2]));
}
else
{
l9_78=l9_77.xyz;
}
float3 l9_84=l9_78;
float3 l9_85=l9_84;
float l9_86=l9_60.y;
int l9_87=l9_63;
float4 l9_88=l9_57.position;
float3 l9_89=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_90=l9_87;
float4 l9_91=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[0];
float4 l9_92=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[1];
float4 l9_93=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[2];
float4 l9_94[3];
l9_94[0]=l9_91;
l9_94[1]=l9_92;
l9_94[2]=l9_93;
l9_89=float3(dot(l9_88,l9_94[0]),dot(l9_88,l9_94[1]),dot(l9_88,l9_94[2]));
}
else
{
l9_89=l9_88.xyz;
}
float3 l9_95=l9_89;
float3 l9_96=l9_95;
float l9_97=l9_60.z;
int l9_98=l9_64;
float4 l9_99=l9_57.position;
float3 l9_100=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_101=l9_98;
float4 l9_102=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[0];
float4 l9_103=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[1];
float4 l9_104=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[2];
float4 l9_105[3];
l9_105[0]=l9_102;
l9_105[1]=l9_103;
l9_105[2]=l9_104;
l9_100=float3(dot(l9_99,l9_105[0]),dot(l9_99,l9_105[1]),dot(l9_99,l9_105[2]));
}
else
{
l9_100=l9_99.xyz;
}
float3 l9_106=l9_100;
float3 l9_107=(((l9_74*l9_75)+(l9_85*l9_86))+(l9_96*l9_97))+(l9_106*l9_60.w);
l9_57.position=float4(l9_107.x,l9_107.y,l9_107.z,l9_57.position.w);
int l9_108=l9_61;
float3x3 l9_109=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[2].xyz));
float3x3 l9_110=l9_109;
float3x3 l9_111=l9_110;
int l9_112=l9_62;
float3x3 l9_113=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[2].xyz));
float3x3 l9_114=l9_113;
float3x3 l9_115=l9_114;
int l9_116=l9_63;
float3x3 l9_117=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[2].xyz));
float3x3 l9_118=l9_117;
float3x3 l9_119=l9_118;
int l9_120=l9_64;
float3x3 l9_121=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[2].xyz));
float3x3 l9_122=l9_121;
float3x3 l9_123=l9_122;
l9_57.normal=((((l9_111*l9_57.normal)*l9_60.x)+((l9_115*l9_57.normal)*l9_60.y))+((l9_119*l9_57.normal)*l9_60.z))+((l9_123*l9_57.normal)*l9_60.w);
l9_57.tangent=((((l9_111*l9_57.tangent)*l9_60.x)+((l9_115*l9_57.tangent)*l9_60.y))+((l9_119*l9_57.tangent)*l9_60.z))+((l9_123*l9_57.tangent)*l9_60.w);
}
param_1=l9_57;
if (sc_RenderingSpace_tmp==3)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==4)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
out.varPosAndMotion=float4(param_1.position.xyz.x,param_1.position.xyz.y,param_1.position.xyz.z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
float3 l9_124=((*sc_set0.UserUniforms).sc_ModelMatrix*param_1.position).xyz;
out.varPosAndMotion=float4(l9_124.x,l9_124.y,l9_124.z,out.varPosAndMotion.w);
float3 l9_125=(*sc_set0.UserUniforms).sc_NormalMatrix*param_1.normal;
out.varNormalAndMotion=float4(l9_125.x,l9_125.y,l9_125.z,out.varNormalAndMotion.w);
float3 l9_126=(*sc_set0.UserUniforms).sc_NormalMatrix*param_1.tangent;
out.varTangent=float4(l9_126.x,l9_126.y,l9_126.z,out.varTangent.w);
}
}
}
}
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
param_1.texture0.x=1.0-param_1.texture0.x;
}
out.varColor=in.color;
sc_Vertex_t v=param_1;
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_2=v;
float3 param_3=WorldPosition;
float3 param_4=WorldNormal;
float3 param_5=WorldTangent;
float4 param_6=v.position;
out.varPosAndMotion=float4(param_3.x,param_3.y,param_3.z,out.varPosAndMotion.w);
float3 l9_127=normalize(param_4);
out.varNormalAndMotion=float4(l9_127.x,l9_127.y,l9_127.z,out.varNormalAndMotion.w);
float3 l9_128=normalize(param_5);
out.varTangent=float4(l9_128.x,l9_128.y,l9_128.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_129=param_2.position;
float4 l9_130=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_131=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_131=0;
}
else
{
l9_131=gl_InstanceIndex%2;
}
int l9_132=l9_131;
l9_130=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_132]*l9_129;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_133=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_133=0;
}
else
{
l9_133=gl_InstanceIndex%2;
}
int l9_134=l9_133;
l9_130=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_134]*l9_129;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_135=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_135=0;
}
else
{
l9_135=gl_InstanceIndex%2;
}
int l9_136=l9_135;
l9_130=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_136]*l9_129;
}
else
{
l9_130=l9_129;
}
}
}
float4 l9_137=l9_130;
out.varViewSpaceDepth=-l9_137.z;
}
float4 l9_138=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_138=param_6;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_139=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_139=0;
}
else
{
l9_139=gl_InstanceIndex%2;
}
int l9_140=l9_139;
l9_138=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_140]*param_2.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_141=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_141=0;
}
else
{
l9_141=gl_InstanceIndex%2;
}
int l9_142=l9_141;
l9_138=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_142]*float4(out.varPosAndMotion.xyz,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_143=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_143=0;
}
else
{
l9_143=gl_InstanceIndex%2;
}
int l9_144=l9_143;
l9_138=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_144]*float4(out.varPosAndMotion.xyz,1.0);
}
}
}
}
out.varTex01=float4(param_2.texture0,param_2.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_145=param_2.position;
float4 l9_146=l9_145;
if (sc_RenderingSpace_tmp==1)
{
l9_146=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_145;
}
float4 l9_147=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_146;
float2 l9_148=((l9_147.xy/float2(l9_147.w))*0.5)+float2(0.5);
out.varShadowTex=l9_148;
}
float4 l9_149=l9_138;
if (sc_DepthBufferMode_tmp==1)
{
int l9_150=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_150=0;
}
else
{
l9_150=gl_InstanceIndex%2;
}
int l9_151=l9_150;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_151][2].w!=0.0)
{
float l9_152=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_149.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_149.w))*l9_152)-1.0)*l9_149.w;
}
}
float4 l9_153=l9_149;
l9_138=l9_153;
float4 l9_154=l9_138;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_155=l9_154.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_154.w);
l9_154=float4(l9_155.x,l9_155.y,l9_154.z,l9_154.w);
}
float4 l9_156=l9_154;
l9_138=l9_156;
float4 l9_157=l9_138;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_157.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_158=l9_157;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_159=dot(l9_158,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_160=l9_159;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_160;
}
}
float4 l9_161=float4(l9_157.x,-l9_157.y,(l9_157.z*0.5)+(l9_157.w*0.5),l9_157.w);
out.gl_Position=l9_161;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_162=param_2;
sc_Vertex_t l9_163=l9_162;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_164=l9_163;
float3 l9_165=in.blendShape0Pos;
float3 l9_166=in.blendShape0Normal;
float l9_167=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_168=l9_164;
float3 l9_169=l9_165;
float l9_170=l9_167;
float3 l9_171=l9_168.position.xyz+(l9_169*l9_170);
l9_168.position=float4(l9_171.x,l9_171.y,l9_171.z,l9_168.position.w);
l9_164=l9_168;
l9_164.normal+=(l9_166*l9_167);
l9_163=l9_164;
sc_Vertex_t l9_172=l9_163;
float3 l9_173=in.blendShape1Pos;
float3 l9_174=in.blendShape1Normal;
float l9_175=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_176=l9_172;
float3 l9_177=l9_173;
float l9_178=l9_175;
float3 l9_179=l9_176.position.xyz+(l9_177*l9_178);
l9_176.position=float4(l9_179.x,l9_179.y,l9_179.z,l9_176.position.w);
l9_172=l9_176;
l9_172.normal+=(l9_174*l9_175);
l9_163=l9_172;
sc_Vertex_t l9_180=l9_163;
float3 l9_181=in.blendShape2Pos;
float3 l9_182=in.blendShape2Normal;
float l9_183=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_184=l9_180;
float3 l9_185=l9_181;
float l9_186=l9_183;
float3 l9_187=l9_184.position.xyz+(l9_185*l9_186);
l9_184.position=float4(l9_187.x,l9_187.y,l9_187.z,l9_184.position.w);
l9_180=l9_184;
l9_180.normal+=(l9_182*l9_183);
l9_163=l9_180;
}
else
{
sc_Vertex_t l9_188=l9_163;
float3 l9_189=in.blendShape0Pos;
float l9_190=(*sc_set0.UserUniforms).weights0.x;
float3 l9_191=l9_188.position.xyz+(l9_189*l9_190);
l9_188.position=float4(l9_191.x,l9_191.y,l9_191.z,l9_188.position.w);
l9_163=l9_188;
sc_Vertex_t l9_192=l9_163;
float3 l9_193=in.blendShape1Pos;
float l9_194=(*sc_set0.UserUniforms).weights0.y;
float3 l9_195=l9_192.position.xyz+(l9_193*l9_194);
l9_192.position=float4(l9_195.x,l9_195.y,l9_195.z,l9_192.position.w);
l9_163=l9_192;
sc_Vertex_t l9_196=l9_163;
float3 l9_197=in.blendShape2Pos;
float l9_198=(*sc_set0.UserUniforms).weights0.z;
float3 l9_199=l9_196.position.xyz+(l9_197*l9_198);
l9_196.position=float4(l9_199.x,l9_199.y,l9_199.z,l9_196.position.w);
l9_163=l9_196;
sc_Vertex_t l9_200=l9_163;
float3 l9_201=in.blendShape3Pos;
float l9_202=(*sc_set0.UserUniforms).weights0.w;
float3 l9_203=l9_200.position.xyz+(l9_201*l9_202);
l9_200.position=float4(l9_203.x,l9_203.y,l9_203.z,l9_200.position.w);
l9_163=l9_200;
sc_Vertex_t l9_204=l9_163;
float3 l9_205=in.blendShape4Pos;
float l9_206=(*sc_set0.UserUniforms).weights1.x;
float3 l9_207=l9_204.position.xyz+(l9_205*l9_206);
l9_204.position=float4(l9_207.x,l9_207.y,l9_207.z,l9_204.position.w);
l9_163=l9_204;
sc_Vertex_t l9_208=l9_163;
float3 l9_209=in.blendShape5Pos;
float l9_210=(*sc_set0.UserUniforms).weights1.y;
float3 l9_211=l9_208.position.xyz+(l9_209*l9_210);
l9_208.position=float4(l9_211.x,l9_211.y,l9_211.z,l9_208.position.w);
l9_163=l9_208;
}
}
l9_162=l9_163;
sc_Vertex_t l9_212=l9_162;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_213=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_213=float4(1.0,fract(in.boneData.yzw));
l9_213.x-=dot(l9_213.yzw,float3(1.0));
}
float4 l9_214=l9_213;
float4 l9_215=l9_214;
int l9_216=int(in.boneData.x);
int l9_217=int(in.boneData.y);
int l9_218=int(in.boneData.z);
int l9_219=int(in.boneData.w);
int l9_220=l9_216;
float4 l9_221=l9_212.position;
float3 l9_222=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_223=l9_220;
float4 l9_224=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[0];
float4 l9_225=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[1];
float4 l9_226=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[2];
float4 l9_227[3];
l9_227[0]=l9_224;
l9_227[1]=l9_225;
l9_227[2]=l9_226;
l9_222=float3(dot(l9_221,l9_227[0]),dot(l9_221,l9_227[1]),dot(l9_221,l9_227[2]));
}
else
{
l9_222=l9_221.xyz;
}
float3 l9_228=l9_222;
float3 l9_229=l9_228;
float l9_230=l9_215.x;
int l9_231=l9_217;
float4 l9_232=l9_212.position;
float3 l9_233=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_234=l9_231;
float4 l9_235=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[0];
float4 l9_236=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[1];
float4 l9_237=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[2];
float4 l9_238[3];
l9_238[0]=l9_235;
l9_238[1]=l9_236;
l9_238[2]=l9_237;
l9_233=float3(dot(l9_232,l9_238[0]),dot(l9_232,l9_238[1]),dot(l9_232,l9_238[2]));
}
else
{
l9_233=l9_232.xyz;
}
float3 l9_239=l9_233;
float3 l9_240=l9_239;
float l9_241=l9_215.y;
int l9_242=l9_218;
float4 l9_243=l9_212.position;
float3 l9_244=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_245=l9_242;
float4 l9_246=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[0];
float4 l9_247=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[1];
float4 l9_248=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[2];
float4 l9_249[3];
l9_249[0]=l9_246;
l9_249[1]=l9_247;
l9_249[2]=l9_248;
l9_244=float3(dot(l9_243,l9_249[0]),dot(l9_243,l9_249[1]),dot(l9_243,l9_249[2]));
}
else
{
l9_244=l9_243.xyz;
}
float3 l9_250=l9_244;
float3 l9_251=l9_250;
float l9_252=l9_215.z;
int l9_253=l9_219;
float4 l9_254=l9_212.position;
float3 l9_255=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_256=l9_253;
float4 l9_257=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[0];
float4 l9_258=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[1];
float4 l9_259=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[2];
float4 l9_260[3];
l9_260[0]=l9_257;
l9_260[1]=l9_258;
l9_260[2]=l9_259;
l9_255=float3(dot(l9_254,l9_260[0]),dot(l9_254,l9_260[1]),dot(l9_254,l9_260[2]));
}
else
{
l9_255=l9_254.xyz;
}
float3 l9_261=l9_255;
float3 l9_262=(((l9_229*l9_230)+(l9_240*l9_241))+(l9_251*l9_252))+(l9_261*l9_215.w);
l9_212.position=float4(l9_262.x,l9_262.y,l9_262.z,l9_212.position.w);
int l9_263=l9_216;
float3x3 l9_264=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[2].xyz));
float3x3 l9_265=l9_264;
float3x3 l9_266=l9_265;
int l9_267=l9_217;
float3x3 l9_268=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[2].xyz));
float3x3 l9_269=l9_268;
float3x3 l9_270=l9_269;
int l9_271=l9_218;
float3x3 l9_272=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[2].xyz));
float3x3 l9_273=l9_272;
float3x3 l9_274=l9_273;
int l9_275=l9_219;
float3x3 l9_276=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[2].xyz));
float3x3 l9_277=l9_276;
float3x3 l9_278=l9_277;
l9_212.normal=((((l9_266*l9_212.normal)*l9_215.x)+((l9_270*l9_212.normal)*l9_215.y))+((l9_274*l9_212.normal)*l9_215.z))+((l9_278*l9_212.normal)*l9_215.w);
l9_212.tangent=((((l9_266*l9_212.tangent)*l9_215.x)+((l9_270*l9_212.tangent)*l9_215.y))+((l9_274*l9_212.tangent)*l9_215.z))+((l9_278*l9_212.tangent)*l9_215.w);
}
l9_162=l9_212;
float l9_279=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_280=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_281=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_282=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_283=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_284=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_285=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_286=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_287=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_288=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_289=l9_279/l9_280;
int l9_290=gl_InstanceIndex;
int l9_291=l9_290;
l9_162.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_162.position;
float3 l9_292=l9_162.position.xyz;
float3 l9_293=float3(float(l9_291%int(l9_281))*l9_279,float(l9_291/int(l9_281))*l9_279,(float(l9_291)*l9_289)+l9_286);
float3 l9_294=l9_292+l9_293;
float4 l9_295=float4(l9_294-l9_288,1.0);
float l9_296=l9_282;
float l9_297=l9_283;
float l9_298=l9_284;
float l9_299=l9_285;
float l9_300=l9_286;
float l9_301=l9_287;
float4x4 l9_302=float4x4(float4(2.0/(l9_297-l9_296),0.0,0.0,(-(l9_297+l9_296))/(l9_297-l9_296)),float4(0.0,2.0/(l9_299-l9_298),0.0,(-(l9_299+l9_298))/(l9_299-l9_298)),float4(0.0,0.0,(-2.0)/(l9_301-l9_300),(-(l9_301+l9_300))/(l9_301-l9_300)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_303=l9_302;
float4 l9_304=l9_303*l9_295;
l9_304.w=1.0;
out.varScreenPos=l9_304;
float4 l9_305=l9_304*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_305.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_306=l9_305;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_307=dot(l9_306,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_308=l9_307;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_308;
}
}
float4 l9_309=float4(l9_305.x,-l9_305.y,(l9_305.z*0.5)+(l9_305.w*0.5),l9_305.w);
out.gl_Position=l9_309;
param_2=l9_162;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_310=param_2;
sc_Vertex_t l9_311=l9_310;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_312=l9_311;
float3 l9_313=in.blendShape0Pos;
float3 l9_314=in.blendShape0Normal;
float l9_315=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_316=l9_312;
float3 l9_317=l9_313;
float l9_318=l9_315;
float3 l9_319=l9_316.position.xyz+(l9_317*l9_318);
l9_316.position=float4(l9_319.x,l9_319.y,l9_319.z,l9_316.position.w);
l9_312=l9_316;
l9_312.normal+=(l9_314*l9_315);
l9_311=l9_312;
sc_Vertex_t l9_320=l9_311;
float3 l9_321=in.blendShape1Pos;
float3 l9_322=in.blendShape1Normal;
float l9_323=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_324=l9_320;
float3 l9_325=l9_321;
float l9_326=l9_323;
float3 l9_327=l9_324.position.xyz+(l9_325*l9_326);
l9_324.position=float4(l9_327.x,l9_327.y,l9_327.z,l9_324.position.w);
l9_320=l9_324;
l9_320.normal+=(l9_322*l9_323);
l9_311=l9_320;
sc_Vertex_t l9_328=l9_311;
float3 l9_329=in.blendShape2Pos;
float3 l9_330=in.blendShape2Normal;
float l9_331=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_332=l9_328;
float3 l9_333=l9_329;
float l9_334=l9_331;
float3 l9_335=l9_332.position.xyz+(l9_333*l9_334);
l9_332.position=float4(l9_335.x,l9_335.y,l9_335.z,l9_332.position.w);
l9_328=l9_332;
l9_328.normal+=(l9_330*l9_331);
l9_311=l9_328;
}
else
{
sc_Vertex_t l9_336=l9_311;
float3 l9_337=in.blendShape0Pos;
float l9_338=(*sc_set0.UserUniforms).weights0.x;
float3 l9_339=l9_336.position.xyz+(l9_337*l9_338);
l9_336.position=float4(l9_339.x,l9_339.y,l9_339.z,l9_336.position.w);
l9_311=l9_336;
sc_Vertex_t l9_340=l9_311;
float3 l9_341=in.blendShape1Pos;
float l9_342=(*sc_set0.UserUniforms).weights0.y;
float3 l9_343=l9_340.position.xyz+(l9_341*l9_342);
l9_340.position=float4(l9_343.x,l9_343.y,l9_343.z,l9_340.position.w);
l9_311=l9_340;
sc_Vertex_t l9_344=l9_311;
float3 l9_345=in.blendShape2Pos;
float l9_346=(*sc_set0.UserUniforms).weights0.z;
float3 l9_347=l9_344.position.xyz+(l9_345*l9_346);
l9_344.position=float4(l9_347.x,l9_347.y,l9_347.z,l9_344.position.w);
l9_311=l9_344;
sc_Vertex_t l9_348=l9_311;
float3 l9_349=in.blendShape3Pos;
float l9_350=(*sc_set0.UserUniforms).weights0.w;
float3 l9_351=l9_348.position.xyz+(l9_349*l9_350);
l9_348.position=float4(l9_351.x,l9_351.y,l9_351.z,l9_348.position.w);
l9_311=l9_348;
sc_Vertex_t l9_352=l9_311;
float3 l9_353=in.blendShape4Pos;
float l9_354=(*sc_set0.UserUniforms).weights1.x;
float3 l9_355=l9_352.position.xyz+(l9_353*l9_354);
l9_352.position=float4(l9_355.x,l9_355.y,l9_355.z,l9_352.position.w);
l9_311=l9_352;
sc_Vertex_t l9_356=l9_311;
float3 l9_357=in.blendShape5Pos;
float l9_358=(*sc_set0.UserUniforms).weights1.y;
float3 l9_359=l9_356.position.xyz+(l9_357*l9_358);
l9_356.position=float4(l9_359.x,l9_359.y,l9_359.z,l9_356.position.w);
l9_311=l9_356;
}
}
l9_310=l9_311;
sc_Vertex_t l9_360=l9_310;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_361=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_361=float4(1.0,fract(in.boneData.yzw));
l9_361.x-=dot(l9_361.yzw,float3(1.0));
}
float4 l9_362=l9_361;
float4 l9_363=l9_362;
int l9_364=int(in.boneData.x);
int l9_365=int(in.boneData.y);
int l9_366=int(in.boneData.z);
int l9_367=int(in.boneData.w);
int l9_368=l9_364;
float4 l9_369=l9_360.position;
float3 l9_370=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_371=l9_368;
float4 l9_372=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[0];
float4 l9_373=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[1];
float4 l9_374=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[2];
float4 l9_375[3];
l9_375[0]=l9_372;
l9_375[1]=l9_373;
l9_375[2]=l9_374;
l9_370=float3(dot(l9_369,l9_375[0]),dot(l9_369,l9_375[1]),dot(l9_369,l9_375[2]));
}
else
{
l9_370=l9_369.xyz;
}
float3 l9_376=l9_370;
float3 l9_377=l9_376;
float l9_378=l9_363.x;
int l9_379=l9_365;
float4 l9_380=l9_360.position;
float3 l9_381=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_382=l9_379;
float4 l9_383=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[0];
float4 l9_384=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[1];
float4 l9_385=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[2];
float4 l9_386[3];
l9_386[0]=l9_383;
l9_386[1]=l9_384;
l9_386[2]=l9_385;
l9_381=float3(dot(l9_380,l9_386[0]),dot(l9_380,l9_386[1]),dot(l9_380,l9_386[2]));
}
else
{
l9_381=l9_380.xyz;
}
float3 l9_387=l9_381;
float3 l9_388=l9_387;
float l9_389=l9_363.y;
int l9_390=l9_366;
float4 l9_391=l9_360.position;
float3 l9_392=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_393=l9_390;
float4 l9_394=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[0];
float4 l9_395=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[1];
float4 l9_396=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[2];
float4 l9_397[3];
l9_397[0]=l9_394;
l9_397[1]=l9_395;
l9_397[2]=l9_396;
l9_392=float3(dot(l9_391,l9_397[0]),dot(l9_391,l9_397[1]),dot(l9_391,l9_397[2]));
}
else
{
l9_392=l9_391.xyz;
}
float3 l9_398=l9_392;
float3 l9_399=l9_398;
float l9_400=l9_363.z;
int l9_401=l9_367;
float4 l9_402=l9_360.position;
float3 l9_403=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_404=l9_401;
float4 l9_405=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[0];
float4 l9_406=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[1];
float4 l9_407=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[2];
float4 l9_408[3];
l9_408[0]=l9_405;
l9_408[1]=l9_406;
l9_408[2]=l9_407;
l9_403=float3(dot(l9_402,l9_408[0]),dot(l9_402,l9_408[1]),dot(l9_402,l9_408[2]));
}
else
{
l9_403=l9_402.xyz;
}
float3 l9_409=l9_403;
float3 l9_410=(((l9_377*l9_378)+(l9_388*l9_389))+(l9_399*l9_400))+(l9_409*l9_363.w);
l9_360.position=float4(l9_410.x,l9_410.y,l9_410.z,l9_360.position.w);
int l9_411=l9_364;
float3x3 l9_412=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[2].xyz));
float3x3 l9_413=l9_412;
float3x3 l9_414=l9_413;
int l9_415=l9_365;
float3x3 l9_416=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[2].xyz));
float3x3 l9_417=l9_416;
float3x3 l9_418=l9_417;
int l9_419=l9_366;
float3x3 l9_420=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[2].xyz));
float3x3 l9_421=l9_420;
float3x3 l9_422=l9_421;
int l9_423=l9_367;
float3x3 l9_424=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[2].xyz));
float3x3 l9_425=l9_424;
float3x3 l9_426=l9_425;
l9_360.normal=((((l9_414*l9_360.normal)*l9_363.x)+((l9_418*l9_360.normal)*l9_363.y))+((l9_422*l9_360.normal)*l9_363.z))+((l9_426*l9_360.normal)*l9_363.w);
l9_360.tangent=((((l9_414*l9_360.tangent)*l9_363.x)+((l9_418*l9_360.tangent)*l9_363.y))+((l9_422*l9_360.tangent)*l9_363.z))+((l9_426*l9_360.tangent)*l9_363.w);
}
l9_310=l9_360;
float3 l9_427=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_428=((l9_310.position.xy/float2(l9_310.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_428.x,l9_428.y,out.varTex01.z,out.varTex01.w);
l9_310.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_310.position;
float3 l9_429=l9_310.position.xyz-l9_427;
l9_310.position=float4(l9_429.x,l9_429.y,l9_429.z,l9_310.position.w);
out.varPosAndMotion=float4(l9_310.position.xyz.x,l9_310.position.xyz.y,l9_310.position.xyz.z,out.varPosAndMotion.w);
float3 l9_430=normalize(l9_310.normal);
out.varNormalAndMotion=float4(l9_430.x,l9_430.y,l9_430.z,out.varNormalAndMotion.w);
float l9_431=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_432=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_433=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_434=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_435=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_436=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_437=l9_431;
float l9_438=l9_432;
float l9_439=l9_433;
float l9_440=l9_434;
float l9_441=l9_435;
float l9_442=l9_436;
float4x4 l9_443=float4x4(float4(2.0/(l9_438-l9_437),0.0,0.0,(-(l9_438+l9_437))/(l9_438-l9_437)),float4(0.0,2.0/(l9_440-l9_439),0.0,(-(l9_440+l9_439))/(l9_440-l9_439)),float4(0.0,0.0,(-2.0)/(l9_442-l9_441),(-(l9_442+l9_441))/(l9_442-l9_441)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_444=l9_443;
float4 l9_445=float4(0.0);
float3 l9_446=(l9_444*l9_310.position).xyz;
l9_445=float4(l9_446.x,l9_446.y,l9_446.z,l9_445.w);
l9_445.w=1.0;
out.varScreenPos=l9_445;
float4 l9_447=l9_445*1.0;
float4 l9_448=l9_447;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_448.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_449=l9_448;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_450=dot(l9_449,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_451=l9_450;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_451;
}
}
float4 l9_452=float4(l9_448.x,-l9_448.y,(l9_448.z*0.5)+(l9_448.w*0.5),l9_448.w);
out.gl_Position=l9_452;
param_2=l9_310;
}
}
v=param_2;
float3 param_7=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_453=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_7,1.0);
float3 l9_454=param_7;
float3 l9_455=l9_453.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_456=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_456=0;
}
else
{
l9_456=gl_InstanceIndex%2;
}
int l9_457=l9_456;
float4 l9_458=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_457]*float4(l9_454,1.0);
float2 l9_459=l9_458.xy/float2(l9_458.w);
l9_458=float4(l9_459.x,l9_459.y,l9_458.z,l9_458.w);
int l9_460=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_460=0;
}
else
{
l9_460=gl_InstanceIndex%2;
}
int l9_461=l9_460;
float4 l9_462=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_461]*float4(l9_455,1.0);
float2 l9_463=l9_462.xy/float2(l9_462.w);
l9_462=float4(l9_463.x,l9_463.y,l9_462.z,l9_462.w);
float2 l9_464=(l9_458.xy-l9_462.xy)*0.5;
out.varPosAndMotion.w=l9_464.x;
out.varNormalAndMotion.w=l9_464.y;
}
}
if (PreviewInfo.Saved)
{
out.PreviewVertexColor=float4(PreviewInfo.Color.xyz,1.0);
out.PreviewVertexSaved=1.0;
}
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct sc_RayTracingHitPayload
{
float3 viewDirWS;
float3 positionWS;
float3 normalWS;
float4 tangentWS;
float4 color;
float2 uv0;
float2 uv1;
float2 uv2;
float2 uv3;
uint2 id;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float2 gScreenCoord;
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
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
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
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float4 pigmentTexSize;
float4 pigmentTexDims;
float4 pigmentTexView;
float3x3 pigmentTexTransform;
float4 pigmentTexUvMinMax;
float4 pigmentTexBorderColor;
float numPigments;
float texWidth;
float texSize;
float mixSteps;
float depthRef;
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> intensityTexture [[id(4)]];
texture2d<float> pigmentTex [[id(5)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(16)]];
texture2d<float> sc_RayTracingRayDirection [[id(17)]];
texture2d<float> sc_ScreenTexture [[id(19)]];
sampler intensityTextureSmpSC [[id(22)]];
sampler pigmentTexSmpSC [[id(23)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(27)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(28)]];
sampler sc_ScreenTextureSmpSC [[id(30)]];
constant userUniformsObj* UserUniforms [[id(33)]];
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
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
sc_RayTracingHitPayload sc_RayTracingEvaluateHitPayload(thread const int2& screenPos,constant userUniformsObj& UserUniforms,const device sc_RayTracingCasterVertexBuffer_obj& sc_RayTracingCasterVertexBuffer,const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj& sc_RayTracingCasterNonAnimatedVertexBuffer,const device sc_RayTracingCasterIndexBuffer_obj& sc_RayTracingCasterIndexBuffer,thread texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric,thread sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC,thread texture2d<float> sc_RayTracingRayDirection,thread sampler sc_RayTracingRayDirectionSmpSC)
{
uint4 idAndBarycentric=sc_RayTracingHitCasterIdAndBarycentric.read(uint2(screenPos),0);
sc_RayTracingHitPayload rhp;
rhp.id=idAndBarycentric.xy;
if (rhp.id.x!=(UserUniforms.sc_RayTracingCasterConfiguration.y&65535u))
{
return rhp;
}
float2 brcVW=float2(as_type<half2>(idAndBarycentric.z|(idAndBarycentric.w<<uint(16))));
float3 brc=float3((1.0-brcVW.x)-brcVW.y,brcVW);
float2 param=sc_RayTracingRayDirection.read(uint2(screenPos),0).xy;
float3 l9_0=float3(param.x,param.y,(1.0-abs(param.x))-abs(param.y));
float l9_1=fast::clamp(-l9_0.z,0.0,1.0);
float l9_2;
if (l9_0.x>=0.0)
{
l9_2=-l9_1;
}
else
{
l9_2=l9_1;
}
float l9_3=l9_2;
float l9_4;
if (l9_0.y>=0.0)
{
l9_4=-l9_1;
}
else
{
l9_4=l9_1;
}
float2 l9_5=l9_0.xy+float2(l9_3,l9_4);
l9_0=float3(l9_5.x,l9_5.y,l9_0.z);
float3 l9_6=normalize(l9_0);
float3 rayDir=l9_6;
rhp.viewDirWS=-rayDir;
uint param_1=rhp.id.y;
uint l9_7=min(param_1,UserUniforms.sc_RayTracingCasterConfiguration.z);
uint l9_8=l9_7*6u;
uint l9_9=l9_8&4294967292u;
uint4 l9_10=(uint4(uint2(sc_RayTracingCasterIndexBuffer.sc_RayTracingCasterTriangles[l9_9/4u]),uint2(sc_RayTracingCasterIndexBuffer.sc_RayTracingCasterTriangles[(l9_9/4u)+1u]))&uint4(65535u,4294967295u,65535u,4294967295u))>>uint4(0u,16u,0u,16u);
uint3 l9_11;
if (l9_8==l9_9)
{
l9_11=l9_10.xyz;
}
else
{
l9_11=l9_10.yzw;
}
uint3 l9_12=l9_11;
uint3 i=l9_12;
if (UserUniforms.sc_RayTracingCasterConfiguration.x==2u)
{
float3 param_2=brc;
uint3 param_3=i;
uint param_4=0u;
uint3 l9_13=uint3((param_3*uint3(6u))+uint3(param_4));
uint l9_14=l9_13.x;
float3 l9_15=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14+2u]);
uint l9_16=l9_13.y;
float3 l9_17=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16+2u]);
uint l9_18=l9_13.z;
float3 l9_19=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18+2u]);
float3 l9_20=((l9_15*param_2.x)+(l9_17*param_2.y))+(l9_19*param_2.z);
rhp.positionWS=l9_20;
}
else
{
float3 param_5=brc;
uint3 param_6=i;
uint3 l9_21=uint3((param_6.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x,(param_6.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x,(param_6.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x);
float3 l9_22=float3(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.x==5u)
{
uint l9_23=l9_21.x;
float3 l9_24=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23+2u]);
uint l9_25=l9_21.y;
float3 l9_26=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25+2u]);
uint l9_27=l9_21.z;
float3 l9_28=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27+2u]);
l9_22=((l9_24*param_5.x)+(l9_26*param_5.y))+(l9_28*param_5.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.x==6u)
{
uint l9_29=l9_21.x;
float3 l9_30=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_29]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_29+1u]))).x);
uint l9_31=l9_21.y;
float3 l9_32=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_31]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_31+1u]))).x);
uint l9_33=l9_21.z;
float3 l9_34=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_33]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_33+1u]))).x);
l9_22=((l9_30*param_5.x)+(l9_32*param_5.y))+(l9_34*param_5.z);
}
else
{
l9_22=float3(1.0,0.0,0.0);
}
}
float3 l9_35=l9_22;
float3 positionOS=l9_35;
rhp.positionWS=(UserUniforms.sc_ModelMatrix*float4(positionOS,1.0)).xyz;
}
if (UserUniforms.sc_RayTracingCasterOffsetPNTC.y>0u)
{
if (UserUniforms.sc_RayTracingCasterConfiguration.x==2u)
{
float3 param_7=brc;
uint3 param_8=i;
uint param_9=3u;
uint3 l9_36=uint3((param_8*uint3(6u))+uint3(param_9));
uint l9_37=l9_36.x;
float3 l9_38=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37+2u]);
uint l9_39=l9_36.y;
float3 l9_40=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39+2u]);
uint l9_41=l9_36.z;
float3 l9_42=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41+2u]);
float3 l9_43=((l9_38*param_7.x)+(l9_40*param_7.y))+(l9_42*param_7.z);
rhp.normalWS=l9_43;
}
else
{
float3 param_10=brc;
uint3 param_11=i;
uint3 l9_44=uint3((param_11.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y,(param_11.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y,(param_11.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y);
float3 l9_45=float3(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.y==5u)
{
uint l9_46=l9_44.x;
float3 l9_47=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46+2u]);
uint l9_48=l9_44.y;
float3 l9_49=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48+2u]);
uint l9_50=l9_44.z;
float3 l9_51=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50+2u]);
l9_45=((l9_47*param_10.x)+(l9_49*param_10.y))+(l9_51*param_10.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.y==6u)
{
uint l9_52=l9_44.x;
float3 l9_53=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_52]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_52+1u]))).x);
uint l9_54=l9_44.y;
float3 l9_55=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_54]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_54+1u]))).x);
uint l9_56=l9_44.z;
float3 l9_57=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_56]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_56+1u]))).x);
l9_45=((l9_53*param_10.x)+(l9_55*param_10.y))+(l9_57*param_10.z);
}
else
{
l9_45=float3(1.0,0.0,0.0);
}
}
float3 l9_58=l9_45;
float3 normalOS=l9_58;
rhp.normalWS=normalize(UserUniforms.sc_NormalMatrix*normalOS);
}
}
else
{
rhp.normalWS=float3(1.0,0.0,0.0);
}
bool l9_59=!(UserUniforms.sc_RayTracingCasterConfiguration.x==2u);
bool l9_60;
if (l9_59)
{
l9_60=UserUniforms.sc_RayTracingCasterOffsetPNTC.z>0u;
}
else
{
l9_60=l9_59;
}
if (l9_60)
{
float3 param_12=brc;
uint3 param_13=i;
uint3 l9_61=uint3((param_13.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z,(param_13.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z,(param_13.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z);
float4 l9_62=float4(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==5u)
{
uint l9_63=l9_61.x;
float4 l9_64=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+3u]);
uint l9_65=l9_61.y;
float4 l9_66=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+3u]);
uint l9_67=l9_61.z;
float4 l9_68=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+3u]);
l9_62=((l9_64*param_12.x)+(l9_66*param_12.y))+(l9_68*param_12.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==6u)
{
uint l9_69=l9_61.x;
float4 l9_70=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_69]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_69+1u]))));
uint l9_71=l9_61.y;
float4 l9_72=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_71]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_71+1u]))));
uint l9_73=l9_61.z;
float4 l9_74=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_73]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_73+1u]))));
l9_62=((l9_70*param_12.x)+(l9_72*param_12.y))+(l9_74*param_12.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==2u)
{
uint l9_75=l9_61.x;
uint l9_76=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_75]);
uint l9_77=l9_76&255u;
uint l9_78=(l9_76>>uint(8))&255u;
uint l9_79=(l9_76>>uint(16))&255u;
uint l9_80=(l9_76>>uint(24))&255u;
float4 l9_81=float4(float(l9_77),float(l9_78),float(l9_79),float(l9_80))/float4(255.0);
uint l9_82=l9_61.y;
uint l9_83=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_82]);
uint l9_84=l9_83&255u;
uint l9_85=(l9_83>>uint(8))&255u;
uint l9_86=(l9_83>>uint(16))&255u;
uint l9_87=(l9_83>>uint(24))&255u;
float4 l9_88=float4(float(l9_84),float(l9_85),float(l9_86),float(l9_87))/float4(255.0);
uint l9_89=l9_61.z;
uint l9_90=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_89]);
uint l9_91=l9_90&255u;
uint l9_92=(l9_90>>uint(8))&255u;
uint l9_93=(l9_90>>uint(16))&255u;
uint l9_94=(l9_90>>uint(24))&255u;
float4 l9_95=float4(float(l9_91),float(l9_92),float(l9_93),float(l9_94))/float4(255.0);
l9_62=((l9_81*param_12.x)+(l9_88*param_12.y))+(l9_95*param_12.z);
}
else
{
l9_62=float4(1.0,0.0,0.0,0.0);
}
}
}
float4 l9_96=l9_62;
float4 tangentOS=l9_96;
float3 tangentWS=normalize(UserUniforms.sc_NormalMatrix*tangentOS.xyz);
rhp.tangentWS=float4(tangentWS,tangentOS.w);
}
else
{
rhp.tangentWS=float4(1.0,0.0,0.0,1.0);
}
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w>0u)
{
float3 param_14=brc;
uint3 param_15=i;
uint3 l9_97=uint3((param_15.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w,(param_15.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w,(param_15.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w);
float4 l9_98=float4(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==5u)
{
uint l9_99=l9_97.x;
float4 l9_100=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+3u]);
uint l9_101=l9_97.y;
float4 l9_102=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+3u]);
uint l9_103=l9_97.z;
float4 l9_104=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+3u]);
l9_98=((l9_100*param_14.x)+(l9_102*param_14.y))+(l9_104*param_14.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==6u)
{
uint l9_105=l9_97.x;
float4 l9_106=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_105]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_105+1u]))));
uint l9_107=l9_97.y;
float4 l9_108=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_107]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_107+1u]))));
uint l9_109=l9_97.z;
float4 l9_110=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_109]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_109+1u]))));
l9_98=((l9_106*param_14.x)+(l9_108*param_14.y))+(l9_110*param_14.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==2u)
{
uint l9_111=l9_97.x;
uint l9_112=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_111]);
uint l9_113=l9_112&255u;
uint l9_114=(l9_112>>uint(8))&255u;
uint l9_115=(l9_112>>uint(16))&255u;
uint l9_116=(l9_112>>uint(24))&255u;
float4 l9_117=float4(float(l9_113),float(l9_114),float(l9_115),float(l9_116))/float4(255.0);
uint l9_118=l9_97.y;
uint l9_119=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_118]);
uint l9_120=l9_119&255u;
uint l9_121=(l9_119>>uint(8))&255u;
uint l9_122=(l9_119>>uint(16))&255u;
uint l9_123=(l9_119>>uint(24))&255u;
float4 l9_124=float4(float(l9_120),float(l9_121),float(l9_122),float(l9_123))/float4(255.0);
uint l9_125=l9_97.z;
uint l9_126=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_125]);
uint l9_127=l9_126&255u;
uint l9_128=(l9_126>>uint(8))&255u;
uint l9_129=(l9_126>>uint(16))&255u;
uint l9_130=(l9_126>>uint(24))&255u;
float4 l9_131=float4(float(l9_127),float(l9_128),float(l9_129),float(l9_130))/float4(255.0);
l9_98=((l9_117*param_14.x)+(l9_124*param_14.y))+(l9_131*param_14.z);
}
else
{
l9_98=float4(1.0,0.0,0.0,0.0);
}
}
}
float4 l9_132=l9_98;
rhp.color=l9_132;
}
float2 dummyRedBlack=float2(dot(brc,float3(uint3(1u)-(i%uint3(2u)))),0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.x>0u)
{
float3 param_16=brc;
uint3 param_17=i;
uint3 l9_133=uint3((param_17.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x,(param_17.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x,(param_17.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x);
float2 l9_134=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.x==5u)
{
uint l9_135=l9_133.x;
float2 l9_136=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_135],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_135+1u]);
uint l9_137=l9_133.y;
float2 l9_138=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_137],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_137+1u]);
uint l9_139=l9_133.z;
float2 l9_140=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_139],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_139+1u]);
l9_134=((l9_136*param_16.x)+(l9_138*param_16.y))+(l9_140*param_16.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.x==6u)
{
uint l9_141=l9_133.x;
float2 l9_142=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_141])));
uint l9_143=l9_133.y;
float2 l9_144=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_143])));
uint l9_145=l9_133.z;
float2 l9_146=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_145])));
l9_134=((l9_142*param_16.x)+(l9_144*param_16.y))+(l9_146*param_16.z);
}
else
{
l9_134=float2(1.0,0.0);
}
}
float2 l9_147=l9_134;
rhp.uv0=l9_147;
}
else
{
rhp.uv0=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.y>0u)
{
float3 param_18=brc;
uint3 param_19=i;
uint3 l9_148=uint3((param_19.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y,(param_19.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y,(param_19.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y);
float2 l9_149=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.y==5u)
{
uint l9_150=l9_148.x;
float2 l9_151=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_150],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_150+1u]);
uint l9_152=l9_148.y;
float2 l9_153=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_152],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_152+1u]);
uint l9_154=l9_148.z;
float2 l9_155=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_154],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_154+1u]);
l9_149=((l9_151*param_18.x)+(l9_153*param_18.y))+(l9_155*param_18.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.y==6u)
{
uint l9_156=l9_148.x;
float2 l9_157=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_156])));
uint l9_158=l9_148.y;
float2 l9_159=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_158])));
uint l9_160=l9_148.z;
float2 l9_161=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_160])));
l9_149=((l9_157*param_18.x)+(l9_159*param_18.y))+(l9_161*param_18.z);
}
else
{
l9_149=float2(1.0,0.0);
}
}
float2 l9_162=l9_149;
rhp.uv1=l9_162;
}
else
{
rhp.uv1=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.z>0u)
{
float3 param_20=brc;
uint3 param_21=i;
uint3 l9_163=uint3((param_21.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z,(param_21.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z,(param_21.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z);
float2 l9_164=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.z==5u)
{
uint l9_165=l9_163.x;
float2 l9_166=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_165],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_165+1u]);
uint l9_167=l9_163.y;
float2 l9_168=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_167],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_167+1u]);
uint l9_169=l9_163.z;
float2 l9_170=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_169],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_169+1u]);
l9_164=((l9_166*param_20.x)+(l9_168*param_20.y))+(l9_170*param_20.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.z==6u)
{
uint l9_171=l9_163.x;
float2 l9_172=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_171])));
uint l9_173=l9_163.y;
float2 l9_174=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_173])));
uint l9_175=l9_163.z;
float2 l9_176=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_175])));
l9_164=((l9_172*param_20.x)+(l9_174*param_20.y))+(l9_176*param_20.z);
}
else
{
l9_164=float2(1.0,0.0);
}
}
float2 l9_177=l9_164;
rhp.uv2=l9_177;
}
else
{
rhp.uv2=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.w>0u)
{
float3 param_22=brc;
uint3 param_23=i;
uint3 l9_178=uint3((param_23.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w,(param_23.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w,(param_23.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w);
float2 l9_179=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.w==5u)
{
uint l9_180=l9_178.x;
float2 l9_181=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_180],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_180+1u]);
uint l9_182=l9_178.y;
float2 l9_183=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_182],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_182+1u]);
uint l9_184=l9_178.z;
float2 l9_185=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_184],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_184+1u]);
l9_179=((l9_181*param_22.x)+(l9_183*param_22.y))+(l9_185*param_22.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.w==6u)
{
uint l9_186=l9_178.x;
float2 l9_187=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_186])));
uint l9_188=l9_178.y;
float2 l9_189=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_188])));
uint l9_190=l9_178.z;
float2 l9_191=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_190])));
l9_179=((l9_187*param_22.x)+(l9_189*param_22.y))+(l9_191*param_22.z);
}
else
{
l9_179=float2(1.0,0.0);
}
}
float2 l9_192=l9_179;
rhp.uv3=l9_192;
}
else
{
rhp.uv3=dummyRedBlack;
}
return rhp;
}
float transformSingleColor(thread const float& original,thread const float& intMap,thread const float& target)
{
if (((int(BLEND_MODE_REALISTIC_tmp)!=0)||(int(BLEND_MODE_FORGRAY_tmp)!=0))||(int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
return original/pow(1.0-target,intMap);
}
else
{
if ((int(BLEND_MODE_DIVISION_tmp)!=0))
{
return original/(1.0-target);
}
else
{
if ((int(BLEND_MODE_BRIGHT_tmp)!=0))
{
return original/pow(1.0-target,2.0-(2.0*original));
}
}
}
return 0.0;
}
float3 transformColor(thread const float& yValue,thread const float3& original,thread const float3& target,thread const float& weight,thread const float& intMap)
{
if ((int(BLEND_MODE_INTENSE_tmp)!=0))
{
float3 param=original;
float3 l9_0=param;
float4 l9_1;
if (l9_0.y<l9_0.z)
{
l9_1=float4(l9_0.zy,-1.0,0.66666669);
}
else
{
l9_1=float4(l9_0.yz,0.0,-0.33333334);
}
float4 l9_2=l9_1;
float4 l9_3;
if (l9_0.x<l9_2.x)
{
l9_3=float4(l9_2.xyw,l9_0.x);
}
else
{
l9_3=float4(l9_0.x,l9_2.yzx);
}
float4 l9_4=l9_3;
float l9_5=l9_4.x-fast::min(l9_4.w,l9_4.y);
float l9_6=abs(((l9_4.w-l9_4.y)/((6.0*l9_5)+1e-07))+l9_4.z);
float l9_7=l9_4.x;
float3 l9_8=float3(l9_6,l9_5,l9_7);
float3 l9_9=l9_8;
float l9_10=l9_9.z-(l9_9.y*0.5);
float l9_11=l9_9.y/((1.0-abs((2.0*l9_10)-1.0))+1e-07);
float3 l9_12=float3(l9_9.x,l9_11,l9_10);
float3 hslOrig=l9_12;
float3 res=float3(0.0);
res.x=target.x;
res.y=target.y;
res.z=hslOrig.z;
float3 param_1=res;
float l9_13=param_1.x;
float l9_14=abs((6.0*l9_13)-3.0)-1.0;
float l9_15=2.0-abs((6.0*l9_13)-2.0);
float l9_16=2.0-abs((6.0*l9_13)-4.0);
float3 l9_17=fast::clamp(float3(l9_14,l9_15,l9_16),float3(0.0),float3(1.0));
float3 l9_18=l9_17;
float l9_19=(1.0-abs((2.0*param_1.z)-1.0))*param_1.y;
l9_18=((l9_18-float3(0.5))*l9_19)+float3(param_1.z);
float3 l9_20=l9_18;
res=l9_20;
float3 resColor=mix(original,res,float3(weight));
return resColor;
}
else
{
float3 tmpColor=float3(0.0);
float param_2=yValue;
float param_3=intMap;
float param_4=target.x;
tmpColor.x=transformSingleColor(param_2,param_3,param_4);
float param_5=yValue;
float param_6=intMap;
float param_7=target.y;
tmpColor.y=transformSingleColor(param_5,param_6,param_7);
float param_8=yValue;
float param_9=intMap;
float param_10=target.z;
tmpColor.z=transformSingleColor(param_8,param_9,param_10);
tmpColor=fast::clamp(tmpColor,float3(0.0),float3(1.0));
float3 resColor_1=mix(original,tmpColor,float3(weight));
return resColor_1;
}
}
float3 definedBlend(thread const float3& a,thread const float3& b,thread int& varStereoViewID,constant userUniformsObj& UserUniforms,thread texture2d<float> intensityTexture,thread sampler intensityTextureSmpSC)
{
if ((int(BLEND_MODE_LIGHTEN_tmp)!=0))
{
return fast::max(a,b);
}
else
{
if ((int(BLEND_MODE_DARKEN_tmp)!=0))
{
return fast::min(a,b);
}
else
{
if ((int(BLEND_MODE_DIVIDE_tmp)!=0))
{
return b/a;
}
else
{
if ((int(BLEND_MODE_AVERAGE_tmp)!=0))
{
return (a+b)*0.5;
}
else
{
if ((int(BLEND_MODE_SUBTRACT_tmp)!=0))
{
return fast::max((a+b)-float3(1.0),float3(0.0));
}
else
{
if ((int(BLEND_MODE_DIFFERENCE_tmp)!=0))
{
return abs(a-b);
}
else
{
if ((int(BLEND_MODE_NEGATION_tmp)!=0))
{
return float3(1.0)-abs((float3(1.0)-a)-b);
}
else
{
if ((int(BLEND_MODE_EXCLUSION_tmp)!=0))
{
return (a+b)-((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_OVERLAY_tmp)!=0))
{
float l9_0;
if (a.x<0.5)
{
l9_0=(2.0*a.x)*b.x;
}
else
{
l9_0=1.0-((2.0*(1.0-a.x))*(1.0-b.x));
}
float l9_1=l9_0;
float l9_2;
if (a.y<0.5)
{
l9_2=(2.0*a.y)*b.y;
}
else
{
l9_2=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_3=l9_2;
float l9_4;
if (a.z<0.5)
{
l9_4=(2.0*a.z)*b.z;
}
else
{
l9_4=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return float3(l9_1,l9_3,l9_4);
}
else
{
if ((int(BLEND_MODE_SOFT_LIGHT_tmp)!=0))
{
return (((float3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_HARD_LIGHT_tmp)!=0))
{
float l9_5;
if (b.x<0.5)
{
l9_5=(2.0*b.x)*a.x;
}
else
{
l9_5=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_6=l9_5;
float l9_7;
if (b.y<0.5)
{
l9_7=(2.0*b.y)*a.y;
}
else
{
l9_7=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_8=l9_7;
float l9_9;
if (b.z<0.5)
{
l9_9=(2.0*b.z)*a.z;
}
else
{
l9_9=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return float3(l9_6,l9_8,l9_9);
}
else
{
if ((int(BLEND_MODE_COLOR_DODGE_tmp)!=0))
{
float l9_10;
if (b.x==1.0)
{
l9_10=b.x;
}
else
{
l9_10=fast::min(a.x/(1.0-b.x),1.0);
}
float l9_11=l9_10;
float l9_12;
if (b.y==1.0)
{
l9_12=b.y;
}
else
{
l9_12=fast::min(a.y/(1.0-b.y),1.0);
}
float l9_13=l9_12;
float l9_14;
if (b.z==1.0)
{
l9_14=b.z;
}
else
{
l9_14=fast::min(a.z/(1.0-b.z),1.0);
}
return float3(l9_11,l9_13,l9_14);
}
else
{
if ((int(BLEND_MODE_COLOR_BURN_tmp)!=0))
{
float l9_15;
if (b.x==0.0)
{
l9_15=b.x;
}
else
{
l9_15=fast::max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_16=l9_15;
float l9_17;
if (b.y==0.0)
{
l9_17=b.y;
}
else
{
l9_17=fast::max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_18=l9_17;
float l9_19;
if (b.z==0.0)
{
l9_19=b.z;
}
else
{
l9_19=fast::max(1.0-((1.0-a.z)/b.z),0.0);
}
return float3(l9_16,l9_18,l9_19);
}
else
{
if ((int(BLEND_MODE_LINEAR_LIGHT_tmp)!=0))
{
float l9_20;
if (b.x<0.5)
{
l9_20=fast::max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_20=fast::min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_21=l9_20;
float l9_22;
if (b.y<0.5)
{
l9_22=fast::max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_22=fast::min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_23=l9_22;
float l9_24;
if (b.z<0.5)
{
l9_24=fast::max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_24=fast::min(a.z+(2.0*(b.z-0.5)),1.0);
}
return float3(l9_21,l9_23,l9_24);
}
else
{
if ((int(BLEND_MODE_VIVID_LIGHT_tmp)!=0))
{
float l9_25;
if (b.x<0.5)
{
float l9_26;
if ((2.0*b.x)==0.0)
{
l9_26=2.0*b.x;
}
else
{
l9_26=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_25=l9_26;
}
else
{
float l9_27;
if ((2.0*(b.x-0.5))==1.0)
{
l9_27=2.0*(b.x-0.5);
}
else
{
l9_27=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_25=l9_27;
}
float l9_28=l9_25;
float l9_29;
if (b.y<0.5)
{
float l9_30;
if ((2.0*b.y)==0.0)
{
l9_30=2.0*b.y;
}
else
{
l9_30=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_29=l9_30;
}
else
{
float l9_31;
if ((2.0*(b.y-0.5))==1.0)
{
l9_31=2.0*(b.y-0.5);
}
else
{
l9_31=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_29=l9_31;
}
float l9_32=l9_29;
float l9_33;
if (b.z<0.5)
{
float l9_34;
if ((2.0*b.z)==0.0)
{
l9_34=2.0*b.z;
}
else
{
l9_34=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_33=l9_34;
}
else
{
float l9_35;
if ((2.0*(b.z-0.5))==1.0)
{
l9_35=2.0*(b.z-0.5);
}
else
{
l9_35=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_33=l9_35;
}
return float3(l9_28,l9_32,l9_33);
}
else
{
if ((int(BLEND_MODE_PIN_LIGHT_tmp)!=0))
{
float l9_36;
if (b.x<0.5)
{
l9_36=fast::min(a.x,2.0*b.x);
}
else
{
l9_36=fast::max(a.x,2.0*(b.x-0.5));
}
float l9_37=l9_36;
float l9_38;
if (b.y<0.5)
{
l9_38=fast::min(a.y,2.0*b.y);
}
else
{
l9_38=fast::max(a.y,2.0*(b.y-0.5));
}
float l9_39=l9_38;
float l9_40;
if (b.z<0.5)
{
l9_40=fast::min(a.z,2.0*b.z);
}
else
{
l9_40=fast::max(a.z,2.0*(b.z-0.5));
}
return float3(l9_37,l9_39,l9_40);
}
else
{
if ((int(BLEND_MODE_HARD_MIX_tmp)!=0))
{
float l9_41;
if (b.x<0.5)
{
float l9_42;
if ((2.0*b.x)==0.0)
{
l9_42=2.0*b.x;
}
else
{
l9_42=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_41=l9_42;
}
else
{
float l9_43;
if ((2.0*(b.x-0.5))==1.0)
{
l9_43=2.0*(b.x-0.5);
}
else
{
l9_43=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_41=l9_43;
}
float l9_44=l9_41;
float l9_45;
if (b.y<0.5)
{
float l9_46;
if ((2.0*b.y)==0.0)
{
l9_46=2.0*b.y;
}
else
{
l9_46=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_45=l9_46;
}
else
{
float l9_47;
if ((2.0*(b.y-0.5))==1.0)
{
l9_47=2.0*(b.y-0.5);
}
else
{
l9_47=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_45=l9_47;
}
float l9_48=l9_45;
float l9_49;
if (b.z<0.5)
{
float l9_50;
if ((2.0*b.z)==0.0)
{
l9_50=2.0*b.z;
}
else
{
l9_50=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_49=l9_50;
}
else
{
float l9_51;
if ((2.0*(b.z-0.5))==1.0)
{
l9_51=2.0*(b.z-0.5);
}
else
{
l9_51=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_49=l9_51;
}
return float3((l9_44<0.5) ? 0.0 : 1.0,(l9_48<0.5) ? 0.0 : 1.0,(l9_49<0.5) ? 0.0 : 1.0);
}
else
{
if ((int(BLEND_MODE_HARD_REFLECT_tmp)!=0))
{
float l9_52;
if (b.x==1.0)
{
l9_52=b.x;
}
else
{
l9_52=fast::min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_53=l9_52;
float l9_54;
if (b.y==1.0)
{
l9_54=b.y;
}
else
{
l9_54=fast::min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_55=l9_54;
float l9_56;
if (b.z==1.0)
{
l9_56=b.z;
}
else
{
l9_56=fast::min((a.z*a.z)/(1.0-b.z),1.0);
}
return float3(l9_53,l9_55,l9_56);
}
else
{
if ((int(BLEND_MODE_HARD_GLOW_tmp)!=0))
{
float l9_57;
if (a.x==1.0)
{
l9_57=a.x;
}
else
{
l9_57=fast::min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_58=l9_57;
float l9_59;
if (a.y==1.0)
{
l9_59=a.y;
}
else
{
l9_59=fast::min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_60=l9_59;
float l9_61;
if (a.z==1.0)
{
l9_61=a.z;
}
else
{
l9_61=fast::min((b.z*b.z)/(1.0-a.z),1.0);
}
return float3(l9_58,l9_60,l9_61);
}
else
{
if ((int(BLEND_MODE_HARD_PHOENIX_tmp)!=0))
{
return (fast::min(a,b)-fast::max(a,b))+float3(1.0);
}
else
{
if ((int(BLEND_MODE_HUE_tmp)!=0))
{
float3 param=a;
float3 param_1=b;
float3 l9_62=param;
float3 l9_63=l9_62;
float4 l9_64;
if (l9_63.y<l9_63.z)
{
l9_64=float4(l9_63.zy,-1.0,0.66666669);
}
else
{
l9_64=float4(l9_63.yz,0.0,-0.33333334);
}
float4 l9_65=l9_64;
float4 l9_66;
if (l9_63.x<l9_65.x)
{
l9_66=float4(l9_65.xyw,l9_63.x);
}
else
{
l9_66=float4(l9_63.x,l9_65.yzx);
}
float4 l9_67=l9_66;
float l9_68=l9_67.x-fast::min(l9_67.w,l9_67.y);
float l9_69=abs(((l9_67.w-l9_67.y)/((6.0*l9_68)+1e-07))+l9_67.z);
float l9_70=l9_67.x;
float3 l9_71=float3(l9_69,l9_68,l9_70);
float3 l9_72=l9_71;
float l9_73=l9_72.z-(l9_72.y*0.5);
float l9_74=l9_72.y/((1.0-abs((2.0*l9_73)-1.0))+1e-07);
float3 l9_75=float3(l9_72.x,l9_74,l9_73);
float3 l9_76=l9_75;
float3 l9_77=param_1;
float3 l9_78=l9_77;
float4 l9_79;
if (l9_78.y<l9_78.z)
{
l9_79=float4(l9_78.zy,-1.0,0.66666669);
}
else
{
l9_79=float4(l9_78.yz,0.0,-0.33333334);
}
float4 l9_80=l9_79;
float4 l9_81;
if (l9_78.x<l9_80.x)
{
l9_81=float4(l9_80.xyw,l9_78.x);
}
else
{
l9_81=float4(l9_78.x,l9_80.yzx);
}
float4 l9_82=l9_81;
float l9_83=l9_82.x-fast::min(l9_82.w,l9_82.y);
float l9_84=abs(((l9_82.w-l9_82.y)/((6.0*l9_83)+1e-07))+l9_82.z);
float l9_85=l9_82.x;
float3 l9_86=float3(l9_84,l9_83,l9_85);
float3 l9_87=l9_86;
float l9_88=l9_87.z-(l9_87.y*0.5);
float l9_89=l9_87.y/((1.0-abs((2.0*l9_88)-1.0))+1e-07);
float3 l9_90=float3(l9_87.x,l9_89,l9_88);
float3 l9_91=float3(l9_90.x,l9_76.y,l9_76.z);
float l9_92=l9_91.x;
float l9_93=abs((6.0*l9_92)-3.0)-1.0;
float l9_94=2.0-abs((6.0*l9_92)-2.0);
float l9_95=2.0-abs((6.0*l9_92)-4.0);
float3 l9_96=fast::clamp(float3(l9_93,l9_94,l9_95),float3(0.0),float3(1.0));
float3 l9_97=l9_96;
float l9_98=(1.0-abs((2.0*l9_91.z)-1.0))*l9_91.y;
l9_97=((l9_97-float3(0.5))*l9_98)+float3(l9_91.z);
float3 l9_99=l9_97;
float3 l9_100=l9_99;
return l9_100;
}
else
{
if ((int(BLEND_MODE_SATURATION_tmp)!=0))
{
float3 param_2=a;
float3 param_3=b;
float3 l9_101=param_2;
float3 l9_102=l9_101;
float4 l9_103;
if (l9_102.y<l9_102.z)
{
l9_103=float4(l9_102.zy,-1.0,0.66666669);
}
else
{
l9_103=float4(l9_102.yz,0.0,-0.33333334);
}
float4 l9_104=l9_103;
float4 l9_105;
if (l9_102.x<l9_104.x)
{
l9_105=float4(l9_104.xyw,l9_102.x);
}
else
{
l9_105=float4(l9_102.x,l9_104.yzx);
}
float4 l9_106=l9_105;
float l9_107=l9_106.x-fast::min(l9_106.w,l9_106.y);
float l9_108=abs(((l9_106.w-l9_106.y)/((6.0*l9_107)+1e-07))+l9_106.z);
float l9_109=l9_106.x;
float3 l9_110=float3(l9_108,l9_107,l9_109);
float3 l9_111=l9_110;
float l9_112=l9_111.z-(l9_111.y*0.5);
float l9_113=l9_111.y/((1.0-abs((2.0*l9_112)-1.0))+1e-07);
float3 l9_114=float3(l9_111.x,l9_113,l9_112);
float3 l9_115=l9_114;
float l9_116=l9_115.x;
float3 l9_117=param_3;
float3 l9_118=l9_117;
float4 l9_119;
if (l9_118.y<l9_118.z)
{
l9_119=float4(l9_118.zy,-1.0,0.66666669);
}
else
{
l9_119=float4(l9_118.yz,0.0,-0.33333334);
}
float4 l9_120=l9_119;
float4 l9_121;
if (l9_118.x<l9_120.x)
{
l9_121=float4(l9_120.xyw,l9_118.x);
}
else
{
l9_121=float4(l9_118.x,l9_120.yzx);
}
float4 l9_122=l9_121;
float l9_123=l9_122.x-fast::min(l9_122.w,l9_122.y);
float l9_124=abs(((l9_122.w-l9_122.y)/((6.0*l9_123)+1e-07))+l9_122.z);
float l9_125=l9_122.x;
float3 l9_126=float3(l9_124,l9_123,l9_125);
float3 l9_127=l9_126;
float l9_128=l9_127.z-(l9_127.y*0.5);
float l9_129=l9_127.y/((1.0-abs((2.0*l9_128)-1.0))+1e-07);
float3 l9_130=float3(l9_127.x,l9_129,l9_128);
float3 l9_131=float3(l9_116,l9_130.y,l9_115.z);
float l9_132=l9_131.x;
float l9_133=abs((6.0*l9_132)-3.0)-1.0;
float l9_134=2.0-abs((6.0*l9_132)-2.0);
float l9_135=2.0-abs((6.0*l9_132)-4.0);
float3 l9_136=fast::clamp(float3(l9_133,l9_134,l9_135),float3(0.0),float3(1.0));
float3 l9_137=l9_136;
float l9_138=(1.0-abs((2.0*l9_131.z)-1.0))*l9_131.y;
l9_137=((l9_137-float3(0.5))*l9_138)+float3(l9_131.z);
float3 l9_139=l9_137;
float3 l9_140=l9_139;
return l9_140;
}
else
{
if ((int(BLEND_MODE_COLOR_tmp)!=0))
{
float3 param_4=a;
float3 param_5=b;
float3 l9_141=param_5;
float3 l9_142=l9_141;
float4 l9_143;
if (l9_142.y<l9_142.z)
{
l9_143=float4(l9_142.zy,-1.0,0.66666669);
}
else
{
l9_143=float4(l9_142.yz,0.0,-0.33333334);
}
float4 l9_144=l9_143;
float4 l9_145;
if (l9_142.x<l9_144.x)
{
l9_145=float4(l9_144.xyw,l9_142.x);
}
else
{
l9_145=float4(l9_142.x,l9_144.yzx);
}
float4 l9_146=l9_145;
float l9_147=l9_146.x-fast::min(l9_146.w,l9_146.y);
float l9_148=abs(((l9_146.w-l9_146.y)/((6.0*l9_147)+1e-07))+l9_146.z);
float l9_149=l9_146.x;
float3 l9_150=float3(l9_148,l9_147,l9_149);
float3 l9_151=l9_150;
float l9_152=l9_151.z-(l9_151.y*0.5);
float l9_153=l9_151.y/((1.0-abs((2.0*l9_152)-1.0))+1e-07);
float3 l9_154=float3(l9_151.x,l9_153,l9_152);
float3 l9_155=l9_154;
float l9_156=l9_155.x;
float l9_157=l9_155.y;
float3 l9_158=param_4;
float3 l9_159=l9_158;
float4 l9_160;
if (l9_159.y<l9_159.z)
{
l9_160=float4(l9_159.zy,-1.0,0.66666669);
}
else
{
l9_160=float4(l9_159.yz,0.0,-0.33333334);
}
float4 l9_161=l9_160;
float4 l9_162;
if (l9_159.x<l9_161.x)
{
l9_162=float4(l9_161.xyw,l9_159.x);
}
else
{
l9_162=float4(l9_159.x,l9_161.yzx);
}
float4 l9_163=l9_162;
float l9_164=l9_163.x-fast::min(l9_163.w,l9_163.y);
float l9_165=abs(((l9_163.w-l9_163.y)/((6.0*l9_164)+1e-07))+l9_163.z);
float l9_166=l9_163.x;
float3 l9_167=float3(l9_165,l9_164,l9_166);
float3 l9_168=l9_167;
float l9_169=l9_168.z-(l9_168.y*0.5);
float l9_170=l9_168.y/((1.0-abs((2.0*l9_169)-1.0))+1e-07);
float3 l9_171=float3(l9_168.x,l9_170,l9_169);
float3 l9_172=float3(l9_156,l9_157,l9_171.z);
float l9_173=l9_172.x;
float l9_174=abs((6.0*l9_173)-3.0)-1.0;
float l9_175=2.0-abs((6.0*l9_173)-2.0);
float l9_176=2.0-abs((6.0*l9_173)-4.0);
float3 l9_177=fast::clamp(float3(l9_174,l9_175,l9_176),float3(0.0),float3(1.0));
float3 l9_178=l9_177;
float l9_179=(1.0-abs((2.0*l9_172.z)-1.0))*l9_172.y;
l9_178=((l9_178-float3(0.5))*l9_179)+float3(l9_172.z);
float3 l9_180=l9_178;
float3 l9_181=l9_180;
return l9_181;
}
else
{
if ((int(BLEND_MODE_LUMINOSITY_tmp)!=0))
{
float3 param_6=a;
float3 param_7=b;
float3 l9_182=param_6;
float3 l9_183=l9_182;
float4 l9_184;
if (l9_183.y<l9_183.z)
{
l9_184=float4(l9_183.zy,-1.0,0.66666669);
}
else
{
l9_184=float4(l9_183.yz,0.0,-0.33333334);
}
float4 l9_185=l9_184;
float4 l9_186;
if (l9_183.x<l9_185.x)
{
l9_186=float4(l9_185.xyw,l9_183.x);
}
else
{
l9_186=float4(l9_183.x,l9_185.yzx);
}
float4 l9_187=l9_186;
float l9_188=l9_187.x-fast::min(l9_187.w,l9_187.y);
float l9_189=abs(((l9_187.w-l9_187.y)/((6.0*l9_188)+1e-07))+l9_187.z);
float l9_190=l9_187.x;
float3 l9_191=float3(l9_189,l9_188,l9_190);
float3 l9_192=l9_191;
float l9_193=l9_192.z-(l9_192.y*0.5);
float l9_194=l9_192.y/((1.0-abs((2.0*l9_193)-1.0))+1e-07);
float3 l9_195=float3(l9_192.x,l9_194,l9_193);
float3 l9_196=l9_195;
float l9_197=l9_196.x;
float l9_198=l9_196.y;
float3 l9_199=param_7;
float3 l9_200=l9_199;
float4 l9_201;
if (l9_200.y<l9_200.z)
{
l9_201=float4(l9_200.zy,-1.0,0.66666669);
}
else
{
l9_201=float4(l9_200.yz,0.0,-0.33333334);
}
float4 l9_202=l9_201;
float4 l9_203;
if (l9_200.x<l9_202.x)
{
l9_203=float4(l9_202.xyw,l9_200.x);
}
else
{
l9_203=float4(l9_200.x,l9_202.yzx);
}
float4 l9_204=l9_203;
float l9_205=l9_204.x-fast::min(l9_204.w,l9_204.y);
float l9_206=abs(((l9_204.w-l9_204.y)/((6.0*l9_205)+1e-07))+l9_204.z);
float l9_207=l9_204.x;
float3 l9_208=float3(l9_206,l9_205,l9_207);
float3 l9_209=l9_208;
float l9_210=l9_209.z-(l9_209.y*0.5);
float l9_211=l9_209.y/((1.0-abs((2.0*l9_210)-1.0))+1e-07);
float3 l9_212=float3(l9_209.x,l9_211,l9_210);
float3 l9_213=float3(l9_197,l9_198,l9_212.z);
float l9_214=l9_213.x;
float l9_215=abs((6.0*l9_214)-3.0)-1.0;
float l9_216=2.0-abs((6.0*l9_214)-2.0);
float l9_217=2.0-abs((6.0*l9_214)-4.0);
float3 l9_218=fast::clamp(float3(l9_215,l9_216,l9_217),float3(0.0),float3(1.0));
float3 l9_219=l9_218;
float l9_220=(1.0-abs((2.0*l9_213.z)-1.0))*l9_213.y;
l9_219=((l9_219-float3(0.5))*l9_220)+float3(l9_213.z);
float3 l9_221=l9_219;
float3 l9_222=l9_221;
return l9_222;
}
else
{
float3 param_8=a;
float3 param_9=b;
float3 l9_223=param_8;
float l9_224=((0.29899999*l9_223.x)+(0.58700001*l9_223.y))+(0.114*l9_223.z);
float l9_225=l9_224;
float l9_226=1.0;
float l9_227=pow(l9_225,1.0/UserUniforms.correctedIntensity);
int l9_228;
if ((int(intensityTextureHasSwappedViews_tmp)!=0))
{
int l9_229=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_229=0;
}
else
{
l9_229=varStereoViewID;
}
int l9_230=l9_229;
l9_228=1-l9_230;
}
else
{
int l9_231=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_231=0;
}
else
{
l9_231=varStereoViewID;
}
int l9_232=l9_231;
l9_228=l9_232;
}
int l9_233=l9_228;
int l9_234=intensityTextureLayout_tmp;
int l9_235=l9_233;
float2 l9_236=float2(l9_227,0.5);
bool l9_237=(int(SC_USE_UV_TRANSFORM_intensityTexture_tmp)!=0);
float3x3 l9_238=UserUniforms.intensityTextureTransform;
int2 l9_239=int2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp);
bool l9_240=(int(SC_USE_UV_MIN_MAX_intensityTexture_tmp)!=0);
float4 l9_241=UserUniforms.intensityTextureUvMinMax;
bool l9_242=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp)!=0);
float4 l9_243=UserUniforms.intensityTextureBorderColor;
float l9_244=0.0;
bool l9_245=l9_242&&(!l9_240);
float l9_246=1.0;
float l9_247=l9_236.x;
int l9_248=l9_239.x;
if (l9_248==1)
{
l9_247=fract(l9_247);
}
else
{
if (l9_248==2)
{
float l9_249=fract(l9_247);
float l9_250=l9_247-l9_249;
float l9_251=step(0.25,fract(l9_250*0.5));
l9_247=mix(l9_249,1.0-l9_249,fast::clamp(l9_251,0.0,1.0));
}
}
l9_236.x=l9_247;
float l9_252=l9_236.y;
int l9_253=l9_239.y;
if (l9_253==1)
{
l9_252=fract(l9_252);
}
else
{
if (l9_253==2)
{
float l9_254=fract(l9_252);
float l9_255=l9_252-l9_254;
float l9_256=step(0.25,fract(l9_255*0.5));
l9_252=mix(l9_254,1.0-l9_254,fast::clamp(l9_256,0.0,1.0));
}
}
l9_236.y=l9_252;
if (l9_240)
{
bool l9_257=l9_242;
bool l9_258;
if (l9_257)
{
l9_258=l9_239.x==3;
}
else
{
l9_258=l9_257;
}
float l9_259=l9_236.x;
float l9_260=l9_241.x;
float l9_261=l9_241.z;
bool l9_262=l9_258;
float l9_263=l9_246;
float l9_264=fast::clamp(l9_259,l9_260,l9_261);
float l9_265=step(abs(l9_259-l9_264),9.9999997e-06);
l9_263*=(l9_265+((1.0-float(l9_262))*(1.0-l9_265)));
l9_259=l9_264;
l9_236.x=l9_259;
l9_246=l9_263;
bool l9_266=l9_242;
bool l9_267;
if (l9_266)
{
l9_267=l9_239.y==3;
}
else
{
l9_267=l9_266;
}
float l9_268=l9_236.y;
float l9_269=l9_241.y;
float l9_270=l9_241.w;
bool l9_271=l9_267;
float l9_272=l9_246;
float l9_273=fast::clamp(l9_268,l9_269,l9_270);
float l9_274=step(abs(l9_268-l9_273),9.9999997e-06);
l9_272*=(l9_274+((1.0-float(l9_271))*(1.0-l9_274)));
l9_268=l9_273;
l9_236.y=l9_268;
l9_246=l9_272;
}
float2 l9_275=l9_236;
bool l9_276=l9_237;
float3x3 l9_277=l9_238;
if (l9_276)
{
l9_275=float2((l9_277*float3(l9_275,1.0)).xy);
}
float2 l9_278=l9_275;
l9_236=l9_278;
float l9_279=l9_236.x;
int l9_280=l9_239.x;
bool l9_281=l9_245;
float l9_282=l9_246;
if ((l9_280==0)||(l9_280==3))
{
float l9_283=l9_279;
float l9_284=0.0;
float l9_285=1.0;
bool l9_286=l9_281;
float l9_287=l9_282;
float l9_288=fast::clamp(l9_283,l9_284,l9_285);
float l9_289=step(abs(l9_283-l9_288),9.9999997e-06);
l9_287*=(l9_289+((1.0-float(l9_286))*(1.0-l9_289)));
l9_283=l9_288;
l9_279=l9_283;
l9_282=l9_287;
}
l9_236.x=l9_279;
l9_246=l9_282;
float l9_290=l9_236.y;
int l9_291=l9_239.y;
bool l9_292=l9_245;
float l9_293=l9_246;
if ((l9_291==0)||(l9_291==3))
{
float l9_294=l9_290;
float l9_295=0.0;
float l9_296=1.0;
bool l9_297=l9_292;
float l9_298=l9_293;
float l9_299=fast::clamp(l9_294,l9_295,l9_296);
float l9_300=step(abs(l9_294-l9_299),9.9999997e-06);
l9_298*=(l9_300+((1.0-float(l9_297))*(1.0-l9_300)));
l9_294=l9_299;
l9_290=l9_294;
l9_293=l9_298;
}
l9_236.y=l9_290;
l9_246=l9_293;
float2 l9_301=l9_236;
int l9_302=l9_234;
int l9_303=l9_235;
float l9_304=l9_244;
float2 l9_305=l9_301;
int l9_306=l9_302;
int l9_307=l9_303;
float3 l9_308=float3(0.0);
if (l9_306==0)
{
l9_308=float3(l9_305,0.0);
}
else
{
if (l9_306==1)
{
l9_308=float3(l9_305.x,(l9_305.y*0.5)+(0.5-(float(l9_307)*0.5)),0.0);
}
else
{
l9_308=float3(l9_305,float(l9_307));
}
}
float3 l9_309=l9_308;
float3 l9_310=l9_309;
float4 l9_311=intensityTexture.sample(intensityTextureSmpSC,l9_310.xy,bias(l9_304));
float4 l9_312=l9_311;
if (l9_242)
{
l9_312=mix(l9_243,l9_312,float4(l9_246));
}
float4 l9_313=l9_312;
float3 l9_314=l9_313.xyz;
float3 l9_315=l9_314;
float l9_316=16.0;
float l9_317=((((l9_315.x*256.0)+l9_315.y)+(l9_315.z/256.0))/257.00391)*l9_316;
float l9_318=l9_317;
if ((int(BLEND_MODE_FORGRAY_tmp)!=0))
{
l9_318=fast::max(l9_318,1.0);
}
if ((int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
l9_318=fast::min(l9_318,1.0);
}
float l9_319=l9_225;
float3 l9_320=param_8;
float3 l9_321=param_9;
float l9_322=l9_226;
float l9_323=l9_318;
float3 l9_324=transformColor(l9_319,l9_320,l9_321,l9_322,l9_323);
return l9_324;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
float4 sc_OutputMotionVectorIfNeeded(thread const float4& finalColor,thread float4& varPosAndMotion,thread float4& varNormalAndMotion)
{
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float2 param=float2(varPosAndMotion.w,varNormalAndMotion.w);
float l9_0=(param.x*5.0)+0.5;
float l9_1=floor(l9_0*65535.0);
float l9_2=floor(l9_1*0.00390625);
float2 l9_3=float2(l9_2/255.0,(l9_1-(l9_2*256.0))/255.0);
float l9_4=(param.y*5.0)+0.5;
float l9_5=floor(l9_4*65535.0);
float l9_6=floor(l9_5*0.00390625);
float2 l9_7=float2(l9_6/255.0,(l9_5-(l9_6*256.0))/255.0);
float4 l9_8=float4(l9_3,l9_7);
return l9_8;
}
else
{
return finalColor;
}
}
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_frag_out out={};
float N0_numPigments=0.0;
float N0_texWidth=0.0;
float N0_texSize=0.0;
float N0_mixSteps=0.0;
float4 N0_labPosLA=float4(0.0);
float4 N0_labPosBV=float4(0.0);
float4 N0_rgbCol=float4(0.0);
float4 N0_mixInfo=float4(0.0);
if ((int(sc_DepthOnly_tmp)!=0))
{
return out;
}
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=in.PreviewVertexColor;
PreviewInfo.Saved=((in.PreviewVertexSaved*1.0)!=0.0) ? true : false;
float4 FinalColor=float4(1.0);
float4 FinalColor1=float4(1.0);
float4 FinalColor2=float4(1.0);
float4 FinalColor3=float4(1.0);
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 l9_0=gl_FragCoord;
int2 param=int2(l9_0.xy);
sc_RayTracingHitPayload rhp=sc_RayTracingEvaluateHitPayload(param,(*sc_set0.UserUniforms),(*sc_set0.sc_RayTracingCasterVertexBuffer),(*sc_set0.sc_RayTracingCasterNonAnimatedVertexBuffer),(*sc_set0.sc_RayTracingCasterIndexBuffer),sc_set0.sc_RayTracingHitCasterIdAndBarycentric,sc_set0.sc_RayTracingHitCasterIdAndBarycentricSmpSC,sc_set0.sc_RayTracingRayDirection,sc_set0.sc_RayTracingRayDirectionSmpSC);
if (rhp.id.x!=((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.y&65535u))
{
return out;
}
int l9_1=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1=0;
}
else
{
l9_1=in.varStereoViewID;
}
int l9_2=l9_1;
float4 emitterPositionCS=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_2]*float4(rhp.positionWS,1.0);
Globals.gScreenCoord=((emitterPositionCS.xy/float2(emitterPositionCS.w))*0.5)+float2(0.5);
}
else
{
float4 l9_3=gl_FragCoord;
float2 l9_4=l9_3.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_5=l9_4;
float2 l9_6=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_7=1;
int l9_8=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_8=0;
}
else
{
l9_8=in.varStereoViewID;
}
int l9_9=l9_8;
int l9_10=l9_9;
float3 l9_11=float3(l9_5,0.0);
int l9_12=l9_7;
int l9_13=l9_10;
if (l9_12==1)
{
l9_11.y=((2.0*l9_11.y)+float(l9_13))-1.0;
}
float2 l9_14=l9_11.xy;
l9_6=l9_14;
}
else
{
l9_6=l9_5;
}
float2 l9_15=l9_6;
float2 l9_16=l9_15;
Globals.gScreenCoord=l9_16;
}
float Output_N2=0.0;
float param_1=(*sc_set0.UserUniforms).numPigments;
Output_N2=param_1;
float Output_N3=0.0;
float param_2=(*sc_set0.UserUniforms).texWidth;
Output_N3=param_2;
float Output_N6=0.0;
float param_3=(*sc_set0.UserUniforms).texSize;
Output_N6=param_3;
float Output_N5=0.0;
float param_4=(*sc_set0.UserUniforms).mixSteps;
Output_N5=param_4;
float4 labPosLA_N0=float4(0.0);
float param_5=Output_N2;
float param_6=Output_N3;
float param_7=Output_N6;
float param_8=Output_N5;
ssGlobals param_10=Globals;
ssGlobals tempGlobals=param_10;
float4 param_9=float4(0.0);
N0_numPigments=param_5;
N0_texWidth=param_6;
N0_texSize=param_7;
N0_mixSteps=param_8;
float2 l9_17=tempGlobals.gScreenCoord;
float2 l9_18=l9_17;
float l9_19=floor(l9_18.x*N0_texSize);
float l9_20=floor(l9_18.y*N0_texSize);
float l9_21=(l9_20*N0_texSize)+l9_19;
int l9_22=int(l9_21);
int l9_23=int(N0_numPigments);
int l9_24=int(N0_mixSteps);
int l9_25=l9_23;
int l9_26=(l9_23*(l9_23-1))/2;
int l9_27=l9_26*(l9_24-1);
int l9_28=((l9_23*(l9_23-1))*(l9_23-2))/6;
int l9_29=0;
int l9_30=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_30<64)
{
if (l9_30>=(l9_24-1))
{
break;
}
int l9_31=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_31<64)
{
if (l9_31>=(l9_24-l9_30))
{
break;
}
l9_29++;
l9_31++;
continue;
}
else
{
break;
}
}
l9_30++;
continue;
}
else
{
break;
}
}
int l9_32=l9_28*l9_29;
int l9_33=(l9_25+l9_27)+l9_32;
float3 l9_34=float3(0.0);
float l9_35=0.0;
float l9_36=0.0;
float l9_37=0.0;
float l9_38=0.0;
float l9_39=0.0;
if (l9_22<l9_25)
{
int l9_40=l9_22;
float l9_41=(float(l9_40)+0.5)/N0_texWidth;
float2 l9_42=float2(l9_41,0.5);
float4 l9_43=float4(0.0);
int l9_44;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_45=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_45=0;
}
else
{
l9_45=in.varStereoViewID;
}
int l9_46=l9_45;
l9_44=1-l9_46;
}
else
{
int l9_47=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_47=0;
}
else
{
l9_47=in.varStereoViewID;
}
int l9_48=l9_47;
l9_44=l9_48;
}
int l9_49=l9_44;
int l9_50=pigmentTexLayout_tmp;
int l9_51=l9_49;
float2 l9_52=l9_42;
bool l9_53=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_54=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_55=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_56=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_57=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_58=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_59=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_60=0.0;
bool l9_61=l9_58&&(!l9_56);
float l9_62=1.0;
float l9_63=l9_52.x;
int l9_64=l9_55.x;
if (l9_64==1)
{
l9_63=fract(l9_63);
}
else
{
if (l9_64==2)
{
float l9_65=fract(l9_63);
float l9_66=l9_63-l9_65;
float l9_67=step(0.25,fract(l9_66*0.5));
l9_63=mix(l9_65,1.0-l9_65,fast::clamp(l9_67,0.0,1.0));
}
}
l9_52.x=l9_63;
float l9_68=l9_52.y;
int l9_69=l9_55.y;
if (l9_69==1)
{
l9_68=fract(l9_68);
}
else
{
if (l9_69==2)
{
float l9_70=fract(l9_68);
float l9_71=l9_68-l9_70;
float l9_72=step(0.25,fract(l9_71*0.5));
l9_68=mix(l9_70,1.0-l9_70,fast::clamp(l9_72,0.0,1.0));
}
}
l9_52.y=l9_68;
if (l9_56)
{
bool l9_73=l9_58;
bool l9_74;
if (l9_73)
{
l9_74=l9_55.x==3;
}
else
{
l9_74=l9_73;
}
float l9_75=l9_52.x;
float l9_76=l9_57.x;
float l9_77=l9_57.z;
bool l9_78=l9_74;
float l9_79=l9_62;
float l9_80=fast::clamp(l9_75,l9_76,l9_77);
float l9_81=step(abs(l9_75-l9_80),9.9999997e-06);
l9_79*=(l9_81+((1.0-float(l9_78))*(1.0-l9_81)));
l9_75=l9_80;
l9_52.x=l9_75;
l9_62=l9_79;
bool l9_82=l9_58;
bool l9_83;
if (l9_82)
{
l9_83=l9_55.y==3;
}
else
{
l9_83=l9_82;
}
float l9_84=l9_52.y;
float l9_85=l9_57.y;
float l9_86=l9_57.w;
bool l9_87=l9_83;
float l9_88=l9_62;
float l9_89=fast::clamp(l9_84,l9_85,l9_86);
float l9_90=step(abs(l9_84-l9_89),9.9999997e-06);
l9_88*=(l9_90+((1.0-float(l9_87))*(1.0-l9_90)));
l9_84=l9_89;
l9_52.y=l9_84;
l9_62=l9_88;
}
float2 l9_91=l9_52;
bool l9_92=l9_53;
float3x3 l9_93=l9_54;
if (l9_92)
{
l9_91=float2((l9_93*float3(l9_91,1.0)).xy);
}
float2 l9_94=l9_91;
l9_52=l9_94;
float l9_95=l9_52.x;
int l9_96=l9_55.x;
bool l9_97=l9_61;
float l9_98=l9_62;
if ((l9_96==0)||(l9_96==3))
{
float l9_99=l9_95;
float l9_100=0.0;
float l9_101=1.0;
bool l9_102=l9_97;
float l9_103=l9_98;
float l9_104=fast::clamp(l9_99,l9_100,l9_101);
float l9_105=step(abs(l9_99-l9_104),9.9999997e-06);
l9_103*=(l9_105+((1.0-float(l9_102))*(1.0-l9_105)));
l9_99=l9_104;
l9_95=l9_99;
l9_98=l9_103;
}
l9_52.x=l9_95;
l9_62=l9_98;
float l9_106=l9_52.y;
int l9_107=l9_55.y;
bool l9_108=l9_61;
float l9_109=l9_62;
if ((l9_107==0)||(l9_107==3))
{
float l9_110=l9_106;
float l9_111=0.0;
float l9_112=1.0;
bool l9_113=l9_108;
float l9_114=l9_109;
float l9_115=fast::clamp(l9_110,l9_111,l9_112);
float l9_116=step(abs(l9_110-l9_115),9.9999997e-06);
l9_114*=(l9_116+((1.0-float(l9_113))*(1.0-l9_116)));
l9_110=l9_115;
l9_106=l9_110;
l9_109=l9_114;
}
l9_52.y=l9_106;
l9_62=l9_109;
float2 l9_117=l9_52;
int l9_118=l9_50;
int l9_119=l9_51;
float l9_120=l9_60;
float2 l9_121=l9_117;
int l9_122=l9_118;
int l9_123=l9_119;
float3 l9_124=float3(0.0);
if (l9_122==0)
{
l9_124=float3(l9_121,0.0);
}
else
{
if (l9_122==1)
{
l9_124=float3(l9_121.x,(l9_121.y*0.5)+(0.5-(float(l9_123)*0.5)),0.0);
}
else
{
l9_124=float3(l9_121,float(l9_123));
}
}
float3 l9_125=l9_124;
float3 l9_126=l9_125;
float4 l9_127=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_126.xy,bias(l9_120));
float4 l9_128=l9_127;
if (l9_58)
{
l9_128=mix(l9_59,l9_128,float4(l9_62));
}
float4 l9_129=l9_128;
l9_43=l9_129;
float4 l9_130=l9_43;
float3 l9_131=l9_130.xyz;
l9_34=l9_131;
l9_35=1.0;
l9_36=float(l9_22);
}
else
{
if (l9_22<(l9_25+l9_27))
{
int l9_132=l9_22-l9_25;
int l9_133=l9_132/(l9_24-1);
int l9_134=l9_132-(l9_133*(l9_24-1));
int l9_135=0;
int l9_136=0;
int l9_137=1;
int l9_138=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_138<16)
{
if (l9_138>=l9_23)
{
break;
}
int l9_139=l9_138+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_139<16)
{
if (l9_139>=l9_23)
{
break;
}
if (l9_135==l9_133)
{
l9_136=l9_138;
l9_137=l9_139;
}
l9_135++;
l9_139++;
continue;
}
else
{
break;
}
}
l9_138++;
continue;
}
else
{
break;
}
}
float l9_140=float(l9_134+1)/float(l9_24);
int l9_141=l9_136;
float l9_142=(float(l9_141)+0.5)/N0_texWidth;
float2 l9_143=float2(l9_142,0.5);
float4 l9_144=float4(0.0);
int l9_145;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_146=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_146=0;
}
else
{
l9_146=in.varStereoViewID;
}
int l9_147=l9_146;
l9_145=1-l9_147;
}
else
{
int l9_148=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_148=0;
}
else
{
l9_148=in.varStereoViewID;
}
int l9_149=l9_148;
l9_145=l9_149;
}
int l9_150=l9_145;
int l9_151=pigmentTexLayout_tmp;
int l9_152=l9_150;
float2 l9_153=l9_143;
bool l9_154=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_155=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_156=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_157=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_158=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_159=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_160=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_161=0.0;
bool l9_162=l9_159&&(!l9_157);
float l9_163=1.0;
float l9_164=l9_153.x;
int l9_165=l9_156.x;
if (l9_165==1)
{
l9_164=fract(l9_164);
}
else
{
if (l9_165==2)
{
float l9_166=fract(l9_164);
float l9_167=l9_164-l9_166;
float l9_168=step(0.25,fract(l9_167*0.5));
l9_164=mix(l9_166,1.0-l9_166,fast::clamp(l9_168,0.0,1.0));
}
}
l9_153.x=l9_164;
float l9_169=l9_153.y;
int l9_170=l9_156.y;
if (l9_170==1)
{
l9_169=fract(l9_169);
}
else
{
if (l9_170==2)
{
float l9_171=fract(l9_169);
float l9_172=l9_169-l9_171;
float l9_173=step(0.25,fract(l9_172*0.5));
l9_169=mix(l9_171,1.0-l9_171,fast::clamp(l9_173,0.0,1.0));
}
}
l9_153.y=l9_169;
if (l9_157)
{
bool l9_174=l9_159;
bool l9_175;
if (l9_174)
{
l9_175=l9_156.x==3;
}
else
{
l9_175=l9_174;
}
float l9_176=l9_153.x;
float l9_177=l9_158.x;
float l9_178=l9_158.z;
bool l9_179=l9_175;
float l9_180=l9_163;
float l9_181=fast::clamp(l9_176,l9_177,l9_178);
float l9_182=step(abs(l9_176-l9_181),9.9999997e-06);
l9_180*=(l9_182+((1.0-float(l9_179))*(1.0-l9_182)));
l9_176=l9_181;
l9_153.x=l9_176;
l9_163=l9_180;
bool l9_183=l9_159;
bool l9_184;
if (l9_183)
{
l9_184=l9_156.y==3;
}
else
{
l9_184=l9_183;
}
float l9_185=l9_153.y;
float l9_186=l9_158.y;
float l9_187=l9_158.w;
bool l9_188=l9_184;
float l9_189=l9_163;
float l9_190=fast::clamp(l9_185,l9_186,l9_187);
float l9_191=step(abs(l9_185-l9_190),9.9999997e-06);
l9_189*=(l9_191+((1.0-float(l9_188))*(1.0-l9_191)));
l9_185=l9_190;
l9_153.y=l9_185;
l9_163=l9_189;
}
float2 l9_192=l9_153;
bool l9_193=l9_154;
float3x3 l9_194=l9_155;
if (l9_193)
{
l9_192=float2((l9_194*float3(l9_192,1.0)).xy);
}
float2 l9_195=l9_192;
l9_153=l9_195;
float l9_196=l9_153.x;
int l9_197=l9_156.x;
bool l9_198=l9_162;
float l9_199=l9_163;
if ((l9_197==0)||(l9_197==3))
{
float l9_200=l9_196;
float l9_201=0.0;
float l9_202=1.0;
bool l9_203=l9_198;
float l9_204=l9_199;
float l9_205=fast::clamp(l9_200,l9_201,l9_202);
float l9_206=step(abs(l9_200-l9_205),9.9999997e-06);
l9_204*=(l9_206+((1.0-float(l9_203))*(1.0-l9_206)));
l9_200=l9_205;
l9_196=l9_200;
l9_199=l9_204;
}
l9_153.x=l9_196;
l9_163=l9_199;
float l9_207=l9_153.y;
int l9_208=l9_156.y;
bool l9_209=l9_162;
float l9_210=l9_163;
if ((l9_208==0)||(l9_208==3))
{
float l9_211=l9_207;
float l9_212=0.0;
float l9_213=1.0;
bool l9_214=l9_209;
float l9_215=l9_210;
float l9_216=fast::clamp(l9_211,l9_212,l9_213);
float l9_217=step(abs(l9_211-l9_216),9.9999997e-06);
l9_215*=(l9_217+((1.0-float(l9_214))*(1.0-l9_217)));
l9_211=l9_216;
l9_207=l9_211;
l9_210=l9_215;
}
l9_153.y=l9_207;
l9_163=l9_210;
float2 l9_218=l9_153;
int l9_219=l9_151;
int l9_220=l9_152;
float l9_221=l9_161;
float2 l9_222=l9_218;
int l9_223=l9_219;
int l9_224=l9_220;
float3 l9_225=float3(0.0);
if (l9_223==0)
{
l9_225=float3(l9_222,0.0);
}
else
{
if (l9_223==1)
{
l9_225=float3(l9_222.x,(l9_222.y*0.5)+(0.5-(float(l9_224)*0.5)),0.0);
}
else
{
l9_225=float3(l9_222,float(l9_224));
}
}
float3 l9_226=l9_225;
float3 l9_227=l9_226;
float4 l9_228=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_227.xy,bias(l9_221));
float4 l9_229=l9_228;
if (l9_159)
{
l9_229=mix(l9_160,l9_229,float4(l9_163));
}
float4 l9_230=l9_229;
l9_144=l9_230;
float4 l9_231=l9_144;
float3 l9_232=l9_231.xyz;
float3 l9_233=l9_232;
int l9_234=l9_137;
float l9_235=(float(l9_234)+0.5)/N0_texWidth;
float2 l9_236=float2(l9_235,0.5);
float4 l9_237=float4(0.0);
int l9_238;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_239=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_239=0;
}
else
{
l9_239=in.varStereoViewID;
}
int l9_240=l9_239;
l9_238=1-l9_240;
}
else
{
int l9_241=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_241=0;
}
else
{
l9_241=in.varStereoViewID;
}
int l9_242=l9_241;
l9_238=l9_242;
}
int l9_243=l9_238;
int l9_244=pigmentTexLayout_tmp;
int l9_245=l9_243;
float2 l9_246=l9_236;
bool l9_247=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_248=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_249=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_250=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_251=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_252=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_253=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_254=0.0;
bool l9_255=l9_252&&(!l9_250);
float l9_256=1.0;
float l9_257=l9_246.x;
int l9_258=l9_249.x;
if (l9_258==1)
{
l9_257=fract(l9_257);
}
else
{
if (l9_258==2)
{
float l9_259=fract(l9_257);
float l9_260=l9_257-l9_259;
float l9_261=step(0.25,fract(l9_260*0.5));
l9_257=mix(l9_259,1.0-l9_259,fast::clamp(l9_261,0.0,1.0));
}
}
l9_246.x=l9_257;
float l9_262=l9_246.y;
int l9_263=l9_249.y;
if (l9_263==1)
{
l9_262=fract(l9_262);
}
else
{
if (l9_263==2)
{
float l9_264=fract(l9_262);
float l9_265=l9_262-l9_264;
float l9_266=step(0.25,fract(l9_265*0.5));
l9_262=mix(l9_264,1.0-l9_264,fast::clamp(l9_266,0.0,1.0));
}
}
l9_246.y=l9_262;
if (l9_250)
{
bool l9_267=l9_252;
bool l9_268;
if (l9_267)
{
l9_268=l9_249.x==3;
}
else
{
l9_268=l9_267;
}
float l9_269=l9_246.x;
float l9_270=l9_251.x;
float l9_271=l9_251.z;
bool l9_272=l9_268;
float l9_273=l9_256;
float l9_274=fast::clamp(l9_269,l9_270,l9_271);
float l9_275=step(abs(l9_269-l9_274),9.9999997e-06);
l9_273*=(l9_275+((1.0-float(l9_272))*(1.0-l9_275)));
l9_269=l9_274;
l9_246.x=l9_269;
l9_256=l9_273;
bool l9_276=l9_252;
bool l9_277;
if (l9_276)
{
l9_277=l9_249.y==3;
}
else
{
l9_277=l9_276;
}
float l9_278=l9_246.y;
float l9_279=l9_251.y;
float l9_280=l9_251.w;
bool l9_281=l9_277;
float l9_282=l9_256;
float l9_283=fast::clamp(l9_278,l9_279,l9_280);
float l9_284=step(abs(l9_278-l9_283),9.9999997e-06);
l9_282*=(l9_284+((1.0-float(l9_281))*(1.0-l9_284)));
l9_278=l9_283;
l9_246.y=l9_278;
l9_256=l9_282;
}
float2 l9_285=l9_246;
bool l9_286=l9_247;
float3x3 l9_287=l9_248;
if (l9_286)
{
l9_285=float2((l9_287*float3(l9_285,1.0)).xy);
}
float2 l9_288=l9_285;
l9_246=l9_288;
float l9_289=l9_246.x;
int l9_290=l9_249.x;
bool l9_291=l9_255;
float l9_292=l9_256;
if ((l9_290==0)||(l9_290==3))
{
float l9_293=l9_289;
float l9_294=0.0;
float l9_295=1.0;
bool l9_296=l9_291;
float l9_297=l9_292;
float l9_298=fast::clamp(l9_293,l9_294,l9_295);
float l9_299=step(abs(l9_293-l9_298),9.9999997e-06);
l9_297*=(l9_299+((1.0-float(l9_296))*(1.0-l9_299)));
l9_293=l9_298;
l9_289=l9_293;
l9_292=l9_297;
}
l9_246.x=l9_289;
l9_256=l9_292;
float l9_300=l9_246.y;
int l9_301=l9_249.y;
bool l9_302=l9_255;
float l9_303=l9_256;
if ((l9_301==0)||(l9_301==3))
{
float l9_304=l9_300;
float l9_305=0.0;
float l9_306=1.0;
bool l9_307=l9_302;
float l9_308=l9_303;
float l9_309=fast::clamp(l9_304,l9_305,l9_306);
float l9_310=step(abs(l9_304-l9_309),9.9999997e-06);
l9_308*=(l9_310+((1.0-float(l9_307))*(1.0-l9_310)));
l9_304=l9_309;
l9_300=l9_304;
l9_303=l9_308;
}
l9_246.y=l9_300;
l9_256=l9_303;
float2 l9_311=l9_246;
int l9_312=l9_244;
int l9_313=l9_245;
float l9_314=l9_254;
float2 l9_315=l9_311;
int l9_316=l9_312;
int l9_317=l9_313;
float3 l9_318=float3(0.0);
if (l9_316==0)
{
l9_318=float3(l9_315,0.0);
}
else
{
if (l9_316==1)
{
l9_318=float3(l9_315.x,(l9_315.y*0.5)+(0.5-(float(l9_317)*0.5)),0.0);
}
else
{
l9_318=float3(l9_315,float(l9_317));
}
}
float3 l9_319=l9_318;
float3 l9_320=l9_319;
float4 l9_321=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_320.xy,bias(l9_314));
float4 l9_322=l9_321;
if (l9_252)
{
l9_322=mix(l9_253,l9_322,float4(l9_256));
}
float4 l9_323=l9_322;
l9_237=l9_323;
float4 l9_324=l9_237;
float3 l9_325=l9_324.xyz;
float3 l9_326=l9_325;
float3 l9_327=l9_233;
float3 l9_328=l9_326;
float l9_329=l9_140;
float l9_330=1.0-l9_140;
float l9_331=l9_329+l9_330;
float l9_332=l9_329/fast::max(l9_331,0.001);
float l9_333=l9_330/fast::max(l9_331,0.001);
float3 l9_334=float3(0.0);
float l9_335=l9_327.x;
float l9_336=1.0-l9_335;
float l9_337=2.0;
float l9_338;
if (l9_336<=0.0)
{
l9_338=0.0;
}
else
{
l9_338=pow(l9_336,l9_337);
}
float l9_339=l9_338;
float l9_340=l9_339/(2.0*fast::max(l9_335,9.9999997e-05));
float l9_341=l9_340;
float l9_342=l9_332;
float l9_343=l9_328.x;
float l9_344=1.0-l9_343;
float l9_345=2.0;
float l9_346;
if (l9_344<=0.0)
{
l9_346=0.0;
}
else
{
l9_346=pow(l9_344,l9_345);
}
float l9_347=l9_346;
float l9_348=l9_347/(2.0*fast::max(l9_343,9.9999997e-05));
float l9_349=(l9_341*l9_342)+(l9_348*l9_333);
float l9_350=l9_349;
float l9_351=l9_350;
float l9_352=(l9_350*l9_350)+(2.0*l9_350);
float l9_353;
if (l9_352<=0.0)
{
l9_353=0.0;
}
else
{
l9_353=sqrt(l9_352);
}
float l9_354=l9_353;
float l9_355=(1.0+l9_351)-l9_354;
l9_334.x=l9_355;
float l9_356=l9_327.y;
float l9_357=1.0-l9_356;
float l9_358=2.0;
float l9_359;
if (l9_357<=0.0)
{
l9_359=0.0;
}
else
{
l9_359=pow(l9_357,l9_358);
}
float l9_360=l9_359;
float l9_361=l9_360/(2.0*fast::max(l9_356,9.9999997e-05));
float l9_362=l9_361;
float l9_363=l9_332;
float l9_364=l9_328.y;
float l9_365=1.0-l9_364;
float l9_366=2.0;
float l9_367;
if (l9_365<=0.0)
{
l9_367=0.0;
}
else
{
l9_367=pow(l9_365,l9_366);
}
float l9_368=l9_367;
float l9_369=l9_368/(2.0*fast::max(l9_364,9.9999997e-05));
l9_349=(l9_362*l9_363)+(l9_369*l9_333);
float l9_370=l9_349;
float l9_371=l9_370;
float l9_372=(l9_370*l9_370)+(2.0*l9_370);
float l9_373;
if (l9_372<=0.0)
{
l9_373=0.0;
}
else
{
l9_373=sqrt(l9_372);
}
float l9_374=l9_373;
float l9_375=(1.0+l9_371)-l9_374;
l9_334.y=l9_375;
float l9_376=l9_327.z;
float l9_377=1.0-l9_376;
float l9_378=2.0;
float l9_379;
if (l9_377<=0.0)
{
l9_379=0.0;
}
else
{
l9_379=pow(l9_377,l9_378);
}
float l9_380=l9_379;
float l9_381=l9_380/(2.0*fast::max(l9_376,9.9999997e-05));
float l9_382=l9_381;
float l9_383=l9_332;
float l9_384=l9_328.z;
float l9_385=1.0-l9_384;
float l9_386=2.0;
float l9_387;
if (l9_385<=0.0)
{
l9_387=0.0;
}
else
{
l9_387=pow(l9_385,l9_386);
}
float l9_388=l9_387;
float l9_389=l9_388/(2.0*fast::max(l9_384,9.9999997e-05));
l9_349=(l9_382*l9_383)+(l9_389*l9_333);
float l9_390=l9_349;
float l9_391=l9_390;
float l9_392=(l9_390*l9_390)+(2.0*l9_390);
float l9_393;
if (l9_392<=0.0)
{
l9_393=0.0;
}
else
{
l9_393=sqrt(l9_392);
}
float l9_394=l9_393;
float l9_395=(1.0+l9_391)-l9_394;
l9_334.z=l9_395;
float3 l9_396=fast::clamp(l9_334,float3(0.0),float3(1.0));
l9_34=l9_396;
l9_35=1.0;
l9_36=float(l9_136);
l9_37=float(l9_137);
l9_39=l9_140;
}
else
{
if (l9_22<l9_33)
{
int l9_397=(l9_22-l9_25)-l9_27;
int l9_398=l9_397/l9_29;
int l9_399=l9_397-(l9_398*l9_29);
int l9_400=0;
int l9_401=0;
int l9_402=1;
int l9_403=2;
int l9_404=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_404<16)
{
if (l9_404>=l9_23)
{
break;
}
int l9_405=l9_404+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_405<16)
{
if (l9_405>=l9_23)
{
break;
}
int l9_406=l9_405+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_406<16)
{
if (l9_406>=l9_23)
{
break;
}
if (l9_400==l9_398)
{
l9_401=l9_404;
l9_402=l9_405;
l9_403=l9_406;
}
l9_400++;
l9_406++;
continue;
}
else
{
break;
}
}
l9_405++;
continue;
}
else
{
break;
}
}
l9_404++;
continue;
}
else
{
break;
}
}
int l9_407=0;
int l9_408=1;
int l9_409=1;
int l9_410=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_410<64)
{
if (l9_410>=(l9_24-1))
{
break;
}
int l9_411=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_411<64)
{
if (l9_411>=(l9_24-l9_410))
{
break;
}
if (l9_407==l9_399)
{
l9_408=l9_410;
l9_409=l9_411;
}
l9_407++;
l9_411++;
continue;
}
else
{
break;
}
}
l9_410++;
continue;
}
else
{
break;
}
}
float l9_412=float(l9_408)/float(l9_24);
float l9_413=float(l9_409)/float(l9_24);
float l9_414=(1.0-l9_412)-l9_413;
int l9_415=l9_401;
float l9_416=(float(l9_415)+0.5)/N0_texWidth;
float2 l9_417=float2(l9_416,0.5);
float4 l9_418=float4(0.0);
int l9_419;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_420=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_420=0;
}
else
{
l9_420=in.varStereoViewID;
}
int l9_421=l9_420;
l9_419=1-l9_421;
}
else
{
int l9_422=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_422=0;
}
else
{
l9_422=in.varStereoViewID;
}
int l9_423=l9_422;
l9_419=l9_423;
}
int l9_424=l9_419;
int l9_425=pigmentTexLayout_tmp;
int l9_426=l9_424;
float2 l9_427=l9_417;
bool l9_428=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_429=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_430=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_431=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_432=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_433=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_434=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_435=0.0;
bool l9_436=l9_433&&(!l9_431);
float l9_437=1.0;
float l9_438=l9_427.x;
int l9_439=l9_430.x;
if (l9_439==1)
{
l9_438=fract(l9_438);
}
else
{
if (l9_439==2)
{
float l9_440=fract(l9_438);
float l9_441=l9_438-l9_440;
float l9_442=step(0.25,fract(l9_441*0.5));
l9_438=mix(l9_440,1.0-l9_440,fast::clamp(l9_442,0.0,1.0));
}
}
l9_427.x=l9_438;
float l9_443=l9_427.y;
int l9_444=l9_430.y;
if (l9_444==1)
{
l9_443=fract(l9_443);
}
else
{
if (l9_444==2)
{
float l9_445=fract(l9_443);
float l9_446=l9_443-l9_445;
float l9_447=step(0.25,fract(l9_446*0.5));
l9_443=mix(l9_445,1.0-l9_445,fast::clamp(l9_447,0.0,1.0));
}
}
l9_427.y=l9_443;
if (l9_431)
{
bool l9_448=l9_433;
bool l9_449;
if (l9_448)
{
l9_449=l9_430.x==3;
}
else
{
l9_449=l9_448;
}
float l9_450=l9_427.x;
float l9_451=l9_432.x;
float l9_452=l9_432.z;
bool l9_453=l9_449;
float l9_454=l9_437;
float l9_455=fast::clamp(l9_450,l9_451,l9_452);
float l9_456=step(abs(l9_450-l9_455),9.9999997e-06);
l9_454*=(l9_456+((1.0-float(l9_453))*(1.0-l9_456)));
l9_450=l9_455;
l9_427.x=l9_450;
l9_437=l9_454;
bool l9_457=l9_433;
bool l9_458;
if (l9_457)
{
l9_458=l9_430.y==3;
}
else
{
l9_458=l9_457;
}
float l9_459=l9_427.y;
float l9_460=l9_432.y;
float l9_461=l9_432.w;
bool l9_462=l9_458;
float l9_463=l9_437;
float l9_464=fast::clamp(l9_459,l9_460,l9_461);
float l9_465=step(abs(l9_459-l9_464),9.9999997e-06);
l9_463*=(l9_465+((1.0-float(l9_462))*(1.0-l9_465)));
l9_459=l9_464;
l9_427.y=l9_459;
l9_437=l9_463;
}
float2 l9_466=l9_427;
bool l9_467=l9_428;
float3x3 l9_468=l9_429;
if (l9_467)
{
l9_466=float2((l9_468*float3(l9_466,1.0)).xy);
}
float2 l9_469=l9_466;
l9_427=l9_469;
float l9_470=l9_427.x;
int l9_471=l9_430.x;
bool l9_472=l9_436;
float l9_473=l9_437;
if ((l9_471==0)||(l9_471==3))
{
float l9_474=l9_470;
float l9_475=0.0;
float l9_476=1.0;
bool l9_477=l9_472;
float l9_478=l9_473;
float l9_479=fast::clamp(l9_474,l9_475,l9_476);
float l9_480=step(abs(l9_474-l9_479),9.9999997e-06);
l9_478*=(l9_480+((1.0-float(l9_477))*(1.0-l9_480)));
l9_474=l9_479;
l9_470=l9_474;
l9_473=l9_478;
}
l9_427.x=l9_470;
l9_437=l9_473;
float l9_481=l9_427.y;
int l9_482=l9_430.y;
bool l9_483=l9_436;
float l9_484=l9_437;
if ((l9_482==0)||(l9_482==3))
{
float l9_485=l9_481;
float l9_486=0.0;
float l9_487=1.0;
bool l9_488=l9_483;
float l9_489=l9_484;
float l9_490=fast::clamp(l9_485,l9_486,l9_487);
float l9_491=step(abs(l9_485-l9_490),9.9999997e-06);
l9_489*=(l9_491+((1.0-float(l9_488))*(1.0-l9_491)));
l9_485=l9_490;
l9_481=l9_485;
l9_484=l9_489;
}
l9_427.y=l9_481;
l9_437=l9_484;
float2 l9_492=l9_427;
int l9_493=l9_425;
int l9_494=l9_426;
float l9_495=l9_435;
float2 l9_496=l9_492;
int l9_497=l9_493;
int l9_498=l9_494;
float3 l9_499=float3(0.0);
if (l9_497==0)
{
l9_499=float3(l9_496,0.0);
}
else
{
if (l9_497==1)
{
l9_499=float3(l9_496.x,(l9_496.y*0.5)+(0.5-(float(l9_498)*0.5)),0.0);
}
else
{
l9_499=float3(l9_496,float(l9_498));
}
}
float3 l9_500=l9_499;
float3 l9_501=l9_500;
float4 l9_502=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_501.xy,bias(l9_495));
float4 l9_503=l9_502;
if (l9_433)
{
l9_503=mix(l9_434,l9_503,float4(l9_437));
}
float4 l9_504=l9_503;
l9_418=l9_504;
float4 l9_505=l9_418;
float3 l9_506=l9_505.xyz;
float3 l9_507=l9_506;
int l9_508=l9_402;
float l9_509=(float(l9_508)+0.5)/N0_texWidth;
float2 l9_510=float2(l9_509,0.5);
float4 l9_511=float4(0.0);
int l9_512;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_513=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_513=0;
}
else
{
l9_513=in.varStereoViewID;
}
int l9_514=l9_513;
l9_512=1-l9_514;
}
else
{
int l9_515=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_515=0;
}
else
{
l9_515=in.varStereoViewID;
}
int l9_516=l9_515;
l9_512=l9_516;
}
int l9_517=l9_512;
int l9_518=pigmentTexLayout_tmp;
int l9_519=l9_517;
float2 l9_520=l9_510;
bool l9_521=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_522=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_523=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_524=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_525=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_526=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_527=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_528=0.0;
bool l9_529=l9_526&&(!l9_524);
float l9_530=1.0;
float l9_531=l9_520.x;
int l9_532=l9_523.x;
if (l9_532==1)
{
l9_531=fract(l9_531);
}
else
{
if (l9_532==2)
{
float l9_533=fract(l9_531);
float l9_534=l9_531-l9_533;
float l9_535=step(0.25,fract(l9_534*0.5));
l9_531=mix(l9_533,1.0-l9_533,fast::clamp(l9_535,0.0,1.0));
}
}
l9_520.x=l9_531;
float l9_536=l9_520.y;
int l9_537=l9_523.y;
if (l9_537==1)
{
l9_536=fract(l9_536);
}
else
{
if (l9_537==2)
{
float l9_538=fract(l9_536);
float l9_539=l9_536-l9_538;
float l9_540=step(0.25,fract(l9_539*0.5));
l9_536=mix(l9_538,1.0-l9_538,fast::clamp(l9_540,0.0,1.0));
}
}
l9_520.y=l9_536;
if (l9_524)
{
bool l9_541=l9_526;
bool l9_542;
if (l9_541)
{
l9_542=l9_523.x==3;
}
else
{
l9_542=l9_541;
}
float l9_543=l9_520.x;
float l9_544=l9_525.x;
float l9_545=l9_525.z;
bool l9_546=l9_542;
float l9_547=l9_530;
float l9_548=fast::clamp(l9_543,l9_544,l9_545);
float l9_549=step(abs(l9_543-l9_548),9.9999997e-06);
l9_547*=(l9_549+((1.0-float(l9_546))*(1.0-l9_549)));
l9_543=l9_548;
l9_520.x=l9_543;
l9_530=l9_547;
bool l9_550=l9_526;
bool l9_551;
if (l9_550)
{
l9_551=l9_523.y==3;
}
else
{
l9_551=l9_550;
}
float l9_552=l9_520.y;
float l9_553=l9_525.y;
float l9_554=l9_525.w;
bool l9_555=l9_551;
float l9_556=l9_530;
float l9_557=fast::clamp(l9_552,l9_553,l9_554);
float l9_558=step(abs(l9_552-l9_557),9.9999997e-06);
l9_556*=(l9_558+((1.0-float(l9_555))*(1.0-l9_558)));
l9_552=l9_557;
l9_520.y=l9_552;
l9_530=l9_556;
}
float2 l9_559=l9_520;
bool l9_560=l9_521;
float3x3 l9_561=l9_522;
if (l9_560)
{
l9_559=float2((l9_561*float3(l9_559,1.0)).xy);
}
float2 l9_562=l9_559;
l9_520=l9_562;
float l9_563=l9_520.x;
int l9_564=l9_523.x;
bool l9_565=l9_529;
float l9_566=l9_530;
if ((l9_564==0)||(l9_564==3))
{
float l9_567=l9_563;
float l9_568=0.0;
float l9_569=1.0;
bool l9_570=l9_565;
float l9_571=l9_566;
float l9_572=fast::clamp(l9_567,l9_568,l9_569);
float l9_573=step(abs(l9_567-l9_572),9.9999997e-06);
l9_571*=(l9_573+((1.0-float(l9_570))*(1.0-l9_573)));
l9_567=l9_572;
l9_563=l9_567;
l9_566=l9_571;
}
l9_520.x=l9_563;
l9_530=l9_566;
float l9_574=l9_520.y;
int l9_575=l9_523.y;
bool l9_576=l9_529;
float l9_577=l9_530;
if ((l9_575==0)||(l9_575==3))
{
float l9_578=l9_574;
float l9_579=0.0;
float l9_580=1.0;
bool l9_581=l9_576;
float l9_582=l9_577;
float l9_583=fast::clamp(l9_578,l9_579,l9_580);
float l9_584=step(abs(l9_578-l9_583),9.9999997e-06);
l9_582*=(l9_584+((1.0-float(l9_581))*(1.0-l9_584)));
l9_578=l9_583;
l9_574=l9_578;
l9_577=l9_582;
}
l9_520.y=l9_574;
l9_530=l9_577;
float2 l9_585=l9_520;
int l9_586=l9_518;
int l9_587=l9_519;
float l9_588=l9_528;
float2 l9_589=l9_585;
int l9_590=l9_586;
int l9_591=l9_587;
float3 l9_592=float3(0.0);
if (l9_590==0)
{
l9_592=float3(l9_589,0.0);
}
else
{
if (l9_590==1)
{
l9_592=float3(l9_589.x,(l9_589.y*0.5)+(0.5-(float(l9_591)*0.5)),0.0);
}
else
{
l9_592=float3(l9_589,float(l9_591));
}
}
float3 l9_593=l9_592;
float3 l9_594=l9_593;
float4 l9_595=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_594.xy,bias(l9_588));
float4 l9_596=l9_595;
if (l9_526)
{
l9_596=mix(l9_527,l9_596,float4(l9_530));
}
float4 l9_597=l9_596;
l9_511=l9_597;
float4 l9_598=l9_511;
float3 l9_599=l9_598.xyz;
float3 l9_600=l9_599;
int l9_601=l9_403;
float l9_602=(float(l9_601)+0.5)/N0_texWidth;
float2 l9_603=float2(l9_602,0.5);
float4 l9_604=float4(0.0);
int l9_605;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_606=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_606=0;
}
else
{
l9_606=in.varStereoViewID;
}
int l9_607=l9_606;
l9_605=1-l9_607;
}
else
{
int l9_608=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_608=0;
}
else
{
l9_608=in.varStereoViewID;
}
int l9_609=l9_608;
l9_605=l9_609;
}
int l9_610=l9_605;
int l9_611=pigmentTexLayout_tmp;
int l9_612=l9_610;
float2 l9_613=l9_603;
bool l9_614=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_615=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_616=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_617=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_618=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_619=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_620=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_621=0.0;
bool l9_622=l9_619&&(!l9_617);
float l9_623=1.0;
float l9_624=l9_613.x;
int l9_625=l9_616.x;
if (l9_625==1)
{
l9_624=fract(l9_624);
}
else
{
if (l9_625==2)
{
float l9_626=fract(l9_624);
float l9_627=l9_624-l9_626;
float l9_628=step(0.25,fract(l9_627*0.5));
l9_624=mix(l9_626,1.0-l9_626,fast::clamp(l9_628,0.0,1.0));
}
}
l9_613.x=l9_624;
float l9_629=l9_613.y;
int l9_630=l9_616.y;
if (l9_630==1)
{
l9_629=fract(l9_629);
}
else
{
if (l9_630==2)
{
float l9_631=fract(l9_629);
float l9_632=l9_629-l9_631;
float l9_633=step(0.25,fract(l9_632*0.5));
l9_629=mix(l9_631,1.0-l9_631,fast::clamp(l9_633,0.0,1.0));
}
}
l9_613.y=l9_629;
if (l9_617)
{
bool l9_634=l9_619;
bool l9_635;
if (l9_634)
{
l9_635=l9_616.x==3;
}
else
{
l9_635=l9_634;
}
float l9_636=l9_613.x;
float l9_637=l9_618.x;
float l9_638=l9_618.z;
bool l9_639=l9_635;
float l9_640=l9_623;
float l9_641=fast::clamp(l9_636,l9_637,l9_638);
float l9_642=step(abs(l9_636-l9_641),9.9999997e-06);
l9_640*=(l9_642+((1.0-float(l9_639))*(1.0-l9_642)));
l9_636=l9_641;
l9_613.x=l9_636;
l9_623=l9_640;
bool l9_643=l9_619;
bool l9_644;
if (l9_643)
{
l9_644=l9_616.y==3;
}
else
{
l9_644=l9_643;
}
float l9_645=l9_613.y;
float l9_646=l9_618.y;
float l9_647=l9_618.w;
bool l9_648=l9_644;
float l9_649=l9_623;
float l9_650=fast::clamp(l9_645,l9_646,l9_647);
float l9_651=step(abs(l9_645-l9_650),9.9999997e-06);
l9_649*=(l9_651+((1.0-float(l9_648))*(1.0-l9_651)));
l9_645=l9_650;
l9_613.y=l9_645;
l9_623=l9_649;
}
float2 l9_652=l9_613;
bool l9_653=l9_614;
float3x3 l9_654=l9_615;
if (l9_653)
{
l9_652=float2((l9_654*float3(l9_652,1.0)).xy);
}
float2 l9_655=l9_652;
l9_613=l9_655;
float l9_656=l9_613.x;
int l9_657=l9_616.x;
bool l9_658=l9_622;
float l9_659=l9_623;
if ((l9_657==0)||(l9_657==3))
{
float l9_660=l9_656;
float l9_661=0.0;
float l9_662=1.0;
bool l9_663=l9_658;
float l9_664=l9_659;
float l9_665=fast::clamp(l9_660,l9_661,l9_662);
float l9_666=step(abs(l9_660-l9_665),9.9999997e-06);
l9_664*=(l9_666+((1.0-float(l9_663))*(1.0-l9_666)));
l9_660=l9_665;
l9_656=l9_660;
l9_659=l9_664;
}
l9_613.x=l9_656;
l9_623=l9_659;
float l9_667=l9_613.y;
int l9_668=l9_616.y;
bool l9_669=l9_622;
float l9_670=l9_623;
if ((l9_668==0)||(l9_668==3))
{
float l9_671=l9_667;
float l9_672=0.0;
float l9_673=1.0;
bool l9_674=l9_669;
float l9_675=l9_670;
float l9_676=fast::clamp(l9_671,l9_672,l9_673);
float l9_677=step(abs(l9_671-l9_676),9.9999997e-06);
l9_675*=(l9_677+((1.0-float(l9_674))*(1.0-l9_677)));
l9_671=l9_676;
l9_667=l9_671;
l9_670=l9_675;
}
l9_613.y=l9_667;
l9_623=l9_670;
float2 l9_678=l9_613;
int l9_679=l9_611;
int l9_680=l9_612;
float l9_681=l9_621;
float2 l9_682=l9_678;
int l9_683=l9_679;
int l9_684=l9_680;
float3 l9_685=float3(0.0);
if (l9_683==0)
{
l9_685=float3(l9_682,0.0);
}
else
{
if (l9_683==1)
{
l9_685=float3(l9_682.x,(l9_682.y*0.5)+(0.5-(float(l9_684)*0.5)),0.0);
}
else
{
l9_685=float3(l9_682,float(l9_684));
}
}
float3 l9_686=l9_685;
float3 l9_687=l9_686;
float4 l9_688=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_687.xy,bias(l9_681));
float4 l9_689=l9_688;
if (l9_619)
{
l9_689=mix(l9_620,l9_689,float4(l9_623));
}
float4 l9_690=l9_689;
l9_604=l9_690;
float4 l9_691=l9_604;
float3 l9_692=l9_691.xyz;
float3 l9_693=l9_692;
float3 l9_694=l9_507;
float3 l9_695=l9_600;
float3 l9_696=l9_693;
float l9_697=l9_412;
float l9_698=l9_413;
float l9_699=l9_414;
float l9_700=(l9_697+l9_698)+l9_699;
float l9_701=l9_697/fast::max(l9_700,0.001);
float l9_702=l9_698/fast::max(l9_700,0.001);
float l9_703=l9_699/fast::max(l9_700,0.001);
float3 l9_704=float3(0.0);
float l9_705=l9_694.x;
float l9_706=1.0-l9_705;
float l9_707=2.0;
float l9_708;
if (l9_706<=0.0)
{
l9_708=0.0;
}
else
{
l9_708=pow(l9_706,l9_707);
}
float l9_709=l9_708;
float l9_710=l9_709/(2.0*fast::max(l9_705,9.9999997e-05));
float l9_711=l9_710;
float l9_712=l9_701;
float l9_713=l9_695.x;
float l9_714=1.0-l9_713;
float l9_715=2.0;
float l9_716;
if (l9_714<=0.0)
{
l9_716=0.0;
}
else
{
l9_716=pow(l9_714,l9_715);
}
float l9_717=l9_716;
float l9_718=l9_717/(2.0*fast::max(l9_713,9.9999997e-05));
float l9_719=l9_718;
float l9_720=l9_702;
float l9_721=l9_696.x;
float l9_722=1.0-l9_721;
float l9_723=2.0;
float l9_724;
if (l9_722<=0.0)
{
l9_724=0.0;
}
else
{
l9_724=pow(l9_722,l9_723);
}
float l9_725=l9_724;
float l9_726=l9_725/(2.0*fast::max(l9_721,9.9999997e-05));
float l9_727=((l9_711*l9_712)+(l9_719*l9_720))+(l9_726*l9_703);
float l9_728=l9_727;
float l9_729=l9_728;
float l9_730=(l9_728*l9_728)+(2.0*l9_728);
float l9_731;
if (l9_730<=0.0)
{
l9_731=0.0;
}
else
{
l9_731=sqrt(l9_730);
}
float l9_732=l9_731;
float l9_733=(1.0+l9_729)-l9_732;
l9_704.x=l9_733;
float l9_734=l9_694.y;
float l9_735=1.0-l9_734;
float l9_736=2.0;
float l9_737;
if (l9_735<=0.0)
{
l9_737=0.0;
}
else
{
l9_737=pow(l9_735,l9_736);
}
float l9_738=l9_737;
float l9_739=l9_738/(2.0*fast::max(l9_734,9.9999997e-05));
float l9_740=l9_739;
float l9_741=l9_701;
float l9_742=l9_695.y;
float l9_743=1.0-l9_742;
float l9_744=2.0;
float l9_745;
if (l9_743<=0.0)
{
l9_745=0.0;
}
else
{
l9_745=pow(l9_743,l9_744);
}
float l9_746=l9_745;
float l9_747=l9_746/(2.0*fast::max(l9_742,9.9999997e-05));
float l9_748=l9_747;
float l9_749=l9_702;
float l9_750=l9_696.y;
float l9_751=1.0-l9_750;
float l9_752=2.0;
float l9_753;
if (l9_751<=0.0)
{
l9_753=0.0;
}
else
{
l9_753=pow(l9_751,l9_752);
}
float l9_754=l9_753;
float l9_755=l9_754/(2.0*fast::max(l9_750,9.9999997e-05));
l9_727=((l9_740*l9_741)+(l9_748*l9_749))+(l9_755*l9_703);
float l9_756=l9_727;
float l9_757=l9_756;
float l9_758=(l9_756*l9_756)+(2.0*l9_756);
float l9_759;
if (l9_758<=0.0)
{
l9_759=0.0;
}
else
{
l9_759=sqrt(l9_758);
}
float l9_760=l9_759;
float l9_761=(1.0+l9_757)-l9_760;
l9_704.y=l9_761;
float l9_762=l9_694.z;
float l9_763=1.0-l9_762;
float l9_764=2.0;
float l9_765;
if (l9_763<=0.0)
{
l9_765=0.0;
}
else
{
l9_765=pow(l9_763,l9_764);
}
float l9_766=l9_765;
float l9_767=l9_766/(2.0*fast::max(l9_762,9.9999997e-05));
float l9_768=l9_767;
float l9_769=l9_701;
float l9_770=l9_695.z;
float l9_771=1.0-l9_770;
float l9_772=2.0;
float l9_773;
if (l9_771<=0.0)
{
l9_773=0.0;
}
else
{
l9_773=pow(l9_771,l9_772);
}
float l9_774=l9_773;
float l9_775=l9_774/(2.0*fast::max(l9_770,9.9999997e-05));
float l9_776=l9_775;
float l9_777=l9_702;
float l9_778=l9_696.z;
float l9_779=1.0-l9_778;
float l9_780=2.0;
float l9_781;
if (l9_779<=0.0)
{
l9_781=0.0;
}
else
{
l9_781=pow(l9_779,l9_780);
}
float l9_782=l9_781;
float l9_783=l9_782/(2.0*fast::max(l9_778,9.9999997e-05));
l9_727=((l9_768*l9_769)+(l9_776*l9_777))+(l9_783*l9_703);
float l9_784=l9_727;
float l9_785=l9_784;
float l9_786=(l9_784*l9_784)+(2.0*l9_784);
float l9_787;
if (l9_786<=0.0)
{
l9_787=0.0;
}
else
{
l9_787=sqrt(l9_786);
}
float l9_788=l9_787;
float l9_789=(1.0+l9_785)-l9_788;
l9_704.z=l9_789;
float3 l9_790=fast::clamp(l9_704,float3(0.0),float3(1.0));
l9_34=l9_790;
l9_35=1.0;
l9_36=float(l9_401);
l9_37=float(l9_402);
l9_38=float(l9_403);
}
}
}
float3 l9_791=l9_34;
float l9_792;
if (l9_791.x>0.040449999)
{
float l9_793=(l9_791.x+0.055)/1.0549999;
float l9_794=2.4000001;
float l9_795;
if (l9_793<=0.0)
{
l9_795=0.0;
}
else
{
l9_795=pow(l9_793,l9_794);
}
float l9_796=l9_795;
l9_792=l9_796;
}
else
{
l9_792=l9_791.x/12.92;
}
float l9_797=l9_792;
float l9_798;
if (l9_791.y>0.040449999)
{
float l9_799=(l9_791.y+0.055)/1.0549999;
float l9_800=2.4000001;
float l9_801;
if (l9_799<=0.0)
{
l9_801=0.0;
}
else
{
l9_801=pow(l9_799,l9_800);
}
float l9_802=l9_801;
l9_798=l9_802;
}
else
{
l9_798=l9_791.y/12.92;
}
float l9_803=l9_798;
float l9_804;
if (l9_791.z>0.040449999)
{
float l9_805=(l9_791.z+0.055)/1.0549999;
float l9_806=2.4000001;
float l9_807;
if (l9_805<=0.0)
{
l9_807=0.0;
}
else
{
l9_807=pow(l9_805,l9_806);
}
float l9_808=l9_807;
l9_804=l9_808;
}
else
{
l9_804=l9_791.z/12.92;
}
float l9_809=l9_804;
float l9_810=((l9_797*0.41245639)+(l9_803*0.3575761))+(l9_809*0.18043751);
float l9_811=((l9_797*0.2126729)+(l9_803*0.7151522))+(l9_809*0.072175004);
float l9_812=((l9_797*0.019333901)+(l9_803*0.119192))+(l9_809*0.95030409);
l9_810/=0.95046997;
l9_811/=1.0;
l9_812/=1.08883;
float l9_813=0.20689656;
float l9_814=(l9_813*l9_813)*l9_813;
float l9_815=1.0/((3.0*l9_813)*l9_813);
float l9_816=0.13793103;
float l9_817;
if (l9_810>l9_814)
{
float l9_818=l9_810;
float l9_819=0.33333334;
float l9_820;
if (l9_818<=0.0)
{
l9_820=0.0;
}
else
{
l9_820=pow(l9_818,l9_819);
}
float l9_821=l9_820;
l9_817=l9_821;
}
else
{
l9_817=(l9_815*l9_810)+l9_816;
}
float l9_822=l9_817;
float l9_823;
if (l9_811>l9_814)
{
float l9_824=l9_811;
float l9_825=0.33333334;
float l9_826;
if (l9_824<=0.0)
{
l9_826=0.0;
}
else
{
l9_826=pow(l9_824,l9_825);
}
float l9_827=l9_826;
l9_823=l9_827;
}
else
{
l9_823=(l9_815*l9_811)+l9_816;
}
float l9_828=l9_823;
float l9_829;
if (l9_812>l9_814)
{
float l9_830=l9_812;
float l9_831=0.33333334;
float l9_832;
if (l9_830<=0.0)
{
l9_832=0.0;
}
else
{
l9_832=pow(l9_830,l9_831);
}
float l9_833=l9_832;
l9_829=l9_833;
}
else
{
l9_829=(l9_815*l9_812)+l9_816;
}
float l9_834=l9_829;
float l9_835=(116.0*l9_828)-16.0;
float l9_836=500.0*(l9_822-l9_828);
float l9_837=200.0*(l9_828-l9_834);
float3 l9_838=float3(l9_835,l9_836,l9_837);
float3 l9_839=l9_838;
float l9_840=l9_839.x/100.0;
float l9_841=fast::clamp(l9_840,0.0,1.0)*65535.0;
float l9_842=floor(l9_841/256.0);
float l9_843=l9_841-(l9_842*256.0);
float2 l9_844=float2(l9_842/255.0,l9_843/255.0);
float2 l9_845=l9_844;
float l9_846=l9_839.y;
float l9_847=150.0;
float l9_848=(l9_846+l9_847)/(2.0*l9_847);
float l9_849=l9_848;
float l9_850=fast::clamp(l9_849,0.0,1.0)*65535.0;
float l9_851=floor(l9_850/256.0);
float l9_852=l9_850-(l9_851*256.0);
float2 l9_853=float2(l9_851/255.0,l9_852/255.0);
float2 l9_854=l9_853;
float2 l9_855=l9_854;
float l9_856=l9_839.z;
float l9_857=150.0;
float l9_858=(l9_856+l9_857)/(2.0*l9_857);
float l9_859=l9_858;
float l9_860=fast::clamp(l9_859,0.0,1.0)*65535.0;
float l9_861=floor(l9_860/256.0);
float l9_862=l9_860-(l9_861*256.0);
float2 l9_863=float2(l9_861/255.0,l9_862/255.0);
float2 l9_864=l9_863;
float2 l9_865=l9_864;
N0_labPosLA=float4(l9_845.x,l9_845.y,l9_855.x,l9_855.y)*l9_35;
N0_labPosBV=float4(l9_865.x,l9_865.y,l9_35,0.0);
N0_rgbCol=float4(l9_34*l9_35,l9_35);
N0_mixInfo=float4(l9_36/15.0,l9_37/15.0,l9_38/15.0,l9_39)*l9_35;
param_9=N0_labPosLA;
labPosLA_N0=param_9;
FinalColor=labPosLA_N0;
float param_11=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_11<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_866=gl_FragCoord;
float2 l9_867=floor(mod(l9_866.xy,float2(4.0)));
float l9_868=(mod(dot(l9_867,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_11<l9_868)
{
discard_fragment();
}
}
float Output_N2_1=0.0;
float param_12=(*sc_set0.UserUniforms).numPigments;
Output_N2_1=param_12;
float Output_N3_1=0.0;
float param_13=(*sc_set0.UserUniforms).texWidth;
Output_N3_1=param_13;
float Output_N6_1=0.0;
float param_14=(*sc_set0.UserUniforms).texSize;
Output_N6_1=param_14;
float Output_N5_1=0.0;
float param_15=(*sc_set0.UserUniforms).mixSteps;
Output_N5_1=param_15;
float4 labPosBV_N0=float4(0.0);
float param_16=Output_N2_1;
float param_17=Output_N3_1;
float param_18=Output_N6_1;
float param_19=Output_N5_1;
ssGlobals param_21=Globals;
tempGlobals=param_21;
float4 param_20=float4(0.0);
N0_numPigments=param_16;
N0_texWidth=param_17;
N0_texSize=param_18;
N0_mixSteps=param_19;
float2 l9_869=tempGlobals.gScreenCoord;
float2 l9_870=l9_869;
float l9_871=floor(l9_870.x*N0_texSize);
float l9_872=floor(l9_870.y*N0_texSize);
float l9_873=(l9_872*N0_texSize)+l9_871;
int l9_874=int(l9_873);
int l9_875=int(N0_numPigments);
int l9_876=int(N0_mixSteps);
int l9_877=l9_875;
int l9_878=(l9_875*(l9_875-1))/2;
int l9_879=l9_878*(l9_876-1);
int l9_880=((l9_875*(l9_875-1))*(l9_875-2))/6;
int l9_881=0;
int l9_882=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_882<64)
{
if (l9_882>=(l9_876-1))
{
break;
}
int l9_883=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_883<64)
{
if (l9_883>=(l9_876-l9_882))
{
break;
}
l9_881++;
l9_883++;
continue;
}
else
{
break;
}
}
l9_882++;
continue;
}
else
{
break;
}
}
int l9_884=l9_880*l9_881;
int l9_885=(l9_877+l9_879)+l9_884;
float3 l9_886=float3(0.0);
float l9_887=0.0;
float l9_888=0.0;
float l9_889=0.0;
float l9_890=0.0;
float l9_891=0.0;
if (l9_874<l9_877)
{
int l9_892=l9_874;
float l9_893=(float(l9_892)+0.5)/N0_texWidth;
float2 l9_894=float2(l9_893,0.5);
float4 l9_895=float4(0.0);
int l9_896;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_897=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_897=0;
}
else
{
l9_897=in.varStereoViewID;
}
int l9_898=l9_897;
l9_896=1-l9_898;
}
else
{
int l9_899=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_899=0;
}
else
{
l9_899=in.varStereoViewID;
}
int l9_900=l9_899;
l9_896=l9_900;
}
int l9_901=l9_896;
int l9_902=pigmentTexLayout_tmp;
int l9_903=l9_901;
float2 l9_904=l9_894;
bool l9_905=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_906=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_907=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_908=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_909=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_910=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_911=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_912=0.0;
bool l9_913=l9_910&&(!l9_908);
float l9_914=1.0;
float l9_915=l9_904.x;
int l9_916=l9_907.x;
if (l9_916==1)
{
l9_915=fract(l9_915);
}
else
{
if (l9_916==2)
{
float l9_917=fract(l9_915);
float l9_918=l9_915-l9_917;
float l9_919=step(0.25,fract(l9_918*0.5));
l9_915=mix(l9_917,1.0-l9_917,fast::clamp(l9_919,0.0,1.0));
}
}
l9_904.x=l9_915;
float l9_920=l9_904.y;
int l9_921=l9_907.y;
if (l9_921==1)
{
l9_920=fract(l9_920);
}
else
{
if (l9_921==2)
{
float l9_922=fract(l9_920);
float l9_923=l9_920-l9_922;
float l9_924=step(0.25,fract(l9_923*0.5));
l9_920=mix(l9_922,1.0-l9_922,fast::clamp(l9_924,0.0,1.0));
}
}
l9_904.y=l9_920;
if (l9_908)
{
bool l9_925=l9_910;
bool l9_926;
if (l9_925)
{
l9_926=l9_907.x==3;
}
else
{
l9_926=l9_925;
}
float l9_927=l9_904.x;
float l9_928=l9_909.x;
float l9_929=l9_909.z;
bool l9_930=l9_926;
float l9_931=l9_914;
float l9_932=fast::clamp(l9_927,l9_928,l9_929);
float l9_933=step(abs(l9_927-l9_932),9.9999997e-06);
l9_931*=(l9_933+((1.0-float(l9_930))*(1.0-l9_933)));
l9_927=l9_932;
l9_904.x=l9_927;
l9_914=l9_931;
bool l9_934=l9_910;
bool l9_935;
if (l9_934)
{
l9_935=l9_907.y==3;
}
else
{
l9_935=l9_934;
}
float l9_936=l9_904.y;
float l9_937=l9_909.y;
float l9_938=l9_909.w;
bool l9_939=l9_935;
float l9_940=l9_914;
float l9_941=fast::clamp(l9_936,l9_937,l9_938);
float l9_942=step(abs(l9_936-l9_941),9.9999997e-06);
l9_940*=(l9_942+((1.0-float(l9_939))*(1.0-l9_942)));
l9_936=l9_941;
l9_904.y=l9_936;
l9_914=l9_940;
}
float2 l9_943=l9_904;
bool l9_944=l9_905;
float3x3 l9_945=l9_906;
if (l9_944)
{
l9_943=float2((l9_945*float3(l9_943,1.0)).xy);
}
float2 l9_946=l9_943;
l9_904=l9_946;
float l9_947=l9_904.x;
int l9_948=l9_907.x;
bool l9_949=l9_913;
float l9_950=l9_914;
if ((l9_948==0)||(l9_948==3))
{
float l9_951=l9_947;
float l9_952=0.0;
float l9_953=1.0;
bool l9_954=l9_949;
float l9_955=l9_950;
float l9_956=fast::clamp(l9_951,l9_952,l9_953);
float l9_957=step(abs(l9_951-l9_956),9.9999997e-06);
l9_955*=(l9_957+((1.0-float(l9_954))*(1.0-l9_957)));
l9_951=l9_956;
l9_947=l9_951;
l9_950=l9_955;
}
l9_904.x=l9_947;
l9_914=l9_950;
float l9_958=l9_904.y;
int l9_959=l9_907.y;
bool l9_960=l9_913;
float l9_961=l9_914;
if ((l9_959==0)||(l9_959==3))
{
float l9_962=l9_958;
float l9_963=0.0;
float l9_964=1.0;
bool l9_965=l9_960;
float l9_966=l9_961;
float l9_967=fast::clamp(l9_962,l9_963,l9_964);
float l9_968=step(abs(l9_962-l9_967),9.9999997e-06);
l9_966*=(l9_968+((1.0-float(l9_965))*(1.0-l9_968)));
l9_962=l9_967;
l9_958=l9_962;
l9_961=l9_966;
}
l9_904.y=l9_958;
l9_914=l9_961;
float2 l9_969=l9_904;
int l9_970=l9_902;
int l9_971=l9_903;
float l9_972=l9_912;
float2 l9_973=l9_969;
int l9_974=l9_970;
int l9_975=l9_971;
float3 l9_976=float3(0.0);
if (l9_974==0)
{
l9_976=float3(l9_973,0.0);
}
else
{
if (l9_974==1)
{
l9_976=float3(l9_973.x,(l9_973.y*0.5)+(0.5-(float(l9_975)*0.5)),0.0);
}
else
{
l9_976=float3(l9_973,float(l9_975));
}
}
float3 l9_977=l9_976;
float3 l9_978=l9_977;
float4 l9_979=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_978.xy,bias(l9_972));
float4 l9_980=l9_979;
if (l9_910)
{
l9_980=mix(l9_911,l9_980,float4(l9_914));
}
float4 l9_981=l9_980;
l9_895=l9_981;
float4 l9_982=l9_895;
float3 l9_983=l9_982.xyz;
l9_886=l9_983;
l9_887=1.0;
l9_888=float(l9_874);
}
else
{
if (l9_874<(l9_877+l9_879))
{
int l9_984=l9_874-l9_877;
int l9_985=l9_984/(l9_876-1);
int l9_986=l9_984-(l9_985*(l9_876-1));
int l9_987=0;
int l9_988=0;
int l9_989=1;
int l9_990=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_990<16)
{
if (l9_990>=l9_875)
{
break;
}
int l9_991=l9_990+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_991<16)
{
if (l9_991>=l9_875)
{
break;
}
if (l9_987==l9_985)
{
l9_988=l9_990;
l9_989=l9_991;
}
l9_987++;
l9_991++;
continue;
}
else
{
break;
}
}
l9_990++;
continue;
}
else
{
break;
}
}
float l9_992=float(l9_986+1)/float(l9_876);
int l9_993=l9_988;
float l9_994=(float(l9_993)+0.5)/N0_texWidth;
float2 l9_995=float2(l9_994,0.5);
float4 l9_996=float4(0.0);
int l9_997;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_998=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_998=0;
}
else
{
l9_998=in.varStereoViewID;
}
int l9_999=l9_998;
l9_997=1-l9_999;
}
else
{
int l9_1000=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1000=0;
}
else
{
l9_1000=in.varStereoViewID;
}
int l9_1001=l9_1000;
l9_997=l9_1001;
}
int l9_1002=l9_997;
int l9_1003=pigmentTexLayout_tmp;
int l9_1004=l9_1002;
float2 l9_1005=l9_995;
bool l9_1006=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1007=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1008=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1009=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1010=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1011=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1012=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1013=0.0;
bool l9_1014=l9_1011&&(!l9_1009);
float l9_1015=1.0;
float l9_1016=l9_1005.x;
int l9_1017=l9_1008.x;
if (l9_1017==1)
{
l9_1016=fract(l9_1016);
}
else
{
if (l9_1017==2)
{
float l9_1018=fract(l9_1016);
float l9_1019=l9_1016-l9_1018;
float l9_1020=step(0.25,fract(l9_1019*0.5));
l9_1016=mix(l9_1018,1.0-l9_1018,fast::clamp(l9_1020,0.0,1.0));
}
}
l9_1005.x=l9_1016;
float l9_1021=l9_1005.y;
int l9_1022=l9_1008.y;
if (l9_1022==1)
{
l9_1021=fract(l9_1021);
}
else
{
if (l9_1022==2)
{
float l9_1023=fract(l9_1021);
float l9_1024=l9_1021-l9_1023;
float l9_1025=step(0.25,fract(l9_1024*0.5));
l9_1021=mix(l9_1023,1.0-l9_1023,fast::clamp(l9_1025,0.0,1.0));
}
}
l9_1005.y=l9_1021;
if (l9_1009)
{
bool l9_1026=l9_1011;
bool l9_1027;
if (l9_1026)
{
l9_1027=l9_1008.x==3;
}
else
{
l9_1027=l9_1026;
}
float l9_1028=l9_1005.x;
float l9_1029=l9_1010.x;
float l9_1030=l9_1010.z;
bool l9_1031=l9_1027;
float l9_1032=l9_1015;
float l9_1033=fast::clamp(l9_1028,l9_1029,l9_1030);
float l9_1034=step(abs(l9_1028-l9_1033),9.9999997e-06);
l9_1032*=(l9_1034+((1.0-float(l9_1031))*(1.0-l9_1034)));
l9_1028=l9_1033;
l9_1005.x=l9_1028;
l9_1015=l9_1032;
bool l9_1035=l9_1011;
bool l9_1036;
if (l9_1035)
{
l9_1036=l9_1008.y==3;
}
else
{
l9_1036=l9_1035;
}
float l9_1037=l9_1005.y;
float l9_1038=l9_1010.y;
float l9_1039=l9_1010.w;
bool l9_1040=l9_1036;
float l9_1041=l9_1015;
float l9_1042=fast::clamp(l9_1037,l9_1038,l9_1039);
float l9_1043=step(abs(l9_1037-l9_1042),9.9999997e-06);
l9_1041*=(l9_1043+((1.0-float(l9_1040))*(1.0-l9_1043)));
l9_1037=l9_1042;
l9_1005.y=l9_1037;
l9_1015=l9_1041;
}
float2 l9_1044=l9_1005;
bool l9_1045=l9_1006;
float3x3 l9_1046=l9_1007;
if (l9_1045)
{
l9_1044=float2((l9_1046*float3(l9_1044,1.0)).xy);
}
float2 l9_1047=l9_1044;
l9_1005=l9_1047;
float l9_1048=l9_1005.x;
int l9_1049=l9_1008.x;
bool l9_1050=l9_1014;
float l9_1051=l9_1015;
if ((l9_1049==0)||(l9_1049==3))
{
float l9_1052=l9_1048;
float l9_1053=0.0;
float l9_1054=1.0;
bool l9_1055=l9_1050;
float l9_1056=l9_1051;
float l9_1057=fast::clamp(l9_1052,l9_1053,l9_1054);
float l9_1058=step(abs(l9_1052-l9_1057),9.9999997e-06);
l9_1056*=(l9_1058+((1.0-float(l9_1055))*(1.0-l9_1058)));
l9_1052=l9_1057;
l9_1048=l9_1052;
l9_1051=l9_1056;
}
l9_1005.x=l9_1048;
l9_1015=l9_1051;
float l9_1059=l9_1005.y;
int l9_1060=l9_1008.y;
bool l9_1061=l9_1014;
float l9_1062=l9_1015;
if ((l9_1060==0)||(l9_1060==3))
{
float l9_1063=l9_1059;
float l9_1064=0.0;
float l9_1065=1.0;
bool l9_1066=l9_1061;
float l9_1067=l9_1062;
float l9_1068=fast::clamp(l9_1063,l9_1064,l9_1065);
float l9_1069=step(abs(l9_1063-l9_1068),9.9999997e-06);
l9_1067*=(l9_1069+((1.0-float(l9_1066))*(1.0-l9_1069)));
l9_1063=l9_1068;
l9_1059=l9_1063;
l9_1062=l9_1067;
}
l9_1005.y=l9_1059;
l9_1015=l9_1062;
float2 l9_1070=l9_1005;
int l9_1071=l9_1003;
int l9_1072=l9_1004;
float l9_1073=l9_1013;
float2 l9_1074=l9_1070;
int l9_1075=l9_1071;
int l9_1076=l9_1072;
float3 l9_1077=float3(0.0);
if (l9_1075==0)
{
l9_1077=float3(l9_1074,0.0);
}
else
{
if (l9_1075==1)
{
l9_1077=float3(l9_1074.x,(l9_1074.y*0.5)+(0.5-(float(l9_1076)*0.5)),0.0);
}
else
{
l9_1077=float3(l9_1074,float(l9_1076));
}
}
float3 l9_1078=l9_1077;
float3 l9_1079=l9_1078;
float4 l9_1080=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_1079.xy,bias(l9_1073));
float4 l9_1081=l9_1080;
if (l9_1011)
{
l9_1081=mix(l9_1012,l9_1081,float4(l9_1015));
}
float4 l9_1082=l9_1081;
l9_996=l9_1082;
float4 l9_1083=l9_996;
float3 l9_1084=l9_1083.xyz;
float3 l9_1085=l9_1084;
int l9_1086=l9_989;
float l9_1087=(float(l9_1086)+0.5)/N0_texWidth;
float2 l9_1088=float2(l9_1087,0.5);
float4 l9_1089=float4(0.0);
int l9_1090;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_1091=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1091=0;
}
else
{
l9_1091=in.varStereoViewID;
}
int l9_1092=l9_1091;
l9_1090=1-l9_1092;
}
else
{
int l9_1093=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1093=0;
}
else
{
l9_1093=in.varStereoViewID;
}
int l9_1094=l9_1093;
l9_1090=l9_1094;
}
int l9_1095=l9_1090;
int l9_1096=pigmentTexLayout_tmp;
int l9_1097=l9_1095;
float2 l9_1098=l9_1088;
bool l9_1099=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1100=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1101=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1102=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1103=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1104=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1105=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1106=0.0;
bool l9_1107=l9_1104&&(!l9_1102);
float l9_1108=1.0;
float l9_1109=l9_1098.x;
int l9_1110=l9_1101.x;
if (l9_1110==1)
{
l9_1109=fract(l9_1109);
}
else
{
if (l9_1110==2)
{
float l9_1111=fract(l9_1109);
float l9_1112=l9_1109-l9_1111;
float l9_1113=step(0.25,fract(l9_1112*0.5));
l9_1109=mix(l9_1111,1.0-l9_1111,fast::clamp(l9_1113,0.0,1.0));
}
}
l9_1098.x=l9_1109;
float l9_1114=l9_1098.y;
int l9_1115=l9_1101.y;
if (l9_1115==1)
{
l9_1114=fract(l9_1114);
}
else
{
if (l9_1115==2)
{
float l9_1116=fract(l9_1114);
float l9_1117=l9_1114-l9_1116;
float l9_1118=step(0.25,fract(l9_1117*0.5));
l9_1114=mix(l9_1116,1.0-l9_1116,fast::clamp(l9_1118,0.0,1.0));
}
}
l9_1098.y=l9_1114;
if (l9_1102)
{
bool l9_1119=l9_1104;
bool l9_1120;
if (l9_1119)
{
l9_1120=l9_1101.x==3;
}
else
{
l9_1120=l9_1119;
}
float l9_1121=l9_1098.x;
float l9_1122=l9_1103.x;
float l9_1123=l9_1103.z;
bool l9_1124=l9_1120;
float l9_1125=l9_1108;
float l9_1126=fast::clamp(l9_1121,l9_1122,l9_1123);
float l9_1127=step(abs(l9_1121-l9_1126),9.9999997e-06);
l9_1125*=(l9_1127+((1.0-float(l9_1124))*(1.0-l9_1127)));
l9_1121=l9_1126;
l9_1098.x=l9_1121;
l9_1108=l9_1125;
bool l9_1128=l9_1104;
bool l9_1129;
if (l9_1128)
{
l9_1129=l9_1101.y==3;
}
else
{
l9_1129=l9_1128;
}
float l9_1130=l9_1098.y;
float l9_1131=l9_1103.y;
float l9_1132=l9_1103.w;
bool l9_1133=l9_1129;
float l9_1134=l9_1108;
float l9_1135=fast::clamp(l9_1130,l9_1131,l9_1132);
float l9_1136=step(abs(l9_1130-l9_1135),9.9999997e-06);
l9_1134*=(l9_1136+((1.0-float(l9_1133))*(1.0-l9_1136)));
l9_1130=l9_1135;
l9_1098.y=l9_1130;
l9_1108=l9_1134;
}
float2 l9_1137=l9_1098;
bool l9_1138=l9_1099;
float3x3 l9_1139=l9_1100;
if (l9_1138)
{
l9_1137=float2((l9_1139*float3(l9_1137,1.0)).xy);
}
float2 l9_1140=l9_1137;
l9_1098=l9_1140;
float l9_1141=l9_1098.x;
int l9_1142=l9_1101.x;
bool l9_1143=l9_1107;
float l9_1144=l9_1108;
if ((l9_1142==0)||(l9_1142==3))
{
float l9_1145=l9_1141;
float l9_1146=0.0;
float l9_1147=1.0;
bool l9_1148=l9_1143;
float l9_1149=l9_1144;
float l9_1150=fast::clamp(l9_1145,l9_1146,l9_1147);
float l9_1151=step(abs(l9_1145-l9_1150),9.9999997e-06);
l9_1149*=(l9_1151+((1.0-float(l9_1148))*(1.0-l9_1151)));
l9_1145=l9_1150;
l9_1141=l9_1145;
l9_1144=l9_1149;
}
l9_1098.x=l9_1141;
l9_1108=l9_1144;
float l9_1152=l9_1098.y;
int l9_1153=l9_1101.y;
bool l9_1154=l9_1107;
float l9_1155=l9_1108;
if ((l9_1153==0)||(l9_1153==3))
{
float l9_1156=l9_1152;
float l9_1157=0.0;
float l9_1158=1.0;
bool l9_1159=l9_1154;
float l9_1160=l9_1155;
float l9_1161=fast::clamp(l9_1156,l9_1157,l9_1158);
float l9_1162=step(abs(l9_1156-l9_1161),9.9999997e-06);
l9_1160*=(l9_1162+((1.0-float(l9_1159))*(1.0-l9_1162)));
l9_1156=l9_1161;
l9_1152=l9_1156;
l9_1155=l9_1160;
}
l9_1098.y=l9_1152;
l9_1108=l9_1155;
float2 l9_1163=l9_1098;
int l9_1164=l9_1096;
int l9_1165=l9_1097;
float l9_1166=l9_1106;
float2 l9_1167=l9_1163;
int l9_1168=l9_1164;
int l9_1169=l9_1165;
float3 l9_1170=float3(0.0);
if (l9_1168==0)
{
l9_1170=float3(l9_1167,0.0);
}
else
{
if (l9_1168==1)
{
l9_1170=float3(l9_1167.x,(l9_1167.y*0.5)+(0.5-(float(l9_1169)*0.5)),0.0);
}
else
{
l9_1170=float3(l9_1167,float(l9_1169));
}
}
float3 l9_1171=l9_1170;
float3 l9_1172=l9_1171;
float4 l9_1173=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_1172.xy,bias(l9_1166));
float4 l9_1174=l9_1173;
if (l9_1104)
{
l9_1174=mix(l9_1105,l9_1174,float4(l9_1108));
}
float4 l9_1175=l9_1174;
l9_1089=l9_1175;
float4 l9_1176=l9_1089;
float3 l9_1177=l9_1176.xyz;
float3 l9_1178=l9_1177;
float3 l9_1179=l9_1085;
float3 l9_1180=l9_1178;
float l9_1181=l9_992;
float l9_1182=1.0-l9_992;
float l9_1183=l9_1181+l9_1182;
float l9_1184=l9_1181/fast::max(l9_1183,0.001);
float l9_1185=l9_1182/fast::max(l9_1183,0.001);
float3 l9_1186=float3(0.0);
float l9_1187=l9_1179.x;
float l9_1188=1.0-l9_1187;
float l9_1189=2.0;
float l9_1190;
if (l9_1188<=0.0)
{
l9_1190=0.0;
}
else
{
l9_1190=pow(l9_1188,l9_1189);
}
float l9_1191=l9_1190;
float l9_1192=l9_1191/(2.0*fast::max(l9_1187,9.9999997e-05));
float l9_1193=l9_1192;
float l9_1194=l9_1184;
float l9_1195=l9_1180.x;
float l9_1196=1.0-l9_1195;
float l9_1197=2.0;
float l9_1198;
if (l9_1196<=0.0)
{
l9_1198=0.0;
}
else
{
l9_1198=pow(l9_1196,l9_1197);
}
float l9_1199=l9_1198;
float l9_1200=l9_1199/(2.0*fast::max(l9_1195,9.9999997e-05));
float l9_1201=(l9_1193*l9_1194)+(l9_1200*l9_1185);
float l9_1202=l9_1201;
float l9_1203=l9_1202;
float l9_1204=(l9_1202*l9_1202)+(2.0*l9_1202);
float l9_1205;
if (l9_1204<=0.0)
{
l9_1205=0.0;
}
else
{
l9_1205=sqrt(l9_1204);
}
float l9_1206=l9_1205;
float l9_1207=(1.0+l9_1203)-l9_1206;
l9_1186.x=l9_1207;
float l9_1208=l9_1179.y;
float l9_1209=1.0-l9_1208;
float l9_1210=2.0;
float l9_1211;
if (l9_1209<=0.0)
{
l9_1211=0.0;
}
else
{
l9_1211=pow(l9_1209,l9_1210);
}
float l9_1212=l9_1211;
float l9_1213=l9_1212/(2.0*fast::max(l9_1208,9.9999997e-05));
float l9_1214=l9_1213;
float l9_1215=l9_1184;
float l9_1216=l9_1180.y;
float l9_1217=1.0-l9_1216;
float l9_1218=2.0;
float l9_1219;
if (l9_1217<=0.0)
{
l9_1219=0.0;
}
else
{
l9_1219=pow(l9_1217,l9_1218);
}
float l9_1220=l9_1219;
float l9_1221=l9_1220/(2.0*fast::max(l9_1216,9.9999997e-05));
l9_1201=(l9_1214*l9_1215)+(l9_1221*l9_1185);
float l9_1222=l9_1201;
float l9_1223=l9_1222;
float l9_1224=(l9_1222*l9_1222)+(2.0*l9_1222);
float l9_1225;
if (l9_1224<=0.0)
{
l9_1225=0.0;
}
else
{
l9_1225=sqrt(l9_1224);
}
float l9_1226=l9_1225;
float l9_1227=(1.0+l9_1223)-l9_1226;
l9_1186.y=l9_1227;
float l9_1228=l9_1179.z;
float l9_1229=1.0-l9_1228;
float l9_1230=2.0;
float l9_1231;
if (l9_1229<=0.0)
{
l9_1231=0.0;
}
else
{
l9_1231=pow(l9_1229,l9_1230);
}
float l9_1232=l9_1231;
float l9_1233=l9_1232/(2.0*fast::max(l9_1228,9.9999997e-05));
float l9_1234=l9_1233;
float l9_1235=l9_1184;
float l9_1236=l9_1180.z;
float l9_1237=1.0-l9_1236;
float l9_1238=2.0;
float l9_1239;
if (l9_1237<=0.0)
{
l9_1239=0.0;
}
else
{
l9_1239=pow(l9_1237,l9_1238);
}
float l9_1240=l9_1239;
float l9_1241=l9_1240/(2.0*fast::max(l9_1236,9.9999997e-05));
l9_1201=(l9_1234*l9_1235)+(l9_1241*l9_1185);
float l9_1242=l9_1201;
float l9_1243=l9_1242;
float l9_1244=(l9_1242*l9_1242)+(2.0*l9_1242);
float l9_1245;
if (l9_1244<=0.0)
{
l9_1245=0.0;
}
else
{
l9_1245=sqrt(l9_1244);
}
float l9_1246=l9_1245;
float l9_1247=(1.0+l9_1243)-l9_1246;
l9_1186.z=l9_1247;
float3 l9_1248=fast::clamp(l9_1186,float3(0.0),float3(1.0));
l9_886=l9_1248;
l9_887=1.0;
l9_888=float(l9_988);
l9_889=float(l9_989);
l9_891=l9_992;
}
else
{
if (l9_874<l9_885)
{
int l9_1249=(l9_874-l9_877)-l9_879;
int l9_1250=l9_1249/l9_881;
int l9_1251=l9_1249-(l9_1250*l9_881);
int l9_1252=0;
int l9_1253=0;
int l9_1254=1;
int l9_1255=2;
int l9_1256=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1256<16)
{
if (l9_1256>=l9_875)
{
break;
}
int l9_1257=l9_1256+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1257<16)
{
if (l9_1257>=l9_875)
{
break;
}
int l9_1258=l9_1257+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1258<16)
{
if (l9_1258>=l9_875)
{
break;
}
if (l9_1252==l9_1250)
{
l9_1253=l9_1256;
l9_1254=l9_1257;
l9_1255=l9_1258;
}
l9_1252++;
l9_1258++;
continue;
}
else
{
break;
}
}
l9_1257++;
continue;
}
else
{
break;
}
}
l9_1256++;
continue;
}
else
{
break;
}
}
int l9_1259=0;
int l9_1260=1;
int l9_1261=1;
int l9_1262=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1262<64)
{
if (l9_1262>=(l9_876-1))
{
break;
}
int l9_1263=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1263<64)
{
if (l9_1263>=(l9_876-l9_1262))
{
break;
}
if (l9_1259==l9_1251)
{
l9_1260=l9_1262;
l9_1261=l9_1263;
}
l9_1259++;
l9_1263++;
continue;
}
else
{
break;
}
}
l9_1262++;
continue;
}
else
{
break;
}
}
float l9_1264=float(l9_1260)/float(l9_876);
float l9_1265=float(l9_1261)/float(l9_876);
float l9_1266=(1.0-l9_1264)-l9_1265;
int l9_1267=l9_1253;
float l9_1268=(float(l9_1267)+0.5)/N0_texWidth;
float2 l9_1269=float2(l9_1268,0.5);
float4 l9_1270=float4(0.0);
int l9_1271;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_1272=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1272=0;
}
else
{
l9_1272=in.varStereoViewID;
}
int l9_1273=l9_1272;
l9_1271=1-l9_1273;
}
else
{
int l9_1274=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1274=0;
}
else
{
l9_1274=in.varStereoViewID;
}
int l9_1275=l9_1274;
l9_1271=l9_1275;
}
int l9_1276=l9_1271;
int l9_1277=pigmentTexLayout_tmp;
int l9_1278=l9_1276;
float2 l9_1279=l9_1269;
bool l9_1280=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1281=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1282=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1283=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1284=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1285=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1286=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1287=0.0;
bool l9_1288=l9_1285&&(!l9_1283);
float l9_1289=1.0;
float l9_1290=l9_1279.x;
int l9_1291=l9_1282.x;
if (l9_1291==1)
{
l9_1290=fract(l9_1290);
}
else
{
if (l9_1291==2)
{
float l9_1292=fract(l9_1290);
float l9_1293=l9_1290-l9_1292;
float l9_1294=step(0.25,fract(l9_1293*0.5));
l9_1290=mix(l9_1292,1.0-l9_1292,fast::clamp(l9_1294,0.0,1.0));
}
}
l9_1279.x=l9_1290;
float l9_1295=l9_1279.y;
int l9_1296=l9_1282.y;
if (l9_1296==1)
{
l9_1295=fract(l9_1295);
}
else
{
if (l9_1296==2)
{
float l9_1297=fract(l9_1295);
float l9_1298=l9_1295-l9_1297;
float l9_1299=step(0.25,fract(l9_1298*0.5));
l9_1295=mix(l9_1297,1.0-l9_1297,fast::clamp(l9_1299,0.0,1.0));
}
}
l9_1279.y=l9_1295;
if (l9_1283)
{
bool l9_1300=l9_1285;
bool l9_1301;
if (l9_1300)
{
l9_1301=l9_1282.x==3;
}
else
{
l9_1301=l9_1300;
}
float l9_1302=l9_1279.x;
float l9_1303=l9_1284.x;
float l9_1304=l9_1284.z;
bool l9_1305=l9_1301;
float l9_1306=l9_1289;
float l9_1307=fast::clamp(l9_1302,l9_1303,l9_1304);
float l9_1308=step(abs(l9_1302-l9_1307),9.9999997e-06);
l9_1306*=(l9_1308+((1.0-float(l9_1305))*(1.0-l9_1308)));
l9_1302=l9_1307;
l9_1279.x=l9_1302;
l9_1289=l9_1306;
bool l9_1309=l9_1285;
bool l9_1310;
if (l9_1309)
{
l9_1310=l9_1282.y==3;
}
else
{
l9_1310=l9_1309;
}
float l9_1311=l9_1279.y;
float l9_1312=l9_1284.y;
float l9_1313=l9_1284.w;
bool l9_1314=l9_1310;
float l9_1315=l9_1289;
float l9_1316=fast::clamp(l9_1311,l9_1312,l9_1313);
float l9_1317=step(abs(l9_1311-l9_1316),9.9999997e-06);
l9_1315*=(l9_1317+((1.0-float(l9_1314))*(1.0-l9_1317)));
l9_1311=l9_1316;
l9_1279.y=l9_1311;
l9_1289=l9_1315;
}
float2 l9_1318=l9_1279;
bool l9_1319=l9_1280;
float3x3 l9_1320=l9_1281;
if (l9_1319)
{
l9_1318=float2((l9_1320*float3(l9_1318,1.0)).xy);
}
float2 l9_1321=l9_1318;
l9_1279=l9_1321;
float l9_1322=l9_1279.x;
int l9_1323=l9_1282.x;
bool l9_1324=l9_1288;
float l9_1325=l9_1289;
if ((l9_1323==0)||(l9_1323==3))
{
float l9_1326=l9_1322;
float l9_1327=0.0;
float l9_1328=1.0;
bool l9_1329=l9_1324;
float l9_1330=l9_1325;
float l9_1331=fast::clamp(l9_1326,l9_1327,l9_1328);
float l9_1332=step(abs(l9_1326-l9_1331),9.9999997e-06);
l9_1330*=(l9_1332+((1.0-float(l9_1329))*(1.0-l9_1332)));
l9_1326=l9_1331;
l9_1322=l9_1326;
l9_1325=l9_1330;
}
l9_1279.x=l9_1322;
l9_1289=l9_1325;
float l9_1333=l9_1279.y;
int l9_1334=l9_1282.y;
bool l9_1335=l9_1288;
float l9_1336=l9_1289;
if ((l9_1334==0)||(l9_1334==3))
{
float l9_1337=l9_1333;
float l9_1338=0.0;
float l9_1339=1.0;
bool l9_1340=l9_1335;
float l9_1341=l9_1336;
float l9_1342=fast::clamp(l9_1337,l9_1338,l9_1339);
float l9_1343=step(abs(l9_1337-l9_1342),9.9999997e-06);
l9_1341*=(l9_1343+((1.0-float(l9_1340))*(1.0-l9_1343)));
l9_1337=l9_1342;
l9_1333=l9_1337;
l9_1336=l9_1341;
}
l9_1279.y=l9_1333;
l9_1289=l9_1336;
float2 l9_1344=l9_1279;
int l9_1345=l9_1277;
int l9_1346=l9_1278;
float l9_1347=l9_1287;
float2 l9_1348=l9_1344;
int l9_1349=l9_1345;
int l9_1350=l9_1346;
float3 l9_1351=float3(0.0);
if (l9_1349==0)
{
l9_1351=float3(l9_1348,0.0);
}
else
{
if (l9_1349==1)
{
l9_1351=float3(l9_1348.x,(l9_1348.y*0.5)+(0.5-(float(l9_1350)*0.5)),0.0);
}
else
{
l9_1351=float3(l9_1348,float(l9_1350));
}
}
float3 l9_1352=l9_1351;
float3 l9_1353=l9_1352;
float4 l9_1354=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_1353.xy,bias(l9_1347));
float4 l9_1355=l9_1354;
if (l9_1285)
{
l9_1355=mix(l9_1286,l9_1355,float4(l9_1289));
}
float4 l9_1356=l9_1355;
l9_1270=l9_1356;
float4 l9_1357=l9_1270;
float3 l9_1358=l9_1357.xyz;
float3 l9_1359=l9_1358;
int l9_1360=l9_1254;
float l9_1361=(float(l9_1360)+0.5)/N0_texWidth;
float2 l9_1362=float2(l9_1361,0.5);
float4 l9_1363=float4(0.0);
int l9_1364;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_1365=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1365=0;
}
else
{
l9_1365=in.varStereoViewID;
}
int l9_1366=l9_1365;
l9_1364=1-l9_1366;
}
else
{
int l9_1367=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1367=0;
}
else
{
l9_1367=in.varStereoViewID;
}
int l9_1368=l9_1367;
l9_1364=l9_1368;
}
int l9_1369=l9_1364;
int l9_1370=pigmentTexLayout_tmp;
int l9_1371=l9_1369;
float2 l9_1372=l9_1362;
bool l9_1373=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1374=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1375=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1376=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1377=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1378=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1379=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1380=0.0;
bool l9_1381=l9_1378&&(!l9_1376);
float l9_1382=1.0;
float l9_1383=l9_1372.x;
int l9_1384=l9_1375.x;
if (l9_1384==1)
{
l9_1383=fract(l9_1383);
}
else
{
if (l9_1384==2)
{
float l9_1385=fract(l9_1383);
float l9_1386=l9_1383-l9_1385;
float l9_1387=step(0.25,fract(l9_1386*0.5));
l9_1383=mix(l9_1385,1.0-l9_1385,fast::clamp(l9_1387,0.0,1.0));
}
}
l9_1372.x=l9_1383;
float l9_1388=l9_1372.y;
int l9_1389=l9_1375.y;
if (l9_1389==1)
{
l9_1388=fract(l9_1388);
}
else
{
if (l9_1389==2)
{
float l9_1390=fract(l9_1388);
float l9_1391=l9_1388-l9_1390;
float l9_1392=step(0.25,fract(l9_1391*0.5));
l9_1388=mix(l9_1390,1.0-l9_1390,fast::clamp(l9_1392,0.0,1.0));
}
}
l9_1372.y=l9_1388;
if (l9_1376)
{
bool l9_1393=l9_1378;
bool l9_1394;
if (l9_1393)
{
l9_1394=l9_1375.x==3;
}
else
{
l9_1394=l9_1393;
}
float l9_1395=l9_1372.x;
float l9_1396=l9_1377.x;
float l9_1397=l9_1377.z;
bool l9_1398=l9_1394;
float l9_1399=l9_1382;
float l9_1400=fast::clamp(l9_1395,l9_1396,l9_1397);
float l9_1401=step(abs(l9_1395-l9_1400),9.9999997e-06);
l9_1399*=(l9_1401+((1.0-float(l9_1398))*(1.0-l9_1401)));
l9_1395=l9_1400;
l9_1372.x=l9_1395;
l9_1382=l9_1399;
bool l9_1402=l9_1378;
bool l9_1403;
if (l9_1402)
{
l9_1403=l9_1375.y==3;
}
else
{
l9_1403=l9_1402;
}
float l9_1404=l9_1372.y;
float l9_1405=l9_1377.y;
float l9_1406=l9_1377.w;
bool l9_1407=l9_1403;
float l9_1408=l9_1382;
float l9_1409=fast::clamp(l9_1404,l9_1405,l9_1406);
float l9_1410=step(abs(l9_1404-l9_1409),9.9999997e-06);
l9_1408*=(l9_1410+((1.0-float(l9_1407))*(1.0-l9_1410)));
l9_1404=l9_1409;
l9_1372.y=l9_1404;
l9_1382=l9_1408;
}
float2 l9_1411=l9_1372;
bool l9_1412=l9_1373;
float3x3 l9_1413=l9_1374;
if (l9_1412)
{
l9_1411=float2((l9_1413*float3(l9_1411,1.0)).xy);
}
float2 l9_1414=l9_1411;
l9_1372=l9_1414;
float l9_1415=l9_1372.x;
int l9_1416=l9_1375.x;
bool l9_1417=l9_1381;
float l9_1418=l9_1382;
if ((l9_1416==0)||(l9_1416==3))
{
float l9_1419=l9_1415;
float l9_1420=0.0;
float l9_1421=1.0;
bool l9_1422=l9_1417;
float l9_1423=l9_1418;
float l9_1424=fast::clamp(l9_1419,l9_1420,l9_1421);
float l9_1425=step(abs(l9_1419-l9_1424),9.9999997e-06);
l9_1423*=(l9_1425+((1.0-float(l9_1422))*(1.0-l9_1425)));
l9_1419=l9_1424;
l9_1415=l9_1419;
l9_1418=l9_1423;
}
l9_1372.x=l9_1415;
l9_1382=l9_1418;
float l9_1426=l9_1372.y;
int l9_1427=l9_1375.y;
bool l9_1428=l9_1381;
float l9_1429=l9_1382;
if ((l9_1427==0)||(l9_1427==3))
{
float l9_1430=l9_1426;
float l9_1431=0.0;
float l9_1432=1.0;
bool l9_1433=l9_1428;
float l9_1434=l9_1429;
float l9_1435=fast::clamp(l9_1430,l9_1431,l9_1432);
float l9_1436=step(abs(l9_1430-l9_1435),9.9999997e-06);
l9_1434*=(l9_1436+((1.0-float(l9_1433))*(1.0-l9_1436)));
l9_1430=l9_1435;
l9_1426=l9_1430;
l9_1429=l9_1434;
}
l9_1372.y=l9_1426;
l9_1382=l9_1429;
float2 l9_1437=l9_1372;
int l9_1438=l9_1370;
int l9_1439=l9_1371;
float l9_1440=l9_1380;
float2 l9_1441=l9_1437;
int l9_1442=l9_1438;
int l9_1443=l9_1439;
float3 l9_1444=float3(0.0);
if (l9_1442==0)
{
l9_1444=float3(l9_1441,0.0);
}
else
{
if (l9_1442==1)
{
l9_1444=float3(l9_1441.x,(l9_1441.y*0.5)+(0.5-(float(l9_1443)*0.5)),0.0);
}
else
{
l9_1444=float3(l9_1441,float(l9_1443));
}
}
float3 l9_1445=l9_1444;
float3 l9_1446=l9_1445;
float4 l9_1447=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_1446.xy,bias(l9_1440));
float4 l9_1448=l9_1447;
if (l9_1378)
{
l9_1448=mix(l9_1379,l9_1448,float4(l9_1382));
}
float4 l9_1449=l9_1448;
l9_1363=l9_1449;
float4 l9_1450=l9_1363;
float3 l9_1451=l9_1450.xyz;
float3 l9_1452=l9_1451;
int l9_1453=l9_1255;
float l9_1454=(float(l9_1453)+0.5)/N0_texWidth;
float2 l9_1455=float2(l9_1454,0.5);
float4 l9_1456=float4(0.0);
int l9_1457;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_1458=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1458=0;
}
else
{
l9_1458=in.varStereoViewID;
}
int l9_1459=l9_1458;
l9_1457=1-l9_1459;
}
else
{
int l9_1460=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1460=0;
}
else
{
l9_1460=in.varStereoViewID;
}
int l9_1461=l9_1460;
l9_1457=l9_1461;
}
int l9_1462=l9_1457;
int l9_1463=pigmentTexLayout_tmp;
int l9_1464=l9_1462;
float2 l9_1465=l9_1455;
bool l9_1466=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1467=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1468=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1469=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1470=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1471=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1472=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1473=0.0;
bool l9_1474=l9_1471&&(!l9_1469);
float l9_1475=1.0;
float l9_1476=l9_1465.x;
int l9_1477=l9_1468.x;
if (l9_1477==1)
{
l9_1476=fract(l9_1476);
}
else
{
if (l9_1477==2)
{
float l9_1478=fract(l9_1476);
float l9_1479=l9_1476-l9_1478;
float l9_1480=step(0.25,fract(l9_1479*0.5));
l9_1476=mix(l9_1478,1.0-l9_1478,fast::clamp(l9_1480,0.0,1.0));
}
}
l9_1465.x=l9_1476;
float l9_1481=l9_1465.y;
int l9_1482=l9_1468.y;
if (l9_1482==1)
{
l9_1481=fract(l9_1481);
}
else
{
if (l9_1482==2)
{
float l9_1483=fract(l9_1481);
float l9_1484=l9_1481-l9_1483;
float l9_1485=step(0.25,fract(l9_1484*0.5));
l9_1481=mix(l9_1483,1.0-l9_1483,fast::clamp(l9_1485,0.0,1.0));
}
}
l9_1465.y=l9_1481;
if (l9_1469)
{
bool l9_1486=l9_1471;
bool l9_1487;
if (l9_1486)
{
l9_1487=l9_1468.x==3;
}
else
{
l9_1487=l9_1486;
}
float l9_1488=l9_1465.x;
float l9_1489=l9_1470.x;
float l9_1490=l9_1470.z;
bool l9_1491=l9_1487;
float l9_1492=l9_1475;
float l9_1493=fast::clamp(l9_1488,l9_1489,l9_1490);
float l9_1494=step(abs(l9_1488-l9_1493),9.9999997e-06);
l9_1492*=(l9_1494+((1.0-float(l9_1491))*(1.0-l9_1494)));
l9_1488=l9_1493;
l9_1465.x=l9_1488;
l9_1475=l9_1492;
bool l9_1495=l9_1471;
bool l9_1496;
if (l9_1495)
{
l9_1496=l9_1468.y==3;
}
else
{
l9_1496=l9_1495;
}
float l9_1497=l9_1465.y;
float l9_1498=l9_1470.y;
float l9_1499=l9_1470.w;
bool l9_1500=l9_1496;
float l9_1501=l9_1475;
float l9_1502=fast::clamp(l9_1497,l9_1498,l9_1499);
float l9_1503=step(abs(l9_1497-l9_1502),9.9999997e-06);
l9_1501*=(l9_1503+((1.0-float(l9_1500))*(1.0-l9_1503)));
l9_1497=l9_1502;
l9_1465.y=l9_1497;
l9_1475=l9_1501;
}
float2 l9_1504=l9_1465;
bool l9_1505=l9_1466;
float3x3 l9_1506=l9_1467;
if (l9_1505)
{
l9_1504=float2((l9_1506*float3(l9_1504,1.0)).xy);
}
float2 l9_1507=l9_1504;
l9_1465=l9_1507;
float l9_1508=l9_1465.x;
int l9_1509=l9_1468.x;
bool l9_1510=l9_1474;
float l9_1511=l9_1475;
if ((l9_1509==0)||(l9_1509==3))
{
float l9_1512=l9_1508;
float l9_1513=0.0;
float l9_1514=1.0;
bool l9_1515=l9_1510;
float l9_1516=l9_1511;
float l9_1517=fast::clamp(l9_1512,l9_1513,l9_1514);
float l9_1518=step(abs(l9_1512-l9_1517),9.9999997e-06);
l9_1516*=(l9_1518+((1.0-float(l9_1515))*(1.0-l9_1518)));
l9_1512=l9_1517;
l9_1508=l9_1512;
l9_1511=l9_1516;
}
l9_1465.x=l9_1508;
l9_1475=l9_1511;
float l9_1519=l9_1465.y;
int l9_1520=l9_1468.y;
bool l9_1521=l9_1474;
float l9_1522=l9_1475;
if ((l9_1520==0)||(l9_1520==3))
{
float l9_1523=l9_1519;
float l9_1524=0.0;
float l9_1525=1.0;
bool l9_1526=l9_1521;
float l9_1527=l9_1522;
float l9_1528=fast::clamp(l9_1523,l9_1524,l9_1525);
float l9_1529=step(abs(l9_1523-l9_1528),9.9999997e-06);
l9_1527*=(l9_1529+((1.0-float(l9_1526))*(1.0-l9_1529)));
l9_1523=l9_1528;
l9_1519=l9_1523;
l9_1522=l9_1527;
}
l9_1465.y=l9_1519;
l9_1475=l9_1522;
float2 l9_1530=l9_1465;
int l9_1531=l9_1463;
int l9_1532=l9_1464;
float l9_1533=l9_1473;
float2 l9_1534=l9_1530;
int l9_1535=l9_1531;
int l9_1536=l9_1532;
float3 l9_1537=float3(0.0);
if (l9_1535==0)
{
l9_1537=float3(l9_1534,0.0);
}
else
{
if (l9_1535==1)
{
l9_1537=float3(l9_1534.x,(l9_1534.y*0.5)+(0.5-(float(l9_1536)*0.5)),0.0);
}
else
{
l9_1537=float3(l9_1534,float(l9_1536));
}
}
float3 l9_1538=l9_1537;
float3 l9_1539=l9_1538;
float4 l9_1540=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_1539.xy,bias(l9_1533));
float4 l9_1541=l9_1540;
if (l9_1471)
{
l9_1541=mix(l9_1472,l9_1541,float4(l9_1475));
}
float4 l9_1542=l9_1541;
l9_1456=l9_1542;
float4 l9_1543=l9_1456;
float3 l9_1544=l9_1543.xyz;
float3 l9_1545=l9_1544;
float3 l9_1546=l9_1359;
float3 l9_1547=l9_1452;
float3 l9_1548=l9_1545;
float l9_1549=l9_1264;
float l9_1550=l9_1265;
float l9_1551=l9_1266;
float l9_1552=(l9_1549+l9_1550)+l9_1551;
float l9_1553=l9_1549/fast::max(l9_1552,0.001);
float l9_1554=l9_1550/fast::max(l9_1552,0.001);
float l9_1555=l9_1551/fast::max(l9_1552,0.001);
float3 l9_1556=float3(0.0);
float l9_1557=l9_1546.x;
float l9_1558=1.0-l9_1557;
float l9_1559=2.0;
float l9_1560;
if (l9_1558<=0.0)
{
l9_1560=0.0;
}
else
{
l9_1560=pow(l9_1558,l9_1559);
}
float l9_1561=l9_1560;
float l9_1562=l9_1561/(2.0*fast::max(l9_1557,9.9999997e-05));
float l9_1563=l9_1562;
float l9_1564=l9_1553;
float l9_1565=l9_1547.x;
float l9_1566=1.0-l9_1565;
float l9_1567=2.0;
float l9_1568;
if (l9_1566<=0.0)
{
l9_1568=0.0;
}
else
{
l9_1568=pow(l9_1566,l9_1567);
}
float l9_1569=l9_1568;
float l9_1570=l9_1569/(2.0*fast::max(l9_1565,9.9999997e-05));
float l9_1571=l9_1570;
float l9_1572=l9_1554;
float l9_1573=l9_1548.x;
float l9_1574=1.0-l9_1573;
float l9_1575=2.0;
float l9_1576;
if (l9_1574<=0.0)
{
l9_1576=0.0;
}
else
{
l9_1576=pow(l9_1574,l9_1575);
}
float l9_1577=l9_1576;
float l9_1578=l9_1577/(2.0*fast::max(l9_1573,9.9999997e-05));
float l9_1579=((l9_1563*l9_1564)+(l9_1571*l9_1572))+(l9_1578*l9_1555);
float l9_1580=l9_1579;
float l9_1581=l9_1580;
float l9_1582=(l9_1580*l9_1580)+(2.0*l9_1580);
float l9_1583;
if (l9_1582<=0.0)
{
l9_1583=0.0;
}
else
{
l9_1583=sqrt(l9_1582);
}
float l9_1584=l9_1583;
float l9_1585=(1.0+l9_1581)-l9_1584;
l9_1556.x=l9_1585;
float l9_1586=l9_1546.y;
float l9_1587=1.0-l9_1586;
float l9_1588=2.0;
float l9_1589;
if (l9_1587<=0.0)
{
l9_1589=0.0;
}
else
{
l9_1589=pow(l9_1587,l9_1588);
}
float l9_1590=l9_1589;
float l9_1591=l9_1590/(2.0*fast::max(l9_1586,9.9999997e-05));
float l9_1592=l9_1591;
float l9_1593=l9_1553;
float l9_1594=l9_1547.y;
float l9_1595=1.0-l9_1594;
float l9_1596=2.0;
float l9_1597;
if (l9_1595<=0.0)
{
l9_1597=0.0;
}
else
{
l9_1597=pow(l9_1595,l9_1596);
}
float l9_1598=l9_1597;
float l9_1599=l9_1598/(2.0*fast::max(l9_1594,9.9999997e-05));
float l9_1600=l9_1599;
float l9_1601=l9_1554;
float l9_1602=l9_1548.y;
float l9_1603=1.0-l9_1602;
float l9_1604=2.0;
float l9_1605;
if (l9_1603<=0.0)
{
l9_1605=0.0;
}
else
{
l9_1605=pow(l9_1603,l9_1604);
}
float l9_1606=l9_1605;
float l9_1607=l9_1606/(2.0*fast::max(l9_1602,9.9999997e-05));
l9_1579=((l9_1592*l9_1593)+(l9_1600*l9_1601))+(l9_1607*l9_1555);
float l9_1608=l9_1579;
float l9_1609=l9_1608;
float l9_1610=(l9_1608*l9_1608)+(2.0*l9_1608);
float l9_1611;
if (l9_1610<=0.0)
{
l9_1611=0.0;
}
else
{
l9_1611=sqrt(l9_1610);
}
float l9_1612=l9_1611;
float l9_1613=(1.0+l9_1609)-l9_1612;
l9_1556.y=l9_1613;
float l9_1614=l9_1546.z;
float l9_1615=1.0-l9_1614;
float l9_1616=2.0;
float l9_1617;
if (l9_1615<=0.0)
{
l9_1617=0.0;
}
else
{
l9_1617=pow(l9_1615,l9_1616);
}
float l9_1618=l9_1617;
float l9_1619=l9_1618/(2.0*fast::max(l9_1614,9.9999997e-05));
float l9_1620=l9_1619;
float l9_1621=l9_1553;
float l9_1622=l9_1547.z;
float l9_1623=1.0-l9_1622;
float l9_1624=2.0;
float l9_1625;
if (l9_1623<=0.0)
{
l9_1625=0.0;
}
else
{
l9_1625=pow(l9_1623,l9_1624);
}
float l9_1626=l9_1625;
float l9_1627=l9_1626/(2.0*fast::max(l9_1622,9.9999997e-05));
float l9_1628=l9_1627;
float l9_1629=l9_1554;
float l9_1630=l9_1548.z;
float l9_1631=1.0-l9_1630;
float l9_1632=2.0;
float l9_1633;
if (l9_1631<=0.0)
{
l9_1633=0.0;
}
else
{
l9_1633=pow(l9_1631,l9_1632);
}
float l9_1634=l9_1633;
float l9_1635=l9_1634/(2.0*fast::max(l9_1630,9.9999997e-05));
l9_1579=((l9_1620*l9_1621)+(l9_1628*l9_1629))+(l9_1635*l9_1555);
float l9_1636=l9_1579;
float l9_1637=l9_1636;
float l9_1638=(l9_1636*l9_1636)+(2.0*l9_1636);
float l9_1639;
if (l9_1638<=0.0)
{
l9_1639=0.0;
}
else
{
l9_1639=sqrt(l9_1638);
}
float l9_1640=l9_1639;
float l9_1641=(1.0+l9_1637)-l9_1640;
l9_1556.z=l9_1641;
float3 l9_1642=fast::clamp(l9_1556,float3(0.0),float3(1.0));
l9_886=l9_1642;
l9_887=1.0;
l9_888=float(l9_1253);
l9_889=float(l9_1254);
l9_890=float(l9_1255);
}
}
}
float3 l9_1643=l9_886;
float l9_1644;
if (l9_1643.x>0.040449999)
{
float l9_1645=(l9_1643.x+0.055)/1.0549999;
float l9_1646=2.4000001;
float l9_1647;
if (l9_1645<=0.0)
{
l9_1647=0.0;
}
else
{
l9_1647=pow(l9_1645,l9_1646);
}
float l9_1648=l9_1647;
l9_1644=l9_1648;
}
else
{
l9_1644=l9_1643.x/12.92;
}
float l9_1649=l9_1644;
float l9_1650;
if (l9_1643.y>0.040449999)
{
float l9_1651=(l9_1643.y+0.055)/1.0549999;
float l9_1652=2.4000001;
float l9_1653;
if (l9_1651<=0.0)
{
l9_1653=0.0;
}
else
{
l9_1653=pow(l9_1651,l9_1652);
}
float l9_1654=l9_1653;
l9_1650=l9_1654;
}
else
{
l9_1650=l9_1643.y/12.92;
}
float l9_1655=l9_1650;
float l9_1656;
if (l9_1643.z>0.040449999)
{
float l9_1657=(l9_1643.z+0.055)/1.0549999;
float l9_1658=2.4000001;
float l9_1659;
if (l9_1657<=0.0)
{
l9_1659=0.0;
}
else
{
l9_1659=pow(l9_1657,l9_1658);
}
float l9_1660=l9_1659;
l9_1656=l9_1660;
}
else
{
l9_1656=l9_1643.z/12.92;
}
float l9_1661=l9_1656;
float l9_1662=((l9_1649*0.41245639)+(l9_1655*0.3575761))+(l9_1661*0.18043751);
float l9_1663=((l9_1649*0.2126729)+(l9_1655*0.7151522))+(l9_1661*0.072175004);
float l9_1664=((l9_1649*0.019333901)+(l9_1655*0.119192))+(l9_1661*0.95030409);
l9_1662/=0.95046997;
l9_1663/=1.0;
l9_1664/=1.08883;
float l9_1665=0.20689656;
float l9_1666=(l9_1665*l9_1665)*l9_1665;
float l9_1667=1.0/((3.0*l9_1665)*l9_1665);
float l9_1668=0.13793103;
float l9_1669;
if (l9_1662>l9_1666)
{
float l9_1670=l9_1662;
float l9_1671=0.33333334;
float l9_1672;
if (l9_1670<=0.0)
{
l9_1672=0.0;
}
else
{
l9_1672=pow(l9_1670,l9_1671);
}
float l9_1673=l9_1672;
l9_1669=l9_1673;
}
else
{
l9_1669=(l9_1667*l9_1662)+l9_1668;
}
float l9_1674=l9_1669;
float l9_1675;
if (l9_1663>l9_1666)
{
float l9_1676=l9_1663;
float l9_1677=0.33333334;
float l9_1678;
if (l9_1676<=0.0)
{
l9_1678=0.0;
}
else
{
l9_1678=pow(l9_1676,l9_1677);
}
float l9_1679=l9_1678;
l9_1675=l9_1679;
}
else
{
l9_1675=(l9_1667*l9_1663)+l9_1668;
}
float l9_1680=l9_1675;
float l9_1681;
if (l9_1664>l9_1666)
{
float l9_1682=l9_1664;
float l9_1683=0.33333334;
float l9_1684;
if (l9_1682<=0.0)
{
l9_1684=0.0;
}
else
{
l9_1684=pow(l9_1682,l9_1683);
}
float l9_1685=l9_1684;
l9_1681=l9_1685;
}
else
{
l9_1681=(l9_1667*l9_1664)+l9_1668;
}
float l9_1686=l9_1681;
float l9_1687=(116.0*l9_1680)-16.0;
float l9_1688=500.0*(l9_1674-l9_1680);
float l9_1689=200.0*(l9_1680-l9_1686);
float3 l9_1690=float3(l9_1687,l9_1688,l9_1689);
float3 l9_1691=l9_1690;
float l9_1692=l9_1691.x/100.0;
float l9_1693=fast::clamp(l9_1692,0.0,1.0)*65535.0;
float l9_1694=floor(l9_1693/256.0);
float l9_1695=l9_1693-(l9_1694*256.0);
float2 l9_1696=float2(l9_1694/255.0,l9_1695/255.0);
float2 l9_1697=l9_1696;
float l9_1698=l9_1691.y;
float l9_1699=150.0;
float l9_1700=(l9_1698+l9_1699)/(2.0*l9_1699);
float l9_1701=l9_1700;
float l9_1702=fast::clamp(l9_1701,0.0,1.0)*65535.0;
float l9_1703=floor(l9_1702/256.0);
float l9_1704=l9_1702-(l9_1703*256.0);
float2 l9_1705=float2(l9_1703/255.0,l9_1704/255.0);
float2 l9_1706=l9_1705;
float2 l9_1707=l9_1706;
float l9_1708=l9_1691.z;
float l9_1709=150.0;
float l9_1710=(l9_1708+l9_1709)/(2.0*l9_1709);
float l9_1711=l9_1710;
float l9_1712=fast::clamp(l9_1711,0.0,1.0)*65535.0;
float l9_1713=floor(l9_1712/256.0);
float l9_1714=l9_1712-(l9_1713*256.0);
float2 l9_1715=float2(l9_1713/255.0,l9_1714/255.0);
float2 l9_1716=l9_1715;
float2 l9_1717=l9_1716;
N0_labPosLA=float4(l9_1697.x,l9_1697.y,l9_1707.x,l9_1707.y)*l9_887;
N0_labPosBV=float4(l9_1717.x,l9_1717.y,l9_887,0.0);
N0_rgbCol=float4(l9_886*l9_887,l9_887);
N0_mixInfo=float4(l9_888/15.0,l9_889/15.0,l9_890/15.0,l9_891)*l9_887;
param_20=N0_labPosBV;
labPosBV_N0=param_20;
FinalColor1=labPosBV_N0;
float Output_N2_2=0.0;
float param_22=(*sc_set0.UserUniforms).numPigments;
Output_N2_2=param_22;
float Output_N3_2=0.0;
float param_23=(*sc_set0.UserUniforms).texWidth;
Output_N3_2=param_23;
float Output_N6_2=0.0;
float param_24=(*sc_set0.UserUniforms).texSize;
Output_N6_2=param_24;
float Output_N5_2=0.0;
float param_25=(*sc_set0.UserUniforms).mixSteps;
Output_N5_2=param_25;
float4 rgbCol_N0=float4(0.0);
float param_26=Output_N2_2;
float param_27=Output_N3_2;
float param_28=Output_N6_2;
float param_29=Output_N5_2;
ssGlobals param_31=Globals;
tempGlobals=param_31;
float4 param_30=float4(0.0);
N0_numPigments=param_26;
N0_texWidth=param_27;
N0_texSize=param_28;
N0_mixSteps=param_29;
float2 l9_1718=tempGlobals.gScreenCoord;
float2 l9_1719=l9_1718;
float l9_1720=floor(l9_1719.x*N0_texSize);
float l9_1721=floor(l9_1719.y*N0_texSize);
float l9_1722=(l9_1721*N0_texSize)+l9_1720;
int l9_1723=int(l9_1722);
int l9_1724=int(N0_numPigments);
int l9_1725=int(N0_mixSteps);
int l9_1726=l9_1724;
int l9_1727=(l9_1724*(l9_1724-1))/2;
int l9_1728=l9_1727*(l9_1725-1);
int l9_1729=((l9_1724*(l9_1724-1))*(l9_1724-2))/6;
int l9_1730=0;
int l9_1731=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1731<64)
{
if (l9_1731>=(l9_1725-1))
{
break;
}
int l9_1732=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1732<64)
{
if (l9_1732>=(l9_1725-l9_1731))
{
break;
}
l9_1730++;
l9_1732++;
continue;
}
else
{
break;
}
}
l9_1731++;
continue;
}
else
{
break;
}
}
int l9_1733=l9_1729*l9_1730;
int l9_1734=(l9_1726+l9_1728)+l9_1733;
float3 l9_1735=float3(0.0);
float l9_1736=0.0;
float l9_1737=0.0;
float l9_1738=0.0;
float l9_1739=0.0;
float l9_1740=0.0;
if (l9_1723<l9_1726)
{
int l9_1741=l9_1723;
float l9_1742=(float(l9_1741)+0.5)/N0_texWidth;
float2 l9_1743=float2(l9_1742,0.5);
float4 l9_1744=float4(0.0);
int l9_1745;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_1746=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1746=0;
}
else
{
l9_1746=in.varStereoViewID;
}
int l9_1747=l9_1746;
l9_1745=1-l9_1747;
}
else
{
int l9_1748=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1748=0;
}
else
{
l9_1748=in.varStereoViewID;
}
int l9_1749=l9_1748;
l9_1745=l9_1749;
}
int l9_1750=l9_1745;
int l9_1751=pigmentTexLayout_tmp;
int l9_1752=l9_1750;
float2 l9_1753=l9_1743;
bool l9_1754=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1755=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1756=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1757=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1758=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1759=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1760=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1761=0.0;
bool l9_1762=l9_1759&&(!l9_1757);
float l9_1763=1.0;
float l9_1764=l9_1753.x;
int l9_1765=l9_1756.x;
if (l9_1765==1)
{
l9_1764=fract(l9_1764);
}
else
{
if (l9_1765==2)
{
float l9_1766=fract(l9_1764);
float l9_1767=l9_1764-l9_1766;
float l9_1768=step(0.25,fract(l9_1767*0.5));
l9_1764=mix(l9_1766,1.0-l9_1766,fast::clamp(l9_1768,0.0,1.0));
}
}
l9_1753.x=l9_1764;
float l9_1769=l9_1753.y;
int l9_1770=l9_1756.y;
if (l9_1770==1)
{
l9_1769=fract(l9_1769);
}
else
{
if (l9_1770==2)
{
float l9_1771=fract(l9_1769);
float l9_1772=l9_1769-l9_1771;
float l9_1773=step(0.25,fract(l9_1772*0.5));
l9_1769=mix(l9_1771,1.0-l9_1771,fast::clamp(l9_1773,0.0,1.0));
}
}
l9_1753.y=l9_1769;
if (l9_1757)
{
bool l9_1774=l9_1759;
bool l9_1775;
if (l9_1774)
{
l9_1775=l9_1756.x==3;
}
else
{
l9_1775=l9_1774;
}
float l9_1776=l9_1753.x;
float l9_1777=l9_1758.x;
float l9_1778=l9_1758.z;
bool l9_1779=l9_1775;
float l9_1780=l9_1763;
float l9_1781=fast::clamp(l9_1776,l9_1777,l9_1778);
float l9_1782=step(abs(l9_1776-l9_1781),9.9999997e-06);
l9_1780*=(l9_1782+((1.0-float(l9_1779))*(1.0-l9_1782)));
l9_1776=l9_1781;
l9_1753.x=l9_1776;
l9_1763=l9_1780;
bool l9_1783=l9_1759;
bool l9_1784;
if (l9_1783)
{
l9_1784=l9_1756.y==3;
}
else
{
l9_1784=l9_1783;
}
float l9_1785=l9_1753.y;
float l9_1786=l9_1758.y;
float l9_1787=l9_1758.w;
bool l9_1788=l9_1784;
float l9_1789=l9_1763;
float l9_1790=fast::clamp(l9_1785,l9_1786,l9_1787);
float l9_1791=step(abs(l9_1785-l9_1790),9.9999997e-06);
l9_1789*=(l9_1791+((1.0-float(l9_1788))*(1.0-l9_1791)));
l9_1785=l9_1790;
l9_1753.y=l9_1785;
l9_1763=l9_1789;
}
float2 l9_1792=l9_1753;
bool l9_1793=l9_1754;
float3x3 l9_1794=l9_1755;
if (l9_1793)
{
l9_1792=float2((l9_1794*float3(l9_1792,1.0)).xy);
}
float2 l9_1795=l9_1792;
l9_1753=l9_1795;
float l9_1796=l9_1753.x;
int l9_1797=l9_1756.x;
bool l9_1798=l9_1762;
float l9_1799=l9_1763;
if ((l9_1797==0)||(l9_1797==3))
{
float l9_1800=l9_1796;
float l9_1801=0.0;
float l9_1802=1.0;
bool l9_1803=l9_1798;
float l9_1804=l9_1799;
float l9_1805=fast::clamp(l9_1800,l9_1801,l9_1802);
float l9_1806=step(abs(l9_1800-l9_1805),9.9999997e-06);
l9_1804*=(l9_1806+((1.0-float(l9_1803))*(1.0-l9_1806)));
l9_1800=l9_1805;
l9_1796=l9_1800;
l9_1799=l9_1804;
}
l9_1753.x=l9_1796;
l9_1763=l9_1799;
float l9_1807=l9_1753.y;
int l9_1808=l9_1756.y;
bool l9_1809=l9_1762;
float l9_1810=l9_1763;
if ((l9_1808==0)||(l9_1808==3))
{
float l9_1811=l9_1807;
float l9_1812=0.0;
float l9_1813=1.0;
bool l9_1814=l9_1809;
float l9_1815=l9_1810;
float l9_1816=fast::clamp(l9_1811,l9_1812,l9_1813);
float l9_1817=step(abs(l9_1811-l9_1816),9.9999997e-06);
l9_1815*=(l9_1817+((1.0-float(l9_1814))*(1.0-l9_1817)));
l9_1811=l9_1816;
l9_1807=l9_1811;
l9_1810=l9_1815;
}
l9_1753.y=l9_1807;
l9_1763=l9_1810;
float2 l9_1818=l9_1753;
int l9_1819=l9_1751;
int l9_1820=l9_1752;
float l9_1821=l9_1761;
float2 l9_1822=l9_1818;
int l9_1823=l9_1819;
int l9_1824=l9_1820;
float3 l9_1825=float3(0.0);
if (l9_1823==0)
{
l9_1825=float3(l9_1822,0.0);
}
else
{
if (l9_1823==1)
{
l9_1825=float3(l9_1822.x,(l9_1822.y*0.5)+(0.5-(float(l9_1824)*0.5)),0.0);
}
else
{
l9_1825=float3(l9_1822,float(l9_1824));
}
}
float3 l9_1826=l9_1825;
float3 l9_1827=l9_1826;
float4 l9_1828=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_1827.xy,bias(l9_1821));
float4 l9_1829=l9_1828;
if (l9_1759)
{
l9_1829=mix(l9_1760,l9_1829,float4(l9_1763));
}
float4 l9_1830=l9_1829;
l9_1744=l9_1830;
float4 l9_1831=l9_1744;
float3 l9_1832=l9_1831.xyz;
l9_1735=l9_1832;
l9_1736=1.0;
l9_1737=float(l9_1723);
}
else
{
if (l9_1723<(l9_1726+l9_1728))
{
int l9_1833=l9_1723-l9_1726;
int l9_1834=l9_1833/(l9_1725-1);
int l9_1835=l9_1833-(l9_1834*(l9_1725-1));
int l9_1836=0;
int l9_1837=0;
int l9_1838=1;
int l9_1839=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1839<16)
{
if (l9_1839>=l9_1724)
{
break;
}
int l9_1840=l9_1839+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_1840<16)
{
if (l9_1840>=l9_1724)
{
break;
}
if (l9_1836==l9_1834)
{
l9_1837=l9_1839;
l9_1838=l9_1840;
}
l9_1836++;
l9_1840++;
continue;
}
else
{
break;
}
}
l9_1839++;
continue;
}
else
{
break;
}
}
float l9_1841=float(l9_1835+1)/float(l9_1725);
int l9_1842=l9_1837;
float l9_1843=(float(l9_1842)+0.5)/N0_texWidth;
float2 l9_1844=float2(l9_1843,0.5);
float4 l9_1845=float4(0.0);
int l9_1846;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_1847=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1847=0;
}
else
{
l9_1847=in.varStereoViewID;
}
int l9_1848=l9_1847;
l9_1846=1-l9_1848;
}
else
{
int l9_1849=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1849=0;
}
else
{
l9_1849=in.varStereoViewID;
}
int l9_1850=l9_1849;
l9_1846=l9_1850;
}
int l9_1851=l9_1846;
int l9_1852=pigmentTexLayout_tmp;
int l9_1853=l9_1851;
float2 l9_1854=l9_1844;
bool l9_1855=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1856=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1857=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1858=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1859=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1860=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1861=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1862=0.0;
bool l9_1863=l9_1860&&(!l9_1858);
float l9_1864=1.0;
float l9_1865=l9_1854.x;
int l9_1866=l9_1857.x;
if (l9_1866==1)
{
l9_1865=fract(l9_1865);
}
else
{
if (l9_1866==2)
{
float l9_1867=fract(l9_1865);
float l9_1868=l9_1865-l9_1867;
float l9_1869=step(0.25,fract(l9_1868*0.5));
l9_1865=mix(l9_1867,1.0-l9_1867,fast::clamp(l9_1869,0.0,1.0));
}
}
l9_1854.x=l9_1865;
float l9_1870=l9_1854.y;
int l9_1871=l9_1857.y;
if (l9_1871==1)
{
l9_1870=fract(l9_1870);
}
else
{
if (l9_1871==2)
{
float l9_1872=fract(l9_1870);
float l9_1873=l9_1870-l9_1872;
float l9_1874=step(0.25,fract(l9_1873*0.5));
l9_1870=mix(l9_1872,1.0-l9_1872,fast::clamp(l9_1874,0.0,1.0));
}
}
l9_1854.y=l9_1870;
if (l9_1858)
{
bool l9_1875=l9_1860;
bool l9_1876;
if (l9_1875)
{
l9_1876=l9_1857.x==3;
}
else
{
l9_1876=l9_1875;
}
float l9_1877=l9_1854.x;
float l9_1878=l9_1859.x;
float l9_1879=l9_1859.z;
bool l9_1880=l9_1876;
float l9_1881=l9_1864;
float l9_1882=fast::clamp(l9_1877,l9_1878,l9_1879);
float l9_1883=step(abs(l9_1877-l9_1882),9.9999997e-06);
l9_1881*=(l9_1883+((1.0-float(l9_1880))*(1.0-l9_1883)));
l9_1877=l9_1882;
l9_1854.x=l9_1877;
l9_1864=l9_1881;
bool l9_1884=l9_1860;
bool l9_1885;
if (l9_1884)
{
l9_1885=l9_1857.y==3;
}
else
{
l9_1885=l9_1884;
}
float l9_1886=l9_1854.y;
float l9_1887=l9_1859.y;
float l9_1888=l9_1859.w;
bool l9_1889=l9_1885;
float l9_1890=l9_1864;
float l9_1891=fast::clamp(l9_1886,l9_1887,l9_1888);
float l9_1892=step(abs(l9_1886-l9_1891),9.9999997e-06);
l9_1890*=(l9_1892+((1.0-float(l9_1889))*(1.0-l9_1892)));
l9_1886=l9_1891;
l9_1854.y=l9_1886;
l9_1864=l9_1890;
}
float2 l9_1893=l9_1854;
bool l9_1894=l9_1855;
float3x3 l9_1895=l9_1856;
if (l9_1894)
{
l9_1893=float2((l9_1895*float3(l9_1893,1.0)).xy);
}
float2 l9_1896=l9_1893;
l9_1854=l9_1896;
float l9_1897=l9_1854.x;
int l9_1898=l9_1857.x;
bool l9_1899=l9_1863;
float l9_1900=l9_1864;
if ((l9_1898==0)||(l9_1898==3))
{
float l9_1901=l9_1897;
float l9_1902=0.0;
float l9_1903=1.0;
bool l9_1904=l9_1899;
float l9_1905=l9_1900;
float l9_1906=fast::clamp(l9_1901,l9_1902,l9_1903);
float l9_1907=step(abs(l9_1901-l9_1906),9.9999997e-06);
l9_1905*=(l9_1907+((1.0-float(l9_1904))*(1.0-l9_1907)));
l9_1901=l9_1906;
l9_1897=l9_1901;
l9_1900=l9_1905;
}
l9_1854.x=l9_1897;
l9_1864=l9_1900;
float l9_1908=l9_1854.y;
int l9_1909=l9_1857.y;
bool l9_1910=l9_1863;
float l9_1911=l9_1864;
if ((l9_1909==0)||(l9_1909==3))
{
float l9_1912=l9_1908;
float l9_1913=0.0;
float l9_1914=1.0;
bool l9_1915=l9_1910;
float l9_1916=l9_1911;
float l9_1917=fast::clamp(l9_1912,l9_1913,l9_1914);
float l9_1918=step(abs(l9_1912-l9_1917),9.9999997e-06);
l9_1916*=(l9_1918+((1.0-float(l9_1915))*(1.0-l9_1918)));
l9_1912=l9_1917;
l9_1908=l9_1912;
l9_1911=l9_1916;
}
l9_1854.y=l9_1908;
l9_1864=l9_1911;
float2 l9_1919=l9_1854;
int l9_1920=l9_1852;
int l9_1921=l9_1853;
float l9_1922=l9_1862;
float2 l9_1923=l9_1919;
int l9_1924=l9_1920;
int l9_1925=l9_1921;
float3 l9_1926=float3(0.0);
if (l9_1924==0)
{
l9_1926=float3(l9_1923,0.0);
}
else
{
if (l9_1924==1)
{
l9_1926=float3(l9_1923.x,(l9_1923.y*0.5)+(0.5-(float(l9_1925)*0.5)),0.0);
}
else
{
l9_1926=float3(l9_1923,float(l9_1925));
}
}
float3 l9_1927=l9_1926;
float3 l9_1928=l9_1927;
float4 l9_1929=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_1928.xy,bias(l9_1922));
float4 l9_1930=l9_1929;
if (l9_1860)
{
l9_1930=mix(l9_1861,l9_1930,float4(l9_1864));
}
float4 l9_1931=l9_1930;
l9_1845=l9_1931;
float4 l9_1932=l9_1845;
float3 l9_1933=l9_1932.xyz;
float3 l9_1934=l9_1933;
int l9_1935=l9_1838;
float l9_1936=(float(l9_1935)+0.5)/N0_texWidth;
float2 l9_1937=float2(l9_1936,0.5);
float4 l9_1938=float4(0.0);
int l9_1939;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_1940=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1940=0;
}
else
{
l9_1940=in.varStereoViewID;
}
int l9_1941=l9_1940;
l9_1939=1-l9_1941;
}
else
{
int l9_1942=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1942=0;
}
else
{
l9_1942=in.varStereoViewID;
}
int l9_1943=l9_1942;
l9_1939=l9_1943;
}
int l9_1944=l9_1939;
int l9_1945=pigmentTexLayout_tmp;
int l9_1946=l9_1944;
float2 l9_1947=l9_1937;
bool l9_1948=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_1949=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_1950=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_1951=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_1952=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_1953=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_1954=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_1955=0.0;
bool l9_1956=l9_1953&&(!l9_1951);
float l9_1957=1.0;
float l9_1958=l9_1947.x;
int l9_1959=l9_1950.x;
if (l9_1959==1)
{
l9_1958=fract(l9_1958);
}
else
{
if (l9_1959==2)
{
float l9_1960=fract(l9_1958);
float l9_1961=l9_1958-l9_1960;
float l9_1962=step(0.25,fract(l9_1961*0.5));
l9_1958=mix(l9_1960,1.0-l9_1960,fast::clamp(l9_1962,0.0,1.0));
}
}
l9_1947.x=l9_1958;
float l9_1963=l9_1947.y;
int l9_1964=l9_1950.y;
if (l9_1964==1)
{
l9_1963=fract(l9_1963);
}
else
{
if (l9_1964==2)
{
float l9_1965=fract(l9_1963);
float l9_1966=l9_1963-l9_1965;
float l9_1967=step(0.25,fract(l9_1966*0.5));
l9_1963=mix(l9_1965,1.0-l9_1965,fast::clamp(l9_1967,0.0,1.0));
}
}
l9_1947.y=l9_1963;
if (l9_1951)
{
bool l9_1968=l9_1953;
bool l9_1969;
if (l9_1968)
{
l9_1969=l9_1950.x==3;
}
else
{
l9_1969=l9_1968;
}
float l9_1970=l9_1947.x;
float l9_1971=l9_1952.x;
float l9_1972=l9_1952.z;
bool l9_1973=l9_1969;
float l9_1974=l9_1957;
float l9_1975=fast::clamp(l9_1970,l9_1971,l9_1972);
float l9_1976=step(abs(l9_1970-l9_1975),9.9999997e-06);
l9_1974*=(l9_1976+((1.0-float(l9_1973))*(1.0-l9_1976)));
l9_1970=l9_1975;
l9_1947.x=l9_1970;
l9_1957=l9_1974;
bool l9_1977=l9_1953;
bool l9_1978;
if (l9_1977)
{
l9_1978=l9_1950.y==3;
}
else
{
l9_1978=l9_1977;
}
float l9_1979=l9_1947.y;
float l9_1980=l9_1952.y;
float l9_1981=l9_1952.w;
bool l9_1982=l9_1978;
float l9_1983=l9_1957;
float l9_1984=fast::clamp(l9_1979,l9_1980,l9_1981);
float l9_1985=step(abs(l9_1979-l9_1984),9.9999997e-06);
l9_1983*=(l9_1985+((1.0-float(l9_1982))*(1.0-l9_1985)));
l9_1979=l9_1984;
l9_1947.y=l9_1979;
l9_1957=l9_1983;
}
float2 l9_1986=l9_1947;
bool l9_1987=l9_1948;
float3x3 l9_1988=l9_1949;
if (l9_1987)
{
l9_1986=float2((l9_1988*float3(l9_1986,1.0)).xy);
}
float2 l9_1989=l9_1986;
l9_1947=l9_1989;
float l9_1990=l9_1947.x;
int l9_1991=l9_1950.x;
bool l9_1992=l9_1956;
float l9_1993=l9_1957;
if ((l9_1991==0)||(l9_1991==3))
{
float l9_1994=l9_1990;
float l9_1995=0.0;
float l9_1996=1.0;
bool l9_1997=l9_1992;
float l9_1998=l9_1993;
float l9_1999=fast::clamp(l9_1994,l9_1995,l9_1996);
float l9_2000=step(abs(l9_1994-l9_1999),9.9999997e-06);
l9_1998*=(l9_2000+((1.0-float(l9_1997))*(1.0-l9_2000)));
l9_1994=l9_1999;
l9_1990=l9_1994;
l9_1993=l9_1998;
}
l9_1947.x=l9_1990;
l9_1957=l9_1993;
float l9_2001=l9_1947.y;
int l9_2002=l9_1950.y;
bool l9_2003=l9_1956;
float l9_2004=l9_1957;
if ((l9_2002==0)||(l9_2002==3))
{
float l9_2005=l9_2001;
float l9_2006=0.0;
float l9_2007=1.0;
bool l9_2008=l9_2003;
float l9_2009=l9_2004;
float l9_2010=fast::clamp(l9_2005,l9_2006,l9_2007);
float l9_2011=step(abs(l9_2005-l9_2010),9.9999997e-06);
l9_2009*=(l9_2011+((1.0-float(l9_2008))*(1.0-l9_2011)));
l9_2005=l9_2010;
l9_2001=l9_2005;
l9_2004=l9_2009;
}
l9_1947.y=l9_2001;
l9_1957=l9_2004;
float2 l9_2012=l9_1947;
int l9_2013=l9_1945;
int l9_2014=l9_1946;
float l9_2015=l9_1955;
float2 l9_2016=l9_2012;
int l9_2017=l9_2013;
int l9_2018=l9_2014;
float3 l9_2019=float3(0.0);
if (l9_2017==0)
{
l9_2019=float3(l9_2016,0.0);
}
else
{
if (l9_2017==1)
{
l9_2019=float3(l9_2016.x,(l9_2016.y*0.5)+(0.5-(float(l9_2018)*0.5)),0.0);
}
else
{
l9_2019=float3(l9_2016,float(l9_2018));
}
}
float3 l9_2020=l9_2019;
float3 l9_2021=l9_2020;
float4 l9_2022=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_2021.xy,bias(l9_2015));
float4 l9_2023=l9_2022;
if (l9_1953)
{
l9_2023=mix(l9_1954,l9_2023,float4(l9_1957));
}
float4 l9_2024=l9_2023;
l9_1938=l9_2024;
float4 l9_2025=l9_1938;
float3 l9_2026=l9_2025.xyz;
float3 l9_2027=l9_2026;
float3 l9_2028=l9_1934;
float3 l9_2029=l9_2027;
float l9_2030=l9_1841;
float l9_2031=1.0-l9_1841;
float l9_2032=l9_2030+l9_2031;
float l9_2033=l9_2030/fast::max(l9_2032,0.001);
float l9_2034=l9_2031/fast::max(l9_2032,0.001);
float3 l9_2035=float3(0.0);
float l9_2036=l9_2028.x;
float l9_2037=1.0-l9_2036;
float l9_2038=2.0;
float l9_2039;
if (l9_2037<=0.0)
{
l9_2039=0.0;
}
else
{
l9_2039=pow(l9_2037,l9_2038);
}
float l9_2040=l9_2039;
float l9_2041=l9_2040/(2.0*fast::max(l9_2036,9.9999997e-05));
float l9_2042=l9_2041;
float l9_2043=l9_2033;
float l9_2044=l9_2029.x;
float l9_2045=1.0-l9_2044;
float l9_2046=2.0;
float l9_2047;
if (l9_2045<=0.0)
{
l9_2047=0.0;
}
else
{
l9_2047=pow(l9_2045,l9_2046);
}
float l9_2048=l9_2047;
float l9_2049=l9_2048/(2.0*fast::max(l9_2044,9.9999997e-05));
float l9_2050=(l9_2042*l9_2043)+(l9_2049*l9_2034);
float l9_2051=l9_2050;
float l9_2052=l9_2051;
float l9_2053=(l9_2051*l9_2051)+(2.0*l9_2051);
float l9_2054;
if (l9_2053<=0.0)
{
l9_2054=0.0;
}
else
{
l9_2054=sqrt(l9_2053);
}
float l9_2055=l9_2054;
float l9_2056=(1.0+l9_2052)-l9_2055;
l9_2035.x=l9_2056;
float l9_2057=l9_2028.y;
float l9_2058=1.0-l9_2057;
float l9_2059=2.0;
float l9_2060;
if (l9_2058<=0.0)
{
l9_2060=0.0;
}
else
{
l9_2060=pow(l9_2058,l9_2059);
}
float l9_2061=l9_2060;
float l9_2062=l9_2061/(2.0*fast::max(l9_2057,9.9999997e-05));
float l9_2063=l9_2062;
float l9_2064=l9_2033;
float l9_2065=l9_2029.y;
float l9_2066=1.0-l9_2065;
float l9_2067=2.0;
float l9_2068;
if (l9_2066<=0.0)
{
l9_2068=0.0;
}
else
{
l9_2068=pow(l9_2066,l9_2067);
}
float l9_2069=l9_2068;
float l9_2070=l9_2069/(2.0*fast::max(l9_2065,9.9999997e-05));
l9_2050=(l9_2063*l9_2064)+(l9_2070*l9_2034);
float l9_2071=l9_2050;
float l9_2072=l9_2071;
float l9_2073=(l9_2071*l9_2071)+(2.0*l9_2071);
float l9_2074;
if (l9_2073<=0.0)
{
l9_2074=0.0;
}
else
{
l9_2074=sqrt(l9_2073);
}
float l9_2075=l9_2074;
float l9_2076=(1.0+l9_2072)-l9_2075;
l9_2035.y=l9_2076;
float l9_2077=l9_2028.z;
float l9_2078=1.0-l9_2077;
float l9_2079=2.0;
float l9_2080;
if (l9_2078<=0.0)
{
l9_2080=0.0;
}
else
{
l9_2080=pow(l9_2078,l9_2079);
}
float l9_2081=l9_2080;
float l9_2082=l9_2081/(2.0*fast::max(l9_2077,9.9999997e-05));
float l9_2083=l9_2082;
float l9_2084=l9_2033;
float l9_2085=l9_2029.z;
float l9_2086=1.0-l9_2085;
float l9_2087=2.0;
float l9_2088;
if (l9_2086<=0.0)
{
l9_2088=0.0;
}
else
{
l9_2088=pow(l9_2086,l9_2087);
}
float l9_2089=l9_2088;
float l9_2090=l9_2089/(2.0*fast::max(l9_2085,9.9999997e-05));
l9_2050=(l9_2083*l9_2084)+(l9_2090*l9_2034);
float l9_2091=l9_2050;
float l9_2092=l9_2091;
float l9_2093=(l9_2091*l9_2091)+(2.0*l9_2091);
float l9_2094;
if (l9_2093<=0.0)
{
l9_2094=0.0;
}
else
{
l9_2094=sqrt(l9_2093);
}
float l9_2095=l9_2094;
float l9_2096=(1.0+l9_2092)-l9_2095;
l9_2035.z=l9_2096;
float3 l9_2097=fast::clamp(l9_2035,float3(0.0),float3(1.0));
l9_1735=l9_2097;
l9_1736=1.0;
l9_1737=float(l9_1837);
l9_1738=float(l9_1838);
l9_1740=l9_1841;
}
else
{
if (l9_1723<l9_1734)
{
int l9_2098=(l9_1723-l9_1726)-l9_1728;
int l9_2099=l9_2098/l9_1730;
int l9_2100=l9_2098-(l9_2099*l9_1730);
int l9_2101=0;
int l9_2102=0;
int l9_2103=1;
int l9_2104=2;
int l9_2105=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2105<16)
{
if (l9_2105>=l9_1724)
{
break;
}
int l9_2106=l9_2105+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2106<16)
{
if (l9_2106>=l9_1724)
{
break;
}
int l9_2107=l9_2106+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2107<16)
{
if (l9_2107>=l9_1724)
{
break;
}
if (l9_2101==l9_2099)
{
l9_2102=l9_2105;
l9_2103=l9_2106;
l9_2104=l9_2107;
}
l9_2101++;
l9_2107++;
continue;
}
else
{
break;
}
}
l9_2106++;
continue;
}
else
{
break;
}
}
l9_2105++;
continue;
}
else
{
break;
}
}
int l9_2108=0;
int l9_2109=1;
int l9_2110=1;
int l9_2111=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2111<64)
{
if (l9_2111>=(l9_1725-1))
{
break;
}
int l9_2112=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2112<64)
{
if (l9_2112>=(l9_1725-l9_2111))
{
break;
}
if (l9_2108==l9_2100)
{
l9_2109=l9_2111;
l9_2110=l9_2112;
}
l9_2108++;
l9_2112++;
continue;
}
else
{
break;
}
}
l9_2111++;
continue;
}
else
{
break;
}
}
float l9_2113=float(l9_2109)/float(l9_1725);
float l9_2114=float(l9_2110)/float(l9_1725);
float l9_2115=(1.0-l9_2113)-l9_2114;
int l9_2116=l9_2102;
float l9_2117=(float(l9_2116)+0.5)/N0_texWidth;
float2 l9_2118=float2(l9_2117,0.5);
float4 l9_2119=float4(0.0);
int l9_2120;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_2121=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2121=0;
}
else
{
l9_2121=in.varStereoViewID;
}
int l9_2122=l9_2121;
l9_2120=1-l9_2122;
}
else
{
int l9_2123=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2123=0;
}
else
{
l9_2123=in.varStereoViewID;
}
int l9_2124=l9_2123;
l9_2120=l9_2124;
}
int l9_2125=l9_2120;
int l9_2126=pigmentTexLayout_tmp;
int l9_2127=l9_2125;
float2 l9_2128=l9_2118;
bool l9_2129=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_2130=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_2131=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_2132=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_2133=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_2134=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_2135=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_2136=0.0;
bool l9_2137=l9_2134&&(!l9_2132);
float l9_2138=1.0;
float l9_2139=l9_2128.x;
int l9_2140=l9_2131.x;
if (l9_2140==1)
{
l9_2139=fract(l9_2139);
}
else
{
if (l9_2140==2)
{
float l9_2141=fract(l9_2139);
float l9_2142=l9_2139-l9_2141;
float l9_2143=step(0.25,fract(l9_2142*0.5));
l9_2139=mix(l9_2141,1.0-l9_2141,fast::clamp(l9_2143,0.0,1.0));
}
}
l9_2128.x=l9_2139;
float l9_2144=l9_2128.y;
int l9_2145=l9_2131.y;
if (l9_2145==1)
{
l9_2144=fract(l9_2144);
}
else
{
if (l9_2145==2)
{
float l9_2146=fract(l9_2144);
float l9_2147=l9_2144-l9_2146;
float l9_2148=step(0.25,fract(l9_2147*0.5));
l9_2144=mix(l9_2146,1.0-l9_2146,fast::clamp(l9_2148,0.0,1.0));
}
}
l9_2128.y=l9_2144;
if (l9_2132)
{
bool l9_2149=l9_2134;
bool l9_2150;
if (l9_2149)
{
l9_2150=l9_2131.x==3;
}
else
{
l9_2150=l9_2149;
}
float l9_2151=l9_2128.x;
float l9_2152=l9_2133.x;
float l9_2153=l9_2133.z;
bool l9_2154=l9_2150;
float l9_2155=l9_2138;
float l9_2156=fast::clamp(l9_2151,l9_2152,l9_2153);
float l9_2157=step(abs(l9_2151-l9_2156),9.9999997e-06);
l9_2155*=(l9_2157+((1.0-float(l9_2154))*(1.0-l9_2157)));
l9_2151=l9_2156;
l9_2128.x=l9_2151;
l9_2138=l9_2155;
bool l9_2158=l9_2134;
bool l9_2159;
if (l9_2158)
{
l9_2159=l9_2131.y==3;
}
else
{
l9_2159=l9_2158;
}
float l9_2160=l9_2128.y;
float l9_2161=l9_2133.y;
float l9_2162=l9_2133.w;
bool l9_2163=l9_2159;
float l9_2164=l9_2138;
float l9_2165=fast::clamp(l9_2160,l9_2161,l9_2162);
float l9_2166=step(abs(l9_2160-l9_2165),9.9999997e-06);
l9_2164*=(l9_2166+((1.0-float(l9_2163))*(1.0-l9_2166)));
l9_2160=l9_2165;
l9_2128.y=l9_2160;
l9_2138=l9_2164;
}
float2 l9_2167=l9_2128;
bool l9_2168=l9_2129;
float3x3 l9_2169=l9_2130;
if (l9_2168)
{
l9_2167=float2((l9_2169*float3(l9_2167,1.0)).xy);
}
float2 l9_2170=l9_2167;
l9_2128=l9_2170;
float l9_2171=l9_2128.x;
int l9_2172=l9_2131.x;
bool l9_2173=l9_2137;
float l9_2174=l9_2138;
if ((l9_2172==0)||(l9_2172==3))
{
float l9_2175=l9_2171;
float l9_2176=0.0;
float l9_2177=1.0;
bool l9_2178=l9_2173;
float l9_2179=l9_2174;
float l9_2180=fast::clamp(l9_2175,l9_2176,l9_2177);
float l9_2181=step(abs(l9_2175-l9_2180),9.9999997e-06);
l9_2179*=(l9_2181+((1.0-float(l9_2178))*(1.0-l9_2181)));
l9_2175=l9_2180;
l9_2171=l9_2175;
l9_2174=l9_2179;
}
l9_2128.x=l9_2171;
l9_2138=l9_2174;
float l9_2182=l9_2128.y;
int l9_2183=l9_2131.y;
bool l9_2184=l9_2137;
float l9_2185=l9_2138;
if ((l9_2183==0)||(l9_2183==3))
{
float l9_2186=l9_2182;
float l9_2187=0.0;
float l9_2188=1.0;
bool l9_2189=l9_2184;
float l9_2190=l9_2185;
float l9_2191=fast::clamp(l9_2186,l9_2187,l9_2188);
float l9_2192=step(abs(l9_2186-l9_2191),9.9999997e-06);
l9_2190*=(l9_2192+((1.0-float(l9_2189))*(1.0-l9_2192)));
l9_2186=l9_2191;
l9_2182=l9_2186;
l9_2185=l9_2190;
}
l9_2128.y=l9_2182;
l9_2138=l9_2185;
float2 l9_2193=l9_2128;
int l9_2194=l9_2126;
int l9_2195=l9_2127;
float l9_2196=l9_2136;
float2 l9_2197=l9_2193;
int l9_2198=l9_2194;
int l9_2199=l9_2195;
float3 l9_2200=float3(0.0);
if (l9_2198==0)
{
l9_2200=float3(l9_2197,0.0);
}
else
{
if (l9_2198==1)
{
l9_2200=float3(l9_2197.x,(l9_2197.y*0.5)+(0.5-(float(l9_2199)*0.5)),0.0);
}
else
{
l9_2200=float3(l9_2197,float(l9_2199));
}
}
float3 l9_2201=l9_2200;
float3 l9_2202=l9_2201;
float4 l9_2203=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_2202.xy,bias(l9_2196));
float4 l9_2204=l9_2203;
if (l9_2134)
{
l9_2204=mix(l9_2135,l9_2204,float4(l9_2138));
}
float4 l9_2205=l9_2204;
l9_2119=l9_2205;
float4 l9_2206=l9_2119;
float3 l9_2207=l9_2206.xyz;
float3 l9_2208=l9_2207;
int l9_2209=l9_2103;
float l9_2210=(float(l9_2209)+0.5)/N0_texWidth;
float2 l9_2211=float2(l9_2210,0.5);
float4 l9_2212=float4(0.0);
int l9_2213;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_2214=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2214=0;
}
else
{
l9_2214=in.varStereoViewID;
}
int l9_2215=l9_2214;
l9_2213=1-l9_2215;
}
else
{
int l9_2216=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2216=0;
}
else
{
l9_2216=in.varStereoViewID;
}
int l9_2217=l9_2216;
l9_2213=l9_2217;
}
int l9_2218=l9_2213;
int l9_2219=pigmentTexLayout_tmp;
int l9_2220=l9_2218;
float2 l9_2221=l9_2211;
bool l9_2222=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_2223=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_2224=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_2225=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_2226=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_2227=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_2228=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_2229=0.0;
bool l9_2230=l9_2227&&(!l9_2225);
float l9_2231=1.0;
float l9_2232=l9_2221.x;
int l9_2233=l9_2224.x;
if (l9_2233==1)
{
l9_2232=fract(l9_2232);
}
else
{
if (l9_2233==2)
{
float l9_2234=fract(l9_2232);
float l9_2235=l9_2232-l9_2234;
float l9_2236=step(0.25,fract(l9_2235*0.5));
l9_2232=mix(l9_2234,1.0-l9_2234,fast::clamp(l9_2236,0.0,1.0));
}
}
l9_2221.x=l9_2232;
float l9_2237=l9_2221.y;
int l9_2238=l9_2224.y;
if (l9_2238==1)
{
l9_2237=fract(l9_2237);
}
else
{
if (l9_2238==2)
{
float l9_2239=fract(l9_2237);
float l9_2240=l9_2237-l9_2239;
float l9_2241=step(0.25,fract(l9_2240*0.5));
l9_2237=mix(l9_2239,1.0-l9_2239,fast::clamp(l9_2241,0.0,1.0));
}
}
l9_2221.y=l9_2237;
if (l9_2225)
{
bool l9_2242=l9_2227;
bool l9_2243;
if (l9_2242)
{
l9_2243=l9_2224.x==3;
}
else
{
l9_2243=l9_2242;
}
float l9_2244=l9_2221.x;
float l9_2245=l9_2226.x;
float l9_2246=l9_2226.z;
bool l9_2247=l9_2243;
float l9_2248=l9_2231;
float l9_2249=fast::clamp(l9_2244,l9_2245,l9_2246);
float l9_2250=step(abs(l9_2244-l9_2249),9.9999997e-06);
l9_2248*=(l9_2250+((1.0-float(l9_2247))*(1.0-l9_2250)));
l9_2244=l9_2249;
l9_2221.x=l9_2244;
l9_2231=l9_2248;
bool l9_2251=l9_2227;
bool l9_2252;
if (l9_2251)
{
l9_2252=l9_2224.y==3;
}
else
{
l9_2252=l9_2251;
}
float l9_2253=l9_2221.y;
float l9_2254=l9_2226.y;
float l9_2255=l9_2226.w;
bool l9_2256=l9_2252;
float l9_2257=l9_2231;
float l9_2258=fast::clamp(l9_2253,l9_2254,l9_2255);
float l9_2259=step(abs(l9_2253-l9_2258),9.9999997e-06);
l9_2257*=(l9_2259+((1.0-float(l9_2256))*(1.0-l9_2259)));
l9_2253=l9_2258;
l9_2221.y=l9_2253;
l9_2231=l9_2257;
}
float2 l9_2260=l9_2221;
bool l9_2261=l9_2222;
float3x3 l9_2262=l9_2223;
if (l9_2261)
{
l9_2260=float2((l9_2262*float3(l9_2260,1.0)).xy);
}
float2 l9_2263=l9_2260;
l9_2221=l9_2263;
float l9_2264=l9_2221.x;
int l9_2265=l9_2224.x;
bool l9_2266=l9_2230;
float l9_2267=l9_2231;
if ((l9_2265==0)||(l9_2265==3))
{
float l9_2268=l9_2264;
float l9_2269=0.0;
float l9_2270=1.0;
bool l9_2271=l9_2266;
float l9_2272=l9_2267;
float l9_2273=fast::clamp(l9_2268,l9_2269,l9_2270);
float l9_2274=step(abs(l9_2268-l9_2273),9.9999997e-06);
l9_2272*=(l9_2274+((1.0-float(l9_2271))*(1.0-l9_2274)));
l9_2268=l9_2273;
l9_2264=l9_2268;
l9_2267=l9_2272;
}
l9_2221.x=l9_2264;
l9_2231=l9_2267;
float l9_2275=l9_2221.y;
int l9_2276=l9_2224.y;
bool l9_2277=l9_2230;
float l9_2278=l9_2231;
if ((l9_2276==0)||(l9_2276==3))
{
float l9_2279=l9_2275;
float l9_2280=0.0;
float l9_2281=1.0;
bool l9_2282=l9_2277;
float l9_2283=l9_2278;
float l9_2284=fast::clamp(l9_2279,l9_2280,l9_2281);
float l9_2285=step(abs(l9_2279-l9_2284),9.9999997e-06);
l9_2283*=(l9_2285+((1.0-float(l9_2282))*(1.0-l9_2285)));
l9_2279=l9_2284;
l9_2275=l9_2279;
l9_2278=l9_2283;
}
l9_2221.y=l9_2275;
l9_2231=l9_2278;
float2 l9_2286=l9_2221;
int l9_2287=l9_2219;
int l9_2288=l9_2220;
float l9_2289=l9_2229;
float2 l9_2290=l9_2286;
int l9_2291=l9_2287;
int l9_2292=l9_2288;
float3 l9_2293=float3(0.0);
if (l9_2291==0)
{
l9_2293=float3(l9_2290,0.0);
}
else
{
if (l9_2291==1)
{
l9_2293=float3(l9_2290.x,(l9_2290.y*0.5)+(0.5-(float(l9_2292)*0.5)),0.0);
}
else
{
l9_2293=float3(l9_2290,float(l9_2292));
}
}
float3 l9_2294=l9_2293;
float3 l9_2295=l9_2294;
float4 l9_2296=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_2295.xy,bias(l9_2289));
float4 l9_2297=l9_2296;
if (l9_2227)
{
l9_2297=mix(l9_2228,l9_2297,float4(l9_2231));
}
float4 l9_2298=l9_2297;
l9_2212=l9_2298;
float4 l9_2299=l9_2212;
float3 l9_2300=l9_2299.xyz;
float3 l9_2301=l9_2300;
int l9_2302=l9_2104;
float l9_2303=(float(l9_2302)+0.5)/N0_texWidth;
float2 l9_2304=float2(l9_2303,0.5);
float4 l9_2305=float4(0.0);
int l9_2306;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_2307=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2307=0;
}
else
{
l9_2307=in.varStereoViewID;
}
int l9_2308=l9_2307;
l9_2306=1-l9_2308;
}
else
{
int l9_2309=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2309=0;
}
else
{
l9_2309=in.varStereoViewID;
}
int l9_2310=l9_2309;
l9_2306=l9_2310;
}
int l9_2311=l9_2306;
int l9_2312=pigmentTexLayout_tmp;
int l9_2313=l9_2311;
float2 l9_2314=l9_2304;
bool l9_2315=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_2316=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_2317=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_2318=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_2319=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_2320=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_2321=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_2322=0.0;
bool l9_2323=l9_2320&&(!l9_2318);
float l9_2324=1.0;
float l9_2325=l9_2314.x;
int l9_2326=l9_2317.x;
if (l9_2326==1)
{
l9_2325=fract(l9_2325);
}
else
{
if (l9_2326==2)
{
float l9_2327=fract(l9_2325);
float l9_2328=l9_2325-l9_2327;
float l9_2329=step(0.25,fract(l9_2328*0.5));
l9_2325=mix(l9_2327,1.0-l9_2327,fast::clamp(l9_2329,0.0,1.0));
}
}
l9_2314.x=l9_2325;
float l9_2330=l9_2314.y;
int l9_2331=l9_2317.y;
if (l9_2331==1)
{
l9_2330=fract(l9_2330);
}
else
{
if (l9_2331==2)
{
float l9_2332=fract(l9_2330);
float l9_2333=l9_2330-l9_2332;
float l9_2334=step(0.25,fract(l9_2333*0.5));
l9_2330=mix(l9_2332,1.0-l9_2332,fast::clamp(l9_2334,0.0,1.0));
}
}
l9_2314.y=l9_2330;
if (l9_2318)
{
bool l9_2335=l9_2320;
bool l9_2336;
if (l9_2335)
{
l9_2336=l9_2317.x==3;
}
else
{
l9_2336=l9_2335;
}
float l9_2337=l9_2314.x;
float l9_2338=l9_2319.x;
float l9_2339=l9_2319.z;
bool l9_2340=l9_2336;
float l9_2341=l9_2324;
float l9_2342=fast::clamp(l9_2337,l9_2338,l9_2339);
float l9_2343=step(abs(l9_2337-l9_2342),9.9999997e-06);
l9_2341*=(l9_2343+((1.0-float(l9_2340))*(1.0-l9_2343)));
l9_2337=l9_2342;
l9_2314.x=l9_2337;
l9_2324=l9_2341;
bool l9_2344=l9_2320;
bool l9_2345;
if (l9_2344)
{
l9_2345=l9_2317.y==3;
}
else
{
l9_2345=l9_2344;
}
float l9_2346=l9_2314.y;
float l9_2347=l9_2319.y;
float l9_2348=l9_2319.w;
bool l9_2349=l9_2345;
float l9_2350=l9_2324;
float l9_2351=fast::clamp(l9_2346,l9_2347,l9_2348);
float l9_2352=step(abs(l9_2346-l9_2351),9.9999997e-06);
l9_2350*=(l9_2352+((1.0-float(l9_2349))*(1.0-l9_2352)));
l9_2346=l9_2351;
l9_2314.y=l9_2346;
l9_2324=l9_2350;
}
float2 l9_2353=l9_2314;
bool l9_2354=l9_2315;
float3x3 l9_2355=l9_2316;
if (l9_2354)
{
l9_2353=float2((l9_2355*float3(l9_2353,1.0)).xy);
}
float2 l9_2356=l9_2353;
l9_2314=l9_2356;
float l9_2357=l9_2314.x;
int l9_2358=l9_2317.x;
bool l9_2359=l9_2323;
float l9_2360=l9_2324;
if ((l9_2358==0)||(l9_2358==3))
{
float l9_2361=l9_2357;
float l9_2362=0.0;
float l9_2363=1.0;
bool l9_2364=l9_2359;
float l9_2365=l9_2360;
float l9_2366=fast::clamp(l9_2361,l9_2362,l9_2363);
float l9_2367=step(abs(l9_2361-l9_2366),9.9999997e-06);
l9_2365*=(l9_2367+((1.0-float(l9_2364))*(1.0-l9_2367)));
l9_2361=l9_2366;
l9_2357=l9_2361;
l9_2360=l9_2365;
}
l9_2314.x=l9_2357;
l9_2324=l9_2360;
float l9_2368=l9_2314.y;
int l9_2369=l9_2317.y;
bool l9_2370=l9_2323;
float l9_2371=l9_2324;
if ((l9_2369==0)||(l9_2369==3))
{
float l9_2372=l9_2368;
float l9_2373=0.0;
float l9_2374=1.0;
bool l9_2375=l9_2370;
float l9_2376=l9_2371;
float l9_2377=fast::clamp(l9_2372,l9_2373,l9_2374);
float l9_2378=step(abs(l9_2372-l9_2377),9.9999997e-06);
l9_2376*=(l9_2378+((1.0-float(l9_2375))*(1.0-l9_2378)));
l9_2372=l9_2377;
l9_2368=l9_2372;
l9_2371=l9_2376;
}
l9_2314.y=l9_2368;
l9_2324=l9_2371;
float2 l9_2379=l9_2314;
int l9_2380=l9_2312;
int l9_2381=l9_2313;
float l9_2382=l9_2322;
float2 l9_2383=l9_2379;
int l9_2384=l9_2380;
int l9_2385=l9_2381;
float3 l9_2386=float3(0.0);
if (l9_2384==0)
{
l9_2386=float3(l9_2383,0.0);
}
else
{
if (l9_2384==1)
{
l9_2386=float3(l9_2383.x,(l9_2383.y*0.5)+(0.5-(float(l9_2385)*0.5)),0.0);
}
else
{
l9_2386=float3(l9_2383,float(l9_2385));
}
}
float3 l9_2387=l9_2386;
float3 l9_2388=l9_2387;
float4 l9_2389=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_2388.xy,bias(l9_2382));
float4 l9_2390=l9_2389;
if (l9_2320)
{
l9_2390=mix(l9_2321,l9_2390,float4(l9_2324));
}
float4 l9_2391=l9_2390;
l9_2305=l9_2391;
float4 l9_2392=l9_2305;
float3 l9_2393=l9_2392.xyz;
float3 l9_2394=l9_2393;
float3 l9_2395=l9_2208;
float3 l9_2396=l9_2301;
float3 l9_2397=l9_2394;
float l9_2398=l9_2113;
float l9_2399=l9_2114;
float l9_2400=l9_2115;
float l9_2401=(l9_2398+l9_2399)+l9_2400;
float l9_2402=l9_2398/fast::max(l9_2401,0.001);
float l9_2403=l9_2399/fast::max(l9_2401,0.001);
float l9_2404=l9_2400/fast::max(l9_2401,0.001);
float3 l9_2405=float3(0.0);
float l9_2406=l9_2395.x;
float l9_2407=1.0-l9_2406;
float l9_2408=2.0;
float l9_2409;
if (l9_2407<=0.0)
{
l9_2409=0.0;
}
else
{
l9_2409=pow(l9_2407,l9_2408);
}
float l9_2410=l9_2409;
float l9_2411=l9_2410/(2.0*fast::max(l9_2406,9.9999997e-05));
float l9_2412=l9_2411;
float l9_2413=l9_2402;
float l9_2414=l9_2396.x;
float l9_2415=1.0-l9_2414;
float l9_2416=2.0;
float l9_2417;
if (l9_2415<=0.0)
{
l9_2417=0.0;
}
else
{
l9_2417=pow(l9_2415,l9_2416);
}
float l9_2418=l9_2417;
float l9_2419=l9_2418/(2.0*fast::max(l9_2414,9.9999997e-05));
float l9_2420=l9_2419;
float l9_2421=l9_2403;
float l9_2422=l9_2397.x;
float l9_2423=1.0-l9_2422;
float l9_2424=2.0;
float l9_2425;
if (l9_2423<=0.0)
{
l9_2425=0.0;
}
else
{
l9_2425=pow(l9_2423,l9_2424);
}
float l9_2426=l9_2425;
float l9_2427=l9_2426/(2.0*fast::max(l9_2422,9.9999997e-05));
float l9_2428=((l9_2412*l9_2413)+(l9_2420*l9_2421))+(l9_2427*l9_2404);
float l9_2429=l9_2428;
float l9_2430=l9_2429;
float l9_2431=(l9_2429*l9_2429)+(2.0*l9_2429);
float l9_2432;
if (l9_2431<=0.0)
{
l9_2432=0.0;
}
else
{
l9_2432=sqrt(l9_2431);
}
float l9_2433=l9_2432;
float l9_2434=(1.0+l9_2430)-l9_2433;
l9_2405.x=l9_2434;
float l9_2435=l9_2395.y;
float l9_2436=1.0-l9_2435;
float l9_2437=2.0;
float l9_2438;
if (l9_2436<=0.0)
{
l9_2438=0.0;
}
else
{
l9_2438=pow(l9_2436,l9_2437);
}
float l9_2439=l9_2438;
float l9_2440=l9_2439/(2.0*fast::max(l9_2435,9.9999997e-05));
float l9_2441=l9_2440;
float l9_2442=l9_2402;
float l9_2443=l9_2396.y;
float l9_2444=1.0-l9_2443;
float l9_2445=2.0;
float l9_2446;
if (l9_2444<=0.0)
{
l9_2446=0.0;
}
else
{
l9_2446=pow(l9_2444,l9_2445);
}
float l9_2447=l9_2446;
float l9_2448=l9_2447/(2.0*fast::max(l9_2443,9.9999997e-05));
float l9_2449=l9_2448;
float l9_2450=l9_2403;
float l9_2451=l9_2397.y;
float l9_2452=1.0-l9_2451;
float l9_2453=2.0;
float l9_2454;
if (l9_2452<=0.0)
{
l9_2454=0.0;
}
else
{
l9_2454=pow(l9_2452,l9_2453);
}
float l9_2455=l9_2454;
float l9_2456=l9_2455/(2.0*fast::max(l9_2451,9.9999997e-05));
l9_2428=((l9_2441*l9_2442)+(l9_2449*l9_2450))+(l9_2456*l9_2404);
float l9_2457=l9_2428;
float l9_2458=l9_2457;
float l9_2459=(l9_2457*l9_2457)+(2.0*l9_2457);
float l9_2460;
if (l9_2459<=0.0)
{
l9_2460=0.0;
}
else
{
l9_2460=sqrt(l9_2459);
}
float l9_2461=l9_2460;
float l9_2462=(1.0+l9_2458)-l9_2461;
l9_2405.y=l9_2462;
float l9_2463=l9_2395.z;
float l9_2464=1.0-l9_2463;
float l9_2465=2.0;
float l9_2466;
if (l9_2464<=0.0)
{
l9_2466=0.0;
}
else
{
l9_2466=pow(l9_2464,l9_2465);
}
float l9_2467=l9_2466;
float l9_2468=l9_2467/(2.0*fast::max(l9_2463,9.9999997e-05));
float l9_2469=l9_2468;
float l9_2470=l9_2402;
float l9_2471=l9_2396.z;
float l9_2472=1.0-l9_2471;
float l9_2473=2.0;
float l9_2474;
if (l9_2472<=0.0)
{
l9_2474=0.0;
}
else
{
l9_2474=pow(l9_2472,l9_2473);
}
float l9_2475=l9_2474;
float l9_2476=l9_2475/(2.0*fast::max(l9_2471,9.9999997e-05));
float l9_2477=l9_2476;
float l9_2478=l9_2403;
float l9_2479=l9_2397.z;
float l9_2480=1.0-l9_2479;
float l9_2481=2.0;
float l9_2482;
if (l9_2480<=0.0)
{
l9_2482=0.0;
}
else
{
l9_2482=pow(l9_2480,l9_2481);
}
float l9_2483=l9_2482;
float l9_2484=l9_2483/(2.0*fast::max(l9_2479,9.9999997e-05));
l9_2428=((l9_2469*l9_2470)+(l9_2477*l9_2478))+(l9_2484*l9_2404);
float l9_2485=l9_2428;
float l9_2486=l9_2485;
float l9_2487=(l9_2485*l9_2485)+(2.0*l9_2485);
float l9_2488;
if (l9_2487<=0.0)
{
l9_2488=0.0;
}
else
{
l9_2488=sqrt(l9_2487);
}
float l9_2489=l9_2488;
float l9_2490=(1.0+l9_2486)-l9_2489;
l9_2405.z=l9_2490;
float3 l9_2491=fast::clamp(l9_2405,float3(0.0),float3(1.0));
l9_1735=l9_2491;
l9_1736=1.0;
l9_1737=float(l9_2102);
l9_1738=float(l9_2103);
l9_1739=float(l9_2104);
}
}
}
float3 l9_2492=l9_1735;
float l9_2493;
if (l9_2492.x>0.040449999)
{
float l9_2494=(l9_2492.x+0.055)/1.0549999;
float l9_2495=2.4000001;
float l9_2496;
if (l9_2494<=0.0)
{
l9_2496=0.0;
}
else
{
l9_2496=pow(l9_2494,l9_2495);
}
float l9_2497=l9_2496;
l9_2493=l9_2497;
}
else
{
l9_2493=l9_2492.x/12.92;
}
float l9_2498=l9_2493;
float l9_2499;
if (l9_2492.y>0.040449999)
{
float l9_2500=(l9_2492.y+0.055)/1.0549999;
float l9_2501=2.4000001;
float l9_2502;
if (l9_2500<=0.0)
{
l9_2502=0.0;
}
else
{
l9_2502=pow(l9_2500,l9_2501);
}
float l9_2503=l9_2502;
l9_2499=l9_2503;
}
else
{
l9_2499=l9_2492.y/12.92;
}
float l9_2504=l9_2499;
float l9_2505;
if (l9_2492.z>0.040449999)
{
float l9_2506=(l9_2492.z+0.055)/1.0549999;
float l9_2507=2.4000001;
float l9_2508;
if (l9_2506<=0.0)
{
l9_2508=0.0;
}
else
{
l9_2508=pow(l9_2506,l9_2507);
}
float l9_2509=l9_2508;
l9_2505=l9_2509;
}
else
{
l9_2505=l9_2492.z/12.92;
}
float l9_2510=l9_2505;
float l9_2511=((l9_2498*0.41245639)+(l9_2504*0.3575761))+(l9_2510*0.18043751);
float l9_2512=((l9_2498*0.2126729)+(l9_2504*0.7151522))+(l9_2510*0.072175004);
float l9_2513=((l9_2498*0.019333901)+(l9_2504*0.119192))+(l9_2510*0.95030409);
l9_2511/=0.95046997;
l9_2512/=1.0;
l9_2513/=1.08883;
float l9_2514=0.20689656;
float l9_2515=(l9_2514*l9_2514)*l9_2514;
float l9_2516=1.0/((3.0*l9_2514)*l9_2514);
float l9_2517=0.13793103;
float l9_2518;
if (l9_2511>l9_2515)
{
float l9_2519=l9_2511;
float l9_2520=0.33333334;
float l9_2521;
if (l9_2519<=0.0)
{
l9_2521=0.0;
}
else
{
l9_2521=pow(l9_2519,l9_2520);
}
float l9_2522=l9_2521;
l9_2518=l9_2522;
}
else
{
l9_2518=(l9_2516*l9_2511)+l9_2517;
}
float l9_2523=l9_2518;
float l9_2524;
if (l9_2512>l9_2515)
{
float l9_2525=l9_2512;
float l9_2526=0.33333334;
float l9_2527;
if (l9_2525<=0.0)
{
l9_2527=0.0;
}
else
{
l9_2527=pow(l9_2525,l9_2526);
}
float l9_2528=l9_2527;
l9_2524=l9_2528;
}
else
{
l9_2524=(l9_2516*l9_2512)+l9_2517;
}
float l9_2529=l9_2524;
float l9_2530;
if (l9_2513>l9_2515)
{
float l9_2531=l9_2513;
float l9_2532=0.33333334;
float l9_2533;
if (l9_2531<=0.0)
{
l9_2533=0.0;
}
else
{
l9_2533=pow(l9_2531,l9_2532);
}
float l9_2534=l9_2533;
l9_2530=l9_2534;
}
else
{
l9_2530=(l9_2516*l9_2513)+l9_2517;
}
float l9_2535=l9_2530;
float l9_2536=(116.0*l9_2529)-16.0;
float l9_2537=500.0*(l9_2523-l9_2529);
float l9_2538=200.0*(l9_2529-l9_2535);
float3 l9_2539=float3(l9_2536,l9_2537,l9_2538);
float3 l9_2540=l9_2539;
float l9_2541=l9_2540.x/100.0;
float l9_2542=fast::clamp(l9_2541,0.0,1.0)*65535.0;
float l9_2543=floor(l9_2542/256.0);
float l9_2544=l9_2542-(l9_2543*256.0);
float2 l9_2545=float2(l9_2543/255.0,l9_2544/255.0);
float2 l9_2546=l9_2545;
float l9_2547=l9_2540.y;
float l9_2548=150.0;
float l9_2549=(l9_2547+l9_2548)/(2.0*l9_2548);
float l9_2550=l9_2549;
float l9_2551=fast::clamp(l9_2550,0.0,1.0)*65535.0;
float l9_2552=floor(l9_2551/256.0);
float l9_2553=l9_2551-(l9_2552*256.0);
float2 l9_2554=float2(l9_2552/255.0,l9_2553/255.0);
float2 l9_2555=l9_2554;
float2 l9_2556=l9_2555;
float l9_2557=l9_2540.z;
float l9_2558=150.0;
float l9_2559=(l9_2557+l9_2558)/(2.0*l9_2558);
float l9_2560=l9_2559;
float l9_2561=fast::clamp(l9_2560,0.0,1.0)*65535.0;
float l9_2562=floor(l9_2561/256.0);
float l9_2563=l9_2561-(l9_2562*256.0);
float2 l9_2564=float2(l9_2562/255.0,l9_2563/255.0);
float2 l9_2565=l9_2564;
float2 l9_2566=l9_2565;
N0_labPosLA=float4(l9_2546.x,l9_2546.y,l9_2556.x,l9_2556.y)*l9_1736;
N0_labPosBV=float4(l9_2566.x,l9_2566.y,l9_1736,0.0);
N0_rgbCol=float4(l9_1735*l9_1736,l9_1736);
N0_mixInfo=float4(l9_1737/15.0,l9_1738/15.0,l9_1739/15.0,l9_1740)*l9_1736;
param_30=N0_rgbCol;
rgbCol_N0=param_30;
FinalColor2=rgbCol_N0;
float Output_N2_3=0.0;
float param_32=(*sc_set0.UserUniforms).numPigments;
Output_N2_3=param_32;
float Output_N3_3=0.0;
float param_33=(*sc_set0.UserUniforms).texWidth;
Output_N3_3=param_33;
float Output_N6_3=0.0;
float param_34=(*sc_set0.UserUniforms).texSize;
Output_N6_3=param_34;
float Output_N5_3=0.0;
float param_35=(*sc_set0.UserUniforms).mixSteps;
Output_N5_3=param_35;
float4 mixInfo_N0=float4(0.0);
float param_36=Output_N2_3;
float param_37=Output_N3_3;
float param_38=Output_N6_3;
float param_39=Output_N5_3;
ssGlobals param_41=Globals;
tempGlobals=param_41;
float4 param_40=float4(0.0);
N0_numPigments=param_36;
N0_texWidth=param_37;
N0_texSize=param_38;
N0_mixSteps=param_39;
float2 l9_2567=tempGlobals.gScreenCoord;
float2 l9_2568=l9_2567;
float l9_2569=floor(l9_2568.x*N0_texSize);
float l9_2570=floor(l9_2568.y*N0_texSize);
float l9_2571=(l9_2570*N0_texSize)+l9_2569;
int l9_2572=int(l9_2571);
int l9_2573=int(N0_numPigments);
int l9_2574=int(N0_mixSteps);
int l9_2575=l9_2573;
int l9_2576=(l9_2573*(l9_2573-1))/2;
int l9_2577=l9_2576*(l9_2574-1);
int l9_2578=((l9_2573*(l9_2573-1))*(l9_2573-2))/6;
int l9_2579=0;
int l9_2580=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2580<64)
{
if (l9_2580>=(l9_2574-1))
{
break;
}
int l9_2581=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2581<64)
{
if (l9_2581>=(l9_2574-l9_2580))
{
break;
}
l9_2579++;
l9_2581++;
continue;
}
else
{
break;
}
}
l9_2580++;
continue;
}
else
{
break;
}
}
int l9_2582=l9_2578*l9_2579;
int l9_2583=(l9_2575+l9_2577)+l9_2582;
float3 l9_2584=float3(0.0);
float l9_2585=0.0;
float l9_2586=0.0;
float l9_2587=0.0;
float l9_2588=0.0;
float l9_2589=0.0;
if (l9_2572<l9_2575)
{
int l9_2590=l9_2572;
float l9_2591=(float(l9_2590)+0.5)/N0_texWidth;
float2 l9_2592=float2(l9_2591,0.5);
float4 l9_2593=float4(0.0);
int l9_2594;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_2595=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2595=0;
}
else
{
l9_2595=in.varStereoViewID;
}
int l9_2596=l9_2595;
l9_2594=1-l9_2596;
}
else
{
int l9_2597=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2597=0;
}
else
{
l9_2597=in.varStereoViewID;
}
int l9_2598=l9_2597;
l9_2594=l9_2598;
}
int l9_2599=l9_2594;
int l9_2600=pigmentTexLayout_tmp;
int l9_2601=l9_2599;
float2 l9_2602=l9_2592;
bool l9_2603=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_2604=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_2605=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_2606=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_2607=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_2608=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_2609=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_2610=0.0;
bool l9_2611=l9_2608&&(!l9_2606);
float l9_2612=1.0;
float l9_2613=l9_2602.x;
int l9_2614=l9_2605.x;
if (l9_2614==1)
{
l9_2613=fract(l9_2613);
}
else
{
if (l9_2614==2)
{
float l9_2615=fract(l9_2613);
float l9_2616=l9_2613-l9_2615;
float l9_2617=step(0.25,fract(l9_2616*0.5));
l9_2613=mix(l9_2615,1.0-l9_2615,fast::clamp(l9_2617,0.0,1.0));
}
}
l9_2602.x=l9_2613;
float l9_2618=l9_2602.y;
int l9_2619=l9_2605.y;
if (l9_2619==1)
{
l9_2618=fract(l9_2618);
}
else
{
if (l9_2619==2)
{
float l9_2620=fract(l9_2618);
float l9_2621=l9_2618-l9_2620;
float l9_2622=step(0.25,fract(l9_2621*0.5));
l9_2618=mix(l9_2620,1.0-l9_2620,fast::clamp(l9_2622,0.0,1.0));
}
}
l9_2602.y=l9_2618;
if (l9_2606)
{
bool l9_2623=l9_2608;
bool l9_2624;
if (l9_2623)
{
l9_2624=l9_2605.x==3;
}
else
{
l9_2624=l9_2623;
}
float l9_2625=l9_2602.x;
float l9_2626=l9_2607.x;
float l9_2627=l9_2607.z;
bool l9_2628=l9_2624;
float l9_2629=l9_2612;
float l9_2630=fast::clamp(l9_2625,l9_2626,l9_2627);
float l9_2631=step(abs(l9_2625-l9_2630),9.9999997e-06);
l9_2629*=(l9_2631+((1.0-float(l9_2628))*(1.0-l9_2631)));
l9_2625=l9_2630;
l9_2602.x=l9_2625;
l9_2612=l9_2629;
bool l9_2632=l9_2608;
bool l9_2633;
if (l9_2632)
{
l9_2633=l9_2605.y==3;
}
else
{
l9_2633=l9_2632;
}
float l9_2634=l9_2602.y;
float l9_2635=l9_2607.y;
float l9_2636=l9_2607.w;
bool l9_2637=l9_2633;
float l9_2638=l9_2612;
float l9_2639=fast::clamp(l9_2634,l9_2635,l9_2636);
float l9_2640=step(abs(l9_2634-l9_2639),9.9999997e-06);
l9_2638*=(l9_2640+((1.0-float(l9_2637))*(1.0-l9_2640)));
l9_2634=l9_2639;
l9_2602.y=l9_2634;
l9_2612=l9_2638;
}
float2 l9_2641=l9_2602;
bool l9_2642=l9_2603;
float3x3 l9_2643=l9_2604;
if (l9_2642)
{
l9_2641=float2((l9_2643*float3(l9_2641,1.0)).xy);
}
float2 l9_2644=l9_2641;
l9_2602=l9_2644;
float l9_2645=l9_2602.x;
int l9_2646=l9_2605.x;
bool l9_2647=l9_2611;
float l9_2648=l9_2612;
if ((l9_2646==0)||(l9_2646==3))
{
float l9_2649=l9_2645;
float l9_2650=0.0;
float l9_2651=1.0;
bool l9_2652=l9_2647;
float l9_2653=l9_2648;
float l9_2654=fast::clamp(l9_2649,l9_2650,l9_2651);
float l9_2655=step(abs(l9_2649-l9_2654),9.9999997e-06);
l9_2653*=(l9_2655+((1.0-float(l9_2652))*(1.0-l9_2655)));
l9_2649=l9_2654;
l9_2645=l9_2649;
l9_2648=l9_2653;
}
l9_2602.x=l9_2645;
l9_2612=l9_2648;
float l9_2656=l9_2602.y;
int l9_2657=l9_2605.y;
bool l9_2658=l9_2611;
float l9_2659=l9_2612;
if ((l9_2657==0)||(l9_2657==3))
{
float l9_2660=l9_2656;
float l9_2661=0.0;
float l9_2662=1.0;
bool l9_2663=l9_2658;
float l9_2664=l9_2659;
float l9_2665=fast::clamp(l9_2660,l9_2661,l9_2662);
float l9_2666=step(abs(l9_2660-l9_2665),9.9999997e-06);
l9_2664*=(l9_2666+((1.0-float(l9_2663))*(1.0-l9_2666)));
l9_2660=l9_2665;
l9_2656=l9_2660;
l9_2659=l9_2664;
}
l9_2602.y=l9_2656;
l9_2612=l9_2659;
float2 l9_2667=l9_2602;
int l9_2668=l9_2600;
int l9_2669=l9_2601;
float l9_2670=l9_2610;
float2 l9_2671=l9_2667;
int l9_2672=l9_2668;
int l9_2673=l9_2669;
float3 l9_2674=float3(0.0);
if (l9_2672==0)
{
l9_2674=float3(l9_2671,0.0);
}
else
{
if (l9_2672==1)
{
l9_2674=float3(l9_2671.x,(l9_2671.y*0.5)+(0.5-(float(l9_2673)*0.5)),0.0);
}
else
{
l9_2674=float3(l9_2671,float(l9_2673));
}
}
float3 l9_2675=l9_2674;
float3 l9_2676=l9_2675;
float4 l9_2677=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_2676.xy,bias(l9_2670));
float4 l9_2678=l9_2677;
if (l9_2608)
{
l9_2678=mix(l9_2609,l9_2678,float4(l9_2612));
}
float4 l9_2679=l9_2678;
l9_2593=l9_2679;
float4 l9_2680=l9_2593;
float3 l9_2681=l9_2680.xyz;
l9_2584=l9_2681;
l9_2585=1.0;
l9_2586=float(l9_2572);
}
else
{
if (l9_2572<(l9_2575+l9_2577))
{
int l9_2682=l9_2572-l9_2575;
int l9_2683=l9_2682/(l9_2574-1);
int l9_2684=l9_2682-(l9_2683*(l9_2574-1));
int l9_2685=0;
int l9_2686=0;
int l9_2687=1;
int l9_2688=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2688<16)
{
if (l9_2688>=l9_2573)
{
break;
}
int l9_2689=l9_2688+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2689<16)
{
if (l9_2689>=l9_2573)
{
break;
}
if (l9_2685==l9_2683)
{
l9_2686=l9_2688;
l9_2687=l9_2689;
}
l9_2685++;
l9_2689++;
continue;
}
else
{
break;
}
}
l9_2688++;
continue;
}
else
{
break;
}
}
float l9_2690=float(l9_2684+1)/float(l9_2574);
int l9_2691=l9_2686;
float l9_2692=(float(l9_2691)+0.5)/N0_texWidth;
float2 l9_2693=float2(l9_2692,0.5);
float4 l9_2694=float4(0.0);
int l9_2695;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_2696=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2696=0;
}
else
{
l9_2696=in.varStereoViewID;
}
int l9_2697=l9_2696;
l9_2695=1-l9_2697;
}
else
{
int l9_2698=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2698=0;
}
else
{
l9_2698=in.varStereoViewID;
}
int l9_2699=l9_2698;
l9_2695=l9_2699;
}
int l9_2700=l9_2695;
int l9_2701=pigmentTexLayout_tmp;
int l9_2702=l9_2700;
float2 l9_2703=l9_2693;
bool l9_2704=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_2705=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_2706=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_2707=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_2708=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_2709=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_2710=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_2711=0.0;
bool l9_2712=l9_2709&&(!l9_2707);
float l9_2713=1.0;
float l9_2714=l9_2703.x;
int l9_2715=l9_2706.x;
if (l9_2715==1)
{
l9_2714=fract(l9_2714);
}
else
{
if (l9_2715==2)
{
float l9_2716=fract(l9_2714);
float l9_2717=l9_2714-l9_2716;
float l9_2718=step(0.25,fract(l9_2717*0.5));
l9_2714=mix(l9_2716,1.0-l9_2716,fast::clamp(l9_2718,0.0,1.0));
}
}
l9_2703.x=l9_2714;
float l9_2719=l9_2703.y;
int l9_2720=l9_2706.y;
if (l9_2720==1)
{
l9_2719=fract(l9_2719);
}
else
{
if (l9_2720==2)
{
float l9_2721=fract(l9_2719);
float l9_2722=l9_2719-l9_2721;
float l9_2723=step(0.25,fract(l9_2722*0.5));
l9_2719=mix(l9_2721,1.0-l9_2721,fast::clamp(l9_2723,0.0,1.0));
}
}
l9_2703.y=l9_2719;
if (l9_2707)
{
bool l9_2724=l9_2709;
bool l9_2725;
if (l9_2724)
{
l9_2725=l9_2706.x==3;
}
else
{
l9_2725=l9_2724;
}
float l9_2726=l9_2703.x;
float l9_2727=l9_2708.x;
float l9_2728=l9_2708.z;
bool l9_2729=l9_2725;
float l9_2730=l9_2713;
float l9_2731=fast::clamp(l9_2726,l9_2727,l9_2728);
float l9_2732=step(abs(l9_2726-l9_2731),9.9999997e-06);
l9_2730*=(l9_2732+((1.0-float(l9_2729))*(1.0-l9_2732)));
l9_2726=l9_2731;
l9_2703.x=l9_2726;
l9_2713=l9_2730;
bool l9_2733=l9_2709;
bool l9_2734;
if (l9_2733)
{
l9_2734=l9_2706.y==3;
}
else
{
l9_2734=l9_2733;
}
float l9_2735=l9_2703.y;
float l9_2736=l9_2708.y;
float l9_2737=l9_2708.w;
bool l9_2738=l9_2734;
float l9_2739=l9_2713;
float l9_2740=fast::clamp(l9_2735,l9_2736,l9_2737);
float l9_2741=step(abs(l9_2735-l9_2740),9.9999997e-06);
l9_2739*=(l9_2741+((1.0-float(l9_2738))*(1.0-l9_2741)));
l9_2735=l9_2740;
l9_2703.y=l9_2735;
l9_2713=l9_2739;
}
float2 l9_2742=l9_2703;
bool l9_2743=l9_2704;
float3x3 l9_2744=l9_2705;
if (l9_2743)
{
l9_2742=float2((l9_2744*float3(l9_2742,1.0)).xy);
}
float2 l9_2745=l9_2742;
l9_2703=l9_2745;
float l9_2746=l9_2703.x;
int l9_2747=l9_2706.x;
bool l9_2748=l9_2712;
float l9_2749=l9_2713;
if ((l9_2747==0)||(l9_2747==3))
{
float l9_2750=l9_2746;
float l9_2751=0.0;
float l9_2752=1.0;
bool l9_2753=l9_2748;
float l9_2754=l9_2749;
float l9_2755=fast::clamp(l9_2750,l9_2751,l9_2752);
float l9_2756=step(abs(l9_2750-l9_2755),9.9999997e-06);
l9_2754*=(l9_2756+((1.0-float(l9_2753))*(1.0-l9_2756)));
l9_2750=l9_2755;
l9_2746=l9_2750;
l9_2749=l9_2754;
}
l9_2703.x=l9_2746;
l9_2713=l9_2749;
float l9_2757=l9_2703.y;
int l9_2758=l9_2706.y;
bool l9_2759=l9_2712;
float l9_2760=l9_2713;
if ((l9_2758==0)||(l9_2758==3))
{
float l9_2761=l9_2757;
float l9_2762=0.0;
float l9_2763=1.0;
bool l9_2764=l9_2759;
float l9_2765=l9_2760;
float l9_2766=fast::clamp(l9_2761,l9_2762,l9_2763);
float l9_2767=step(abs(l9_2761-l9_2766),9.9999997e-06);
l9_2765*=(l9_2767+((1.0-float(l9_2764))*(1.0-l9_2767)));
l9_2761=l9_2766;
l9_2757=l9_2761;
l9_2760=l9_2765;
}
l9_2703.y=l9_2757;
l9_2713=l9_2760;
float2 l9_2768=l9_2703;
int l9_2769=l9_2701;
int l9_2770=l9_2702;
float l9_2771=l9_2711;
float2 l9_2772=l9_2768;
int l9_2773=l9_2769;
int l9_2774=l9_2770;
float3 l9_2775=float3(0.0);
if (l9_2773==0)
{
l9_2775=float3(l9_2772,0.0);
}
else
{
if (l9_2773==1)
{
l9_2775=float3(l9_2772.x,(l9_2772.y*0.5)+(0.5-(float(l9_2774)*0.5)),0.0);
}
else
{
l9_2775=float3(l9_2772,float(l9_2774));
}
}
float3 l9_2776=l9_2775;
float3 l9_2777=l9_2776;
float4 l9_2778=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_2777.xy,bias(l9_2771));
float4 l9_2779=l9_2778;
if (l9_2709)
{
l9_2779=mix(l9_2710,l9_2779,float4(l9_2713));
}
float4 l9_2780=l9_2779;
l9_2694=l9_2780;
float4 l9_2781=l9_2694;
float3 l9_2782=l9_2781.xyz;
float3 l9_2783=l9_2782;
int l9_2784=l9_2687;
float l9_2785=(float(l9_2784)+0.5)/N0_texWidth;
float2 l9_2786=float2(l9_2785,0.5);
float4 l9_2787=float4(0.0);
int l9_2788;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_2789=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2789=0;
}
else
{
l9_2789=in.varStereoViewID;
}
int l9_2790=l9_2789;
l9_2788=1-l9_2790;
}
else
{
int l9_2791=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2791=0;
}
else
{
l9_2791=in.varStereoViewID;
}
int l9_2792=l9_2791;
l9_2788=l9_2792;
}
int l9_2793=l9_2788;
int l9_2794=pigmentTexLayout_tmp;
int l9_2795=l9_2793;
float2 l9_2796=l9_2786;
bool l9_2797=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_2798=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_2799=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_2800=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_2801=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_2802=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_2803=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_2804=0.0;
bool l9_2805=l9_2802&&(!l9_2800);
float l9_2806=1.0;
float l9_2807=l9_2796.x;
int l9_2808=l9_2799.x;
if (l9_2808==1)
{
l9_2807=fract(l9_2807);
}
else
{
if (l9_2808==2)
{
float l9_2809=fract(l9_2807);
float l9_2810=l9_2807-l9_2809;
float l9_2811=step(0.25,fract(l9_2810*0.5));
l9_2807=mix(l9_2809,1.0-l9_2809,fast::clamp(l9_2811,0.0,1.0));
}
}
l9_2796.x=l9_2807;
float l9_2812=l9_2796.y;
int l9_2813=l9_2799.y;
if (l9_2813==1)
{
l9_2812=fract(l9_2812);
}
else
{
if (l9_2813==2)
{
float l9_2814=fract(l9_2812);
float l9_2815=l9_2812-l9_2814;
float l9_2816=step(0.25,fract(l9_2815*0.5));
l9_2812=mix(l9_2814,1.0-l9_2814,fast::clamp(l9_2816,0.0,1.0));
}
}
l9_2796.y=l9_2812;
if (l9_2800)
{
bool l9_2817=l9_2802;
bool l9_2818;
if (l9_2817)
{
l9_2818=l9_2799.x==3;
}
else
{
l9_2818=l9_2817;
}
float l9_2819=l9_2796.x;
float l9_2820=l9_2801.x;
float l9_2821=l9_2801.z;
bool l9_2822=l9_2818;
float l9_2823=l9_2806;
float l9_2824=fast::clamp(l9_2819,l9_2820,l9_2821);
float l9_2825=step(abs(l9_2819-l9_2824),9.9999997e-06);
l9_2823*=(l9_2825+((1.0-float(l9_2822))*(1.0-l9_2825)));
l9_2819=l9_2824;
l9_2796.x=l9_2819;
l9_2806=l9_2823;
bool l9_2826=l9_2802;
bool l9_2827;
if (l9_2826)
{
l9_2827=l9_2799.y==3;
}
else
{
l9_2827=l9_2826;
}
float l9_2828=l9_2796.y;
float l9_2829=l9_2801.y;
float l9_2830=l9_2801.w;
bool l9_2831=l9_2827;
float l9_2832=l9_2806;
float l9_2833=fast::clamp(l9_2828,l9_2829,l9_2830);
float l9_2834=step(abs(l9_2828-l9_2833),9.9999997e-06);
l9_2832*=(l9_2834+((1.0-float(l9_2831))*(1.0-l9_2834)));
l9_2828=l9_2833;
l9_2796.y=l9_2828;
l9_2806=l9_2832;
}
float2 l9_2835=l9_2796;
bool l9_2836=l9_2797;
float3x3 l9_2837=l9_2798;
if (l9_2836)
{
l9_2835=float2((l9_2837*float3(l9_2835,1.0)).xy);
}
float2 l9_2838=l9_2835;
l9_2796=l9_2838;
float l9_2839=l9_2796.x;
int l9_2840=l9_2799.x;
bool l9_2841=l9_2805;
float l9_2842=l9_2806;
if ((l9_2840==0)||(l9_2840==3))
{
float l9_2843=l9_2839;
float l9_2844=0.0;
float l9_2845=1.0;
bool l9_2846=l9_2841;
float l9_2847=l9_2842;
float l9_2848=fast::clamp(l9_2843,l9_2844,l9_2845);
float l9_2849=step(abs(l9_2843-l9_2848),9.9999997e-06);
l9_2847*=(l9_2849+((1.0-float(l9_2846))*(1.0-l9_2849)));
l9_2843=l9_2848;
l9_2839=l9_2843;
l9_2842=l9_2847;
}
l9_2796.x=l9_2839;
l9_2806=l9_2842;
float l9_2850=l9_2796.y;
int l9_2851=l9_2799.y;
bool l9_2852=l9_2805;
float l9_2853=l9_2806;
if ((l9_2851==0)||(l9_2851==3))
{
float l9_2854=l9_2850;
float l9_2855=0.0;
float l9_2856=1.0;
bool l9_2857=l9_2852;
float l9_2858=l9_2853;
float l9_2859=fast::clamp(l9_2854,l9_2855,l9_2856);
float l9_2860=step(abs(l9_2854-l9_2859),9.9999997e-06);
l9_2858*=(l9_2860+((1.0-float(l9_2857))*(1.0-l9_2860)));
l9_2854=l9_2859;
l9_2850=l9_2854;
l9_2853=l9_2858;
}
l9_2796.y=l9_2850;
l9_2806=l9_2853;
float2 l9_2861=l9_2796;
int l9_2862=l9_2794;
int l9_2863=l9_2795;
float l9_2864=l9_2804;
float2 l9_2865=l9_2861;
int l9_2866=l9_2862;
int l9_2867=l9_2863;
float3 l9_2868=float3(0.0);
if (l9_2866==0)
{
l9_2868=float3(l9_2865,0.0);
}
else
{
if (l9_2866==1)
{
l9_2868=float3(l9_2865.x,(l9_2865.y*0.5)+(0.5-(float(l9_2867)*0.5)),0.0);
}
else
{
l9_2868=float3(l9_2865,float(l9_2867));
}
}
float3 l9_2869=l9_2868;
float3 l9_2870=l9_2869;
float4 l9_2871=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_2870.xy,bias(l9_2864));
float4 l9_2872=l9_2871;
if (l9_2802)
{
l9_2872=mix(l9_2803,l9_2872,float4(l9_2806));
}
float4 l9_2873=l9_2872;
l9_2787=l9_2873;
float4 l9_2874=l9_2787;
float3 l9_2875=l9_2874.xyz;
float3 l9_2876=l9_2875;
float3 l9_2877=l9_2783;
float3 l9_2878=l9_2876;
float l9_2879=l9_2690;
float l9_2880=1.0-l9_2690;
float l9_2881=l9_2879+l9_2880;
float l9_2882=l9_2879/fast::max(l9_2881,0.001);
float l9_2883=l9_2880/fast::max(l9_2881,0.001);
float3 l9_2884=float3(0.0);
float l9_2885=l9_2877.x;
float l9_2886=1.0-l9_2885;
float l9_2887=2.0;
float l9_2888;
if (l9_2886<=0.0)
{
l9_2888=0.0;
}
else
{
l9_2888=pow(l9_2886,l9_2887);
}
float l9_2889=l9_2888;
float l9_2890=l9_2889/(2.0*fast::max(l9_2885,9.9999997e-05));
float l9_2891=l9_2890;
float l9_2892=l9_2882;
float l9_2893=l9_2878.x;
float l9_2894=1.0-l9_2893;
float l9_2895=2.0;
float l9_2896;
if (l9_2894<=0.0)
{
l9_2896=0.0;
}
else
{
l9_2896=pow(l9_2894,l9_2895);
}
float l9_2897=l9_2896;
float l9_2898=l9_2897/(2.0*fast::max(l9_2893,9.9999997e-05));
float l9_2899=(l9_2891*l9_2892)+(l9_2898*l9_2883);
float l9_2900=l9_2899;
float l9_2901=l9_2900;
float l9_2902=(l9_2900*l9_2900)+(2.0*l9_2900);
float l9_2903;
if (l9_2902<=0.0)
{
l9_2903=0.0;
}
else
{
l9_2903=sqrt(l9_2902);
}
float l9_2904=l9_2903;
float l9_2905=(1.0+l9_2901)-l9_2904;
l9_2884.x=l9_2905;
float l9_2906=l9_2877.y;
float l9_2907=1.0-l9_2906;
float l9_2908=2.0;
float l9_2909;
if (l9_2907<=0.0)
{
l9_2909=0.0;
}
else
{
l9_2909=pow(l9_2907,l9_2908);
}
float l9_2910=l9_2909;
float l9_2911=l9_2910/(2.0*fast::max(l9_2906,9.9999997e-05));
float l9_2912=l9_2911;
float l9_2913=l9_2882;
float l9_2914=l9_2878.y;
float l9_2915=1.0-l9_2914;
float l9_2916=2.0;
float l9_2917;
if (l9_2915<=0.0)
{
l9_2917=0.0;
}
else
{
l9_2917=pow(l9_2915,l9_2916);
}
float l9_2918=l9_2917;
float l9_2919=l9_2918/(2.0*fast::max(l9_2914,9.9999997e-05));
l9_2899=(l9_2912*l9_2913)+(l9_2919*l9_2883);
float l9_2920=l9_2899;
float l9_2921=l9_2920;
float l9_2922=(l9_2920*l9_2920)+(2.0*l9_2920);
float l9_2923;
if (l9_2922<=0.0)
{
l9_2923=0.0;
}
else
{
l9_2923=sqrt(l9_2922);
}
float l9_2924=l9_2923;
float l9_2925=(1.0+l9_2921)-l9_2924;
l9_2884.y=l9_2925;
float l9_2926=l9_2877.z;
float l9_2927=1.0-l9_2926;
float l9_2928=2.0;
float l9_2929;
if (l9_2927<=0.0)
{
l9_2929=0.0;
}
else
{
l9_2929=pow(l9_2927,l9_2928);
}
float l9_2930=l9_2929;
float l9_2931=l9_2930/(2.0*fast::max(l9_2926,9.9999997e-05));
float l9_2932=l9_2931;
float l9_2933=l9_2882;
float l9_2934=l9_2878.z;
float l9_2935=1.0-l9_2934;
float l9_2936=2.0;
float l9_2937;
if (l9_2935<=0.0)
{
l9_2937=0.0;
}
else
{
l9_2937=pow(l9_2935,l9_2936);
}
float l9_2938=l9_2937;
float l9_2939=l9_2938/(2.0*fast::max(l9_2934,9.9999997e-05));
l9_2899=(l9_2932*l9_2933)+(l9_2939*l9_2883);
float l9_2940=l9_2899;
float l9_2941=l9_2940;
float l9_2942=(l9_2940*l9_2940)+(2.0*l9_2940);
float l9_2943;
if (l9_2942<=0.0)
{
l9_2943=0.0;
}
else
{
l9_2943=sqrt(l9_2942);
}
float l9_2944=l9_2943;
float l9_2945=(1.0+l9_2941)-l9_2944;
l9_2884.z=l9_2945;
float3 l9_2946=fast::clamp(l9_2884,float3(0.0),float3(1.0));
l9_2584=l9_2946;
l9_2585=1.0;
l9_2586=float(l9_2686);
l9_2587=float(l9_2687);
l9_2589=l9_2690;
}
else
{
if (l9_2572<l9_2583)
{
int l9_2947=(l9_2572-l9_2575)-l9_2577;
int l9_2948=l9_2947/l9_2579;
int l9_2949=l9_2947-(l9_2948*l9_2579);
int l9_2950=0;
int l9_2951=0;
int l9_2952=1;
int l9_2953=2;
int l9_2954=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2954<16)
{
if (l9_2954>=l9_2573)
{
break;
}
int l9_2955=l9_2954+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2955<16)
{
if (l9_2955>=l9_2573)
{
break;
}
int l9_2956=l9_2955+1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2956<16)
{
if (l9_2956>=l9_2573)
{
break;
}
if (l9_2950==l9_2948)
{
l9_2951=l9_2954;
l9_2952=l9_2955;
l9_2953=l9_2956;
}
l9_2950++;
l9_2956++;
continue;
}
else
{
break;
}
}
l9_2955++;
continue;
}
else
{
break;
}
}
l9_2954++;
continue;
}
else
{
break;
}
}
int l9_2957=0;
int l9_2958=1;
int l9_2959=1;
int l9_2960=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2960<64)
{
if (l9_2960>=(l9_2574-1))
{
break;
}
int l9_2961=1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_2961<64)
{
if (l9_2961>=(l9_2574-l9_2960))
{
break;
}
if (l9_2957==l9_2949)
{
l9_2958=l9_2960;
l9_2959=l9_2961;
}
l9_2957++;
l9_2961++;
continue;
}
else
{
break;
}
}
l9_2960++;
continue;
}
else
{
break;
}
}
float l9_2962=float(l9_2958)/float(l9_2574);
float l9_2963=float(l9_2959)/float(l9_2574);
float l9_2964=(1.0-l9_2962)-l9_2963;
int l9_2965=l9_2951;
float l9_2966=(float(l9_2965)+0.5)/N0_texWidth;
float2 l9_2967=float2(l9_2966,0.5);
float4 l9_2968=float4(0.0);
int l9_2969;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_2970=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2970=0;
}
else
{
l9_2970=in.varStereoViewID;
}
int l9_2971=l9_2970;
l9_2969=1-l9_2971;
}
else
{
int l9_2972=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2972=0;
}
else
{
l9_2972=in.varStereoViewID;
}
int l9_2973=l9_2972;
l9_2969=l9_2973;
}
int l9_2974=l9_2969;
int l9_2975=pigmentTexLayout_tmp;
int l9_2976=l9_2974;
float2 l9_2977=l9_2967;
bool l9_2978=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_2979=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_2980=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_2981=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_2982=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_2983=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_2984=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_2985=0.0;
bool l9_2986=l9_2983&&(!l9_2981);
float l9_2987=1.0;
float l9_2988=l9_2977.x;
int l9_2989=l9_2980.x;
if (l9_2989==1)
{
l9_2988=fract(l9_2988);
}
else
{
if (l9_2989==2)
{
float l9_2990=fract(l9_2988);
float l9_2991=l9_2988-l9_2990;
float l9_2992=step(0.25,fract(l9_2991*0.5));
l9_2988=mix(l9_2990,1.0-l9_2990,fast::clamp(l9_2992,0.0,1.0));
}
}
l9_2977.x=l9_2988;
float l9_2993=l9_2977.y;
int l9_2994=l9_2980.y;
if (l9_2994==1)
{
l9_2993=fract(l9_2993);
}
else
{
if (l9_2994==2)
{
float l9_2995=fract(l9_2993);
float l9_2996=l9_2993-l9_2995;
float l9_2997=step(0.25,fract(l9_2996*0.5));
l9_2993=mix(l9_2995,1.0-l9_2995,fast::clamp(l9_2997,0.0,1.0));
}
}
l9_2977.y=l9_2993;
if (l9_2981)
{
bool l9_2998=l9_2983;
bool l9_2999;
if (l9_2998)
{
l9_2999=l9_2980.x==3;
}
else
{
l9_2999=l9_2998;
}
float l9_3000=l9_2977.x;
float l9_3001=l9_2982.x;
float l9_3002=l9_2982.z;
bool l9_3003=l9_2999;
float l9_3004=l9_2987;
float l9_3005=fast::clamp(l9_3000,l9_3001,l9_3002);
float l9_3006=step(abs(l9_3000-l9_3005),9.9999997e-06);
l9_3004*=(l9_3006+((1.0-float(l9_3003))*(1.0-l9_3006)));
l9_3000=l9_3005;
l9_2977.x=l9_3000;
l9_2987=l9_3004;
bool l9_3007=l9_2983;
bool l9_3008;
if (l9_3007)
{
l9_3008=l9_2980.y==3;
}
else
{
l9_3008=l9_3007;
}
float l9_3009=l9_2977.y;
float l9_3010=l9_2982.y;
float l9_3011=l9_2982.w;
bool l9_3012=l9_3008;
float l9_3013=l9_2987;
float l9_3014=fast::clamp(l9_3009,l9_3010,l9_3011);
float l9_3015=step(abs(l9_3009-l9_3014),9.9999997e-06);
l9_3013*=(l9_3015+((1.0-float(l9_3012))*(1.0-l9_3015)));
l9_3009=l9_3014;
l9_2977.y=l9_3009;
l9_2987=l9_3013;
}
float2 l9_3016=l9_2977;
bool l9_3017=l9_2978;
float3x3 l9_3018=l9_2979;
if (l9_3017)
{
l9_3016=float2((l9_3018*float3(l9_3016,1.0)).xy);
}
float2 l9_3019=l9_3016;
l9_2977=l9_3019;
float l9_3020=l9_2977.x;
int l9_3021=l9_2980.x;
bool l9_3022=l9_2986;
float l9_3023=l9_2987;
if ((l9_3021==0)||(l9_3021==3))
{
float l9_3024=l9_3020;
float l9_3025=0.0;
float l9_3026=1.0;
bool l9_3027=l9_3022;
float l9_3028=l9_3023;
float l9_3029=fast::clamp(l9_3024,l9_3025,l9_3026);
float l9_3030=step(abs(l9_3024-l9_3029),9.9999997e-06);
l9_3028*=(l9_3030+((1.0-float(l9_3027))*(1.0-l9_3030)));
l9_3024=l9_3029;
l9_3020=l9_3024;
l9_3023=l9_3028;
}
l9_2977.x=l9_3020;
l9_2987=l9_3023;
float l9_3031=l9_2977.y;
int l9_3032=l9_2980.y;
bool l9_3033=l9_2986;
float l9_3034=l9_2987;
if ((l9_3032==0)||(l9_3032==3))
{
float l9_3035=l9_3031;
float l9_3036=0.0;
float l9_3037=1.0;
bool l9_3038=l9_3033;
float l9_3039=l9_3034;
float l9_3040=fast::clamp(l9_3035,l9_3036,l9_3037);
float l9_3041=step(abs(l9_3035-l9_3040),9.9999997e-06);
l9_3039*=(l9_3041+((1.0-float(l9_3038))*(1.0-l9_3041)));
l9_3035=l9_3040;
l9_3031=l9_3035;
l9_3034=l9_3039;
}
l9_2977.y=l9_3031;
l9_2987=l9_3034;
float2 l9_3042=l9_2977;
int l9_3043=l9_2975;
int l9_3044=l9_2976;
float l9_3045=l9_2985;
float2 l9_3046=l9_3042;
int l9_3047=l9_3043;
int l9_3048=l9_3044;
float3 l9_3049=float3(0.0);
if (l9_3047==0)
{
l9_3049=float3(l9_3046,0.0);
}
else
{
if (l9_3047==1)
{
l9_3049=float3(l9_3046.x,(l9_3046.y*0.5)+(0.5-(float(l9_3048)*0.5)),0.0);
}
else
{
l9_3049=float3(l9_3046,float(l9_3048));
}
}
float3 l9_3050=l9_3049;
float3 l9_3051=l9_3050;
float4 l9_3052=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_3051.xy,bias(l9_3045));
float4 l9_3053=l9_3052;
if (l9_2983)
{
l9_3053=mix(l9_2984,l9_3053,float4(l9_2987));
}
float4 l9_3054=l9_3053;
l9_2968=l9_3054;
float4 l9_3055=l9_2968;
float3 l9_3056=l9_3055.xyz;
float3 l9_3057=l9_3056;
int l9_3058=l9_2952;
float l9_3059=(float(l9_3058)+0.5)/N0_texWidth;
float2 l9_3060=float2(l9_3059,0.5);
float4 l9_3061=float4(0.0);
int l9_3062;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_3063=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3063=0;
}
else
{
l9_3063=in.varStereoViewID;
}
int l9_3064=l9_3063;
l9_3062=1-l9_3064;
}
else
{
int l9_3065=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3065=0;
}
else
{
l9_3065=in.varStereoViewID;
}
int l9_3066=l9_3065;
l9_3062=l9_3066;
}
int l9_3067=l9_3062;
int l9_3068=pigmentTexLayout_tmp;
int l9_3069=l9_3067;
float2 l9_3070=l9_3060;
bool l9_3071=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_3072=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_3073=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_3074=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_3075=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_3076=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_3077=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_3078=0.0;
bool l9_3079=l9_3076&&(!l9_3074);
float l9_3080=1.0;
float l9_3081=l9_3070.x;
int l9_3082=l9_3073.x;
if (l9_3082==1)
{
l9_3081=fract(l9_3081);
}
else
{
if (l9_3082==2)
{
float l9_3083=fract(l9_3081);
float l9_3084=l9_3081-l9_3083;
float l9_3085=step(0.25,fract(l9_3084*0.5));
l9_3081=mix(l9_3083,1.0-l9_3083,fast::clamp(l9_3085,0.0,1.0));
}
}
l9_3070.x=l9_3081;
float l9_3086=l9_3070.y;
int l9_3087=l9_3073.y;
if (l9_3087==1)
{
l9_3086=fract(l9_3086);
}
else
{
if (l9_3087==2)
{
float l9_3088=fract(l9_3086);
float l9_3089=l9_3086-l9_3088;
float l9_3090=step(0.25,fract(l9_3089*0.5));
l9_3086=mix(l9_3088,1.0-l9_3088,fast::clamp(l9_3090,0.0,1.0));
}
}
l9_3070.y=l9_3086;
if (l9_3074)
{
bool l9_3091=l9_3076;
bool l9_3092;
if (l9_3091)
{
l9_3092=l9_3073.x==3;
}
else
{
l9_3092=l9_3091;
}
float l9_3093=l9_3070.x;
float l9_3094=l9_3075.x;
float l9_3095=l9_3075.z;
bool l9_3096=l9_3092;
float l9_3097=l9_3080;
float l9_3098=fast::clamp(l9_3093,l9_3094,l9_3095);
float l9_3099=step(abs(l9_3093-l9_3098),9.9999997e-06);
l9_3097*=(l9_3099+((1.0-float(l9_3096))*(1.0-l9_3099)));
l9_3093=l9_3098;
l9_3070.x=l9_3093;
l9_3080=l9_3097;
bool l9_3100=l9_3076;
bool l9_3101;
if (l9_3100)
{
l9_3101=l9_3073.y==3;
}
else
{
l9_3101=l9_3100;
}
float l9_3102=l9_3070.y;
float l9_3103=l9_3075.y;
float l9_3104=l9_3075.w;
bool l9_3105=l9_3101;
float l9_3106=l9_3080;
float l9_3107=fast::clamp(l9_3102,l9_3103,l9_3104);
float l9_3108=step(abs(l9_3102-l9_3107),9.9999997e-06);
l9_3106*=(l9_3108+((1.0-float(l9_3105))*(1.0-l9_3108)));
l9_3102=l9_3107;
l9_3070.y=l9_3102;
l9_3080=l9_3106;
}
float2 l9_3109=l9_3070;
bool l9_3110=l9_3071;
float3x3 l9_3111=l9_3072;
if (l9_3110)
{
l9_3109=float2((l9_3111*float3(l9_3109,1.0)).xy);
}
float2 l9_3112=l9_3109;
l9_3070=l9_3112;
float l9_3113=l9_3070.x;
int l9_3114=l9_3073.x;
bool l9_3115=l9_3079;
float l9_3116=l9_3080;
if ((l9_3114==0)||(l9_3114==3))
{
float l9_3117=l9_3113;
float l9_3118=0.0;
float l9_3119=1.0;
bool l9_3120=l9_3115;
float l9_3121=l9_3116;
float l9_3122=fast::clamp(l9_3117,l9_3118,l9_3119);
float l9_3123=step(abs(l9_3117-l9_3122),9.9999997e-06);
l9_3121*=(l9_3123+((1.0-float(l9_3120))*(1.0-l9_3123)));
l9_3117=l9_3122;
l9_3113=l9_3117;
l9_3116=l9_3121;
}
l9_3070.x=l9_3113;
l9_3080=l9_3116;
float l9_3124=l9_3070.y;
int l9_3125=l9_3073.y;
bool l9_3126=l9_3079;
float l9_3127=l9_3080;
if ((l9_3125==0)||(l9_3125==3))
{
float l9_3128=l9_3124;
float l9_3129=0.0;
float l9_3130=1.0;
bool l9_3131=l9_3126;
float l9_3132=l9_3127;
float l9_3133=fast::clamp(l9_3128,l9_3129,l9_3130);
float l9_3134=step(abs(l9_3128-l9_3133),9.9999997e-06);
l9_3132*=(l9_3134+((1.0-float(l9_3131))*(1.0-l9_3134)));
l9_3128=l9_3133;
l9_3124=l9_3128;
l9_3127=l9_3132;
}
l9_3070.y=l9_3124;
l9_3080=l9_3127;
float2 l9_3135=l9_3070;
int l9_3136=l9_3068;
int l9_3137=l9_3069;
float l9_3138=l9_3078;
float2 l9_3139=l9_3135;
int l9_3140=l9_3136;
int l9_3141=l9_3137;
float3 l9_3142=float3(0.0);
if (l9_3140==0)
{
l9_3142=float3(l9_3139,0.0);
}
else
{
if (l9_3140==1)
{
l9_3142=float3(l9_3139.x,(l9_3139.y*0.5)+(0.5-(float(l9_3141)*0.5)),0.0);
}
else
{
l9_3142=float3(l9_3139,float(l9_3141));
}
}
float3 l9_3143=l9_3142;
float3 l9_3144=l9_3143;
float4 l9_3145=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_3144.xy,bias(l9_3138));
float4 l9_3146=l9_3145;
if (l9_3076)
{
l9_3146=mix(l9_3077,l9_3146,float4(l9_3080));
}
float4 l9_3147=l9_3146;
l9_3061=l9_3147;
float4 l9_3148=l9_3061;
float3 l9_3149=l9_3148.xyz;
float3 l9_3150=l9_3149;
int l9_3151=l9_2953;
float l9_3152=(float(l9_3151)+0.5)/N0_texWidth;
float2 l9_3153=float2(l9_3152,0.5);
float4 l9_3154=float4(0.0);
int l9_3155;
if ((int(pigmentTexHasSwappedViews_tmp)!=0))
{
int l9_3156=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3156=0;
}
else
{
l9_3156=in.varStereoViewID;
}
int l9_3157=l9_3156;
l9_3155=1-l9_3157;
}
else
{
int l9_3158=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3158=0;
}
else
{
l9_3158=in.varStereoViewID;
}
int l9_3159=l9_3158;
l9_3155=l9_3159;
}
int l9_3160=l9_3155;
int l9_3161=pigmentTexLayout_tmp;
int l9_3162=l9_3160;
float2 l9_3163=l9_3153;
bool l9_3164=(int(SC_USE_UV_TRANSFORM_pigmentTex_tmp)!=0);
float3x3 l9_3165=(*sc_set0.UserUniforms).pigmentTexTransform;
int2 l9_3166=int2(SC_SOFTWARE_WRAP_MODE_U_pigmentTex_tmp,SC_SOFTWARE_WRAP_MODE_V_pigmentTex_tmp);
bool l9_3167=(int(SC_USE_UV_MIN_MAX_pigmentTex_tmp)!=0);
float4 l9_3168=(*sc_set0.UserUniforms).pigmentTexUvMinMax;
bool l9_3169=(int(SC_USE_CLAMP_TO_BORDER_pigmentTex_tmp)!=0);
float4 l9_3170=(*sc_set0.UserUniforms).pigmentTexBorderColor;
float l9_3171=0.0;
bool l9_3172=l9_3169&&(!l9_3167);
float l9_3173=1.0;
float l9_3174=l9_3163.x;
int l9_3175=l9_3166.x;
if (l9_3175==1)
{
l9_3174=fract(l9_3174);
}
else
{
if (l9_3175==2)
{
float l9_3176=fract(l9_3174);
float l9_3177=l9_3174-l9_3176;
float l9_3178=step(0.25,fract(l9_3177*0.5));
l9_3174=mix(l9_3176,1.0-l9_3176,fast::clamp(l9_3178,0.0,1.0));
}
}
l9_3163.x=l9_3174;
float l9_3179=l9_3163.y;
int l9_3180=l9_3166.y;
if (l9_3180==1)
{
l9_3179=fract(l9_3179);
}
else
{
if (l9_3180==2)
{
float l9_3181=fract(l9_3179);
float l9_3182=l9_3179-l9_3181;
float l9_3183=step(0.25,fract(l9_3182*0.5));
l9_3179=mix(l9_3181,1.0-l9_3181,fast::clamp(l9_3183,0.0,1.0));
}
}
l9_3163.y=l9_3179;
if (l9_3167)
{
bool l9_3184=l9_3169;
bool l9_3185;
if (l9_3184)
{
l9_3185=l9_3166.x==3;
}
else
{
l9_3185=l9_3184;
}
float l9_3186=l9_3163.x;
float l9_3187=l9_3168.x;
float l9_3188=l9_3168.z;
bool l9_3189=l9_3185;
float l9_3190=l9_3173;
float l9_3191=fast::clamp(l9_3186,l9_3187,l9_3188);
float l9_3192=step(abs(l9_3186-l9_3191),9.9999997e-06);
l9_3190*=(l9_3192+((1.0-float(l9_3189))*(1.0-l9_3192)));
l9_3186=l9_3191;
l9_3163.x=l9_3186;
l9_3173=l9_3190;
bool l9_3193=l9_3169;
bool l9_3194;
if (l9_3193)
{
l9_3194=l9_3166.y==3;
}
else
{
l9_3194=l9_3193;
}
float l9_3195=l9_3163.y;
float l9_3196=l9_3168.y;
float l9_3197=l9_3168.w;
bool l9_3198=l9_3194;
float l9_3199=l9_3173;
float l9_3200=fast::clamp(l9_3195,l9_3196,l9_3197);
float l9_3201=step(abs(l9_3195-l9_3200),9.9999997e-06);
l9_3199*=(l9_3201+((1.0-float(l9_3198))*(1.0-l9_3201)));
l9_3195=l9_3200;
l9_3163.y=l9_3195;
l9_3173=l9_3199;
}
float2 l9_3202=l9_3163;
bool l9_3203=l9_3164;
float3x3 l9_3204=l9_3165;
if (l9_3203)
{
l9_3202=float2((l9_3204*float3(l9_3202,1.0)).xy);
}
float2 l9_3205=l9_3202;
l9_3163=l9_3205;
float l9_3206=l9_3163.x;
int l9_3207=l9_3166.x;
bool l9_3208=l9_3172;
float l9_3209=l9_3173;
if ((l9_3207==0)||(l9_3207==3))
{
float l9_3210=l9_3206;
float l9_3211=0.0;
float l9_3212=1.0;
bool l9_3213=l9_3208;
float l9_3214=l9_3209;
float l9_3215=fast::clamp(l9_3210,l9_3211,l9_3212);
float l9_3216=step(abs(l9_3210-l9_3215),9.9999997e-06);
l9_3214*=(l9_3216+((1.0-float(l9_3213))*(1.0-l9_3216)));
l9_3210=l9_3215;
l9_3206=l9_3210;
l9_3209=l9_3214;
}
l9_3163.x=l9_3206;
l9_3173=l9_3209;
float l9_3217=l9_3163.y;
int l9_3218=l9_3166.y;
bool l9_3219=l9_3172;
float l9_3220=l9_3173;
if ((l9_3218==0)||(l9_3218==3))
{
float l9_3221=l9_3217;
float l9_3222=0.0;
float l9_3223=1.0;
bool l9_3224=l9_3219;
float l9_3225=l9_3220;
float l9_3226=fast::clamp(l9_3221,l9_3222,l9_3223);
float l9_3227=step(abs(l9_3221-l9_3226),9.9999997e-06);
l9_3225*=(l9_3227+((1.0-float(l9_3224))*(1.0-l9_3227)));
l9_3221=l9_3226;
l9_3217=l9_3221;
l9_3220=l9_3225;
}
l9_3163.y=l9_3217;
l9_3173=l9_3220;
float2 l9_3228=l9_3163;
int l9_3229=l9_3161;
int l9_3230=l9_3162;
float l9_3231=l9_3171;
float2 l9_3232=l9_3228;
int l9_3233=l9_3229;
int l9_3234=l9_3230;
float3 l9_3235=float3(0.0);
if (l9_3233==0)
{
l9_3235=float3(l9_3232,0.0);
}
else
{
if (l9_3233==1)
{
l9_3235=float3(l9_3232.x,(l9_3232.y*0.5)+(0.5-(float(l9_3234)*0.5)),0.0);
}
else
{
l9_3235=float3(l9_3232,float(l9_3234));
}
}
float3 l9_3236=l9_3235;
float3 l9_3237=l9_3236;
float4 l9_3238=sc_set0.pigmentTex.sample(sc_set0.pigmentTexSmpSC,l9_3237.xy,bias(l9_3231));
float4 l9_3239=l9_3238;
if (l9_3169)
{
l9_3239=mix(l9_3170,l9_3239,float4(l9_3173));
}
float4 l9_3240=l9_3239;
l9_3154=l9_3240;
float4 l9_3241=l9_3154;
float3 l9_3242=l9_3241.xyz;
float3 l9_3243=l9_3242;
float3 l9_3244=l9_3057;
float3 l9_3245=l9_3150;
float3 l9_3246=l9_3243;
float l9_3247=l9_2962;
float l9_3248=l9_2963;
float l9_3249=l9_2964;
float l9_3250=(l9_3247+l9_3248)+l9_3249;
float l9_3251=l9_3247/fast::max(l9_3250,0.001);
float l9_3252=l9_3248/fast::max(l9_3250,0.001);
float l9_3253=l9_3249/fast::max(l9_3250,0.001);
float3 l9_3254=float3(0.0);
float l9_3255=l9_3244.x;
float l9_3256=1.0-l9_3255;
float l9_3257=2.0;
float l9_3258;
if (l9_3256<=0.0)
{
l9_3258=0.0;
}
else
{
l9_3258=pow(l9_3256,l9_3257);
}
float l9_3259=l9_3258;
float l9_3260=l9_3259/(2.0*fast::max(l9_3255,9.9999997e-05));
float l9_3261=l9_3260;
float l9_3262=l9_3251;
float l9_3263=l9_3245.x;
float l9_3264=1.0-l9_3263;
float l9_3265=2.0;
float l9_3266;
if (l9_3264<=0.0)
{
l9_3266=0.0;
}
else
{
l9_3266=pow(l9_3264,l9_3265);
}
float l9_3267=l9_3266;
float l9_3268=l9_3267/(2.0*fast::max(l9_3263,9.9999997e-05));
float l9_3269=l9_3268;
float l9_3270=l9_3252;
float l9_3271=l9_3246.x;
float l9_3272=1.0-l9_3271;
float l9_3273=2.0;
float l9_3274;
if (l9_3272<=0.0)
{
l9_3274=0.0;
}
else
{
l9_3274=pow(l9_3272,l9_3273);
}
float l9_3275=l9_3274;
float l9_3276=l9_3275/(2.0*fast::max(l9_3271,9.9999997e-05));
float l9_3277=((l9_3261*l9_3262)+(l9_3269*l9_3270))+(l9_3276*l9_3253);
float l9_3278=l9_3277;
float l9_3279=l9_3278;
float l9_3280=(l9_3278*l9_3278)+(2.0*l9_3278);
float l9_3281;
if (l9_3280<=0.0)
{
l9_3281=0.0;
}
else
{
l9_3281=sqrt(l9_3280);
}
float l9_3282=l9_3281;
float l9_3283=(1.0+l9_3279)-l9_3282;
l9_3254.x=l9_3283;
float l9_3284=l9_3244.y;
float l9_3285=1.0-l9_3284;
float l9_3286=2.0;
float l9_3287;
if (l9_3285<=0.0)
{
l9_3287=0.0;
}
else
{
l9_3287=pow(l9_3285,l9_3286);
}
float l9_3288=l9_3287;
float l9_3289=l9_3288/(2.0*fast::max(l9_3284,9.9999997e-05));
float l9_3290=l9_3289;
float l9_3291=l9_3251;
float l9_3292=l9_3245.y;
float l9_3293=1.0-l9_3292;
float l9_3294=2.0;
float l9_3295;
if (l9_3293<=0.0)
{
l9_3295=0.0;
}
else
{
l9_3295=pow(l9_3293,l9_3294);
}
float l9_3296=l9_3295;
float l9_3297=l9_3296/(2.0*fast::max(l9_3292,9.9999997e-05));
float l9_3298=l9_3297;
float l9_3299=l9_3252;
float l9_3300=l9_3246.y;
float l9_3301=1.0-l9_3300;
float l9_3302=2.0;
float l9_3303;
if (l9_3301<=0.0)
{
l9_3303=0.0;
}
else
{
l9_3303=pow(l9_3301,l9_3302);
}
float l9_3304=l9_3303;
float l9_3305=l9_3304/(2.0*fast::max(l9_3300,9.9999997e-05));
l9_3277=((l9_3290*l9_3291)+(l9_3298*l9_3299))+(l9_3305*l9_3253);
float l9_3306=l9_3277;
float l9_3307=l9_3306;
float l9_3308=(l9_3306*l9_3306)+(2.0*l9_3306);
float l9_3309;
if (l9_3308<=0.0)
{
l9_3309=0.0;
}
else
{
l9_3309=sqrt(l9_3308);
}
float l9_3310=l9_3309;
float l9_3311=(1.0+l9_3307)-l9_3310;
l9_3254.y=l9_3311;
float l9_3312=l9_3244.z;
float l9_3313=1.0-l9_3312;
float l9_3314=2.0;
float l9_3315;
if (l9_3313<=0.0)
{
l9_3315=0.0;
}
else
{
l9_3315=pow(l9_3313,l9_3314);
}
float l9_3316=l9_3315;
float l9_3317=l9_3316/(2.0*fast::max(l9_3312,9.9999997e-05));
float l9_3318=l9_3317;
float l9_3319=l9_3251;
float l9_3320=l9_3245.z;
float l9_3321=1.0-l9_3320;
float l9_3322=2.0;
float l9_3323;
if (l9_3321<=0.0)
{
l9_3323=0.0;
}
else
{
l9_3323=pow(l9_3321,l9_3322);
}
float l9_3324=l9_3323;
float l9_3325=l9_3324/(2.0*fast::max(l9_3320,9.9999997e-05));
float l9_3326=l9_3325;
float l9_3327=l9_3252;
float l9_3328=l9_3246.z;
float l9_3329=1.0-l9_3328;
float l9_3330=2.0;
float l9_3331;
if (l9_3329<=0.0)
{
l9_3331=0.0;
}
else
{
l9_3331=pow(l9_3329,l9_3330);
}
float l9_3332=l9_3331;
float l9_3333=l9_3332/(2.0*fast::max(l9_3328,9.9999997e-05));
l9_3277=((l9_3318*l9_3319)+(l9_3326*l9_3327))+(l9_3333*l9_3253);
float l9_3334=l9_3277;
float l9_3335=l9_3334;
float l9_3336=(l9_3334*l9_3334)+(2.0*l9_3334);
float l9_3337;
if (l9_3336<=0.0)
{
l9_3337=0.0;
}
else
{
l9_3337=sqrt(l9_3336);
}
float l9_3338=l9_3337;
float l9_3339=(1.0+l9_3335)-l9_3338;
l9_3254.z=l9_3339;
float3 l9_3340=fast::clamp(l9_3254,float3(0.0),float3(1.0));
l9_2584=l9_3340;
l9_2585=1.0;
l9_2586=float(l9_2951);
l9_2587=float(l9_2952);
l9_2588=float(l9_2953);
}
}
}
float3 l9_3341=l9_2584;
float l9_3342;
if (l9_3341.x>0.040449999)
{
float l9_3343=(l9_3341.x+0.055)/1.0549999;
float l9_3344=2.4000001;
float l9_3345;
if (l9_3343<=0.0)
{
l9_3345=0.0;
}
else
{
l9_3345=pow(l9_3343,l9_3344);
}
float l9_3346=l9_3345;
l9_3342=l9_3346;
}
else
{
l9_3342=l9_3341.x/12.92;
}
float l9_3347=l9_3342;
float l9_3348;
if (l9_3341.y>0.040449999)
{
float l9_3349=(l9_3341.y+0.055)/1.0549999;
float l9_3350=2.4000001;
float l9_3351;
if (l9_3349<=0.0)
{
l9_3351=0.0;
}
else
{
l9_3351=pow(l9_3349,l9_3350);
}
float l9_3352=l9_3351;
l9_3348=l9_3352;
}
else
{
l9_3348=l9_3341.y/12.92;
}
float l9_3353=l9_3348;
float l9_3354;
if (l9_3341.z>0.040449999)
{
float l9_3355=(l9_3341.z+0.055)/1.0549999;
float l9_3356=2.4000001;
float l9_3357;
if (l9_3355<=0.0)
{
l9_3357=0.0;
}
else
{
l9_3357=pow(l9_3355,l9_3356);
}
float l9_3358=l9_3357;
l9_3354=l9_3358;
}
else
{
l9_3354=l9_3341.z/12.92;
}
float l9_3359=l9_3354;
float l9_3360=((l9_3347*0.41245639)+(l9_3353*0.3575761))+(l9_3359*0.18043751);
float l9_3361=((l9_3347*0.2126729)+(l9_3353*0.7151522))+(l9_3359*0.072175004);
float l9_3362=((l9_3347*0.019333901)+(l9_3353*0.119192))+(l9_3359*0.95030409);
l9_3360/=0.95046997;
l9_3361/=1.0;
l9_3362/=1.08883;
float l9_3363=0.20689656;
float l9_3364=(l9_3363*l9_3363)*l9_3363;
float l9_3365=1.0/((3.0*l9_3363)*l9_3363);
float l9_3366=0.13793103;
float l9_3367;
if (l9_3360>l9_3364)
{
float l9_3368=l9_3360;
float l9_3369=0.33333334;
float l9_3370;
if (l9_3368<=0.0)
{
l9_3370=0.0;
}
else
{
l9_3370=pow(l9_3368,l9_3369);
}
float l9_3371=l9_3370;
l9_3367=l9_3371;
}
else
{
l9_3367=(l9_3365*l9_3360)+l9_3366;
}
float l9_3372=l9_3367;
float l9_3373;
if (l9_3361>l9_3364)
{
float l9_3374=l9_3361;
float l9_3375=0.33333334;
float l9_3376;
if (l9_3374<=0.0)
{
l9_3376=0.0;
}
else
{
l9_3376=pow(l9_3374,l9_3375);
}
float l9_3377=l9_3376;
l9_3373=l9_3377;
}
else
{
l9_3373=(l9_3365*l9_3361)+l9_3366;
}
float l9_3378=l9_3373;
float l9_3379;
if (l9_3362>l9_3364)
{
float l9_3380=l9_3362;
float l9_3381=0.33333334;
float l9_3382;
if (l9_3380<=0.0)
{
l9_3382=0.0;
}
else
{
l9_3382=pow(l9_3380,l9_3381);
}
float l9_3383=l9_3382;
l9_3379=l9_3383;
}
else
{
l9_3379=(l9_3365*l9_3362)+l9_3366;
}
float l9_3384=l9_3379;
float l9_3385=(116.0*l9_3378)-16.0;
float l9_3386=500.0*(l9_3372-l9_3378);
float l9_3387=200.0*(l9_3378-l9_3384);
float3 l9_3388=float3(l9_3385,l9_3386,l9_3387);
float3 l9_3389=l9_3388;
float l9_3390=l9_3389.x/100.0;
float l9_3391=fast::clamp(l9_3390,0.0,1.0)*65535.0;
float l9_3392=floor(l9_3391/256.0);
float l9_3393=l9_3391-(l9_3392*256.0);
float2 l9_3394=float2(l9_3392/255.0,l9_3393/255.0);
float2 l9_3395=l9_3394;
float l9_3396=l9_3389.y;
float l9_3397=150.0;
float l9_3398=(l9_3396+l9_3397)/(2.0*l9_3397);
float l9_3399=l9_3398;
float l9_3400=fast::clamp(l9_3399,0.0,1.0)*65535.0;
float l9_3401=floor(l9_3400/256.0);
float l9_3402=l9_3400-(l9_3401*256.0);
float2 l9_3403=float2(l9_3401/255.0,l9_3402/255.0);
float2 l9_3404=l9_3403;
float2 l9_3405=l9_3404;
float l9_3406=l9_3389.z;
float l9_3407=150.0;
float l9_3408=(l9_3406+l9_3407)/(2.0*l9_3407);
float l9_3409=l9_3408;
float l9_3410=fast::clamp(l9_3409,0.0,1.0)*65535.0;
float l9_3411=floor(l9_3410/256.0);
float l9_3412=l9_3410-(l9_3411*256.0);
float2 l9_3413=float2(l9_3411/255.0,l9_3412/255.0);
float2 l9_3414=l9_3413;
float2 l9_3415=l9_3414;
N0_labPosLA=float4(l9_3395.x,l9_3395.y,l9_3405.x,l9_3405.y)*l9_2585;
N0_labPosBV=float4(l9_3415.x,l9_3415.y,l9_2585,0.0);
N0_rgbCol=float4(l9_2584*l9_2585,l9_2585);
N0_mixInfo=float4(l9_2586/15.0,l9_2587/15.0,l9_2588/15.0,l9_2589)*l9_2585;
param_40=N0_mixInfo;
mixInfo_N0=param_40;
FinalColor3=mixInfo_N0;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param_42=FinalColor;
if ((int(sc_RayTracingCasterForceOpaque_tmp)!=0))
{
param_42.w=1.0;
}
float4 l9_3416=fast::max(param_42,float4(0.0));
float4 param_43=l9_3416;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_43.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_43;
return out;
}
float4 param_44=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_3417=param_44;
float4 l9_3418=l9_3417;
float l9_3419=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_3419=l9_3418.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_3419=fast::clamp(l9_3418.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_3419=fast::clamp(dot(l9_3418.xyz,float3(l9_3418.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_3419=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_3419=(1.0-dot(l9_3418.xyz,float3(0.33333001)))*l9_3418.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_3419=(1.0-fast::clamp(dot(l9_3418.xyz,float3(1.0)),0.0,1.0))*l9_3418.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_3419=fast::clamp(dot(l9_3418.xyz,float3(1.0)),0.0,1.0)*l9_3418.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_3419=fast::clamp(dot(l9_3418.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_3419=fast::clamp(dot(l9_3418.xyz,float3(1.0)),0.0,1.0)*l9_3418.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_3419=dot(l9_3418.xyz,float3(0.33333001))*l9_3418.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_3419=1.0-fast::clamp(dot(l9_3418.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_3419=fast::clamp(dot(l9_3418.xyz,float3(1.0)),0.0,1.0);
}
}
}
}
}
}
}
}
}
}
}
}
float l9_3420=l9_3419;
float l9_3421=l9_3420;
float l9_3422=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_3421;
float3 l9_3423=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_3417.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_3424=float4(l9_3423.x,l9_3423.y,l9_3423.z,l9_3422);
param_44=l9_3424;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_44=float4(param_44.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_3425=param_44;
float4 l9_3426=float4(0.0);
float4 l9_3427=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_3428=out.sc_FragData0;
l9_3427=l9_3428;
}
else
{
float4 l9_3429=gl_FragCoord;
float2 l9_3430=l9_3429.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_3431=l9_3430;
float2 l9_3432=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_3433=1;
int l9_3434=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3434=0;
}
else
{
l9_3434=in.varStereoViewID;
}
int l9_3435=l9_3434;
int l9_3436=l9_3435;
float3 l9_3437=float3(l9_3431,0.0);
int l9_3438=l9_3433;
int l9_3439=l9_3436;
if (l9_3438==1)
{
l9_3437.y=((2.0*l9_3437.y)+float(l9_3439))-1.0;
}
float2 l9_3440=l9_3437.xy;
l9_3432=l9_3440;
}
else
{
l9_3432=l9_3431;
}
float2 l9_3441=l9_3432;
float2 l9_3442=l9_3441;
float2 l9_3443=l9_3442;
float2 l9_3444=l9_3443;
float l9_3445=0.0;
int l9_3446;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_3447=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3447=0;
}
else
{
l9_3447=in.varStereoViewID;
}
int l9_3448=l9_3447;
l9_3446=1-l9_3448;
}
else
{
int l9_3449=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3449=0;
}
else
{
l9_3449=in.varStereoViewID;
}
int l9_3450=l9_3449;
l9_3446=l9_3450;
}
int l9_3451=l9_3446;
float2 l9_3452=l9_3444;
int l9_3453=sc_ScreenTextureLayout_tmp;
int l9_3454=l9_3451;
float l9_3455=l9_3445;
float2 l9_3456=l9_3452;
int l9_3457=l9_3453;
int l9_3458=l9_3454;
float3 l9_3459=float3(0.0);
if (l9_3457==0)
{
l9_3459=float3(l9_3456,0.0);
}
else
{
if (l9_3457==1)
{
l9_3459=float3(l9_3456.x,(l9_3456.y*0.5)+(0.5-(float(l9_3458)*0.5)),0.0);
}
else
{
l9_3459=float3(l9_3456,float(l9_3458));
}
}
float3 l9_3460=l9_3459;
float3 l9_3461=l9_3460;
float4 l9_3462=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_3461.xy,bias(l9_3455));
float4 l9_3463=l9_3462;
float4 l9_3464=l9_3463;
l9_3427=l9_3464;
}
float4 l9_3465=l9_3427;
float3 l9_3466=l9_3465.xyz;
float3 l9_3467=l9_3466;
float3 l9_3468=l9_3425.xyz;
float3 l9_3469=definedBlend(l9_3467,l9_3468,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_3426=float4(l9_3469.x,l9_3469.y,l9_3469.z,l9_3426.w);
float3 l9_3470=mix(l9_3466,l9_3426.xyz,float3(l9_3425.w));
l9_3426=float4(l9_3470.x,l9_3470.y,l9_3470.z,l9_3426.w);
l9_3426.w=1.0;
float4 l9_3471=l9_3426;
param_44=l9_3471;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_3472=float4(in.varScreenPos.xyz,1.0);
param_44=l9_3472;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_3473=gl_FragCoord;
float l9_3474=fast::clamp(abs(l9_3473.z),0.0,1.0);
float4 l9_3475=float4(l9_3474,1.0-l9_3474,1.0,1.0);
param_44=l9_3475;
}
else
{
float4 l9_3476=param_44;
float4 l9_3477=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_3477=float4(mix(float3(1.0),l9_3476.xyz,float3(l9_3476.w)),l9_3476.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_3478=l9_3476.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_3478=fast::clamp(l9_3478,0.0,1.0);
}
l9_3477=float4(l9_3476.xyz*l9_3478,l9_3478);
}
else
{
l9_3477=l9_3476;
}
}
float4 l9_3479=l9_3477;
param_44=l9_3479;
}
}
}
}
}
float4 l9_3480=param_44;
FinalColor=l9_3480;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
if (PreviewInfo.Saved)
{
FinalColor=float4(PreviewInfo.Color);
}
else
{
FinalColor=float4(0.0);
}
}
float4 l9_3481=float4(0.0);
l9_3481=float4(0.0);
float4 l9_3482=l9_3481;
float4 Cost=l9_3482;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
FinalColor1=fast::max(FinalColor1,float4(0.0));
FinalColor2=fast::max(FinalColor2,float4(0.0));
FinalColor3=fast::max(FinalColor3,float4(0.0));
FinalColor+=(FinalColor1*1e-06);
FinalColor+=(FinalColor2*1e-06);
FinalColor+=(FinalColor3*1e-06);
float4 param_45=FinalColor1;
out.sc_FragData1=param_45;
float4 param_46=FinalColor2;
out.sc_FragData2=param_46;
float4 param_47=FinalColor3;
out.sc_FragData3=param_47;
float4 param_48=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_48,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_49=FinalColor;
float4 l9_3483=param_49;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_3483.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_3483;
return out;
}
} // FRAGMENT SHADER
