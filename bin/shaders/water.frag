
uniform float sunX;
uniform float sunY;
uniform float sunZ;

uniform int time;

varying vec4 vertex;
varying vec4 color;
varying vec3 normal;

varying vec3 eyeDir;

vec3 permute(vec3 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

// Cellular noise, returning F1 and F2 in a vec2.
// 3x3x3 search region for good F2 everywhere, but a lot
// slower than the 2x2x2 version.
// The code below is a bit scary even to its author,
// but it has at least half decent performance on a
// modern GPU. In any case, it beats any software
// implementation of Worley noise hands down.

vec2 cellular(vec3 P) {
#define K 0.142857142857 // 1/7
#define Ko 0.428571428571 // 1/2-K/2
#define K2 0.020408163265306 // 1/(7*7)
#define Kz 0.166666666667 // 1/6
#define Kzo 0.416666666667 // 1/2-1/6*2
#define jitter 1.0 // smaller jitter gives more regular pattern

	vec3 Pi = mod(floor(P), 289.0);
 	vec3 Pf = fract(P) - 0.5;

	vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);
	vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);
	vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);

	vec3 p = permute(Pi.x + vec3(-1.0, 0.0, 1.0));
	vec3 p1 = permute(p + Pi.y - 1.0);
	vec3 p2 = permute(p + Pi.y);
	vec3 p3 = permute(p + Pi.y + 1.0);

	vec3 p11 = permute(p1 + Pi.z - 1.0);
	vec3 p12 = permute(p1 + Pi.z);
	vec3 p13 = permute(p1 + Pi.z + 1.0);

	vec3 p21 = permute(p2 + Pi.z - 1.0);
	vec3 p22 = permute(p2 + Pi.z);
	vec3 p23 = permute(p2 + Pi.z + 1.0);

	vec3 p31 = permute(p3 + Pi.z - 1.0);
	vec3 p32 = permute(p3 + Pi.z);
	vec3 p33 = permute(p3 + Pi.z + 1.0);

	vec3 ox11 = fract(p11*K) - Ko;
	vec3 oy11 = mod(floor(p11*K), 7.0)*K - Ko;
	vec3 oz11 = floor(p11*K2)*Kz - Kzo; // p11 < 289 guaranteed

	vec3 ox12 = fract(p12*K) - Ko;
	vec3 oy12 = mod(floor(p12*K), 7.0)*K - Ko;
	vec3 oz12 = floor(p12*K2)*Kz - Kzo;

	vec3 ox13 = fract(p13*K) - Ko;
	vec3 oy13 = mod(floor(p13*K), 7.0)*K - Ko;
	vec3 oz13 = floor(p13*K2)*Kz - Kzo;

	vec3 ox21 = fract(p21*K) - Ko;
	vec3 oy21 = mod(floor(p21*K), 7.0)*K - Ko;
	vec3 oz21 = floor(p21*K2)*Kz - Kzo;

	vec3 ox22 = fract(p22*K) - Ko;
	vec3 oy22 = mod(floor(p22*K), 7.0)*K - Ko;
	vec3 oz22 = floor(p22*K2)*Kz - Kzo;

	vec3 ox23 = fract(p23*K) - Ko;
	vec3 oy23 = mod(floor(p23*K), 7.0)*K - Ko;
	vec3 oz23 = floor(p23*K2)*Kz - Kzo;

	vec3 ox31 = fract(p31*K) - Ko;
	vec3 oy31 = mod(floor(p31*K), 7.0)*K - Ko;
	vec3 oz31 = floor(p31*K2)*Kz - Kzo;

	vec3 ox32 = fract(p32*K) - Ko;
	vec3 oy32 = mod(floor(p32*K), 7.0)*K - Ko;
	vec3 oz32 = floor(p32*K2)*Kz - Kzo;

	vec3 ox33 = fract(p33*K) - Ko;
	vec3 oy33 = mod(floor(p33*K), 7.0)*K - Ko;
	vec3 oz33 = floor(p33*K2)*Kz - Kzo;

	vec3 dx11 = Pfx + jitter*ox11;
	vec3 dy11 = Pfy.x + jitter*oy11;
	vec3 dz11 = Pfz.x + jitter*oz11;

	vec3 dx12 = Pfx + jitter*ox12;
	vec3 dy12 = Pfy.x + jitter*oy12;
	vec3 dz12 = Pfz.y + jitter*oz12;

	vec3 dx13 = Pfx + jitter*ox13;
	vec3 dy13 = Pfy.x + jitter*oy13;
	vec3 dz13 = Pfz.z + jitter*oz13;

	vec3 dx21 = Pfx + jitter*ox21;
	vec3 dy21 = Pfy.y + jitter*oy21;
	vec3 dz21 = Pfz.x + jitter*oz21;

	vec3 dx22 = Pfx + jitter*ox22;
	vec3 dy22 = Pfy.y + jitter*oy22;
	vec3 dz22 = Pfz.y + jitter*oz22;

	vec3 dx23 = Pfx + jitter*ox23;
	vec3 dy23 = Pfy.y + jitter*oy23;
	vec3 dz23 = Pfz.z + jitter*oz23;

	vec3 dx31 = Pfx + jitter*ox31;
	vec3 dy31 = Pfy.z + jitter*oy31;
	vec3 dz31 = Pfz.x + jitter*oz31;

	vec3 dx32 = Pfx + jitter*ox32;
	vec3 dy32 = Pfy.z + jitter*oy32;
	vec3 dz32 = Pfz.y + jitter*oz32;

	vec3 dx33 = Pfx + jitter*ox33;
	vec3 dy33 = Pfy.z + jitter*oy33;
	vec3 dz33 = Pfz.z + jitter*oz33;

	vec3 d11 = dx11 * dx11 + dy11 * dy11 + dz11 * dz11;
	vec3 d12 = dx12 * dx12 + dy12 * dy12 + dz12 * dz12;
	vec3 d13 = dx13 * dx13 + dy13 * dy13 + dz13 * dz13;
	vec3 d21 = dx21 * dx21 + dy21 * dy21 + dz21 * dz21;
	vec3 d22 = dx22 * dx22 + dy22 * dy22 + dz22 * dz22;
	vec3 d23 = dx23 * dx23 + dy23 * dy23 + dz23 * dz23;
	vec3 d31 = dx31 * dx31 + dy31 * dy31 + dz31 * dz31;
	vec3 d32 = dx32 * dx32 + dy32 * dy32 + dz32 * dz32;
	vec3 d33 = dx33 * dx33 + dy33 * dy33 + dz33 * dz33;

	// Sort out the two smallest distances (F1, F2)
#if 0
	// Cheat and sort out only F1
	vec3 d1 = min(min(d11,d12), d13);
	vec3 d2 = min(min(d21,d22), d23);
	vec3 d3 = min(min(d31,d32), d33);
	vec3 d = min(min(d1,d2), d3);
	d.x = min(min(d.x,d.y),d.z);
	return sqrt(d.xx); // F1 duplicated, no F2 computed
#else
	// Do it right and sort out both F1 and F2
	vec3 d1a = min(d11, d12);
	d12 = max(d11, d12);
	d11 = min(d1a, d13); // Smallest now not in d12 or d13
	d13 = max(d1a, d13);
	d12 = min(d12, d13); // 2nd smallest now not in d13
	vec3 d2a = min(d21, d22);
	d22 = max(d21, d22);
	d21 = min(d2a, d23); // Smallest now not in d22 or d23
	d23 = max(d2a, d23);
	d22 = min(d22, d23); // 2nd smallest now not in d23
	vec3 d3a = min(d31, d32);
	d32 = max(d31, d32);
	d31 = min(d3a, d33); // Smallest now not in d32 or d33
	d33 = max(d3a, d33);
	d32 = min(d32, d33); // 2nd smallest now not in d33
	vec3 da = min(d11, d21);
	d21 = max(d11, d21);
	d11 = min(da, d31); // Smallest now in d11
	d31 = max(da, d31); // 2nd smallest now not in d31
	d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;
	d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx; // d11.x now smallest
	d12 = min(d12, d21); // 2nd smallest now not in d21
	d12 = min(d12, d22); // nor in d22
	d12 = min(d12, d31); // nor in d31
	d12 = min(d12, d32); // nor in d32
	d11.yz = min(d11.yz,d12.xy); // nor in d12.yz
	d11.y = min(d11.y,d12.z); // Only two more to go
	d11.y = min(d11.y,d11.z); // Done! (Phew!)
	return sqrt(d11.xy); // F1, F2 
#endif
}

#define  NORMALIZE_GRADIENTS
#undef  USE_CIRCLE
#define COLLAPSE_SORTNET

float permute(float x0,vec3 p) { 
  float x1 = mod(x0 * p.y, p.x);
  return floor(  mod( (x1 + p.z) *x0, p.x ));
}
vec2 permute(vec2 x0,vec3 p) { 
  vec2 x1 = mod(x0 * p.y, p.x);
  return floor(  mod( (x1 + p.z) *x0, p.x ));
}
vec3 permute(vec3 x0,vec3 p) { 
  vec3 x1 = mod(x0 * p.y, p.x);
  return floor(  mod( (x1 + p.z) *x0, p.x ));
}
vec4 permute(vec4 x0,vec3 p) { 
  vec4 x1 = mod(x0 * p.y, p.x);
  return floor(  mod( (x1 + p.z) *x0, p.x ));
}

// Example constant with a 289 element permutation
const vec4 pParam = vec4( 17.0*17.0, 34.0, 1.0, 7.0);

float taylorInvSqrt(float r)
{ 
  return ( 0.83666002653408 + 0.7*0.85373472095314 - 0.85373472095314 * r );
}

float simplexNoise2(vec2 v)
{
  const vec2 C = vec2(0.211324865405187134, // (3.0-sqrt(3.0))/6.;
                      0.366025403784438597); // 0.5*(sqrt(3.0)-1.);
  const vec3 D = vec3( 0., 0.5, 2.0) * 3.14159265358979312;
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1  =  (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.) ;

   //  x0 = x0 - 0. + 0. * C
  vec2 x1 = x0 - i1 + 1. * C.xx ;
  vec2 x2 = x0 - 1. + 2. * C.xx ;

// Permutations
  i = mod(i, pParam.x);
  vec3 p = permute( permute( 
             i.y + vec3(0., i1.y, 1. ), pParam.xyz)
           + i.x + vec3(0., i1.x, 1. ), pParam.xyz);

#ifndef USE_CIRCLE
// ( N points uniformly over a line, mapped onto a diamond.)
  vec3 x = fract(p / pParam.w) ;
  vec3 h = 0.5 - abs(x) ;

  vec3 sx = vec3(lessThan(x,D.xxx)) *2. -1.;
  vec3 sh = vec3(lessThan(h,D.xxx));

  vec3 a0 = x + sx*sh;
  vec2 p0 = vec2(a0.x,h.x);
  vec2 p1 = vec2(a0.y,h.y);
  vec2 p2 = vec2(a0.z,h.z);

#ifdef NORMALISE_GRADIENTS
  p0 *= taylorInvSqrt(dot(p0,p0));
  p1 *= taylorInvSqrt(dot(p1,p1));
  p2 *= taylorInvSqrt(dot(p2,p2));
#endif

  vec3 g = 2.0 * vec3( dot(p0, x0), dot(p1, x1), dot(p2, x2) );
#else 
// N points around a unit circle.
  vec3 phi = D.z * mod(p,pParam.w) /pParam.w ;
  vec4 a0 = sin(phi.xxyy+D.xyxy);
  vec2 a1 = sin(phi.zz  +D.xy);
  vec3 g = vec3( dot(a0.xy, x0), dot(a0.zw, x1), dot(a1.xy, x2) );
#endif
// mix
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.);
  m = m*m ;
  return 1.66666* 70.*dot(m*m, g);
}

float simplexNoise3(vec3 v)
{ 
  const vec2  C = vec2(1./6. , 1./3. ) ;
  const vec4  D = vec4(0., 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  
// Other corners
#ifdef COLLAPSE_SORTNET
  vec3 g = vec3( greaterThan(   x0.xyz, x0.yzx) );
  vec3 l = vec3( lessThanEqual( x0.xyz, x0.yzx) );

  vec3 i1 = g.xyz  * l.zxy;
  vec3 i2 = max( g.xyz, l.zxy);
#else
// Keeping this clean - let the compiler optimize.
  vec3 q1;
  q1.x = max(x0.x, x0.y);
  q1.y = min(x0.x, x0.y);
  q1.z = x0.z;

  vec3 q2;
  q2.x = max(q1.x,q1.z);
  q2.z = min(q1.x,q1.z);
  q2.y = q1.y;

  vec3 q3;
  q3.y = max(q2.y, q2.z);
  q3.z = min(q2.y, q2.z);
  q3.x = q2.x;

  vec3 i1 = vec3(equal(q3.xxx, x0));
  vec3 i2 = i1 + vec3(equal(q3.yyy, x0));
#endif

   //  x0 = x0 - 0. + 0. * C 
  vec3 x1 = x0 - i1 + 1. * C.xxx;
  vec3 x2 = x0 - i2 + 2. * C.xxx;
  vec3 x3 = x0 - 1. + 3. * C.xxx;

// Permutations
  i = mod(i, pParam.x ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0., i1.z, i2.z, 1. ), pParam.xyz)
           + i.y + vec4(0., i1.y, i2.y, 1. ), pParam.xyz) 
           + i.x + vec4(0., i1.x, i2.x, 1. ), pParam.xyz);

// Gradients
// ( N*N points uniformly over a square, mapped onto a octohedron.)
  float n_ = 1.0/pParam.w ;
  vec3  ns = n_ * D.wyz - D.xzx ;

  vec4 j = p - pParam.w*pParam.w*floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z)  ;
  vec4 y_ = floor(j - pParam.w * x_ ) ;    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1. - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = vec4(lessThan(b0,D.xxxx)) *2. -1.;
  vec4 s1 = vec4(lessThan(b1,D.xxxx)) *2. -1.;
  vec4 sh = vec4(lessThan(h, D.xxxx));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

#ifdef NORMALISE_GRADIENTS
  p0 *= taylorInvSqrt(dot(p0,p0));
  p1 *= taylorInvSqrt(dot(p1,p1));
  p2 *= taylorInvSqrt(dot(p2,p2));
  p3 *= taylorInvSqrt(dot(p3,p3));
#endif

// Mix
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);
  m = m * m;
//used to be 64.
  return 48.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec4 grad4(float j, vec4 ip)
{
  const vec4 ones = vec4(1.,1.,1.,-1.);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) *pParam.w) * ip.z -1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p,vec4(0.)));
  p.xyz = p.xyz + (s.xyz*2.-1.) * s.www; 

  return p;
}

float simplexNoise4(vec4 v)
{
  const vec2  C = vec2( 0.138196601125010504, 
                        0.309016994374947451); 
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Force existance of strict total ordering in sort.
  vec4 q0 = floor(x0 * 1024.0) + vec4( 0., 1./4., 2./4. , 3./4.);
  vec4 q1;
  q1.xy = max(q0.xy,q0.zw);   //  x:z  y:w
  q1.zw = min(q0.xy,q0.zw);

  vec4 q2;
  q2.xz = max(q1.xz,q1.yw);   //  x:y  z:w
  q2.yw = min(q1.xz,q1.yw);
  
  vec4 q3;
  q3.y = max(q2.y,q2.z);      //  y:z
  q3.z = min(q2.y,q2.z);
  q3.xw = q2.xw;

  vec4 i1 = vec4(lessThanEqual(q3.xxxx, q0));
  vec4 i2 = vec4(lessThanEqual(q3.yyyy, q0));
  vec4 i3 = vec4(lessThanEqual(q3.zzzz, q0));

   //  x0 = x0 - 0. + 0. * C 
  vec4 x1 = x0 - i1 + 1. * C.xxxx;
  vec4 x2 = x0 - i2 + 2. * C.xxxx;
  vec4 x3 = x0 - i3 + 3. * C.xxxx;
  vec4 x4 = x0 - 1. + 4. * C.xxxx;

// Permutations
  i = mod(i, pParam.x ); 
  float j0 = permute( permute( permute( permute (
              i.w, pParam.xyz) + i.z, pParam.xyz) 
            + i.y, pParam.xyz) + i.x, pParam.xyz);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1. ), pParam.xyz)
           + i.z + vec4(i1.z, i2.z, i3.z, 1. ), pParam.xyz)
           + i.y + vec4(i1.y, i2.y, i3.y, 1. ), pParam.xyz)
           + i.x + vec4(i1.x, i2.x, i3.x, 1. ), pParam.xyz);
// Gradients
// ( N*N*N points uniformly over a cube, 
// mapped onto a 4-octohedron.)
  vec4 ip = pParam ;
  ip.xy *= pParam.w ;
  ip.x  *= pParam.w ;
  ip = vec4(1.,1.,1.,2.) / ip ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

#ifdef NORMALISE_GRADIENTS
  p0 *= taylorInvSqrt(dot(p0,p0));
  p1 *= taylorInvSqrt(dot(p1,p1));
  p2 *= taylorInvSqrt(dot(p2,p2));
  p3 *= taylorInvSqrt(dot(p3,p3));
  p4 *= taylorInvSqrt(dot(p4,p4));
#endif

// Mix
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 32. * (dot(m0*m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)))
               + dot(m1*m1, vec2(dot(p3, x3), dot(p4, x4)))) ;

}
  
void main() {
    float v = time / 100.0;
	float noise = cellular(vec3(vertex.x / 2 + v, v * 1, vertex.z / 2 + v)).x;
	noise -= 0.2f;
	if(noise < 0) noise = 0;
	noise *= 1.2;
	//noise *= abs(simplexNoise3(vec3(vertex.x / 100.0, vertex.y + v, vertex.z / 100.0)));
	gl_FragColor = (vec4(color.xyz, 1 - color.b) + noise) * max(0.4, min(1, sunY));
}