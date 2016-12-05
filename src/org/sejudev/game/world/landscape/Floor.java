package org.sejudev.game.world.landscape;

import java.util.HashMap;
import java.util.Map;

import org.lwjgl.opengl.GL11;
import org.sejudev.game.Game;
import org.sejudev.game.graphics.VertexArray;
import org.sejudev.game.shader.Shader;
import org.sejudev.game.util.Camera;
import org.sejudev.game.util.Vec3;
import org.sejudev.game.world.Noise;

public class Floor {
	
	public static Map<String, Float> heights = new HashMap<String, Float>();
	
	public static void renderFloor(float renderDistance, float lod) {
		Shader.light.enable();
		Camera c = Game.i.camera;
		VertexArray.start();
		for(float x = (int) ((c.x - renderDistance) / lod) * lod; x < (int) ((c.x + renderDistance) / lod) * lod; x += lod) {
			for(float z = (int) ((c.z - renderDistance) / lod) * lod; z < (int) ((c.z + renderDistance) / lod) * lod; z += lod) {
				renderQuad(x, z, lod);
			}
		}
		VertexArray.render(GL11.GL_QUADS);
		Shader.light.disable();
	}
	
	public static float scale = 20;
	public static float maxdiff = 15;
	
	private static void renderQuad(float x, float z, float lod) {
		float col = (float) Noise.noise(x / scale, 10, z / scale) / 10.0f;
		Vec3 p1 = new Vec3(x, getHeight(x, z), z);
		Vec3 p2 = new Vec3(x, getHeight(x, z + lod), z + lod);
		Vec3 p3 = new Vec3(x + lod, getHeight(x + lod, z + lod), z + lod);
		Vec3 p4 = new Vec3(x + lod, getHeight(x + lod, z), z);
		
		getSmoothNormal(p1.x, p1.y, p1.z, lod / 100.0f).toGlNormal();
		VertexArray.color(0.2f - col, 0.5f - col, 0.01f - col);
		p1.toGlVertex();
		getSmoothNormal(p2.x, p2.y, p2.z, lod / 100.0f).toGlNormal();
		col = (float) Noise.noise(x / scale, 10, (z + lod) / scale) / 10.0f;
		VertexArray.color(0.2f - col, 0.5f - col, 0.01f - col);
		p2.toGlVertex();
		getSmoothNormal(p3.x, p3.y, p3.z, lod / 100.0f).toGlNormal();
		col = (float) Noise.noise((x + lod) / scale, 10, (z + lod) / scale) / 10.0f;
		VertexArray.color(0.2f - col, 0.5f - col, 0.01f - col);
		p3.toGlVertex();
		getSmoothNormal(p4.x, p4.y, p4.z, lod / 100.0f).toGlNormal();
		col = (float) Noise.noise((x + lod) / scale, 10, z / scale) / 10.0f;
		VertexArray.color(0.2f - col, 0.5f - col, 0.01f - col);
		p4.toGlVertex();
	}
	
	public static Vec3 getSmoothNormal(float x, float y, float z, float lod) {
		Vec3 p1 = new Vec3(x - lod, getHeight(x - lod, z - lod), z - lod);
		Vec3 p2 = new Vec3(x - lod, getHeight(x - lod, z + lod), z + lod);
		Vec3 p3 = new Vec3(x + lod, getHeight(x + lod, z + lod), z + lod);
		return Vec3.getSurfaceNormal(p1, p2, p3);
	}
	
	public static float getHeight(float x, float z) {
		if(!heights.containsKey(x + ";" + z)) return (float) Noise.noise(x / scale, 0, z / scale) * maxdiff;
		else return heights.get(x + ";" + z) + (float) Noise.noise(x / scale, 0, z / scale) * maxdiff;
	}

	public static void addHeight(float x, float z, float f) {
		float b = 0;
		if(heights.containsKey(x + ";" + z)) {
			b = heights.get(x + ";" + z);
			heights.remove(x + ";" + z);
		}
		heights.put(x + ";" + z, f + b);
	}
}
