package org.sejudev.game.shader;

import org.lwjgl.opengl.GL20;
import org.sejudev.game.Game;
import org.sejudev.game.world.landscape.Landscape;

public class LightingShader extends Shader {

	public LightingShader() {
		super("/shaders/lighting");
	}
	
	public void setUpUniforms() {
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "sunX"), Landscape.sunPos.x);
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "sunY"), Landscape.sunPos.y);
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "sunZ"), Landscape.sunPos.z);
		
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "camX"), Game.i.camera.x);
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "camY"), Game.i.camera.y);
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "camZ"), Game.i.camera.z);
	}
}
