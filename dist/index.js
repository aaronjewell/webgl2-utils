/*
 * Original work Copyright 2012, Gregg Tavares.
 * Modified work Copyright 2021, Aaron Jewell.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * Loads a shader.
 *
 * @param gl - The WebGLRenderingContext to use.
 * @param shaderSource - The shader source.
 * @param shaderType - The type of shader.
 * @returns The created shader.
 *
 * @throws Error
 */
export function loadShader(gl, shaderSource, shaderType) {
    if (shaderType !== WebGL2RenderingContext.VERTEX_SHADER &&
        shaderType !== WebGL2RenderingContext.FRAGMENT_SHADER) {
        throw `Type must be either WebGL2RenderingContext.VERTEX_SHADER or WebGL2RenderingContext.FRAGMENT_SHADER, given ${shaderType}`;
    }
    // Create the shader object
    const shader = gl.createShader(shaderType);
    if (shader === null) {
        throw "Error creating shader";
    }
    // Load the shader source
    gl.shaderSource(shader, shaderSource);
    // Compile the shader
    gl.compileShader(shader);
    // Check the compile status
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        // Something went wrong during compilation; get the error
        const lastError = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw `Error compiling shader: ${lastError}`;
    }
    return shader;
}
/**
 * Creates a program, attaches shaders, binds attrib locations, links the
 * program and calls useProgram.
 *
 * @param gl - The WebGL context
 * @param shaders - The shaders to attach
 * @param attribs - An array of attribs names. Locations will be assigned by index if not passed in
 * @param locations - The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @returns The created program.
 *
 * @throws Error
 */
export function createProgram(gl, shaders, attribs, locations) {
    const program = gl.createProgram();
    if (program === null) {
        throw "Failed to create program";
    }
    shaders.forEach(function (shader) {
        gl.attachShader(program, shader);
    });
    if (attribs) {
        attribs.forEach(function (attrib, ndx) {
            gl.bindAttribLocation(program, locations ? locations[ndx] : ndx, attrib);
        });
    }
    gl.linkProgram(program);
    // Check the link status
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        // something went wrong with the link
        const lastError = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw `Error in program linking: ${lastError}`;
    }
    return program;
}
/**
 * Loads a shader from a script tag.
 *
 * @param gl - The WebGLRenderingContext to use.
 * @param scriptId - The id of the script tag.
 * @param shaderType - The type of shader. If not passed in it will
 *     be derived from the type of the script tag.
 * @returns The created shader.
 *
 * @throws Error
 */
function createShaderFromScript(gl, scriptId, shaderType) {
    let shaderSource = "";
    const shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
        throw "*** Error: unknown script element" + scriptId;
    }
    shaderSource = shaderScript.text;
    if (!shaderType) {
        if (shaderScript.type === "x-shader/x-vertex") {
            shaderType = gl.VERTEX_SHADER;
        }
        else if (shaderScript.type === "x-shader/x-fragment") {
            shaderType = gl.FRAGMENT_SHADER;
        }
        else if (shaderType !== gl.VERTEX_SHADER &&
            shaderType !== gl.FRAGMENT_SHADER) {
            throw "*** Error: unknown shader type";
        }
    }
    return loadShader(gl, shaderSource, shaderType);
}
const defaultShaderType = [
    WebGL2RenderingContext.VERTEX_SHADER,
    WebGL2RenderingContext.FRAGMENT_SHADER,
];
/**
 * Creates a program from 2 script tags.
 *
 * @param gl - The WebGLRenderingContext to use.
 * @param shaderScriptIds - Array of ids of the script tags for the shaders. The first is assumed to be the
 *        vertex shader, the second the fragment shader.
 * @param attribs - An array of attribs names. Locations will be assigned by index if not passed in
 * @param locations - The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @returns The created program.
 */
export function createProgramFromScripts(gl, shaderScriptIds, attribs, locations) {
    const shaders = [];
    for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
        shaders.push(createShaderFromScript(gl, shaderScriptIds[ii], defaultShaderType[ii]));
    }
    return createProgram(gl, shaders, attribs, locations);
}
/**
 * Creates a program from 2 sources.
 *
 * @param gl - The WebGLRenderingContext
 *        to use.
 * @param shaderSources - Array of sources for the
 *        shaders. The first is assumed to be the vertex shader,
 *        the second the fragment shader.
 * @param attribs - An array of attribs names. Locations will be assigned by index if not passed in
 * @param locations - The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @returns The created program.
 *
 * @throws Error
 */
export function createProgramFromSources(gl, shaderSources, attribs, locations) {
    const shaders = [];
    for (let ii = 0; ii < shaderSources.length; ++ii) {
        shaders.push(loadShader(gl, shaderSources[ii], defaultShaderType[ii]));
    }
    return createProgram(gl, shaders, attribs, locations);
}
/**
 * Resize a canvas to match the size its displayed.
 * @param canvas - The canvas to resize.
 * @param multiplier - amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @returns true if the canvas was resized.
 */
export function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}
