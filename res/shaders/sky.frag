
uniform float sunX;
uniform float sunY;
uniform float sunZ;

varying vec4 vertex;
varying vec4 color;
varying vec3 normal;
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
    float sunDist = length(normalize(vertex.xyz) - normalize(vec3(sunX, sunY, sunZ)));
    sunDist = min(1, 0.02 / (sunDist * sunDist * sunDist));
    vec3 sunCol = vec3(sunDist, sunDist, sunDist);
    float y = (vertex.y - 5);
    vec3 skycol = vec3(0.8 - y / 200.0, 0.8 - y / 200.0, 1);
    float stars = simplexNoise3(vertex.xyz);
    stars -= 0.8;
    if(stars < 0) stars = 0;
    stars *= 5;
    
	gl_FragColor = vec4((skycol + sunCol) * max(min(1, sunY + 0.8), stars), 1);
}
