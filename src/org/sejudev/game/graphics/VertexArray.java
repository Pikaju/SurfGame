package org.sejudev.game.graphics;

import java.nio.FloatBuffer;
import java.util.ArrayList;
import java.util.List;

import org.lwjgl.BufferUtils;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL15;

public class VertexArray {
	
	public static List<Float> verticies = new ArrayList<Float>();
	public static List<Float> colors = new ArrayList<Float>();
	public static List<Float> normals = new ArrayList<Float>();
	
	private static int vertexHandle;
	private static int colorHandle;
	private static int normalHandle;
	
	public static void start() {
		if(vertexHandle == 0) {
			vertexHandle = GL15.glGenBuffers();
			colorHandle = GL15.glGenBuffers();
			normalHandle = GL15.glGenBuffers();
		}
		verticies.clear();
		colors.clear();
		normals.clear();
	}
	
	public static void vertex(float x, float y, float z) {
		verticies.add(x);
		verticies.add(y);
		verticies.add(z);
	}
	
	public static void color(float r, float g, float b) {
		colors.add(r);
		colors.add(g);
		colors.add(b);
	}
	
	public static void normal(float x, float y, float z) {
		normals.add(x);
		normals.add(y);
		normals.add(z);
	}
	
	public static void refill() {
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, vertexHandle);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, asBuffer(verticies), GL15.GL_STREAM_DRAW);
		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, colorHandle);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, asBuffer(colors), GL15.GL_STREAM_DRAW);
		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, normalHandle);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, asBuffer(normals), GL15.GL_STREAM_DRAW);
		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, 0);
	}
	
	public static void render(int mode) {
		refill();
		GL11.glEnableClientState(GL11.GL_VERTEX_ARRAY);
		GL11.glEnableClientState(GL11.GL_COLOR_ARRAY);
		GL11.glEnableClientState(GL11.GL_NORMAL_ARRAY);
		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, vertexHandle);
		GL11.glVertexPointer(3, GL11.GL_FLOAT, 0, 0);
		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, colorHandle);
		GL11.glColorPointer(3, GL11.GL_FLOAT, 0, 0);
		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, normalHandle);
		GL11.glNormalPointer(GL11.GL_FLOAT, 0, 0);
		
		GL11.glDrawArrays(mode, 0, verticies.size() / 3);
		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, 0);
		
		GL11.glDisableClientState(GL11.GL_VERTEX_ARRAY);
		GL11.glDisableClientState(GL11.GL_COLOR_ARRAY);
		GL11.glDisableClientState(GL11.GL_NORMAL_ARRAY);
	}
	
	public static FloatBuffer asBuffer(List<Float> list) {
		FloatBuffer buffer = BufferUtils.createFloatBuffer(list.size());
		for(float f : list) {
			buffer.put(f);
		}
		buffer.flip();
		return buffer;
	}
}
