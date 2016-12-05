package org.sejudev.game.world;

import org.sejudev.game.world.landscape.Landscape;

public class World {
	
	public World() {
		
	}
	
	public void update() {
		Landscape.update();
	}
	
	public void render() {
		Landscape.render();
	}
}
