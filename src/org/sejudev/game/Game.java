package org.sejudev.game;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;

import org.lwjgl.LWJGLException;
import org.lwjgl.input.Keyboard;
import org.lwjgl.input.Mouse;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;
import org.lwjgl.opengl.GL11;
import org.sejudev.game.shader.Shader;
import org.sejudev.game.util.Camera;
import org.sejudev.game.util.Delta;
import org.sejudev.game.world.World;

public class Game {

	public static Game i = new Game();

	public static float time;

	public static final float FOV = 90;
	public static final float ZNEAR = 0.1f;
	public static final float ZFAR = 3000.0f;

	private boolean running;

	public Camera camera;
	private World world;

	public static void main(String[] args) {
		i.start();
	}

	public void init() {
		try {
			Display.setDisplayMode(new DisplayMode(1280, 720));
			Display.setTitle("Surf Game");
			Display.setResizable(true);
			Display.setVSyncEnabled(true);
			Display.create();
			Mouse.create();
			Keyboard.create();
		} catch (LWJGLException e) {
			e.printStackTrace();
		}

		GL11.glEnable(GL11.GL_DEPTH_TEST);
		GL11.glEnable(GL11.GL_CULL_FACE);
		GL11.glEnable(GL11.GL_BLEND);
		GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);
		GL11.glShadeModel(GL11.GL_SMOOTH);

		Shader.init();

		camera = new Camera();
		camera.setUpDisplay(FOV, ZNEAR, ZFAR);

		world = new World();
	}
	

	public void cleanup() {
		Display.destroy();
		Mouse.destroy();
		Keyboard.destroy();
	}

	public void start() {
		PrintStream out;
		try {
			out = new PrintStream(new File("log.txt"));
			System.setErr(out);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		if(running) {
			return;
		}
		running = true;
		init();
		run();
	}

	public void stop() {
		if(!running) {
			return;
		}
		running = false;
		cleanup();
		System.exit(0);
	}

	public void run() {
		while(running) {
			update();
			render();

			Display.update();
			if(Display.isCloseRequested()) stop();
			if(Display.wasResized()) camera.setUpDisplay(FOV, ZNEAR, ZFAR);
		}
	}

	private boolean wireframe = false;
	private boolean playerMode = false;

	public void update() {
		Delta.tick();
		Game.time += Delta.getDelta();
		if(playerMode) camera.playerUpdate();
		else
			camera.debugUpdate();
		world.update();
		while(Mouse.next()) {
			if(Mouse.getEventButtonState()) {
				if(Mouse.getEventButton() == 0) {
					wireframe = !wireframe;
				}
			}
		}
		while(Keyboard.next()) {
			if(Keyboard.getEventKeyState()) {
				if(Keyboard.getEventKey() == Keyboard.KEY_TAB) {
					playerMode = !playerMode;
				}
			}
		}
	}

	public void render() {
		GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_DEPTH_BUFFER_BIT);
		GL11.glLoadIdentity();
		GL11.glPushMatrix();
		GL11.glPolygonMode(GL11.GL_FRONT_AND_BACK, wireframe ? GL11.GL_LINE : GL11.GL_FILL);
		camera.setUpMatrix();
		world.render();
		GL11.glPopMatrix();
	}
}
