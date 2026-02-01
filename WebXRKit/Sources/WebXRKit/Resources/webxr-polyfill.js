/**
 * Start IWER library
 */

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE$1 = typeof Float32Array !== "undefined" ? Float32Array : Array;

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create$6() {
    var out = new ARRAY_TYPE$1(9);
    if (ARRAY_TYPE$1 != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
}

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create$5() {
    var out = new ARRAY_TYPE$1(16);
    if (ARRAY_TYPE$1 != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
    var out = new ARRAY_TYPE$1(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */
function copy$3(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4 | null} out, or null if source matrix is not invertible
 */
function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
        return null;
    }
    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
}

/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */
function multiply$2(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

    // Cache only the current line of the second matrix
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
    var x = axis[0],
        y = axis[1],
        z = axis[2];
    var len = Math.sqrt(x * x + y * y + z * z);
    var s, c, t;
    if (len < EPSILON) {
        return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *     let quatMat = mat4.create();
 *     mat4.fromQuat(quatMat, quat);
 *     mat4.multiply(dest, dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
}

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion parameter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
}

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE$1(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
        S = Math.sqrt(trace + 1.0) * 2;
        out[3] = 0.25 * S;
        out[0] = (sm23 - sm32) / S;
        out[1] = (sm31 - sm13) / S;
        out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
        S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
        out[3] = (sm23 - sm32) / S;
        out[0] = 0.25 * S;
        out[1] = (sm12 + sm21) / S;
        out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
        S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
        out[3] = (sm31 - sm13) / S;
        out[0] = (sm12 + sm21) / S;
        out[1] = 0.25 * S;
        out[2] = (sm23 + sm32) / S;
    } else {
        S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
        out[3] = (sm12 - sm21) / S;
        out[0] = (sm31 + sm13) / S;
        out[1] = (sm23 + sm32) / S;
        out[2] = 0.25 * S;
    }
    return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *     let quatMat = mat4.create();
 *     mat4.fromQuat(quatMat, quat);
 *     mat4.multiply(dest, dest, quatMat);
 *     mat4.scale(dest, dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
    // Quaternion math
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */
function perspectiveNO(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
        var nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
    } else {
        out[10] = -1;
        out[14] = -2 * near;
    }
    return out;
}

/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */
var perspective = perspectiveNO;

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create$4() {
    var out = new ARRAY_TYPE$1(3);
    if (ARRAY_TYPE$1 != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
    }
    return out;
}

/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues$2(x, y, z) {
    var out = new ARRAY_TYPE$1(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */
function copy$2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set$2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize$2(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
}

/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q normalized quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
    // Fast Vector Rotation using Quaternions by Robert Eisele
    // https://raw.org/proof/vector-rotation-using-quaternions/

    var qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3];
    var vx = a[0],
        vy = a[1],
        vz = a[2];

    // t = q x v
    var tx = qy * vz - qz * vy;
    var ty = qz * vx - qx * vz;
    var tz = qx * vy - qy * vx;

    // t = 2t
    tx = tx + tx;
    ty = ty + ty;
    tz = tz + tz;

    // v + w t + q x t
    out[0] = vx + qw * tx + qy * tz - qz * ty;
    out[1] = vy + qw * ty + qz * tx - qx * tz;
    out[2] = vz + qw * tz + qx * ty - qy * tx;
    return out;
}

/**
 * Alias for {@link vec3.length}
 * @function
 */
var len = length;

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
(function () {
    var vec = create$4();
    return function (a, stride, offset, count, fn, arg) {
        var i, l;
        if (!stride) {
            stride = 3;
        }
        if (!offset) {
            offset = 0;
        }
        if (count) {
            l = Math.min(count * stride + offset, a.length);
        } else {
            l = a.length;
        }
        for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
        }
        return a;
    };
})();

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create$3() {
    var out = new ARRAY_TYPE$1(4);
    if (ARRAY_TYPE$1 != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
    }
    return out;
}

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues$1(x, y, z, w) {
    var out = new ARRAY_TYPE$1(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */
function copy$1(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
}

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
function set$1(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
}

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len = x * x + y * y + z * z + w * w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
}

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
}

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
(function () {
    var vec = create$3();
    return function (a, stride, offset, count, fn, arg) {
        var i, l;
        if (!stride) {
            stride = 4;
        }
        if (!offset) {
            offset = 0;
        }
        if (count) {
            l = Math.min(count * stride + offset, a.length);
        } else {
            l = a.length;
        }
        for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            vec[3] = a[i + 3];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
            a[i + 3] = vec[3];
        }
        return a;
    };
})();

/**
 * Quaternion in the format XYZW
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
function create$2() {
    var out = new ARRAY_TYPE$1(4);
    if (ARRAY_TYPE$1 != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
    }
    out[3] = 1;
    return out;
}

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
}

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 */
function multiply$1(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    var omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
    }
    // calculate coefficients
    if (1.0 - cosom > EPSILON) {
        // standard case (slerp)
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {
        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
}

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate conjugate of
 * @returns {quat} out
 */
function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
}

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;
    if (fTrace > 0.0) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0); // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot; // 1/(4w)
        out[0] = (m[5] - m[7]) * fRoot;
        out[1] = (m[6] - m[2]) * fRoot;
        out[2] = (m[1] - m[3]) * fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if (m[4] > m[0]) i = 1;
        if (m[8] > m[i * 3 + i]) i = 2;
        var j = (i + 1) % 3;
        var k = (i + 2) % 3;
        fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
        out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
        out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
}

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
var fromValues = fromValues$1;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the source quaternion
 * @returns {quat} out
 * @function
 */
var copy = copy$1;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
var set = set$1;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
var normalize = normalize$1;

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */
(function () {
    var tmpvec3 = create$4();
    var xUnitVec3 = fromValues$2(1, 0, 0);
    var yUnitVec3 = fromValues$2(0, 1, 0);
    return function (out, a, b) {
        var dot$1 = dot(a, b);
        if (dot$1 < -0.999999) {
            cross(tmpvec3, xUnitVec3, a);
            if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
            normalize$2(tmpvec3, tmpvec3);
            setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot$1 > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot$1;
            return normalize(out, out);
        }
    };
})();

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */
(function () {
    var temp1 = create$2();
    var temp2 = create$2();
    return function (out, a, b, c, d, t) {
        slerp(temp1, a, d, t);
        slerp(temp2, b, c, t);
        slerp(out, temp1, temp2, 2 * t * (1 - t));
        return out;
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
(function () {
    var matr = create$6();
    return function (out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];
        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];
        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];
        return normalize(out, fromMat3(out, matr));
    };
})();

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const P_ACTION_PLAYER = Symbol('@iwer/action-player');
const P_ACTION_RECORDER = Symbol('@iwer/action-recorder');
const P_ANCHOR = Symbol('@iwer/xr-anchor');
const P_CONTROLLER = Symbol('@iwer/xr-controller');
const P_DEVICE = Symbol('@iwer/xr-device');
const P_HAND_INPUT = Symbol('@iwer/xr-hand-input');
const P_TRACKED_INPUT = Symbol('@iwer/xr-tracked-input');
const P_FRAME = Symbol('@iwer/xr-frame');
const P_GAMEPAD = Symbol('@iwer/gamepad');
const P_SYSTEM = Symbol('@iwer/xr-system');
const P_INPUT_SOURCE = Symbol('@iwer/xr-input-source');
const P_WEBGL_LAYER = Symbol('@iwer/xr-webgl-layer');
const P_MESH = Symbol('@iwer/xr-mesh');
const P_PLANE = Symbol('@iwer/xr-plane');
const P_JOINT_POSE = Symbol('@iwer/xr-joint-pose');
const P_POSE = Symbol('@iwer/xr-pose');
const P_VIEWER_POSE = Symbol('@iwer/xr-viewer-pose');
const P_RIGID_TRANSFORM = Symbol('@iwer/xr-rigid-transform');
const P_RENDER_STATE = Symbol('@iwer/xr-render-state');
const P_SESSION = Symbol('@iwer/xr-session');
const P_JOINT_SPACE = Symbol('@iwer/xr-joint-space');
const P_REF_SPACE = Symbol('@iwer/xr-reference-space');
const P_SPACE = Symbol('@iwer/xr-space');
const P_VIEW = Symbol('@iwer/xr-view');
const P_VIEWPORT = Symbol('@iwer/xr-viewport');
const P_RAY = Symbol('@iwer/xr-ray');
const P_HIT_TEST = Symbol('@iwer/xr-hit-test');

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRSpace extends EventTarget {
    constructor(parentSpace, offsetMatrix) {
        super();
        this[P_SPACE] = {
            parentSpace,
            offsetMatrix: offsetMatrix ? clone(offsetMatrix) : create$5(),
            emulated: true,
        };
    }
}
class GlobalSpace extends XRSpace {
    constructor() {
        super(undefined, create$5()); // GlobalSpace has no parent
    }
}
class XRSpaceUtils {
    // Update the position component of the offsetMatrix of a given XRSpace
    static updateOffsetPosition(space, position) {
        const offsetMatrix = space[P_SPACE].offsetMatrix;
        fromTranslation(offsetMatrix, position);
    }
    // Update the rotation component of the offsetMatrix of a given XRSpace using a quaternion
    static updateOffsetQuaternion(space, quaternion) {
        const offsetMatrix = space[P_SPACE].offsetMatrix;
        const translation = create$4();
        getTranslation(translation, offsetMatrix);
        fromRotationTranslation(offsetMatrix, quaternion, translation);
    }
    // Update the offsetMatrix of a given XRSpace directly
    static updateOffsetMatrix(space, matrix) {
        const offsetMatrix = space[P_SPACE].offsetMatrix;
        copy$3(offsetMatrix, matrix);
    }
    // Calculate the global offset matrix for a given XRSpace
    static calculateGlobalOffsetMatrix(space, globalOffset = create$5()) {
        const parentOffset = space[P_SPACE].parentSpace
            ? XRSpaceUtils.calculateGlobalOffsetMatrix(space[P_SPACE].parentSpace)
            : create$5(); // Identity matrix for GlobalSpace
        multiply$2(globalOffset, parentOffset, space[P_SPACE].offsetMatrix);
        return globalOffset;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Wrapper class for gl-matrix vec3
 * Minimal interoperable interface to Vector3 in Three.js and Babylon.js
 */
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.vec3 = fromValues$2(x, y, z);
        this.tempVec3 = create$4();
    }
    get x() {
        return this.vec3[0];
    }
    set x(value) {
        this.vec3[0] = value;
    }
    get y() {
        return this.vec3[1];
    }
    set y(value) {
        this.vec3[1] = value;
    }
    get z() {
        return this.vec3[2];
    }
    set z(value) {
        this.vec3[2] = value;
    }
    set(x, y, z) {
        set$2(this.vec3, x, y, z);
        return this;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    normalize() {
        copy$2(this.tempVec3, this.vec3);
        normalize$2(this.vec3, this.tempVec3);
        return this;
    }
    add(v) {
        copy$2(this.tempVec3, this.vec3);
        add(this.vec3, this.tempVec3, v.vec3);
        return this;
    }
    applyQuaternion(q) {
        copy$2(this.tempVec3, this.vec3);
        transformQuat(this.vec3, this.tempVec3, q.quat);
        return this;
    }
}
/**
 * Wrapper class for gl-matrix quat4
 * Minimal interoperable interface to Vector3 in Three.js and Babylon.js
 */
class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.quat = fromValues(x, y, z, w);
        this.tempQuat = create$2();
    }
    get x() {
        return this.quat[0];
    }
    set x(value) {
        this.quat[0] = value;
    }
    get y() {
        return this.quat[1];
    }
    set y(value) {
        this.quat[1] = value;
    }
    get z() {
        return this.quat[2];
    }
    set z(value) {
        this.quat[2] = value;
    }
    get w() {
        return this.quat[3];
    }
    set w(value) {
        this.quat[3] = value;
    }
    set(x, y, z, w) {
        set(this.quat, x, y, z, w);
        return this;
    }
    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    copy(q) {
        set(this.quat, q.x, q.y, q.z, q.w);
        return this;
    }
    normalize() {
        copy(this.tempQuat, this.quat);
        normalize(this.quat, this.tempQuat);
        return this;
    }
    invert() {
        copy(this.tempQuat, this.quat);
        conjugate(this.quat, this.tempQuat);
        return this;
    }
    multiply(q) {
        copy(this.tempQuat, this.quat);
        multiply$1(this.quat, this.tempQuat, q.quat);
        return this;
    }
    setFromAxisAngle(axis, angle) {
        setAxisAngle(this.quat, axis.vec3, angle);
        return this;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var GamepadMappingType;
(function (GamepadMappingType) {
    GamepadMappingType["None"] = "";
    GamepadMappingType["Standard"] = "standard";
    GamepadMappingType["XRStandard"] = "xr-standard";
})(GamepadMappingType || (GamepadMappingType = {}));
class GamepadButton {
    constructor(type, eventTrigger) {
        this[P_GAMEPAD] = {
            type,
            eventTrigger,
            pressed: false,
            touched: false,
            value: 0,
            lastFrameValue: 0,
            pendingValue: null,
        };
    }
    get pressed() {
        if (this[P_GAMEPAD].type === 'manual') {
            return this[P_GAMEPAD].pressed;
        }
        else {
            return this[P_GAMEPAD].value > 0;
        }
    }
    get touched() {
        if (this[P_GAMEPAD].type === 'manual') {
            return this[P_GAMEPAD].touched;
        }
        else {
            return this[P_GAMEPAD].touched || this.pressed;
        }
    }
    get value() {
        return this[P_GAMEPAD].value;
    }
}
class EmptyGamepadButton {
    constructor() {
        this.pressed = false;
        this.touched = false;
        this.value = 0;
    }
}
class Gamepad {
    constructor(gamepadConfig, id = '', index = -1) {
        this[P_GAMEPAD] = {
            id,
            index,
            connected: false,
            timestamp: performance.now(),
            mapping: gamepadConfig.mapping,
            buttonsMap: {},
            buttonsSequence: [],
            axesMap: {},
            axesSequence: [],
            hapticActuators: [],
        };
        gamepadConfig.buttons.forEach((buttonConfig) => {
            var _a;
            if (buttonConfig === null) {
                this[P_GAMEPAD].buttonsSequence.push(null);
            }
            else {
                this[P_GAMEPAD].buttonsSequence.push(buttonConfig.id);
                this[P_GAMEPAD].buttonsMap[buttonConfig.id] = new GamepadButton(buttonConfig.type, (_a = buttonConfig.eventTrigger) !== null && _a !== void 0 ? _a : null);
            }
        });
        gamepadConfig.axes.forEach((axisConfig) => {
            if (axisConfig === null) {
                this[P_GAMEPAD].axesSequence.push(null);
            }
            else {
                this[P_GAMEPAD].axesSequence.push(axisConfig.id + axisConfig.type);
                if (!this[P_GAMEPAD].axesMap[axisConfig.id]) {
                    this[P_GAMEPAD].axesMap[axisConfig.id] = { x: 0, y: 0 };
                }
            }
        });
    }
    get id() {
        return this[P_GAMEPAD].id;
    }
    get index() {
        return this[P_GAMEPAD].index;
    }
    get connected() {
        return this[P_GAMEPAD].connected;
    }
    get timestamp() {
        return this[P_GAMEPAD].timestamp;
    }
    get mapping() {
        return this[P_GAMEPAD].mapping;
    }
    get axes() {
        const axes = [];
        this[P_GAMEPAD].axesSequence.forEach((id) => {
            if (id === null) {
                axes.push(null);
            }
            else {
                const axisId = id.substring(0, id.length - 6);
                const axisType = id.substring(id.length - 6);
                axes.push(
                    // if axis type is manual, then return the x value
                    axisType === 'y-axis'
                        ? this[P_GAMEPAD].axesMap[axisId].y
                        : this[P_GAMEPAD].axesMap[axisId].x);
            }
        });
        return axes;
    }
    get buttons() {
        return this[P_GAMEPAD].buttonsSequence.map((id) => id === null ? new EmptyGamepadButton() : this[P_GAMEPAD].buttonsMap[id]);
    }
    get hapticActuators() {
        return this[P_GAMEPAD].hapticActuators;
    }
    get vibrationActuator() {
        return null;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var XRHandedness;
(function (XRHandedness) {
    XRHandedness["None"] = "none";
    XRHandedness["Left"] = "left";
    XRHandedness["Right"] = "right";
})(XRHandedness || (XRHandedness = {}));
var XRTargetRayMode;
(function (XRTargetRayMode) {
    XRTargetRayMode["Gaze"] = "gaze";
    XRTargetRayMode["TrackedPointer"] = "tracked-pointer";
    XRTargetRayMode["Screen"] = "screen";
    XRTargetRayMode["TransientPointer"] = "transient-pointer";
})(XRTargetRayMode || (XRTargetRayMode = {}));
class XRInputSourceArray extends Array {
}
class XRInputSource {
    constructor(handedness, targetRayMode, profiles, targetRaySpace, gamepad, gripSpace, hand) {
        this[P_INPUT_SOURCE] = {
            handedness,
            targetRayMode,
            targetRaySpace,
            gripSpace,
            profiles,
            gamepad,
            hand,
        };
    }
    get handedness() {
        return this[P_INPUT_SOURCE].handedness;
    }
    get targetRayMode() {
        return this[P_INPUT_SOURCE].targetRayMode;
    }
    get targetRaySpace() {
        return this[P_INPUT_SOURCE].targetRaySpace;
    }
    get gripSpace() {
        return this[P_INPUT_SOURCE].gripSpace;
    }
    get profiles() {
        return this[P_INPUT_SOURCE].profiles;
    }
    get gamepad() {
        return this[P_INPUT_SOURCE].gamepad;
    }
    get hand() {
        return this[P_INPUT_SOURCE].hand;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRInputSourceEvent extends Event {
    constructor(type, eventInitDict) {
        super(type, eventInitDict);
        if (!eventInitDict.frame) {
            throw new Error('XRInputSourceEventInit.frame is required');
        }
        if (!eventInitDict.inputSource) {
            throw new Error('XRInputSourceEventInit.inputSource is required');
        }
        this.frame = eventInitDict.frame;
        this.inputSource = eventInitDict.inputSource;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const DEFAULT_TRANSFORM = {
    [XRHandedness.Left]: {
        position: new Vector3(-0.25, 1.5, -0.4),
        quaternion: new Quaternion(),
    },
    [XRHandedness.Right]: {
        position: new Vector3(0.25, 1.5, -0.4),
        quaternion: new Quaternion(),
    },
    [XRHandedness.None]: {
        position: new Vector3(0.25, 1.5, -0.4),
        quaternion: new Quaternion(),
    },
};
class XRTrackedInput {
    constructor(inputSource) {
        this[P_TRACKED_INPUT] = {
            inputSource,
            position: DEFAULT_TRANSFORM[inputSource.handedness].position.clone(),
            quaternion: DEFAULT_TRANSFORM[inputSource.handedness].quaternion.clone(),
            connected: true,
            lastFrameConnected: false,
            inputSourceChanged: true,
        };
    }
    get position() {
        return this[P_TRACKED_INPUT].position;
    }
    get quaternion() {
        return this[P_TRACKED_INPUT].quaternion;
    }
    get inputSource() {
        return this[P_TRACKED_INPUT].inputSource;
    }
    get connected() {
        return this[P_TRACKED_INPUT].connected;
    }
    set connected(value) {
        this[P_TRACKED_INPUT].connected = value;
        this[P_TRACKED_INPUT].inputSource.gamepad[P_GAMEPAD].connected = value;
    }
    onFrameStart(frame) {
        const targetRaySpace = this[P_TRACKED_INPUT].inputSource.targetRaySpace;
        fromRotationTranslation(targetRaySpace[P_SPACE].offsetMatrix, this[P_TRACKED_INPUT].quaternion.quat, this[P_TRACKED_INPUT].position.vec3);
        const session = frame.session;
        this[P_TRACKED_INPUT].inputSource.gamepad.buttons.forEach((button) => {
            if (button instanceof GamepadButton) {
                // apply pending values and record last frame values
                button[P_GAMEPAD].lastFrameValue = button[P_GAMEPAD].value;
                if (button[P_GAMEPAD].pendingValue != null) {
                    button[P_GAMEPAD].value = button[P_GAMEPAD].pendingValue;
                    button[P_GAMEPAD].pendingValue = null;
                }
                // trigger input source events
                if (button[P_GAMEPAD].eventTrigger != null) {
                    if (button[P_GAMEPAD].lastFrameValue === 0 &&
                        button[P_GAMEPAD].value > 0) {
                        session.dispatchEvent(new XRInputSourceEvent(button[P_GAMEPAD].eventTrigger, {
                            frame,
                            inputSource: this[P_TRACKED_INPUT].inputSource,
                        }));
                        session.dispatchEvent(new XRInputSourceEvent(button[P_GAMEPAD].eventTrigger + 'start', {
                            frame,
                            inputSource: this[P_TRACKED_INPUT].inputSource,
                        }));
                    }
                    else if (button[P_GAMEPAD].lastFrameValue > 0 &&
                        button[P_GAMEPAD].value === 0) {
                        session.dispatchEvent(new XRInputSourceEvent(button[P_GAMEPAD].eventTrigger + 'end', {
                            frame,
                            inputSource: this[P_TRACKED_INPUT].inputSource,
                        }));
                    }
                }
            }
        });
        this[P_TRACKED_INPUT].inputSourceChanged =
            this.connected !== this[P_TRACKED_INPUT].lastFrameConnected;
        this[P_TRACKED_INPUT].lastFrameConnected = this.connected;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRController extends XRTrackedInput {
    constructor(controllerConfig, handedness, globalSpace) {
        if (!controllerConfig.layout[handedness]) {
            throw new DOMException('Handedness not supported', 'InvalidStateError');
        }
        const targetRaySpace = new XRSpace(globalSpace);
        const gripSpace = controllerConfig.layout[handedness].gripOffsetMatrix
            ? new XRSpace(targetRaySpace, controllerConfig.layout[handedness].gripOffsetMatrix)
            : undefined;
        const profiles = [
            controllerConfig.profileId,
            ...controllerConfig.fallbackProfileIds,
        ];
        const inputSource = new XRInputSource(handedness, XRTargetRayMode.TrackedPointer, profiles, targetRaySpace, new Gamepad(controllerConfig.layout[handedness].gamepad), gripSpace);
        super(inputSource);
        this[P_CONTROLLER] = {
            profileId: controllerConfig.profileId,
            gamepadConfig: controllerConfig.layout[handedness].gamepad,
        };
    }
    get gamepadConfig() {
        return this[P_CONTROLLER].gamepadConfig;
    }
    get profileId() {
        return this[P_CONTROLLER].profileId;
    }
    updateButtonValue(id, value) {
        if (value > 1 || value < 0) {
            console.warn(`Out-of-range value ${value} provided for button ${id}.`);
            return;
        }
        const gamepadButton = this[P_TRACKED_INPUT].inputSource.gamepad[P_GAMEPAD].buttonsMap[id];
        if (gamepadButton) {
            if (gamepadButton[P_GAMEPAD].type === 'binary' &&
                value != 1 &&
                value != 0) {
                console.warn(`Non-binary value ${value} provided for binary button ${id}.`);
                return;
            }
            gamepadButton[P_GAMEPAD].pendingValue = value;
        }
        else {
            console.warn(`Current controller does not have button ${id}.`);
        }
    }
    updateButtonTouch(id, touched) {
        const gamepadButton = this[P_TRACKED_INPUT].inputSource.gamepad[P_GAMEPAD].buttonsMap[id];
        if (gamepadButton) {
            gamepadButton[P_GAMEPAD].touched = touched;
        }
        else {
            console.warn(`Current controller does not have button ${id}.`);
        }
    }
    updateAxis(id, type, value) {
        if (value > 1 || value < -1) {
            console.warn(`Out-of-range value ${value} provided for ${id} axes.`);
            return;
        }
        const axesById = this[P_TRACKED_INPUT].inputSource.gamepad[P_GAMEPAD].axesMap[id];
        if (axesById) {
            if (type === 'x-axis') {
                axesById.x = value;
            }
            else if (type === 'y-axis') {
                axesById.y = value;
            }
        }
        else {
            console.warn(`Current controller does not have ${id} axes.`);
        }
    }
    updateAxes(id, x, y) {
        if (x > 1 || x < -1 || y > 1 || y < -1) {
            console.warn(`Out-of-range value x:${x}, y:${y} provided for ${id} axes.`);
            return;
        }
        const axesById = this[P_TRACKED_INPUT].inputSource.gamepad[P_GAMEPAD].axesMap[id];
        if (axesById) {
            axesById.x = x;
            axesById.y = y;
        }
        else {
            console.warn(`Current controller does not have ${id} axes.`);
        }
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRMesh {
    constructor(nativeMesh, meshSpace, vertices, indices, semanticLabel) {
        this[P_MESH] = {
            nativeMesh,
            frame: undefined,
            meshSpace,
            vertices,
            indices,
            lastChangedTime: performance.now(),
            semanticLabel,
        };
    }
    get meshSpace() {
        return this[P_MESH].meshSpace;
    }
    get vertices() {
        return this[P_MESH].vertices;
    }
    get indices() {
        return this[P_MESH].indices;
    }
    get lastChangedTime() {
        return this[P_MESH].lastChangedTime;
    }
    get semanticLabel() {
        return this[P_MESH].semanticLabel;
    }
}
class XRMeshSet extends Set {
}
class NativeMesh {
    constructor(transform, vertices, indices, semanticLabel) {
        this.transform = transform;
        this.vertices = vertices;
        this.indices = indices;
        this.semanticLabel = semanticLabel;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Source: https://github.com/immersive-web/semantic-labels/blob/master/labels.json
/**
 * Enum for semantic labels.
 * For more details, see the {@link https://github.com/immersive-web/semantic-labels | Semantic Labels Documentation}.
 */
var XRSemanticLabels;
(function (XRSemanticLabels) {
    XRSemanticLabels["Desk"] = "desk";
    XRSemanticLabels["Couch"] = "couch";
    XRSemanticLabels["Floor"] = "floor";
    XRSemanticLabels["Ceiling"] = "ceiling";
    XRSemanticLabels["Wall"] = "wall";
    XRSemanticLabels["Door"] = "door";
    XRSemanticLabels["Window"] = "window";
    XRSemanticLabels["Table"] = "table";
    XRSemanticLabels["Shelf"] = "shelf";
    XRSemanticLabels["Bed"] = "bed";
    XRSemanticLabels["Screen"] = "screen";
    XRSemanticLabels["Lamp"] = "lamp";
    XRSemanticLabels["Plant"] = "plant";
    XRSemanticLabels["WallArt"] = "wall art";
    XRSemanticLabels["GlobalMesh"] = "global mesh";
    XRSemanticLabels["Other"] = "other";
})(XRSemanticLabels || (XRSemanticLabels = {}));

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var XRPlaneOrientation;
(function (XRPlaneOrientation) {
    XRPlaneOrientation["Horizontal"] = "horizontal";
    XRPlaneOrientation["Vertical"] = "vertical";
})(XRPlaneOrientation || (XRPlaneOrientation = {}));
/**
 * XRPlane orientation mapping from semantic labels.
 * For more details, see the {@link https://github.com/immersive-web/semantic-labels | Semantic Labels Documentation}.
 */
const XREntityOrientation = {
    [XRSemanticLabels.Desk]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Couch]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Floor]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Ceiling]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Wall]: XRPlaneOrientation.Vertical,
    [XRSemanticLabels.Door]: XRPlaneOrientation.Vertical,
    [XRSemanticLabels.Window]: XRPlaneOrientation.Vertical,
    [XRSemanticLabels.Table]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Shelf]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Bed]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Screen]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Lamp]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.Plant]: XRPlaneOrientation.Horizontal,
    [XRSemanticLabels.WallArt]: XRPlaneOrientation.Vertical,
};
class XRPlane {
    constructor(nativePlane, planeSpace, polygon, semanticLabel) {
        this[P_PLANE] = {
            nativePlane,
            frame: undefined,
            planeSpace,
            polygon,
            lastChangedTime: performance.now(),
            semanticLabel,
            orientation: semanticLabel
                ? XREntityOrientation[semanticLabel]
                : undefined,
        };
    }
    get planeSpace() {
        return this[P_PLANE].planeSpace;
    }
    get polygon() {
        return this[P_PLANE].polygon;
    }
    get orientation() {
        return this[P_PLANE].orientation;
    }
    get lastChangedTime() {
        return this[P_PLANE].lastChangedTime;
    }
    get semanticLabel() {
        return this[P_PLANE].semanticLabel;
    }
}
class XRPlaneSet extends Set {
}
class NativePlane {
    constructor(transform, polygon, semanticLabel) {
        this.transform = transform;
        this.polygon = polygon;
        this.semanticLabel = semanticLabel;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRAnchor {
    constructor(anchorSpace, session) {
        this[P_ANCHOR] = {
            anchorSpace,
            session,
            deleted: false,
        };
        session[P_SESSION].trackedAnchors.add(this);
    }
    get anchorSpace() {
        if (this[P_ANCHOR].deleted) {
            throw new DOMException('XRAnchor has already been deleted.', 'InvalidStateError');
        }
        return this[P_ANCHOR].anchorSpace;
    }
    requestPersistentHandle() {
        return new Promise((resolve, reject) => {
            if (this[P_ANCHOR].deleted) {
                reject(new DOMException('XRAnchor has already been deleted.', 'InvalidStateError'));
            }
            else {
                const persistentAnchors = this[P_ANCHOR].session[P_SESSION].persistentAnchors;
                for (const [uuid, anchor] of persistentAnchors.entries()) {
                    if (anchor === this) {
                        resolve(uuid);
                        return;
                    }
                }
                const uuid = crypto.randomUUID();
                XRAnchorUtils.createPersistentAnchor(this[P_ANCHOR].session, this, uuid);
                resolve(uuid);
            }
        });
    }
    delete() {
        if (this[P_ANCHOR].deleted) {
            return;
        }
        this[P_ANCHOR].anchorSpace = null;
        this[P_ANCHOR].deleted = true;
        this[P_ANCHOR].session[P_SESSION].trackedAnchors.delete(this);
    }
}
class XRAnchorSet extends Set {
}
const PersistentAnchorsStorageKey = '@immersive-web-emulation-runtime/persistent-anchors';
class XRAnchorUtils {
    static recoverPersistentAnchorsFromStorage(session) {
        const persistentAnchors = JSON.parse(localStorage.getItem(PersistentAnchorsStorageKey) || '{}');
        Object.entries(persistentAnchors).forEach(([uuid, offsetMatrix]) => {
            const globalSpace = session[P_SESSION].device[P_DEVICE].globalSpace;
            const anchorSpace = new XRSpace(globalSpace, offsetMatrix);
            const anchor = new XRAnchor(anchorSpace, session);
            session[P_SESSION].persistentAnchors.set(uuid, anchor);
        });
    }
    static createPersistentAnchor(session, anchor, uuid) {
        session[P_SESSION].trackedAnchors.add(anchor);
        session[P_SESSION].persistentAnchors.set(uuid, anchor);
        const persistentAnchors = JSON.parse(localStorage.getItem(PersistentAnchorsStorageKey) || '{}');
        persistentAnchors[uuid] = Array.from(anchor[P_ANCHOR].anchorSpace[P_SPACE].offsetMatrix);
        localStorage.setItem(PersistentAnchorsStorageKey, JSON.stringify(persistentAnchors));
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRRigidTransform {
    constructor(position, orientation) {
        // Default values
        const defaultPosition = fromValues$2(0, 0, 0);
        const defaultOrientation = create$2();
        this[P_RIGID_TRANSFORM] = {
            matrix: create$5(),
            position: position
                ? fromValues$2(position.x, position.y, position.z)
                : defaultPosition,
            orientation: orientation
                ? normalize(create$2(), fromValues(orientation.x, orientation.y, orientation.z, orientation.w))
                : defaultOrientation,
            inverse: null,
        };
        this.updateMatrix();
    }
    updateMatrix() {
        fromRotationTranslation(this[P_RIGID_TRANSFORM].matrix, this[P_RIGID_TRANSFORM].orientation, this[P_RIGID_TRANSFORM].position);
    }
    get matrix() {
        return this[P_RIGID_TRANSFORM].matrix;
    }
    get position() {
        const pos = this[P_RIGID_TRANSFORM].position;
        return new DOMPointReadOnly(pos[0], pos[1], pos[2], 1);
    }
    get orientation() {
        const ori = this[P_RIGID_TRANSFORM].orientation;
        return new DOMPointReadOnly(ori[0], ori[1], ori[2], ori[3]);
    }
    get inverse() {
        if (!this[P_RIGID_TRANSFORM].inverse) {
            const invMatrix = create$5();
            if (!invert(invMatrix, this[P_RIGID_TRANSFORM].matrix)) {
                throw new Error('Matrix is not invertible.');
            }
            // Decomposing the inverse matrix into position and orientation
            let invPosition = create$4();
            getTranslation(invPosition, invMatrix);
            let invOrientation = create$2();
            getRotation(invOrientation, invMatrix);
            // Creating a new XRRigidTransform for the inverse
            this[P_RIGID_TRANSFORM].inverse = new XRRigidTransform(new DOMPointReadOnly(invPosition[0], invPosition[1], invPosition[2], 1), new DOMPointReadOnly(invOrientation[0], invOrientation[1], invOrientation[2], invOrientation[3]));
            // Setting the inverse of the inverse to be this transform
            this[P_RIGID_TRANSFORM].inverse[P_RIGID_TRANSFORM].inverse = this;
        }
        return this[P_RIGID_TRANSFORM].inverse;
    }
}

class DOMPointReadOnly$1 {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
class XRRay {
    constructor(origin, direction) {
        const _origin = { x: 0, y: 0, z: 0, w: 1 };
        const _direction = { x: 0, y: 0, z: -1, w: 0 };
        if (origin instanceof XRRigidTransform) {
            const transform = origin;
            const matrix = transform.matrix;
            const originVec4 = set$1(create$3(), _origin.x, _origin.y, _origin.z, _origin.w);
            const directionVec4 = set$1(create$3(), _direction.x, _direction.y, _direction.z, _direction.w);
            transformMat4(originVec4, originVec4, matrix);
            transformMat4(directionVec4, directionVec4, matrix);
            _origin.x = originVec4[0];
            _origin.y = originVec4[1];
            _origin.z = originVec4[2];
            _origin.w = originVec4[3];
            _direction.x = directionVec4[0];
            _direction.y = directionVec4[1];
            _direction.z = directionVec4[2];
            _direction.w = directionVec4[3];
        }
        else {
            if (origin) {
                _origin.x = origin.x;
                _origin.y = origin.y;
                _origin.z = origin.z;
                _origin.w = origin.w;
            }
            if (direction) {
                if ((direction.x === 0 && direction.y === 0 && direction.z === 0) ||
                    direction.w !== 0) {
                    throw new DOMException('Invalid direction value to construct XRRay', 'TypeError');
                }
                _direction.x = direction.x;
                _direction.y = direction.y;
                _direction.z = direction.z;
                _direction.w = direction.w;
            }
        }
        const length = Math.sqrt(_direction.x * _direction.x +
            _direction.y * _direction.y +
            _direction.z * _direction.z) || 1;
        _direction.x = _direction.x / length;
        _direction.y = _direction.y / length;
        _direction.z = _direction.z / length;
        this[P_RAY] = {
            origin: new DOMPointReadOnly$1(_origin.x, _origin.y, _origin.z, _origin.w),
            direction: new DOMPointReadOnly$1(_direction.x, _direction.y, _direction.z, _direction.w),
            matrix: null,
        };
    }
    get origin() {
        return this[P_RAY].origin;
    }
    get direction() {
        return this[P_RAY].direction;
    }
    get matrix() {
        if (this[P_RAY].matrix) {
            return this[P_RAY].matrix;
        }
        const z = set$2(create$4(), 0, 0, -1);
        const origin = set$2(create$4(), this[P_RAY].origin.x, this[P_RAY].origin.y, this[P_RAY].origin.z);
        const direction = set$2(create$4(), this[P_RAY].direction.x, this[P_RAY].direction.y, this[P_RAY].direction.z);
        const axis = cross(create$4(), direction, z);
        const cosAngle = dot(direction, z);
        const rotation = create$5();
        if (cosAngle > -1 && cosAngle < 1) {
            fromRotation(rotation, Math.acos(cosAngle), axis);
        }
        else if (cosAngle === -1) {
            fromRotation(rotation, Math.acos(cosAngle), set$2(create$4(), 1, 0, 0));
        }
        else {
            identity(rotation);
        }
        const translation = fromTranslation(create$5(), origin);
        const matrix = multiply$2(create$5(), translation, rotation);
        this[P_RAY].matrix = new Float32Array(matrix);
        return this[P_RAY].matrix;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRHitTestSource {
    constructor(session, options) {
        var _a;
        this[P_HIT_TEST] = {
            session,
            space: options.space,
            offsetRay: (_a = options.offsetRay) !== null && _a !== void 0 ? _a : new XRRay(),
        };
    }
    cancel() {
        this[P_HIT_TEST].session[P_SESSION].hitTestSources.delete(this);
    }
}
class XRHitTestResult {
    constructor(frame, offsetSpace) {
        this[P_HIT_TEST] = { frame, offsetSpace };
    }
    getPose(baseSpace) {
        return this[P_HIT_TEST].frame.getPose(this[P_HIT_TEST].offsetSpace, baseSpace);
    }
    createAnchor() {
        return this[P_HIT_TEST].frame.createAnchor(new XRRigidTransform(), this[P_HIT_TEST].offsetSpace);
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRInputSourcesChangeEvent extends Event {
    constructor(type, eventInitDict) {
        super(type, eventInitDict);
        if (!eventInitDict.session) {
            throw new Error('XRInputSourcesChangeEventInit.session is required');
        }
        if (!eventInitDict.added) {
            throw new Error('XRInputSourcesChangeEventInit.added is required');
        }
        if (!eventInitDict.removed) {
            throw new Error('XRInputSourcesChangeEventInit.removed is required');
        }
        this.session = eventInitDict.session;
        this.added = eventInitDict.added;
        this.removed = eventInitDict.removed;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _a;
var XRReferenceSpaceType;
(function (XRReferenceSpaceType) {
    XRReferenceSpaceType["Viewer"] = "viewer";
    XRReferenceSpaceType["Local"] = "local";
    XRReferenceSpaceType["LocalFloor"] = "local-floor";
    XRReferenceSpaceType["BoundedFloor"] = "bounded-floor";
    XRReferenceSpaceType["Unbounded"] = "unbounded";
})(XRReferenceSpaceType || (XRReferenceSpaceType = {}));
class XRReferenceSpace extends XRSpace {
    constructor(type, parentSpace, offsetMatrix) {
        super(parentSpace, offsetMatrix);
        this[_a] = {
            type: null,
            onreset: () => { },
        };
        this[P_REF_SPACE].type = type;
    }
    get onreset() {
        var _b;
        return (_b = this[P_REF_SPACE].onreset) !== null && _b !== void 0 ? _b : (() => { });
    }
    set onreset(callback) {
        if (this[P_REF_SPACE].onreset) {
            this.removeEventListener('reset', this[P_REF_SPACE].onreset);
        }
        this[P_REF_SPACE].onreset = callback;
        if (callback) {
            this.addEventListener('reset', callback);
        }
    }
    // Create a new XRReferenceSpace with an offset from the current space
    getOffsetReferenceSpace(originOffset) {
        // Create a new XRReferenceSpace with the originOffset as its offsetMatrix
        // The new space's parent is set to 'this' (the current XRReferenceSpace)
        return new XRReferenceSpace(this[P_REF_SPACE].type, this, originOffset);
    }
}
_a = P_REF_SPACE;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRRenderState {
    constructor(init = {}, oldState) {
        this[P_RENDER_STATE] = {
            depthNear: init.depthNear || (oldState === null || oldState === void 0 ? void 0 : oldState.depthNear) || 0.1,
            depthFar: init.depthFar || (oldState === null || oldState === void 0 ? void 0 : oldState.depthFar) || 1000.0,
            inlineVerticalFieldOfView: init.inlineVerticalFieldOfView ||
                (oldState === null || oldState === void 0 ? void 0 : oldState.inlineVerticalFieldOfView) ||
                null,
            baseLayer: init.baseLayer || (oldState === null || oldState === void 0 ? void 0 : oldState.baseLayer) || null,
        };
    }
    get depthNear() {
        return this[P_RENDER_STATE].depthNear;
    }
    get depthFar() {
        return this[P_RENDER_STATE].depthFar;
    }
    get inlineVerticalFieldOfView() {
        return this[P_RENDER_STATE].inlineVerticalFieldOfView;
    }
    get baseLayer() {
        return this[P_RENDER_STATE].baseLayer;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRSessionEvent extends Event {
    constructor(type, eventInitDict) {
        super(type, eventInitDict);
        if (!eventInitDict.session) {
            throw new Error('XRSessionEventInit.session is required');
        }
        this.session = eventInitDict.session;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var XREye;
(function (XREye) {
    XREye["None"] = "none";
    XREye["Left"] = "left";
    XREye["Right"] = "right";
})(XREye || (XREye = {}));
class XRView {
    constructor(eye, projectionMatrix, transform, session) {
        this[P_VIEW] = {
            eye,
            projectionMatrix,
            transform,
            recommendedViewportScale: null,
            requestedViewportScale: 1.0,
            session,
        };
    }
    get eye() {
        return this[P_VIEW].eye;
    }
    get projectionMatrix() {
        return this[P_VIEW].projectionMatrix;
    }
    get transform() {
        return this[P_VIEW].transform;
    }
    get recommendedViewportScale() {
        return this[P_VIEW].recommendedViewportScale;
    }
    requestViewportScale(scale) {
        if (scale === null || scale <= 0 || scale > 1) {
            console.warn('Invalid scale value. Scale must be > 0 and <= 1.');
            return;
        }
        this[P_VIEW].requestedViewportScale = scale;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRPose {
    constructor(transform, emulatedPosition = false, linearVelocity = undefined, angularVelocity = undefined) {
        this[P_POSE] = {
            transform,
            emulatedPosition,
            linearVelocity,
            angularVelocity,
        };
    }
    get transform() {
        return this[P_POSE].transform;
    }
    get emulatedPosition() {
        return this[P_POSE].emulatedPosition;
    }
    get linearVelocity() {
        return this[P_POSE].linearVelocity;
    }
    get angularVelocity() {
        return this[P_POSE].angularVelocity;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRJointPose extends XRPose {
    constructor(transform, radius, emulatedPosition = false, linearVelocity = undefined, angularVelocity = undefined) {
        super(transform, emulatedPosition, linearVelocity, angularVelocity);
        this[P_JOINT_POSE] = { radius };
    }
    get radius() {
        return this[P_JOINT_POSE].radius;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRViewerPose extends XRPose {
    constructor(transform, views, emulatedPosition = false, linearVelocity = undefined, angularVelocity = undefined) {
        super(transform, emulatedPosition, linearVelocity, angularVelocity);
        this[P_VIEWER_POSE] = {
            views: Object.freeze(views),
        };
    }
    get views() {
        return this[P_VIEWER_POSE].views;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const spaceGlobalMatrix = create$5();
const baseSpaceGlobalMatrix = create$5();
const baseSpaceGlobalMatrixInverse = create$5();
const getOffsetMatrix = (offsetMatrix, space, baseSpace) => {
    XRSpaceUtils.calculateGlobalOffsetMatrix(space, spaceGlobalMatrix);
    XRSpaceUtils.calculateGlobalOffsetMatrix(baseSpace, baseSpaceGlobalMatrix);
    invert(baseSpaceGlobalMatrixInverse, baseSpaceGlobalMatrix);
    multiply$2(offsetMatrix, baseSpaceGlobalMatrixInverse, spaceGlobalMatrix);
};
class XRFrame {
    constructor(session, id, active, animationFrame, predictedDisplayTime) {
        this[P_FRAME] = {
            session,
            id,
            active,
            animationFrame,
            predictedDisplayTime,
            tempMat4: create$5(),
            detectedPlanes: new XRPlaneSet(),
            detectedMeshes: new XRMeshSet(),
            trackedAnchors: session[P_SESSION].frameTrackedAnchors,
            hitTestResultsMap: new Map(),
        };
    }
    get session() {
        return this[P_FRAME].session;
    }
    get predictedDisplayTime() {
        return this[P_FRAME].predictedDisplayTime;
    }
    getPose(space, baseSpace) {
        if (!this[P_FRAME].active) {
            throw new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError');
        }
        getOffsetMatrix(this[P_FRAME].tempMat4, space, baseSpace);
        const position = create$4();
        getTranslation(position, this[P_FRAME].tempMat4);
        const orientation = create$2();
        getRotation(orientation, this[P_FRAME].tempMat4);
        return new XRPose(new XRRigidTransform({ x: position[0], y: position[1], z: position[2], w: 1.0 }, {
            x: orientation[0],
            y: orientation[1],
            z: orientation[2],
            w: orientation[3],
        }), space[P_SPACE].emulated);
    }
    getViewerPose(referenceSpace) {
        if (!this[P_FRAME].animationFrame) {
            throw new DOMException('getViewerPose can only be called on XRFrame objects passed to XRSession.requestAnimationFrame callbacks.', 'InvalidStateError');
        }
        const session = this[P_FRAME].session;
        const device = session[P_SESSION].device;
        const pose = this.getPose(device.viewerSpace, referenceSpace);
        const eyes = session[P_SESSION].mode === 'inline'
            ? [XREye.None]
            : [XREye.Left, XREye.Right];
        const views = [];
        eyes.forEach((eye) => {
            const viewSpace = device.viewSpaces[eye];
            const viewPose = this.getPose(viewSpace, referenceSpace);
            const projectionMatrix = session[P_SESSION].getProjectionMatrix(eye);
            const view = new XRView(eye, new Float32Array(projectionMatrix), viewPose.transform, session);
            views.push(view);
        });
        return new XRViewerPose(pose.transform, views, false);
    }
    getJointPose(joint, baseSpace) {
        const xrPose = this.getPose(joint, baseSpace);
        const radius = joint[P_JOINT_SPACE].radius;
        return new XRJointPose(xrPose.transform, radius, false);
    }
    fillJointRadii(jointSpaces, radii) {
        // converting from sequence type to array
        jointSpaces = Array.from(jointSpaces);
        if (!this[P_FRAME].active) {
            throw new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError');
        }
        if (jointSpaces.length > radii.length) {
            throw new DOMException('The length of jointSpaces is larger than the number of elements in radii', 'TypeError');
        }
        let allValid = true;
        for (let offset = 0; offset < jointSpaces.length; offset++) {
            if (!jointSpaces[offset][P_JOINT_SPACE].radius) {
                radii[offset] = NaN;
                allValid = false;
            }
            else {
                radii[offset] = jointSpaces[offset][P_JOINT_SPACE].radius;
            }
        }
        return allValid;
    }
    fillPoses(spaces, baseSpace, transforms) {
        // converting from sequence type to array
        spaces = Array.from(spaces);
        if (!this[P_FRAME].active) {
            throw new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError');
        }
        if (spaces.length * 16 > transforms.length) {
            throw new DOMException('The length of spaces multiplied by 16 is larger than the number of elements in transforms', 'TypeError');
        }
        spaces.forEach((space, i) => {
            getOffsetMatrix(this[P_FRAME].tempMat4, space, baseSpace);
            for (let j = 0; j < 16; j++) {
                transforms[i * 16 + j] = this[P_FRAME].tempMat4[j];
            }
        });
        return true;
    }
    get detectedPlanes() {
        if (!this[P_FRAME].active) {
            throw new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError');
        }
        return this[P_FRAME].detectedPlanes;
    }
    get detectedMeshes() {
        if (!this[P_FRAME].active) {
            throw new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError');
        }
        return this[P_FRAME].detectedMeshes;
    }
    get trackedAnchors() {
        if (!this[P_FRAME].active) {
            throw new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError');
        }
        return this[P_FRAME].trackedAnchors;
    }
    createAnchor(pose, space) {
        return new Promise((resolve, reject) => {
            if (!this[P_FRAME].active) {
                reject(new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError'));
            }
            else {
                const globalSpace = this[P_FRAME].session[P_SESSION].device[P_DEVICE].globalSpace;
                const tempSpace = new XRSpace(space, pose.matrix);
                const globalOffsetMatrix = XRSpaceUtils.calculateGlobalOffsetMatrix(tempSpace);
                const anchorSpace = new XRSpace(globalSpace, globalOffsetMatrix);
                const anchor = new XRAnchor(anchorSpace, this[P_FRAME].session);
                this[P_FRAME].session[P_SESSION].trackedAnchors.add(anchor);
                this[P_FRAME].session[P_SESSION].newAnchors.set(anchor, {
                    resolve,
                    reject,
                });
            }
        });
    }
    getHitTestResults(hitTestSource) {
        if (!this[P_FRAME].active) {
            throw new DOMException('XRFrame access outside the callback that produced it is invalid.', 'InvalidStateError');
        }
        else if (!this[P_FRAME].hitTestResultsMap.has(hitTestSource)) {
            throw new DOMException('Requested hit test results are not available for current frame.', 'InvalidStateError');
        }
        else {
            return [...this[P_FRAME].hitTestResultsMap.get(hitTestSource)];
        }
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var XREnvironmentBlendMode;
(function (XREnvironmentBlendMode) {
    XREnvironmentBlendMode["Opaque"] = "opaque";
    XREnvironmentBlendMode["AlphaBlend"] = "alpha-blend";
    XREnvironmentBlendMode["Additive"] = "additive";
})(XREnvironmentBlendMode || (XREnvironmentBlendMode = {}));
var XRInteractionMode;
(function (XRInteractionMode) {
    XRInteractionMode["ScreenSpace"] = "screen-space";
    XRInteractionMode["WorldSpace"] = "world-space";
})(XRInteractionMode || (XRInteractionMode = {}));
class XRSession extends EventTarget {
    constructor(device, mode, enabledFeatures) {
        super();
        this[P_SESSION] = {
            device,
            mode,
            renderState: new XRRenderState(),
            pendingRenderState: null,
            enabledFeatures: enabledFeatures,
            isSystemKeyboardSupported: false,
            ended: false,
            projectionMatrices: {
                [XREye.Left]: create$5(),
                [XREye.Right]: create$5(),
                [XREye.None]: create$5(),
            },
            getProjectionMatrix: (eye) => {
                return this[P_SESSION].projectionMatrices[eye];
            },
            referenceSpaceIsSupported: (referenceSpaceType) => {
                if (!this[P_SESSION].enabledFeatures.includes(referenceSpaceType)) {
                    return false;
                }
                switch (referenceSpaceType) {
                    case XRReferenceSpaceType.Viewer:
                        return true;
                    case XRReferenceSpaceType.Local:
                    case XRReferenceSpaceType.LocalFloor:
                    case XRReferenceSpaceType.BoundedFloor:
                    case XRReferenceSpaceType.Unbounded:
                        return this[P_SESSION].mode != 'inline';
                }
            },
            frameHandle: 0,
            frameCallbacks: [],
            currentFrameCallbacks: null,
            onDeviceFrame: () => {
                if (this[P_SESSION].ended) {
                    return;
                }
                this[P_SESSION].deviceFrameHandle = globalThis.requestAnimationFrame(this[P_SESSION].onDeviceFrame);
                if (this[P_SESSION].pendingRenderState != null) {
                    this[P_SESSION].renderState = this[P_SESSION].pendingRenderState;
                    this[P_SESSION].pendingRenderState = null;
                    this[P_SESSION].device[P_DEVICE].onBaseLayerSet(this[P_SESSION].renderState.baseLayer);
                }
                const baseLayer = this[P_SESSION].renderState.baseLayer;
                if (baseLayer === null) {
                    return;
                }
                const context = baseLayer.context;
                const canvas = context.canvas;
                /**
                 * This code snippet is designed to clear the buffers attached to an opaque framebuffer
                 * at the beginning of each XR animation frame, but it only applies to immersive XR sessions.
                 * The process is as follows:
                 *
                 * 1. Check if the session is immersive: It verifies if `session.immersive` is true.
                 *    This ensures that the buffer clearing operations are only performed for immersive
                 *    sessions, which have exclusive access to the XR device's display.
                 *
                 * 2. Save current clear values: The current clear values for the color, depth, and
                 *    stencil buffers are stored. These values need to be restored after clearing the
                 *    buffers to maintain the application's rendering state as expected.
                 *
                 * 3. Set clear values to defaults: The clear color is set to transparent black, the
                 *    clear depth to the maximum depth value (1.0), and the clear stencil to 0. This
                 *    ensures that the buffers are reset to a known state, free from any residual data.
                 *
                 * 4. Clear the buffers: The depth, color, and stencil buffers are cleared, removing
                 *    any content from previous frames and preparing them for new rendering operations.
                 *
                 * 5. Restore previous clear values: The original clear values are reinstated to return
                 *    the WebGL context to its state prior to this operation, allowing subsequent rendering
                 *    to proceed without interference.
                 *
                 * This clearing process is crucial for some XR devices to function correctly and to
                 * prevent rendering artifacts from past frames. It ensures that each new frame starts
                 * with a clean slate.
                 */
                if (this[P_SESSION].mode != 'inline') {
                    const currentClearColor = context.getParameter(context.COLOR_CLEAR_VALUE);
                    const currentClearDepth = context.getParameter(context.DEPTH_CLEAR_VALUE);
                    const currentClearStencil = context.getParameter(context.STENCIL_CLEAR_VALUE);
                    context.clearColor(0.0, 0.0, 0.0, 0.0);
                    context.clearDepth(1);
                    context.clearStencil(0.0);
                    context.clear(context.DEPTH_BUFFER_BIT |
                        context.COLOR_BUFFER_BIT |
                        context.STENCIL_BUFFER_BIT);
                    context.clearColor(currentClearColor[0], currentClearColor[1], currentClearColor[2], currentClearColor[3]);
                    context.clearDepth(currentClearDepth);
                    context.clearStencil(currentClearStencil);
                }
                // Calculate projection matrices
                const { depthNear, depthFar } = this[P_SESSION].renderState;
                const { width, height } = canvas;
                if (this[P_SESSION].mode !== 'inline') {
                    const aspect = (width * (this[P_SESSION].device.stereoEnabled ? 0.5 : 1.0)) /
                        height;
                    perspective(this[P_SESSION].projectionMatrices[XREye.Left], this[P_SESSION].device.fovy, aspect, depthNear, depthFar);
                    copy$3(this[P_SESSION].projectionMatrices[XREye.Right], this[P_SESSION].projectionMatrices[XREye.Left]);
                }
                else {
                    const aspect = width / height;
                    perspective(this[P_SESSION].projectionMatrices[XREye.None], this[P_SESSION].renderState.inlineVerticalFieldOfView, aspect, depthNear, depthFar);
                }
                const frame = new XRFrame(this, this[P_SESSION].frameHandle, true, true, performance.now());
                const time = performance.now();
                const devui = this[P_SESSION].device[P_DEVICE].devui;
                if (devui) {
                    devui.render(time);
                }
                if (this[P_SESSION].mode === 'immersive-ar') {
                    const sem = this[P_SESSION].device[P_DEVICE].sem;
                    if (sem) {
                        sem.render(time);
                    }
                }
                if (this[P_SESSION].enabledFeatures.includes('anchors')) {
                    this[P_SESSION].updateTrackedAnchors();
                }
                if (this[P_SESSION].enabledFeatures.includes('plane-detection')) {
                    this[P_SESSION].updateTrackedPlanes(frame);
                }
                if (this[P_SESSION].enabledFeatures.includes('mesh-detection')) {
                    this[P_SESSION].updateTrackedMeshes(frame);
                }
                if (this[P_SESSION].enabledFeatures.includes('hit-test')) {
                    this[P_SESSION].computeHitTestResults(frame);
                }
                this[P_SESSION].device[P_DEVICE].onFrameStart(frame);
                this[P_SESSION].updateActiveInputSources();
                /*
                 * For each entry in callbacks, in order:
                 * - If the entry’s cancelled boolean is true, continue to the next entry.
                 * - Invoke the Web IDL callback function, passing now and frame as the arguments.
                 * - If an exception is thrown, report the exception.
                 */
                // - Let callbacks be a list of the entries in session’s list of animation frame
                //   callback, in the order in which they were added to the list.
                const callbacks = (this[P_SESSION].currentFrameCallbacks =
                    this[P_SESSION].frameCallbacks);
                // - Set session’s list of animation frame callbacks to the empty list.
                this[P_SESSION].frameCallbacks = [];
                const rightNow = performance.now();
                for (let i = 0; i < callbacks.length; i++) {
                    try {
                        if (!callbacks[i].cancelled) {
                            callbacks[i].callback(rightNow, frame);
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                this[P_SESSION].currentFrameCallbacks = null;
                // - Set frame’s active boolean to false.
                frame[P_FRAME].active = false;
            },
            nominalFrameRate: device.internalNominalFrameRate,
            referenceSpaces: [],
            inputSourceArray: [],
            activeInputSources: [],
            updateActiveInputSources: () => {
                const handTrackingOn = this[P_SESSION].enabledFeatures.includes('hand-tracking');
                const prevInputs = this[P_SESSION].activeInputSources;
                const currInputs = this[P_SESSION].device.inputSources.filter((inputSource) => !inputSource.hand || handTrackingOn);
                const added = currInputs.filter((item) => !prevInputs.includes(item));
                const removed = prevInputs.filter((item) => !currInputs.includes(item));
                this[P_SESSION].activeInputSources = currInputs;
                if (added.length > 0 || removed.length > 0) {
                    this.dispatchEvent(new XRInputSourcesChangeEvent('inputsourceschange', {
                        session: this,
                        added,
                        removed,
                    }));
                }
            },
            trackedAnchors: new XRAnchorSet(),
            persistentAnchors: new Map(),
            newAnchors: new Map(),
            frameTrackedAnchors: new XRAnchorSet(),
            updateTrackedAnchors: () => {
                if (this[P_SESSION].enabledFeatures.includes('anchors')) {
                    this[P_SESSION].frameTrackedAnchors.clear();
                    Array.from(this[P_SESSION].trackedAnchors).forEach((anchor) => {
                        if (anchor[P_ANCHOR].deleted) {
                            this[P_SESSION].trackedAnchors.delete(anchor);
                            if (this[P_SESSION].newAnchors.has(anchor)) {
                                const { reject } = this[P_SESSION].newAnchors.get(anchor);
                                reject(new DOMException('Anchor is no longer tracked', 'InvalidStateError'));
                            }
                        }
                        else {
                            this[P_SESSION].frameTrackedAnchors.add(anchor);
                            if (this[P_SESSION].newAnchors.has(anchor)) {
                                const { resolve } = this[P_SESSION].newAnchors.get(anchor);
                                resolve(anchor);
                                this[P_SESSION].newAnchors.delete(anchor);
                            }
                        }
                    });
                }
            },
            trackedPlanes: new Map(),
            updateTrackedPlanes: (frame) => {
                const sem = this[P_SESSION].device[P_DEVICE].sem;
                if (!sem) {
                    return;
                }
                const trackedPlanes = Array.from(this[P_SESSION].trackedPlanes.keys());
                trackedPlanes.forEach((plane) => {
                    if (!sem.trackedPlanes.has(plane)) {
                        this[P_SESSION].trackedPlanes.delete(plane);
                    }
                });
                sem.trackedPlanes.forEach((plane) => {
                    let xrPlane = this[P_SESSION].trackedPlanes.get(plane);
                    if (!xrPlane) {
                        const planeSpace = new XRSpace(this[P_SESSION].device[P_DEVICE].globalSpace, plane.transform.matrix);
                        xrPlane = new XRPlane(plane, planeSpace, plane.polygon, plane.semanticLabel);
                        this[P_SESSION].trackedPlanes.set(plane, xrPlane);
                    }
                    xrPlane[P_PLANE].lastChangedTime = frame.predictedDisplayTime;
                    xrPlane[P_PLANE].frame = frame;
                    frame[P_FRAME].detectedPlanes.add(xrPlane);
                });
            },
            trackedMeshes: new Map(),
            updateTrackedMeshes: (frame) => {
                const sem = this[P_SESSION].device[P_DEVICE].sem;
                if (!sem) {
                    return;
                }
                const trackedMeshes = Array.from(this[P_SESSION].trackedMeshes.keys());
                trackedMeshes.forEach((mesh) => {
                    if (!sem.trackedMeshes.has(mesh)) {
                        this[P_SESSION].trackedMeshes.delete(mesh);
                    }
                });
                sem.trackedMeshes.forEach((mesh) => {
                    let xrMesh = this[P_SESSION].trackedMeshes.get(mesh);
                    if (!xrMesh) {
                        const meshSpace = new XRSpace(this[P_SESSION].device[P_DEVICE].globalSpace, mesh.transform.matrix);
                        xrMesh = new XRMesh(mesh, meshSpace, mesh.vertices, mesh.indices, mesh.semanticLabel);
                        this[P_SESSION].trackedMeshes.set(mesh, xrMesh);
                    }
                    xrMesh[P_MESH].lastChangedTime = frame.predictedDisplayTime;
                    xrMesh[P_MESH].frame = frame;
                    frame[P_FRAME].detectedMeshes.add(xrMesh);
                });
            },
            hitTestSources: new Set(),
            computeHitTestResults: (frame) => {
                const sem = this[P_SESSION].device[P_DEVICE].sem;
                if (!sem)
                    return;
                const globalSpace = this[P_SESSION].device[P_DEVICE].globalSpace;
                this[P_SESSION].hitTestSources.forEach((hitTestSource) => {
                    const sourceSpace = hitTestSource[P_HIT_TEST].space;
                    const sourceGlobalOffset = XRSpaceUtils.calculateGlobalOffsetMatrix(sourceSpace);
                    const rayLocalOffset = hitTestSource[P_HIT_TEST].offsetRay.matrix;
                    const rayGlobalOffset = create$5();
                    multiply$2(rayGlobalOffset, sourceGlobalOffset, rayLocalOffset);
                    const hitTestResults = [];
                    sem.computeHitTestResults(rayGlobalOffset).forEach((matrix) => {
                        const offsetSpace = new XRSpace(globalSpace, matrix);
                        const hitTestResult = new XRHitTestResult(frame, offsetSpace);
                        hitTestResults.push(hitTestResult);
                    });
                    frame[P_FRAME].hitTestResultsMap.set(hitTestSource, hitTestResults);
                });
            },
            onend: null,
            oninputsourceschange: null,
            onselect: null,
            onselectstart: null,
            onselectend: null,
            onsqueeze: null,
            onsqueezestart: null,
            onsqueezeend: null,
            onvisibilitychange: null,
            onframeratechange: null,
        };
        XRAnchorUtils.recoverPersistentAnchorsFromStorage(this);
        // start the frameloop
        this[P_SESSION].onDeviceFrame();
    }
    get visibilityState() {
        return this[P_SESSION].device.visibilityState;
    }
    get frameRate() {
        return this[P_SESSION].nominalFrameRate;
    }
    get supportedFrameRates() {
        return new Float32Array(this[P_SESSION].device.supportedFrameRates);
    }
    get renderState() {
        return this[P_SESSION].renderState;
    }
    get inputSources() {
        // use the same array object
        this[P_SESSION].inputSourceArray.length = 0;
        if (!this[P_SESSION].ended && this[P_SESSION].mode !== 'inline') {
            this[P_SESSION].inputSourceArray.push(...this[P_SESSION].activeInputSources);
        }
        return this[P_SESSION].inputSourceArray;
    }
    get enabledFeatures() {
        return this[P_SESSION].enabledFeatures;
    }
    get isSystemKeyboardSupported() {
        return this[P_SESSION].isSystemKeyboardSupported;
    }
    get environmentBlendMode() {
        var _a;
        return ((_a = this[P_SESSION].device[P_DEVICE].environmentBlendModes[this[P_SESSION].mode]) !== null && _a !== void 0 ? _a : XREnvironmentBlendMode.Opaque);
    }
    get interactionMode() {
        return this[P_SESSION].device[P_DEVICE].interactionMode;
    }
    updateRenderState(state = {}) {
        var _a, _b, _c, _d;
        if (this[P_SESSION].ended) {
            throw new DOMException('XRSession has already ended.', 'InvalidStateError');
        }
        if (state.baseLayer && state.baseLayer[P_WEBGL_LAYER].session !== this) {
            throw new DOMException('Base layer was created by a different XRSession', 'InvalidStateError');
        }
        if (state.inlineVerticalFieldOfView != null &&
            this[P_SESSION].mode !== 'inline') {
            throw new DOMException('InlineVerticalFieldOfView must not be set for an immersive session', 'InvalidStateError');
        }
        const compoundStateInit = {
            baseLayer: state.baseLayer ||
                ((_a = this[P_SESSION].pendingRenderState) === null || _a === void 0 ? void 0 : _a.baseLayer) ||
                undefined,
            depthFar: state.depthFar ||
                ((_b = this[P_SESSION].pendingRenderState) === null || _b === void 0 ? void 0 : _b.depthFar) ||
                undefined,
            depthNear: state.depthNear ||
                ((_c = this[P_SESSION].pendingRenderState) === null || _c === void 0 ? void 0 : _c.depthNear) ||
                undefined,
            inlineVerticalFieldOfView: state.inlineVerticalFieldOfView ||
                ((_d = this[P_SESSION].pendingRenderState) === null || _d === void 0 ? void 0 : _d.inlineVerticalFieldOfView) ||
                undefined,
        };
        this[P_SESSION].pendingRenderState = new XRRenderState(compoundStateInit, this[P_SESSION].renderState);
    }
    // the nominal frame rate updates are emulated, no actual update to the
    // display frame rate of the device will be executed
    async updateTargetFrameRate(rate) {
        return new Promise((resolve, reject) => {
            if (this[P_SESSION].ended) {
                reject(new DOMException('XRSession has already ended.', 'InvalidStateError'));
            }
            else if (!this[P_SESSION].device.supportedFrameRates.includes(rate)) {
                reject(new DOMException('Requested frame rate not supported.', 'InvalidStateError'));
            }
            else {
                if (this[P_SESSION].nominalFrameRate === rate) {
                    console.log(`Requested frame rate is the same as the current nominal frame rate, no update made`);
                }
                else {
                    this[P_SESSION].nominalFrameRate = rate;
                    this.dispatchEvent(new XRSessionEvent('frameratechange', { session: this }));
                    console.log(`Nominal frame rate updated to ${rate}`);
                }
                resolve();
            }
        });
    }
    async requestReferenceSpace(type) {
        return new Promise((resolve, reject) => {
            if (this[P_SESSION].ended ||
                !this[P_SESSION].referenceSpaceIsSupported(type)) {
                reject(new DOMException('The requested reference space type is not supported.', 'NotSupportedError'));
                return;
            }
            let referenceSpace;
            switch (type) {
                case XRReferenceSpaceType.Viewer:
                    referenceSpace = this[P_SESSION].device.viewerSpace;
                    break;
                case XRReferenceSpaceType.Local:
                    // creating an XRReferenceSpace with the current headset transform in global space
                    referenceSpace = new XRReferenceSpace(type, this[P_SESSION].device[P_DEVICE].globalSpace, this[P_SESSION].device.viewerSpace[P_SPACE].offsetMatrix);
                    break;
                case XRReferenceSpaceType.LocalFloor:
                case XRReferenceSpaceType.BoundedFloor:
                case XRReferenceSpaceType.Unbounded:
                    // TO-DO: add boundary geometry for bounded-floor
                    referenceSpace = new XRReferenceSpace(type, this[P_SESSION].device[P_DEVICE].globalSpace);
                    break;
            }
            this[P_SESSION].referenceSpaces.push(referenceSpace);
            resolve(referenceSpace);
        });
    }
    requestAnimationFrame(callback) {
        if (this[P_SESSION].ended) {
            return 0;
        }
        const frameHandle = ++this[P_SESSION].frameHandle;
        this[P_SESSION].frameCallbacks.push({
            handle: frameHandle,
            callback,
            cancelled: false,
        });
        return frameHandle;
    }
    cancelAnimationFrame(handle) {
        // Remove the callback with that handle from the queue
        let callbacks = this[P_SESSION].frameCallbacks;
        let index = callbacks.findIndex((d) => d && d.handle === handle);
        if (index > -1) {
            callbacks[index].cancelled = true;
            callbacks.splice(index, 1);
        }
        // If cancelAnimationFrame is called from within a frame callback, also check
        // the remaining callbacks for the current frame:
        callbacks = this[P_SESSION].currentFrameCallbacks;
        if (callbacks) {
            index = callbacks.findIndex((d) => d && d.handle === handle);
            if (index > -1) {
                callbacks[index].cancelled = true;
                // Rely on cancelled flag only; don't mutate this array while it's being iterated
            }
        }
    }
    async end() {
        return new Promise((resolve, reject) => {
            if (this[P_SESSION].ended || this[P_SESSION].deviceFrameHandle === null) {
                reject(new DOMException('XRSession has already ended.', 'InvalidStateError'));
            }
            else {
                globalThis.cancelAnimationFrame(this[P_SESSION].deviceFrameHandle);
                this[P_SESSION].device[P_DEVICE].onSessionEnd();
                this.dispatchEvent(new XRSessionEvent('end', { session: this }));
                resolve();
            }
        });
    }
    // anchors
    get persistentAnchors() {
        return Array.from(this[P_SESSION].persistentAnchors.keys());
    }
    restorePersistentAnchor(uuid) {
        return new Promise((resolve, reject) => {
            if (!this[P_SESSION].persistentAnchors.has(uuid)) {
                reject(new DOMException(`Persistent anchor with uuid ${uuid} not found.`, 'InvalidStateError'));
            }
            else if (this[P_SESSION].ended) {
                reject(new DOMException('XRSession has already ended.', 'InvalidStateError'));
            }
            else {
                const anchor = this[P_SESSION].persistentAnchors.get(uuid);
                if (this[P_SESSION].newAnchors.has(anchor)) {
                    reject(new DOMException(`Multiple concurrent attempts detected to restore the anchor with UUID: ${uuid}.`, 'InvalidStateError'));
                }
                else {
                    this[P_SESSION].trackedAnchors.add(anchor);
                    this[P_SESSION].newAnchors.set(anchor, { resolve, reject });
                }
            }
        });
    }
    deletePersistentAnchor(uuid) {
        return new Promise((resolve, reject) => {
            if (!this[P_SESSION].persistentAnchors.has(uuid)) {
                reject(new DOMException(`Persistent anchor with uuid ${uuid} not found.`, 'InvalidStateError'));
            }
            else {
                const anchor = this[P_SESSION].persistentAnchors.get(uuid);
                this[P_SESSION].persistentAnchors.delete(uuid);
                anchor.delete();
                resolve(undefined);
            }
        });
    }
    requestHitTestSource(options) {
        return new Promise((resolve, reject) => {
            if (!this[P_SESSION].enabledFeatures.includes('hit-test')) {
                reject(new DOMException(`WebXR feature "hit-test" is not supported by current session`, 'NotSupportedError'));
            }
            else if (this[P_SESSION].ended) {
                reject(new DOMException('XRSession has already ended.', 'InvalidStateError'));
            }
            else if (!this[P_SESSION].device[P_DEVICE].sem) {
                reject(new DOMException('Synthethic Environment Module required for emulating hit-test', 'OperationError'));
            }
            else {
                const xrHitTestSource = new XRHitTestSource(this, options);
                this[P_SESSION].hitTestSources.add(xrHitTestSource);
                resolve(xrHitTestSource);
            }
        });
    }
    // events
    get onend() {
        var _a;
        return (_a = this[P_SESSION].onend) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onend(callback) {
        if (this[P_SESSION].onend) {
            this.removeEventListener('end', this[P_SESSION].onend);
        }
        this[P_SESSION].onend = callback;
        if (callback) {
            this.addEventListener('end', callback);
        }
    }
    get oninputsourceschange() {
        var _a;
        return (_a = this[P_SESSION].oninputsourceschange) !== null && _a !== void 0 ? _a : (() => { });
    }
    set oninputsourceschange(callback) {
        if (this[P_SESSION].oninputsourceschange) {
            this.removeEventListener('inputsourceschange', this[P_SESSION].oninputsourceschange);
        }
        this[P_SESSION].oninputsourceschange = callback;
        if (callback) {
            this.addEventListener('inputsourceschange', callback);
        }
    }
    get onselect() {
        var _a;
        return (_a = this[P_SESSION].onselect) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onselect(callback) {
        if (this[P_SESSION].onselect) {
            this.removeEventListener('select', this[P_SESSION].onselect);
        }
        this[P_SESSION].onselect = callback;
        if (callback) {
            this.addEventListener('select', callback);
        }
    }
    get onselectstart() {
        var _a;
        return (_a = this[P_SESSION].onselectstart) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onselectstart(callback) {
        if (this[P_SESSION].onselectstart) {
            this.removeEventListener('selectstart', this[P_SESSION].onselectstart);
        }
        this[P_SESSION].onselectstart = callback;
        if (callback) {
            this.addEventListener('selectstart', callback);
        }
    }
    get onselectend() {
        var _a;
        return (_a = this[P_SESSION].onselectend) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onselectend(callback) {
        if (this[P_SESSION].onselectend) {
            this.removeEventListener('selectend', this[P_SESSION].onselectend);
        }
        this[P_SESSION].onselectend = callback;
        if (callback) {
            this.addEventListener('selectend', callback);
        }
    }
    get onsqueeze() {
        var _a;
        return (_a = this[P_SESSION].onsqueeze) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onsqueeze(callback) {
        if (this[P_SESSION].onsqueeze) {
            this.removeEventListener('squeeze', this[P_SESSION].onsqueeze);
        }
        this[P_SESSION].onsqueeze = callback;
        if (callback) {
            this.addEventListener('squeeze', callback);
        }
    }
    get onsqueezestart() {
        var _a;
        return (_a = this[P_SESSION].onsqueezestart) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onsqueezestart(callback) {
        if (this[P_SESSION].onsqueezestart) {
            this.removeEventListener('squeezestart', this[P_SESSION].onsqueezestart);
        }
        this[P_SESSION].onsqueezestart = callback;
        if (callback) {
            this.addEventListener('squeezestart', callback);
        }
    }
    get onsqueezeend() {
        var _a;
        return (_a = this[P_SESSION].onsqueezeend) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onsqueezeend(callback) {
        if (this[P_SESSION].onsqueezeend) {
            this.removeEventListener('squeezeend', this[P_SESSION].onsqueezeend);
        }
        this[P_SESSION].onsqueezeend = callback;
        if (callback) {
            this.addEventListener('squeezeend', callback);
        }
    }
    get onvisibilitychange() {
        var _a;
        return (_a = this[P_SESSION].onvisibilitychange) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onvisibilitychange(callback) {
        if (this[P_SESSION].onvisibilitychange) {
            this.removeEventListener('visibilitychange', this[P_SESSION].onvisibilitychange);
        }
        this[P_SESSION].onvisibilitychange = callback;
        if (callback) {
            this.addEventListener('visibilitychange', callback);
        }
    }
    get onframeratechange() {
        var _a;
        return (_a = this[P_SESSION].onframeratechange) !== null && _a !== void 0 ? _a : (() => { });
    }
    set onframeratechange(callback) {
        if (this[P_SESSION].onframeratechange) {
            this.removeEventListener('frameratechange', this[P_SESSION].onframeratechange);
        }
        this[P_SESSION].onframeratechange = callback;
        if (callback) {
            this.addEventListener('frameratechange', callback);
        }
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var XRHandJoint;
(function (XRHandJoint) {
    XRHandJoint["Wrist"] = "wrist";
    XRHandJoint["ThumbMetacarpal"] = "thumb-metacarpal";
    XRHandJoint["ThumbPhalanxProximal"] = "thumb-phalanx-proximal";
    XRHandJoint["ThumbPhalanxDistal"] = "thumb-phalanx-distal";
    XRHandJoint["ThumbTip"] = "thumb-tip";
    XRHandJoint["IndexFingerMetacarpal"] = "index-finger-metacarpal";
    XRHandJoint["IndexFingerPhalanxProximal"] = "index-finger-phalanx-proximal";
    XRHandJoint["IndexFingerPhalanxIntermediate"] = "index-finger-phalanx-intermediate";
    XRHandJoint["IndexFingerPhalanxDistal"] = "index-finger-phalanx-distal";
    XRHandJoint["IndexFingerTip"] = "index-finger-tip";
    XRHandJoint["MiddleFingerMetacarpal"] = "middle-finger-metacarpal";
    XRHandJoint["MiddleFingerPhalanxProximal"] = "middle-finger-phalanx-proximal";
    XRHandJoint["MiddleFingerPhalanxIntermediate"] = "middle-finger-phalanx-intermediate";
    XRHandJoint["MiddleFingerPhalanxDistal"] = "middle-finger-phalanx-distal";
    XRHandJoint["MiddleFingerTip"] = "middle-finger-tip";
    XRHandJoint["RingFingerMetacarpal"] = "ring-finger-metacarpal";
    XRHandJoint["RingFingerPhalanxProximal"] = "ring-finger-phalanx-proximal";
    XRHandJoint["RingFingerPhalanxIntermediate"] = "ring-finger-phalanx-intermediate";
    XRHandJoint["RingFingerPhalanxDistal"] = "ring-finger-phalanx-distal";
    XRHandJoint["RingFingerTip"] = "ring-finger-tip";
    XRHandJoint["PinkyFingerMetacarpal"] = "pinky-finger-metacarpal";
    XRHandJoint["PinkyFingerPhalanxProximal"] = "pinky-finger-phalanx-proximal";
    XRHandJoint["PinkyFingerPhalanxIntermediate"] = "pinky-finger-phalanx-intermediate";
    XRHandJoint["PinkyFingerPhalanxDistal"] = "pinky-finger-phalanx-distal";
    XRHandJoint["PinkyFingerTip"] = "pinky-finger-tip";
})(XRHandJoint || (XRHandJoint = {}));
class XRHand extends Map {
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRJointSpace extends XRSpace {
    constructor(jointName, parentSpace, offsetMatrix) {
        super(parentSpace, offsetMatrix);
        this[P_JOINT_SPACE] = { jointName, radius: 0 };
    }
    get jointName() {
        return this[P_JOINT_SPACE].jointName;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const pinchHandPose = {
    jointTransforms: {
        wrist: {
            offsetMatrix: [
                0.9060805439949036, -0.1844543218612671, 0.3807799518108368, 0,
                -0.08027800172567368, 0.8086723685264587, 0.5827555656433105, 0,
                -0.4154181182384491, -0.5585917234420776, 0.7179155349731445, 0,
                -0.06867414712905884, -0.009423808194696903, 0.10627774149179459, 1,
            ],
            radius: 0.021460847929120064,
        },
        'thumb-metacarpal': {
            offsetMatrix: [
                -0.5012241005897522, -0.8650535345077515, -0.0213695727288723, 0,
                0.7415963411331177, -0.4421543478965759, 0.5045139193534851, 0,
                -0.44587990641593933, 0.23702676594257355, 0.8631392121315002, 0,
                -0.032122574746608734, -0.01196830440312624, 0.07194234430789948, 1,
            ],
            radius: 0.019382517784833908,
        },
        'thumb-phalanx-proximal': {
            offsetMatrix: [
                -0.3175753057003021, -0.9460570216178894, -0.06419729441404343, 0,
                0.8958902955055237, -0.32153913378715515, 0.30658137798309326, 0,
                -0.3106854259967804, 0.03984907269477844, 0.9496771097183228, 0,
                -0.017625702545046806, -0.01967475935816765, 0.04387917369604111, 1,
            ],
            radius: 0.01228295173496008,
        },
        'thumb-phalanx-distal': {
            offsetMatrix: [
                -0.4944636821746826, -0.8691971898078918, 0.001086252392269671, 0,
                0.8307800889015198, -0.4722411036491394, 0.2946045398712158, 0,
                -0.25555649399757385, 0.14657381176948547, 0.9556186199188232, 0,
                -0.007126678712666035, -0.021021386608481407, 0.011786630377173424, 1,
            ],
            radius: 0.009768804535269737,
        },
        'thumb-tip': {
            offsetMatrix: [
                -0.4944636821746826, -0.8691971898078918, 0.001086252392269671, 0,
                0.8307800889015198, -0.4722411036491394, 0.2946045398712158, 0,
                -0.25555649399757385, 0.14657381176948547, 0.9556186199188232, 0,
                0.0003423091256991029, -0.024528030306100845, -0.011410919018089771, 1,
            ],
            radius: 0.008768804371356964,
        },
        'index-finger-metacarpal': {
            offsetMatrix: [
                0.9060805439949036, -0.1844543218612671, 0.3807799518108368, 0,
                -0.08027800172567368, 0.8086723685264587, 0.5827555656433105, 0,
                -0.4154181182384491, -0.5585917234420776, 0.7179155349731445, 0,
                -0.038037415593862534, -0.0020236473064869642, 0.07626739144325256, 1,
            ],
            radius: 0.021228281781077385,
        },
        'index-finger-phalanx-proximal': {
            offsetMatrix: [
                0.7986818552017212, -0.35985732078552246, 0.48229536414146423, 0,
                0.538311243057251, 0.7854709625244141, -0.30537736415863037, 0,
                -0.2689369022846222, 0.5035246014595032, 0.8210577368736267, 0,
                -0.006869405973702669, 0.033938243985176086, 0.04206443578004837, 1,
            ],
            radius: 0.010295259766280651,
        },
        'index-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.8285930156707764, -0.32672837376594543, 0.4546217918395996, 0,
                0.5577570199966431, 0.4116027057170868, -0.7207564115524292, 0,
                0.04836784675717354, 0.8507823944091797, 0.5232869386672974, 0,
                0.0033306588884443045, 0.014840902760624886, 0.010923954658210278, 1,
            ],
            radius: 0.00853810179978609,
        },
        'index-finger-phalanx-distal': {
            offsetMatrix: [
                0.8412464261054993, -0.35794928669929504, 0.4051857888698578, 0,
                0.5139996409416199, 0.29711154103279114, -0.8046918511390686, 0,
                0.16765329241752625, 0.8852096796035767, 0.4339304566383362, 0,
                0.0021551470272243023, -0.0058362227864563465, -0.0017938464879989624,
                1,
            ],
            radius: 0.007636196445673704,
        },
        'index-finger-tip': {
            offsetMatrix: [
                0.8412464261054993, -0.35794928669929504, 0.4051857888698578, 0,
                0.5139996409416199, 0.29711154103279114, -0.8046918511390686, 0,
                0.16765329241752625, 0.8852096796035767, 0.4339304566383362, 0,
                -0.00131594471167773, -0.025222131982445717, -0.012442642822861671, 1,
            ],
            radius: 0.006636196281760931,
        },
        'middle-finger-metacarpal': {
            offsetMatrix: [
                0.9060805439949036, -0.1844543218612671, 0.3807799518108368, 0,
                -0.08027800172567368, 0.8086723685264587, 0.5827555656433105, 0,
                -0.4154181182384491, -0.5585917234420776, 0.7179155349731445, 0,
                -0.05395089089870453, 0.003063359996303916, 0.07402937114238739, 1,
            ],
            radius: 0.021231964230537415,
        },
        'middle-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9187911748886108, -0.1530158370733261, 0.36387869715690613, 0,
                0.038666240870952606, 0.9522662162780762, 0.302808940410614, 0,
                -0.3928440511226654, -0.26414817571640015, 0.8808513283729553, 0,
                -0.02717282809317112, 0.04162866622209549, 0.03678669035434723, 1,
            ],
            radius: 0.01117393933236599,
        },
        'middle-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9228746294975281, -0.12856416404247284, 0.36300456523895264, 0,
                0.14524033665657043, 0.9892153143882751, -0.01890045404434204, 0,
                -0.3566599190235138, 0.07016586512327194, 0.9315956234931946, 0,
                -0.01030921470373869, 0.05296773463487625, -0.0010256498353555799, 1,
            ],
            radius: 0.008030958473682404,
        },
        'middle-finger-phalanx-distal': {
            offsetMatrix: [
                0.9325166344642639, -0.040404170751571655, 0.35885775089263916, 0,
                0.06836572289466858, 0.995502769947052, -0.0655682161450386, 0,
                -0.3545948565006256, 0.08567725121974945, 0.9310863614082336, 0,
                -0.0004833847051486373, 0.05103470757603645, -0.026690717786550522, 1,
            ],
            radius: 0.007629410829395056,
        },
        'middle-finger-tip': {
            offsetMatrix: [
                0.9325166344642639, -0.040404170751571655, 0.35885775089263916, 0,
                0.06836572289466858, 0.995502769947052, -0.0655682161450386, 0,
                -0.3545948565006256, 0.08567725121974945, 0.9310863614082336, 0,
                0.008158999495208263, 0.05004044249653816, -0.050120558589696884, 1,
            ],
            radius: 0.006629410665482283,
        },
        'ring-finger-metacarpal': {
            offsetMatrix: [
                0.9060805439949036, -0.1844543218612671, 0.3807799518108368, 0,
                -0.08027800172567368, 0.8086723685264587, 0.5827555656433105, 0,
                -0.4154181182384491, -0.5585917234420776, 0.7179155349731445, 0,
                -0.06732909381389618, 0.007902119308710098, 0.07209732383489609, 1,
            ],
            radius: 0.019088275730609894,
        },
        'ring-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9391821026802063, -0.027994679287075996, 0.34227466583251953, 0,
                -0.18282271921634674, 0.8029410243034363, 0.5673282742500305, 0,
                -0.2907087206840515, -0.5954000353813171, 0.7489906549453735, 0,
                -0.047129884362220764, 0.03806127607822418, 0.032147664576768875, 1,
            ],
            radius: 0.00992213748395443,
        },
        'ring-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9249380826950073, 0.03699534013867378, 0.3783116042613983, 0,
                -0.12898847460746765, 0.9667453765869141, 0.2208271026611328, 0,
                -0.3575615882873535, -0.25304901599884033, 0.8989526629447937, 0,
                -0.03579339757561684, 0.06127955764532089, 0.002939916681498289, 1,
            ],
            radius: 0.007611672393977642,
        },
        'ring-finger-phalanx-distal': {
            offsetMatrix: [
                0.9001164436340332, 0.03983335196971893, 0.4338230490684509, 0,
                -0.09662467986345291, 0.9892624020576477, 0.10964841395616531, 0,
                -0.4247973561286926, -0.14061418175697327, 0.8943013548851013, 0,
                -0.026291755959391594, 0.06800390034914017, -0.02094830758869648, 1,
            ],
            radius: 0.007231088820844889,
        },
        'ring-finger-tip': {
            offsetMatrix: [
                0.9001164436340332, 0.03983335196971893, 0.4338230490684509, 0,
                -0.09662467986345291, 0.9892624020576477, 0.10964841395616531, 0,
                -0.4247973561286926, -0.14061418175697327, 0.8943013548851013, 0,
                -0.016345610842108727, 0.07300511747598648, -0.04263874143362045, 1,
            ],
            radius: 0.0062310886569321156,
        },
        'pinky-finger-metacarpal': {
            offsetMatrix: [
                0.8769711852073669, 0.31462907791137695, 0.36322021484375, 0,
                -0.4506046175956726, 0.801031768321991, 0.39408499002456665, 0,
                -0.16696058213710785, -0.5092697143554688, 0.8442559838294983, 0,
                -0.07460174709558487, 0.0062340241856873035, 0.06756893545389175, 1,
            ],
            radius: 0.01808827556669712,
        },
        'pinky-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9498357176780701, 0.1553308218717575, 0.2714462876319885, 0,
                -0.3019258379936218, 0.6817675232887268, 0.6663586497306824, 0,
                -0.08155745267868042, -0.7148879170417786, 0.694466233253479, 0,
                -0.06697750836610794, 0.029482364654541016, 0.02902858518064022, 1,
            ],
            radius: 0.008483353070914745,
        },
        'pinky-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9214097261428833, 0.27928245067596436, 0.2701927423477173, 0,
                -0.3670244514942169, 0.8538867831230164, 0.36901235580444336, 0,
                -0.12765564024448395, -0.43917882442474365, 0.8892839550971985, 0,
                -0.06447203457355499, 0.05144399777054787, 0.0076942890882492065, 1,
            ],
            radius: 0.0067641944624483585,
        },
        'pinky-finger-phalanx-distal': {
            offsetMatrix: [
                0.9038633704185486, 0.23618005216121674, 0.3567195236682892, 0,
                -0.3532794713973999, 0.8823202252388, 0.3109731376171112, 0,
                -0.24129553139209747, -0.4070987403392792, 0.8809353709220886, 0,
                -0.06187915802001953, 0.060364335775375366, -0.010368337854743004, 1,
            ],
            radius: 0.0064259846694767475,
        },
        'pinky-finger-tip': {
            offsetMatrix: [
                0.9038633704185486, 0.23618005216121674, 0.3567195236682892, 0,
                -0.3532794713973999, 0.8823202252388, 0.3109731376171112, 0,
                -0.24129553139209747, -0.4070987403392792, 0.8809353709220886, 0,
                -0.056796226650476456, 0.07042007893323898, -0.02921444922685623, 1,
            ],
            radius: 0.005425984505563974,
        },
    },
    gripOffsetMatrix: [
        0.08027800917625427, -0.8086723685264587, -0.5827556252479553, 0,
        -0.4154181480407715, -0.5585916638374329, 0.7179154753684998, 0,
        -0.9060805439949036, 0.1844543218612671, -0.3807799518108368, 0,
        -0.038054611533880234, -0.002910431008785963, 0.03720742464065552, 1,
    ],
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const pointHandPose = {
    jointTransforms: {
        wrist: {
            offsetMatrix: [
                0.9340395331382751, -0.13936476409435272, 0.32885703444480896, 0,
                -0.005510995630174875, 0.914999783039093, 0.40341612696647644, 0,
                -0.3571262061595917, -0.37861889600753784, 0.8538784384727478, 0,
                -0.05789132043719292, 0.01670890860259533, 0.11183350533246994, 1,
            ],
            radius: 0.021460847929120064,
        },
        'thumb-metacarpal': {
            offsetMatrix: [
                0.02145560085773468, -0.9978390336036682, 0.0621047280728817, 0,
                0.41311800479888916, 0.06541631370782852, 0.9083252549171448, 0,
                -0.9104245901107788, 0.006167683284729719, 0.4136286973953247, 0,
                -0.016488194465637207, 0.012708572670817375, 0.08862338215112686, 1,
            ],
            radius: 0.019382517784833908,
        },
        'thumb-phalanx-proximal': {
            offsetMatrix: [
                0.21270370483398438, -0.966137707233429, 0.14606566727161407, 0,
                0.49890995025634766, 0.2359165996313095, 0.8339261412620544, 0,
                -0.8401462435722351, -0.10450579971075058, 0.5321959853172302, 0,
                0.013112368993461132, 0.012508046813309193, 0.07517509907484055, 1,
            ],
            radius: 0.01228295173496008,
        },
        'thumb-phalanx-distal': {
            offsetMatrix: [
                0.01653280481696129, -0.9986647963523865, 0.048943229019641876, 0,
                0.26313456892967224, 0.051570065319538116, 0.9633802771568298, 0,
                -0.9646173715591431, -0.0030490627977997065, 0.26363563537597656, 0,
                0.04150351136922836, 0.016039609909057617, 0.05719054117798805, 1,
            ],
            radius: 0.009768804535269737,
        },
        'thumb-tip': {
            offsetMatrix: [
                0.01653280481696129, -0.9986647963523865, 0.048943229019641876, 0,
                0.26313456892967224, 0.051570065319538116, 0.9633802771568298, 0,
                -0.9646173715591431, -0.0030490627977997065, 0.26363563537597656, 0,
                0.06548332422971725, 0.01683700829744339, 0.0516640841960907, 1,
            ],
            radius: 0.008768804371356964,
        },
        'index-finger-metacarpal': {
            offsetMatrix: [
                0.9340395331382751, -0.13936476409435272, 0.32885703444480896, 0,
                -0.005510995630174875, 0.914999783039093, 0.40341612696647644, 0,
                -0.3571262061595917, -0.37861889600753784, 0.8538784384727478, 0,
                -0.02592567168176174, 0.019982583820819855, 0.08479326963424683, 1,
            ],
            radius: 0.021228281781077385,
        },
        'index-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9063700437545776, -0.21756279468536377, 0.3621589243412018, 0,
                0.0970839336514473, 0.9415287375450134, 0.3226419687271118, 0,
                -0.41117796301841736, -0.2572731077671051, 0.8744958639144897, 0,
                -0.0015709538711234927, 0.043078210204839706, 0.034657616168260574, 1,
            ],
            radius: 0.010295259766280651,
        },
        'index-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9159826040267944, -0.1651475727558136, 0.36565208435058594, 0,
                0.09755707532167435, 0.9756820797920227, 0.1962820291519165, 0,
                -0.3891757130622864, -0.14411886036396027, 0.9098196625709534, 0,
                0.014023927971720695, 0.052835866808891296, 0.0014903299743309617, 1,
            ],
            radius: 0.00853810179978609,
        },
        'index-finger-phalanx-distal': {
            offsetMatrix: [
                0.9378057718276978, -0.12329639494419098, 0.3245268166065216, 0,
                0.032558172941207886, 0.9619227051734924, 0.2713746726512909, 0,
                -0.3456292748451233, -0.2439306229352951, 0.9061115384101868, 0,
                0.023482320830225945, 0.05633850023150444, -0.020621655508875847, 1,
            ],
            radius: 0.007636196445673704,
        },
        'index-finger-tip': {
            offsetMatrix: [
                0.9378057718276978, -0.12329639494419098, 0.3245268166065216, 0,
                0.032558172941207886, 0.9619227051734924, 0.2713746726512909, 0,
                -0.3456292748451233, -0.2439306229352951, 0.9061115384101868, 0,
                0.03096788562834263, 0.06281610578298569, -0.040703095495700836, 1,
            ],
            radius: 0.006636196281760931,
        },
        'middle-finger-metacarpal': {
            offsetMatrix: [
                0.9340395331382751, -0.13936476409435272, 0.32885703444480896, 0,
                -0.005510995630174875, 0.914999783039093, 0.40341612696647644, 0,
                -0.3571262061595917, -0.37861889600753784, 0.8538784384727478, 0,
                -0.04184452444314957, 0.022474845871329308, 0.08177298307418823, 1,
            ],
            radius: 0.021231964230537415,
        },
        'middle-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9720265865325928, -0.08313076198101044, 0.21966552734375, 0,
                0.20477405190467834, 0.7580050826072693, -0.6192700862884521, 0,
                -0.11502730846405029, 0.6469289064407349, 0.7538246512413025, 0,
                -0.022107340395450592, 0.05035499855875969, 0.02970452979207039, 1,
            ],
            radius: 0.01117393933236599,
        },
        'middle-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9779140949249268, -0.07129573822021484, 0.19646917283535004, 0,
                0.1287083923816681, -0.5352076292037964, -0.8348574042320251, 0,
                0.1646735966205597, 0.8417060971260071, -0.5142109394073486, 0,
                -0.017169542610645294, 0.022584279999136925, -0.00265491777099669, 1,
            ],
            radius: 0.008030958473682404,
        },
        'middle-finger-phalanx-distal': {
            offsetMatrix: [
                0.9774913787841797, -0.19657190144062042, 0.07661263644695282, 0,
                -0.1924918293952942, -0.9796126484870911, -0.05749811604619026, 0,
                0.08635343611240387, 0.041456472128629684, -0.995401918888092, 0,
                -0.02170622907578945, -0.0006043742760084569, 0.011511396616697311, 1,
            ],
            radius: 0.007629410829395056,
        },
        'middle-finger-tip': {
            offsetMatrix: [
                0.9774913787841797, -0.19657190144062042, 0.07661263644695282, 0,
                -0.1924918293952942, -0.9796126484870911, -0.05749811604619026, 0,
                0.08635343611240387, 0.041456472128629684, -0.995401918888092, 0,
                -0.02438267692923546, -0.0026927536819130182, 0.03627248480916023, 1,
            ],
            radius: 0.006629410665482283,
        },
        'ring-finger-metacarpal': {
            offsetMatrix: [
                0.9340395331382751, -0.13936476409435272, 0.32885703444480896, 0,
                -0.005510995630174875, 0.914999783039093, 0.40341612696647644, 0,
                -0.3571262061595917, -0.37861889600753784, 0.8538784384727478, 0,
                -0.05944233387708664, 0.0264605600386858, 0.07478221505880356, 1,
            ],
            radius: 0.019088275730609894,
        },
        'ring-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9842101335525513, 0.024470895528793335, 0.1753024309873581, 0,
                0.12200043350458145, 0.6237703561782837, -0.7720272541046143, 0,
                -0.12824076414108276, 0.7812241315841675, 0.610936164855957, 0,
                -0.04249368980526924, 0.0467497780919075, 0.027722163125872612, 1,
            ],
            radius: 0.00992213748395443,
        },
        'ring-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9941774606704712, 0.05949164181947708, 0.08983955532312393, 0,
                0.10504482686519623, -0.7208291888237, -0.6851072907447815, 0,
                0.024001073092222214, 0.6905553936958313, -0.7228817939758301, 0,
                -0.0374927744269371, 0.016285063698887825, 0.0038980208337306976, 1,
            ],
            radius: 0.007611672393977642,
        },
        'ring-finger-phalanx-distal': {
            offsetMatrix: [
                0.9995742440223694, 0.01638498157262802, 0.02412819117307663, 0,
                0.007813597097992897, -0.9474818110466003, 0.31971633434295654, 0,
                0.028100071474909782, -0.31939181685447693, -0.9472070932388306, 0,
                -0.038130562752485275, -0.0020653479732573032, 0.02310742810368538, 1,
            ],
            radius: 0.007231088820844889,
        },
        'ring-finger-tip': {
            offsetMatrix: [
                0.9995742440223694, 0.01638498157262802, 0.02412819117307663, 0,
                0.007813597097992897, -0.9474818110466003, 0.31971633434295654, 0,
                0.028100071474909782, -0.31939181685447693, -0.9472070932388306, 0,
                -0.0390593595802784, 0.004176302347332239, 0.0466572530567646, 1,
            ],
            radius: 0.0062310886569321156,
        },
        'pinky-finger-metacarpal': {
            offsetMatrix: [
                0.9147363901138306, 0.3458845317363739, 0.20885537564754486, 0,
                -0.3923271894454956, 0.8839452862739563, 0.2544005811214447, 0,
                -0.09662359952926636, -0.3146490156650543, 0.9442773461341858, 0,
                -0.06715242564678192, 0.024195827543735504, 0.07137546688318253, 1,
            ],
            radius: 0.01808827556669712,
        },
        'pinky-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9613109827041626, 0.22439135611057281, 0.15977802872657776, 0,
                0.01002211682498455, 0.5511574745178223, -0.8343409299850464, 0,
                -0.27528178691864014, 0.8036624789237976, 0.5275853276252747, 0,
                -0.06273911893367767, 0.038559623062610626, 0.028268879279494286, 1,
            ],
            radius: 0.008483353070914745,
        },
        'pinky-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9820972084999084, 0.18811029195785522, -0.00995189044624567, 0,
                0.14063723385334015, -0.7673450708389282, -0.6256227493286133, 0,
                -0.12532226741313934, 0.6130226850509644, -0.7800630927085876, 0,
                -0.05428232625126839, 0.013870777562260628, 0.012061242014169693, 1,
            ],
            radius: 0.0067641944624483585,
        },
        'pinky-finger-phalanx-distal': {
            offsetMatrix: [
                0.9744614362716675, 0.20454788208007812, -0.09265263378620148, 0,
                0.22429193556308746, -0.9065253138542175, 0.35764020681381226, 0,
                -0.010836843401193619, -0.3692878782749176, -0.9292529225349426, 0,
                -0.05173685774207115, 0.0014194445684552193, 0.02790539152920246, 1,
            ],
            radius: 0.0064259846694767475,
        },
        'pinky-finger-tip': {
            offsetMatrix: [
                0.9744614362716675, 0.20454788208007812, -0.09265263378620148, 0,
                0.22429193556308746, -0.9065253138542175, 0.35764020681381226, 0,
                -0.010836843401193619, -0.3692878782749176, -0.9292529225349426, 0,
                -0.05098633095622063, 0.008463085629045963, 0.048688892275094986, 1,
            ],
            radius: 0.005425984505563974,
        },
    },
    gripOffsetMatrix: [
        0.005510995630174875, -0.9149997234344482, -0.40341615676879883, 0,
        -0.3571262061595917, -0.37861889600753784, 0.8538784384727478, 0,
        -0.9340395331382751, 0.13936474919319153, -0.32885703444480896, 0,
        -0.031803809106349945, 0.007837686687707901, 0.04313928261399269, 1,
    ],
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const relaxedHandPose = {
    jointTransforms: {
        wrist: {
            offsetMatrix: [
                0.9616971015930176, -0.13805118203163147, 0.2368120402097702, 0,
                0.0005348679260350764, 0.8648636937141418, 0.5020061135292053, 0,
                -0.2741127610206604, -0.48265108466148376, 0.8318111300468445, 0,
                -0.04913589730858803, 0.0021463718730956316, 0.11701996624469757, 1,
            ],
            radius: 0.021460847929120064,
        },
        'thumb-metacarpal': {
            offsetMatrix: [
                -0.07536252588033676, -0.9959676265716553, -0.04867160692811012, 0,
                0.5877083539962769, -0.08379616588354111, 0.8047218918800354, 0,
                -0.8055551648139954, 0.032041035592556, 0.5916536450386047, 0,
                -0.010643752291798592, 0.0006936835707165301, 0.08736639469861984, 1,
            ],
            radius: 0.019382517784833908,
        },
        'thumb-phalanx-proximal': {
            offsetMatrix: [
                0.1374533325433731, -0.9904957413673401, 0.004982374142855406, 0,
                0.5534393787384033, 0.08097179979085922, 0.8289443850517273, 0,
                -0.8214688897132874, -0.11118389666080475, 0.559309184551239, 0,
                0.015547193586826324, -0.0003480653394944966, 0.0681300163269043, 1,
            ],
            radius: 0.01228295173496008,
        },
        'thumb-phalanx-distal': {
            offsetMatrix: [
                -0.04659227654337883, -0.9974699020385742, -0.05369402840733528, 0,
                0.6812446117401123, -0.07104194164276123, 0.728600800037384, 0,
                -0.7305715084075928, -0.002631746232509613, 0.6828309893608093, 0,
                0.04330715537071228, 0.003409178927540779, 0.0492292083799839, 1,
            ],
            radius: 0.009768804535269737,
        },
        'thumb-tip': {
            offsetMatrix: [
                -0.04659227654337883, -0.9974699020385742, -0.05369402840733528, 0,
                0.6812446117401123, -0.07104194164276123, 0.728600800037384, 0,
                -0.7305715084075928, -0.002631746232509613, 0.6828309893608093, 0,
                0.062003348022699356, 0.004069602582603693, 0.03322213143110275, 1,
            ],
            radius: 0.008768804371356964,
        },
        'index-finger-metacarpal': {
            offsetMatrix: [
                0.9616971015930176, -0.13805118203163147, 0.2368120402097702, 0,
                0.0005348679260350764, 0.8648636937141418, 0.5020061135292053, 0,
                -0.2741127610206604, -0.48265108466148376, 0.8318111300468445, 0,
                -0.02009812369942665, 0.008770795539021492, 0.08660387247800827, 1,
            ],
            radius: 0.021228281781077385,
        },
        'index-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9001791477203369, -0.2598813474178314, 0.3494834005832672, 0,
                0.06073702871799469, 0.8695210218429565, 0.490146666765213, 0,
                -0.4312632381916046, -0.41999316215515137, 0.7985095381736755, 0,
                -0.00017739279428496957, 0.03890012577176094, 0.039073407649993896, 1,
            ],
            radius: 0.010295259766280651,
        },
        'index-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9082008600234985, -0.20898112654685974, 0.36262574791908264, 0,
                0.11045389622449875, 0.9553793668746948, 0.27395179867744446, 0,
                -0.40369608998298645, -0.20874978601932526, 0.8907597661018372, 0,
                0.01617925800383091, 0.05482936650514603, 0.008788082748651505, 1,
            ],
            radius: 0.00853810179978609,
        },
        'index-finger-phalanx-distal': {
            offsetMatrix: [
                0.9309692978858948, -0.16783711314201355, 0.32423174381256104, 0,
                0.1080828532576561, 0.9749603867530823, 0.1943446695804596, 0,
                -0.34873148798942566, -0.14588497579097748, 0.9257990717887878, 0,
                0.02599053829908371, 0.059902746230363846, -0.012860597111284733, 1,
            ],
            radius: 0.007636196445673704,
        },
        'index-finger-tip': {
            offsetMatrix: [
                0.9309692978858948, -0.16783711314201355, 0.32423174381256104, 0,
                0.1080828532576561, 0.9749603867530823, 0.1943446695804596, 0,
                -0.34873148798942566, -0.14588497579097748, 0.9257990717887878, 0,
                0.03362493962049484, 0.06421422213315964, -0.033461250364780426, 1,
            ],
            radius: 0.006636196281760931,
        },
        'middle-finger-metacarpal': {
            offsetMatrix: [
                0.9616971015930176, -0.13805118203163147, 0.2368120402097702, 0,
                0.0005348679260350764, 0.8648636937141418, 0.5020061135292053, 0,
                -0.2741127610206604, -0.48265108466148376, 0.8318111300468445, 0,
                -0.03627845644950867, 0.011579737067222595, 0.08550142496824265, 1,
            ],
            radius: 0.021231964230537415,
        },
        'middle-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9876697659492493, -0.06786545366048813, 0.1410750150680542, 0,
                -0.015095947310328484, 0.855663537979126, 0.5173118710517883, 0,
                -0.15582047402858734, -0.5130629539489746, 0.8440889716148376, 0,
                -0.021259509027004242, 0.04587256908416748, 0.03659208118915558, 1,
            ],
            radius: 0.01117393933236599,
        },
        'middle-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.988391637802124, -0.04354291781783104, 0.14555205404758453, 0,
                0.008894841186702251, 0.9729899168014526, 0.23067504167556763, 0,
                -0.15166506171226501, -0.22670257091522217, 0.9620829224586487, 0,
                -0.014570588245987892, 0.06789684295654297, 0.0003578895702958107, 1,
            ],
            radius: 0.008030958473682404,
        },
        'middle-finger-phalanx-distal': {
            offsetMatrix: [
                0.9853697419166565, 0.044260796159505844, 0.16458062827587128, 0,
                -0.0757969319820404, 0.9787378311157227, 0.19059516489505768, 0,
                -0.1526455283164978, -0.20028135180473328, 0.9677740931510925, 0,
                -0.010392282158136368, 0.07414241135120392, -0.026147106662392616, 1,
            ],
            radius: 0.007629410829395056,
        },
        'middle-finger-tip': {
            offsetMatrix: [
                0.9853697419166565, 0.044260796159505844, 0.16458062827587128, 0,
                -0.0757969319820404, 0.9787378311157227, 0.19059516489505768, 0,
                -0.1526455283164978, -0.20028135180473328, 0.9677740931510925, 0,
                -0.0069718430750072, 0.08024183660745621, -0.05014154314994812, 1,
            ],
            radius: 0.006629410665482283,
        },
        'ring-finger-metacarpal': {
            offsetMatrix: [
                0.9616971015930176, -0.13805118203163147, 0.2368120402097702, 0,
                0.0005348679260350764, 0.8648636937141418, 0.5020061135292053, 0,
                -0.2741127610206604, -0.48265108466148376, 0.8318111300468445, 0,
                -0.05402477830648422, 0.015797706320881844, 0.08152295649051666, 1,
            ],
            radius: 0.019088275730609894,
        },
        'ring-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9940828680992126, 0.05735103040933609, 0.09224652498960495, 0,
                -0.10022822767496109, 0.8116500377655029, 0.5754809379577637, 0,
                -0.041867565363645554, -0.5813214182853699, 0.8125960826873779, 0,
                -0.041623555123806, 0.04171867296099663, 0.03582974523305893, 1,
            ],
            radius: 0.00992213748395443,
        },
        'ring-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9843675494194031, 0.12044742703437805, 0.12850022315979004, 0,
                -0.15629759430885315, 0.9337108135223389, 0.3221098482608795, 0,
                -0.08118485659360886, -0.3371586799621582, 0.937940776348114, 0,
                -0.039990875869989395, 0.06438793987035751, 0.004141641780734062, 1,
            ],
            radius: 0.007611672393977642,
        },
        'ring-finger-phalanx-distal': {
            offsetMatrix: [
                0.9748351573944092, 0.11857274919748306, 0.18877571821212769, 0,
                -0.15575434267520905, 0.9681083559989929, 0.19623035192489624, 0,
                -0.15948788821697235, -0.22069483995437622, 0.9622148275375366, 0,
                -0.03783353418111801, 0.07334739714860916, -0.020782606676220894, 1,
            ],
            radius: 0.007231088820844889,
        },
        'ring-finger-tip': {
            offsetMatrix: [
                0.9748351573944092, 0.11857274919748306, 0.18877571821212769, 0,
                -0.15575434267520905, 0.9681083559989929, 0.19623035192489624, 0,
                -0.15948788821697235, -0.22069483995437622, 0.9622148275375366, 0,
                -0.03445569798350334, 0.0802423357963562, -0.04392268508672714, 1,
            ],
            radius: 0.0062310886569321156,
        },
        'pinky-finger-metacarpal': {
            offsetMatrix: [
                0.9181402921676636, 0.35625091195106506, 0.17350243031978607, 0,
                -0.39615097641944885, 0.8352503180503845, 0.38134080171585083, 0,
                -0.009065053425729275, -0.41885748505592346, 0.9080066680908203, 0,
                -0.06191859766840935, 0.013620133511722088, 0.07850203663110733, 1,
            ],
            radius: 0.01808827556669712,
        },
        'pinky-finger-phalanx-proximal': {
            offsetMatrix: [
                0.9714386463165283, 0.236698180437088, -0.016745081171393394, 0,
                -0.18462024629116058, 0.7982627749443054, 0.5733163952827454, 0,
                0.14906984567642212, -0.5538501739501953, 0.8191629648208618, 0,
                -0.061502378433942795, 0.032741155475378036, 0.03705105185508728, 1,
            ],
            radius: 0.008483353070914745,
        },
        'pinky-finger-phalanx-intermediate': {
            offsetMatrix: [
                0.9337416291236877, 0.35620439052581787, -0.03527557849884033, 0,
                -0.33203884959220886, 0.8987522721290588, 0.28634607791900635, 0,
                0.13370157778263092, -0.2556603252887726, 0.9574766755104065, 0,
                -0.06608185172080994, 0.049755651503801346, 0.011886020191013813, 1,
            ],
            radius: 0.0067641944624483585,
        },
        'pinky-finger-phalanx-distal': {
            offsetMatrix: [
                0.9419984817504883, 0.3303581774234772, 0.059175245463848114, 0,
                -0.33483216166496277, 0.9130291938781738, 0.23294763267040253, 0,
                0.02292730286717415, -0.2392500638961792, 0.970687210559845, 0,
                -0.0687975287437439, 0.054948460310697556, -0.007561664097011089, 1,
            ],
            radius: 0.0064259846694767475,
        },
        'pinky-finger-tip': {
            offsetMatrix: [
                0.9419984817504883, 0.3303581774234772, 0.059175245463848114, 0,
                -0.33483216166496277, 0.9130291938781738, 0.23294763267040253, 0,
                0.02292730286717415, -0.2392500638961792, 0.970687210559845, 0,
                -0.06947512179613113, 0.0613851435482502, -0.028543535619974136, 1,
            ],
            radius: 0.005425984505563974,
        },
    },
    gripOffsetMatrix: [
        -0.0005348679260350764, -0.8648636937141418, -0.5020061135292053, 0,
        -0.2741127908229828, -0.48265108466148376, 0.8318111896514893, 0,
        -0.9616971015930176, 0.13805119693279266, -0.2368120402097702, 0,
        -0.02878567762672901, 0.0017147823236882687, 0.04536811262369156, 1,
    ],
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const oculusHandConfig = {
    profileId: 'oculus-hand',
    fallbackProfileIds: [
        'generic-hand',
        'generic-hand-select',
        'generic-trigger',
    ],
    poses: {
        default: relaxedHandPose,
        pinch: pinchHandPose,
        point: pointHandPose,
    },
};
const XRHandGamepadConfig = {
    mapping: GamepadMappingType.None,
    buttons: [{ id: 'pinch', type: 'analog', eventTrigger: 'select' }],
    axes: [],
};
const fromPosition = create$4();
const fromQuaternion = create$2();
const fromScale = create$4();
const toPosition = create$4();
const toQuaternion = create$2();
const toScale = create$4();
const interpolatedPosition = create$4();
const interpolatedQuaternion = create$2();
const interpolatedScale = create$4();
const interpolateMatrix = (out, fromMatrix, toMatrix, alpha) => {
    getTranslation(fromPosition, fromMatrix);
    getRotation(fromQuaternion, fromMatrix);
    getScaling(fromScale, fromMatrix);
    getTranslation(toPosition, toMatrix);
    getRotation(toQuaternion, toMatrix);
    getScaling(toScale, toMatrix);
    lerp(interpolatedPosition, fromPosition, toPosition, alpha);
    slerp(interpolatedQuaternion, fromQuaternion, toQuaternion, alpha);
    lerp(interpolatedScale, fromScale, toScale, alpha);
    fromRotationTranslationScale(out, interpolatedQuaternion, interpolatedPosition, interpolatedScale);
    return out;
};
const mirrorMultiplierMatrix = [
    1, -1, -1, 0, -1, 1, 1, 0, -1, 1, 1, 0, -1, 1, 1, 1,
];
const mirrorMatrixToRight = (matrixLeft) => {
    for (let i = 0; i < 16; i++) {
        matrixLeft[i] *= mirrorMultiplierMatrix[i];
    }
};
class XRHandInput extends XRTrackedInput {
    constructor(handInputConfig, handedness, globalSpace) {
        if (handedness !== XRHandedness.Left && handedness !== XRHandedness.Right) {
            throw new DOMException('handedness for XRHandInput must be either "left" or "right"', 'InvalidStateError');
        }
        if (!handInputConfig.poses.default || !handInputConfig.poses.pinch) {
            throw new DOMException('"default" and "pinch" hand pose configs are required', 'InvalidStateError');
        }
        const targetRaySpace = new XRSpace(globalSpace);
        const gripSpace = new XRSpace(targetRaySpace);
        const profiles = [
            handInputConfig.profileId,
            ...handInputConfig.fallbackProfileIds,
        ];
        const hand = new XRHand();
        Object.values(XRHandJoint).forEach((jointName) => {
            hand.set(jointName, new XRJointSpace(jointName, targetRaySpace));
        });
        const inputSource = new XRInputSource(handedness, XRTargetRayMode.TrackedPointer, profiles, targetRaySpace, new Gamepad(XRHandGamepadConfig), gripSpace, hand);
        super(inputSource);
        this[P_HAND_INPUT] = {
            poseId: 'default',
            poses: handInputConfig.poses,
        };
        this.updateHandPose();
    }
    get poseId() {
        return this[P_HAND_INPUT].poseId;
    }
    set poseId(poseId) {
        if (!this[P_HAND_INPUT].poses[poseId]) {
            console.warn(`Pose config ${poseId} not found`);
            return;
        }
        this[P_HAND_INPUT].poseId = poseId;
    }
    updateHandPose() {
        const targetPose = this[P_HAND_INPUT].poses[this[P_HAND_INPUT].poseId];
        const pinchPose = this[P_HAND_INPUT].poses.pinch;
        Object.values(XRHandJoint).forEach((jointName) => {
            const targetJointMatrix = targetPose.jointTransforms[jointName].offsetMatrix;
            const pinchJointMatrix = pinchPose.jointTransforms[jointName].offsetMatrix;
            const jointSpace = this.inputSource.hand.get(jointName);
            interpolateMatrix(jointSpace[P_SPACE].offsetMatrix, targetJointMatrix, pinchJointMatrix, this.pinchValue);
            if (this.inputSource.handedness === XRHandedness.Right) {
                mirrorMatrixToRight(jointSpace[P_SPACE].offsetMatrix);
            }
            jointSpace[P_JOINT_SPACE].radius =
                (1 - this.pinchValue) * targetPose.jointTransforms[jointName].radius +
                this.pinchValue * pinchPose.jointTransforms[jointName].radius;
        });
        if (targetPose.gripOffsetMatrix && pinchPose.gripOffsetMatrix) {
            interpolateMatrix(this.inputSource.gripSpace[P_SPACE].offsetMatrix, targetPose.gripOffsetMatrix, pinchPose.gripOffsetMatrix, this.pinchValue);
        }
    }
    get pinchValue() {
        return this[P_TRACKED_INPUT].inputSource.gamepad[P_GAMEPAD].buttonsMap['pinch'].value;
    }
    updatePinchValue(value) {
        if (value > 1 || value < 0) {
            console.warn(`Out-of-range value ${value} provided for pinch`);
            return;
        }
        const gamepadButton = this[P_TRACKED_INPUT].inputSource.gamepad[P_GAMEPAD].buttonsMap['pinch'];
        gamepadButton[P_GAMEPAD].pendingValue = value;
    }
    onFrameStart(frame) {
        super.onFrameStart(frame);
        this.updateHandPose();
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRLayer extends EventTarget {
}
const defaultLayerInit = {
    antialias: true,
    depth: true,
    stencil: false,
    alpha: true,
    ignoreDepthValues: false,
    framebufferScaleFactor: 1.0,
};
class XRWebGLLayer extends XRLayer {
    constructor(session, context, layerInit = {}) {
        super();
        if (session[P_SESSION].ended) {
            throw new DOMException('Session has ended', 'InvalidStateError');
        }
        // TO-DO: Check that the context attribute has xrCompatible set to true
        // may require polyfilling the context and perhaps canvas.getContext
        // Default values for XRWebGLLayerInit, can be overridden by layerInit
        const config = { ...defaultLayerInit, ...layerInit };
        this[P_WEBGL_LAYER] = {
            session,
            context,
            antialias: config.antialias,
        };
    }
    get context() {
        return this[P_WEBGL_LAYER].context;
    }
    get antialias() {
        return this[P_WEBGL_LAYER].antialias;
    }
    get ignoreDepthValues() {
        return true;
    }
    get framebuffer() {
        return null;
    }
    get framebufferWidth() {
        return this[P_WEBGL_LAYER].context.drawingBufferWidth;
    }
    get framebufferHeight() {
        return this[P_WEBGL_LAYER].context.drawingBufferHeight;
    }
    getViewport(view) {
        if (view[P_VIEW].session !== this[P_WEBGL_LAYER].session) {
            throw new DOMException("View's session differs from Layer's session", 'InvalidStateError');
        }
        // TO-DO: check frame
        return this[P_WEBGL_LAYER].session[P_SESSION].device[P_DEVICE].getViewport(this, view);
    }
    static getNativeFramebufferScaleFactor(session) {
        if (!(session instanceof XRSession)) {
            throw new TypeError('getNativeFramebufferScaleFactor must be passed a session.');
        }
        if (session[P_SESSION].ended) {
            return 0.0;
        }
        // Return 1.0 for simplicity, actual implementation might vary based on the device capabilities
        return 1.0;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class ActionPlayer {
    constructor(refSpace, recording, ipd) {
        const { schema, frames } = recording;
        if (!frames || !schema || frames.length === 0) {
            throw new DOMException('wrong recording format', 'NotSupportedError');
        }
        const viewerSpace = new XRReferenceSpace(XRReferenceSpaceType.Viewer, refSpace);
        const viewSpaces = {
            [XREye.Left]: new XRSpace(viewerSpace),
            [XREye.Right]: new XRSpace(viewerSpace),
            [XREye.None]: new XRSpace(viewerSpace),
        };
        this[P_ACTION_PLAYER] = {
            refSpace,
            inputSources: new Map(),
            inputSchemas: new Map(),
            frames,
            recordedFramePointer: 0,
            startingTimeStamp: frames[0][0],
            endingTimeStamp: frames[frames.length - 1][0],
            playbackTime: frames[0][0],
            playing: false,
            viewerSpace,
            viewSpaces,
            vec3: create$4(),
            quat: create$2(),
        };
        fromTranslation(this[P_ACTION_PLAYER].viewSpaces[XREye.Left][P_SPACE].offsetMatrix, fromValues$2(-ipd / 2, 0, 0));
        fromTranslation(this[P_ACTION_PLAYER].viewSpaces[XREye.Right][P_SPACE].offsetMatrix, fromValues$2(ipd / 2, 0, 0));
        schema.forEach((schemaEntry) => {
            const index = schemaEntry[0];
            const schema = schemaEntry[1];
            let gamepad;
            if (schema.hasGamepad) {
                const buttons = [];
                for (let i = 0; i < schema.numButtons; i++) {
                    buttons.push({ id: i.toString(), type: 'manual' });
                }
                const axes = [];
                for (let i = 0; i < schema.numAxes; i++) {
                    axes.push({ id: i.toString(), type: 'manual' });
                }
                gamepad = new Gamepad({
                    mapping: schema.mapping,
                    buttons,
                    axes,
                });
            }
            const targetRaySpace = new XRSpace(refSpace);
            let hand = undefined;
            if (schema.hasHand) {
                hand = new XRHand();
                Object.values(XRHandJoint).forEach((jointName) => {
                    hand.set(jointName, new XRJointSpace(jointName, targetRaySpace));
                });
            }
            const inputSource = new XRInputSource(schema.handedness, schema.targetRayMode, schema.profiles, targetRaySpace, gamepad, schema.hasGrip ? new XRSpace(refSpace) : undefined, schema.hasHand ? hand : undefined);
            this[P_ACTION_PLAYER].inputSources.set(index, {
                active: false,
                source: inputSource,
            });
            this[P_ACTION_PLAYER].inputSchemas.set(index, schema);
        });
    }
    play() {
        this[P_ACTION_PLAYER].recordedFramePointer = 0;
        this[P_ACTION_PLAYER].playbackTime =
            this[P_ACTION_PLAYER].startingTimeStamp;
        this[P_ACTION_PLAYER].playing = true;
        this[P_ACTION_PLAYER].actualTimeStamp = performance.now();
    }
    stop() {
        this[P_ACTION_PLAYER].playing = false;
    }
    get playing() {
        return this[P_ACTION_PLAYER].playing;
    }
    get viewerSpace() {
        return this[P_ACTION_PLAYER].viewerSpace;
    }
    get viewSpaces() {
        return this[P_ACTION_PLAYER].viewSpaces;
    }
    get inputSources() {
        return Array.from(this[P_ACTION_PLAYER].inputSources.values())
            .filter((wrapper) => wrapper.active)
            .map((wrapper) => wrapper.source);
    }
    playFrame() {
        const now = performance.now();
        const delta = now - this[P_ACTION_PLAYER].actualTimeStamp;
        this[P_ACTION_PLAYER].actualTimeStamp = now;
        this[P_ACTION_PLAYER].playbackTime += delta;
        if (this[P_ACTION_PLAYER].playbackTime >
            this[P_ACTION_PLAYER].endingTimeStamp) {
            this.stop();
            return;
        }
        while (this[P_ACTION_PLAYER].frames[this[P_ACTION_PLAYER].recordedFramePointer + 1][0] < this[P_ACTION_PLAYER].playbackTime) {
            this[P_ACTION_PLAYER].recordedFramePointer++;
        }
        const lastFrameData = this[P_ACTION_PLAYER].frames[this[P_ACTION_PLAYER].recordedFramePointer];
        const nextFrameData = this[P_ACTION_PLAYER].frames[this[P_ACTION_PLAYER].recordedFramePointer + 1];
        const alpha = (this[P_ACTION_PLAYER].playbackTime - lastFrameData[0]) /
            (nextFrameData[0] - lastFrameData[0]);
        this.updateXRSpaceFromMergedFrames(this[P_ACTION_PLAYER].viewerSpace, lastFrameData.slice(1, 8), nextFrameData.slice(1, 8), alpha);
        const lastFrameInputs = new Map();
        for (let i = 8; i < lastFrameData.length; i++) {
            const { index, inputData } = this.processRawInputData(lastFrameData[i]);
            lastFrameInputs.set(index, inputData);
        }
        const nextFrameInputs = new Map();
        for (let i = 8; i < nextFrameData.length; i++) {
            const { index, inputData } = this.processRawInputData(nextFrameData[i]);
            nextFrameInputs.set(index, inputData);
        }
        this[P_ACTION_PLAYER].inputSources.forEach((sourceWrapper) => {
            sourceWrapper.active = false;
        });
        nextFrameInputs.forEach((inputData, index) => {
            this[P_ACTION_PLAYER].inputSources.get(index).active = true;
            const inputSource = this[P_ACTION_PLAYER].inputSources.get(index).source;
            const schema = this[P_ACTION_PLAYER].inputSchemas.get(index);
            this.updateInputSource(inputSource, schema, lastFrameInputs.has(index) ? lastFrameInputs.get(index) : inputData, inputData, alpha);
        });
    }
    updateInputSource(inputSource, schema, lastInputData, nextInputData, alpha) {
        this.updateXRSpaceFromMergedFrames(inputSource.targetRaySpace, lastInputData.targetRayTransform, nextInputData.targetRayTransform, alpha);
        if (schema.hasGrip) {
            this.updateXRSpaceFromMergedFrames(inputSource.gripSpace, lastInputData.gripTransform, nextInputData.gripTransform, alpha);
        }
        if (schema.hasHand) {
            for (let i = 0; i < 25; i++) {
                const lastTransformArray = lastInputData.handTransforms.slice(i * 8, i * 8 + 7);
                const nextTransformArray = nextInputData.handTransforms.slice(i * 8, i * 8 + 7);
                const lastRadius = lastInputData.handTransforms[i * 8 + 7];
                const nextRadius = nextInputData.handTransforms[i * 8 + 7];
                const jointSpace = inputSource.hand.get(schema.jointSequence[i]);
                this.updateXRSpaceFromMergedFrames(jointSpace, lastTransformArray, nextTransformArray, alpha);
                jointSpace[P_JOINT_SPACE].radius =
                    (nextRadius - lastRadius) * alpha + lastRadius;
            }
        }
        if (schema.hasGamepad) {
            const gamepad = inputSource.gamepad;
            nextInputData.buttons.forEach((states, index) => {
                const gamepadButton = gamepad.buttons[index];
                gamepadButton[P_GAMEPAD].pressed = states[0] === 1 ? true : false;
                gamepadButton[P_GAMEPAD].touched = states[1] === 1 ? true : false;
                const lastValue = lastInputData.buttons[index][2];
                const nextValue = states[2];
                gamepadButton[P_GAMEPAD].value =
                    (nextValue - lastValue) * alpha + lastValue;
            });
            nextInputData.axes.forEach((nextValue, index) => {
                const lastValue = lastInputData.axes[index];
                gamepad[P_GAMEPAD].axesMap[index.toString()].x =
                    (nextValue - lastValue) * alpha + lastValue;
            });
        }
    }
    updateXRSpaceFromMergedFrames(space, lastTransform, nextTransform, alpha) {
        const f1p = fromValues$2(lastTransform[0], lastTransform[1], lastTransform[2]);
        const f1q = fromValues(lastTransform[3], lastTransform[4], lastTransform[5], lastTransform[6]);
        const f2p = fromValues$2(nextTransform[0], nextTransform[1], nextTransform[2]);
        const f2q = fromValues(nextTransform[3], nextTransform[4], nextTransform[5], nextTransform[6]);
        lerp(this[P_ACTION_PLAYER].vec3, f1p, f2p, alpha);
        slerp(this[P_ACTION_PLAYER].quat, f1q, f2q, alpha);
        fromRotationTranslation(space[P_SPACE].offsetMatrix, this[P_ACTION_PLAYER].quat, this[P_ACTION_PLAYER].vec3);
    }
    processRawInputData(inputDataRaw) {
        const index = inputDataRaw[0];
        const schema = this[P_ACTION_PLAYER].inputSchemas.get(index);
        const targetRayTransform = inputDataRaw.slice(1, 8);
        const inputData = { targetRayTransform };
        let dataCounter = 8;
        if (schema.hasGrip) {
            inputData.gripTransform = inputDataRaw[dataCounter++];
        }
        if (schema.hasHand) {
            inputData.handTransforms = inputDataRaw[dataCounter++];
        }
        if (schema.hasGamepad) {
            const gamepadData = inputDataRaw[dataCounter];
            inputData.buttons = gamepadData.slice(0, schema.numButtons);
            inputData.axes = gamepadData.slice(schema.numButtons);
        }
        return { index, inputData };
    }
}

const VERSION = "2.1.1";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRReferenceSpaceEvent extends Event {
    constructor(type, eventInitDict) {
        super(type, eventInitDict);
        if (!eventInitDict.referenceSpace) {
            throw new Error('XRReferenceSpaceEventInit.referenceSpace is required');
        }
        this.referenceSpace = eventInitDict.referenceSpace;
        this.transform = eventInitDict.transform;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRSystem extends EventTarget {
    constructor(device) {
        super();
        this[P_SYSTEM] = {
            device,
            grantSession: ({ resolve, reject, mode, options }) => {
                // Check for active sessions and other constraints here
                if (this[P_SYSTEM].activeSession) {
                    reject(new DOMException('An active XRSession already exists.', 'InvalidStateError'));
                    return;
                }
                // Handle required and optional features
                const { requiredFeatures = [], optionalFeatures = [] } = options;
                const { supportedFeatures } = this[P_SYSTEM].device;
                // Check if all required features are supported
                const allRequiredSupported = requiredFeatures.every((feature) => supportedFeatures.includes(feature));
                if (!allRequiredSupported) {
                    reject(new Error('One or more required features are not supported by the device.'));
                    return;
                }
                // Filter out unsupported optional features
                const supportedOptionalFeatures = optionalFeatures.filter((feature) => supportedFeatures.includes(feature));
                // Combine required and supported optional features into enabled features
                const enabledFeatures = Array.from(new Set([
                    ...requiredFeatures,
                    ...supportedOptionalFeatures,
                    'viewer',
                    'local',
                ]));
                // Proceed with session creation
                const session = new XRSession(this[P_SYSTEM].device, mode, enabledFeatures);
                this[P_SYSTEM].activeSession = session;
                // Listen for session end to clear the active session
                session.addEventListener('end', () => {
                    this[P_SYSTEM].activeSession = undefined;
                });
                resolve(session);
            },
        };
        // Initialize device change monitoring here if applicable
    }
    isSessionSupported(mode) {
        return new Promise((resolve, _reject) => {
            if (mode === 'inline') {
                resolve(true);
            }
            else {
                // Check for spatial tracking permission if necessary
                resolve(this[P_SYSTEM].device.supportedSessionModes.includes(mode));
            }
        });
    }
    requestSession(mode, options = {}) {
        return new Promise((resolve, reject) => {
            this.isSessionSupported(mode)
                .then((isSupported) => {
                    if (!isSupported) {
                        reject(new DOMException('The requested XRSession mode is not supported.', 'NotSupportedError'));
                        return;
                    }
                    const sessionGrantConfig = {
                        resolve,
                        reject,
                        mode,
                        options,
                    };
                    this[P_SYSTEM].grantSession(sessionGrantConfig);
                })
                .catch(reject);
        });
    }
    offerSession(mode, options = {}) {
        return new Promise((resolve, reject) => {
            this.isSessionSupported(mode)
                .then((isSupported) => {
                    if (!isSupported) {
                        reject(new DOMException('The requested XRSession mode is not supported.', 'NotSupportedError'));
                        return;
                    }
                    this[P_SYSTEM].offeredSessionConfig = {
                        resolve,
                        reject,
                        mode,
                        options,
                    };
                })
                .catch(reject);
        });
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class XRViewport {
    constructor(x, y, width, height) {
        this[P_VIEWPORT] = { x, y, width, height };
    }
    get x() {
        return this[P_VIEWPORT].x;
    }
    get y() {
        return this[P_VIEWPORT].y;
    }
    get width() {
        return this[P_VIEWPORT].width;
    }
    get height() {
        return this[P_VIEWPORT].height;
    }
}

/**
 * @license
 * webxr-layers-polyfill
 * Version 1.1.0
 * Copyright (c) 2021 Facebook, Inc. and its affiliates.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/**
 * @license
 * gl-matrix 
 * Version 3.4.3
 * Copyright (c) 2015-2021, Brandon Jones, Colin MacKenzie IV.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

var XRTextureType;
(function (XRTextureType) {
    XRTextureType["texture"] = "texture";
    XRTextureType["texture-array"] = "texture-array";
})(XRTextureType || (XRTextureType = {}));
var XRLayerLayout;
(function (XRLayerLayout) {
    XRLayerLayout["default"] = "default";
    XRLayerLayout["mono"] = "mono";
    XRLayerLayout["stereo"] = "stereo";
    XRLayerLayout["stereo-left-right"] = "stereo-left-right";
    XRLayerLayout["stereo-top-bottom"] = "stereo-top-bottom";
})(XRLayerLayout || (XRLayerLayout = {}));

const isReferenceSpace = (arg) => {
    return arg && typeof arg.getOffsetReferenceSpace === 'function';
};

const getGlobal = () => {
    return typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined'
            ? self
            : typeof window !== 'undefined'
                ? window
                : {};
};

const getFormatsFromInternalFormat = (context, providedFormat) => {
    switch (providedFormat) {
        case context.RGBA8:
        case context.RGB5_A1:
        case context.RGBA4:
        case context.SRGB8_ALPHA8:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA,
                type: context.UNSIGNED_BYTE,
            };
        case context.RGBA8_SNORM:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA,
                type: context.BYTE,
            };
        case context.RGB10_A2:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA,
                type: context.UNSIGNED_INT_2_10_10_10_REV,
            };
        case context.RGBA16F:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA,
                type: context.HALF_FLOAT,
            };
        case context.RGBA32F:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA,
                type: context.FLOAT,
            };
        case context.RGBA8UI:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA_INTEGER,
                type: context.UNSIGNED_BYTE,
            };
        case context.RGBA8I:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA_INTEGER,
                type: context.BYTE,
            };
        case context.RGBA16UI:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA_INTEGER,
                type: context.UNSIGNED_SHORT,
            };
        case context.RGBA16I:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA_INTEGER,
                type: context.SHORT,
            };
        case context.RGBA32UI:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA_INTEGER,
                type: context.UNSIGNED_INT,
            };
        case context.RGBA32I:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA_INTEGER,
                type: context.INT,
            };
        case context.RGB10_A2UI:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGBA_INTEGER,
                type: context.UNSIGNED_INT_2_10_10_10_REV,
            };
        case context.RGB8:
        case context.RGB565:
        case context.SRGB8:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB,
                type: context.UNSIGNED_BYTE,
            };
        case context.RGB8_SNORM:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB,
                type: context.BYTE,
            };
        case context.RGB16F:
        case context.R11F_G11F_B10F:
        case context.RGB9_E5:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB,
                type: context.HALF_FLOAT,
            };
        case context.RGB32F:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB,
                type: context.FLOAT,
            };
        case context.RGB8UI:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB_INTEGER,
                type: context.UNSIGNED_BYTE,
            };
        case context.RGB8I:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB_INTEGER,
                type: context.BYTE,
            };
        case context.RGB16UI:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB_INTEGER,
                type: context.UNSIGNED_SHORT,
            };
        case context.RGB16I:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB_INTEGER,
                type: context.SHORT,
            };
        case context.RGB32UI:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB_INTEGER,
                type: context.UNSIGNED_INT,
            };
        case context.RGB32I:
            return {
                internalFormat: providedFormat,
                textureFormat: context.RGB_INTEGER,
                type: context.INT,
            };
        case context.DEPTH_COMPONENT16:
            return {
                internalFormat: providedFormat,
                textureFormat: context.DEPTH_COMPONENT,
                type: context.UNSIGNED_SHORT,
            };
        case context.DEPTH_COMPONENT24:
            return {
                internalFormat: providedFormat,
                textureFormat: context.DEPTH_COMPONENT,
                type: context.UNSIGNED_INT,
            };
        case context.DEPTH_COMPONENT32F:
            return {
                internalFormat: providedFormat,
                textureFormat: context.DEPTH_COMPONENT,
                type: context.FLOAT,
            };
        case context.DEPTH24_STENCIL8:
            return {
                internalFormat: providedFormat,
                textureFormat: context.DEPTH_STENCIL,
                type: context.UNSIGNED_INT_24_8,
            };
        case context.DEPTH32F_STENCIL8:
            return {
                internalFormat: providedFormat,
                textureFormat: context.DEPTH_STENCIL,
                type: context.FLOAT_32_UNSIGNED_INT_24_8_REV,
            };
        case context.DEPTH_COMPONENT:
            return getFormatsFromInternalFormat(context, context.DEPTH_COMPONENT24);
        case context.DEPTH_STENCIL:
            return getFormatsFromInternalFormat(context, context.DEPTH24_STENCIL8);
        case context.RGBA:
        case context.RGB:
        case context.LUMINANCE_ALPHA:
        case context.LUMINANCE:
        case context.ALPHA:
            return {
                internalFormat: providedFormat,
                textureFormat: providedFormat,
                type: context.UNSIGNED_BYTE,
            };
        default:
            throw new Error('Attempted to create polyfill with unsupported format.');
    }
};

class XRCompositionLayerPolyfill {
    constructor() {
        this._hasRunDeferredInitialize = false;
        this._media = null;
    }
    initialize(session, context) {
        this.session = session;
        if (context) {
            this.context = context;
        }
        this.blendTextureSourceAlpha = true;
    }
    destroy() {
        this._colorTextures = [];
        this._depthStencilTextures = [];
    }
    addEventListener(type, listener, options) { }
    dispatchEvent(event) {
        return false;
    }
    removeEventListener(type, callback, options) { }
    getContext() {
        return this.context;
    }
    getTextureType() {
        throw new Error('Unimplemented');
    }
    get colorTextures() {
        return this._colorTextures;
    }
    get depthStencilTextures() {
        return this._depthStencilTextures;
    }
    get colorTexturesMeta() {
        return this._texturesMeta;
    }
    get media() {
        if (!this.isMediaLayer()) {
            console.warn('Attempted to retrieve media from a non-media layer');
        }
        return this._media;
    }
    determineLayoutAttribute(textureType, context, layout) {
        if (!(context instanceof WebGL2RenderingContext) &&
            textureType === XRTextureType['texture-array']) {
            throw new TypeError();
        }
        if (layout === XRLayerLayout.mono) {
            return layout;
        }
        if (layout === XRLayerLayout.default) {
            if (this.session.internalViews && this.session.internalViews.length === 1) {
                return XRLayerLayout['mono'];
            }
            if (textureType === XRTextureType['texture-array']) {
                return layout;
            }
        }
        if (layout === XRLayerLayout.default || layout === XRLayerLayout.stereo) {
            return XRLayerLayout['stereo-left-right'];
        }
        return layout;
    }
    isMediaLayer() {
        return this._media !== null;
    }
    _deferredInitialize() { }
    initializeIfNeeded() {
        if (!this._hasRunDeferredInitialize) {
            this._hasRunDeferredInitialize = true;
            this._deferredInitialize();
        }
    }
    _allocateColorTexturesInternal(textureType, init) {
        let session = this.session;
        let views = session.internalViews;
        if (!views || views.length === 0) {
            console.warn("We can't allocate color textures without views");
            return;
        }
        this.initializeIfNeeded();
        if (this.layout === XRLayerLayout.mono) {
            if (textureType === XRTextureType['texture-array']) {
                const newTexture = this._createNewColorTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.colorFormat);
                this._texturesMeta = [newTexture];
                this._colorTextures = [newTexture.texture];
                return;
            }
            else {
                const newTexture = this._createNewColorTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.colorFormat);
                this._texturesMeta = [newTexture];
                this._colorTextures = [newTexture.texture];
                return;
            }
        }
        else if (this.layout === XRLayerLayout.stereo) {
            if (textureType === XRTextureType['texture-array']) {
                const newTexture = this._createNewColorTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.colorFormat, 2);
                this._texturesMeta = [newTexture];
                this._colorTextures = [newTexture.texture];
                return;
            }
            else {
                const texture1 = this._createNewColorTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.colorFormat);
                const texture2 = this._createNewColorTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.colorFormat);
                this._texturesMeta = [texture1, texture2];
                this._colorTextures = [texture1.texture, texture2.texture];
                return;
            }
        }
        else if (this.layout === XRLayerLayout['stereo-left-right']) {
            const newTexture = this._createNewColorTexture(init.viewPixelWidth * 2, init.viewPixelHeight, textureType, init.colorFormat);
            this._texturesMeta = [newTexture];
            this._colorTextures = [newTexture.texture];
            return;
        }
        else if (this.layout === XRLayerLayout['stereo-top-bottom']) {
            const newTexture = this._createNewColorTexture(init.viewPixelWidth, init.viewPixelHeight * 2, textureType, init.colorFormat);
            this._texturesMeta = [newTexture];
            this._colorTextures = [newTexture.texture];
            return;
        }
    }
    _allocateDepthStencilTexturesInternal(textureType, init) {
        if (!init.depthFormat) {
            this._depthStencilTextures = [];
            return;
        }
        if (this._getSupportedDepthFormats().indexOf(init.depthFormat) < 0) {
            throw new Error('Depth format provided is not supported in non-projection layers.');
        }
        if (init.mipLevels < 1) {
            throw new Error('Invalid miplevel. Miplevel needs to be >= 1');
        }
        if (this.layout === XRLayerLayout.mono) {
            if (textureType === XRTextureType['texture-array']) {
                const newTexture = this._createNewDepthStencilTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.depthFormat);
                this._depthStencilTextures = [newTexture.texture];
                return;
            }
            else {
                const newTexture = this._createNewColorTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.depthFormat);
                this._depthStencilTextures = [newTexture.texture];
                return;
            }
        }
        else if (this.layout === XRLayerLayout.stereo) {
            if (textureType === XRTextureType['texture-array']) {
                const newTexture = this._createNewDepthStencilTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.depthFormat, 2);
                this._depthStencilTextures = [newTexture.texture];
                return;
            }
            else {
                const texture1 = this._createNewDepthStencilTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.depthFormat);
                const texture2 = this._createNewDepthStencilTexture(init.viewPixelWidth, init.viewPixelHeight, textureType, init.depthFormat);
                this._depthStencilTextures = [texture1.texture, texture2.texture];
                return;
            }
        }
        else if (this.layout === XRLayerLayout['stereo-left-right']) {
            const newTexture = this._createNewDepthStencilTexture(init.viewPixelWidth * 2, init.viewPixelHeight, textureType, init.depthFormat);
            this._depthStencilTextures = [newTexture.texture];
            return;
        }
        else if (this.layout === XRLayerLayout['stereo-top-bottom']) {
            const newTexture = this._createNewDepthStencilTexture(init.viewPixelWidth, init.viewPixelHeight * 2, textureType, init.depthFormat);
            this._depthStencilTextures = [newTexture.texture];
            return;
        }
    }
    _createNewColorTexture(width, height, textureType, colorFormat, layers = 1) {
        return this._createGenericPolyfillTexture(textureType, width, height, colorFormat, 0, layers);
    }
    _createNewDepthStencilTexture(width, height, textureType, depthFormat, layers = 1) {
        return this._createGenericPolyfillTexture(textureType, width, height, depthFormat, 0, layers);
    }
    _createGenericPolyfillTexture(textureType, width, height, textureFormat, mipmapLevel = 0, numLayers = 1) {
        if (textureType === XRTextureType['texture-array'] && numLayers <= 1) {
            console.warn('creating a texture array with a single layer...');
        }
        if (textureType === XRTextureType['texture-array'] &&
            this.context instanceof WebGLRenderingContext) {
            throw new Error('WebGL 1 does not support texture array');
        }
        let texture = this.context.createTexture();
        let textureMeta = {
            width,
            height,
            layers: numLayers,
            type: textureType,
            textureFormat: textureFormat,
            texture,
        };
        let internalFormat = textureFormat;
        let texImageType = this.context.UNSIGNED_BYTE;
        if (this.context instanceof WebGL2RenderingContext) {
            const expectedFormats = getFormatsFromInternalFormat(this.context, textureFormat);
            internalFormat = expectedFormats.internalFormat;
            textureFormat = expectedFormats.textureFormat;
            texImageType = expectedFormats.type;
        }
        else {
            if (textureFormat === this.context.DEPTH_COMPONENT) {
                texImageType = this.context.UNSIGNED_INT;
            }
            if (textureFormat === this.context.DEPTH_STENCIL) {
                texImageType = this.context.UNSIGNED_INT_24_8_WEBGL;
            }
        }
        if (textureType === XRTextureType['texture-array'] &&
            this.context instanceof WebGL2RenderingContext) {
            console.warn('texture-array layers are supported...questionably in the polyfill at the moment. Use at your own risk.');
            const existingTextureBinding = this.context.getParameter(this.context.TEXTURE_BINDING_2D_ARRAY);
            this.context.bindTexture(this.context.TEXTURE_2D_ARRAY, texture);
            if (this._getSupportedDepthFormats().indexOf(textureFormat) >= 0) {
                this.context.texStorage3D(this.context.TEXTURE_2D_ARRAY, 1, internalFormat, width, height, numLayers);
            }
            else {
                this.context.texImage3D(this.context.TEXTURE_2D_ARRAY, 0, internalFormat, width, height, numLayers, 0, textureFormat, texImageType, null);
            }
            this.context.bindTexture(this.context.TEXTURE_2D_ARRAY, existingTextureBinding);
        }
        else {
            const existingTextureBinding = this.context.getParameter(this.context.TEXTURE_BINDING_2D);
            this.context.bindTexture(this.context.TEXTURE_2D, texture);
            this.context.texImage2D(this.context.TEXTURE_2D, 0, internalFormat, width, height, 0, textureFormat, texImageType, null);
            this.context.bindTexture(this.context.TEXTURE_2D, existingTextureBinding);
        }
        return textureMeta;
    }
    _getSupportedDepthFormats() {
        const supportedDepthFormats = [];
        if (this.context instanceof WebGLRenderingContext) {
            if (!this.context.getExtension('WEBGL_depth_texture')) {
                return supportedDepthFormats;
            }
        }
        supportedDepthFormats.push(this.context.DEPTH_COMPONENT, this.context.DEPTH_STENCIL);
        if (this.context instanceof WebGL2RenderingContext) {
            supportedDepthFormats.push(this.context.DEPTH_COMPONENT24, this.context.DEPTH24_STENCIL8);
        }
        return supportedDepthFormats;
    }
}

const defaultCylinderLayerInit = {
    colorFormat: 0x1908,
    mipLevels: 1,
    layout: XRLayerLayout.mono,
    isStatic: false,
    space: null,
    viewPixelHeight: 0,
    viewPixelWidth: 0,
    textureType: XRTextureType.texture,
    radius: 2.0,
    centralAngle: 0.78539,
    aspectRatio: 2.0,
};
const defaultMediaCylinderLayerInit = {
    layout: XRLayerLayout.mono,
    invertStereo: false,
    space: null,
    radius: 2.0,
    centralAngle: 0.78539,
};
class XRCylinderLayer extends XRCompositionLayerPolyfill {
    constructor(init, media) {
        super();
        this._media = media !== null && media !== void 0 ? media : null;
        if (this.isMediaLayer()) {
            this.init = Object.assign(Object.assign({}, defaultMediaCylinderLayerInit), init);
        }
        else {
            this.init = Object.assign(Object.assign({}, defaultCylinderLayerInit), init);
        }
        this.radius = this.init.radius;
        this.centralAngle = this.init.centralAngle;
        this.aspectRatio = this.init.aspectRatio;
        this.space = this.init.space;
        this.layout = this.init.layout;
        const _global = getGlobal();
        if (this.init.transform) {
            this.transform = new _global.XRRigidTransform(init.transform.position, init.transform.orientation);
        }
        else {
            this.transform = new _global.XRRigidTransform({
                x: 0,
                y: 0,
                z: 0,
                w: 1,
            });
        }
        if (!this.isMediaLayer()) {
            this.isStatic = init.isStatic;
        }
    }
    getTextureType() {
        if (this.isMediaLayer()) {
            return XRTextureType.texture;
        }
        return this.init.textureType;
    }
    _deferredInitialize() {
        let layout = this.determineLayoutAttribute(this.init.textureType, this.context, this.init.layout);
        this.layout = layout;
        this.needsRedraw = true;
    }
    get colorTextures() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateColorTexturesInternal(this.getTextureType(), this.init);
        }
        return this._colorTextures;
    }
    get depthStencilTextures() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._depthStencilTextures || !this._depthStencilTextures.length) {
            this._allocateDepthStencilTexturesInternal(this.getTextureType(), this.init);
        }
        return this._depthStencilTextures;
    }
    get colorTexturesMeta() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateColorTexturesInternal(this.getTextureType(), this.init);
        }
        return this._texturesMeta;
    }
    get width() {
        const circumference = 2 * this.radius * Math.PI;
        const percentage = this.centralAngle / (2 * Math.PI);
        return circumference * percentage;
    }
    get height() {
        return this.width / this.aspectRatio;
    }
}

const defaultEquirectLayerInit = {
    colorFormat: 0x1908,
    mipLevels: 1,
    layout: XRLayerLayout.mono,
    isStatic: false,
    space: null,
    viewPixelHeight: 0,
    viewPixelWidth: 0,
    textureType: XRTextureType.texture,
    radius: 0,
    centralHorizontalAngle: 6.28318,
    upperVerticalAngle: 1.570795,
    lowerVerticalAngle: -1.570795,
};
const defaultMediaEquirectLayerInit = {
    space: null,
    layout: XRLayerLayout.mono,
    invertStereo: false,
    radius: 0,
    centralHorizontalAngle: 6.28318,
    upperVerticalAngle: 1.570795,
    lowerVerticalAngle: -1.570795,
};
class XREquirectLayer extends XRCompositionLayerPolyfill {
    constructor(init, media) {
        super();
        this._media = media !== null && media !== void 0 ? media : null;
        if (this.isMediaLayer()) {
            this.init = Object.assign(Object.assign({}, defaultMediaEquirectLayerInit), init);
        }
        else {
            this.init = Object.assign(Object.assign({}, defaultEquirectLayerInit), init);
        }
        if (!isReferenceSpace(this.init.space)) {
            throw new TypeError("Equirect layer's space needs to be an XRReferenceSpace");
        }
        this.radius = this.init.radius;
        this.centralHorizontalAngle = this.init.centralHorizontalAngle;
        this.upperVerticalAngle = this.init.upperVerticalAngle;
        this.lowerVerticalAngle = this.init.lowerVerticalAngle;
        this.space = this.init.space;
        this.layout = this.init.layout;
        const _global = getGlobal();
        if (init.transform) {
            this.transform = new _global.XRRigidTransform(init.transform.position, init.transform.orientation);
        }
        else {
            this.transform = new _global.XRRigidTransform({
                x: 0,
                y: 0,
                z: 0,
                w: 1,
            });
        }
        if (!this.isMediaLayer()) {
            this.isStatic = init.isStatic;
        }
    }
    getTextureType() {
        if (this.isMediaLayer()) {
            return XRTextureType.texture;
        }
        return this.init.textureType;
    }
    _deferredInitialize() {
        let layout = this.determineLayoutAttribute(this.init.textureType, this.context, this.init.layout);
        this.layout = layout;
        this.needsRedraw = true;
    }
    get colorTextures() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateColorTexturesInternal(this.getTextureType(), this.init);
        }
        return this._colorTextures;
    }
    get depthStencilTextures() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._depthStencilTextures || !this._depthStencilTextures.length) {
            this._allocateDepthStencilTexturesInternal(this.getTextureType(), this.init);
        }
        return this._depthStencilTextures;
    }
    get colorTexturesMeta() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateColorTexturesInternal(this.getTextureType(), this.init);
        }
        return this._texturesMeta;
    }
}

const defaultQuadLayerInit = {
    colorFormat: 0x1908,
    mipLevels: 1,
    layout: XRLayerLayout.mono,
    isStatic: false,
    space: null,
    viewPixelHeight: 0,
    viewPixelWidth: 0,
    textureType: XRTextureType.texture,
    width: 1.0,
    height: 1.0,
};
const defaultMediaQuadLayerInit = {
    space: null,
    layout: XRLayerLayout.mono,
    invertStereo: false,
};
class XRQuadLayer extends XRCompositionLayerPolyfill {
    constructor(init, media) {
        super();
        this._media = media !== null && media !== void 0 ? media : null;
        if (this.isMediaLayer()) {
            this.init = Object.assign(Object.assign({}, defaultMediaQuadLayerInit), init);
        }
        else {
            this.init = Object.assign(Object.assign({}, defaultQuadLayerInit), init);
        }
        this.width = this.init.width;
        this.height = this.init.height;
        this.space = this.init.space;
        this.layout = this.init.layout;
        const _global = getGlobal();
        if (this.init.transform) {
            this.transform = new _global.XRRigidTransform(init.transform.position, init.transform.orientation);
        }
        else {
            this.transform = new _global.XRRigidTransform({
                x: 0,
                y: 0,
                z: 0,
                w: 1,
            });
        }
        if (!this.isMediaLayer()) {
            this.isStatic = init.isStatic;
        }
    }
    getTextureType() {
        if (this.isMediaLayer()) {
            return XRTextureType.texture;
        }
        return this.init.textureType;
    }
    _deferredInitialize() {
        let layout = this.determineLayoutAttribute(this.init.textureType, this.context, this.init.layout);
        this.layout = layout;
        this.needsRedraw = true;
    }
    get colorTextures() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateColorTexturesInternal(this.getTextureType(), this.init);
        }
        return this._colorTextures;
    }
    get depthStencilTextures() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._depthStencilTextures || !this._depthStencilTextures.length) {
            this._allocateDepthStencilTexturesInternal(this.getTextureType(), this.init);
        }
        return this._depthStencilTextures;
    }
    get colorTexturesMeta() {
        if (this.isMediaLayer()) {
            throw new Error('Media layers do not have associated textures');
        }
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateColorTexturesInternal(this.getTextureType(), this.init);
        }
        return this._texturesMeta;
    }
}

class XRMediaBindingPolyfill {
    constructor(session) {
        this.session = session;
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
    }
    createQuadLayer(video, init) {
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (init.layout === XRLayerLayout.default) {
            throw new TypeError('Media Quad layer cannot be created with layout of default');
        }
        let aspectRatio = this.calculateAspectRatio(video, init.layout);
        if (init.width === undefined && init.height === undefined) {
            init.width = 1;
        }
        if (init.height === undefined) {
            init.height = init.width / aspectRatio;
        }
        if (init.width === undefined) {
            init.width = init.height / aspectRatio;
        }
        let layer = new XRQuadLayer(init, video);
        layer.needsRedraw = false;
        layer.initialize(this.session);
        return layer;
    }
    createCylinderLayer(video, init) {
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (init.layout === XRLayerLayout.default) {
            throw new TypeError('Media Cylinder layer cannot be created with layout of default');
        }
        let aspectRatio = this.calculateAspectRatio(video, init.layout);
        if (init.aspectRatio === undefined) {
            init.aspectRatio = aspectRatio;
        }
        let layer = new XRCylinderLayer(init, video);
        layer.needsRedraw = false;
        layer.initialize(this.session);
        return layer;
    }
    createEquirectLayer(video, init) {
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (init.layout === XRLayerLayout.default) {
            throw new TypeError('Media Equirect layer cannot be created with layout of default');
        }
        if (!isReferenceSpace(init.space)) {
            throw new Error("Media Equirect layer's space must be of type XRReferenceSpace");
        }
        let layer = new XREquirectLayer(init, video);
        layer.needsRedraw = false;
        layer.initialize(this.session);
        return layer;
    }
    calculateAspectRatio(video, layout) {
        let width = video.videoWidth;
        let height = video.videoHeight;
        if (layout === XRLayerLayout['stereo-left-right']) {
            width /= 2;
        }
        if (layout === XRLayerLayout['stereo-top-bottom']) {
            height /= 2;
        }
        return width / height;
    }
}

const defaultXRProjectionLayerInit = {
    textureType: XRTextureType.texture,
    colorFormat: 0x1908,
    depthFormat: 0x1902,
    scaleFactor: 1.0,
};
class XRProjectionLayer extends XRCompositionLayerPolyfill {
    constructor(init = defaultXRProjectionLayerInit) {
        super();
        this.init = Object.assign(Object.assign({}, defaultXRProjectionLayerInit), init);
    }
    initialize(session, context) {
        super.initialize(session, context);
        this.initializeIfNeeded();
        let baseLayer = session.getBaseLayer();
        this.textureWidth = baseLayer.framebufferWidth * this.init.scaleFactor;
        this.textureHeight = baseLayer.framebufferHeight * this.init.scaleFactor;
    }
    _allocateProjectionColorTextures() {
        let array = [];
        let polyFillArray = [];
        const createTextureArray = () => {
            array = [];
            for (let tex of polyFillArray) {
                array.push(tex.texture);
            }
        };
        let session = this.session;
        let views = session.internalViews;
        if (!views || views.length === 0) {
            console.warn("We can't allocate color textures without views");
            return;
        }
        let baseLayer = session.getBaseLayer();
        let numViews = views.length;
        let width = baseLayer.framebufferWidth * this.init.scaleFactor / views.length;
        let height = baseLayer.framebufferHeight * this.init.scaleFactor;
        if (this.layout === XRLayerLayout.mono || this.layout === XRLayerLayout.default) {
            if (this.init.textureType === XRTextureType['texture-array']) {
                let texture = this._createNewColorTexture(width, height, XRTextureType['texture-array'], this.init.colorFormat, numViews);
                polyFillArray = [texture];
            }
            else {
                for (let view of views) {
                    let texture = this._createNewColorTexture(width, height, XRTextureType.texture, this.init.colorFormat);
                    polyFillArray.push(texture);
                }
            }
            createTextureArray();
            this._colorTexturesMeta = polyFillArray;
            this._colorTextures = array;
            return;
        }
        if (this.layout === XRLayerLayout['stereo-left-right']) {
            let texture = this._createNewColorTexture(width * numViews, height, this.init.textureType, this.init.colorFormat);
            polyFillArray = [texture];
        }
        else if (this.layout === XRLayerLayout['stereo-top-bottom']) {
            let texture = this._createNewColorTexture(width, height * numViews, this.init.textureType, this.init.colorFormat);
            polyFillArray = [texture];
        }
        createTextureArray();
        this._colorTexturesMeta = polyFillArray;
        this._colorTextures = array;
        return;
    }
    _allocateProjectionDepthStencilTextures() {
        let session = this.session;
        let views = session.internalViews;
        if (!views || views.length === 0) {
            return;
        }
        if (this.init.depthFormat === 0) {
            this._depthStencilTextures = [];
            return;
        }
        if (this.context instanceof WebGLRenderingContext) {
            let depthExtension = this.context.getExtension('WEBGL_depth_texture');
            if (!depthExtension) {
                this._depthStencilTextures = [];
                return;
            }
        }
        let array = [];
        let polyFillArray = [];
        const createTextureArray = () => {
            array = [];
            for (let tex of polyFillArray) {
                array.push(tex.texture);
            }
        };
        this.initializeIfNeeded();
        let baseLayer = session.getBaseLayer();
        let numViews = views.length;
        let width = baseLayer.framebufferWidth * this.init.scaleFactor / views.length;
        let height = baseLayer.framebufferHeight * this.init.scaleFactor;
        if (this.layout === XRLayerLayout.mono || this.layout === XRLayerLayout.default) {
            if (this.init.textureType === XRTextureType['texture-array']) {
                let texture = this._createNewDepthStencilTexture(width, height, this.init.textureType, this.init.depthFormat, numViews);
                polyFillArray = [texture];
            }
            else {
                for (let view of views) {
                    let texture = this._createNewDepthStencilTexture(width, height, this.init.textureType, this.init.depthFormat);
                    polyFillArray.push(texture);
                }
            }
            createTextureArray();
            this._depthStencilTextures = array;
            return;
        }
        if (this.layout === XRLayerLayout['stereo-left-right']) {
            let texture = this._createNewDepthStencilTexture(width * numViews, height, this.init.textureType, this.init.depthFormat);
            polyFillArray = [texture];
        }
        else if (this.layout === XRLayerLayout['stereo-top-bottom']) {
            let texture = this._createNewDepthStencilTexture(width, height * numViews, this.init.textureType, this.init.depthFormat);
            polyFillArray = [texture];
        }
        createTextureArray();
        this._depthStencilTextures = array;
        return;
    }
    get colorTextures() {
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateProjectionColorTextures();
        }
        return this._colorTextures;
    }
    get depthStencilTextures() {
        if (this._depthStencilTextures === undefined) {
            this._allocateProjectionDepthStencilTextures();
        }
        return this._depthStencilTextures || [];
    }
    get colorTexturesMeta() {
        if (!this._colorTextures || !this._colorTextures.length) {
            this._allocateProjectionColorTextures();
        }
        return this._colorTexturesMeta;
    }
    getTextureType() {
        return this.init.textureType;
    }
    _deferredInitialize() {
        this.isStatic = false;
        this.ignoreDepthValues = false;
        this.fixedFoveation = 0;
        let layout = this.determineLayoutAttribute(this.init.textureType, this.context, XRLayerLayout.default);
        this.layout = layout;
        this.needsRedraw = true;
        let maxScaleFactor = this.determineMaximumScaleFactor();
        let scaleFactor = Math.min(this.init.scaleFactor, maxScaleFactor);
        this.init.scaleFactor = scaleFactor;
    }
    determineMaximumScaleFactor() {
        let baseLayer = this.session.getBaseLayer(this.context);
        let largestWidth = baseLayer.framebufferWidth;
        let largestHeight = baseLayer.framebufferHeight;
        if (this.layout === XRLayerLayout['stereo-left-right']) {
            largestWidth *= 2;
        }
        if (this.layout === XRLayerLayout['stereo-top-bottom']) {
            largestHeight *= 2;
        }
        let largestViewDimension = Math.max(largestWidth, largestHeight);
        let largestTextureDimension = this.context.getParameter(this.context.MAX_TEXTURE_SIZE);
        return largestTextureDimension / largestViewDimension;
    }
}

const initializeViewport = (viewport, texture, layout, offset, numViews) => {
    let x = 0;
    let y = 0;
    let width = texture.width;
    let height = texture.height;
    if (layout === XRLayerLayout['stereo-left-right']) {
        x = (texture.width * offset) / numViews;
        width = texture.width / numViews;
    }
    else if (layout === XRLayerLayout['stereo-top-bottom']) {
        y = (texture.height * offset) / numViews;
        height = texture.height / numViews;
    }
    viewport.x = x;
    viewport.y = y;
    viewport.width = width;
    viewport.height = height;
};

const compileShader = (gl, shaderSource, shaderType) => {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        throw 'could not compile shader:' + gl.getShaderInfoLog(shader);
    }
    return shader;
};
const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    const compiledVS = compileShader(gl, vertexShader, gl.VERTEX_SHADER);
    const compiledFS = compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
    gl.attachShader(program, compiledVS);
    gl.attachShader(program, compiledFS);
    gl.deleteShader(compiledVS);
    gl.deleteShader(compiledFS);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw 'program failed to link:' + gl.getProgramInfoLog(program);
    }
    return program;
};
const setRectangle = (gl, x, y, width, height) => {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.DYNAMIC_DRAW);
};
const applyVAOExtension = (gl) => {
    if (gl instanceof WebGL2RenderingContext) {
        return gl;
    }
    const ext = gl.getExtension('OES_vertex_array_object');
    if (!ext) {
        throw new Error('Cannot use VAOs.');
    }
    return {
        VERTEX_ARRAY_BINDING: ext.VERTEX_ARRAY_BINDING_OES,
        bindVertexArray: ext.bindVertexArrayOES.bind(ext),
        createVertexArray: ext.createVertexArrayOES.bind(ext),
        deleteVertexArray: ext.deleteVertexArrayOES.bind(ext),
        isVertexArray: ext.isVertexArrayOES.bind(ext),
    };
};

const glsl = (x) => x;
const vertexShader = glsl`
attribute vec2 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}
`;
const fragmentShader = glsl`
precision mediump float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
   	vec4 tex = texture2D(u_image, v_texCoord);
	gl_FragColor = vec4(tex.rgb, tex.a);
}
`;
class ProjectionRenderer {
    constructor(layer, context) {
        this.gl = context;
        this.layer = layer;
        this.program = createProgram(this.gl, vertexShader, fragmentShader);
        this.programInfo = {
            attribLocations: {
                a_position: this.gl.getAttribLocation(this.program, 'a_position'),
                a_texCoord: this.gl.getAttribLocation(this.program, 'a_texCoord'),
            },
        };
        this._createVAOs();
    }
    render(session) {
        let gl = this.gl;
        let baseLayer = session.getBaseLayer();
        gl.viewport(0, 0, baseLayer.framebufferWidth, baseLayer.framebufferHeight);
        const textureType = this.layer.getTextureType();
        const existingTextureBinding = gl.getParameter(gl.TEXTURE_BINDING_2D);
        const existingActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        if (textureType === XRTextureType.texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.layer.colorTextures[0]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
        else {
            throw new Error(`Created a texture projection renderer instead of a texture-array projection renderer for a texture-array layer.
This is probably an error with the polyfill itself; please file an issue on Github if you run into this.`);
        }
        for (let view of session.internalViews) {
            let viewport = baseLayer.getViewport(view);
            gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
            if (this._shouldUseStereoTexturePoints()) {
                this._renderInternalStereo(view);
            }
            else {
                this._renderInternal();
            }
        }
        gl.activeTexture(existingActiveTexture);
        gl.bindTexture(gl.TEXTURE_2D, existingTextureBinding);
    }
    _renderInternal() {
        let gl = this.gl;
        const existingProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        gl.useProgram(this.program);
        this.vaoGl.bindVertexArray(this.vao);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
        this.vaoGl.bindVertexArray(null);
        gl.useProgram(existingProgram);
    }
    _renderInternalStereo(view) {
        if (view.eye === 'none') {
            return this._renderInternal();
        }
        let gl = this.gl;
        this.vaoGl.bindVertexArray(this.vao);
        const existingProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        gl.useProgram(this.program);
        this._setStereoTextureBuffer(view.eye === 'right' ? 1 : 0);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
        this.vaoGl.bindVertexArray(null);
        gl.useProgram(existingProgram);
    }
    _createVAOs() {
        this._createTextureUVs();
        let gl = this.gl;
        this.vaoGl = applyVAOExtension(gl);
        let positionBuffer = gl.createBuffer();
        this.vao = this.vaoGl.createVertexArray();
        this.vaoGl.bindVertexArray(this.vao);
        gl.enableVertexAttribArray(this.programInfo.attribLocations.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setRectangle(gl, 0, 0, 1.0, 1.0);
        let size = 2;
        let type = gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        gl.vertexAttribPointer(this.programInfo.attribLocations.a_position, size, type, normalize, stride, offset);
        this.texcoordBuffer = gl.createBuffer();
        gl.enableVertexAttribArray(this.programInfo.attribLocations.a_texCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texturePoints, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(this.programInfo.attribLocations.a_texCoord, size, type, normalize, stride, offset);
        this.vaoGl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    _setStereoTextureBuffer(index) {
        let gl = this.gl;
        gl.enableVertexAttribArray(this.programInfo.attribLocations.a_texCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.stereoTexturePoints[index], gl.STATIC_DRAW);
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(this.programInfo.attribLocations.a_texCoord, size, type, normalize, stride, offset);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    _createTextureUVs() {
        this.texturePoints = new Float32Array([
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            1.0,
            0.0,
            1.0,
            1.0,
            0.0,
            1.0,
            1.0,
        ]);
        const viewport = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        };
        if (this._shouldUseStereoTexturePoints()) {
            this.stereoTexturePoints = [];
            initializeViewport(viewport, this.layer.colorTexturesMeta[0], this.layer.layout, 0, 2);
            this.stereoTexturePoints[0] = this._offsetTextureUVsByRect(this.layer.colorTexturesMeta[0], this.texturePoints, viewport);
            initializeViewport(viewport, this.layer.colorTexturesMeta[0], this.layer.layout, 1, 2);
            this.stereoTexturePoints[1] = this._offsetTextureUVsByRect(this.layer.colorTexturesMeta[0], this.texturePoints, viewport);
        }
    }
    _offsetTextureUVsByRect(texture, inArray, textureRect) {
        textureRect = textureRect !== null && textureRect !== void 0 ? textureRect : {
            x: 0,
            y: 0,
            width: texture.width,
            height: texture.height,
        };
        const uX = textureRect.x / texture.width;
        const vY = textureRect.y / texture.height;
        const uW = textureRect.width / texture.width;
        const vH = textureRect.height / texture.height;
        const outArray = [];
        for (let i = 0; i < inArray.length; i += 2) {
            let u = inArray[i];
            let v = inArray[i + 1];
            let newU = u * uW + uX;
            let newV = v * vH + vY;
            outArray[i] = newU;
            outArray[i + 1] = newV;
        }
        return new Float32Array(outArray);
    }
    _shouldUseStereoTexturePoints() {
        return (this.layer.layout === XRLayerLayout['stereo-left-right'] ||
            this.layer.layout === XRLayerLayout['stereo-top-bottom']);
    }
}
const texArrayVertexShader = glsl`#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;

void main() {
	// convert the rectangle from pixels to 0.0 to 1.0
	vec2 zeroToOne = a_position;

	// convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// convert from 0->2 to -1->+1 (clipspace)
	vec2 clipSpace = zeroToTwo - 1.0;

	gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);

	// pass the texCoord to the fragment shader
	// The GPU will interpolate this value between points.
	v_texCoord = a_texCoord;
}
`;
const texArrayFragmentShader = glsl`#version 300 es
precision mediump float;
precision mediump int;
precision mediump sampler2DArray;

uniform sampler2DArray u_image;
uniform int u_layer;

in vec2 v_texCoord;

out vec4 fragColor;

void main() {
	vec4 tex = texture(u_image, vec3(v_texCoord.x, v_texCoord.y, u_layer));
 	fragColor = vec4(tex.rgb, tex.a);
}

`;
class ProjectionTextureArrayRenderer extends ProjectionRenderer {
    constructor(layer, context) {
        super(layer, context);
        this.program = createProgram(this.gl, texArrayVertexShader, texArrayFragmentShader);
        this._createVAOs();
        this.u_layerInfo = this.gl.getUniformLocation(this.program, 'u_layer');
    }
    render(session) {
        let gl = this.gl;
        let textureType = this.layer.getTextureType();
        if (textureType === XRTextureType.texture) {
            throw new Error('Using texture array projection renderer on a layer without texture array.');
        }
        let baseLayer = session.getBaseLayer();
        const existingTextureBinding = gl.getParameter(gl.TEXTURE_BINDING_2D_ARRAY);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.layer.colorTextures[0]);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        for (let view of session.internalViews) {
            let index = session.getViewIndex(view);
            let viewport = baseLayer.getViewport(view);
            gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
            this._renderInternal(index);
        }
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, existingTextureBinding);
    }
    _renderInternal(layer = 0) {
        let gl = this.gl;
        const existingProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        gl.uniform1i(this.u_layerInfo, layer);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
        gl.bindVertexArray(null);
        gl.useProgram(existingProgram);
    }
}
const createProjectionRenderer = (layer, context) => {
    if (layer.getTextureType() === XRTextureType['texture-array']) {
        if (context instanceof WebGL2RenderingContext) {
            return new ProjectionTextureArrayRenderer(layer, context);
        }
    }
    return new ProjectionRenderer(layer, context);
};

var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;
    while (i--) {
        y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
};

function create() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
}
function multiply(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}
function fromQuat(out, q) {
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

function create$1() {
    var out = new ARRAY_TYPE(2);
    if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
    }
    return out;
}
(function () {
    var vec = create$1();
    return function (a, stride, offset, count, fn, arg) {
        var i, l;
        if (!stride) {
            stride = 2;
        }
        if (!offset) {
            offset = 0;
        }
        if (count) {
            l = Math.min(count * stride + offset, a.length);
        } else {
            l = a.length;
        }
        for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
        }
        return a;
    };
})();

const glsl$1 = (x) => x;
const vertexShader$1 = glsl$1`
attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
uniform mat4 u_projectionMatrix;

varying vec2 v_texCoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projectionMatrix * u_matrix * a_position;

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}
`;
const fragmentShader$1 = glsl$1`
precision mediump float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
   	vec4 tex = texture2D(u_image, v_texCoord);
	gl_FragColor = vec4(tex.rgb, tex.a);
	// gl_FragColor = vec4(1.0, 0, 0, 1.0);
}
`;
const texArrayVertexShader$1 = glsl$1`#version 300 es

in vec4 a_position;
in vec2 a_texCoord;

uniform mat4 u_matrix;
uniform mat4 u_projectionMatrix;

out vec2 v_texCoord;

void main() {
	// Multiply the position by the matrix.
    gl_Position = u_projectionMatrix * u_matrix * a_position;

	// pass the texCoord to the fragment shader
	// The GPU will interpolate this value between points.
	v_texCoord = a_texCoord;
}
`;
const texArrayFragmentShader$1 = glsl$1`#version 300 es
precision mediump float;
precision mediump int;
precision mediump sampler2DArray;

uniform sampler2DArray u_image;
uniform int u_layer;

in vec2 v_texCoord;

out vec4 fragColor;

void main() {
	vec4 tex = texture(u_image, vec3(v_texCoord.x, v_texCoord.y, u_layer));
 	fragColor = vec4(tex.rgb, tex.a);
}

`;
class CompositionLayerRenderer {
    constructor(layer, context) {
        this.usesTextureArrayShaders = false;
        this.savedVaoState = { vao: null, arrayBuffer: null };
        this.hasMipmap = false;
        this.gl = context;
        this.layer = layer;
        let gl = this.gl;
        this.transformMatrix = create();
        if (context instanceof WebGL2RenderingContext &&
            this.layer.getTextureType() === XRTextureType['texture-array']) {
            this.usesTextureArrayShaders = true;
        }
        if (this.usesTextureArrayShaders) {
            this.program = createProgram(gl, texArrayVertexShader$1, texArrayFragmentShader$1);
        }
        else {
            this.program = createProgram(gl, vertexShader$1, fragmentShader$1);
        }
        this.programInfo = {
            attribLocations: {
                a_position: gl.getAttribLocation(this.program, 'a_position'),
                a_texCoord: gl.getAttribLocation(this.program, 'a_texCoord'),
            },
            uniformLocations: {
                u_matrix: gl.getUniformLocation(this.program, 'u_matrix'),
                u_projectionMatrix: gl.getUniformLocation(this.program, 'u_projectionMatrix'),
            },
        };
        if (this.usesTextureArrayShaders) {
            this.programInfo.uniformLocations.u_layer = gl.getUniformLocation(this.program, 'u_layer');
        }
    }
    saveVaoState() {
        this.savedVaoState.vao = this.gl.getParameter(this.vaoGl.VERTEX_ARRAY_BINDING);
        this.savedVaoState.arrayBuffer = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING);
    }
    restoreVaoState() {
        this.vaoGl.bindVertexArray(this.savedVaoState.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.savedVaoState.arrayBuffer);
        this.savedVaoState.vao = this.savedVaoState.arrayBuffer = null;
    }
    initialize() {
        let gl = this.gl;
        if (this.layer.isMediaLayer()) {
            this.mediaTexture = gl.createTexture();
            this.mediaTexturePolyfill = {
                texture: this.mediaTexture,
                textureFormat: gl.RGBA,
                width: this.layer.media.videoWidth,
                height: this.layer.media.videoHeight,
                type: XRTextureType.texture,
            };
            const existingTextureBinding = gl.getParameter(gl.TEXTURE_BINDING_2D);
            gl.bindTexture(gl.TEXTURE_2D, this.mediaTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.layer.media.videoWidth, this.layer.media.videoHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindTexture(gl.TEXTURE_2D, existingTextureBinding);
        }
        this._createVAOs();
    }
    render(session, frame) {
        this.saveVaoState();
        let gl = this.gl;
        let baseLayer = session.getBaseLayer();
        let basePose = frame.getViewerPose(session.getReferenceSpace());
        const existingActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        for (let view of basePose.views) {
            let viewport = baseLayer.getViewport(view);
            gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
            gl.activeTexture(gl.TEXTURE0);
            if (this.usesTextureArrayShaders) {
                if (gl instanceof WebGLRenderingContext) {
                    throw new Error('This should never happen; texture-arrays only supported on WebGL2.');
                }
                if (this.layer.isMediaLayer()) {
                    throw new Error('This should never happen. Media layers should never be created with texture-array');
                }
                const existingTextureBinding = gl.getParameter(gl.TEXTURE_BINDING_2D_ARRAY);
                gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.layer.colorTextures[0]);
                if (this.layer.isStatic) {
                    if (this.layer.needsRedraw === true) {
                        gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
                    }
                    this.hasMipmap = true;
                }
                else {
                    this.hasMipmap = this.layer.mipLevels > 0;
                }
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, this.hasMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, this.hasMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
                let layer = 0;
                if (this.layer.layout === XRLayerLayout.stereo) {
                    switch (view.eye) {
                        case 'right':
                            layer = 1;
                            break;
                    }
                }
                if (this._shouldUseStereoTexturePoints()) {
                    this._renderInternalStereo(session, frame, view, layer);
                }
                else {
                    this._renderInternal(session, frame, view, layer);
                }
                gl.activeTexture(existingActiveTexture);
                gl.bindTexture(gl.TEXTURE_2D_ARRAY, existingTextureBinding);
            }
            else {
                const existingTextureBinding = gl.getParameter(gl.TEXTURE_BINDING_2D);
                if (this.layer.isMediaLayer()) {
                    gl.bindTexture(gl.TEXTURE_2D, this.mediaTexture);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.layer.media.videoWidth, this.layer.media.videoHeight, gl.RGBA, gl.UNSIGNED_BYTE, this.layer.media);
                }
                else if (this.layer.layout === XRLayerLayout.stereo) {
                    switch (view.eye) {
                        case 'right':
                            gl.bindTexture(gl.TEXTURE_2D, this.layer.colorTextures[1]);
                            break;
                        default:
                            gl.bindTexture(gl.TEXTURE_2D, this.layer.colorTextures[0]);
                    }
                }
                else {
                    gl.bindTexture(gl.TEXTURE_2D, this.layer.colorTextures[0]);
                }
                if (this.layer.isStatic) {
                    if (this.layer.needsRedraw === true) {
                        gl.generateMipmap(gl.TEXTURE_2D);
                    }
                    this.hasMipmap = true;
                }
                else {
                    this.hasMipmap = this.layer.mipLevels > 0;
                }
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.hasMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.hasMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
                if (this._shouldUseStereoTexturePoints()) {
                    this._renderInternalStereo(session, frame, view);
                }
                else {
                    this._renderInternal(session, frame, view);
                }
                gl.activeTexture(existingActiveTexture);
                gl.bindTexture(gl.TEXTURE_2D, existingTextureBinding);
            }
        }
        this.restoreVaoState();
    }
    createPositionPoints() {
        return new Float32Array([]);
    }
    createTextureUVs() {
        return new Float32Array([]);
    }
    _offsetTextureUVsByRect(texture, inArray, textureRect) {
        textureRect = textureRect !== null && textureRect !== void 0 ? textureRect : {
            x: 0,
            y: 0,
            width: texture.width,
            height: texture.height,
        };
        const uX = textureRect.x / texture.width;
        const vY = textureRect.y / texture.height;
        const uW = textureRect.width / texture.width;
        const vH = textureRect.height / texture.height;
        const outArray = [];
        for (let i = 0; i < inArray.length; i += 2) {
            let u = inArray[i];
            let v = inArray[i + 1];
            let newU = u * uW + uX;
            let newV = v * vH + vY;
            outArray[i] = newU;
            outArray[i + 1] = newV;
        }
        return new Float32Array(outArray);
    }
    _shouldUseStereoTexturePoints() {
        return (this.layer.layout === XRLayerLayout['stereo-left-right'] ||
            this.layer.layout === XRLayerLayout['stereo-top-bottom']);
    }
    _setStereoTextureBuffer(index) {
        let gl = this.gl;
        gl.enableVertexAttribArray(this.programInfo.attribLocations.a_texCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.stereoTexturePoints[index], gl.STATIC_DRAW);
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(this.programInfo.attribLocations.a_texCoord, size, type, normalize, stride, offset);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    _recalculateVertices() {
        this.positionPoints = this.createPositionPoints();
        this.texturePoints = this.createTextureUVs();
        const viewport = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        };
        if (this._shouldUseStereoTexturePoints()) {
            this.stereoTexturePoints = [];
            if (this.layer.isMediaLayer()) {
                initializeViewport(viewport, this.mediaTexturePolyfill, this.layer.layout, 0, 2);
                this.stereoTexturePoints[0] = this._offsetTextureUVsByRect(this.mediaTexturePolyfill, this.texturePoints, viewport);
                initializeViewport(viewport, this.mediaTexturePolyfill, this.layer.layout, 1, 2);
                this.stereoTexturePoints[1] = this._offsetTextureUVsByRect(this.mediaTexturePolyfill, this.texturePoints, viewport);
                if (this.layer.layout === XRLayerLayout['stereo-top-bottom']) {
                    [this.stereoTexturePoints[0], this.stereoTexturePoints[1]] = [
                        this.stereoTexturePoints[1],
                        this.stereoTexturePoints[0],
                    ];
                }
                return;
            }
            initializeViewport(viewport, this.layer.colorTexturesMeta[0], this.layer.layout, 0, 2);
            this.stereoTexturePoints[0] = this._offsetTextureUVsByRect(this.layer.colorTexturesMeta[0], this.texturePoints, viewport);
            initializeViewport(viewport, this.layer.colorTexturesMeta[0], this.layer.layout, 1, 2);
            this.stereoTexturePoints[1] = this._offsetTextureUVsByRect(this.layer.colorTexturesMeta[0], this.texturePoints, viewport);
            if (this.layer.layout === XRLayerLayout['stereo-top-bottom']) {
                [this.stereoTexturePoints[0], this.stereoTexturePoints[1]] = [
                    this.stereoTexturePoints[1],
                    this.stereoTexturePoints[0],
                ];
            }
        }
    }
    _createVAOs() {
        this._recalculateVertices();
        let gl = this.gl;
        this.vaoGl = applyVAOExtension(gl);
        this.saveVaoState();
        let positionBuffer = gl.createBuffer();
        this.vao = this.vaoGl.createVertexArray();
        this.vaoGl.bindVertexArray(this.vao);
        gl.enableVertexAttribArray(this.programInfo.attribLocations.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = this.positionPoints;
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(this.programInfo.attribLocations.a_position, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(this.programInfo.attribLocations.a_texCoord);
        this.texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texturePoints, gl.STATIC_DRAW);
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(this.programInfo.attribLocations.a_texCoord, size, type, normalize, stride, offset);
        this.restoreVaoState();
    }
    _renderInternal(session, frame, view, layer) {
        let gl = this.gl;
        const existingProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        gl.useProgram(this.program);
        this.vaoGl.bindVertexArray(this.vao);
        if (this.usesTextureArrayShaders) {
            gl.uniform1i(this.programInfo.uniformLocations.u_layer, layer);
        }
        this._setTransformMatrix(session, frame, view);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.u_matrix, false, this.transformMatrix);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.u_projectionMatrix, false, view.projectionMatrix);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = this.positionPoints.length / 3;
        gl.drawArrays(primitiveType, offset, count);
        this.vaoGl.bindVertexArray(null);
        gl.useProgram(existingProgram);
    }
    _renderInternalStereo(session, frame, view, layer) {
        if (view.eye === 'none') {
            return this._renderInternal(session, frame, view);
        }
        let gl = this.gl;
        this.vaoGl.bindVertexArray(this.vao);
        const existingProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        gl.useProgram(this.program);
        this._setStereoTextureBuffer(view.eye === 'right' ? 1 : 0);
        if (this.usesTextureArrayShaders) {
            gl.uniform1i(this.programInfo.uniformLocations.u_layer, layer);
        }
        this._setTransformMatrix(session, frame, view);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.u_matrix, false, this.transformMatrix);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.u_projectionMatrix, false, view.projectionMatrix);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = this.positionPoints.length / 3;
        gl.drawArrays(primitiveType, offset, count);
        this.vaoGl.bindVertexArray(null);
        gl.useProgram(existingProgram);
    }
    _setTransformMatrix(session, frame, view) {
        let objPose = frame.getPose(this.layer.space, session.getReferenceSpace());
        multiply(this.transformMatrix, objPose.transform.matrix, this.layer.transform.matrix);
        multiply(this.transformMatrix, view.transform.inverse.matrix, this.transformMatrix);
    }
}

class QuadRenderer extends CompositionLayerRenderer {
    constructor(layer, context) {
        super(layer, context);
        this.initialize();
    }
    createPositionPoints() {
        const width = this.layer.width;
        const height = this.layer.height;
        const z = 0;
        const positions = [
            -width,
            -height,
            z,
            width,
            -height,
            z,
            -width,
            height,
            z,
            -width,
            height,
            z,
            width,
            -height,
            z,
            width,
            height,
            z,
        ];
        return new Float32Array(positions);
    }
    createTextureUVs() {
        return new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]);
    }
}

class CylinderRenderer extends CompositionLayerRenderer {
    constructor(layer, context) {
        super(layer, context);
        this.segments = 16;
        this.initialize();
    }
    createPositionPoints() {
        const positions = [];
        const angle = this.layer.centralAngle;
        const height = this.layer.height;
        const radius = this.layer.radius;
        const radiansPerSegment = angle / this.segments;
        const theta = Math.PI / 2 - angle / 2;
        const unitCirclePositions = [];
        const firstUnitPoint = create$1();
        firstUnitPoint[0] = radius * Math.cos(theta);
        firstUnitPoint[1] = -radius * Math.sin(theta);
        unitCirclePositions.push(firstUnitPoint);
        for (let i = 0; i < this.segments; i++) {
            const nextPoint = create$1();
            nextPoint[0] = radius * Math.cos(theta + radiansPerSegment * (i + 1));
            nextPoint[1] = -radius * Math.sin(theta + radiansPerSegment * (i + 1));
            unitCirclePositions.push(nextPoint);
        }
        unitCirclePositions.reverse();
        for (let i = 0; i < this.segments; i++) {
            const u = unitCirclePositions[i];
            const v = unitCirclePositions[i + 1];
            positions.push(u[0], -height / 2, u[1]);
            positions.push(v[0], -height / 2, v[1]);
            positions.push(u[0], height / 2, u[1]);
            positions.push(u[0], height / 2, u[1]);
            positions.push(v[0], -height / 2, v[1]);
            positions.push(v[0], height / 2, v[1]);
        }
        return new Float32Array(positions);
    }
    createTextureUVs() {
        let textureUVs = [];
        const texturePercent = 1.0 / this.segments;
        for (let i = 0; i < this.segments; i++) {
            let leftX = texturePercent * i;
            let rightX = texturePercent * (i + 1);
            textureUVs.push(leftX, 0);
            textureUVs.push(rightX, 0);
            textureUVs.push(leftX, 1);
            textureUVs.push(leftX, 1);
            textureUVs.push(rightX, 0);
            textureUVs.push(rightX, 1);
        }
        return new Float32Array(textureUVs);
    }
}

class EquirectRenderer extends CompositionLayerRenderer {
    constructor(layer, context) {
        super(layer, context);
        this.segmentsPerAxis = 40;
        this.initialize();
    }
    createPositionPoints() {
        const positions = [];
        let radius = this.layer.radius;
        if (radius === 0) {
            radius = 25;
        }
        if (radius > 25) {
            radius = 25;
        }
        const horizAngle = this.layer.centralHorizontalAngle;
        const phi1 = this.layer.upperVerticalAngle + Math.PI / 2;
        const phi2 = this.layer.lowerVerticalAngle + Math.PI / 2;
        const startPhi = phi1;
        const endPhi = phi2;
        const startTheta = Math.PI / 2 - horizAngle / 2;
        const endTheta = startTheta + horizAngle;
        const phiRange = endPhi - startPhi;
        const thetaRange = endTheta - startTheta;
        const basePoints = [];
        for (let y = 0; y <= this.segmentsPerAxis; y++) {
            for (let x = 0; x <= this.segmentsPerAxis; x++) {
                const u = x / this.segmentsPerAxis;
                const v = y / this.segmentsPerAxis;
                let r = radius;
                let theta = endTheta - thetaRange * u;
                let phi = phiRange * v + startPhi;
                const ux = Math.cos(theta) * Math.sin(phi);
                const uy = Math.cos(phi);
                const uz = -Math.sin(theta) * Math.sin(phi);
                basePoints.push([r * ux, r * uy, r * uz]);
            }
        }
        const numVertsAround = this.segmentsPerAxis + 1;
        for (let x = 0; x < this.segmentsPerAxis; x++) {
            for (let y = 0; y < this.segmentsPerAxis; y++) {
                positions.push(...basePoints[y * numVertsAround + x]);
                positions.push(...basePoints[y * numVertsAround + x + 1]);
                positions.push(...basePoints[(y + 1) * numVertsAround + x]);
                positions.push(...basePoints[(y + 1) * numVertsAround + x]);
                positions.push(...basePoints[y * numVertsAround + x + 1]);
                positions.push(...basePoints[(y + 1) * numVertsAround + x + 1]);
            }
        }
        return new Float32Array(positions);
    }
    createTextureUVs() {
        const triUVs = [];
        const baseUVs = [];
        for (let y = 0; y <= this.segmentsPerAxis; y++) {
            for (let x = 0; x <= this.segmentsPerAxis; x++) {
                const u = x / this.segmentsPerAxis;
                const v = y / this.segmentsPerAxis;
                baseUVs.push([u, v]);
            }
        }
        const numVertsAround = this.segmentsPerAxis + 1;
        for (let x = 0; x < this.segmentsPerAxis; x++) {
            for (let y = 0; y < this.segmentsPerAxis; y++) {
                triUVs.push(...baseUVs[y * numVertsAround + x]);
                triUVs.push(...baseUVs[y * numVertsAround + x + 1]);
                triUVs.push(...baseUVs[(y + 1) * numVertsAround + x]);
                triUVs.push(...baseUVs[(y + 1) * numVertsAround + x]);
                triUVs.push(...baseUVs[y * numVertsAround + x + 1]);
                triUVs.push(...baseUVs[(y + 1) * numVertsAround + x + 1]);
            }
        }
        return new Float32Array(triUVs);
    }
}

const defaultCubeLayerInit = {
    colorFormat: 0x1908,
    mipLevels: 1,
    layout: XRLayerLayout.mono,
    isStatic: false,
    space: null,
    viewPixelHeight: 0,
    viewPixelWidth: 0,
};
class XRCubeLayer extends XRCompositionLayerPolyfill {
    constructor(init = defaultCubeLayerInit) {
        super();
        if (!isReferenceSpace(init.space)) {
            throw new TypeError("XRCubeLayer's space needs to be an XRReferenceSpace");
        }
        this.init = Object.assign(Object.assign({}, defaultCubeLayerInit), init);
        this.space = this.init.space;
        this.isStatic = this.init.isStatic;
        if (this.init.orientation) {
            this.orientation = DOMPointReadOnly.fromPoint(this.init.orientation);
        }
        else {
            this.orientation = new DOMPointReadOnly();
        }
        switch (this.init.layout) {
            case XRLayerLayout.default:
            case XRLayerLayout['stereo-left-right']:
            case XRLayerLayout['stereo-top-bottom']:
                throw new TypeError('Invalid layout format for XRCubeLayer');
        }
        this.layout = this.init.layout;
        this.needsRedraw = true;
    }
    initialize(session, context) {
        super.initialize(session, context);
        this._allocateColorTexturesInternal();
        this._allocateDepthStencilTexturesInternal();
    }
    _allocateColorTexturesInternal() {
        this._colorTextures = [];
        this._texturesMeta = [];
        if (this.layout === XRLayerLayout.mono) {
            const colorTexture = this._createCubeColorTexture();
            this._texturesMeta.push(colorTexture);
            this._colorTextures.push(colorTexture.texture);
            return;
        }
        else {
            const texture1 = this._createCubeColorTexture();
            const texture2 = this._createCubeColorTexture();
            this._texturesMeta.push(texture1, texture2);
            this._colorTextures.push(texture1.texture, texture2.texture);
            return;
        }
    }
    _allocateDepthStencilTexturesInternal() {
        this._depthStencilTextures = [];
        if (!this.init.depthFormat) {
            return;
        }
        if (this.context instanceof WebGLRenderingContext) {
            let depthExtension = this.context.getExtension('WEBGL_depth_texture');
            if (!depthExtension) {
                throw new TypeError('Depth textures not supported in the current context');
            }
        }
        if (this.layout === XRLayerLayout.mono) {
            const depthTexture = this._createCubeDepthTexture();
            this._depthStencilTextures.push(depthTexture.texture);
            return;
        }
        else {
            const texture1 = this._createCubeDepthTexture();
            const texture2 = this._createCubeDepthTexture();
            this._depthStencilTextures.push(texture1.texture, texture2.texture);
            return;
        }
    }
    _createCubeColorTexture() {
        let texture = this.context.createTexture();
        let textureMeta = {
            width: this.init.viewPixelWidth,
            height: this.init.viewPixelHeight,
            layers: 1,
            type: XRTextureType.texture,
            textureFormat: this.init.colorFormat,
            texture,
        };
        const existingTextureBinding = this.context.getParameter(this.context.TEXTURE_BINDING_CUBE_MAP);
        this.context.bindTexture(this.context.TEXTURE_CUBE_MAP, texture);
        for (let i = 0; i < 6; i++) {
            this.context.texImage2D(this.context.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, textureMeta.textureFormat, textureMeta.width, textureMeta.height, 0, textureMeta.textureFormat, this.context.UNSIGNED_BYTE, null);
        }
        this.context.bindTexture(this.context.TEXTURE_CUBE_MAP, existingTextureBinding);
        return textureMeta;
    }
    _createCubeDepthTexture() {
        let texture = this.context.createTexture();
        let textureMeta = {
            width: this.init.viewPixelWidth,
            height: this.init.viewPixelHeight,
            layers: 1,
            type: XRTextureType.texture,
            textureFormat: this.init.depthFormat,
            texture,
        };
        const existingTextureBinding = this.context.getParameter(this.context.TEXTURE_BINDING_CUBE_MAP);
        this.context.bindTexture(this.context.TEXTURE_CUBE_MAP, texture);
        let internalFormat = this.init.depthFormat;
        if (this.context instanceof WebGL2RenderingContext) {
            if (internalFormat === this.context.DEPTH_COMPONENT) {
                internalFormat = this.context.DEPTH_COMPONENT24;
            }
            if (internalFormat === this.context.DEPTH_STENCIL) {
                internalFormat = this.context.DEPTH24_STENCIL8;
            }
        }
        for (let i = 0; i < 6; i++) {
            this.context.texImage2D(this.context.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalFormat, textureMeta.width, textureMeta.height, 0, textureMeta.textureFormat, this.context.UNSIGNED_INT, null);
        }
        this.context.bindTexture(this.context.TEXTURE_CUBE_MAP, existingTextureBinding);
        return textureMeta;
    }
    getTextureType() {
        return XRTextureType.texture;
    }
}

const glsl$2 = (x) => x;
const vertexShader$2 = glsl$2`
attribute vec4 a_position;
uniform mat4 u_projectionMatrix;
uniform mat4 u_matrix;
varying vec3 v_normal;

void main() {
   gl_Position = u_projectionMatrix * u_matrix * a_position;

   v_normal = normalize(a_position.xyz);
}
`;
const fragmentShader$2 = glsl$2`
precision mediump float;

varying vec3 v_normal;

uniform samplerCube u_texture;

void main() {
   gl_FragColor = textureCube(u_texture, normalize(v_normal));
}
`;
class CubeRenderer {
    constructor(layer, gl) {
        this.savedVaoState = { vao: null, arrayBuffer: null };
        this.hasMipmap = false;
        this.layer = layer;
        this.gl = gl;
        this.transformMatrix = create();
        this.program = createProgram(gl, vertexShader$2, fragmentShader$2);
        this.programInfo = {
            attribLocations: {
                a_position: gl.getAttribLocation(this.program, 'a_position'),
            },
            uniformLocations: {
                u_matrix: gl.getUniformLocation(this.program, 'u_matrix'),
                u_texture: gl.getUniformLocation(this.program, 'u_texture'),
                u_projectionMatrix: gl.getUniformLocation(this.program, 'u_projectionMatrix'),
            },
        };
        this._createVAOs();
    }
    saveVaoState() {
        this.savedVaoState.vao = this.gl.getParameter(this.vaoGl.VERTEX_ARRAY_BINDING);
        this.savedVaoState.arrayBuffer = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING);
    }
    restoreVaoState() {
        this.vaoGl.bindVertexArray(this.savedVaoState.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.savedVaoState.arrayBuffer);
        this.savedVaoState.vao = this.savedVaoState.arrayBuffer = null;
    }
    render(session, frame) {
        this.saveVaoState();
        let gl = this.gl;
        let baseLayer = session.getBaseLayer();
        let basePose = frame.getViewerPose(session.getReferenceSpace());
        const existingActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        for (let view of basePose.views) {
            let viewport = baseLayer.getViewport(view);
            gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
            gl.activeTexture(gl.TEXTURE0);
            const existingTextureBinding = gl.getParameter(gl.TEXTURE_BINDING_CUBE_MAP);
            if (this.layer.layout === XRLayerLayout.stereo) {
                const index = view.eye === 'right' ? 1 : 0;
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.layer.colorTextures[index]);
            }
            else {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.layer.colorTextures[0]);
            }
            if (this.layer.isStatic) {
                if (this.layer.needsRedraw === true) {
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                }
                this.hasMipmap = true;
            }
            else {
                this.hasMipmap = this.layer.mipLevels > 0;
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.hasMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.hasMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            this._renderInternal(this.layer.orientation, view);
            gl.activeTexture(existingActiveTexture);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, existingTextureBinding);
        }
        this.restoreVaoState();
    }
    createPositionPoints() {
        const w = 0.5;
        const positions = [
            -w, -w, -w,
            -w, w, -w,
            w, -w, -w,
            -w, w, -w,
            w, w, -w,
            w, -w, -w,
            -w, -w, w,
            w, -w, w,
            -w, w, w,
            -w, w, w,
            w, -w, w,
            w, w, w,
            -w, w, -w,
            -w, w, w,
            w, w, -w,
            -w, w, w,
            w, w, w,
            w, w, -w,
            -w, -w, -w,
            w, -w, -w,
            -w, -w, w,
            -w, -w, w,
            w, -w, -w,
            w, -w, w,
            -w, -w, -w,
            -w, -w, w,
            -w, w, -w,
            -w, -w, w,
            -w, w, w,
            -w, w, -w,
            w, -w, -w,
            w, w, -w,
            w, -w, w,
            w, -w, w,
            w, w, -w,
            w, w, w,
        ];
        return new Float32Array(positions);
    }
    _renderInternal(orientation, view) {
        let gl = this.gl;
        const existingProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        gl.useProgram(this.program);
        this.vaoGl.bindVertexArray(this.vao);
        fromQuat(this.transformMatrix, [
            orientation.x,
            orientation.y,
            orientation.z,
            orientation.w,
        ]);
        if (!this._poseOrientationMatrix) {
            this._poseOrientationMatrix = create();
        }
        fromQuat(this._poseOrientationMatrix, [
            view.transform.inverse.orientation.x,
            view.transform.inverse.orientation.y,
            view.transform.inverse.orientation.z,
            view.transform.inverse.orientation.w,
        ]);
        multiply(this.transformMatrix, this.transformMatrix, this._poseOrientationMatrix);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.u_matrix, false, this.transformMatrix);
        gl.uniformMatrix4fv(this.programInfo.uniformLocations.u_projectionMatrix, false, view.projectionMatrix);
        gl.uniform1i(this.programInfo.uniformLocations.u_texture, 0);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = this.positionPoints.length / 3;
        gl.drawArrays(primitiveType, offset, count);
        this.vaoGl.bindVertexArray(null);
        gl.useProgram(existingProgram);
    }
    _recalculateVertices() {
        this.positionPoints = this.createPositionPoints();
    }
    _createVAOs() {
        this._recalculateVertices();
        let gl = this.gl;
        this.vaoGl = applyVAOExtension(gl);
        this.saveVaoState();
        let positionBuffer = gl.createBuffer();
        this.vao = this.vaoGl.createVertexArray();
        this.vaoGl.bindVertexArray(this.vao);
        gl.enableVertexAttribArray(this.programInfo.attribLocations.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = this.positionPoints;
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(this.programInfo.attribLocations.a_position, size, type, normalize, stride, offset);
        this.restoreVaoState();
    }
}

class XRSessionWithLayer {
    constructor() {
        this.mode = 'inline';
        this.layers = [];
        this.views = [];
        this.initializedViews = false;
        this.isPolyfillActive = false;
        this.taskQueue = [];
    }
    requestAnimationFrame(animationFrameCallback) {
        if (!this.injectedFrameCallback) {
            this.injectedFrameCallback = (time, frame) => {
                let gl = this.context;
                if (!this.initializedViews && this.referenceSpace) {
                    let pose = frame.getViewerPose(this.referenceSpace);
                    if (pose) {
                        this.views = pose.views;
                        this.initializedViews = true;
                    }
                }
                if (this.isPolyfillActive && this.initializedViews) {
                    if (!this.tempFramebuffer) {
                        this.tempFramebuffer = gl.createFramebuffer();
                    }
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.tempFramebuffer);
                    const existingClearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
                    const existingFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
                    gl.clearColor(0, 0, 0, 0);
                    for (let layer of this.layers) {
                        if (!(layer instanceof XRProjectionLayer)) {
                            continue;
                        }
                        for (let i = 0; i < layer.colorTextures.length; i++) {
                            let textureType = layer.colorTexturesMeta[i].type;
                            if (textureType === XRTextureType['texture-array']);
                            else {
                                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, layer.colorTextures[i], 0);
                                if (layer.depthStencilTextures && i < layer.depthStencilTextures.length) {
                                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, layer.depthStencilTextures[i], 0);
                                }
                                else {
                                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, null, 0);
                                }
                                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                            }
                        }
                    }
                    gl.bindFramebuffer(gl.FRAMEBUFFER, existingFrameBuffer);
                    gl.clearColor(existingClearColor[0], existingClearColor[1], existingClearColor[2], existingClearColor[3]);
                }
                animationFrameCallback(time, frame);
                if (this.isPolyfillActive && this.initializedViews) {
                    let prevBlend = gl.isEnabled(gl.BLEND);
                    let prevDepthTest = gl.isEnabled(gl.DEPTH_TEST);
                    let prevCullFace = gl.isEnabled(gl.CULL_FACE);
                    const existingFrameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
                    const existingClearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.getBaseLayer().framebuffer);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.clearColor(existingClearColor[0], existingClearColor[1], existingClearColor[2], existingClearColor[3]);
                    gl.enable(gl.BLEND);
                    gl.disable(gl.DEPTH_TEST);
                    gl.disable(gl.CULL_FACE);
                    let prevBlendSrcRGB = gl.getParameter(gl.BLEND_SRC_RGB);
                    let prevBlendSrcAlpha = gl.getParameter(gl.BLEND_SRC_ALPHA);
                    let prevBlendDestRGB = gl.getParameter(gl.BLEND_DST_RGB);
                    let prevBlendDestAlpha = gl.getParameter(gl.BLEND_DST_ALPHA);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    for (let layer of this.layers) {
                        if (!this.renderers) {
                            this.renderers = new WeakMap();
                        }
                        if (layer instanceof XRProjectionLayer) {
                            if (!this.renderers.has(layer)) {
                                this.renderers.set(layer, createProjectionRenderer(layer, this.context));
                            }
                            const renderer = this.renderers.get(layer);
                            renderer.render(this);
                        }
                        else if (layer instanceof XRQuadLayer) {
                            if (!this.renderers.has(layer)) {
                                this.renderers.set(layer, new QuadRenderer(layer, this.context));
                            }
                            const renderer = this.renderers.get(layer);
                            renderer.render(this, frame);
                        }
                        else if (layer instanceof XRCylinderLayer) {
                            if (!this.renderers.has(layer)) {
                                this.renderers.set(layer, new CylinderRenderer(layer, this.context));
                            }
                            const renderer = this.renderers.get(layer);
                            renderer.render(this, frame);
                        }
                        else if (layer instanceof XREquirectLayer) {
                            if (!this.renderers.has(layer)) {
                                this.renderers.set(layer, new EquirectRenderer(layer, this.context));
                            }
                            const renderer = this.renderers.get(layer);
                            renderer.render(this, frame);
                        }
                        else if (layer instanceof XRCubeLayer) {
                            if (!this.renderers.has(layer)) {
                                this.renderers.set(layer, new CubeRenderer(layer, this.context));
                            }
                            const renderer = this.renderers.get(layer);
                            renderer.render(this, frame);
                        }
                        else {
                            const webglLayer = layer;
                            if (webglLayer.framebuffer === null) {
                                continue;
                            }
                            if (gl instanceof WebGL2RenderingContext) {
                                gl.bindFramebuffer(gl.READ_FRAMEBUFFER, webglLayer.framebuffer);
                                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.getBaseLayer().framebuffer);
                                gl.blitFramebuffer(0, 0, webglLayer.framebufferWidth, webglLayer.framebufferHeight, 0, 0, this.getBaseLayer().framebufferWidth, this.getBaseLayer().framebufferHeight, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, gl.LINEAR);
                            }
                            else {
                                console.warn('GL blitFramebuffer is not supported on WebGL1, so XRWebGLLayers may not show up properly when polyfilled.');
                            }
                        }
                    }
                    if (!prevBlend) {
                        gl.disable(gl.BLEND);
                    }
                    if (prevDepthTest) {
                        gl.enable(gl.DEPTH_TEST);
                    }
                    if (prevCullFace) {
                        gl.enable(gl.CULL_FACE);
                    }
                    gl.blendFuncSeparate(prevBlendSrcRGB, prevBlendDestRGB, prevBlendSrcAlpha, prevBlendDestAlpha);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, existingFrameBuffer);
                    while (this.taskQueue.length > 0) {
                        const task = this.taskQueue.shift();
                        task();
                    }
                }
            };
        }
        this._requestAnimationFrame(this.injectedFrameCallback);
    }
    updateRenderState(XRRenderStateInit) {
        this.existingBaseLayer = XRRenderStateInit.baseLayer;
        if (XRRenderStateInit.layers) {
            this.layers = XRRenderStateInit.layers;
        }
        if (!this.activeRenderState) {
            this.createActiveRenderState();
        }
        this.activeRenderState = Object.assign(Object.assign({}, this.activeRenderState), XRRenderStateInit);
        if (!XRRenderStateInit.layers) {
            this._updateRenderState(XRRenderStateInit);
            return;
        }
        let layerRenderStateInit = Object.assign({}, XRRenderStateInit);
        delete layerRenderStateInit.layers;
        let context = undefined;
        for (let layer of this.layers) {
            if (layer instanceof XRCompositionLayerPolyfill) {
                context = layer.getContext();
                break;
            }
        }
        if (!context && !this.context) {
            console.log('No existing context! Have the session make one');
            const canvas = document.createElement('canvas');
            context = canvas.getContext('webgl2', { xrCompatible: true });
            if (!context) {
                context = canvas.getContext('webgl', { xrCompatible: true });
            }
            if (!context) {
                throw new Error('No webGL support detected.');
            }
            document.body.appendChild(context.canvas);
            function onResize() {
                context.canvas.width = context.canvas.clientWidth * window.devicePixelRatio;
                context.canvas.height = context.canvas.clientHeight * window.devicePixelRatio;
            }
            window.addEventListener('resize', onResize);
            onResize();
        }
        this.createInternalLayer(context);
        this.isPolyfillActive = true;
        this._updateRenderState(Object.assign(Object.assign({}, layerRenderStateInit), { baseLayer: this.internalLayer }));
    }
    initializeSession(mode) {
        this.mode = mode;
        this
            .requestReferenceSpace('local')
            .then((refSpace) => {
                this.referenceSpace = refSpace;
            })
            .catch((e) => {
            });
        this.requestReferenceSpace('viewer').then((viewerSpace) => {
            this.viewerSpace = viewerSpace;
        });
    }
    getBaseLayer(context) {
        if (!this.internalLayer && !this.existingBaseLayer && context) {
            this.createInternalLayer(context);
        }
        return this.internalLayer || this.existingBaseLayer;
    }
    getReferenceSpace() {
        return !this.referenceSpace ? this.viewerSpace : this.referenceSpace;
    }
    getViewerSpace() {
        return this.viewerSpace;
    }
    queueTask(task) {
        this.taskQueue.push(task);
    }
    get renderState() {
        if (!this.activeRenderState) {
            this.createActiveRenderState();
        }
        return this.activeRenderState;
    }
    get internalViews() {
        return this.views;
    }
    getViewIndex(view) {
        for (let i = 0; i < this.views.length; i++) {
            let testView = this.views[i];
            if (view.eye === testView.eye &&
                view.recommendedViewportScale === testView.recommendedViewportScale) {
                return i;
            }
        }
        return -1;
    }
    createInternalLayer(context) {
        if (!context && this.internalLayer) {
            return this.internalLayer;
        }
        if (context === this.context && this.internalLayer) {
            return this.internalLayer;
        }
        const _global = getGlobal();
        this.internalLayer = new _global.XRWebGLLayer(this, context);
        this.setContext(context);
        return this.internalLayer;
    }
    setContext(context) {
        this.context = context;
        this.tempFramebuffer = context.createFramebuffer();
        this.renderers = new WeakMap();
    }
    createActiveRenderState() {
        const _global = getGlobal();
        let prototypeNames = Object.getOwnPropertyNames(_global.XRRenderState.prototype);
        const renderStateClone = {};
        for (let item of prototypeNames) {
            renderStateClone[item] = this._renderState[item];
        }
        renderStateClone.layers = [];
        this.activeRenderState = renderStateClone;
    }
}

class XRWebGLSubImagePolyfill {
    constructor() {
        this.viewport = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
    }
}

class XRWebGLBindingPolyfill {
    constructor(session, context) {
        this.session = session;
        this.context = context;
        this.subImageCache = new SubImageCache();
    }
    createProjectionLayer(init = defaultXRProjectionLayerInit) {
        const layer = new XRProjectionLayer(init);
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (this.context.isContextLost()) {
            throw new Error('context is lost');
        }
        layer.initialize(this.session, this.context);
        return layer;
    }
    createQuadLayer(init = defaultQuadLayerInit) {
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (this.context.isContextLost()) {
            throw new Error('context is lost');
        }
        if (init.layout === XRLayerLayout.default) {
            throw new TypeError('Trying to create a quad layer with default layout');
        }
        const layer = new XRQuadLayer(init);
        layer.initialize(this.session, this.context);
        return layer;
    }
    createCylinderLayer(init = defaultCylinderLayerInit) {
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (this.context.isContextLost()) {
            throw new Error('context is lost');
        }
        if (init.layout === XRLayerLayout.default) {
            throw new TypeError('Cylinder Layer cannot have a default layout');
        }
        const layer = new XRCylinderLayer(init);
        layer.initialize(this.session, this.context);
        return layer;
    }
    createEquirectLayer(init = defaultEquirectLayerInit) {
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (this.context.isContextLost()) {
            throw new Error('context is lost');
        }
        if (init.layout === XRLayerLayout.default) {
            throw new TypeError('Equirect Layer cannot have a default layout');
        }
        if (!isReferenceSpace(init.space)) {
            throw new TypeError('Equirect layer requires an XRReferenceSpace');
        }
        let layer = new XREquirectLayer(init);
        layer.initialize(this.session, this.context);
        return layer;
    }
    createCubeLayer(init) {
        if (this.session.ended) {
            throw new Error('Session has ended');
        }
        if (this.context.isContextLost()) {
            throw new Error('context is lost');
        }
        if (!(this.context instanceof WebGL2RenderingContext)) {
            throw new Error('XRCubeLayer only work on WebGL2');
        }
        if (!isReferenceSpace(init.space)) {
            throw new TypeError('XRCubeLayer requires a space of type XRReferenceSpace');
        }
        let layer = new XRCubeLayer(init);
        layer.initialize(this.session, this.context);
        return layer;
    }
    getSubImage(layer, frame, eye = 'none') {
        if (layer.isStatic && (layer.needsRedraw === false)) {
            throw new Error('Invalid state for subimage creation');
        }
        let existingSubImage = this.subImageCache.tryGetCachedSubImage(this.context, layer, eye);
        if (existingSubImage) {
            return existingSubImage;
        }
        let subimage = new XRWebGLSubImagePolyfill();
        if (layer instanceof XRProjectionLayer) {
            throw new TypeError();
        }
        if (layer.layout === XRLayerLayout.default) {
            throw new TypeError();
        }
        if (!this.validateStateofSubImageCreation(layer, frame)) {
            throw new Error('Invalid state for subimage creation');
        }
        let index = 0;
        if (layer.layout === XRLayerLayout.stereo) {
            if (eye === 'none') {
                throw new TypeError();
            }
            if (eye === 'right') {
                index = 1;
            }
        }
        if (layer.getTextureType() === XRTextureType['texture-array']) {
            subimage.imageIndex = index;
        }
        else {
            subimage.imageIndex = 0;
        }
        let _textureIndex = 0;
        if (layer.getTextureType() === XRTextureType.texture) {
            subimage.colorTexture = layer.colorTextures[index];
            _textureIndex = index;
        }
        else {
            subimage.colorTexture = layer.colorTextures[0];
            _textureIndex = 0;
        }
        if (!layer.depthStencilTextures || !layer.depthStencilTextures.length) {
            subimage.depthStencilTexture = null;
        }
        else if (layer.getTextureType() === XRTextureType.texture) {
            subimage.depthStencilTexture = layer.depthStencilTextures[index];
        }
        else {
            subimage.depthStencilTexture = layer.depthStencilTextures[0];
        }
        const layerMeta = layer.colorTexturesMeta[_textureIndex];
        subimage.textureWidth = layerMeta.width;
        subimage.textureHeight = layerMeta.height;
        let viewsPerTexture = 1;
        if (layer.layout === XRLayerLayout['stereo-left-right'] ||
            layer.layout === XRLayerLayout['stereo-top-bottom']) {
            viewsPerTexture = 2;
        }
        initializeViewport(subimage.viewport, layerMeta, layer.layout, index, viewsPerTexture);
        this.session.queueTask(() => {
            layer.needsRedraw = false;
        });
        this.subImageCache.cacheSubImage(subimage, this.context, layer, eye);
        return subimage;
    }
    getViewSubImage(layer, view) {
        let existingSubImage = this.subImageCache.tryGetCachedViewSubImage(this.context, layer, view);
        if (existingSubImage) {
            return existingSubImage;
        }
        let subimage = new XRWebGLSubImagePolyfill();
        let session = this.session;
        if (!session.internalViews || !session.internalViews.length) {
            console.warn('Tried to get view sub image before we have any views');
            return subimage;
        }
        let index = session.getViewIndex(view);
        let _textureIndex = 0;
        if (layer.getTextureType() === XRTextureType['texture-array']) {
            subimage.imageIndex = index;
        }
        else {
            subimage.imageIndex = 0;
        }
        if (layer.layout === XRLayerLayout.default &&
            layer.getTextureType() === XRTextureType.texture) {
            subimage.colorTexture = layer.colorTextures[index];
            _textureIndex = index;
        }
        else {
            subimage.colorTexture = layer.colorTextures[0];
            _textureIndex = 0;
        }
        if (layer.depthStencilTextures.length === 0) {
            subimage.depthStencilTexture = null;
        }
        else if (layer.layout === XRLayerLayout.default &&
            layer.getTextureType() === XRTextureType.texture) {
            subimage.depthStencilTexture = layer.depthStencilTextures[index];
        }
        else {
            subimage.depthStencilTexture = layer.depthStencilTextures[0];
        }
        subimage.textureWidth = layer.colorTexturesMeta[_textureIndex].width;
        subimage.textureHeight = layer.colorTexturesMeta[_textureIndex].height;
        initializeViewport(subimage.viewport, layer.colorTexturesMeta[_textureIndex], layer.layout, index, session.internalViews.length);
        layer.needsRedraw = false;
        this.subImageCache.cacheViewSubImage(subimage, this.context, layer, view);
        return subimage;
    }
    validateStateofSubImageCreation(layer, frame) {
        if (frame.session !== layer.session) {
            return false;
        }
        if (this.session !== layer.session) {
            return false;
        }
        if (this.context !== layer.context) {
            return false;
        }
        if (!layer.colorTextures || !layer.colorTextures.length) {
            return false;
        }
        if (layer.isStatic && layer.needsRedraw === false) {
            return false;
        }
        return true;
    }
}
class SubImageCache {
    constructor() {
        this.cache = new Map();
        this.viewCache = new Map();
    }
    cacheSubImage(subimage, context, layer, eye) {
        let eyeMap = new Map();
        eyeMap.set(eye, subimage);
        let layerMap = new Map();
        layerMap.set(layer, eyeMap);
        this.cache.set(context, layerMap);
    }
    tryGetCachedSubImage(context, layer, eye) {
        var _a, _b;
        return (_b = (_a = this.cache.get(context)) === null || _a === void 0 ? void 0 : _a.get(layer)) === null || _b === void 0 ? void 0 : _b.get(eye);
    }
    cacheViewSubImage(subimage, context, layer, view) {
        let viewMap = new Map();
        viewMap.set(view, subimage);
        let layerMap = new Map();
        layerMap.set(layer, viewMap);
        this.viewCache.set(context, layerMap);
    }
    tryGetCachedViewSubImage(context, layer, view) {
        var _a, _b;
        return (_b = (_a = this.viewCache.get(context)) === null || _a === void 0 ? void 0 : _a.get(layer)) === null || _b === void 0 ? void 0 : _b.get(view);
    }
}

const isLayersNativelySupported = (global) => {
    if (!global.navigator.xr) {
        return false;
    }
    if (global.XRMediaBinding && global.XRWebGLBinding) {
        return true;
    }
    return false;
};

class WebXRLayersPolyfill {
    constructor() {
        this.injected = false;
        const _global = getGlobal();
        this._injectPolyfill(_global);
    }
    _injectPolyfill(global) {
        if (!('xr' in global.navigator)) {
            throw new Error('WebXR Layers polyfill requires WebXR support.');
        }
        if (this.injected === true) {
            console.warn('Polyfill has already been injected...');
        }
        if (isLayersNativelySupported(global)) {
            return;
        }
        this._polyfillRequiredLayersFeature(global);
        this._polyfillXRSession(global);
        global.XRWebGLBinding = XRWebGLBindingPolyfill;
        global.XRMediaBinding = XRMediaBindingPolyfill;
        this.injected = true;
        console.log('Injected Layers Polyfill');
    }
    _polyfillXRSession(global) {
        global.XRSession.prototype._updateRenderState = global.XRSession.prototype.updateRenderState;
        global.XRSession.prototype._requestAnimationFrame =
            global.XRSession.prototype.requestAnimationFrame;
        let renderStateGetter = Object.getOwnPropertyDescriptor(global.XRSession.prototype, 'renderState');
        Object.defineProperty(global.XRSession.prototype, '_renderState', renderStateGetter);
        let polyfillRenderStateGetter = Object.getOwnPropertyDescriptor(XRSessionWithLayer.prototype, 'renderState');
        Object.defineProperty(global.XRSession.prototype, 'renderState', polyfillRenderStateGetter);
        let prototypeNames = Object.getOwnPropertyNames(XRSessionWithLayer.prototype);
        for (let item of prototypeNames) {
            let propertyDescriptor = Object.getOwnPropertyDescriptor(XRSessionWithLayer.prototype, item);
            Object.defineProperty(global.XRSession.prototype, item, propertyDescriptor);
        }
    }
    _polyfillRequiredLayersFeature(global) {
        const existingRequestSession = global.navigator.xr.requestSession;
        Object.defineProperty(global.navigator.xr, 'requestSessionInternal', { writable: true });
        global.navigator.xr.requestSessionInternal = existingRequestSession;
        const newRequestSession = (sessionMode, sessionInit) => {
            const modifiedSessionPromise = (mode, init) => {
                return global.navigator.xr.requestSessionInternal(mode, init).then((session) => {
                    Object.assign(session, new XRSessionWithLayer());
                    let polyfilledSession = session;
                    polyfilledSession.initializeSession(sessionMode);
                    return Promise.resolve(polyfilledSession);
                });
            };
            if (sessionMode !== 'immersive-vr') {
                return modifiedSessionPromise(sessionMode, sessionInit);
            }
            if (!sessionInit) {
                return modifiedSessionPromise(sessionMode, sessionInit);
            }
            if (sessionInit.requiredFeatures && sessionInit.requiredFeatures.indexOf('layers') > -1) {
                const sessionInitClone = Object.assign({}, sessionInit);
                const reqFeatures = [...sessionInit.requiredFeatures];
                const layersIndex = reqFeatures.indexOf('layers');
                reqFeatures.splice(layersIndex, 1);
                sessionInitClone.requiredFeatures = reqFeatures;
                return modifiedSessionPromise(sessionMode, sessionInitClone);
            }
            return modifiedSessionPromise(sessionMode, sessionInit);
        };
        Object.defineProperty(global.navigator.xr, 'requestSession', { writable: true });
        global.navigator.xr.requestSession = newRequestSession;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const DEFAULTS = {
    ipd: 0.063,
    fovy: Math.PI / 2,
    headsetPosition: new Vector3(0, 1.6, 0),
    headsetQuaternion: new Quaternion(),
    stereoEnabled: false,
};
const Z_INDEX_SEM_CANVAS = 1;
const Z_INDEX_APP_CANVAS = 2;
const Z_INDEX_DEVUI_CANVAS = 3;
const Z_INDEX_DEVUI_CONTAINER = 4;
/**
 * XRDevice is not a standard API class outlined in the WebXR Device API Specifications
 * Instead, it serves as an user-facing interface to control the emulated XR Device
 */
class XRDevice {
    constructor(deviceConfig, deviceOptions = {}) {
        var _a, _b, _c, _d, _e, _f;
        this.version = VERSION;
        const globalSpace = new GlobalSpace();
        const viewerSpace = new XRReferenceSpace(XRReferenceSpaceType.Viewer, globalSpace);
        const viewSpaces = {
            [XREye.Left]: new XRSpace(viewerSpace),
            [XREye.Right]: new XRSpace(viewerSpace),
            [XREye.None]: new XRSpace(viewerSpace),
        };
        const controllerConfig = deviceConfig.controllerConfig;
        const controllers = {};
        if (controllerConfig) {
            Object.values(XRHandedness).forEach((handedness) => {
                if (controllerConfig.layout[handedness]) {
                    controllers[handedness] = new XRController(controllerConfig, handedness, globalSpace);
                }
            });
        }
        const hands = {
            [XRHandedness.Left]: new XRHandInput(oculusHandConfig, XRHandedness.Left, globalSpace),
            [XRHandedness.Right]: new XRHandInput(oculusHandConfig, XRHandedness.Right, globalSpace),
        };
        const canvasContainer = (_a = deviceOptions.canvasContainer) !== null && _a !== void 0 ? _a : document.createElement('div');
        canvasContainer.dataset.webxr_runtime = `Immersive Web Emulation Runtime v${VERSION}`;
        canvasContainer.style.position = 'fixed';
        canvasContainer.style.width = '100%';
        canvasContainer.style.height = '100%';
        canvasContainer.style.top = '0';
        canvasContainer.style.left = '0';
        canvasContainer.style.display = 'flex';
        canvasContainer.style.justifyContent = 'center';
        canvasContainer.style.alignItems = 'center';
        canvasContainer.style.overflow = 'hidden';
        canvasContainer.style.zIndex = '999';
        this[P_DEVICE] = {
            name: deviceConfig.name,
            supportedSessionModes: deviceConfig.supportedSessionModes,
            supportedFeatures: deviceConfig.supportedFeatures,
            supportedFrameRates: deviceConfig.supportedFrameRates,
            isSystemKeyboardSupported: deviceConfig.isSystemKeyboardSupported,
            internalNominalFrameRate: deviceConfig.internalNominalFrameRate,
            environmentBlendModes: deviceConfig.environmentBlendModes,
            interactionMode: deviceConfig.interactionMode,
            userAgent: deviceConfig.userAgent,
            position: (_b = deviceOptions.headsetPosition) !== null && _b !== void 0 ? _b : DEFAULTS.headsetPosition.clone(),
            quaternion: (_c = deviceOptions.headsetQuaternion) !== null && _c !== void 0 ? _c : DEFAULTS.headsetQuaternion.clone(),
            stereoEnabled: (_d = deviceOptions.stereoEnabled) !== null && _d !== void 0 ? _d : DEFAULTS.stereoEnabled,
            ipd: (_e = deviceOptions.ipd) !== null && _e !== void 0 ? _e : DEFAULTS.ipd,
            fovy: (_f = deviceOptions.fovy) !== null && _f !== void 0 ? _f : DEFAULTS.fovy,
            controllers,
            hands,
            primaryInputMode: 'controller',
            pendingReferenceSpaceReset: false,
            visibilityState: 'visible',
            pendingVisibilityState: null,
            xrSystem: null,
            matrix: create$5(),
            globalSpace,
            viewerSpace,
            viewSpaces,
            canvasContainer,
            getViewport: (layer, view) => {
                const canvas = layer.context.canvas;
                const { width, height } = canvas;
                switch (view.eye) {
                    case XREye.None:
                        return new XRViewport(0, 0, width, height);
                    case XREye.Left:
                        return new XRViewport(0, 0, this[P_DEVICE].stereoEnabled ? width / 2 : width, height);
                    case XREye.Right:
                        return new XRViewport(width / 2, 0, this[P_DEVICE].stereoEnabled ? width / 2 : 0, height);
                }
            },
            updateViews: () => {
                // update viewerSpace
                const viewerSpace = this[P_DEVICE].viewerSpace;
                fromRotationTranslation(viewerSpace[P_SPACE].offsetMatrix, this[P_DEVICE].quaternion.quat, this[P_DEVICE].position.vec3);
                // update viewSpaces
                fromTranslation(this[P_DEVICE].viewSpaces[XREye.Left][P_SPACE].offsetMatrix, fromValues$2(-this[P_DEVICE].ipd / 2, 0, 0));
                fromTranslation(this[P_DEVICE].viewSpaces[XREye.Right][P_SPACE].offsetMatrix, fromValues$2(this[P_DEVICE].ipd / 2, 0, 0));
            },
            onBaseLayerSet: (baseLayer) => {
                if (!baseLayer)
                    return;
                // backup canvas data
                const canvas = baseLayer.context.canvas;
                if (canvas.parentElement !== this[P_DEVICE].canvasContainer) {
                    const devui = this[P_DEVICE].devui;
                    if (devui) {
                        const { devUICanvas, devUIContainer } = devui;
                        devUICanvas.style.zIndex = Z_INDEX_DEVUI_CANVAS.toString();
                        devUIContainer.style.zIndex = Z_INDEX_DEVUI_CONTAINER.toString();
                        this[P_DEVICE].canvasContainer.appendChild(devui.devUICanvas);
                        this[P_DEVICE].canvasContainer.appendChild(devui.devUIContainer);
                    }
                    const sem = this[P_DEVICE].sem;
                    if (sem) {
                        sem.environmentCanvas.style.zIndex = Z_INDEX_SEM_CANVAS.toString();
                        this[P_DEVICE].canvasContainer.appendChild(sem.environmentCanvas);
                    }
                    this[P_DEVICE].canvasData = {
                        canvas,
                        parent: canvas.parentElement,
                        width: canvas.width,
                        height: canvas.height,
                        zIndex: canvas.style.zIndex,
                    };
                    canvas.style.zIndex = Z_INDEX_APP_CANVAS.toString();
                    this[P_DEVICE].canvasContainer.appendChild(canvas);
                    document.body.appendChild(this[P_DEVICE].canvasContainer);
                }
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            },
            onSessionEnd: () => {
                if (this[P_DEVICE].canvasData) {
                    const { canvas, parent, width, height, zIndex } = this[P_DEVICE].canvasData;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.zIndex = zIndex;
                    if (parent) {
                        parent.appendChild(canvas);
                    }
                    else {
                        this[P_DEVICE].canvasContainer.removeChild(canvas);
                    }
                    const devui = this[P_DEVICE].devui;
                    if (devui) {
                        this[P_DEVICE].canvasContainer.removeChild(devui.devUICanvas);
                        this[P_DEVICE].canvasContainer.removeChild(devui.devUIContainer);
                    }
                    const sem = this[P_DEVICE].sem;
                    if (sem) {
                        this[P_DEVICE].canvasContainer.removeChild(sem.environmentCanvas);
                    }
                    document.body.removeChild(this[P_DEVICE].canvasContainer);
                    this[P_DEVICE].canvasData = undefined;
                    window.dispatchEvent(new Event('resize'));
                }
            },
            onFrameStart: (frame) => {
                var _a;
                if ((_a = this[P_DEVICE].actionPlayer) === null || _a === void 0 ? void 0 : _a.playing) {
                    this[P_DEVICE].actionPlayer.playFrame();
                }
                else {
                    const session = frame.session;
                    this[P_DEVICE].updateViews();
                    if (this[P_DEVICE].pendingVisibilityState) {
                        this[P_DEVICE].visibilityState =
                            this[P_DEVICE].pendingVisibilityState;
                        this[P_DEVICE].pendingVisibilityState = null;
                        session.dispatchEvent(new XRSessionEvent('visibilitychange', { session }));
                    }
                    if (this[P_DEVICE].visibilityState === 'visible') {
                        this.activeInputs.forEach((activeInput) => {
                            activeInput.onFrameStart(frame);
                        });
                    }
                    if (this[P_DEVICE].pendingReferenceSpaceReset) {
                        session[P_SESSION].referenceSpaces.forEach((referenceSpace) => {
                            switch (referenceSpace[P_REF_SPACE].type) {
                                case XRReferenceSpaceType.Local:
                                case XRReferenceSpaceType.LocalFloor:
                                case XRReferenceSpaceType.BoundedFloor:
                                case XRReferenceSpaceType.Unbounded:
                                    referenceSpace.dispatchEvent(new XRReferenceSpaceEvent('reset', { referenceSpace }));
                                    break;
                            }
                        });
                        this[P_DEVICE].pendingReferenceSpaceReset = false;
                    }
                }
                this[P_DEVICE].updateViews();
            },
        };
        this[P_DEVICE].updateViews();
    }
    installRuntime(options) {
        var _a;
        const globalObject = (_a = options === null || options === void 0 ? void 0 : options.globalObject) !== null && _a !== void 0 ? _a : globalThis;
        const polyfillLayers = options === null || options === void 0 ? void 0 : options.polyfillLayers;
        Object.defineProperty(WebGL2RenderingContext.prototype, 'makeXRCompatible', {
            value: function () {
                return new Promise((resolve, _reject) => {
                    resolve(true);
                });
            },
            configurable: true,
        });
        this[P_DEVICE].xrSystem = new XRSystem(this);
        Object.defineProperty(globalThis.navigator, 'xr', {
            value: this[P_DEVICE].xrSystem,
            configurable: true,
        });
        Object.defineProperty(navigator, 'userAgent', {
            value: this[P_DEVICE].userAgent,
            writable: false,
            configurable: false,
            enumerable: true,
        });
        globalObject['XRSystem'] = XRSystem;
        globalObject['XRSession'] = XRSession;
        globalObject['XRRenderState'] = XRRenderState;
        globalObject['XRFrame'] = XRFrame;
        globalObject['XRSpace'] = XRSpace;
        globalObject['XRReferenceSpace'] = XRReferenceSpace;
        globalObject['XRJointSpace'] = XRJointSpace;
        globalObject['XRView'] = XRView;
        globalObject['XRViewport'] = XRViewport;
        globalObject['XRRigidTransform'] = XRRigidTransform;
        globalObject['XRPose'] = XRPose;
        globalObject['XRViewerPose'] = XRViewerPose;
        globalObject['XRJointPose'] = XRJointPose;
        globalObject['XRInputSource'] = XRInputSource;
        globalObject['XRInputSourceArray'] = XRInputSourceArray;
        globalObject['XRHand'] = XRHand;
        globalObject['XRLayer'] = XRLayer;
        globalObject['XRWebGLLayer'] = XRWebGLLayer;
        globalObject['XRSessionEvent'] = XRSessionEvent;
        globalObject['XRInputSourceEvent'] = XRInputSourceEvent;
        globalObject['XRInputSourcesChangeEvent'] = XRInputSourcesChangeEvent;
        globalObject['XRReferenceSpaceEvent'] = XRReferenceSpaceEvent;
        if (polyfillLayers) {
            new WebXRLayersPolyfill();
        }
        else {
            globalObject['XRMediaBinding'] = undefined;
            globalObject['XRWebGLBinding'] = undefined;
        }
    }
    installDevUI(devUIConstructor) {
        this[P_DEVICE].devui = new devUIConstructor(this);
    }
    installSEM(semConstructor) {
        this[P_DEVICE].sem = new semConstructor(this);
    }
    get supportedSessionModes() {
        return this[P_DEVICE].supportedSessionModes;
    }
    get supportedFeatures() {
        return this[P_DEVICE].supportedFeatures;
    }
    get supportedFrameRates() {
        return this[P_DEVICE].supportedFrameRates;
    }
    get isSystemKeyboardSupported() {
        return this[P_DEVICE].isSystemKeyboardSupported;
    }
    get internalNominalFrameRate() {
        return this[P_DEVICE].internalNominalFrameRate;
    }
    get stereoEnabled() {
        return this[P_DEVICE].stereoEnabled;
    }
    set stereoEnabled(value) {
        this[P_DEVICE].stereoEnabled = value;
    }
    get ipd() {
        return this[P_DEVICE].ipd;
    }
    set ipd(value) {
        this[P_DEVICE].ipd = value;
    }
    get fovy() {
        return this[P_DEVICE].fovy;
    }
    set fovy(value) {
        this[P_DEVICE].fovy = value;
    }
    get position() {
        return this[P_DEVICE].position;
    }
    get quaternion() {
        return this[P_DEVICE].quaternion;
    }
    get viewerSpace() {
        var _a;
        if ((_a = this[P_DEVICE].actionPlayer) === null || _a === void 0 ? void 0 : _a.playing) {
            return this[P_DEVICE].actionPlayer.viewerSpace;
        }
        else {
            return this[P_DEVICE].viewerSpace;
        }
    }
    get viewSpaces() {
        var _a;
        if ((_a = this[P_DEVICE].actionPlayer) === null || _a === void 0 ? void 0 : _a.playing) {
            return this[P_DEVICE].actionPlayer.viewSpaces;
        }
        else {
            return this[P_DEVICE].viewSpaces;
        }
    }
    get controllers() {
        return this[P_DEVICE].controllers;
    }
    get hands() {
        return this[P_DEVICE].hands;
    }
    get primaryInputMode() {
        return this[P_DEVICE].primaryInputMode;
    }
    set primaryInputMode(mode) {
        if (mode !== 'controller' && mode !== 'hand') {
            console.warn('primary input mode can only be "controller" or "hand"');
            return;
        }
        this[P_DEVICE].primaryInputMode = mode;
    }
    get activeInputs() {
        if (this[P_DEVICE].visibilityState !== 'visible') {
            return [];
        }
        const activeInputs = this[P_DEVICE].primaryInputMode === 'controller'
            ? Object.values(this[P_DEVICE].controllers)
            : Object.values(this[P_DEVICE].hands);
        return activeInputs.filter((input) => input.connected);
    }
    get inputSources() {
        var _a;
        if ((_a = this[P_DEVICE].actionPlayer) === null || _a === void 0 ? void 0 : _a.playing) {
            return this[P_DEVICE].actionPlayer.inputSources;
        }
        else {
            return this.activeInputs.map((input) => input.inputSource);
        }
    }
    get canvasContainer() {
        return this[P_DEVICE].canvasContainer;
    }
    get canvasDimensions() {
        if (this[P_DEVICE].canvasData) {
            const { width, height } = this[P_DEVICE].canvasData.canvas;
            return { width, height };
        }
        return;
    }
    get activeSession() {
        var _a;
        return (_a = this[P_DEVICE].xrSystem) === null || _a === void 0 ? void 0 : _a[P_SYSTEM].activeSession;
    }
    get sessionOffered() {
        var _a;
        return Boolean((_a = this[P_DEVICE].xrSystem) === null || _a === void 0 ? void 0 : _a[P_SYSTEM].offeredSessionConfig);
    }
    get name() {
        return this[P_DEVICE].name;
    }
    grantOfferedSession() {
        const xrSystem = this[P_DEVICE].xrSystem;
        const pSystem = xrSystem === null || xrSystem === void 0 ? void 0 : xrSystem[P_SYSTEM];
        if (pSystem && pSystem.offeredSessionConfig) {
            const { resolve, reject, mode, options } = pSystem.offeredSessionConfig;
            // Clear the offered session config first
            pSystem.offeredSessionConfig = undefined;
            // Use the same requestSession flow to ensure identical behavior
            xrSystem.requestSession(mode, options)
                .then(resolve)
                .catch(reject);
        }
    }
    recenter() {
        const deltaVec = new Vector3(-this.position.x, 0, -this.position.z);
        const forward = new Vector3(0, 0, -1).applyQuaternion(this.quaternion);
        forward.y = 0;
        forward.normalize();
        const angle = Math.atan2(forward.x, -forward.z);
        const deltaQuat = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), angle);
        this.position.add(deltaVec);
        this.quaternion.multiply(deltaQuat);
        [
            ...Object.values(this[P_DEVICE].controllers),
            ...Object.values(this[P_DEVICE].hands),
        ].forEach((activeInput) => {
            activeInput.position.add(deltaVec);
            activeInput.quaternion.multiply(deltaQuat);
            activeInput.position.applyQuaternion(deltaQuat);
        });
        this[P_DEVICE].pendingReferenceSpaceReset = true;
    }
    get visibilityState() {
        return this[P_DEVICE].visibilityState;
    }
    // visibility state updates are queued until the XRSession produces frames
    updateVisibilityState(state) {
        if (!Object.values(['visible', 'visible-blurred', 'hidden']).includes(state)) {
            throw new DOMException('Invalid XRVisibilityState value', 'NotSupportedError');
        }
        if (state !== this[P_DEVICE].visibilityState) {
            this[P_DEVICE].pendingVisibilityState = state;
        }
    }
    createActionPlayer(refSpace, recording) {
        this[P_DEVICE].actionPlayer = new ActionPlayer(refSpace, recording, this[P_DEVICE].ipd);
        return this[P_DEVICE].actionPlayer;
    }
    get devui() {
        return this[P_DEVICE].devui;
    }
    get sem() {
        return this[P_DEVICE].sem;
    }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const gamepadConfigLeft = {
    mapping: GamepadMappingType.XRStandard,
    buttons: [
        { id: 'trigger', type: 'analog', eventTrigger: 'select' },
        { id: 'squeeze', type: 'analog', eventTrigger: 'squeeze' },
        null,
        { id: 'thumbstick', type: 'binary' },
        { id: 'x-button', type: 'binary' },
        { id: 'y-button', type: 'binary' },
        { id: 'thumbrest', type: 'binary' },
    ],
    axes: [
        null,
        null,
        { id: 'thumbstick', type: 'x-axis' },
        { id: 'thumbstick', type: 'y-axis' },
    ],
};
const gamepadConfigRight = {
    mapping: GamepadMappingType.XRStandard,
    buttons: [
        { id: 'trigger', type: 'analog', eventTrigger: 'select' },
        { id: 'squeeze', type: 'analog', eventTrigger: 'squeeze' },
        null,
        { id: 'thumbstick', type: 'binary' },
        { id: 'a-button', type: 'binary' },
        { id: 'b-button', type: 'binary' },
        { id: 'thumbrest', type: 'binary' },
    ],
    axes: [
        null,
        null,
        { id: 'thumbstick', type: 'x-axis' },
        { id: 'thumbstick', type: 'y-axis' },
    ],
};
const oculusTouchV2 = {
    profileId: 'oculus-touch-v2',
    fallbackProfileIds: ['oculus-touch', 'generic-trigger-squeeze-thumbstick'],
    layout: {
        left: {
            gamepad: gamepadConfigLeft,
            gripOffsetMatrix: [
                0.9925461411476135, 4.673031295254759e-9, -0.12186938524246216, 0,
                0.08617470413446426, 0.7071065306663513, 0.7018362283706665, 0,
                0.0861746296286583, -0.70710688829422, 0.7018358707427979, 0,
                -0.003979847766458988, -0.01585787907242775, 0.04964185878634453, 1,
            ],
            numHapticActuators: 1,
        },
        right: {
            gamepad: gamepadConfigRight,
            gripOffsetMatrix: [
                0.9925461411476135, 3.688163374704345e-8, 0.12186937034130096, 0,
                -0.08617469668388367, 0.7071066498756409, 0.7018361687660217, 0,
                -0.0861746147274971, -0.7071068286895752, 0.7018359899520874, 0,
                0.003979853354394436, -0.01585787907242775, 0.04964182525873184, 1,
            ],
            numHapticActuators: 1,
        },
    },
};
const oculusTouchV3 = {
    profileId: 'oculus-touch-v3',
    fallbackProfileIds: ['oculus-touch', 'generic-trigger-squeeze-thumbstick'],
    layout: {
        left: {
            gamepad: gamepadConfigLeft,
            gripOffsetMatrix: [
                0.9925461411476135, 2.0823669899527886e-8, -0.12186937034130096, 0,
                0.08617465198040009, 0.7071067094802856, 0.701836109161377, 0,
                0.08617466688156128, -0.7071067690849304, 0.7018360495567322, 0,
                -0.003979838453233242, -0.015857907012104988, 0.04964181408286095, 1,
            ],
            numHapticActuators: 1,
        },
        right: {
            gamepad: gamepadConfigRight,
            gripOffsetMatrix: [
                0.9925461411476135, -8.329467959811154e-8, 0.12186941504478455, 0,
                -0.08617465943098068, 0.7071066498756409, 0.7018361687660217, 0,
                -0.08617471158504486, -0.7071068286895752, 0.7018359303474426, 0,
                0.003979798872023821, -0.015857888385653496, 0.049641866236925125, 1,
            ],
            numHapticActuators: 1,
        },
    },
};
const metaQuestTouchPro = {
    profileId: 'meta-quest-touch-pro',
    fallbackProfileIds: [
        'oculus-touch-v2',
        'oculus-touch',
        'generic-trigger-squeeze-thumbstick',
    ],
    layout: {
        left: {
            gamepad: gamepadConfigLeft,
            gripOffsetMatrix: [
                0.9925461411476135, -1.5779937356796836e-8, -0.12186935544013977, 0,
                0.08617467433214188, 0.7071067094802856, 0.701836109161377, 0,
                0.0861746296286583, -0.7071067690849304, 0.7018360495567322, 0,
                -0.003979836590588093, -0.015857847407460213, 0.049641840159893036, 1,
            ],
            numHapticActuators: 3,
        },
        right: {
            gamepad: gamepadConfigRight,
            gripOffsetMatrix: [
                0.9925461411476135, 9.267653311439972e-11, 0.12186937034130096, 0,
                -0.08617467433214188, 0.7071067094802856, 0.7018361687660217, 0,
                -0.08617464452981949, -0.7071067690849304, 0.7018360495567322, 0,
                0.003979847766458988, -0.01585782691836357, 0.04964186251163483, 1,
            ],
            numHapticActuators: 3,
        },
    },
};
const metaQuestTouchPlus = {
    profileId: 'meta-quest-touch-plus',
    fallbackProfileIds: [
        'oculus-touch-v3',
        'oculus-touch',
        'generic-trigger-squeeze-thumbstick',
    ],
    layout: {
        left: {
            gamepad: gamepadConfigLeft,
            gripOffsetMatrix: [
                0.9925461411476135, 1.0736208366779465e-8, -0.12186933308839798, 0,
                0.08617459982633591, 0.70710688829422, 0.7018360495567322, 0,
                0.08617466688156128, -0.7071067094802856, 0.7018362283706665, 0,
                -0.003979803062975407, -0.015857873484492302, 0.04964187368750572, 1,
            ],
            numHapticActuators: 1,
        },
        right: {
            gamepad: gamepadConfigRight,
            gripOffsetMatrix: [
                0.9925461411476135, -2.6238110351073374e-8, 0.12186934053897858, 0,
                -0.0861746147274971, 0.7071067690849304, 0.7018360495567322, 0,
                -0.08617465943098068, -0.7071067094802856, 0.701836109161377, 0,
                0.003979838453233242, -0.015857869759202003, 0.04964182525873184, 1,
            ],
            numHapticActuators: 1,
        },
    },
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const oculusQuest1 = {
    name: 'Oculus Quest 1',
    controllerConfig: oculusTouchV2,
    supportedSessionModes: ['inline', 'immersive-vr', 'immersive-ar'],
    supportedFeatures: [
        'viewer',
        'local',
        'local-floor',
        'bounded-floor',
        'unbounded',
        'anchors',
        'plane-detection',
        'hand-tracking',
    ],
    supportedFrameRates: [72, 80, 90],
    isSystemKeyboardSupported: true,
    internalNominalFrameRate: 72,
    environmentBlendModes: {
        ['immersive-vr']: XREnvironmentBlendMode.Opaque,
        ['immersive-ar']: XREnvironmentBlendMode.AlphaBlend,
    },
    interactionMode: XRInteractionMode.WorldSpace,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64; Quest 1) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.x.x.x Chrome/126.0.6478.122 VR Safari/537.36',
};
const metaQuest2 = {
    name: 'Meta Quest 2',
    controllerConfig: oculusTouchV3,
    supportedSessionModes: ['inline', 'immersive-vr', 'immersive-ar'],
    supportedFeatures: [
        'viewer',
        'local',
        'local-floor',
        'bounded-floor',
        'unbounded',
        'anchors',
        'plane-detection',
        'mesh-detection',
        'hit-test',
        'hand-tracking',
    ],
    supportedFrameRates: [72, 80, 90, 120],
    isSystemKeyboardSupported: true,
    internalNominalFrameRate: 72,
    environmentBlendModes: {
        ['immersive-vr']: XREnvironmentBlendMode.Opaque,
        ['immersive-ar']: XREnvironmentBlendMode.AlphaBlend,
    },
    interactionMode: XRInteractionMode.WorldSpace,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.x.x.x Chrome/126.0.6478.122 VR Safari/537.36',
};
const metaQuestPro = {
    name: 'Meta Quest Pro',
    controllerConfig: metaQuestTouchPro,
    supportedSessionModes: ['inline', 'immersive-vr', 'immersive-ar'],
    supportedFeatures: [
        'viewer',
        'local',
        'local-floor',
        'bounded-floor',
        'unbounded',
        'anchors',
        'plane-detection',
        'mesh-detection',
        'hit-test',
        'hand-tracking',
    ],
    supportedFrameRates: [72, 80, 90, 120],
    isSystemKeyboardSupported: true,
    internalNominalFrameRate: 90,
    environmentBlendModes: {
        ['immersive-vr']: XREnvironmentBlendMode.Opaque,
        ['immersive-ar']: XREnvironmentBlendMode.AlphaBlend,
    },
    interactionMode: XRInteractionMode.WorldSpace,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64; Quest Pro) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.x.x.x Chrome/126.0.6478.122 VR Safari/537.36',
};
const metaQuest3 = {
    name: 'Meta Quest 3',
    controllerConfig: metaQuestTouchPlus,
    supportedSessionModes: ['inline', 'immersive-vr', 'immersive-ar'],
    supportedFeatures: [
        'viewer',
        'local',
        'local-floor',
        'bounded-floor',
        'unbounded',
        'anchors',
        'plane-detection',
        'mesh-detection',
        'hit-test',
        'hand-tracking',
        'depth-sensing',
    ],
    supportedFrameRates: [72, 80, 90, 120],
    isSystemKeyboardSupported: true,
    internalNominalFrameRate: 90,
    environmentBlendModes: {
        ['immersive-vr']: XREnvironmentBlendMode.Opaque,
        ['immersive-ar']: XREnvironmentBlendMode.AlphaBlend,
    },
    interactionMode: XRInteractionMode.WorldSpace,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/33.0.0.x.x.x Chrome/126.0.6478.122 VR Safari/537.36',
};

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const compress = (arr) => {
    const out = [];
    Array.from(arr).forEach((num) => {
        out.push(parseFloat(num.toFixed(3)));
    });
    return out;
};
class ActionRecorder {
    constructor(session, refSpace) {
        this[P_ACTION_RECORDER] = {
            session,
            refSpace,
            inputMap: new Map(),
            schemaMap: new Map(),
            compressedFrames: [],
            jointRadii: new Float32Array(25),
            jointTransforms: new Float32Array(25 * 16),
        };
    }
    recordFrame(frame) {
        var _a;
        const timeStamp = performance.now();
        const viewerMatrix = (_a = frame.getViewerPose(this[P_ACTION_RECORDER].refSpace)) === null || _a === void 0 ? void 0 : _a.transform.matrix;
        if (!viewerMatrix)
            return;
        const position = getTranslation(create$4(), viewerMatrix);
        const quaternion = getRotation(create$2(), viewerMatrix);
        const actionFrame = {
            timeStamp,
            position,
            quaternion,
            inputFrames: [],
        };
        this[P_ACTION_RECORDER].session.inputSources.forEach((inputSource) => {
            var _a, _b;
            if (!this[P_ACTION_RECORDER].inputMap.has(inputSource)) {
                const schema = {
                    handedness: inputSource.handedness,
                    targetRayMode: inputSource.targetRayMode,
                    profiles: inputSource.profiles,
                    hasGrip: inputSource.gripSpace != null,
                    hasHand: inputSource.hand != null,
                    hasGamepad: inputSource.gamepad != null,
                };
                if (schema.hasHand) {
                    schema.jointSequence = Array.from(inputSource.hand.values()).map((jointSpace) => jointSpace.jointName);
                }
                if (schema.hasGamepad) {
                    schema.mapping = inputSource.gamepad.mapping;
                    schema.numButtons = inputSource.gamepad.buttons.length;
                    schema.numAxes = inputSource.gamepad.axes.length;
                }
                const index = this[P_ACTION_RECORDER].inputMap.size;
                this[P_ACTION_RECORDER].inputMap.set(inputSource, index);
                this[P_ACTION_RECORDER].schemaMap.set(index, schema);
            }
            const index = this[P_ACTION_RECORDER].inputMap.get(inputSource);
            const schema = this[P_ACTION_RECORDER].schemaMap.get(index);
            const targetRayMatrix = (_a = frame.getPose(inputSource.targetRaySpace, this[P_ACTION_RECORDER].refSpace)) === null || _a === void 0 ? void 0 : _a.transform.matrix;
            if (targetRayMatrix) {
                const targetRayPosition = getTranslation(create$4(), targetRayMatrix);
                const targetRayQuaternion = getRotation(create$2(), targetRayMatrix);
                const inputFrame = {
                    index,
                    targetRayTransform: {
                        position: targetRayPosition,
                        quaternion: targetRayQuaternion,
                    },
                };
                if (schema.hasGrip) {
                    const gripMatrix = (_b = frame.getPose(inputSource.gripSpace, this[P_ACTION_RECORDER].refSpace)) === null || _b === void 0 ? void 0 : _b.transform.matrix;
                    if (gripMatrix) {
                        const position = getTranslation(create$4(), gripMatrix);
                        const quaternion = getRotation(create$2(), gripMatrix);
                        inputFrame.gripTransform = {
                            position,
                            quaternion,
                        };
                    }
                }
                if (schema.hasHand) {
                    const jointSpaces = Array.from(inputSource.hand.values());
                    let allValid = true;
                    // @ts-ignore
                    allValid && (allValid = frame.fillPoses(jointSpaces, inputSource.targetRaySpace, this[P_ACTION_RECORDER].jointTransforms));
                    // @ts-ignore
                    allValid && (allValid = frame.fillJointRadii(jointSpaces, this[P_ACTION_RECORDER].jointRadii));
                    if (allValid) {
                        const hand = {};
                        for (let offset = 0; offset < 25; offset++) {
                            const jointMatrix = this[P_ACTION_RECORDER].jointTransforms.slice(offset * 16, (offset + 1) * 16);
                            const radius = this[P_ACTION_RECORDER].jointRadii[offset];
                            const position = getTranslation(create$4(), jointMatrix);
                            const quaternion = getRotation(create$2(), jointMatrix);
                            const jointName = jointSpaces[offset].jointName;
                            hand[jointName] = { position, quaternion, radius };
                        }
                        inputFrame.hand = hand;
                    }
                }
                if (schema.hasGamepad) {
                    const gamepad = {
                        buttons: inputSource.gamepad.buttons.map((button) => button
                            ? [button.pressed ? 1 : 0, button.touched ? 1 : 0, button.value]
                            : null),
                        axes: Array.from(inputSource.gamepad.axes),
                    };
                    inputFrame.gamepad = gamepad;
                }
                actionFrame.inputFrames.push(inputFrame);
            }
        });
        this[P_ACTION_RECORDER].compressedFrames.push(this.compressActionFrame(actionFrame));
    }
    compressActionFrame(af) {
        const out = [
            Math.round(af.timeStamp * 10) / 10,
            ...compress(af.position),
            ...compress(af.quaternion),
        ];
        af.inputFrames.forEach((inputFrame) => {
            const index = inputFrame.index;
            const schema = this[P_ACTION_RECORDER].schemaMap.get(index);
            const inputOut = [
                index,
                ...compress(inputFrame.targetRayTransform.position),
                ...compress(inputFrame.targetRayTransform.quaternion),
            ];
            if (schema.hasGrip) {
                inputOut.push([
                    ...compress(inputFrame.gripTransform.position),
                    ...compress(inputFrame.gripTransform.quaternion),
                ]);
            }
            if (schema.hasHand) {
                const handArr = [];
                Object.values(inputFrame.hand).forEach(({ position, quaternion, radius }) => {
                    handArr.push(...compress(position), ...compress(quaternion), parseFloat(radius.toFixed(3)));
                });
                inputOut.push(handArr);
            }
            if (schema.hasGamepad) {
                inputOut.push([
                    ...inputFrame.gamepad.buttons,
                    ...inputFrame.gamepad.axes,
                ]);
            }
            out.push(inputOut);
        });
        return out;
    }
    log() {
        const out = {
            schema: Array.from(this[P_ACTION_RECORDER].schemaMap.entries()),
            frames: this[P_ACTION_RECORDER].compressedFrames,
        };
        console.log(JSON.stringify(out));
    }
}

window.iwer = {
    XRDevice, XRSystem, XRSession, XRFrame, XRSpace, XRReferenceSpace,
    XRView, XRViewport, XRRigidTransform, XRPose, XRViewerPose,
    XRInputSource, XRWebGLLayer, XRReferenceSpaceEvent, XRSessionEvent,
    XRHitTestResult
};

/**
 * End IWER Library - Begin IWER ARKit Bridge
 * IWER - Immersive Web Emulation Runtime
 * Bundled with iOS ARKit Bridge
 */

// --- 1. WebGL Context Force Configuration ---
(function () {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
            attributes = attributes || {};
            attributes.alpha = true;
            attributes.desynchronized = true;
            attributes.preserveDrawingBuffer = false;
            attributes.xrCompatible = true;
        }
        return originalGetContext.call(this, type, attributes);
    };
})();

// Monkey patch XRSession.requestHitTestSource to bypass IWER SEM checks
XRSession.prototype.requestHitTestSource = function (options) {
    return Promise.resolve({
        _isNativeCompatible: true,
        cancel: () => {
        }
    });
};

const originalGetViewerPose = XRFrame.prototype.getViewerPose;

XRFrame.prototype.getViewerPose = function (refSpace) {
    // 1. Call original implementation
    const pose = originalGetViewerPose.call(this, refSpace);
    if (!pose) return null;

    // 2. Fix: Get the session from the Frame, not the View
    const session = this.session;

    // 3. Force Monoscopic if currently Stereo (2 views)
    if (pose.views.length === 2) {

        // We use the Left projection matrix. 
        // Since device.stereoEnabled = false in the bridge, this matrix 
        // already has the correct full-screen aspect ratio.
        let projMat = pose.views[0].projectionMatrix;

        // Optional: Inject latest native ARKit matrix if available
        if (window.NativeARData && window.NativeARData.projection_camera) {
            projMat = new Float32Array(window.NativeARData.projection_camera);
        }

        // 4. Create single view ('none') associated with the correct session
        const monoView = new XRView('none', projMat, pose.transform, session);

        // 5. Return new pose with single view
        return new XRViewerPose(pose.transform, [monoView], pose.emulatedPosition);
    }

    return pose;
};

// --- 2. ARKit Bridge for IWER ---
(function () {
    console.log("[Bridge] Initializing IWER ARKit Bridge...");

    if (!window.iwer) {
        console.error("[Bridge] IWER library not found.");
        return;
    }

    const { XRDevice, XRSpace, XRHitTestResult, XRFrame, XRSession } = window.iwer;

    // --- Math Helpers ---
    function decomposeMatrix(m) {
        if (!m || m.length < 16) return null;
        const px = m[12], py = m[13], pz = m[14];

        const m00 = m[0], m01 = m[1], m02 = m[2];
        const m10 = m[4], m11 = m[5], m12 = m[6];
        const m20 = m[8], m21 = m[9], m22 = m[10];

        const trace = m00 + m11 + m22;
        let S = 0, qx = 0, qy = 0, qz = 0, qw = 1;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            qw = 0.25 * S;
            qx = (m12 - m21) / S;
            qy = (m20 - m02) / S;
            qz = (m01 - m10) / S;
        } else if ((m00 > m11) && (m00 > m22)) {
            S = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
            qw = (m12 - m21) / S;
            qx = 0.25 * S;
            qy = (m01 + m10) / S;
            qz = (m02 + m20) / S;
        } else if (m11 > m22) {
            S = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
            qw = (m20 - m02) / S;
            qx = (m01 + m10) / S;
            qy = 0.25 * S;
            qz = (m12 + m21) / S;
        } else {
            S = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
            qw = (m01 - m10) / S;
            qx = (m02 + m20) / S;
            qy = (m12 + m21) / S;
            qz = 0.25 * S;
        }
        return {
            position: { x: px, y: py, z: pz },
            quaternion: { x: qx, y: qy, z: qz, w: qw }
        };
    }

    function applyQuat(v, q) {
        const x = v.x, y = v.y, z = v.z;
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        return {
            x: ix * qw + iw * -qx + iy * -qz - iz * -qy,
            y: iy * qw + iw * -qy + iz * -qx - ix * -qz,
            z: iz * qw + iw * -qz + ix * -qy - iy * -qx
        };
    }

    function setQuatFromUnitVectors(from, to) {
        const EPS = 0.000001;
        let r = from.x * to.x + from.y * to.y + from.z * to.z;

        if (r < -1 + EPS) {
            return { x: 0, y: 1, z: 0, w: 0 };
        } else {
            const s = Math.sqrt(2 * (1 + r));
            const x = (from.y * to.z - from.z * to.y) / s;
            const y = (from.z * to.x - from.x * to.z) / s;
            const z = (from.x * to.y - from.y * to.x) / s;
            const w = 0.5 * s;
            return { x, y, z, w };
        }
    }

    function getFovyFromProjection(m) {
        if (!m || m[5] === 0) return Math.PI / 2;
        return 2 * Math.atan(1 / m[5]);
    }

    // --- Device Definition ---

    class ARKitXRDevice extends XRDevice {
        constructor() {
            super({
                name: 'ARKit Device',
                controllerConfig: {
                    profileId: '',
                    fallbackProfileIds: [],
                    layout: {
                        // 'none' handedness is used for the Viewer/Screen
                        none: {
                            gamepad: { mapping: 'xr-standard', buttons: [{ id: 'trigger', type: 'analog', eventTrigger: 'select' }], axes: [] },
                            numHapticActuators: 0
                        },
                        left: null,
                        right: null
                    }
                },
                supportedSessionModes: ['inline', 'immersive-ar'],
                internalNominalFrameRate: 60,
                supportedFeatures: [
                    'viewer', 'local', 'local-floor', 'bounded-floor',
                    'hit-test', 'dom-overlay', 'anchors', 'plane-detection'
                ],
                isSystemKeyboardSupported: false,
                environmentBlendModes: {
                    'immersive-ar': 'alpha-blend',
                    'inline': 'opaque'
                },
                interactionMode: 'screen-space',
                userAgent: navigator.userAgent || 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
                // probably not needed after mono view fix
                ipd: 0,
                headsetPosition: new Vector3(0, 0, 0),
            });
            this.nativeHitTestResults = [];
        }
    }

    const device = new ARKitXRDevice();

    device.canvasContainer.style.zIndex = '-1';

    if (device.controllers && device.controllers.none) {
        Object.defineProperty(device.controllers.none.inputSource, 'targetRayMode', {
            get: () => 'screen',
            configurable: true
        });
    }

    device.installRuntime();
    console.log("[Bridge] IWER Runtime Installed");

    const originalRequestHitTestSource = XRSession.prototype.requestHitTestSource;
    XRSession.prototype.requestHitTestSource = function (options) {
        return originalRequestHitTestSource.call(this, options).then(source => {
            source._isNativeCompatible = true;
            return source;
        });
    };

    // 2. Override getHitTestResults to return data from ARKit
    XRFrame.prototype.getHitTestResults = function (hitTestSource) {
        if (!hitTestSource._isNativeCompatible) return [];
        const globalSpace = device.globalSpace;

        if (device.nativeHitTestResults && device.nativeHitTestResults.length > 0) {
            return device.nativeHitTestResults.map(hit => {
                // 'hit.world_transform' comes as array [16] column-major
                const matrix = new Float32Array(hit.world_transform);
                // Create an IWER XRSpace from the global space + offset matrix
                const offsetSpace = new XRSpace(globalSpace, matrix);
                return new XRHitTestResult(this, offsetSpace);
            });
        }
        return [];
    };

    // --- Input Tracking ---

    let touchState = { active: false, x: 0, y: 0 };
    // Counter to ensure we have a valid 0 -> 1 transition for the trigger
    let touchActiveFrames = 0;
    let framesSinceRelease = 100;

    function updateTouch(e, type) {
        const isActive = (type === 'start' || type === 'move');
        touchState.active = isActive;

        const touchList = isActive ? e.touches : e.changedTouches;

        if (touchList && touchList.length > 0) {
            touchState.x = touchList[0].clientX;
            touchState.y = touchList[0].clientY;
        }

        if (isActive) {
            framesSinceRelease = 0;
        } else {
            // Reset active frames immediately on release
            touchActiveFrames = 0;
        }
    }

    window.addEventListener('touchstart', (e) => updateTouch(e, 'start'), { passive: false });
    window.addEventListener('touchmove', (e) => updateTouch(e, 'move'), { passive: false });
    window.addEventListener('touchend', (e) => updateTouch(e, 'end'), { passive: false });

    // --- Driver Loop ---
    let camPos = { x: 0, y: 0, z: 0 };
    let camQuat = { x: 0, y: 0, z: 0, w: 1 };

    window.updateNativeHitTestResults = function (results) {
        device.nativeHitTestResults = results || [];
    };

    function arKitDriverLoop() {
        requestAnimationFrame(arKitDriverLoop);

        // This ensures Viewer Space hit tests (Reticles) stay centered.
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.hitTest) {
            window.webkit.messageHandlers.hitTest.postMessage({
                x: 0.5,
                y: 0.5,
                callback: "updateNativeHitTestResults"
            });
        }

        if (!window.NativeARData) return;

        // 2. Update Camera/Headset Pose
        const camMat = window.NativeARData.camera_transform;
        const projMat = window.NativeARData.projection_camera;

        if (camMat) {
            const pose = decomposeMatrix(camMat);
            if (pose) {
                camPos = pose.position;
                camQuat = pose.quaternion;
                device.position.set(camPos.x, camPos.y, camPos.z);
                device.quaternion.set(camQuat.x, camQuat.y, camQuat.z, camQuat.w);
            }
        }

        if (projMat) {
            const fovy = getFovyFromProjection(projMat);
            if (!isNaN(fovy)) device.fovy = fovy;
        }

        // 3. Input Processing (Controller follows Finger)
        if (device.controllers && device.controllers.none) {

            if (touchState.active) {
                touchActiveFrames++;
            }

            // Keep connected while touching or for a few frames after release 
            // (allows 'selectend' event to process before controller disappears)
            const isConnected = touchState.active || (framesSinceRelease < 1);
            device.controllers.none.connected = isConnected;

            // Position: Always align with camera origin
            device.controllers.none.position.set(
                camPos.x,
                camPos.y,
                camPos.z
            );

            // Trigger Logic: Force 0.0 for first 2 frames of touch to guarantee 
            // Three.js registers the transition from 0 -> 1 (firing selectstart).
            let triggerVal = 0.0;
            if (touchState.active && touchActiveFrames > 2) {
                triggerVal = 1.0;
            }

            device.controllers.none.updateButtonValue('trigger', triggerVal);
            device.controllers.none.updateButtonTouch('trigger', touchState.active);

            // Orientation: Raycast from the specific Touch Coordinates
            if (isConnected && projMat && touchState.active) {
                const oneOverScaleX = 1.0 / projMat[0];
                const oneOverScaleY = 1.0 / projMat[5];

                // Map screen pixels to Normalized Device Coordinates (-1 to 1)
                const ndcX = (touchState.x / window.innerWidth) * 2.0 - 1.0;
                const ndcY = 1.0 - (touchState.y / window.innerHeight) * 2.0;

                const rayLocal = {
                    x: ndcX * oneOverScaleX,
                    y: ndcY * oneOverScaleY,
                    z: -1.0
                };

                const len = Math.sqrt(rayLocal.x * rayLocal.x + rayLocal.y * rayLocal.y + rayLocal.z * rayLocal.z);
                if (len > 0.0001) {
                    rayLocal.x /= len;
                    rayLocal.y /= len;
                    rayLocal.z /= len;

                    const rayWorld = applyQuat(rayLocal, camQuat);
                    const ctrlQuat = setQuatFromUnitVectors({ x: 0, y: 0, z: -1 }, rayWorld);

                    device.controllers.none.quaternion.set(ctrlQuat.x, ctrlQuat.y, ctrlQuat.z, ctrlQuat.w);
                }
            } else if (isConnected) {
                // If connected but not actively touching (released frame window),
                // keep previous orientation or fallback to camera forward.
                // We leave it as-is to prevent "snapping back" artifacts during the release frames.
            }
        }

        if (!touchState.active) {
            framesSinceRelease++;
        }
    }

    console.log("[Bridge] Starting ARKit Driver Loop");
    requestAnimationFrame(arKitDriverLoop);

    // --- Session Request Hook ---

    const originalRequestSession = navigator.xr.requestSession.bind(navigator.xr);
    navigator.xr.requestSession = async (mode, options) => {
        console.log(`[Bridge] navigator.xr.requestSession called. Mode: ${mode}`);

        if (mode === 'immersive-ar') {
            console.log("[Bridge] immersive-ar detected. initiating native handshake...");
            await new Promise((resolve) => {
                const callbackName = "onARStart_" + Math.random().toString(36).substr(2);
                console.log(`[Bridge] Creating callback: ${callbackName}`);

                window[callbackName] = () => {
                    console.log("[Bridge] Native AR Start Confirmed (Callback triggered).");
                    delete window[callbackName];
                    resolve();
                };

                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.requestSession) {
                    console.log("[Bridge] Posting 'requestSession' message to Native...");

                    let safeOptions = options || {};

                    if (safeOptions.domOverlay && safeOptions.domOverlay.root) {
                        // Create shallow copy to avoid mutating the original object passed by the web app
                        safeOptions = Object.assign({}, safeOptions);
                        safeOptions.domOverlay = Object.assign({}, safeOptions.domOverlay);
                        delete safeOptions.domOverlay.root;
                    }

                    window.webkit.messageHandlers.requestSession.postMessage({
                        options: safeOptions,
                        data_callback: "onNativeDataUpdate",
                        callback: callbackName
                    });
                } else {
                    console.error("[Bridge] Error: WebKit MessageHandler missing or requestSession handler not found");
                    resolve();
                }
            });
            console.log("[Bridge] Handshake complete. Setting background transparent.");

            document.body.style.background = 'transparent';
            if (document.documentElement) {
                document.documentElement.style.background = 'transparent';
            }

            if (options && options.domOverlay && options.domOverlay.root) {
                options.domOverlay.root.style.background = 'transparent';
            }
        } else {
            console.log(`[Bridge] Mode is ${mode}, skipping native handshake.`);
        }

        console.log("[Bridge] Calling original IWER requestSession...");
        return originalRequestSession(mode, options);
    };
})();