package org.sejudev.game.util;

import org.sejudev.game.graphics.VertexArray;

public class Vec3 {
	
	public float x;
	public float y;
	public float z;
	
	public Vec3() {
		
	}
	
	public Vec3(float x, float y, float z) {
		set(x, y, z);
	}
	
	public void set(float x, float y, float z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	public Vec3 normalize() {
		float t = (float) Math.sqrt(Math.abs(x * x) + Math.abs(y * y) + Math.abs(z * z));
		x /= t;
		y /= t;
		z /= t;
		return this;
	}
	
	public static Vec3 getSurfaceNormal(Vec3 p1, Vec3 p2, Vec3 p3) {
		Vec3 u = new Vec3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
		Vec3 v = new Vec3(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z);
		
		Vec3 normal = new Vec3(0, 0, 0);
        normal.x = (u.y * v.z) - (u.z * v.y);
        normal.y = (u.z * v.x) - (u.x * v.z);
        normal.z = (u.x * v.y) - (u.y * v.x);
        normal.normalize();
        return normal;
	}

	public void toGlVertex() {
		VertexArray.vertex(x, y, z);
	}

	public void toGlNormal() {
		VertexArray.normal(x, y, z);
	}
}
