package org.sejudev.game.world.landscape;

import org.lwjgl.input.Mouse;
import org.sejudev.game.util.Vec3;

public class Landscape {
	
	public static Vec3 sunPos = new Vec3(1, 1, 1);
	
	private static float sunRot = 45;
	
	public static float lod = 1.5f;

	public static void update() {
		sunRot += Mouse.getDWheel() * 0.001f;
		sunRot += 0.001f;
		sunPos.set((float) Math.cos(sunRot), (float) Math.sin(sunRot), (float) Math.cos(sunRot));
	}
	
	public static void render() {
		float renderDistance = 50;
		Sky.renderSky(renderDistance);
		Floor.renderFloor(renderDistance, lod * 2);
		Water.renderWater(renderDistance, lod * 2);
	}
}
