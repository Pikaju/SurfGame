package org.sejudev.game.world.landscape;

import org.lwjgl.opengl.GL11;
import org.lwjgl.util.glu.GLU;
import org.lwjgl.util.glu.Sphere;
import org.sejudev.game.Game;
import org.sejudev.game.shader.Shader;

public class Sky {
	
	private static Sphere sphere = new Sphere();
	private static int list;
	
	public static void renderSky(float renderDistance) {
		if(list == 0) {
			list = GL11.glGenLists(1);
			GL11.glNewList(list, GL11.GL_COMPILE);
			sphere.setOrientation(GLU.GLU_INSIDE);
			sphere.draw(renderDistance * 2, 10, 10);
			GL11.glEndList();
		}
		GL11.glPushMatrix();
		GL11.glLoadIdentity();
		Game.i.camera.applyRotation();
		Shader.sky.enable();
		GL11.glCallList(list);
		Shader.sky.disable();
		GL11.glPopMatrix();
	}
}
