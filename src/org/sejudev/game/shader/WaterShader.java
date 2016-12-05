package org.sejudev.game.shader;

import org.lwjgl.opengl.GL20;
import org.sejudev.game.Game;
import org.sejudev.game.world.landscape.Landscape;

public class WaterShader extends Shader {

	public WaterShader() {
		super("/shaders/water");
	}
	
	public void setUpUniforms() {
		GL20.glUniform1i(GL20.glGetUniformLocation(getProgram(), "time"), (int) Game.time);
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "sunX"), Landscape.sunPos.x);
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "sunY"), Landscape.sunPos.y);
		GL20.glUniform1f(GL20.glGetUniformLocation(getProgram(), "sunZ"), Landscape.sunPos.z);
	}
}
