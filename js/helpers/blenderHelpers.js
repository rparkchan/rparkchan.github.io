function skinMats(materials) {
	materials.forEach(function (material) {
		material.skinning = true;
		material.shading = THREE.SmoothShading;
	});
}

function createSkeletalMixer(mesh, mixers, target_animation) {
	var mixer = new THREE.AnimationMixer( mesh )
  mesh.geometry.animations.forEach( function ( animation ){
    if(animation.name == target_animation){
      mixer.clipAction( animation ).play();
      mixers.push( mixer );
    }
  });
}