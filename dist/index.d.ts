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
export declare function loadShader(gl: WebGL2RenderingContext, shaderSource: string, shaderType: number): WebGLShader;
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
export declare function createProgram(gl: WebGL2RenderingContext, shaders: WebGLShader[], attribs?: string[], locations?: number[]): WebGLProgram;
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
export declare function createProgramFromScripts(gl: WebGL2RenderingContext, shaderScriptIds: string[], attribs?: string[], locations?: number[]): WebGLProgram;
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
export declare function createProgramFromSources(gl: WebGL2RenderingContext, shaderSources: string[], attribs?: string[], locations?: number[]): WebGLProgram;
/**
 * Resize a canvas to match the size its displayed.
 * @param canvas - The canvas to resize.
 * @param multiplier - amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @returns true if the canvas was resized.
 */
export declare function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier?: number): boolean;
