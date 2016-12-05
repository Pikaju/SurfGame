package org.sejudev.game.util;

public class Delta {
	
	private static double delta;
	private static long lastTime = System.nanoTime();
	private static long timer;
	private static long frames;
	
	public static void tick() {
		long currentTime = System.nanoTime();
		delta = (currentTime - lastTime) / (1000000000.0 / 60.0);
		timer += currentTime - lastTime;
		lastTime = currentTime;
		frames++;
		
		if(timer >= 1000000000) {
			timer -= 1000000000;
			System.out.println(frames + "fps");
			frames = 0;
		}
	}
	
	public static double getDelta() {
		return delta;
	}
}
