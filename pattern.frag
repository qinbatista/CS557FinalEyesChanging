#version 120

uniform float uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float uShininess;		// specular exponent
uniform float uS0, uT0, uD;		// square pattern
uniform float diam, Ar, Br, uTol;		// diam
varying vec2 vST;			// texture coords
varying vec3 vN;			// normal vector
varying vec3 vL;			// vector from point to light
varying vec3 vE;			// vector from point to eye
uniform sampler3D Noise3;
uniform float uNoiseFreq, uNoiseMag;
varying vec3 vMCposition;
uniform float uAlpha;			// vector from point to eye
uniform float EyeFrequency;			// vector from point to eye
void main() {

    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

    vec3 SpecularColor = vec3(1., 1., 1.);
    vec3 EyeColor = vec3(0.63921, 0.5607, 0.7254);
    vec3 CenterColor = vec3(0.3476, 0.25, 0.5859);
    vec3 EyeBlack = vec3(0, 0, 0);

    vec4 nv = texture3D(Noise3, uNoiseFreq * vMCposition);
    float n = nv.r + nv.g + nv.b + nv.a; //rangeis1.->3.
	// n = (n - 1.) / 2.; // range is now 0. -> 1.
    n = n - 2.; // range is now -1. -> 1.
    n *= uNoiseMag;

    //circular pattern
    float sc = 0;
    float X = 0;
    float tc = 0;
    float Y = 0;
    int numins = int(vST.s / diam);
    int numint = int(vST.t / diam);
	// float R = diam / 2;
	// int value = numint / 2;
	// int remain = numint - value * 2;
	// if(remain == 1) {
    if(0.97 > sin(EyeFrequency * vST.t * 3.14)&&vST.t>0.88*EyeFrequency/16.5f) {
        EyeColor = CenterColor;
    }
    else
    {
        EyeColor = EyeColor;
    }
    if(vST.t > 0.97) {
        EyeColor = EyeBlack;
    } else {
        EyeColor = EyeColor;
    }

    if(0.97 < sin(EyeFrequency * vST.t * 3.14)) {
        EyeColor = EyeBlack;
    } else {
        EyeColor = EyeColor;
    }
			// numins = numins - 1;
		// }
	// 	sc = numins * diam + R + R;
	// 	tc = numint * diam + R;
	// 	X = (vST.s - sc);
	// 	Y = (vST.t - tc);
	// } else {
	// 	sc = numins * diam + R;
	// 	tc = numint * diam + R;
	// 	X = (vST.s - sc);
	// 	Y = (vST.t - tc);
	// }
	// float Dist = sqrt(X / Ar * X / Ar + Y / Br * Y / Br);
	// float OffsetDist = Dist + n;
	// float scale = OffsetDist / Dist;
	// Dist = Dist * scale;
	// if(Dist <= (R + uTol)) {
		// if(Dist >= (R - uTol)) {
			// float t = smoothstep((R - uTol), (R + uTol), Dist);

		// } else {
			// myColor = myPatternColor;
		// }
	// }

    vec3 ambient = uKa * EyeColor;

    float d = max(dot(Normal, Light), 0.);       // only do diffuse if the light can see the point
    vec3 diffuse = uKd * d * EyeColor;

    float s = 0.;
    if(dot(Normal, Light) > 0.)	          // only do specular if the light can see the point
    {
        vec3 ref = normalize(reflect(-Light, Normal));
        s = pow(max(dot(Eye, ref), 0.), uShininess);
    }
    vec3 specular = uKs * s * SpecularColor.rgb;
    // if(Dist <= (R + uTol)) {
    //     gl_FragColor = vec4(ambient + diffuse + specular, 1);
    // } else {
    gl_FragColor = vec4(ambient + diffuse + specular, 1);
    // }
}
