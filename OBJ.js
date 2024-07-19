class OBJ extends cgIShape {
	constructor(verts, norms, uvs) {
		super();

		var i;
		var v=0;
		var n=0;
		var u=0;
		var nverts = verts.length / 3;
		var nfaces = nverts / 3;

		for (i=0; i < nfaces; i++) {
			let vx0 = verts[v++];
            let vy0 = verts[v++];// * -1.0;
            let vz0 = verts[v++];
            let vx1 = verts[v++];
            let vy1 = verts[v++];// * -1.0;
            let vz1 = verts[v++];
            let vx2 = verts[v++];
            let vy2 = verts[v++];// * -1.0;
            let vz2 = verts[v++];

			let nx0 = norms[n++];
			let ny0 = norms[n++];// * -1.0;
			let nz0 = norms[n++];
			let nx1 = norms[n++];
			let ny1 = norms[n++];// * -1.0;
			let nz1 = norms[n++];
			let nx2 = norms[n++];
			let ny2 = norms[n++];// * -1.0;
			let nz2 = norms[n++];

			let u0 = uvs[u++];
			let v0 = uvs[u++];
			let u1 = uvs[u++];
			let v1 = uvs[u++];
			let u2 = uvs[u++];
			let v2 = uvs[u++];
            
            this.addTriangle(vx0, vy0, vz0, vx1, vy1, vz1, vx2, vy2, vz2);
			this.addNormal(nx0, ny0, nz0, nx1, ny1, nz1, nx2, ny2, nz2);
			this.adduv(u0, v0, u1, v1, u2, v2);
		}
	}
}

