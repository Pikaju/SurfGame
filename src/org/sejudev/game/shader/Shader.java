package org.sejudev.game.shader;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL20;

public class Shader {
	
	public static Shader water;
	public static Shader light;
	public static Shader sky;
	
	private int shaderProgram;
	
	public static void init() {
		water = new WaterShader();
		light = new LightingShader();
		sky = new SkyShader();
	}
	
	public Shader(String path) {
		BufferedReader reader = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(path + ".vert")));
		String line = "";
		String vertexShaderSource = "";
		try {
			while((line = reader.readLine()) != null) {
				vertexShaderSource += line + "\n";
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		reader = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(path + ".frag")));
		String fragmentShaderSource = "";
		try {
			while((line = reader.readLine()) != null) {
				fragmentShaderSource += line + "\n";
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		int vertexShaderProgram = GL20.glCreateShader(GL20.GL_VERTEX_SHADER);
		int fragmentShaderProgram = GL20.glCreateShader(GL20.GL_FRAGMENT_SHADER);
		
		GL20.glShaderSource(vertexShaderProgram, vertexShaderSource);
		GL20.glShaderSource(fragmentShaderProgram, fragmentShaderSource);
		
		GL20.glCompileShader(vertexShaderProgram);
		GL20.glCompileShader(fragmentShaderProgram);
		
		if(GL20.glGetShaderi(vertexShaderProgram, GL20.GL_COMPILE_STATUS) == GL11.GL_FALSE) {
			System.err.println("Vertex shader " + path + " wasn't compiled correctly.");
			System.err.println(GL20.glGetShaderInfoLog(vertexShaderProgram, 1024));
		}
		
		if(GL20.glGetShaderi(fragmentShaderProgram, GL20.GL_COMPILE_STATUS) == GL11.GL_FALSE) {
			System.err.println("Fragment shader " + path + " wasn't compiled correctly.");
			System.err.println(GL20.glGetShaderInfoLog(fragmentShaderProgram, 1024));
		}
		
		shaderProgram = GL20.glCreateProgram();
		
		GL20.glAttachShader(shaderProgram, vertexShaderProgram);
		GL20.glAttachShader(shaderProgram, fragmentShaderProgram);
		
		GL20.glLinkProgram(shaderProgram);
		GL20.glValidateProgram(shaderProgram);
	}
	
	public void setUpUniforms() {
		
	}
	
	public void setUniformf(int loc, float f) {
		GL20.glUniform1f(loc, f);
	}
	
	public void setUniformi(int loc, int i) {
		GL20.glUniform1f(loc, i);
	}
	
	public int getUniform(String name) {
		return GL20.glGetUniformLocation(getProgram(), name);
	}
	
	public void enable() {
		GL20.glUseProgram(shaderProgram);
		setUpUniforms();
	}
	
	public void disable() {
		GL20.glUseProgram(0);
	}
	
	public int getProgram() {
		return shaderProgram;
	}
}
