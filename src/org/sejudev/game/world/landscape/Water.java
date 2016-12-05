package org.sejudev.game.world.landscape;

import org.lwjgl.opengl.GL11;
import org.sejudev.game.Game;
import org.sejudev.game.graphics.VertexArray;
import org.sejudev.game.shader.Shader;
import org.sejudev.game.util.Camera;
import org.sejudev.game.world.Noise;

public class Water {

	public static void renderWater(float renderDistance, float res) {
		Shader.water.enable();
		Camera c = Game.i.camera;
		VertexArray.start();
		for (float x = (int) ((c.x - renderDistance) / res) * res; x < (int) ((c.x + renderDistance) / res) * res; x += res) {
			for (float z = (int) ((c.z - renderDistance) / res) * res; z < (int) ((c.z + renderDistance) / res) * res; z += res) {
				float waterHeight = 0.5f;
				VertexArray.vertex(x, (float) Math.sin((x) / 5.0f + (z) / 5.0f + Game.time / 50.0f) * waterHeight, z);
				VertexArray.color(0, 0, 1 + (float) Noise.noise(x / Floor.scale, 0, z / Floor.scale));
				VertexArray.normal(0, 1, 0);
				VertexArray.vertex(x, (float) Math.sin((x) / 5.0f + (z + res) / 5.0f + Game.time / 50.0f) * waterHeight, z + res);
				VertexArray.color(0, 0, 1 + (float) Noise.noise(x / Floor.scale, 0, (z + res) / Floor.scale));
				VertexArray.normal(0, 1, 0);
				VertexArray.vertex(x + res, (float) Math.sin((x + res) / 5.0f + (z + res) / 5.0f + Game.time / 50.0f) * waterHeight, z + res);
				VertexArray.color(0, 0, 1 + (float) Noise.noise((x + res) / Floor.scale, 0, (z + res) / Floor.scale));
				VertexArray.normal(0, 1, 0);
				VertexArray.vertex(x + res, (float) Math.sin((x + res) / 5.0f + (z) / 5.0f + Game.time / 50.0f) * waterHeight, z);
				VertexArray.color(0, 0, 1 + (float) Noise.noise((x + res) / Floor.scale, 0, z / Floor.scale));
				VertexArray.normal(0, 1, 0);
			}
		}
		VertexArray.render(GL11.GL_QUADS);
		Shader.water.disable();
	}
}
