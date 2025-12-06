/// @Header

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

/// @PasteCode

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

/// @Includes

/// @Reflection

//SG_REFLECTION_BEGIN(200)
//INPUT_BEGIN
//INPUT_END
//OUTPUT_BEGIN
//output vec4 sc_FragData0 0
//output vec4 sc_FragData1 1
//output vec4 sc_FragData2 2
//output vec4 sc_FragData3 3
//OUTPUT_END
//SAMPLER_BEGIN
//SAMPLER_END
//TEXTURE_BEGIN
//TEXTURE_END
//IMAGE_BEGIN
//IMAGE_END
//UBO_SSBO_BEGIN
//ubo int UserUniforms 0:35:7408 {
//sc_PointLight_t sc_PointLights 0:[3]:80 DEAD
//bool sc_PointLights.falloffEnabled 0
//float sc_PointLights.falloffEndDistance 4
//float sc_PointLights.negRcpFalloffEndDistance4 8
//float sc_PointLights.angleScale 12
//float sc_PointLights.angleOffset 16
//float3 sc_PointLights.direction 32
//float3 sc_PointLights.position 48
//float4 sc_PointLights.color 64
//sc_DirectionalLight_t sc_DirectionalLights 240:[5]:32 DEAD
//float3 sc_DirectionalLights.direction 0
//float4 sc_DirectionalLights.color 16
//sc_AmbientLight_t sc_AmbientLights 400:[3]:32 DEAD
//float3 sc_AmbientLights.color 0
//float sc_AmbientLights.intensity 16
//sc_LightEstimationData_t sc_LightEstimationData 496 DEAD
//sc_SphericalGaussianLight_t sc_LightEstimationData.sg 0:[12]:48
//float3 sc_LightEstimationData.sg.color 0
//float sc_LightEstimationData.sg.sharpness 16
//float3 sc_LightEstimationData.sg.axis 32
//float3 sc_LightEstimationData.ambientLight 576
//float4 sc_EnvmapDiffuseSize 1088 DEAD
//float4 sc_EnvmapDiffuseDims 1104 DEAD
//float4 sc_EnvmapDiffuseView 1120 DEAD
//float4 sc_EnvmapSpecularSize 1136 DEAD
//float4 sc_EnvmapSpecularDims 1152 DEAD
//float4 sc_EnvmapSpecularView 1168 DEAD
//float3 sc_EnvmapRotation 1184 DEAD
//float sc_EnvmapExposure 1200 DEAD
//float3 sc_Sh 1216:[9]:16 DEAD
//float sc_ShIntensity 1360 DEAD
//float4 sc_Time 1376 DEAD
//float4 sc_UniformConstants 1392 LIVE
//float4 sc_GeometryInfo 1408 DEAD
//float4x4 sc_ModelViewProjectionMatrixArray 1424:[2]:64 DEAD
//float4x4 sc_ModelViewProjectionMatrixInverseArray 1552:[2]:64 DEAD
//float4x4 sc_ViewProjectionMatrixArray 1680:[2]:64 DEAD
//float4x4 sc_ViewProjectionMatrixInverseArray 1808:[2]:64 DEAD
//float4x4 sc_ModelViewMatrixArray 1936:[2]:64 DEAD
//float4x4 sc_ModelViewMatrixInverseArray 2064:[2]:64 DEAD
//float3x3 sc_ViewNormalMatrixArray 2192:[2]:48 DEAD
//float3x3 sc_ViewNormalMatrixInverseArray 2288:[2]:48 DEAD
//float4x4 sc_ProjectionMatrixArray 2384:[2]:64 DEAD
//float4x4 sc_ProjectionMatrixInverseArray 2512:[2]:64 DEAD
//float4x4 sc_ViewMatrixArray 2640:[2]:64 DEAD
//float4x4 sc_ViewMatrixInverseArray 2768:[2]:64 DEAD
//float4x4 sc_PrevFrameViewProjectionMatrixArray 2896:[2]:64 DEAD
//float4x4 sc_ModelMatrix 3024 DEAD
//float4x4 sc_ModelMatrixInverse 3088 DEAD
//float3x3 sc_NormalMatrix 3152 DEAD
//float3x3 sc_NormalMatrixInverse 3200 DEAD
//float4x4 sc_PrevFrameModelMatrix 3248 DEAD
//float4x4 sc_PrevFrameModelMatrixInverse 3312 DEAD
//float3 sc_LocalAabbMin 3376 DEAD
//float3 sc_LocalAabbMax 3392 DEAD
//float3 sc_WorldAabbMin 3408 DEAD
//float3 sc_WorldAabbMax 3424 DEAD
//float4 sc_WindowToViewportTransform 3440 DEAD
//float4 sc_CurrentRenderTargetDims 3456 DEAD
//sc_Camera_t sc_Camera 3472 DEAD
//float3 sc_Camera.position 0
//float sc_Camera.aspect 16
//float2 sc_Camera.clipPlanes 24
//float sc_ShadowDensity 3504 DEAD
//float4 sc_ShadowColor 3520 DEAD
//float4x4 sc_ProjectorMatrix 3536 DEAD
//float shaderComplexityValue 3600 DEAD
//float4 weights0 3616 DEAD
//float4 weights1 3632 DEAD
//float4 weights2 3648 DEAD
//float4 sc_StereoClipPlanes 3664:[2]:16 DEAD
//int sc_FallbackInstanceID 3696 DEAD
//float2 sc_TAAJitterOffset 3704 DEAD
//float strandWidth 3712 DEAD
//float strandTaper 3716 DEAD
//float4 sc_StrandDataMapTextureSize 3728 DEAD
//float clumpInstanceCount 3744 DEAD
//float clumpRadius 3748 DEAD
//float clumpTipScale 3752 DEAD
//float hairstyleInstanceCount 3756 DEAD
//float hairstyleNoise 3760 DEAD
//float4 sc_ScreenTextureSize 3776 DEAD
//float4 sc_ScreenTextureDims 3792 DEAD
//float4 sc_ScreenTextureView 3808 DEAD
//float4 voxelization_params_0 3824 DEAD
//float4 voxelization_params_frustum_lrbt 3840 DEAD
//float4 voxelization_params_frustum_nf 3856 DEAD
//float3 voxelization_params_camera_pos 3872 DEAD
//float4x4 sc_ModelMatrixVoxelization 3888 DEAD
//float correctedIntensity 3952 DEAD
//float4 intensityTextureSize 3968 DEAD
//float4 intensityTextureDims 3984 DEAD
//float4 intensityTextureView 4000 DEAD
//float3x3 intensityTextureTransform 4016 DEAD
//float4 intensityTextureUvMinMax 4064 DEAD
//float4 intensityTextureBorderColor 4080 DEAD
//float reflBlurWidth 4096 DEAD
//float reflBlurMinRough 4100 DEAD
//float reflBlurMaxRough 4104 DEAD
//int overrideTimeEnabled 4108 DEAD
//float overrideTimeElapsed 4112:[32]:4 DEAD
//float overrideTimeDelta 4240 DEAD
//int vfxNumCopies 4244 DEAD
//bool vfxBatchEnable 4248:[32]:4 DEAD
//bool vfxEmitParticle 4376:[32]:4 DEAD
//float4x4 vfxModelMatrix 4512:[32]:64 DEAD
//float4 renderTarget0Size 6560 DEAD
//float4 renderTarget0Dims 6576 DEAD
//float4 renderTarget0View 6592 DEAD
//float4 renderTarget1Size 6608 DEAD
//float4 renderTarget1Dims 6624 DEAD
//float4 renderTarget1View 6640 DEAD
//float4 renderTarget2Size 6656 DEAD
//float4 renderTarget2Dims 6672 DEAD
//float4 renderTarget2View 6688 DEAD
//float4 renderTarget3Size 6704 DEAD
//float4 renderTarget3Dims 6720 DEAD
//float4 renderTarget3View 6736 DEAD
//float4 sortRenderTarget0Size 6752 DEAD
//float4 sortRenderTarget0Dims 6768 DEAD
//float4 sortRenderTarget0View 6784 DEAD
//float4 sortRenderTarget1Size 6800 DEAD
//float4 sortRenderTarget1Dims 6816 DEAD
//float4 sortRenderTarget1View 6832 DEAD
//float3 vfxLocalAabbMin 6848 DEAD
//float3 vfxLocalAabbMax 6864 DEAD
//float vfxCameraAspect 6880 DEAD
//float vfxCameraNear 6884 DEAD
//float vfxCameraFar 6888 DEAD
//float4x4 vfxProjectionMatrix 6896 DEAD
//float4x4 vfxProjectionMatrixInverse 6960 DEAD
//float4x4 vfxViewMatrix 7024 DEAD
//float4x4 vfxViewMatrixInverse 7088 DEAD
//float4x4 vfxViewProjectionMatrix 7152 DEAD
//float4x4 vfxViewProjectionMatrixInverse 7216 DEAD
//float3 vfxCameraPosition 7280 DEAD
//float3 vfxCameraUp 7296 DEAD
//float3 vfxCameraForward 7312 DEAD
//float3 vfxCameraRight 7328 DEAD
//int vfxFrame 7344 DEAD
//int vfxOffsetInstancesRead 7348 DEAD
//int vfxOffsetInstancesWrite 7352 DEAD
//float2 vfxTargetSizeRead 7360 DEAD
//float2 vfxTargetSizeWrite 7368 DEAD
//int vfxTargetWidth 7376 DEAD
//float2 ssSORT_RENDER_TARGET_SIZE 7384 DEAD
//float Port_Value_N005 7392 DEAD
//float Port_rgbRes_N002 7396 DEAD
//}
//UBO_SSBO_END
//SG_REFLECTION_END

/// @FunctionConstants
/// @FuncConst int sc_StereoRenderingMode_tmp 0
/// @FuncConst int sc_StereoRendering_IsClipDistanceEnabled_tmp 0
/// @FuncConst int sc_ShaderCacheConstant_tmp 0
/// @Resources

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
float Port_Value_N005;
float Port_rgbRes_N002;
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
constant userUniformsObj* UserUniforms [[id(35)]];
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

/// @Functions
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
int l9_0=int(floor(param.x*3.0));
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
float l9_128=16.0;
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
float l9_146=16.0;
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
float2 l9_177=l9_176.xy;
float2 l9_178=l9_177;
float2 l9_179=l9_178;
l9_1=float4(l9_179.x,l9_179.y,l9_1.z,l9_1.w);
l9_2=l9_1.x;
l9_3=l9_1.y;
float l9_180=gParticle.Quaternion.x;
float l9_181=-1.0;
float l9_182=1.0;
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
float2 l9_195=l9_194.xy;
float2 l9_196=l9_195;
float2 l9_197=l9_196;
l9_1=float4(l9_197.x,l9_197.y,l9_1.z,l9_1.w);
l9_4=l9_1.x;
l9_5=l9_1.y;
float l9_198=gParticle.Quaternion.y;
float l9_199=-1.0;
float l9_200=1.0;
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
float2 l9_213=l9_212.xy;
float2 l9_214=l9_213;
float2 l9_215=l9_214;
l9_1=float4(l9_215.x,l9_215.y,l9_1.z,l9_1.w);
l9_6=l9_1.x;
l9_7=l9_1.y;
float l9_216=gParticle.Quaternion.z;
float l9_217=-1.0;
float l9_218=1.0;
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
float2 l9_231=l9_230.xy;
float2 l9_232=l9_231;
float2 l9_233=l9_232;
l9_1=float4(l9_233.x,l9_233.y,l9_1.z,l9_1.w);
l9_8=l9_1.x;
l9_9=l9_1.y;
float l9_234=gParticle.Quaternion.w;
float l9_235=-1.0;
float l9_236=1.0;
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
float2 l9_249=l9_248.xy;
float2 l9_250=l9_249;
float2 l9_251=l9_250;
l9_1=float4(l9_251.x,l9_251.y,l9_1.z,l9_1.w);
l9_10=l9_1.x;
l9_11=l9_1.y;
float l9_252=gParticle.Color.x;
float l9_253=0.0;
float l9_254=1.00001;
float l9_255=fast::clamp(l9_252,l9_253,l9_254);
float l9_256=l9_253;
float l9_257=l9_254;
float l9_258=0.0;
float l9_259=1.0;
float l9_260=l9_258+(((l9_255-l9_256)*(l9_259-l9_258))/(l9_257-l9_256));
float l9_261=l9_260;
l9_1.x=l9_261;
l9_12=l9_1.x;
float l9_262=gParticle.Color.y;
float l9_263=0.0;
float l9_264=1.00001;
float l9_265=fast::clamp(l9_262,l9_263,l9_264);
float l9_266=l9_263;
float l9_267=l9_264;
float l9_268=0.0;
float l9_269=1.0;
float l9_270=l9_268+(((l9_265-l9_266)*(l9_269-l9_268))/(l9_267-l9_266));
float l9_271=l9_270;
l9_1.x=l9_271;
l9_13=l9_1.x;
float l9_272=gParticle.Color.z;
float l9_273=0.0;
float l9_274=1.00001;
float l9_275=fast::clamp(l9_272,l9_273,l9_274);
float l9_276=l9_273;
float l9_277=l9_274;
float l9_278=0.0;
float l9_279=1.0;
float l9_280=l9_278+(((l9_275-l9_276)*(l9_279-l9_278))/(l9_277-l9_276));
float l9_281=l9_280;
l9_1.x=l9_281;
l9_14=l9_1.x;
float l9_282=gParticle.Color.w;
float l9_283=0.0;
float l9_284=1.00001;
float l9_285=fast::clamp(l9_282,l9_283,l9_284);
float l9_286=l9_283;
float l9_287=l9_284;
float l9_288=0.0;
float l9_289=1.0;
float l9_290=l9_288+(((l9_285-l9_286)*(l9_289-l9_288))/(l9_287-l9_286));
float l9_291=l9_290;
l9_1.x=l9_291;
l9_15=l9_1.x;
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

